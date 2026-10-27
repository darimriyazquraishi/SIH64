import os
import uuid
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from sqlalchemy import or_, desc
from ..models import db, Complaint, CaseAction, CaseLink, Notification, Bureau
from ..services.auth_service import (
    jwt_required,
    roles_required,
    get_current_user,
    ROLE_SYSTEM_ADMIN,
    ROLE_INDUSTRY,
    ROLE_USER,
)
from ..services.complaint_service import (
    get_complaints,
    create_complaint,
    update_complaint_status,
    assign_complaint,
    transfer_bureau,
)

complaints_bp = Blueprint("complaints", __name__, url_prefix="/api/v1/complaints")

@complaints_bp.route("", methods=["GET"])
@jwt_required
def list_complaints():
    user = get_current_user()

    # User / Complainant role enforcement:
    # Public complainants can ONLY view their own complaints, strictly sanitized
    if user.is_user:
        query = db.session.query(Complaint).filter(
            or_(
                Complaint.created_by_user_id == user.id,
                Complaint.complainant_email.ilike(user.email)
            )
        ).order_by(desc(Complaint.created_at))
        items = query.all()
        return jsonify({
            "items": [c.to_public_dict(include_history=True) for c in items],
            "total": len(items),
            "page": 1,
            "per_page": len(items),
            "pages": 1,
        })

    # Industry / System Admin: full view across all industries/departments
    search = request.args.get("search")
    status = request.args.get("status")
    priority = request.args.get("priority")
    bureau_id = request.args.get("bureau_id", type=int)
    institution_id = request.args.get("institution_id", type=int)
    is_overdue = request.args.get("is_overdue")
    sort_by = request.args.get("sort_by", "created_at")
    sort_dir = request.args.get("sort_dir", "desc")
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 15))

    data = get_complaints(
        search=search,
        status=status,
        priority=priority,
        bureau_id=bureau_id,
        institution_id=institution_id,
        is_overdue=is_overdue,
        sort_by=sort_by,
        sort_dir=sort_dir,
        page=page,
        per_page=per_page,
        user=user
    )
    return jsonify(data)

@complaints_bp.route("/meta", methods=["GET"])
@jwt_required
def get_complaints_meta():
    db_cats = [
        c[0] for c in db.session.query(Complaint.category)
        .filter(Complaint.category.isnot(None), Complaint.category != "")
        .distinct().order_by(Complaint.category).all()
    ]
    canonical_cats = [
        "Fee Overcharging / Capitation",
        "Faculty Quality / Non-Payment",
        "Infrastructure Deficiencies",
        "Ragging Incident",
        "Approval / Accreditation Fraud",
        "Admission Irregularity",
        "General Administration"
    ]
    categories = sorted(list(set(db_cats + canonical_cats)))
    statuses = ["New", "Received", "Under Review", "Action Required", "Awaiting Response", "Escalated", "Disposed", "Closed"]
    priorities = ["Critical", "High", "Medium", "Low"]
    return jsonify({
        "categories": categories,
        "statuses": statuses,
        "priorities": priorities
    })

@complaints_bp.route("/<int:comp_id>", methods=["GET"])
@jwt_required
def get_complaint(comp_id: int):
    comp = db.session.get(Complaint, comp_id)
    if not comp:
        return jsonify({"error": "Complaint not found"}), 404

    user = get_current_user()
    if user.is_user:
        # Strict privacy enforcement: cannot view other people's complaints
        is_owner = (comp.created_by_user_id == user.id) or (
            comp.complainant_email and comp.complainant_email.strip().lower() == user.email.strip().lower()
        )
        if not is_owner:
            return jsonify({"error": "Forbidden: You do not have permission to access this complaint"}), 403
        return jsonify({"complaint": comp.to_public_dict(include_history=True)})

    # Industry / System Admin: full complaint details with actions & overlap matches
    return jsonify({"complaint": comp.to_dict(include_details=True)})

@complaints_bp.route("", methods=["POST"])
@jwt_required
def lodge_complaint():
    data = request.get_json() or {}
    user = get_current_user()

    if not data.get("subject") or not data.get("description"):
        return jsonify({"error": "Subject and description are required"}), 400

    if user.is_user:
        # Auto-bind complainant credentials
        data["complainant_name"] = data.get("complainant_name") or user.name
        data["complainant_email"] = user.email

    try:
        complaint = create_complaint(data, user)
        res_data = complaint.to_public_dict(include_history=True) if user.is_user else complaint.to_dict(include_details=True)
        return jsonify({
            "message": "Complaint successfully registered",
            "ticket_number": complaint.ticket_number,
            "case_number": complaint.case_number,
            "complaint": res_data
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to register complaint: {str(e)}"}), 500

@complaints_bp.route("/<int:comp_id>/actions", methods=["POST"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN, ROLE_INDUSTRY)
def update_status(comp_id: int):
    data = request.get_json() or {}
    new_status = data.get("status")
    remarks = data.get("remarks", "")
    user = get_current_user()

    if not new_status:
        return jsonify({"error": "New status is required"}), 400

    comp, err = update_complaint_status(comp_id, new_status, remarks, user)
    if err:
        return jsonify({"error": err}), 403 if "Forbidden" in err else 400

    return jsonify({
        "message": "Status updated successfully",
        "complaint": comp.to_dict(include_details=True)
    })

@complaints_bp.route("/<int:comp_id>/assign", methods=["POST"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN, ROLE_INDUSTRY)
def assign_officer(comp_id: int):
    data = request.get_json() or {}
    assign_to_user_id = data.get("user_id")
    remarks = data.get("remarks", "")
    user = get_current_user()

    comp, err = assign_complaint(comp_id, assign_to_user_id, remarks, user)
    if err:
        return jsonify({"error": err}), 403 if "Forbidden" in err else 400

    return jsonify({
        "message": "Case assigned successfully",
        "complaint": comp.to_dict(include_details=True)
    })

@complaints_bp.route("/<int:comp_id>/transfer", methods=["POST"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN, ROLE_INDUSTRY)
def transfer_case(comp_id: int):
    data = request.get_json() or {}
    target_bureau_id = data.get("target_bureau_id")
    remarks = data.get("remarks", "")
    user = get_current_user()

    if not target_bureau_id:
        return jsonify({"error": "Target Bureau ID is required"}), 400

    comp, err = transfer_bureau(comp_id, target_bureau_id, remarks, user)
    if err:
        return jsonify({"error": err}), 403 if "Forbidden" in err else 400

    return jsonify({
        "message": "Case transferred successfully",
        "complaint": comp.to_dict(include_details=True)
    })

@complaints_bp.route("/<int:comp_id>/respond", methods=["POST"])
@jwt_required
def complainant_respond(comp_id: int):
    """
    Complainant can respond to an official's query and upload missing documents WITHOUT filing a new complaint.
    """
    user = get_current_user()
    comp = db.session.get(Complaint, comp_id)
    if not comp:
        return jsonify({"error": "Complaint not found"}), 404

    if user.is_user:
        is_owner = (comp.created_by_user_id == user.id) or (
            comp.complainant_email and comp.complainant_email.strip().lower() == user.email.strip().lower()
        )
        if not is_owner:
            return jsonify({"error": "Forbidden: You do not have permission to modify this complaint"}), 403

    if request.is_json:
        data = request.get_json() or {}
        uploaded_file = None
    else:
        data = request.form.to_dict()
        uploaded_file = request.files.get("file") or request.files.get("document")

    message = (data.get("message") or data.get("remarks") or "").strip()
    if not message and not uploaded_file:
        return jsonify({"error": "Please provide a response message or upload a document"}), 400

    doc_name = None
    doc_url = None
    if uploaded_file and uploaded_file.filename:
        safe_name = secure_filename(uploaded_file.filename)
        upload_dir = current_app.config.get("UPLOAD_FOLDER") or os.path.join(current_app.root_path, "..", "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        unique_name = f"{uuid.uuid4().hex[:12]}_{safe_name}"
        uploaded_file.save(os.path.join(upload_dir, unique_name))
        doc_name = uploaded_file.filename
        doc_url = f"/api/v1/public/files/{unique_name}"
        comp.supporting_document_name = doc_name
        comp.supporting_document_url = doc_url

    # Create Case Action
    action = CaseAction(
        complaint_id=comp.id,
        action_type="complainant_response",
        description=f"Complainant Clarification: {message}" + (f" (Attached: {doc_name})" if doc_name else ""),
        performed_by_name=user.name if user else comp.complainant_name or "Complainant",
        user_id=user.id if user else None,
        created_at=datetime.now(timezone.utc),
    )
    db.session.add(action)

    if comp.status == "Awaiting Response":
        comp.status = "Under Review"

    comp.last_action_at = datetime.now(timezone.utc)

    # Notify assigned officer or Bureau
    notif = Notification(
        notification_type="complainant_reply",
        title=f"Additional Info Received: Case #{comp.case_number}",
        message=f"Complainant {comp.complainant_name} submitted additional details: '{message[:100]}...'",
        related_complaint_id=comp.id,
        user_id=comp.assigned_user_id
    )
    db.session.add(notif)
    db.session.commit()

    return jsonify({
        "message": "Additional information and documents recorded successfully",
        "complaint": comp.to_public_dict(include_history=True) if user.is_user else comp.to_dict(include_details=True)
    })

@complaints_bp.route("/<int:comp_id>/coordination-note", methods=["POST"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN, ROLE_INDUSTRY)
def add_coordination_note(comp_id: int):
    """
    Record cross-Bureau coordination notes and agreed actions without merging complaints.
    """
    comp = db.session.get(Complaint, comp_id)
    if not comp:
        return jsonify({"error": "Complaint not found"}), 404

    data = request.get_json() or {}
    note = (data.get("note") or data.get("remarks") or "").strip()
    partner_bureau_code = (data.get("partner_bureau_code") or "").strip()

    if not note:
        return jsonify({"error": "Coordination note text is required"}), 400

    user = get_current_user()
    action = CaseAction(
        complaint_id=comp.id,
        action_type="coordination_note",
        description=f"Inter-Bureau Coordination [{user.bureau.code if user.bureau else 'AICTE'} ↔ {partner_bureau_code or 'Partner Bureaus'}]: {note}",
        performed_by_name=user.name,
        user_id=user.id,
        created_at=datetime.now(timezone.utc),
    )
    db.session.add(action)
    comp.last_action_at = datetime.now(timezone.utc)

    db.session.commit()
    return jsonify({
        "message": "Coordination note recorded successfully",
        "complaint": comp.to_dict(include_details=True)
    })

@complaints_bp.route("/<int:comp_id>/link-related", methods=["POST"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN, ROLE_INDUSTRY)
def link_related_case(comp_id: int):
    """
    Link related cases while keeping their IDs, owners and histories intact.
    """
    comp = db.session.get(Complaint, comp_id)
    if not comp:
        return jsonify({"error": "Source complaint not found"}), 404

    data = request.get_json() or {}
    target_ref = str(data.get("target_case_number") or data.get("target_id") or "").strip()
    reason = (data.get("reason") or "Manual official cross-reference link").strip()

    if not target_ref:
        return jsonify({"error": "Target case number or ID is required"}), 400

    target_comp = db.session.query(Complaint).filter(
        or_(
            Complaint.case_number.ilike(target_ref),
            Complaint.ticket_number.ilike(target_ref),
            Complaint.id == (int(target_ref) if target_ref.isdigit() else -1)
        )
    ).first()

    if not target_comp:
        return jsonify({"error": f"No target complaint found matching '{target_ref}'"}), 404

    if target_comp.id == comp.id:
        return jsonify({"error": "Cannot link a complaint to itself"}), 400

    id_a, id_b = (comp.id, target_comp.id) if comp.id < target_comp.id else (target_comp.id, comp.id)
    existing = db.session.query(CaseLink).filter_by(complaint_id_a=id_a, complaint_id_b=id_b).first()

    user = get_current_user()
    if existing:
        existing.relationship_type = "confirmed_related"
        existing.review_status = "confirmed"
        existing.review_remarks = reason
        existing.reviewed_by_id = user.id
        existing.reviewed_at = datetime.now(timezone.utc)
    else:
        new_link = CaseLink(
            complaint_id_a=id_a,
            complaint_id_b=id_b,
            relationship_type="confirmed_related",
            match_score=1.0,
            match_method="Manual Official Link",
            match_reason=reason,
            review_status="confirmed",
            reviewed_by_id=user.id,
            reviewed_at=datetime.now(timezone.utc),
            review_remarks=reason
        )
        db.session.add(new_link)

    # Record action on both complaints
    action_a = CaseAction(
        complaint_id=comp.id,
        action_type="case_linked",
        description=f"Linked to related Case #{target_comp.case_number}. Rationale: {reason}",
        performed_by_name=user.name,
        user_id=user.id,
        created_at=datetime.now(timezone.utc)
    )
    action_b = CaseAction(
        complaint_id=target_comp.id,
        action_type="case_linked",
        description=f"Linked to related Case #{comp.case_number}. Rationale: {reason}",
        performed_by_name=user.name,
        user_id=user.id,
        created_at=datetime.now(timezone.utc)
    )
    db.session.add_all([action_a, action_b])
    db.session.commit()

    return jsonify({
        "message": f"Successfully linked Case #{comp.case_number} with Case #{target_comp.case_number}",
        "complaint": comp.to_dict(include_details=True)
    })

