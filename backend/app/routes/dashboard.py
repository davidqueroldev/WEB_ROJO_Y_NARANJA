from datetime import date
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import func, extract
from .. import db
from ..models import Reservation, Apartment

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.get("/reservations")
@jwt_required()
def list_reservations():
    status = request.args.get("status")
    month  = request.args.get("month")
    q      = Reservation.query.order_by(Reservation.created_at.desc())

    if status and status != "all":
        q = q.filter_by(status=status)

    if month:
        try:
            y, m = map(int, month.split("-"))
            q = q.filter(
                extract("year",  Reservation.check_in) == y,
                extract("month", Reservation.check_in) == m,
            )
        except ValueError:
            pass

    return jsonify([r.to_dict() for r in q.all()])


@dashboard_bp.get("/stats")
@jwt_required()
def stats():
    today = date.today()
    month_start = today.replace(day=1)

    total     = Reservation.query.count()
    confirmed = Reservation.query.filter_by(status="confirmed").count()
    cancelled = Reservation.query.filter_by(status="cancelled").count()
    pending   = Reservation.query.filter_by(status="pending").count()

    guests_this_month = (
        db.session.query(func.sum(Reservation.adults + Reservation.children))
        .filter(
            Reservation.status == "confirmed",
            Reservation.check_in >= month_start,
        )
        .scalar() or 0
    )

    revenue_this_month = (
        db.session.query(func.sum(Reservation.total_price))
        .filter(
            Reservation.status == "confirmed",
            Reservation.check_in >= month_start,
        )
        .scalar() or 0
    )

    return jsonify({
        "total":     total,
        "confirmed": confirmed,
        "cancelled": cancelled,
        "pending":   pending,
        "guests":    int(guests_this_month),
        "revenue":   float(revenue_this_month),
    })


@dashboard_bp.put("/reservations/<int:res_id>")
@jwt_required()
def update_reservation(res_id):
    res  = Reservation.query.get_or_404(res_id)
    data = request.get_json(force=True)

    allowed = {"status", "notes", "guest_phone"}
    for field in allowed:
        if field in data:
            setattr(res, field, data[field])

    db.session.commit()
    return jsonify(res.to_dict())


@dashboard_bp.delete("/reservations/<int:res_id>")
@jwt_required()
def delete_reservation(res_id):
    res = Reservation.query.get_or_404(res_id)
    db.session.delete(res)
    db.session.commit()
    return jsonify({"message": "Eliminada"}), 200


@dashboard_bp.get("/apartments")
@jwt_required()
def list_apartments():
    apts = Apartment.query.all()
    return jsonify([a.to_dict() for a in apts])


@dashboard_bp.put("/apartments/<int:apt_id>")
@jwt_required()
def update_apartment(apt_id):
    apt  = Apartment.query.get_or_404(apt_id)
    data = request.get_json(force=True)

    allowed = {"price_per_night", "description", "is_active", "amenities"}
    for field in allowed:
        if field in data:
            setattr(apt, field, data[field])

    db.session.commit()
    return jsonify(apt.to_dict())
