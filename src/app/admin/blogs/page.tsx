'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

export default function AdminBlogsList() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => { setToken(localStorage.getItem('adminToken')); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(API.BLOGS, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setBlogs(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => { if (token) fetchBlogs(); }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog?')) return;
    try {
      const res = await fetch(`${API.BLOGS}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setBlogs(blogs.filter(b => b.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/blogs/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus className="h-4 w-4" /> New Blog
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No blogs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {blogs.map(blog => (
                  <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{blog.title}</div>
                      <div className="text-xs text-slate-400">/{blog.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{blog.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${blog.published ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/blog/${blog.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><ExternalLink className="h-4 w-4" /></Link>
                        <Link href={`/admin/blogs/edit/${blog.id}`} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit className="h-4 w-4" /></Link>
                        <button onClick={() => handleDelete(blog.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
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
