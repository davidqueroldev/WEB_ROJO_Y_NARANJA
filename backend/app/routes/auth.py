from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..models import AdminUser

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/login")
def login():
    data     = request.get_json(force=True)
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = AdminUser.query.filter_by(email=email, is_active=True).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Credenciales incorrectas"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "email": user.email}), 200


@auth_bp.post("/logout")
@jwt_required()
def logout():
    return jsonify({"message": "Sesión cerrada"}), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    uid  = int(get_jwt_identity())
    user = AdminUser.query.get_or_404(uid)
    return jsonify({"id": user.id, "email": user.email}), 200
