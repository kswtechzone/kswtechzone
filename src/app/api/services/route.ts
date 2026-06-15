import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async () => {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(services);
});

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const { title, slug, icon, description, content, features, image, order, published } = body;
  if (!title || !slug || !description) {
    throw createApiError('Missing required fields', 400);
  }
  try {
    const service = await prisma.service.create({
      data: { title, slug, icon, description, content, features: features || [], image, order: order || 0, published: published ?? true },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === 'P2002') throw createApiError('Slug already exists', 409);
    throw error;
  }
});
