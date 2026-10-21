from flask import Blueprint, request, jsonify
from ..models import db, Complaint
from ..services.auth_service import jwt_required, roles_required, get_current_user
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

    user = get_current_user()

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

@complaints_bp.route("/<int:comp_id>", methods=["GET"])
@jwt_required
def get_complaint(comp_id: int):
    comp = db.session.get(Complaint, comp_id)
    if not comp:
        return jsonify({"error": "Complaint not found"}), 404
    return jsonify({"complaint": comp.to_dict(include_details=True)})

@complaints_bp.route("", methods=["POST"])
@jwt_required
@roles_required("admin", "officer")
def lodge_complaint():
    data = request.get_json() or {}
    user = get_current_user()

    if not data.get("subject") or not data.get("description"):
        return jsonify({"error": "Subject and description are required"}), 400

    try:
        complaint = create_complaint(data, user)
        return jsonify({
            "message": "Complaint successfully registered",
            "complaint": complaint.to_dict(include_details=True)
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to register complaint: {str(e)}"}), 500

@complaints_bp.route("/<int:comp_id>/actions", methods=["POST"])
@jwt_required
@roles_required("admin", "officer")
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
@roles_required("admin", "officer")
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
@roles_required("admin", "officer")
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
