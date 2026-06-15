import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async () => {
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(faqs);
});

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const { question, answer, category, order, published } = body;
  if (!question || !answer) {
    throw createApiError('Missing required fields', 400);
  }
  const faq = await prisma.fAQ.create({
    data: { question, answer, category: category || 'general', order: order || 0, published: published ?? true },
  });
  return NextResponse.json(faq, { status: 201 });
});
