'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Projects', value: '50+' },
  { label: 'Team Members', value: '10+' },
  { label: 'Products', value: '5+' },
];

const FALLBACK_COUNTRY = 'Global';

interface HeroSectionProps {
  countryName?: string | null;
}

export function HeroSection({ countryName }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="container relative z-10 text-center px-4 py-32">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="block text-sm font-medium text-muted-foreground mb-3 tracking-wider uppercase"
        >
          Welcome to
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/50 text-sm font-medium text-muted-foreground mb-6 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {countryName ?? FALLBACK_COUNTRY}-based Technology Company
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance"
        >
          Transforming Ideas Into{' '}
          <span className="text-primary">Digital Solutions</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          KSW TechZone delivers enterprise-grade software solutions, 
          digital products, and innovative technology services to 
          help businesses thrive in the digital era.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button size="xl" asChild>
            <Link href="/contact">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link href="/services">
              Our Services
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
