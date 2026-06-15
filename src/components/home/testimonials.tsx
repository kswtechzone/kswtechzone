'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    quote: 'KSW TechZone transformed our business operations with their custom software solution. The team was professional, responsive, and delivered beyond our expectations.',
    name: 'Rajesh Sharma',
    role: 'CEO, Himalaya Enterprises',
    initials: 'RS',
  },
  {
    quote: 'Working with KSW on our e-commerce platform was a game-changer. Their expertise in web development and digital marketing helped us triple our online sales within six months.',
    name: 'Anita Thapa',
    role: 'Founder, Kathmandu Crafts',
    initials: 'AT',
  },
  {
    quote: 'The mobile app KSW developed for our hotel chain exceeded all expectations. Guest satisfaction scores improved by 40% after launch. Highly recommended!',
    name: 'Sagar Pradhan',
    role: 'Director, Mountain Hospitality',
    initials: 'SP',
  },
  {
    quote: 'KIRA, their AI assistant, has revolutionized our customer support. Response times dropped from hours to seconds. The team at KSW truly understands innovation.',
    name: 'Priya Gurung',
    role: 'CTO, TechVentures Nepal',
    initials: 'PG',
  },
  {
    quote: 'From concept to delivery, KSW TechZone demonstrated exceptional professionalism. Their cloud solutions saved us 60% on infrastructure costs while improving performance.',
    name: 'Arun Basnet',
    role: 'Operations Head, Digital Nepal',
    initials: 'AB',
  },
];

export function TestimonialsSection() {
  const [[index, direction], setIndex] = React.useState([0, 0]);

  const paginate = (newDirection: number) => {
    setIndex(([current]) => [
      (current + newDirection + testimonials.length) % testimonials.length,
      newDirection,
    ]);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 gradient-grid opacity-20" />
      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from the businesses and partners we&apos;ve had the privilege of working with.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="relative">
            <button
              onClick={() => paginate(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="relative overflow-hidden w-full px-8 min-h-[280px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={index}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full"
                >
                  <div className="card-3d-static rounded-xl border bg-card/50 backdrop-blur-sm p-8 md:p-10">
                    <Quote className="h-10 w-10 text-ksw-500/30 mb-4" />
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      &ldquo;{testimonials[index].quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-ksw-500 text-ksw-500" />
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-ksw-500/10 text-ksw-500">
                          {testimonials[index].initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonials[index].name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonials[index].role}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => paginate(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex([i, i > index ? 1 : -1])}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-8 bg-ksw-500'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
