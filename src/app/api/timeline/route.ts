import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async () => {
  const events = await prisma.timelineEvent.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(events);
});

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const { year, title, description, icon, order, published } = body;

  if (!year || !title || !description) {
    throw createApiError('Missing required fields: year, title, description', 400);
  }

  const event = await prisma.timelineEvent.create({
    data: { year, title, description, icon: icon || 'Building2', order: order || 0, published: published ?? true },
  });

  return NextResponse.json(event, { status: 201 });
});
