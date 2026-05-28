import bcrypt
from .. import db


class AdminUser(db.Model):
    __tablename__ = "admin_users"

    id         = db.Column(db.Integer, primary_key=True)
    email      = db.Column(db.String(200), nullable=False, unique=True)
    pw_hash    = db.Column(db.String(200), nullable=False)
    is_active  = db.Column(db.Boolean, default=True)

    def set_password(self, password: str):
        self.pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode(), self.pw_hash.encode())

    @classmethod
    def create(cls, email: str, password: str) -> "AdminUser":
        user = cls(email=email)
        user.set_password(password)
        return user
