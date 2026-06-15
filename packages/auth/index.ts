export { AuthProvider } from './components/auth-provider';
export { ProtectedRoute } from './components/protected-route';
export { useAuth } from './hooks/use-auth';
export { useRoleGuard } from './hooks/use-role-guard';
export { sessionMiddleware } from './middleware/session';
export { decodeToken, isTokenExpired, getTokenExpiration } from './utils/token';
export type { AuthUser, AuthSession, UserRole, AuthConfig } from './types';
