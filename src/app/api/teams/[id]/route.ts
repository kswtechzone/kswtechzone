import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const team = await prisma.team.findUnique({ where: { id } });
  if (!team) throw createApiError('Not found', 404);
  return NextResponse.json(team);
});

export const PUT = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const body = await req.json();
  const team = await prisma.team.update({ where: { id }, data: body });
  return NextResponse.json(team);
});

export const DELETE = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  await prisma.team.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
