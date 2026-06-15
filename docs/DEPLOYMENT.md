# VPS Deployment Guide

## Prerequisites

- Ubuntu 22.04+ VPS
- Docker & Docker Compose installed
- Domain: kswtechzone.com
- SSL certificates (Let's Encrypt)

## Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin

# Clone repository
git clone https://github.com/kswtechzone/ksw-techzone.git /var/www/kswtechzone
cd /var/www/kswtechzone

# Copy environment
cp .env.example .env
nano .env  # Configure all variables
```

## SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d kswtechzone.com -d www.kswtechzone.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Deployment

```bash
# Make deploy script executable
chmod +x docker/scripts/deploy.sh

# Deploy
./docker/scripts/deploy.sh
```

## Monitoring

```bash
# View logs
docker compose logs -f

# Check service status
docker compose ps

# Restart service
docker compose restart frontend

# Database backup
docker exec ksw-postgres pg_dump -U ksw ksw_website > backup.sql
```

## Security Checklist

- [ ] All secrets in environment variables
- [ ] SSL/TLS enabled (Let's Encrypt)
- [ ] HTTP → HTTPS redirect
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] CORS restricted to known origins
- [ ] Rate limiting enabled (Nginx + Backend)
- [ ] PostgreSQL at rest encryption
- [ ] Regular database backups
- [ ] Fail2ban installed
- [ ] UFW firewall configured (only 80, 443, 22)
- [ ] SSH key-only authentication
- [ ] Docker security scanning
- [ ] Audit logging enabled
