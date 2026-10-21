import io
import csv
from datetime import datetime, timezone
from sqlalchemy import func, and_, or_
from ..models import db, Complaint, Institution, Bureau, CaseLink

def get_dashboard_kpis(bureau_id=None):
    now = datetime.now(timezone.utc)
    base_query = db.session.query(Complaint)
    if bureau_id:
        base_query = base_query.filter(Complaint.current_bureau_id == bureau_id)

    total_complaints = base_query.count()
    open_cases = base_query.filter(Complaint.status.notin_(["Disposed", "Closed"])).count()
    action_required = base_query.filter(Complaint.status.in_(["Action Required", "Under Review"])).count()
    overdue_cases = base_query.filter(
        and_(
            Complaint.status.notin_(["Disposed", "Closed"]),
            Complaint.due_at.isnot(None),
            Complaint.due_at < now
        )
    ).count()
    escalated_cases = base_query.filter(Complaint.status == "Escalated").count()
    disposed_cases = base_query.filter(Complaint.status.in_(["Disposed", "Closed"])).count()

    # Potential overlap backlog
    overlap_query = db.session.query(CaseLink).filter(CaseLink.review_status == "pending")
    unreviewed_overlaps = overlap_query.count()

    return {
        "total_complaints": total_complaints,
        "open_cases": open_cases,
        "action_required": action_required,
        "overdue_cases": overdue_cases,
        "escalated_cases": escalated_cases,
        "disposed_cases": disposed_cases,
        "unreviewed_overlaps": unreviewed_overlaps,
    }

def get_analytics_breakdown(bureau_id=None, state=None):
    # 1. Bureau workload distribution
    bureaus = db.session.query(Bureau).filter(Bureau.is_active == True).all()
    bureau_stats = []
    for b in bureaus:
        total = db.session.query(Complaint).filter(Complaint.current_bureau_id == b.id).count()
        open_c = db.session.query(Complaint).filter(Complaint.current_bureau_id == b.id, Complaint.status.notin_(["Disposed", "Closed"])).count()
        disposed_c = db.session.query(Complaint).filter(Complaint.current_bureau_id == b.id, Complaint.status.in_(["Disposed", "Closed"])).count()
        bureau_stats.append({
            "bureau_id": b.id,
            "name": b.name,
            "code": b.code,
            "total": total,
            "open": open_c,
            "disposed": disposed_c,
        })

    # 2. Status distribution
    status_rows = db.session.query(Complaint.status, func.count(Complaint.id)).group_by(Complaint.status).all()
    status_distribution = {s: cnt for s, cnt in status_rows}

    # 3. Priority distribution
    priority_rows = db.session.query(Complaint.priority, func.count(Complaint.id)).group_by(Complaint.priority).all()
    priority_distribution = {p: cnt for p, cnt in priority_rows}

    # 4. Top categories
    category_rows = db.session.query(Complaint.category, func.count(Complaint.id)).group_by(Complaint.category).order_by(func.count(Complaint.id).desc()).limit(7).all()
    category_distribution = [{"category": c, "count": cnt} for c, cnt in category_rows]

    # 5. Overlap status breakdown
    overlap_rows = db.session.query(CaseLink.relationship_type, func.count(CaseLink.id)).group_by(CaseLink.relationship_type).all()
    overlap_distribution = {rel: cnt for rel, cnt in overlap_rows}

    # 6. State distribution
    state_rows = db.session.query(Institution.state, func.count(Complaint.id)).join(Complaint, Complaint.institution_id == Institution.id).group_by(Institution.state).order_by(func.count(Complaint.id).desc()).limit(8).all()
    state_distribution = [{"state": s, "count": cnt} for s, cnt in state_rows if s]

    return {
        "bureau_workload": bureau_stats,
        "status_distribution": status_distribution,
        "priority_distribution": priority_distribution,
        "category_distribution": category_distribution,
        "overlap_distribution": overlap_distribution,
        "state_distribution": state_distribution,
    }

def generate_cases_csv(bureau_id=None, status=None, priority=None) -> str:
    query = db.session.query(Complaint).join(Institution).join(Bureau, Complaint.current_bureau_id == Bureau.id)

    if bureau_id:
        query = query.filter(Complaint.current_bureau_id == bureau_id)
    if status:
        query = query.filter(Complaint.status == status)
    if priority:
        query = query.filter(Complaint.priority == priority)

    complaints = query.order_by(Complaint.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Case Number",
        "External Reference",
        "Institution Name",
        "Institution Code",
        "State",
        "Category",
        "Subject",
        "Current Bureau",
        "Assigned Officer",
        "Priority",
        "Status",
        "Received Date",
        "Due Date",
        "Is Overdue",
        "Disposed Date"
    ])

    for c in complaints:
        writer.writerow([
            c.case_number,
            c.external_reference or "N/A",
            c.institution.name if c.institution else "N/A",
            c.institution.institution_code if c.institution else "N/A",
            c.institution.state if c.institution else "N/A",
            c.category,
            c.subject,
            c.current_bureau.code if c.current_bureau else "N/A",
            c.assigned_officer.name if c.assigned_officer else "Unassigned",
            c.priority,
            c.status,
            c.received_at.strftime("%Y-%m-%d") if c.received_at else "",
            c.due_at.strftime("%Y-%m-%d") if c.due_at else "",
            "YES" if c.is_overdue else "NO",
            c.disposed_at.strftime("%Y-%m-%d") if c.disposed_at else "",
        ])

    return output.getvalue()
