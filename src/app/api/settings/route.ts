import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiHandler } from '@/lib/api-handler';

export const GET = apiHandler(async () => {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  settings.forEach(s => { map[s.key] = s.value; });
  return NextResponse.json(map);
});

export const PUT = apiHandler(async (req: Request) => {
  const body = await req.json();
  const entries = Object.entries(body) as [string, string][];
  for (const [key, value] of entries) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  return NextResponse.json({ success: true });
});
