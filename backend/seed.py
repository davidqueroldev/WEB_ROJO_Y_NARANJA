"""
Seed inicial: crea tablas, los 4 apartamentos reales de Rojo y Naranja y el admin.
Ejecutar con: python seed.py
"""
import os
from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from app.models import Apartment, AdminUser

app = create_app()

APARTMENTS = [
    {
        "name": "Apartamento Oro",
        "subtitle": "Ático con terraza panorámica",
        "description": (
            "Ático de diseño con terraza privada de 16 m² y vistas panorámicas a Morella. "
            "Jacuzzi para dos con mantenedor de calor y cromoterapia. "
            "Chimenea eléctrica, cocina equipada premium y WiFi. "
            "Sin niños. El más exclusivo de nuestros apartamentos."
        ),
        "capacity": 2,
        "size_m2": None,
        "price_per_night": 0,  # precio a consultar
        "amenities": [
            "Terraza 16 m² con vistas panorámicas",
            "Jacuzzi para 2 con cromoterapia",
            "Mantenedor de calor en jacuzzi",
            "Chimenea eléctrica",
            "Cocina equipada premium",
            "WiFi",
            "Smart TV",
        ],
        "images": [],
    },
    {
        "name": "Apartamento Plata",
        "subtitle": "Romántico con jacuzzi",
        "description": (
            "Apartamento romántico con cama de matrimonio 160×200 cm. "
            "Jacuzzi con mantenedor de calor y cromoterapia, chimenea eléctrica "
            "y cocina premium con dos cafeteras. Sin niños."
        ),
        "capacity": 2,
        "size_m2": None,
        "price_per_night": 0,
        "amenities": [
            "Cama 160×200 cm",
            "Jacuzzi con cromoterapia",
            "Mantenedor de calor en jacuzzi",
            "Chimenea eléctrica",
            "Doble cafetera",
            "Cocina equipada",
            "WiFi",
            "Smart TV",
        ],
        "images": [],
    },
    {
        "name": "Apartamento Rojo",
        "subtitle": "Amplio para 4 personas",
        "description": (
            "Amplio apartamento con dormitorio suite y dormitorio doble. "
            "Dos baños completos: uno con ducha hidromasaje y otro con bañera termostática. "
            "Cocina totalmente equipada con lavadora, secadora y lavavajillas."
        ),
        "capacity": 4,
        "size_m2": None,
        "price_per_night": 0,
        "amenities": [
            "Dormitorio suite",
            "Dormitorio doble",
            "Baño con ducha hidromasaje",
            "Baño con bañera termostática",
            "Lavadora y secadora",
            "Lavavajillas",
            "Cocina completa",
            "WiFi",
            "Smart TV",
        ],
        "images": [],
    },
    {
        "name": "Apartamento Naranja",
        "subtitle": "Céntrico para 4 personas",
        "description": (
            "Dos dormitorios (suite y doble) con baño completo equipado con ducha hidromasaje. "
            "Cocina totalmente equipada y luminoso salón-comedor. "
            "Ideal para dos parejas o familia."
        ),
        "capacity": 4,
        "size_m2": None,
        "price_per_night": 0,
        "amenities": [
            "Dormitorio suite",
            "Dormitorio doble",
            "Ducha hidromasaje",
            "Cocina completa",
            "Salón-comedor",
            "WiFi",
            "Smart TV",
        ],
        "images": [],
    },
]

with app.app_context():
    db.create_all()

    for data in APARTMENTS:
        existing = Apartment.query.filter_by(name=data["name"]).first()
        if existing:
            for k, v in data.items():
                setattr(existing, k, v)
            print(f"  ↺ Apartamento '{data['name']}' actualizado")
        else:
            db.session.add(Apartment(**data))
            print(f"  ✓ Apartamento '{data['name']}' creado")

    admin_email = os.environ.get("ADMIN_EMAIL", "admin@rojoynaranja.com")
    admin_pw    = os.environ.get("ADMIN_PASSWORD", "admin1234")

    if not AdminUser.query.filter_by(email=admin_email).first():
        db.session.add(AdminUser.create(admin_email, admin_pw))
        print(f"  ✓ Admin '{admin_email}' creado")
    else:
        print(f"  · Admin '{admin_email}' ya existe")

    db.session.commit()
    print("\n✅ Seed completado — Rojo y Naranja · Morella")
