import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  EDITOR: 50,
  VIEWER: 10,
};

interface AdminSession {
  id: string;
  username: string;
  email: string | null;
  role: AdminRole;
}

function getTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  const authCookie = cookies.find(c => c.startsWith('auth_token='));
  if (!authCookie) return null;

  return authCookie.split('=')[1];
}

export async function getAdminFromToken(request: Request): Promise<AdminSession | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  try {
    const { jwtVerify } = await import('jose');
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-change-in-production');
    const { payload } = await jwtVerify(token, secret);

    const adminId = payload.sub as string;
    if (!adminId) return null;

    const admin = await (prisma as any).admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) return null;
    const isActive = (admin as any).isActive !== false;
    if (!isActive) return null;

    return {
      id: admin.id,
      username: admin.username,
      email: admin.email || null,
      role: (admin as any).role || 'ADMIN',
    };
  } catch {
    return null;
  }
}

export function hasMinRole(userRole: AdminRole, requiredRole: AdminRole): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

export function requireRole(requiredRole: AdminRole) {
  return async (request: Request): Promise<AdminSession | NextResponse> => {
    const admin = await getAdminFromToken(request);

    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasMinRole(admin.role, requiredRole)) {
      return NextResponse.json({ message: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

    return admin;
  };
}
