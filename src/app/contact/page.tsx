'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Loader2, Check, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/layout/toaster';
import { API } from '@/constants/api';

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
}

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'info@kswtechzone.com', href: 'mailto:kswtechzone@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+977-9863198323', href: 'tel:+9779863198323' },
  { icon: MapPin, label: 'Location', value: 'Kathmandu, Nepal', href: '#' },
  { icon: Clock, label: 'Hours', value: 'Sun-Fri: 9AM-6PM NPT' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    fetch(API.SERVICES)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setServices(data); })
      .catch(() => {});
  }, []);

  const toggleService = (title: string) => {
    setSelectedServices(prev =>
      prev.includes(title)
        ? prev.filter(s => s !== title)
        : [...prev, title]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      service: selectedServices.join(', ') || undefined,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch(API.CONTACTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to send message');

      form.reset();
      setSelectedServices([]);
      setSent(true);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      <Toaster />
      <section className="py-24 relative">
        <div className="hero-gradient absolute inset-0" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Get In <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a project in mind? We&apos;d love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-ksw-500/10 flex items-center justify-center shrink-0">
                    <info.icon className="h-5 w-5 text-ksw-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{info.label}</div>
                    {info.href ? (
                      <a href={info.href} className="font-medium hover:text-ksw-500 transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <div className="font-medium">{info.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 px-6 rounded-2xl border bg-card"
                >
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                    Thank you for reaching out. We&apos;ll review your message and get back to you within 24 hours.
                  </p>
                  <Button variant="outline" size="lg" onClick={() => setSent(false)}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Services Interested In</Label>
                    {services.length === 0 ? (
                      <Input id="service" name="service" placeholder="Web Development, Mobile App, etc." />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {services.map((s) => {
                          const selected = selectedServices.includes(s.title);
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => toggleService(s.title)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm text-left transition-all ${
                                selected
                                  ? 'border-ksw-500 bg-ksw-500/10 text-ksw-700 dark:text-ksw-300'
                                  : 'border-border bg-background hover:border-ksw-300'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                                selected
                                  ? 'border-ksw-500 bg-ksw-500'
                                  : 'border-muted-foreground/30'
                              }`}>
                                {selected && <Check className="h-3 w-3 text-white" />}
                              </div>
                              {s.title}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your project..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
