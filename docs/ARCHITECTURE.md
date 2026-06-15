# KSW TechZone - System Architecture

## Overview

KSW TechZone is built as a modern, scalable monorepo containing:
- Next.js 14 frontend with App Router
- NestJS backend microservices  
- PostgreSQL database with Prisma ORM
- Redis for caching
- Docker containerization

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         DNS (Cloudflare)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      Nginx Reverse Proxy                     │
│                       kswtechzone.com                        │
└───────┬──────────────────────────────────┬──────────────────┘
        │                                  │
┌───────▼────────┐                 ┌───────▼────────┐
│   Next.js App   │                 │  NestJS API    │
│   :3000         │                 │  :4000         │
│                 │                 │                │
│  • SSR/ISR      │                 │  • Auth        │
│  • API Routes   │                 │  • Users       │
│  • JWT Auth     │                 │  • Blog        │
│  • Framer Motion│                 │  • Notify      │
└───────┬─────────┘                 └───────┬─────────┘
        │                                  │
┌───────▼──────────────────────────────────▼─────────────────┐
│                    PostgreSQL Database                       │
│  users | accounts | sessions | blogs | portfolios | jobs    │
└─────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                        Redis Cache                           │
│              Sessions | Rate Limiting | Caching              │
└─────────────────────────────────────────────────────────────┘
```

## RBAC Design

### Roles
- **USER** - Default role for registered users
- **VENDOR** - Service providers (hotels, restaurants)
- **MANAGER** - Platform managers with elevated permissions
- **ADMIN** - System administrators
- **SUPER_ADMIN** - Full system access

### Permission Strategy
- Roles are stored in user metadata
- Roles are included in JWT tokens as custom claims
- NestJS middleware extracts roles from tokens
- Route guards check role requirements before allowing access
