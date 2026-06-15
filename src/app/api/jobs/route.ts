import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get('admin') === 'true';

  const jobs = await prisma.job.findMany({
    where: isAdmin ? {} : { status: 'active' },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(jobs);
});

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const { title, department, location, type, description, status } = body;

  if (!title || !department || !location || !description) {
    throw createApiError('Missing required fields', 400);
  }

  const job = await prisma.job.create({
    data: {
      title,
      department,
      location,
      type: type || 'Full-time',
      description,
      status: status || 'active',
    },
  });

  return NextResponse.json(
    { message: 'Job created successfully', job },
    { status: 201 }
  );
});
