import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler, createApiError } from '@/lib/api-handler';

export const GET = apiHandler(async () => {
  const teams = await prisma.team.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(teams);
});

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const { name, role, bio, image, email, phone, linkedin, github, twitter, website, order, published } = body;
  if (!name || !role) {
    throw createApiError('Missing required fields', 400);
  }
  const team = await prisma.team.create({
    data: { name, role, bio, image, email, phone, linkedin, github, twitter, website, order: order || 0, published: published ?? true },
  });
  return NextResponse.json(team, { status: 201 });
});
