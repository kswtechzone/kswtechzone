import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async () => {
  const products = await prisma.product.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(products);
});

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const { title, slug, tagline, description, icon, features, image, status, url, order } = body;
  if (!title || !slug || !description) {
    throw createApiError('Missing required fields', 400);
  }
  try {
    const product = await prisma.product.create({
      data: {
        title, slug, tagline, description, icon, image,
        features: features || [],
        status: status || 'active',
        url, order: order || 0,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === 'P2002') throw createApiError('Slug already exists', 409);
    throw error;
  }
});
