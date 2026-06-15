import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const event = await prisma.timelineEvent.findUnique({ where: { id } });
  if (!event) throw createApiError('Not found', 404);
  return NextResponse.json(event);
});

export const PUT = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const body = await req.json();
  const { year, title, description, icon, order, published } = body;

  const event = await prisma.timelineEvent.update({
    where: { id },
    data: { year, title, description, icon, order, published },
  });

  return NextResponse.json(event);
});

export const DELETE = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  await prisma.timelineEvent.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
