import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { ServiceContent } from './service-content';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const service = await prisma.service.findUnique({
      where: { slug },
      select: { title: true, description: true, image: true },
    });

    if (!service) return { title: 'Service Not Found' };

    const title = `${service.title} | KSW TechZone - Best ${service.title} Services in Nepal`;
    const desc = service.description
      ? `${service.description.substring(0, 160)}`
      : `Professional ${service.title} services by KSW TechZone Nepal.`;

    return {
      title: `${service.title} | KSW TechZone`,
      description: desc,
      openGraph: {
        title,
        description: desc,
        type: 'website',
        images: service.image
          ? [{ url: service.image, width: 1200, height: 630, alt: service.title }]
          : [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KSW TechZone' }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: desc,
      },
      alternates: {
        canonical: `https://kswtechzone.com/services/${slug}`,
      },
    };
  } catch {
    return { title: 'Service Not Found' };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;

  let service: {
    id: string;
    title: string;
    slug: string;
    icon?: string | null;
    description: string;
    content?: string | null;
    features: string[];
    image?: string | null;
  } | null = null;

  try {
    service = await prisma.service.findUnique({ where: { slug } });
  } catch {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/services/by-slug/${slug}`,
        { cache: 'no-store' }
      );
      if (res.ok) service = await res.json();
    } catch {
      // not found
    }
  }

  if (!service) notFound();

  return <ServiceContent service={service as any} />;
}
