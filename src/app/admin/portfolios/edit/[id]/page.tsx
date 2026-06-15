'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API } from '@/constants/api';
import { ArrowLeft } from 'lucide-react';
import { ImageUpload } from '@/components/admin/image-upload';

export default function EditPortfolioPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
    content: '',
    image: '',
    tags: '',
    client: '',
    url: '',
    github: '',
    featured: false,
    published: false,
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    setToken(t);
    if (t) fetchPortfolio(t);
  }, [params.id]);

  const fetchPortfolio = async (t: string) => {
    try {
      const res = await fetch(`${API.PORTFOLIOS}/${params.id}`, {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      if (!res.ok) {
        alert('Portfolio not found');
        router.push('/admin/portfolios');
        return;
      }
      const data = await res.json();
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        category: data.category || '',
        description: data.description || '',
        content: data.content || '',
        image: data.image || '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
        client: data.client || '',
        url: data.url || '',
        github: data.github || '',
        featured: data.featured || false,
        published: data.published || false,
      });
    } catch (err) {
      console.error('Fetch portfolio error:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body: Record<string, any> = { ...formData };
      if (body.tags) body.tags = body.tags.split(',').map((t: string) => t.trim());
      const res = await fetch(`${API.PORTFOLIOS}/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        router.push('/admin/portfolios');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update portfolio');
      }
    } catch (err) {
      console.error('Update portfolio error:', err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-12 text-slate-400">Loading portfolio...</div>;

  return (
    <div>
      <Link href="/admin/portfolios" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Portfolios
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Edit Portfolio</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
              <input type="text" name="slug" required value={formData.slug} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-slate-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <ImageUpload value={formData.image} onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} label="Image" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea name="description" rows={4} value={formData.description} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
            <textarea name="content" rows={6} value={formData.content} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma-separated)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="tag1, tag2, tag3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Client</label>
              <input type="text" name="client" value={formData.client} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">URL</label>
              <input type="text" name="url" value={formData.url} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">GitHub</label>
              <input type="text" name="github" value={formData.github} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div className="flex items-end gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange}
                  className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-slate-700">Featured</span>
              </label>
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
              {loading ? 'Updating...' : 'Update Portfolio'}
            </button>
            <Link href="/admin/portfolios"
              className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
