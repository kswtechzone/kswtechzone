import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const faq = await prisma.fAQ.findUnique({ where: { id } });
  if (!faq) throw createApiError('Not found', 404);
  return NextResponse.json(faq);
});

export const PUT = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const body = await req.json();
  const faq = await prisma.fAQ.update({ where: { id }, data: body });
  return NextResponse.json(faq);
});

export const DELETE = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  await prisma.fAQ.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
