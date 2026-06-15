'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Code2, Globe, Smartphone, Megaphone, Cloud,
  Briefcase, Brain, BarChart3, Building2, Database,
  ShoppingCart, Hotel, Palette, LayoutDashboard, Monitor,
  HeadphonesIcon, Shield, Search, Share2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API } from '@/constants/api';

const iconMap: Record<string, React.ElementType> = {
  Code2, Globe, Smartphone, Megaphone, Cloud,
  Briefcase, Brain, BarChart3, Building2, Database,
  ShoppingCart, Hotel, Palette, LayoutDashboard, Monitor,
  HeadphonesIcon, Shield, Search, Share2,
};

interface Service {
  id: string;
  title: string;
  slug: string;
  icon?: string;
  description: string;
  content?: string;
  features: string[];
  image?: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const [service, setService] = React.useState<Service | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!params.slug) return;
    fetch(`${API.SERVICES}/by-slug/${params.slug}`)
      .then(r => r.json())
      .then(data => { setService(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Button asChild>
            <Link href="/services">Back to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  const Icon = iconMap[service.icon || ''] || Code2;
  const features: string[] = service.features || [];

  return (
    <div className="pt-24">
      <section className="py-24">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button variant="ghost" asChild className="mb-8">
              <Link href="/services">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Link>
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ksw-400 to-ksw-600 flex items-center justify-center">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{service.title}</h1>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-10">
              {service.description}
            </p>

            {features.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature: string) => (
                    <div key={feature} className="flex items-start gap-3 p-4 rounded-xl border bg-card/50">
                      <Check className="h-5 w-5 text-ksw-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.content && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6">Details</h2>
                <div
                  className="prose prose-neutral dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: service.content }}
                />
              </div>
            )}

            <div className="pt-8 border-t">
              <Button size="lg" asChild>
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
