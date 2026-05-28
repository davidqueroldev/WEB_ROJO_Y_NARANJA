#!/usr/bin/env bash
# update.sh — Actualización en producción (sin downtime)
# Uso: bash update.sh
set -euo pipefail

APP_DIR="/var/www/rojoynaranja"

echo "🔄 Actualizando Rojo y Naranja..."

# Actualizar código
git -C "$APP_DIR" pull --rebase

# Backend: dependencias + seed (idempotente)
"$APP_DIR/venv/bin/pip" install -r "$APP_DIR/backend/requirements.txt" -q
cd "$APP_DIR/backend"
"$APP_DIR/venv/bin/python" seed.py

# Frontend: rebuild
cd "$APP_DIR/frontend"
npm install --legacy-peer-deps --silent
REACT_APP_API_URL=/api npm run build --silent

# Reload sin downtime
systemctl reload nginx
kill -HUP "$(systemctl show rojoynaranja --property=MainPID --value)"

echo "✅ Actualización completada — $(date '+%Y-%m-%d %H:%M')"
