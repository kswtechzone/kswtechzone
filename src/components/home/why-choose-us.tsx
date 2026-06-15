'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Users,
  ShieldCheck,
  Clock,
  HeadphonesIcon,
  Lightbulb,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Skilled professionals with years of experience in cutting-edge technologies.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality First',
    description: 'Rigorous quality assurance processes ensuring enterprise-grade deliverables.',
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    description: 'Agile methodology ensures projects are delivered on schedule and within budget.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Round-the-clock technical support and maintenance for all our solutions.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation Driven',
    description: 'Constantly exploring new technologies to deliver innovative solutions.',
  },
  {
    icon: TrendingDown,
    title: 'Cost-Effective',
    description: 'Competitive pricing without compromising on quality or performance.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function WhyChooseUs() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 bg-muted/30">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="gradient-text">KSW TechZone?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine technical excellence with business acumen to deliver 
            solutions that make a real difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {features.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="flex gap-4 mb-8 last:mb-0"
              >
                <div className="h-12 w-12 rounded-xl bg-ksw-500/10 flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6 text-ksw-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-ksw-500/20 via-ksw-700/20 to-ksw-900/20 rounded-2xl border border-ksw-500/10 flex items-center justify-center p-12">
                <div className="text-center">
                  <Sparkles className="h-16 w-16 text-ksw-500/40 mx-auto mb-4" />
                  <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-lg bg-ksw-500/10 border border-ksw-500/20 flex items-center justify-center"
                      >
                        <div className="h-3 w-3 rounded-full bg-ksw-500/40" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-6">
                    Innovation meets excellence
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-ksw-500/10 via-transparent to-ksw-700/10 rounded-3xl blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
