import secrets
from datetime import date, datetime, timezone
from flask import Blueprint, jsonify, request
from .. import db
from ..models import Reservation, Apartment
from ..services.email_service import send_verification_email, send_confirmation_email

reservations_bp = Blueprint("reservations", __name__)


def _validate_reservation(data: dict):
    required = ["apartment_id", "check_in", "check_out", "guest_name", "guest_email", "adults"]
    for field in required:
        if not data.get(field):
            return None, None, None, f"Campo obligatorio: {field}"

    try:
        ci = date.fromisoformat(data["check_in"])
        co = date.fromisoformat(data["check_out"])
    except ValueError:
        return None, None, None, "Formato de fecha inválido (use YYYY-MM-DD)"

    if ci < date.today():
        return None, None, None, "La fecha de llegada no puede ser en el pasado"
    if ci >= co:
        return None, None, None, "La fecha de salida debe ser posterior a la llegada"

    apt = Apartment.query.get(data["apartment_id"])
    if not apt or not apt.is_active:
        return None, None, None, "Apartamento no encontrado o no disponible"

    if not apt.is_available(ci, co):
        return None, None, None, "El apartamento no está disponible en las fechas seleccionadas"

    adults = int(data["adults"])
    if adults < 1 or adults > apt.capacity:
        return None, None, None, f"Capacidad máxima: {apt.capacity} personas"

    return apt, ci, co, None


@reservations_bp.post("/")
def create_reservation():
    data = request.get_json(force=True)
    apt, ci, co, error = _validate_reservation(data)
    if error:
        return jsonify({"message": error}), 422

    nights      = (co - ci).days
    total_price = float(apt.price_per_night) * nights
    token       = secrets.token_urlsafe(32)

    res = Reservation(
        apartment_id = apt.id,
        guest_name   = data["guest_name"].strip(),
        guest_email  = data["guest_email"].strip().lower(),
        guest_phone  = data.get("guest_phone", "").strip(),
        adults       = int(data["adults"]),
        children     = int(data.get("children", 0)),
        notes        = data.get("notes", "").strip(),
        check_in     = ci,
        check_out    = co,
        total_price  = total_price,
        status       = "pending",
        verify_token = token,
    )
    db.session.add(res)
    db.session.commit()

    send_verification_email(res)

    return jsonify({
        "message":        "Reserva creada. Revisa tu email para confirmarla.",
        "reservation_id": res.id,
    }), 201


@reservations_bp.get("/verify/<token>")
def verify_reservation(token):
    res = Reservation.query.filter_by(verify_token=token).first()
    if not res:
        return jsonify({"message": "Token inválido"}), 404

    if res.status == "confirmed":
        return jsonify(res.to_dict()), 200

    # Check token age (24h)
    age = (datetime.now(timezone.utc) - res.created_at.replace(tzinfo=timezone.utc)).total_seconds()
    if age > 86400:
        return jsonify({"message": "El enlace ha expirado. Crea una nueva reserva."}), 410

    res.status      = "confirmed"
    res.verified_at = datetime.now(timezone.utc)
    db.session.commit()

    send_confirmation_email(res)

    return jsonify(res.to_dict()), 200


@reservations_bp.delete("/<int:res_id>")
def cancel_reservation(res_id):
    data  = request.get_json(force=True)
    token = data.get("token")
    res   = Reservation.query.get_or_404(res_id)

    if res.verify_token != token:
        return jsonify({"message": "Token inválido"}), 403

    if res.status == "cancelled":
        return jsonify({"message": "La reserva ya está cancelada"}), 409

    res.status = "cancelled"
    db.session.commit()

    return jsonify({"message": "Reserva cancelada"}), 200
