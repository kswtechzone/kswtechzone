'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';

export default function AdminTimelinePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => { setToken(localStorage.getItem('adminToken')); }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(API.TIMELINE, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setEvents(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => { if (token) fetchEvents(); }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this timeline event?')) return;
    try {
      const res = await fetch(`${API.TIMELINE}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setEvents(events.filter(e => e.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Timeline</h1>
          <p className="text-slate-500 text-sm mt-1">Manage timeline events on the About page</p>
        </div>
        <a href="/admin/timeline/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus className="h-4 w-4" /> New Event
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No timeline events yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Icon</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.map(event => (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">{event.order}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{event.year}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">{event.icon}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${event.published ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                        {event.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`/admin/timeline/edit/${event.id}`} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit className="h-4 w-4" /></a>
                        <button onClick={() => handleDelete(event.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
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
