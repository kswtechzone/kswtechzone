import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async () => {
  const portfolios = await prisma.portfolio.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(portfolios);
});

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const { title, slug, category, description, content, image, images, tags, client, url, github, featured, published } = body;
  if (!title || !slug || !category || !description) {
    throw createApiError('Missing required fields', 400);
  }
  try {
    const portfolio = await prisma.portfolio.create({
      data: { title, slug, category, description, content, image, images: images || [], tags: tags || [], client, url, github, featured: featured || false, published: published || false },
    });
    return NextResponse.json(portfolio, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === 'P2002') throw createApiError('Slug already exists', 409);
    throw error;
  }
});
