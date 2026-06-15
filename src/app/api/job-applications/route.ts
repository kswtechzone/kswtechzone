import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');
  const where = jobId ? { jobId } : {};
  const applications = await prisma.jobApplication.findMany({
    where,
    include: { job: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(applications);
});

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const { jobId, name, email, phone, resume, coverLetter, portfolio } = body;

  if (!jobId || !name || !email) {
    throw createApiError('Missing required fields: jobId, name, email', 400);
  }

  const application = await prisma.jobApplication.create({
    data: { jobId, name, email, phone, resume, coverLetter, portfolio },
  });

  return NextResponse.json(application, { status: 201 });
});
