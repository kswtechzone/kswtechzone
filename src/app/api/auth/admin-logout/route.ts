import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { apiHandler } from '@/lib/api-handler';
import { createAuditLog } from '@/lib/audit-log';

const JWT_SECRET = (process as unknown as { env: Record<string, string | undefined> }).env.JWT_SECRET || 'secret';

export const POST = apiHandler(async (req: Request) => {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  let adminId: string | null = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      adminId = decoded.id;
      await prisma.admin.update({
        where: { id: decoded.id },
        data: {
          lastDeviceFingerprint: null,
        },
      });
    } catch {
      // Token invalid — ignore
    }
  }

  if (adminId) {
    await createAuditLog({
      userId: adminId,
      action: 'ADMIN_LOGOUT',
      entity: 'Admin',
      entityId: adminId,
      ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
      userAgent: req.headers.get('user-agent') || null,
    });
  }

  cookieStore.set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    secure: (process as unknown as { env: Record<string, string | undefined> }).env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return NextResponse.json({ message: 'Logged out successfully' });
});
