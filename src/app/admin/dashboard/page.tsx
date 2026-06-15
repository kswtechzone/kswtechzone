'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';
import { FileText, FolderKanban, Users, Wrench, HelpCircle, Briefcase, Mail, UserCheck, Package, TrendingUp } from 'lucide-react';

const statCards = [
  { key: 'blogs', label: 'Blog Posts', icon: FileText, color: 'bg-blue-500', href: '/admin/blogs' },
  { key: 'portfolios', label: 'Portfolios', icon: FolderKanban, color: 'bg-purple-500', href: '/admin/portfolios' },
  { key: 'products', label: 'Products', icon: Package, color: 'bg-cyan-500', href: '/admin/products' },
  { key: 'teams', label: 'Team Members', icon: Users, color: 'bg-green-500', href: '/admin/teams' },
  { key: 'services', label: 'Services', icon: Wrench, color: 'bg-orange-500', href: '/admin/services' },
  { key: 'faqs', label: 'FAQs', icon: HelpCircle, color: 'bg-pink-500', href: '/admin/faqs' },
  { key: 'jobs', label: 'Jobs', icon: Briefcase, color: 'bg-teal-500', href: '/admin/jobs' },
  { key: 'contacts', label: 'Contacts', icon: Mail, color: 'bg-red-500', href: '/admin/contacts' },
  { key: 'applications', label: 'Applications', icon: UserCheck, color: 'bg-indigo-500', href: '/admin/job-applications' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API.ADMIN_STATS)
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your KSW TechZone site</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const count = stats[card.key] ?? 0;
          return (
            <Link key={card.key} href={card.href} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.color} bg-opacity-10`}>
                  <Icon className={`h-5 w-5 ${card.color.replace('bg-', 'text-')}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {loading ? <span className="text-slate-300">...</span> : count}
              </div>
              <div className="text-sm text-slate-500">{card.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/admin/portfolios/new" className="text-center px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-primary hover:text-white transition-all">Add Portfolio</Link>
          <Link href="/admin/blogs/new" className="text-center px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-primary hover:text-white transition-all">Write Blog</Link>
          <Link href="/admin/products/new" className="text-center px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-primary hover:text-white transition-all">Add Product</Link>
          <Link href="/admin/teams/new" className="text-center px-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-600 hover:bg-primary hover:text-white transition-all">Add Team Member</Link>
        </div>
      </div>
    </div>
  );
}
