'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API } from '@/constants/api';
import { ArrowLeft, Save } from 'lucide-react';

const ICON_OPTIONS = ['Building2', 'Users', 'Globe', 'Smartphone', 'Brain', 'Code2', 'Megaphone', 'Cloud', 'Shield', 'BarChart3', 'HeadphonesIcon', 'Palette', 'Search', 'Share2'];

export default function NewTimelineEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    icon: 'Building2',
    order: '0',
    published: 'true',
  });

  useEffect(() => { setToken(localStorage.getItem('adminToken')); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API.TIMELINE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, order: parseInt(formData.order), published: formData.published === 'true' }),
      });
      if (res.ok) router.push('/admin/timeline');
      else alert('Failed to create event');
    } catch {
      alert('Error creating event');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/timeline" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Timeline Event</h1>
          <p className="text-slate-500 text-sm mt-1">Add a milestone to the About page timeline</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Year *</label>
              <input type="text" name="year" value={formData.year} onChange={handleChange} required placeholder="2024"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
              <select name="icon" value={formData.icon} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white">
                {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Company Founded"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="Describe this milestone..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Published</label>
            <select name="published" value={formData.published} onChange={handleChange}
              className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white text-sm">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
            <Save className="h-4 w-4" />
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          <Link href="/admin/timeline" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
