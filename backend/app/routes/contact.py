from flask import Blueprint, jsonify, request
from ..services.email_service import send_contact_notification

contact_bp = Blueprint("contact", __name__)


@contact_bp.post("/")
def contact():
    data = request.get_json(force=True)

    required = ["name", "email", "subject", "message"]
    for field in required:
        if not data.get(field, "").strip():
            return jsonify({"message": f"Campo obligatorio: {field}"}), 422

    send_contact_notification(data)
    return jsonify({"message": "Mensaje recibido"}), 200
