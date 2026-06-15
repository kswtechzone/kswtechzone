'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API } from '@/constants/api';
import { ArrowLeft } from 'lucide-react';

export default function NewFaqPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order: 0,
    published: false,
  });

  useEffect(() => {
    setToken(localStorage.getItem('adminToken'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API.FAQS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push('/admin/faqs');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create FAQ');
      }
    } catch (err) {
      console.error('Create FAQ error:', err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link href="/admin/faqs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to FAQs
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">New FAQ</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Question</label>
            <textarea name="question" required rows={2} value={formData.question} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Answer</label>
            <textarea name="answer" required rows={6} value={formData.answer} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
              <input type="number" name="order" value={formData.order} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="published" checked={formData.published} onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-slate-700">Published</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading}
              className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create FAQ'}
            </button>
            <Link href="/admin/faqs"
              className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
