import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler } from '@/lib/api-handler';

export const DELETE = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ success: true });
});

export const PATCH = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const body = await req.json();
  const contact = await prisma.contact.update({ where: { id }, data: body });
  return NextResponse.json(contact);
});
