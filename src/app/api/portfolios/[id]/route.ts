import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const portfolio = await prisma.portfolio.findUnique({ where: { id } });
  if (!portfolio) throw createApiError('Not found', 404);
  return NextResponse.json(portfolio);
});

export const PUT = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const body = await req.json();
  const portfolio = await prisma.portfolio.update({ where: { id }, data: body });
  return NextResponse.json(portfolio);
});

export const DELETE = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  await prisma.portfolio.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
