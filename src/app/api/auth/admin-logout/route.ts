import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { apiHandler } from '@/lib/api-handler';

const JWT_SECRET = (process as unknown as { env: Record<string, string | undefined> }).env.JWT_SECRET || 'secret';

export const POST = apiHandler(async () => {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
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
