import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler } from '@/lib/api-handler';

export const PATCH = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const body = await req.json();
  const app = await prisma.jobApplication.update({ where: { id }, data: body });
  return NextResponse.json(app);
});

export const DELETE = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  await prisma.jobApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
