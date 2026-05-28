#!/usr/bin/env bash
# deploy.sh — Primer despliegue en Hostinger VPS (Ubuntu 22.04)
# Uso: bash deploy.sh
#
# ANTES DE EJECUTAR edita las 3 variables de abajo.
set -euo pipefail

APP_DIR="/var/www/rojoynaranja"
REPO_URL="https://github.com/TU_USUARIO/rojo-y-naranja.git"   # ← cambia esto
DOMAIN="rojoynaranja.com"                                       # ← cambia esto
DB_NAME="rojoynaranja_db"
DB_USER="ryn_user"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 🔴🟠  Desplegando Rojo y Naranja en VPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Sistema ───────────────────────────────────────────────────
echo "📦 Actualizando sistema..."
apt-get update -qq && apt-get upgrade -y -qq

echo "📦 Instalando dependencias del sistema..."
apt-get install -y -qq \
  python3.11 python3.11-venv python3-pip \
  nginx postgresql postgresql-contrib \
  certbot python3-certbot-nginx \
  git curl ca-certificates gnupg

# ── 2. Node.js 18 LTS (via NodeSource) ──────────────────────────
if ! command -v node &>/dev/null || [[ $(node -v | cut -d. -f1 | tr -d 'v') -lt 18 ]]; then
  echo "📦 Instalando Node.js 18 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs
fi
echo "   Node $(node -v) | npm $(npm -v)"

# ── 3. PostgreSQL ────────────────────────────────────────────────
echo "🐘 Configurando PostgreSQL..."
systemctl start postgresql
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" \
  | grep -q 1 || sudo -u postgres createdb "$DB_NAME"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" \
  | grep -q 1 || sudo -u postgres createuser "$DB_USER"
DB_PASS=$(openssl rand -hex 16)
sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';"
echo "   DB_PASS generada: $DB_PASS  ← guárdala en el .env"

# ── 4. Clonar / actualizar repositorio ──────────────────────────
echo "📂 Clonando repositorio..."
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull --rebase
else
  git clone "$REPO_URL" "$APP_DIR"
fi
chown -R www-data:www-data "$APP_DIR"

# ── 5. Configurar .env ───────────────────────────────────────────
if [ ! -f "$APP_DIR/backend/.env" ]; then
  cp "$APP_DIR/backend/.env.example" "$APP_DIR/backend/.env"
  SECRET=$(openssl rand -hex 32)
  JWT_SECRET=$(openssl rand -hex 32)
  sed -i \
    "s|DATABASE_URL=.*|DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME|" \
    "$APP_DIR/backend/.env"
  sed -i "s|SECRET_KEY=.*|SECRET_KEY=$SECRET|"         "$APP_DIR/backend/.env"
  sed -i "s|JWT_SECRET_KEY=.*|JWT_SECRET_KEY=$JWT_SECRET|" "$APP_DIR/backend/.env"
  sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=https://$DOMAIN|" "$APP_DIR/backend/.env"
  sed -i "s|CORS_ORIGINS=.*|CORS_ORIGINS=https://$DOMAIN|" "$APP_DIR/backend/.env"
  echo "   .env creado — edítalo para añadir credenciales de Gmail y contraseña de admin"
fi

# ── 6. Backend: virtualenv ───────────────────────────────────────
echo "🐍 Configurando virtualenv Python..."
python3.11 -m venv "$APP_DIR/venv"
"$APP_DIR/venv/bin/pip" install --upgrade pip -q
"$APP_DIR/venv/bin/pip" install -r "$APP_DIR/backend/requirements.txt" -q

echo "🌱 Ejecutando seed (tablas + datos iniciales)..."
cd "$APP_DIR/backend"
"$APP_DIR/venv/bin/python" seed.py

# ── 7. Frontend: build ───────────────────────────────────────────
echo "⚛️  Construyendo frontend React..."
cd "$APP_DIR/frontend"
npm install --legacy-peer-deps --silent
REACT_APP_API_URL=/api npm run build --silent

# ── 8. Nginx ─────────────────────────────────────────────────────
echo "🌐 Configurando Nginx..."
cp "$APP_DIR/deploy/nginx.conf" "/etc/nginx/sites-available/rojoynaranja"
ln -sf /etc/nginx/sites-available/rojoynaranja /etc/nginx/sites-enabled/rojoynaranja
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ── 9. SSL (Let's Encrypt) ───────────────────────────────────────
echo "🔒 Obteniendo certificado SSL..."
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive \
  --agree-tos --email "hola@$DOMAIN" --redirect || \
  echo "⚠️  SSL no obtenido (DNS propagado?). Ejecuta: certbot --nginx -d $DOMAIN -d www.$DOMAIN"

# ── 10. Systemd ──────────────────────────────────────────────────
echo "⚙️  Configurando servicio systemd..."
mkdir -p /var/log/gunicorn
chown www-data:www-data /var/log/gunicorn

cp "$APP_DIR/deploy/rojoynaranja.service" /etc/systemd/system/rojoynaranja.service
systemctl daemon-reload
systemctl enable rojoynaranja
systemctl restart rojoynaranja

# ── 11. Firewall ─────────────────────────────────────────────────
echo "🛡️  Configurando firewall UFW..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ✅  Despliegue completado"
echo " 🌍  https://$DOMAIN"
echo " 🔑  Panel: https://$DOMAIN/admin/login"
echo " ⚠️   Edita $APP_DIR/backend/.env con tus credenciales Gmail"
echo " ⚠️   Cambia ADMIN_PASSWORD en el .env y re-ejecuta: python seed.py"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
