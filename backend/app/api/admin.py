from flask import Blueprint, request, jsonify
from ..models import db, User, AuditEvent, Bureau
from ..services.auth_service import jwt_required, roles_required, get_current_user

admin_bp = Blueprint("admin", __name__, url_prefix="/api/v1/admin")

@admin_bp.route("/users", methods=["GET"])
@jwt_required
@roles_required("admin")
def list_users():
    users = db.session.query(User).order_by(User.name).all()
    return jsonify({"users": [u.to_dict() for u in users]})

@admin_bp.route("/users", methods=["POST"])
@jwt_required
@roles_required("admin")
def create_user():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    name = data.get("name", "").strip()
    password = data.get("password", "")
    role = data.get("role", "officer")
    bureau_id = data.get("bureau_id")
    designation = data.get("designation")

    if not email or not password or not name:
        return jsonify({"error": "Name, email, and password are required"}), 400

    existing = db.session.query(User).filter_by(email=email).first()
    if existing:
        return jsonify({"error": "A user with this email already exists"}), 409

    user = User(
        name=name,
        email=email,
        role=role,
        bureau_id=bureau_id,
        designation=designation,
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "user": user.to_dict()}), 201

@admin_bp.route("/users/<int:user_id>", methods=["PATCH"])
@jwt_required
@roles_required("admin")
def update_user(user_id: int):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    if "is_active" in data:
        user.is_active = bool(data["is_active"])
    if "role" in data:
        user.role = data["role"]
    if "bureau_id" in data:
        user.bureau_id = data["bureau_id"]
    if "designation" in data:
        user.designation = data["designation"]
    if "password" in data and data["password"].strip():
        user.set_password(data["password"].strip())

    db.session.commit()
    return jsonify({"message": "User updated", "user": user.to_dict()})

@admin_bp.route("/audit-logs", methods=["GET"])
@jwt_required
@roles_required("admin")
def get_audit_logs():
    limit = int(request.args.get("limit", 50))
    logs = db.session.query(AuditEvent).order_by(AuditEvent.created_at.desc()).limit(limit).all()
    return jsonify({"audit_logs": [log.to_dict() for log in logs]})

@admin_bp.route("/system-status", methods=["GET"])
@jwt_required
@roles_required("admin")
def get_system_status():
    try:
        pg_version = db.session.execute(db.text("SELECT version();")).scalar()
        db_status = "Connected (Healthy)"
    except Exception as e:
        pg_version = "Unavailable"
        db_status = f"Error: {str(e)}"

    return jsonify({
        "status": "Operational",
        "database": db_status,
        "postgresql_version": pg_version,
        "portal_version": "AICTE-CMP v1.0-SIH2026",
    })
