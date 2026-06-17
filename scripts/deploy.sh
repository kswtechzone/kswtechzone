#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "  KSW TechZone Deployment"
echo "========================================="
echo ""

# ─── Pre-flight checks ────────────────────────────────────────
if [ ! -f .env ]; then
    echo "[ERROR] .env file not found."
    exit 1
fi

if ! command -v pm2 &> /dev/null; then
    echo "[ERROR] PM2 is not installed. Install it: npm install -g pm2"
    exit 1
fi

if ! command -v nginx &> /dev/null; then
    echo "[WARN] nginx not found. Make sure it's installed."
fi

# ─── Load environment ──────────────────────────────────────────
set -a
source .env
set +a

# ─── Git pull ─────────────────────────────────────────────────
if git rev-parse --abbrev-ref HEAD 2>/dev/null | grep -qv 'HEAD'; then
    echo "[INFO] Pulling latest code..."
    git pull origin "$(git rev-parse --abbrev-ref HEAD)" 2>/dev/null || echo "[WARN] Git pull failed, continuing."
else
    echo "[INFO] Skipping git pull (detached HEAD)."
fi

# ─── Backup database ──────────────────────────────────────────
echo "[INFO] Backing up database..."
BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/ksw-$(date +%Y%m%d-%H%M%S).sql"

if command -v pg_dump &> /dev/null; then
    pg_dump "${DATABASE_URL}" > "$BACKUP_FILE" 2>/dev/null && gzip "$BACKUP_FILE" || echo "[WARN] Backup failed."
else
    echo "[INFO] pg_dump not found, skipping backup."
fi

# ─── Install dependencies & build ──────────────────────────────
echo "[INFO] Installing dependencies..."
pnpm install --frozen-lockfile || pnpm install

echo "[INFO] Generating Prisma client..."
npx prisma generate

echo "[INFO] Building application..."
pnpm run build

# ─── Run database migrations ──────────────────────────────────
echo "[INFO] Running database migrations..."
npx prisma migrate deploy || echo "[WARN] Migration failed. Manual intervention may be needed."

# ─── Seed database (safe to run, uses upsert) ─────────────────
echo "[INFO] Seeding database..."
npx prisma db seed || echo "[WARN] Seed failed."

# ─── Restart PM2 ──────────────────────────────────────────────
echo "[INFO] Restarting PM2 application..."
if pm2 list 2>/dev/null | grep -q "ksw-frontend"; then
    pm2 reload ecosystem.config.cjs
else
    pm2 start ecosystem.config.cjs
fi

# ─── Reload Nginx ─────────────────────────────────────────────
if command -v nginx &> /dev/null; then
    echo "[INFO] Testing Nginx configuration..."
    sudo nginx -t && sudo systemctl reload nginx || echo "[WARN] Nginx reload failed."
fi

# ─── Health check ─────────────────────────────────────────────
echo "[INFO] Performing health check..."
sleep 3

if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null | grep -q "200\|301\|302"; then
    echo "[OK] Application is responding on port 3000"
else
    echo "[WARN] Health check failed. Check PM2 logs: pm2 logs ksw-frontend"
fi

echo ""
echo "[SUCCESS] Deployment complete!"
echo "  Site: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}"
echo "  Monitor: pm2 logs ksw-frontend"
