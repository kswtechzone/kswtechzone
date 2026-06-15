'use client';

import { useAuth } from './use-auth';
import type { UserRole } from '../types';

export function useRoleGuard(allowedRoles: UserRole[]) {
  const { user, isLoading } = useAuth();

  const isAuthorized = user ? allowedRoles.includes(user.role) : false;

  return {
    isAuthorized,
    isLoading,
    user,
  };
}
