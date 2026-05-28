from flask import Blueprint, jsonify, request
from datetime import date
from ..models import Apartment

apartments_bp = Blueprint("apartments", __name__)


@apartments_bp.get("/")
def list_apartments():
    apts = Apartment.query.filter_by(is_active=True).all()
    return jsonify([a.to_dict() for a in apts])


@apartments_bp.get("/<int:apt_id>")
def get_apartment(apt_id):
    apt = Apartment.query.get_or_404(apt_id)
    return jsonify(apt.to_dict())


@apartments_bp.get("/<int:apt_id>/availability")
def check_availability(apt_id):
    apt = Apartment.query.get_or_404(apt_id)
    check_in_str  = request.args.get("check_in")
    check_out_str = request.args.get("check_out")

    if not check_in_str or not check_out_str:
        return jsonify({"error": "check_in and check_out are required"}), 400

    try:
        ci = date.fromisoformat(check_in_str)
        co = date.fromisoformat(check_out_str)
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    if ci >= co:
        return jsonify({"error": "check_out must be after check_in"}), 400

    available = apt.is_available(ci, co)
    return jsonify({
        "available": available,
        "apartment_id": apt_id,
        "check_in":  ci.isoformat(),
        "check_out": co.isoformat(),
        "nights":    (co - ci).days,
        "total":     float(apt.price_per_night) * (co - ci).days if available else None,
    })
