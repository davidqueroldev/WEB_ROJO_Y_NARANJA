from datetime import datetime, timezone
from .. import db


class Reservation(db.Model):
    __tablename__ = "reservations"

    id              = db.Column(db.Integer, primary_key=True)
    apartment_id    = db.Column(db.Integer, db.ForeignKey("apartments.id"), nullable=False)

    # Guest info
    guest_name      = db.Column(db.String(200), nullable=False)
    guest_email     = db.Column(db.String(200), nullable=False)
    guest_phone     = db.Column(db.String(30))
    adults          = db.Column(db.Integer, default=2)
    children        = db.Column(db.Integer, default=0)
    notes           = db.Column(db.Text)

    # Dates
    check_in        = db.Column(db.Date, nullable=False)
    check_out       = db.Column(db.Date, nullable=False)
    total_price     = db.Column(db.Numeric(10, 2), nullable=False)

    # Status
    status          = db.Column(db.String(20), default="pending")
    # pending | confirmed | cancelled

    # Email verification
    verify_token    = db.Column(db.String(100), unique=True, index=True)
    verified_at     = db.Column(db.DateTime)

    created_at      = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at      = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                                onupdate=lambda: datetime.now(timezone.utc))

    apartment = db.relationship("Apartment", back_populates="reservations")

    def to_dict(self):
        return {
            "id":             self.id,
            "apartment_id":   self.apartment_id,
            "apartment_name": self.apartment.name if self.apartment else None,
            "guest_name":     self.guest_name,
            "guest_email":    self.guest_email,
            "guest_phone":    self.guest_phone,
            "adults":         self.adults,
            "children":       self.children,
            "notes":          self.notes,
            "check_in":       self.check_in.isoformat(),
            "check_out":      self.check_out.isoformat(),
            "total_price":    float(self.total_price),
            "status":         self.status,
            "verified_at":    self.verified_at.isoformat() if self.verified_at else None,
            "created_at":     self.created_at.isoformat(),
        }
