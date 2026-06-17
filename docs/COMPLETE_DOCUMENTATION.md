# KSW TechZone - Complete Project Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Tech Stack & Dependencies](#3-tech-stack--dependencies)
4. [Project Structure](#4-project-structure)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture (NestJS)](#6-backend-architecture-nestjs)
7. [Database Schema (Prisma)](#7-database-schema-prisma)
8. [Reusable Auth Package](#8-reusable-auth-package)
10. [UI/UX Design System](#10-uiux-design-system)
11. [Pages & Features](#11-pages--features)
12. [API Routes](#12-api-routes)
13. [Security Implementation](#13-security-implementation)
14. [SEO Optimization](#14-seo-optimization)
15. [Docker & Deployment](#15-docker--deployment)
16. [CI/CD Pipeline](#16-cicd-pipeline)
17. [Development Workflow](#17-development-workflow)
18. [Production Checklist](#18-production-checklist)

---

## 1. Project Overview

KSW TechZone is an enterprise-grade corporate website and centralized Single Sign-On (SSO) platform. It serves two primary purposes:

1. **Public-facing corporate website** - Showcasing KSW TechZone's services, products, portfolio, blog, and company information.
2. **Centralized KSW Account (SSO) Platform** - Enabling users to create one account and access all KSW products (KSW Hospitality, Ghantaghar.com, Hourly Place, etc.) without separate logins.

### Key Features
- Modern, premium UI with glassmorphism, animations, and dark/light mode
- Full SEO optimization targeting Lighthouse 95+ scores
- Centralized authentication with role-based access control
- Role-Based Access Control (RBAC) with 5 roles
- Multi-tenant architecture supporting all KSW products
- PM2 process manager with Nginx reverse proxy
- CI/CD ready with GitHub Actions

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DNS (Cloudflare)                             │
│                    kswtechzone.com / *.kswtechzone.com               │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                         Nginx Reverse Proxy                          │
│                     kswtechzone.com:443 (SSL)                        │
│                    login.kswtechzone.com:443 (SSL)                   │
└───────────┬──────────────────────────────────┬──────────────────────┘
            │                                  │
┌───────────▼──────────────┐    ┌──────────────▼──────────────────────┐
│    Next.js Frontend       │    │      NestJS Backend (API Gateway)   │
│    Port 3000              │    │      Port 4000                      │
│                           │    │                                     │
│  • App Router (SSR/ISR)   │    │  • Auth Service                     │
│  • API Routes (BFF)       │    │  • User Service                     │
│  • Auth Integration       │    │  • Blog Service                     │
│  • Framer Motion Anim.    │    │  • Notification Service             │
│  • Tailwind CSS / Shadcn  │    │  • Rate Limiting                    │
│  • Dark/Light Mode        │    │  • Audit Logging                    │
└───────────┬───────────────┘    └──────────────┬──────────────────────┘
            │                                  │
┌───────────▼──────────────────────────────────▼──────────────────────┐
│                         PostgreSQL Database                          │
│                                                                     │
│  Tables: users, accounts, sessions, notifications, blogs,           │
│  portfolios, testimonials, contacts, jobs, job_applications,        │
│  audit_logs, admins                                                  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────┐
│                            Redis Cache                               │
│              Sessions | Rate Limiting | API Caching                  │
└─────────────────────────────────────────────────────────────────────┘
                                 │

```

### SSO Flow
1. User visits any KSW application (website, hospitality, ghantaghar, etc.)
2. Click "Sign In" → Redirected to login page
3. User authenticates with credentials → system issues JWT with user info + roles
4. Callback redirects back to the requesting application with session
5. User is now authenticated across ALL KSW applications (SSO)

---

## 3. Tech Stack & Dependencies

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.2.25 | React framework with App Router |
| react / react-dom | ^18.2.0 | UI library |
| typescript | ^5.3.3 | Type safety |
| tailwindcss | ^3.4.1 | Utility-first CSS |
| framer-motion | ^11.0.0 | Animations & transitions |
| gsap | ^3.12.5 | Advanced animations |

| next-themes | ^0.3.0 | Dark/light mode |
| lucide-react | ^0.344.0 | Icons |
| react-hook-form | ^7.50.0 | Form handling |
| zod | ^3.22.4 | Schema validation |
| @hookform/resolvers | ^3.3.4 | Form + Zod integration |
| recharts | ^2.12.0 | Charts and graphs |
| prismjs / marked | ^1.29.0 / ^12.0.0 | Markdown rendering |

### UI Components (Shadcn/Radix)
| Package | Purpose |
|---------|---------|
| @radix-ui/react-accordion | Accordion component |
| @radix-ui/react-avatar | Avatar component |
| @radix-ui/react-dialog | Modal dialogs |
| @radix-ui/react-dropdown-menu | Dropdown menus |
| @radix-ui/react-label | Form labels |
| @radix-ui/react-select | Select dropdowns |
| @radix-ui/react-separator | Visual separators |
| @radix-ui/react-slot | Slot pattern |
| @radix-ui/react-switch | Toggle switches |
| @radix-ui/react-tabs | Tab components |
| @radix-ui/react-toast | Toast notifications |
| @radix-ui/react-tooltip | Tooltips |
| class-variance-authority | Component variants |
| tailwind-merge | Tailwind class merging |
| tailwindcss-animate | Tailwind animation utilities |
| clsx | Conditional classNames |

### Backend (NestJS)
| Package | Purpose |
|---------|---------|
| @nestjs/common/core/platform-express | NestJS framework |
| @nestjs/passport/jwt | JWT authentication |
| @nestjs/throttler | Rate limiting |
| passport-jwt / jwks-rsa | JWT validation with JWKS |
| helmet | Security headers |
| class-validator / class-transformer | Request validation |
| @prisma/client | Database ORM |

### Database & Infrastructure
| Tool | Purpose |
|------|---------|
| PostgreSQL 16 | Primary database |
| Prisma ORM 6 | Database schema & client |
| Redis 7 | Caching & sessions |
| PM2 | Process manager |
| Nginx | Reverse proxy & SSL termination |
| Let's Encrypt | SSL certificates |

---

## 4. Project Structure

```
ksw-website2/
│
├── src/                              # Frontend source (Next.js)
│   ├── app/                          # App Router pages
│   │   ├── layout.tsx                # Root layout (Nav, Footer, Theme)
│   │   ├── page.tsx                  # Home page
│   │   ├── globals.css               # Global styles + CSS vars
│   │   ├── robots.ts                 # SEO robots.txt
│   │   ├── sitemap.ts                # SEO sitemap.xml
│   │   ├── not-found.tsx             # 404 page
│   │   │
│   │   ├── about/                    # About page
│   │   ├── services/                 # Services showcase
│   │   ├── products/                 # Products showcase
│   │   ├── portfolio/                # Portfolio with filtering
│   │   ├── blog/                     # Blog listing + detail
│   │   ├── careers/                  # Careers + job listings
│   │   ├── contact/                  # Contact form
│   │   │
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   │
│   │   ├── account/                  # User dashboard
│   │   │   ├── dashboard/
│   │   │   ├── settings/
│   │   │   ├── security/
│   │   │   └── sessions/
│   │   │
│   │   ├── admin/                    # Admin panel
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   └── blogs/ (new/edit)
│   │   │
│   │   └── api/                      # API Routes (BFF)
│   │       ├── auth/                 # Auth handler + login
│   │       ├── users/                # User sync
│   │       ├── blogs/                # Blog CRUD
│   │       ├── contacts/             # Contact submission
│   │       ├── jobs/                 # Job CRUD
│   │       ├── portfolio/            # Portfolio CRUD
│   │       ├── testimonials/         # Testimonials CRUD
│   │       └── upload/               # File upload
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # Shadcn UI primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── label.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── navbar.tsx            # Navigation bar
│   │   │   ├── footer.tsx            # Page footer
│   │   │   └── toaster.tsx           # Toast notifications
│   │   │
│   │   ├── home/                     # Home page sections
│   │   │   ├── hero.tsx
│   │   │   ├── services-overview.tsx
│   │   │   ├── products-showcase.tsx
│   │   │   ├── stats-section.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── why-choose-us.tsx
│   │   │   └── cta-section.tsx
│   │   │
│   │   ├── about/                    # Legacy components
│   │   ├── Card/                     # Legacy card components
│   │   ├── Admin/                    # Legacy admin components
│   │   ├── HomeComponent/            # Legacy home sections
│   │   ├── Footer/                   # Legacy footer
│   │   ├── Header/                   # Legacy navbar
│   │   ├── Pricing/                  # Legacy pricing
│   │   └── ContactComponent/         # Legacy contact
│   │
│   ├── lib/                          # Utilities
│   │   ├── utils.ts                  # cn(), formatDate(), slugify()
│   │   └── prisma.ts                 # Prisma client singleton
│   │
│   ├── hooks/                        # Custom hooks
│   │   └── use-toast.ts              # Toast hook
│   │
│   └── types/                        # TypeScript types
│       └── env.d.ts                  # Environment types
│
├── packages/                         # Shared packages
│   └── auth/                         # Reusable auth module
│       ├── package.json
│       ├── index.ts                  # Public exports
│       ├── components/
│       │   ├── auth-provider.tsx      # React context provider
│       │   └── protected-route.tsx   # Route guard component
│       ├── hooks/
│       │   ├── use-auth.ts           # Auth hook
│       │   └── use-role-guard.ts     # RBAC hook
│       ├── middleware/
│       │   └── session.ts            # Session middleware
│       ├── types/
│       │   └── index.ts              # Auth types
│       └── utils/
│           └── token.ts              # JWT helpers
│
├── backend/                          # NestJS backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── src/
│       ├── main.ts                   # Entry point (helmet, CORS, validation)
│       ├── app.module.ts             # Root module (throttler, microservices)
│       ├── prisma/                   # Prisma service
│       ├── common/                   # Shared backend code
│       │   ├── guards/

│       │   │   └── roles.guard.ts    # RBAC enforcement
│       │   ├── interceptors/
│       │   │   └── audit.interceptor.ts  # Audit logging
│       │   └── decorators/
│       │       ├── roles.decorator.ts     # @Roles() decorator
│       │       └── current-user.decorator.ts  # @CurrentUser() decorator
│       └── services/
│           ├── auth/                 # Auth microservice
│           ├── user/                 # User microservice
│           ├── blog/                 # Blog microservice
│           └── notification/         # Notification microservice
│
├── prisma/                           # Database
│   └── schema.prisma                 # Complete schema (12 models)
│
├── nginx/                            # Nginx configuration
│   └── kswtechzone.conf              # Site config
│
├── scripts/                          # Deployment scripts
│   ├── deploy.sh
│   └── setup.sh
│
├── ecosystem.config.cjs              # PM2 process configuration
│
├── .github/
│   └── workflows/
│       └── deploy.yml                # CI/CD pipeline
│
├── docs/                             # Documentation
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── SECURITY.md
│   └── COMPLETE_DOCUMENTATION.md     # This file
│
├── .env                              # Environment variables
├── .env.example                      # Template for .env
├── tailwind.config.js                # Tailwind design system
├── next.config.mjs                   # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Root package.json
```

---

## 5. Frontend Architecture

### Design System

#### Colors (CSS Custom Properties)
The design uses HSL color variables with a `--primary` hue of 239 (indigo/purple):

```css
:root {
  --primary: 239 84% 67%;     /* #6366f1 - KSW Indigo */
  --background: 0 0% 100%;    /* White */
  --foreground: 222.2 84% 4.9%;  /* Near black */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

#### KSW Brand Colors
Custom `ksw` color scale in tailwind.config.js:
- `ksw-500`: `#6366f1` (primary indigo)
- Full scale: 50-950 for all use cases

#### Typography
- **Sans**: Inter (primary), system-ui fallback
- **Display**: Cal Sans, Inter
- Global `font-feature-settings: 'rlig' 1, 'calt' 1`

#### Glassmorphism Utilities
```css
.glass {          /* Light glass effect */
  @apply bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl;
}
.glass-dark {     /* Dark glass effect */
  @apply bg-black/20 backdrop-blur-xl border border-white/10 shadow-xl;
}
.glass-card {     /* Card glass */
  @apply bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg;
}
```

#### Gradient Utilities
```css
.gradient-text {  /* Text gradient */
  @apply bg-clip-text text-transparent bg-gradient-to-r from-ksw-400 via-ksw-500 to-ksw-600;
}
.hero-gradient {  /* Background radial gradient */
  background: radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.15), transparent);
}
```

#### Animations (tailwind.config.js)
| Name | Duration | Effect |
|------|----------|--------|
| `float` | 6s | Floating up and down |
| `float-delayed` | 6s (3s delay) | Floating with offset |
| `shimmer` | 3s | Shimmer effect |
| `spin-slow` | 20s | Slow rotation |
| `accordion-down/up` | 0.2s | Accordion transitions |

### Component Architecture

**Layout Components** (persistent across pages):
- `ThemeProvider` - Wraps entire app, manages dark/light mode
- `Navbar` - Fixed header with dropdown menus, mobile hamburger, theme toggle, auth buttons
- `Footer` - Multi-column footer with links, social icons, contact info

**UI Primitives** (Shadcn-style):
- All Radix-based with `cn()` utility for class merging
- Support dark mode automatically via CSS variables
- Variant systems via CVA (class-variance-authority)

**Page Sections**: Built as independent components that compose into pages

### State Management
- **Server State**: Next.js API Routes (BFF pattern)
- **Auth State**: React Context (packages/auth)
- **UI State**: React hooks (useState, useReducer)
- **Theme**: next-themes library

### Routing (Next.js App Router)
- File-based routing in `/src/app/`
- Dynamic routes: `[slug]`, `[id]`
- API routes in `/src/app/api/`
- Edge middleware for auth protection

---

## 6. Backend Architecture (NestJS)

### Overview
NestJS backend provides a secure API gateway with microservices architecture.

### Key Components

#### main.ts
```typescript
- Global prefix: /api/v1
- CORS: Whitelisted origins
- Helmet: Security headers
- ValidationPipe: Request validation (whitelist, transform)
- Port: 4000
```

#### app.module.ts
```typescript
- ThrottlerModule: Rate limiting (100 req/min)
- AuthModule: JWT validation
- UserModule: User CRUD, lazy sync
- BlogModule: Blog management
- NotificationModule: User notifications
- Global ThrottlerGuard
```

#### JWT Auth Guard
```typescript
- Strategy: passport-jwt with jwks-rsa
- Algorithm: RS256 (asymmetric)

```

#### Roles Guard
```typescript
- Extracts roles from JWT custom claim: https://kswtechzone.com/roles
- Checks against @Roles() decorator metadata
- RBAC enforcement at route level
```

#### Audit Interceptor
```typescript
- Logs all API requests
- Captures: userId, action, entity, IP, user-agent, duration
- Stores in audit_logs table
- Non-blocking (fire and forget)
```

### Microservices Structure
Each microservice follows Clean Architecture:
- **Module**: NestJS module definition
- **Controller**: Route handlers with guards
- **Service**: Business logic
- **Repository**: Prisma data access (via shared PrismaService)

---

## 7. Database Schema (Prisma)

### Models Overview (12 models)

#### User & Authentication
| Model | Key Fields | Purpose |
|-------|-----------|---------|
| `User` | id, email, name, role (enum), status | Core user profile |
| `Account` | userId, provider, providerAccountId | OAuth account linking |
| `Session` | userId, sessionToken, expires, ipAddress | Login sessions |

#### Content
| Model | Key Fields | Purpose |
|-------|-----------|---------|
| `Blog` | title, slug (unique), category, tags[], content, published | Blog posts |
| `Portfolio` | title, slug (unique), category, images[], tags[] | Project showcase |
| `Testimonial` | name, role, content, rating, image | Client testimonials |

#### Business
| Model | Key Fields | Purpose |
|-------|-----------|---------|
| `Contact` | name, email, service, message, status | Contact inquiries |
| `Job` | title, department, location, type, requirements[] | Job listings |
| `JobApplication` | jobId, userId, name, email, resume, status | Job applications |

#### System
| Model | Key Fields | Purpose |
|-------|-----------|---------|
| `Notification` | userId, type, channel, title, message, read | User notifications |
| `AuditLog` | userId, action, entity, metadata, ipAddress | Security audit trail |
| `Admin` | username (unique), password | Legacy admin access |

### Enums
- `UserRole`: USER, VENDOR, MANAGER, ADMIN, SUPER_ADMIN
- `UserStatus`: ACTIVE, INACTIVE, SUSPENDED, BANNED
- `NotificationType`: EMAIL, SMS, PUSH, IN_APP
- `NotificationChannel`: ACCOUNT, SECURITY, MARKETING, SYSTEM

### Key Relationships
```
User 1──N Account
User 1──N Session
User 1──N Notification
User 1──N Blog (author)
User 1──N JobApplication
Job 1──N JobApplication
```

---

## 8. Reusable Auth Package

The `packages/auth/` directory is a standalone npm package (`@ksw/auth`) that can be consumed by any KSW application.

### Exports (index.ts)
```typescript
export { AuthProvider }      // React context provider
export { ProtectedRoute }    // Route guard component
export { useAuth }           // Auth hook
export { useRoleGuard }      // RBAC hook
export { sessionMiddleware } // Edge middleware
export { decodeToken, isTokenExpired, getTokenExpiration } // JWT utilities
export type { AuthUser, AuthSession, UserRole, AuthConfig }
```

### Usage in Other Applications
```typescript
// _app.tsx or layout.tsx
import { AuthProvider } from '@ksw/auth';

export default function RootLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

// dashboard/page.tsx
import { useAuth, ProtectedRoute } from '@ksw/auth';
import { UserRole } from '@ksw/auth/types';

function Dashboard() {
  const { user, logout } = useAuth();
  return <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
    ...
  </ProtectedRoute>;
}
```

### Key Features
- **Framework-agnostic** (works with any React/Next.js app)
- **Type-safe** with full TypeScript types
- **Tree-shakeable** - import only what you need
- **Zero runtime dependencies** beyond React and Next.js
- **Supports all KSW products** - single auth module, no code duplication

---

## 10. UI/UX Design System

### Visual Style
- **Premium/Modern**: Inspired by Stripe, Vercel, Linear, Notion
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Gradients**: Subtle gradient overlays on backgrounds
- **Dark/Light Mode**: Full support with smooth transitions

### Component Examples

#### Button Variants
| Variant | Usage |
|---------|-------|
| `default` | Primary CTA (bg-primary, shadow) |
| `gradient` | Gradient background (from-ksw-500 to-ksw-700) |
| `glass` | Glass effect (transparent + blur) |
| `outline` | Bordered |
| `ghost` | Minimal |
| `secondary` | Secondary action |

#### Card System
- `Card`: Outer container with border + shadow
- `CardHeader`: Header section
- `CardTitle`: Title typography
- `CardDescription`: Subtitle text
- `CardContent`: Body content
- `CardFooter`: Footer actions

### Animation Philosophy
- **Subtle**: Micro-interactions enhance UX, don't distract
- **Purposeful**: Animations guide attention, provide feedback
- **Performant**: Use CSS transforms/opacity (GPU-accelerated)
- **Smooth**: 60fps with Framer Motion spring physics

### Responsive Breakpoints
| Breakpoint | Width | Target |
|-----------|-------|--------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1400px | Large screens |

---

## 11. Pages & Features

### Home Page (`/`)
| Section | Component | Features |
|---------|-----------|----------|
| Hero | `hero.tsx` | Animated gradient bg, floating shapes, CTA buttons |
| Services | `services-overview.tsx` | 8 service cards with icons, hover effects |
| Products | `products-showcase.tsx` | 5 product cards with status badges |
| Stats | `stats-section.tsx` | Animated counters (50+ projects, 30+ clients) |
| Testimonials | `testimonials.tsx` | Client quotes with star ratings |
| Why Us | `why-choose-us.tsx` | 6 value propositions with icons |
| CTA | `cta-section.tsx` | Gradient banner, dual CTA buttons |

### About Page (`/about`)
- Company story with vision & mission
- 4 core values (Innovation, Integrity, Excellence, Partnership)
- Team members grid with photos

### Services Page (`/services`)
- 15 detailed service sections
- Each with icon, description, feature list
- Alternating background for visual separation
- Anchor IDs for navigation (`/services#software`)

### Products Page (`/products`)
- 5 products: KSW Hospitality, Ghantaghar.com, Hourly Place, KSW Marketing, KIRA
- Each with icon, tagline, features, status badge
- Anchor IDs for direct linking

### Portfolio Page (`/portfolio`)
- Filterable project grid (All, Web App, Mobile App, SaaS, E-commerce, ERP)
- Project cards with category badges, tech tags
- Animated filter transitions

### Blog Page (`/blog`)
- Search functionality
- Category filter chips
- Post cards with read time, date, excerpt
- Individual post page with rich content

### Careers Page (`/careers`)
- Job listing with type filter (All, Full-time, Internship)
- Job cards with department, location, type
- Apply Now buttons

### Contact Page (`/contact`)
- Contact information cards (email, phone, location, hours)
- Contact form with validation
- API integration for form submission
- Toast notifications for success/error

### Auth Pages (`/auth/*`)
| Page | Features |
|------|----------|
| Login | Email/password, Google SSO, GitHub SSO, "Forgot password" link |
| Register | Full name, email, password, social login options, terms acceptance |
| Forgot Password | Email input, reset link |
| Reset Password | New password + confirmation |

### Account Dashboard (`/account/*`)
| Page | Features |
|------|----------|
| Dashboard | User avatar, quick links, connected applications list |
| Settings | Profile edit, notification preferences |
| Security | Password change, MFA setup |
| Sessions | Active sessions list, revoke access |

---

## 12. API Routes

### Frontend API Routes (Next.js BFF)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/login` | POST | Admin login handler |
| `/api/auth/login` | POST | Legacy admin login |
| `/api/auth/me` | GET | Get current user session |

| `/api/blogs` | GET/POST | List all / Create blog |
| `/api/blogs/[id]` | GET/PUT/DELETE | CRUD single blog |
| `/api/contacts` | GET/POST | List / Submit contact |
| `/api/jobs` | GET/POST | List all / Create job |
| `/api/jobs/[id]` | GET/PATCH/DELETE | CRUD single job |

### Backend API Routes (NestJS)

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/v1/auth/profile` | GET | JWT | Get user profile |
| `/api/v1/auth/sync` | POST | JWT | Sync user to DB |
| `/api/v1/auth/logout` | POST | - | Logout |
| `/api/v1/users/sync` | POST | JWT | Create/update local user |

---

## 13. Security Implementation

### OWASP Top 10 Coverage

| # | Category | Implementation |
|---|----------|---------------|
| 1 | Broken Access Control | RBAC, route guards, middleware |
| 2 | Cryptographic Failures | HTTPS (HSTS), RS256 JWTs, bcrypt hashing |
| 3 | Injection | Prisma ORM (parameterized queries), Zod validation |
| 4 | Insecure Design | Clean Architecture, SOLID principles, rate limiting |
| 5 | Security Misconfiguration | Helmet headers, CORS whitelist, no debug endpoints |
| 6 | Vulnerable Components | npm audit, regular updates, dependency scanning |
| 7 | Auth Failures | MFA, session management |
| 8 | Data Integrity | JWT signature verification, SameSite cookies, audit logs |
| 9 | Logging & Monitoring | Audit logs for all mutations, structured logging |
| 10 | SSRF | URL validation, network isolation |

### Security Headers (Nginx)
```nginx
add_header Strict-Transport-Security "max-age=63072000" always;
add_header X-Frame-Options SAMEORIGIN;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy strict-origin-when-cross-origin;
```

### Rate Limiting
- **Nginx**: 100 requests/second per IP
- **NestJS**: 100 requests/minute globally (ThrottlerModule)
- **Auth endpoints**: Additional rate limiting

### Session Security
- HTTP-only cookies
- SameSite=Lax
- Secure flag in production
- Session expiry: 1 day (configurable)
- Audit logging for all auth events

---

## 14. SEO Optimization

### Metadata (layout.tsx)
- Dynamic title template: `%s | KSW TechZone`
- Rich description with keywords
- Open Graph tags (og:title, og:description, og:image)
- Twitter Cards (summary_large_image)
- Canonical URL via `metadataBase`

### Structured Data
- Organization schema (JSON-LD)
- Product schemas for platforms
- Blog post schema for articles

### Technical SEO
- `robots.ts`: Automatically generated robots.txt
- `sitemap.ts`: Dynamic sitemap.xml with all routes
- Semantic HTML (h1-h6 hierarchy, landmarks)
- Proper alt text on images
- Semantic URLs (no query params)
- Mobile-responsive design

### Performance Targets
| Metric | Target |
|--------|--------|
| Performance | ≥95 |
| Accessibility | ≥95 |
| Best Practices | ≥95 |
| SEO | 100 |

---

## 15. Deployment (PM2 + Nginx)

### Process Manager (PM2)

| App | Script | Port |
|-----|--------|------|
| ksw-frontend | `next start -p 3000` | 3000 |

Managed via `ecosystem.config.cjs` with auto-restart, log rotation, and memory limit (1G).

### Nginx Configuration
- HTTP → HTTPS redirect
- SSL termination with Let's Encrypt
- Security headers
- Reverse proxy to frontend (localhost:3000)
- WebSocket support
- Gzip compression

### Deployment Steps
1. Set up Ubuntu VPS with Node.js 20+, pnpm, PM2, and Nginx
2. Configure SSL certificates via Let's Encrypt (`certbot --nginx`)
3. Clone repository
4. Configure `.env` with production values
5. Run `pnpm install && pnpm build`
6. Run `npx prisma migrate deploy`
7. Start with `pm2 start ecosystem.config.cjs --env production`
8. Copy nginx config and reload: `sudo systemctl reload nginx`

---

## 16. CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

**Jobs**:

1. **lint-and-typecheck**
   - Checkout code
   - Install dependencies
   - Generate Prisma client
   - Run ESLint
   - Run TypeScript check

2. **build**
   - Depends on lint-and-typecheck
   - Build Next.js application
   - Upload build artifacts

3. **deploy** (main branch only)
   - Depends on build
   - Copy files to VPS via SCP
   - SSH into VPS
   - Run deploy script
   - Check service health

### Deployment Script (scripts/deploy.sh)
1. Pull latest git changes
2. Load environment variables
3. Install dependencies & build
4. Run database migrations
5. Restart PM2 application
6. Reload Nginx
7. Health check via curl

---

## 17. Development Workflow

### Setup
```bash
git clone https://github.com/kswtechzone/ksw-website2.git
cd ksw-website2
cp .env.example .env  # Configure with your values
npm install
npx prisma generate
npx prisma db push    # Create database tables
npm run dev            # Start development server (localhost:3000)
```

### Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Create/apply migrations |

### Code Organization Principles
- **Feature-based**: Components grouped by feature (home, about, auth)
- **Single Responsibility**: Each component does one thing
- **Composition over Inheritance**: Compose small components
- **Clean Architecture**: UI → Application → Domain → Infrastructure layers
- **DRY**: Reusable auth package prevents code duplication

### Git Workflow
1. Create feature branch from `main`
2. Make changes, commit with descriptive messages
3. Create PR to `main`
4. CI runs lint + typecheck + build
5. Merge after review
6. Auto-deploy to production

---

## 18. Production Checklist

### Pre-Launch
- [ ] Custom domain verified and active
- [ ] SSL certificates installed (Let's Encrypt)
- [ ] `.env` configured with production values (no placeholder secrets)
- [ ] Database migration applied
- [ ] CORS origins set to production domains
- [ ] Rate limiting configured for production traffic
- [ ] Security headers verified
- [ ] Google Analytics / search console set up
- [ ] Sitemap submitted to Google Search Console
- [ ] Robots.txt configured

### Security
- [ ] All secrets in environment variables (not in code)
- [ ] PostgreSQL at rest encryption enabled
- [ ] HTTPS enforced with HSTS
- [ ] HTTP → HTTPS redirect
- [ ] CORS restricted to known origins
- [ ] Rate limiting enabled at Nginx and application level
- [ ] Fail2ban installed on VPS
- [ ] UFW firewall (only ports 80, 443, 22)
- [ ] SSH key-only authentication
- [ ] Regular automated database backups
- [ ] PM2 processes not running as root
- [ ] Audit logging enabled and monitored

### Monitoring
- [ ] PM2 process health checks
- [ ] Application performance monitoring (APM)
- [ ] Error tracking (Sentry or similar)
- [ ] Uptime monitoring
- [ ] Database query performance monitoring
- [ ] SSL certificate expiry monitoring
- [ ] Disk space monitoring
- [ ] Memory/CPU usage alerts

### Post-Launch
- [ ] Verify Lighthouse scores (95+ all categories)
- [ ] Test all pages and forms
- [ ] Test auth flow end-to-end
- [ ] Test RBAC (different roles get correct access)
- [ ] Verify responsive design (mobile, tablet, desktop)
- [ ] Verify dark/light mode
- [ ] Test contact form submission
- [ ] Test blog creation via admin panel
- [ ] Run security audit
- [ ] Regular dependency updates
