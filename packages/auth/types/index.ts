export type UserRole = 'USER' | 'VENDOR' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  accessTokenExpiresAt: number;
}

export interface AuthConfig {
  audience: string;
  scope: string;
  apiUrl: string;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
};

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_ERROR'; payload: Error }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: AuthUser | null };
