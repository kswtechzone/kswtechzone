# Security Architecture

## OWASP Top 10 Compliance

### 1. Broken Access Control
- Role-based access control (RBAC)
- Protected routes with middleware
- API route guards in NestJS
- Principle of least privilege

### 2. Cryptographic Failures
- HTTPS enforced (HSTS headers)
- RS256 signed JWTs
- bcrypt for password hashing
- HTTP-only cookies for sessions
- Environment variables for secrets

### 3. Injection
- Prisma ORM prevents SQL injection
- Input validation with Zod schemas
- Parameterized queries
- XSS protection via React escaping

### 4. Insecure Design
- Clean Architecture principles
- SOLID design patterns
- Regular security reviews
- Rate limiting on all API routes

### 5. Security Misconfiguration
- Helmet.js for security headers
- CORS whitelist configured
- CSP headers set
- Disabled directory listing
- No debug endpoints in production

### 6. Vulnerable Components
- Regular dependency updates
- npm audit in CI pipeline
- Docker image scanning
- Node.js LTS versions

### 7. Authentication Failures
- JWT-based authentication
- MFA support
- Session management
- Brute force protection
- Password policy enforcement

### 8. Data Integrity Failures
- JWT signature verification
- CSRF protection via SameSite cookies
- Request validation
- Audit logging for all mutations

### 9. Logging & Monitoring
- Audit logs for all API calls
- Structured logging
- Error tracking
- Performance monitoring

### 10. SSRF
- URL validation
- Internal network isolation
- Docker network segmentation

## Security Headers

```
Strict-Transport-Security: max-age=63072000
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
```

## API Security

### Rate Limiting
- Nginx: 100 requests/second per IP
- Backend: 100 requests/minute per IP
- Auth endpoints: 10 requests/minute

### Auth Flow
```
Client → Next.js → JWT → NestJS → Validate → Process
```

### JWT Validation
1. Extract token from Authorization header
2. Validate RS256 signature using JWKS
3. Check audience & issuer claims
4. Verify token not expired
5. Extract user info & roles
6. Check authorization

## Data Protection

- Database encryption at rest
- TLS for data in transit
- Secrets in environment variables only
- No sensitive data in logs
- Input sanitization
- Output encoding
