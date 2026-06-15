import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    throw createApiError('Job not found', 404);
  }

  return NextResponse.json(job);
});

export const PATCH = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const body = await req.json();
  const { title, department, location, type, description, status } = body;

  const job = await prisma.job.update({
    where: { id },
    data: {
      title,
      department,
      location,
      type,
      description,
      status,
    },
  });

  return NextResponse.json({ message: 'Job updated successfully', job });
});

export const DELETE = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  await prisma.job.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Job deleted successfully' });
});
