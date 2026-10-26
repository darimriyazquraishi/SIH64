from datetime import datetime, timezone, timedelta
from sqlalchemy import or_, and_, desc, asc
from ..models import db, Complaint, CaseAction, Institution, Bureau, User, AuditEvent, Notification
from .overlap_service import scan_complaint_overlaps

def generate_case_number(bureau_id: int) -> str:
    bureau = db.session.get(Bureau, bureau_id)
    code = bureau.code if bureau else "GEN"
    year = datetime.now().year
    # Count complaints for this bureau to generate sequential number
    count = db.session.query(Complaint).filter(Complaint.receiving_bureau_id == bureau_id).count() + 1
    return f"AICTE-{year}-{code}-{count:04d}"

def calculate_due_date(priority: str) -> datetime:
    now = datetime.now(timezone.utc)
    p_lower = (priority or "").lower()
    if p_lower == "critical":
        return now + timedelta(days=7)
    elif p_lower == "high":
        return now + timedelta(days=15)
    elif p_lower == "low":
        return now + timedelta(days=45)
    return now + timedelta(days=30)  # Medium / default

def get_complaints(
    search=None,
    status=None,
    priority=None,
    bureau_id=None,
    institution_id=None,
    is_overdue=None,
    sort_by="created_at",
    sort_dir="desc",
    page=1,
    per_page=15,
    user=None
):
    query = db.session.query(Complaint).join(Institution).join(Bureau, Complaint.current_bureau_id == Bureau.id)

    # Permission scoping: officers are focused on their Bureau or all records if configured
    # The requirement states: "An authorized official should be able to open an institution's profile and understand which complaints concern that institution, which departments are handling them... Provide appropriate unauthorized and forbidden responses for restricted modifications"
    # For viewing: authorities have cross-bureau visibility, but officers filtering their own bureau can pass bureau_id.

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Complaint.case_number.ilike(search_term),
                Complaint.external_reference.ilike(search_term),
                Complaint.subject.ilike(search_term),
                Complaint.description.ilike(search_term),
                Complaint.category.ilike(search_term),
                Institution.name.ilike(search_term),
                Institution.institution_code.ilike(search_term),
            )
        )

    if status:
        query = query.filter(Complaint.status == status)

    if priority:
        query = query.filter(Complaint.priority == priority)

    if bureau_id:
        query = query.filter(
            or_(
                Complaint.current_bureau_id == bureau_id,
                Complaint.receiving_bureau_id == bureau_id
            )
        )

    if institution_id:
        query = query.filter(Complaint.institution_id == institution_id)

    if is_overdue is True or str(is_overdue).lower() == "true":
        now = datetime.now(timezone.utc)
        query = query.filter(
            and_(
                Complaint.status.notin_(["Disposed", "Closed"]),
                Complaint.due_at.isnot(None),
                Complaint.due_at < now
            )
        )

    # Sorting
    sort_column = getattr(Complaint, sort_by, Complaint.created_at)
    if sort_dir.lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()

    return {
        "items": [item.to_dict() for item in items],
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page if per_page > 0 else 1
    }

def create_complaint(data: dict, current_user: User):
    institution_id = data.get("institution_id")
    if not institution_id:
        # Check if institution_code provided
        code = data.get("institution_code")
        if code:
            inst = db.session.query(Institution).filter_by(institution_code=code).first()
            if inst:
                institution_id = inst.id
    
    if not institution_id:
        inst_name = (data.get("institution_name") or "").strip()
        if inst_name:
            inst = db.session.query(Institution).filter(Institution.name.ilike(inst_name)).first()
            if not inst:
                import random
                code = f"1-{random.randint(10000000, 99999999)}"
                inst = Institution(
                    institution_code=code,
                    name=inst_name,
                    state=data.get("institution_state") or "All India",
                    institution_type="Engineering & Technology"
                )
                db.session.add(inst)
                db.session.flush()
            institution_id = inst.id

    if not institution_id:
        raise ValueError("Valid institution reference is required")

    inst = db.session.get(Institution, institution_id)
    if not inst:
        raise ValueError(f"Institution with ID {institution_id} does not exist")

    receiving_bureau_id = data.get("receiving_bureau_id") or (current_user.bureau_id if current_user.bureau_id else 1)
    current_bureau_id = data.get("current_bureau_id") or receiving_bureau_id
    priority = data.get("priority", "Medium")

    case_number = data.get("case_number") or generate_case_number(receiving_bureau_id)
    due_at = data.get("due_at") or calculate_due_date(priority)

    complaint = Complaint(
        case_number=case_number,
        external_reference=data.get("external_reference"),
        institution_id=institution_id,
        category=data.get("category", "General Administration"),
        subject=data.get("subject", "").strip(),
        description=data.get("description", "").strip(),
        receiving_bureau_id=receiving_bureau_id,
        current_bureau_id=current_bureau_id,
        assigned_user_id=data.get("assigned_user_id"),
        priority=priority,
        status=data.get("status", "Received"),
        due_at=due_at,
        created_by_user_id=current_user.id if current_user else None,
    )
    db.session.add(complaint)
    db.session.flush()

    # Create initial case action record
    action = CaseAction(
        complaint_id=complaint.id,
        action_type="case_intake",
        description=f"Complaint lodged and registered under Bureau '{complaint.receiving_bureau.code if complaint.receiving_bureau else ''}'. Initial status set to '{complaint.status}'.",
        old_status=None,
        new_status=complaint.status,
        old_bureau_id=None,
        new_bureau_id=complaint.current_bureau_id,
        performed_by_id=current_user.id if current_user else None,
    )
    db.session.add(action)

    # Record Audit Event
    audit = AuditEvent(
        user_id=current_user.id if current_user else None,
        action="COMPLAINT_CREATED",
        entity_type="Complaint",
        entity_id=complaint.id,
    )
    audit.set_details({
        "case_number": complaint.case_number,
        "institution_id": complaint.institution_id,
        "priority": complaint.priority,
        "category": complaint.category
    })
    db.session.add(audit)
    db.session.commit()

    # Trigger automatic cross-bureau overlap detection scan
    try:
        scan_complaint_overlaps(complaint.id)
    except Exception as e:
        # Overlap scan should not fail complaint registration
        pass

    return complaint

def update_complaint_status(complaint_id: int, new_status: str, remarks: str, current_user: User):
    comp = db.session.get(Complaint, complaint_id)
    if not comp:
        return None, "Complaint not found"

    # Permission check: officer can only update cases belonging to their Bureau
    if current_user.role == "officer" and comp.current_bureau_id != current_user.bureau_id:
        return None, f"Forbidden: You do not have permission to modify complaints belonging to another Bureau"
    if current_user.role == "senior_authority":
        return None, "Senior authority account has read-only access"

    old_status = comp.status
    comp.status = new_status
    comp.last_action_at = datetime.now(timezone.utc)

    if new_status in ("Disposed", "Closed"):
        comp.disposed_at = datetime.now(timezone.utc)
        comp.resolution_summary = remarks

    action = CaseAction(
        complaint_id=comp.id,
        action_type="status_change",
        description=remarks or f"Status changed from {old_status} to {new_status}",
        old_status=old_status,
        new_status=new_status,
        old_bureau_id=comp.current_bureau_id,
        new_bureau_id=comp.current_bureau_id,
        performed_by_id=current_user.id,
    )
    db.session.add(action)

    audit = AuditEvent(
        user_id=current_user.id,
        action="STATUS_UPDATED",
        entity_type="Complaint",
        entity_id=comp.id,
    )
    audit.set_details({"old_status": old_status, "new_status": new_status, "remarks": remarks})
    db.session.add(audit)
    db.session.commit()

    return comp, None

def assign_complaint(complaint_id: int, assign_to_user_id: int, remarks: str, current_user: User):
    comp = db.session.get(Complaint, complaint_id)
    if not comp:
        return None, "Complaint not found"

    if current_user.role == "officer" and comp.current_bureau_id != current_user.bureau_id:
        return None, "Forbidden: Cannot assign cases outside your Bureau"
    if current_user.role == "senior_authority":
        return None, "Senior authority has read-only access"

    target_user = db.session.get(User, assign_to_user_id) if assign_to_user_id else None
    old_assigned_id = comp.assigned_user_id
    comp.assigned_user_id = assign_to_user_id
    comp.last_action_at = datetime.now(timezone.utc)

    action_desc = f"Case assigned to {target_user.name if target_user else 'Unassigned'} ({target_user.designation if target_user else ''})."
    if remarks:
        action_desc += f" Remarks: {remarks}"

    action = CaseAction(
        complaint_id=comp.id,
        action_type="assignment",
        description=action_desc,
        old_status=comp.status,
        new_status=comp.status,
        old_bureau_id=comp.current_bureau_id,
        new_bureau_id=comp.current_bureau_id,
        performed_by_id=current_user.id,
    )
    db.session.add(action)

    # Send notification to assigned user
    if target_user:
        notif = Notification(
            user_id=target_user.id,
            notification_type="case_assigned",
            title=f"Case Assigned: {comp.case_number}",
            message=f"You have been assigned to handle complaint {comp.case_number} concerning '{comp.institution.name}'. Priority: {comp.priority}.",
            related_complaint_id=comp.id,
        )
        db.session.add(notif)

    db.session.commit()
    return comp, None

def transfer_bureau(complaint_id: int, target_bureau_id: int, remarks: str, current_user: User):
    comp = db.session.get(Complaint, complaint_id)
    if not comp:
        return None, "Complaint not found"

    if current_user.role == "officer" and comp.current_bureau_id != current_user.bureau_id:
        return None, "Forbidden: Cannot transfer cases that do not currently belong to your Bureau"
    if current_user.role == "senior_authority":
        return None, "Senior authority has read-only access"

    target_bureau = db.session.get(Bureau, target_bureau_id)
    if not target_bureau:
        return None, "Target bureau not found"

    old_bureau_id = comp.current_bureau_id
    old_bureau_code = comp.current_bureau.code if comp.current_bureau else "UNKNOWN"
    comp.current_bureau_id = target_bureau_id
    comp.assigned_user_id = None  # Reset assigned officer upon transfer across bureaus
    comp.last_action_at = datetime.now(timezone.utc)

    desc_text = f"Case transferred from {old_bureau_code} to {target_bureau.code} ({target_bureau.name})."
    if remarks:
        desc_text += f" Reason: {remarks}"

    action = CaseAction(
        complaint_id=comp.id,
        action_type="bureau_transfer",
        description=desc_text,
        old_status=comp.status,
        new_status=comp.status,
        old_bureau_id=old_bureau_id,
        new_bureau_id=target_bureau_id,
        performed_by_id=current_user.id,
    )
    db.session.add(action)

    # Notify target bureau
    notif = Notification(
        bureau_id=target_bureau_id,
        notification_type="case_transferred",
        title=f"Case Transferred to {target_bureau.code}: {comp.case_number}",
        message=f"Complaint {comp.case_number} has been transferred to your Bureau from {old_bureau_code}. Reason: {remarks}",
        related_complaint_id=comp.id,
    )
    db.session.add(notif)

    db.session.commit()
    return comp, None
