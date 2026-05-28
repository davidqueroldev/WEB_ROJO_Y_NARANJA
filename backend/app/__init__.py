import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

db       = SQLAlchemy()
migrate  = Migrate()
jwt      = JWTManager()


def create_app(config_name=None):
    app = Flask(__name__, static_folder="../../frontend/build", static_url_path="/")

    # ── Config ──────────────────────────────────────────────────────
    app.config["SECRET_KEY"]               = os.environ["SECRET_KEY"]
    app.config["JWT_SECRET_KEY"]           = os.environ["JWT_SECRET_KEY"]
    app.config["SQLALCHEMY_DATABASE_URI"]  = os.environ["DATABASE_URL"]
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 86400  # 24 h

    # ── Extensions ──────────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}}, supports_credentials=True)

    # ── Blueprints ──────────────────────────────────────────────────
    from .routes.apartments   import apartments_bp
    from .routes.reservations import reservations_bp
    from .routes.auth         import auth_bp
    from .routes.dashboard    import dashboard_bp
    from .routes.contact      import contact_bp

    app.register_blueprint(apartments_bp,   url_prefix="/api/apartments")
    app.register_blueprint(reservations_bp, url_prefix="/api/reservations")
    app.register_blueprint(auth_bp,         url_prefix="/api/auth")
    app.register_blueprint(dashboard_bp,    url_prefix="/api/dashboard")
    app.register_blueprint(contact_bp,      url_prefix="/api/contact")

    # ── SPA fallback ────────────────────────────────────────────────
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_spa(path):
        if path.startswith("api/"):
            from flask import jsonify
            return jsonify({"error": "Not found"}), 404
        try:
            return app.send_static_file("index.html")
        except Exception:
            return "", 404

    return app
