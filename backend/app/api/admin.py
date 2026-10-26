from flask import Blueprint, request, jsonify
from ..models import db, User, AuditEvent, Bureau, Complaint
from ..services.auth_service import jwt_required, roles_required, get_current_user, normalize_role, ROLE_SYSTEM_ADMIN, ROLE_INDUSTRY, ROLE_USER

admin_bp = Blueprint("admin", __name__, url_prefix="/api/v1/admin")

# In-memory configurable system settings with persistent defaults
SYSTEM_SETTINGS = {
    "system_name": "AICTE Integrated Complaint Monitoring & Coordination Platform",
    "version": "AICTE-CMP v2.0-SIH2026",
    "auto_assignment_enabled": True,
    "sla_days": {
        "Critical": 7,
        "High": 15,
        "Medium": 30,
        "Low": 45,
    },
    "categories": [
        "Fee Overcharging / Capitation",
        "Faculty Quality / Non-Payment",
        "Infrastructure Deficiencies",
        "Ragging Incident",
        "Approval / Accreditation Fraud",
        "Admission Irregularity",
        "General Administration",
    ],
}

@admin_bp.route("/users", methods=["GET"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN)
def list_users():
    role_filter = request.args.get("role")
    search = request.args.get("search", "").strip().lower()

    query = db.session.query(User)
    if role_filter:
        norm_filter = normalize_role(role_filter)
        query = query.filter(User.role == norm_filter)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            db.or_(
                User.name.ilike(search_term),
                User.email.ilike(search_term),
                User.designation.ilike(search_term),
            )
        )

    users = query.order_by(User.id.asc()).all()
    return jsonify({"users": [u.to_dict() for u in users]})

@admin_bp.route("/users", methods=["POST"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN)
def create_user():
    """
    System Admin is the only role capable of creating Industry accounts.
    """
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    name = data.get("name", "").strip()
    password = data.get("password", "").strip()
    raw_role = data.get("role", ROLE_INDUSTRY)
    role = normalize_role(raw_role)
    bureau_id = data.get("bureau_id")
    designation = data.get("designation", "").strip()

    if not email or not password or not name:
        return jsonify({"error": "Name, email, and initial password are required"}), 400

    existing = db.session.query(User).filter_by(email=email).first()
    if existing:
        return jsonify({"error": "An account with this email address already exists"}), 409

    if bureau_id:
        bureau = db.session.get(Bureau, int(bureau_id))
        if not bureau:
            return jsonify({"error": "Selected department / industry bureau does not exist"}), 400
    else:
        bureau_id = None

    admin_actor = get_current_user()
    user = User(
        name=name,
        email=email,
        role=role,
        bureau_id=bureau_id,
        designation=designation or ("Industry Officer" if role == ROLE_INDUSTRY else "System User"),
    )
    user.set_password(password)
    db.session.add(user)
    db.session.flush()

    # Log audit event
    audit = AuditEvent(
        user_id=admin_actor.id if admin_actor else None,
        action="USER_CREATED",
        entity_type="User",
        entity_id=user.id,
        ip_address=request.remote_addr,
    )
    audit.set_details({
        "created_email": user.email,
        "created_role": user.role,
        "bureau_id": user.bureau_id,
        "designation": user.designation,
    })
    db.session.add(audit)
    db.session.commit()

    return jsonify({"message": f"{role} account created successfully", "user": user.to_dict()}), 201

@admin_bp.route("/users/<int:user_id>", methods=["PATCH"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN)
def update_user(user_id: int):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User account not found"}), 404

    data = request.get_json() or {}
    admin_actor = get_current_user()
    changes = {}

    if "is_active" in data:
        old_val = user.is_active
        user.is_active = bool(data["is_active"])
        changes["is_active"] = {"old": old_val, "new": user.is_active}

    if "name" in data and data["name"].strip():
        user.name = data["name"].strip()
        changes["name"] = user.name

    if "role" in data:
        user.role = normalize_role(data["role"])
        changes["role"] = user.role

    if "bureau_id" in data:
        user.bureau_id = int(data["bureau_id"]) if data["bureau_id"] else None
        changes["bureau_id"] = user.bureau_id

    if "designation" in data:
        user.designation = data["designation"].strip()
        changes["designation"] = user.designation

    if "password" in data and data["password"].strip():
        user.set_password(data["password"].strip())
        changes["password_reset"] = True

    audit = AuditEvent(
        user_id=admin_actor.id if admin_actor else None,
        action="USER_UPDATED",
        entity_type="User",
        entity_id=user.id,
        ip_address=request.remote_addr,
    )
    audit.set_details(changes)
    db.session.add(audit)
    db.session.commit()

    return jsonify({"message": "User account updated successfully", "user": user.to_dict()})

@admin_bp.route("/users/<int:user_id>/reset-password", methods=["POST"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN)
def reset_user_password(user_id: int):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User account not found"}), 404

    data = request.get_json() or {}
    new_password = data.get("password", "").strip()
    if not new_password or len(new_password) < 4:
        return jsonify({"error": "Password must be at least 4 characters long"}), 400

    user.set_password(new_password)
    admin_actor = get_current_user()
    audit = AuditEvent(
        user_id=admin_actor.id if admin_actor else None,
        action="PASSWORD_RESET_BY_ADMIN",
        entity_type="User",
        entity_id=user.id,
        ip_address=request.remote_addr,
    )
    audit.set_details({"target_user_email": user.email, "target_user_role": user.role})
    db.session.add(audit)
    db.session.commit()

    return jsonify({"message": f"Password reset successfully for {user.name} ({user.email})"})

@admin_bp.route("/industries", methods=["GET"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN)
def list_industries():
    """
    View all industries / departments and their operational capacity.
    """
    bureaus = db.session.query(Bureau).order_by(Bureau.id.asc()).all()
    results = []
    for b in bureaus:
        user_count = db.session.query(User).filter_by(bureau_id=b.id, is_active=True).count()
        total_complaints = db.session.query(Complaint).filter(
            db.or_(Complaint.current_bureau_id == b.id, Complaint.receiving_bureau_id == b.id)
        ).count()
        open_complaints = db.session.query(Complaint).filter(
            db.or_(Complaint.current_bureau_id == b.id, Complaint.receiving_bureau_id == b.id),
            Complaint.status.notin_(["Disposed", "Closed"])
        ).count()

        results.append({
            "id": b.id,
            "name": b.name,
            "code": b.code,
            "description": b.description,
            "is_active": b.is_active,
            "user_count": user_count,
            "total_complaints": total_complaints,
            "open_complaints": open_complaints,
        })

    return jsonify({"industries": results})

@admin_bp.route("/settings", methods=["GET"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN)
def get_settings():
    return jsonify({"settings": SYSTEM_SETTINGS})

@admin_bp.route("/settings", methods=["PATCH"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN)
def update_settings():
    data = request.get_json() or {}
    if "categories" in data and isinstance(data["categories"], list):
        SYSTEM_SETTINGS["categories"] = [c.strip() for c in data["categories"] if c.strip()]
    if "sla_days" in data and isinstance(data["sla_days"], dict):
        SYSTEM_SETTINGS["sla_days"].update(data["sla_days"])
    if "auto_assignment_enabled" in data:
        SYSTEM_SETTINGS["auto_assignment_enabled"] = bool(data["auto_assignment_enabled"])

    admin_actor = get_current_user()
    audit = AuditEvent(
        user_id=admin_actor.id if admin_actor else None,
        action="SETTINGS_UPDATED",
        entity_type="System",
        entity_id=1,
        ip_address=request.remote_addr,
    )
    audit.set_details(data)
    db.session.add(audit)
    db.session.commit()

    return jsonify({"message": "System settings updated successfully", "settings": SYSTEM_SETTINGS})

@admin_bp.route("/audit-logs", methods=["GET"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN)
def get_audit_logs():
    limit = int(request.args.get("limit", 50))
    logs = db.session.query(AuditEvent).order_by(AuditEvent.created_at.desc()).limit(limit).all()
    return jsonify({"audit_logs": [log.to_dict() for log in logs]})

@admin_bp.route("/system-status", methods=["GET"])
@jwt_required
@roles_required(ROLE_SYSTEM_ADMIN)
def get_system_status():
    try:
        pg_version = db.session.execute(db.text("SELECT version();")).scalar()
        db_status = "Connected (Healthy)"
    except Exception as e:
        pg_version = "Unavailable"
        db_status = f"Error: {str(e)}"

    total_users = db.session.query(User).count()
    active_industry_users = db.session.query(User).filter_by(role=ROLE_INDUSTRY, is_active=True).count()
    total_complaints = db.session.query(Complaint).count()

    return jsonify({
        "status": "Operational",
        "database": db_status,
        "postgresql_version": pg_version,
        "portal_version": SYSTEM_SETTINGS["version"],
        "total_users": total_users,
        "active_industry_users": active_industry_users,
        "total_complaints": total_complaints,
    })
