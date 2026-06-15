import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    throw createApiError('Blog not found', 404);
  }

  return NextResponse.json(blog);
});

export const PUT = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const body = await req.json();
  const blog = await prisma.blog.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(blog);
});

export const DELETE = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  await prisma.blog.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Blog deleted successfully' });
});
