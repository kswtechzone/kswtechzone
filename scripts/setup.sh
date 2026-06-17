#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SCRIPT_DIR"

echo "========================================="
echo "  KSW TechZone — First-Time VPS Setup"
echo "========================================="
echo ""

# ─── Pre-flight ───────────────────────────────────────────────
if [ ! -f .env ]; then
    echo "[ERROR] .env file not found."
    echo "  cp .env.example .env"
    echo "  Then edit .env with your secrets."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found. Install Node.js 20+ first."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "[ERROR] pnpm not found. Install it: npm install -g pnpm"
    exit 1
fi

if ! command -v pm2 &> /dev/null; then
    echo "[INFO] Installing PM2 globally..."
    npm install -g pm2
fi

# ─── Create required directories ─────────────────────────────
mkdir -p logs backups

# ─── Install dependencies ────────────────────────────────────
echo "[1/6] Installing dependencies..."
pnpm install

# ─── Generate Prisma client ──────────────────────────────────
echo "[2/6] Generating Prisma client..."
npx prisma generate

# ─── Build application ───────────────────────────────────────
echo "[3/6] Building application..."
pnpm run build

# ─── Run database migrations ─────────────────────────────────
echo "[4/6] Running database migrations..."
npx prisma migrate deploy || echo "[WARN] Migration issue — run manually: npx prisma migrate deploy"

# ─── Start PM2 ───────────────────────────────────────────────
echo "[5/6] Starting application with PM2..."
pm2 start ecosystem.config.cjs --env production
pm2 save

# ─── Nginx configuration ─────────────────────────────────────
echo "[6/6] Configuring Nginx..."
if command -v nginx &> /dev/null; then
    echo "  Copy nginx config:"
    echo "    sudo cp nginx/kswtechzone.conf /etc/nginx/sites-available/"
    echo "    sudo ln -sf /etc/nginx/sites-available/kswtechzone.conf /etc/nginx/sites-enabled/"
    echo "    sudo nginx -t && sudo systemctl restart nginx"
else
    echo "  Nginx not found. Install it: sudo apt install -y nginx"
fi

echo ""
echo "========================================="
echo "  SSL Certificate Setup"
echo "========================================="
echo ""
echo "To get an SSL certificate, run:"
echo ""
echo "  sudo apt install -y certbot"
echo "  sudo certbot certonly --webroot -w /var/www/certbot \\"
echo "    -d kswtechzone.com -d www.kswtechzone.com \\"
echo "    --email admin@kswtechzone.com --agree-tos --no-eff-email"
echo ""
echo "Then enable the SSL server block in nginx config"
echo "and reload: sudo systemctl reload nginx"
echo ""
echo "========================================="
echo "  Setup complete!"
echo "  App running at http://localhost:3000"
echo "  Manage: pm2 list | pm2 logs ksw-frontend"
echo "========================================="
