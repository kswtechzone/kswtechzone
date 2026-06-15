import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler } from '@/lib/api-handler';

export const GET = apiHandler(async () => {
  const [blogs, portfolios, teams, services, faqs, jobs, contacts, applications, products] = await Promise.all([
    prisma.blog.count(),
    prisma.portfolio.count(),
    prisma.team.count(),
    prisma.service.count(),
    prisma.fAQ.count(),
    prisma.job.count(),
    prisma.contact.count(),
    prisma.jobApplication.count(),
    prisma.product.count(),
  ]);
  const stats = { blogs, portfolios, teams, services, faqs, jobs, contacts, applications, products };
  return NextResponse.json(stats);
});
