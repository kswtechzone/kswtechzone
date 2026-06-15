'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Users, Code2, Package } from 'lucide-react';

const stats = [
  { icon: Briefcase, value: 100, suffix: '+', label: 'Projects Delivered' },
  { icon: Users, value: 50, suffix: '+', label: 'Happy Clients' },
  { icon: Code2, value: 10, suffix: '+', label: 'Team Members' },
  { icon: Package, value: 5, suffix: '+', label: 'Products Launched' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="relative py-24 bg-gradient-to-r from-ksw-900 via-ksw-800 to-ksw-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-ksw-500/10 to-transparent" />
      <div className="container relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, suffix, label }, index) => (
            <motion.div
              key={label}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="h-7 w-7 text-ksw-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                <AnimatedCounter target={value} suffix={suffix} />
              </div>
              <div className="text-sm text-white/70">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
