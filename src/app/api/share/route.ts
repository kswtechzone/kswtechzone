import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, title, description, image, platform } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || null;

    const userAgent = req.headers.get('user-agent') || null;
    const referrer = req.headers.get('referer') || null;

    try {
      await (prisma as any).shareLog.create({
        data: {
          url,
          title: title || null,
          description: description || null,
          image: image || null,
          platform: platform || null,
          referrer,
          ipAddress,
          userAgent,
          metadata: {
            method: body.method || 'web',
            sharedAt: new Date().toISOString(),
          },
        },
      });
    } catch {
      // share log is non-critical — silently fail
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to log share' }, { status: 500 });
  }
}
