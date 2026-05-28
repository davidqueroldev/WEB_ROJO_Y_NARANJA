# Rojo y Naranja — Apartamentos en el centro de Morella

Aplicación web full-stack para **rojoynaranja.com**: 4 apartamentos en el casco histórico de Morella (Castellón), con sistema de reservas con verificación por email y panel privado de gestión.

---

## Estructura del proyecto

```
WEB_ROJO_Y_NARANJA/
├── frontend/                   # React 18 + Tailwind CSS
│   ├── src/
│   │   ├── assets/images.js    # Imports centralizados de todas las fotos
│   │   ├── components/         # Navbar, Hero, Apartments, BookingForm…
│   │   ├── pages/              # Home, EmailVerify, AdminLogin, Dashboard
│   │   ├── hooks/useInView.js  # Animaciones al hacer scroll
│   │   └── utils/api.js        # Axios + interceptores JWT
│   ├── .npmrc                  # legacy-peer-deps, audit=false
│   └── package.json
├── backend/                    # Flask 3 + SQLAlchemy + PostgreSQL
│   ├── app/
│   │   ├── models/             # Apartment, Reservation, AdminUser
│   │   ├── routes/             # apartments, reservations, auth, dashboard, contact
│   │   └── services/           # email_service (Gmail API OAuth2)
│   ├── seed.py                 # Crea tablas + apartamentos reales + admin
│   ├── wsgi.py                 # Punto de entrada (dev: :8000)
│   ├── .env.example            # Plantilla de variables de entorno
│   └── requirements.txt
└── deploy/                     # Configuración de producción
    ├── nginx.conf              # Proxy + SSL + gzip + cache
    ├── gunicorn.conf.py        # Workers automáticos, bind :8000
    ├── rojoynaranja.service    # Servicio systemd
    ├── deploy.sh               # Primer despliegue completo
    └── update.sh               # Actualización sin downtime
```

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, Tailwind CSS 3, CSS animations |
| Routing | React Router v6 |
| Formularios | React Hook Form + react-datepicker |
| HTTP | Axios con interceptores JWT |
| Backend | Flask 3, SQLAlchemy 2, Flask-JWT-Extended |
| Base de datos | PostgreSQL |
| Emails | Gmail API (OAuth2) |
| WSGI | Gunicorn |
| Proxy / SSL | Nginx + Let's Encrypt |
| Proceso | systemd |

---

## Desarrollo local

### 1. Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # rellena DATABASE_URL y las claves secretas
python seed.py              # crea tablas + 4 apartamentos + usuario admin
python wsgi.py              # arranca en http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm start                   # arranca en http://localhost:3000 (proxy → :8000)
```

> **Nota npm:** No ejecutes `npm audit fix --force`. Las vulnerabilidades reportadas
> son de herramientas de compilación (webpack, postcss) y no afectan al bundle
> de producción. El archivo `.npmrc` ya desactiva el audit automático.

---

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page pública |
| `/verificar/:token` | Verificación de email de reserva |
| `/admin/login` | Login del panel de gestión |
| `/admin/dashboard` | Panel privado (requiere JWT) |

---

## API REST

### Pública

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/apartments` | Lista los 4 apartamentos |
| GET | `/api/apartments/:id/availability?check_in=&check_out=` | Comprueba disponibilidad |
| POST | `/api/reservations` | Crea reserva y envía email de verificación |
| GET | `/api/reservations/verify/:token` | Confirma reserva (enlace del email) |
| DELETE | `/api/reservations/:id` | Cancela una reserva |
| POST | `/api/contact` | Envía mensaje de contacto al propietario |

### Dashboard (Bearer JWT requerido)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Obtiene token JWT |
| GET | `/api/dashboard/reservations` | Lista reservas (filtros: `status`, `month`) |
| GET | `/api/dashboard/stats` | Estadísticas del mes actual |
| PUT | `/api/dashboard/reservations/:id` | Actualiza estado / notas |
| DELETE | `/api/dashboard/reservations/:id` | Elimina reserva |
| GET | `/api/dashboard/apartments` | Lista apartamentos |
| PUT | `/api/dashboard/apartments/:id` | Actualiza precio / descripción |

---

## Configurar Gmail API (envío de emails)

1. Abre [Google Cloud Console](https://console.cloud.google.com/) y crea un proyecto.
2. Activa **Gmail API** en "APIs y servicios".
3. Crea credenciales → **ID de cliente OAuth 2.0** → tipo *Aplicación de escritorio*.
4. Descarga el `client_secret.json` y ejecuta este script **una sola vez** en tu máquina local:

```bash
pip install google-auth-oauthlib
python3 - <<'EOF'
from google_auth_oauthlib.flow import InstalledAppFlow
SCOPES = ['https://www.googleapis.com/auth/gmail.send']
flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', SCOPES)
creds = flow.run_local_server(port=0)
print("REFRESH_TOKEN:", creds.refresh_token)
EOF
```

5. Añade los valores obtenidos al `.env` del servidor:

```env
GMAIL_CLIENT_ID=xxxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=xxxx
GMAIL_REFRESH_TOKEN=xxxx
GMAIL_SENDER_EMAIL=hola@rojoynaranja.com
```

> Si el `.env` no tiene credenciales Gmail, el sistema funciona igualmente
> pero los emails se registran en el log en lugar de enviarse (modo desarrollo).

---

## Despliegue en Hostinger VPS

### Requisitos previos

- VPS con **Ubuntu 22.04 LTS** y acceso root por SSH
- Dominio `rojoynaranja.com` con los DNS apuntando a la IP del VPS
- Repositorio Git accesible desde el VPS

### Primer despliegue

```bash
# 1. Conecta al VPS
ssh root@IP_DEL_VPS

# 2. Descarga el script (o clona el repo manualmente)
curl -fsSL https://raw.githubusercontent.com/TU_USUARIO/rojo-y-naranja/main/deploy/deploy.sh -o deploy.sh

# 3. Edita las 3 variables del principio del script
nano deploy.sh   # REPO_URL, DOMAIN, y opcionalmente DB_USER

# 4. Ejecuta
bash deploy.sh
```

El script hace automáticamente:

| Paso | Acción |
|------|--------|
| 1 | Actualiza el sistema |
| 2 | Instala Node.js 18 LTS (NodeSource), Python 3.11, Nginx, PostgreSQL, Certbot |
| 3 | Crea la base de datos y el usuario PostgreSQL |
| 4 | Clona el repositorio en `/var/www/rojoynaranja` |
| 5 | Genera `/var/www/rojoynaranja/backend/.env` con claves aleatorias |
| 6 | Crea el virtualenv Python e instala dependencias |
| 7 | Ejecuta `seed.py` (tablas + datos iniciales) |
| 8 | Compila el frontend React (`npm run build`) |
| 9 | Configura Nginx como proxy inverso |
| 10 | Obtiene certificado SSL con Let's Encrypt |
| 11 | Registra y arranca el servicio systemd |
| 12 | Configura UFW (puertos 22, 80, 443) |

### Después del primer despliegue

```bash
# Edita el .env con tus credenciales Gmail y contraseña de admin
nano /var/www/rojoynaranja/backend/.env

# Vuelve a ejecutar seed para aplicar la nueva contraseña de admin
cd /var/www/rojoynaranja/backend
source ../venv/bin/activate
python seed.py

# Reinicia el servicio
systemctl restart rojoynaranja
```

### Actualización (deploy continuo)

```bash
bash /var/www/rojoynaranja/deploy/update.sh
```

Hace `git pull` + reinstala dependencias + rebuild React + recarga Nginx y Gunicorn **sin downtime**.

---

## Comandos útiles en producción

```bash
# Estado del servicio Gunicorn
systemctl status rojoynaranja

# Logs en tiempo real
journalctl -fu rojoynaranja
tail -f /var/log/nginx/rojoynaranja_error.log
tail -f /var/log/gunicorn/rojoynaranja_error.log

# Reiniciar servicios
systemctl restart rojoynaranja
systemctl reload nginx

# Consola PostgreSQL
sudo -u postgres psql rojoynaranja_db

# Renovar SSL manualmente (se renueva solo por cron)
certbot renew --dry-run
```

---

## Variables de entorno (`.env`)

```env
# Flask
FLASK_ENV=production
SECRET_KEY=<cadena-aleatoria-larga>
JWT_SECRET_KEY=<otra-cadena-aleatoria>

# Base de datos
DATABASE_URL=postgresql://ryn_user:PASSWORD@localhost:5432/rojoynaranja_db

# Admin del panel
ADMIN_EMAIL=admin@rojoynaranja.com
ADMIN_PASSWORD=<contraseña-segura>

# Gmail API
GMAIL_CLIENT_ID=xxxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=xxxx
GMAIL_REFRESH_TOKEN=xxxx
GMAIL_SENDER_EMAIL=hola@rojoynaranja.com

# URLs
FRONTEND_URL=https://rojoynaranja.com
CORS_ORIGINS=https://rojoynaranja.com
```

---

## Personalización

### Añadir o cambiar fotos
Las imágenes están en `frontend/src/assets/img/{oro,plata,rojo,naranja,morella}/`.
Añade archivos `.webp` y actualiza los imports en `frontend/src/assets/images.js`.

### Editar textos de apartamentos
`frontend/src/components/Apartments.jsx` → array `apartments`.
Los mismos datos están en `backend/seed.py` para la base de datos.

### Cambiar colores
`frontend/tailwind.config.js` → objeto `brand`:
- `brand.red` → color principal (rojo)
- `brand.orange` → color de acento (naranja)

### Cambiar datos de contacto
`frontend/src/components/Contact.jsx` → objeto `info` (teléfono, email, dirección).
`backend/.env` → `ADMIN_EMAIL` para recibir los mensajes de contacto.
