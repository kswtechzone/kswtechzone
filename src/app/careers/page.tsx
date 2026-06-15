'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Briefcase, ArrowRight, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { API } from '@/constants/api';

const defaults = [
  {
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Kathmandu, Nepal',
    type: 'Full-time',
    description: 'Build and maintain enterprise-grade web applications using React, Next.js, and Node.js.',
  },
  {
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design beautiful, intuitive interfaces for our SaaS platforms.',
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Kathmandu, Nepal',
    type: 'Full-time',
    description: 'Manage cloud infrastructure, CI/CD pipelines, and container orchestration.',
  },
  {
    title: 'Mobile App Developer',
    department: 'Engineering',
    location: 'Kathmandu, Nepal',
    type: 'Full-time',
    description: 'Develop cross-platform mobile applications using React Native or Flutter.',
  },
  {
    title: 'Digital Marketing Intern',
    department: 'Marketing',
    location: 'Kathmandu, Nepal',
    type: 'Internship',
    description: 'Assist with SEO, social media management, and content marketing.',
  },
  {
    title: 'AI/ML Intern',
    department: 'Engineering',
    location: 'Remote',
    type: 'Internship',
    description: 'Work on machine learning models and AI-powered solutions.',
  },
];

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export default function CareersPage() {
  const [filter, setFilter] = React.useState('All');
  const [jobs, setJobs] = React.useState<Job[]>(defaults as any);
  const [loading, setLoading] = React.useState(true);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);

  const [form, setForm] = React.useState({ name: '', email: '', phone: '', coverLetter: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    fetch(API.JOBS)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setJobs(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? jobs : jobs.filter((j) => j.type === filter);

  const openApply = (job: Job) => {
    setSelectedJob(job);
    setForm({ name: '', email: '', phone: '', coverLetter: '' });
    setSubmitted(false);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmitting(true);
    try {
      const res = await fetch(API.JOB_APPLICATIONS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          coverLetter: form.coverLetter,
        }),
      });
      if (res.ok) setSubmitted(true);
      else alert('Failed to submit application. Please try again.');
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      <section className="py-24 relative">
        <div className="hero-gradient absolute inset-0" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Join Our <span className="gradient-text">Team</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Help us build the future of technology in Nepal.
            </p>
          </motion.div>

          <div className="flex justify-center gap-2 mb-8">
            {['All', 'Full-time', 'Internship'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  filter === type
                    ? 'bg-ksw-500 text-white'
                    : 'bg-accent hover:bg-accent/80'
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading jobs...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No open positions right now.</div>
            ) : (
              filtered.map((job, i) => (
                <motion.div
                  key={job.id || job.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-ksw-500 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => openApply(job)}
                    >
                      Apply Now <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {submitted ? (
            <div className="text-center py-8">
              <Send className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Thank you for applying to {selectedJob?.title}. We&apos;ll review your application and get back to you soon.
              </p>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
                <DialogDescription>
                  Fill out the form below and we&apos;ll be in touch.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+977-98XXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter / Message</Label>
                  <Textarea
                    id="coverLetter"
                    rows={4}
                    value={form.coverLetter}
                    onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                    placeholder="Tell us why you&apos;re a great fit..."
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
