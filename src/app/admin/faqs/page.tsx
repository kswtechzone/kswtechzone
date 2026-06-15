'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    setToken(t);
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (token) fetchFaqs();
    else setLoading(false);
  }, [token]);

  const fetchFaqs = async () => {
    try {
      const res = await fetch(API.FAQS, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFaqs(Array.isArray(data) ? data : data.faqs || []);
    } catch (err) {
      console.error('Fetch FAQs error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`${API.FAQS}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setFaqs(faqs.filter((f: any) => f.id !== id));
      } else {
        alert('Failed to delete FAQ');
      }
    } catch (err) {
      console.error('Delete FAQ error:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FAQs</h1>
          <p className="text-slate-500 mt-1">Manage frequently asked questions</p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add FAQ
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 mb-4">No FAQs found</p>
            <Link href="/admin/faqs/new" className="text-primary font-medium text-sm hover:underline">
              Add your first FAQ
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Question</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {faqs.map((f: any) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900 line-clamp-1">{f.question}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{f.category || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{f.order ?? '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${f.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {f.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/faqs/edit/${f.id}`}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
