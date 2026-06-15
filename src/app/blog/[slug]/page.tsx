'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const postData = {
  slug: 'building-scalable-saas-platforms',
  title: 'Building Scalable SaaS Platforms with Microservices',
  category: 'Development',
  author: 'KSW TechZone',
  date: '2024-01-15',
  readTime: '5 min read',
  content: `
    <h2>Introduction</h2>
    <p>Building a SaaS platform that can scale from hundreds to millions of users requires careful architectural decisions. Microservices architecture has emerged as the leading approach for building scalable, maintainable SaaS platforms.</p>
    
    <h2>Why Microservices?</h2>
    <p>Microservices architecture breaks down your application into small, independent services that each handle a specific business capability. This approach offers several advantages:</p>
    <ul>
      <li><strong>Independent Scaling:</strong> Scale only the services that need it</li>
      <li><strong>Technology Diversity:</strong> Use the best tech stack for each service</li>
      <li><strong>Team Autonomy:</strong> Teams can work independently on different services</li>
      <li><strong>Resilience:</strong> Failure in one service doesn't bring down the entire system</li>
    </ul>

    <h2>Key Architectural Principles</h2>
    <p>When designing a microservices-based SaaS platform, follow these principles:</p>
    <ol>
      <li>Domain-Driven Design (DDD) for service boundaries</li>
      <li>API Gateway pattern for client communication</li>
      <li>Event-driven architecture for async communication</li>
      <li>Database per service for data isolation</li>
      <li>Container orchestration for deployment</li>
    </ol>

    <h2>Technology Stack</h2>
    <p>A modern SaaS stack typically includes:</p>
    <ul>
      <li><strong>Frontend:</strong> Next.js, React, TypeScript</li>
      <li><strong>Backend:</strong> NestJS, Node.js, TypeScript</li>
      <li><strong>Database:</strong> PostgreSQL, Redis</li>
      <li><strong>Message Queue:</strong> RabbitMQ, Kafka</li>
      <li><strong>Container:</strong> Docker, Kubernetes</li>
      <li><strong>Monitoring:</strong> Prometheus, Grafana</li>
    </ul>

    <h2>Conclusion</h2>
    <p>Microservices architecture provides the foundation for building scalable SaaS platforms. By following architectural best practices and using modern tools, you can build systems that grow with your business.</p>
  `,
};

export default function BlogPostPage() {
  const params = useParams();

  return (
    <div className="pt-24">
      <article className="py-24">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button variant="ghost" asChild className="mb-8">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            <Badge variant="secondary" className="mb-4">{postData.category}</Badge>
            <h1 className="text-4xl font-bold mb-6">{postData.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {postData.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {postData.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {postData.readTime}
              </span>
            </div>

            <div
              className="prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: postData.content }}
            />
          </motion.div>
        </div>
      </article>
    </div>
  );
}
