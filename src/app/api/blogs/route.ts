import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async () => {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(blogs);
});

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const { title, slug, category, tags, image, description, content, author } = body;

  if (!title || !slug || !category || !description || !content) {
    throw createApiError('Missing required fields', 400);
  }

  const blog = await prisma.blog.create({
    data: {
      title,
      slug,
      category,
      tags: tags || [],
      image,
      description,
      content,
      author: author || 'KSW TechZone',
    },
  });

  return NextResponse.json(
    { message: 'Blog created successfully', blog },
    { status: 201 }
  );
});
