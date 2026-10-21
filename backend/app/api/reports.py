from flask import Blueprint, request, jsonify, Response
from ..services.auth_service import jwt_required
from ..services.report_service import get_dashboard_kpis, get_analytics_breakdown, generate_cases_csv

reports_bp = Blueprint("reports", __name__, url_prefix="/api/v1/reports")

@reports_bp.route("/kpis", methods=["GET"])
@jwt_required
def get_kpis():
    bureau_id = request.args.get("bureau_id", type=int)
    data = get_dashboard_kpis(bureau_id=bureau_id)
    return jsonify(data)

@reports_bp.route("/analytics", methods=["GET"])
@jwt_required
def get_analytics():
    bureau_id = request.args.get("bureau_id", type=int)
    state = request.args.get("state")
    data = get_analytics_breakdown(bureau_id=bureau_id, state=state)
    return jsonify(data)

@reports_bp.route("/export-csv", methods=["GET"])
@jwt_required
def export_csv():
    bureau_id = request.args.get("bureau_id", type=int)
    status = request.args.get("status")
    priority = request.args.get("priority")

    csv_data = generate_cases_csv(bureau_id=bureau_id, status=status, priority=priority)
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-disposition": "attachment; filename=aicte_complaints_export.csv"}
    )
