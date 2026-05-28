from datetime import date
from .. import db


class Apartment(db.Model):
    __tablename__ = "apartments"

    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(80), nullable=False, unique=True)
    subtitle    = db.Column(db.String(120))
    description = db.Column(db.Text)
    capacity    = db.Column(db.Integer, nullable=False, default=2)
    size_m2     = db.Column(db.Integer)
    price_per_night = db.Column(db.Numeric(10, 2), nullable=False)
    amenities   = db.Column(db.JSON, default=list)
    images      = db.Column(db.JSON, default=list)
    is_active   = db.Column(db.Boolean, default=True)

    reservations = db.relationship("Reservation", back_populates="apartment", lazy="dynamic")

    def is_available(self, check_in: date, check_out: date, exclude_id: int = None):
        from .reservation import Reservation
        q = (
            Reservation.query
            .filter(
                Reservation.apartment_id == self.id,
                Reservation.status != "cancelled",
                Reservation.check_in  < check_out,
                Reservation.check_out > check_in,
            )
        )
        if exclude_id:
            q = q.filter(Reservation.id != exclude_id)
        return q.count() == 0

    def to_dict(self):
        return {
            "id":          self.id,
            "name":        self.name,
            "subtitle":    self.subtitle,
            "description": self.description,
            "capacity":    self.capacity,
            "size_m2":     self.size_m2,
            "price_per_night": float(self.price_per_night),
            "amenities":   self.amenities or [],
            "images":      self.images or [],
            "is_active":   self.is_active,
        }
