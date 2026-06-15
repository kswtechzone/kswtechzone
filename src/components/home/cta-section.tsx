'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-ksw-900 via-ksw-800 to-ksw-900" />
      <div className="absolute inset-0 bg-gradient-radial from-ksw-500/10 to-transparent" />
      <div className="absolute inset-0 gradient-grid opacity-20" />

      <motion.div
        className="container relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Ready to Transform Your Ideas?
        </h2>
        <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
          Let&apos;s discuss your project and find the perfect solution for your business. 
          Get in touch with our team for a free consultation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="gradient" size="xl" asChild>
            <Link href="/contact">
              Contact Us
              <MessageSquare className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="glass"
            size="xl"
            className="text-white border-white/20 hover:bg-white/10"
            asChild
          >
            <Link href="/contact">
              Get a Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
