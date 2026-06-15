'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

export default function AdminJobsList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => { setToken(localStorage.getItem('adminToken')); }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API.JOBS}?admin=true`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setJobs(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => { if (token) fetchJobs(); }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job posting?')) return;
    try {
      const res = await fetch(`${API.JOBS}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setJobs(jobs.filter(j => j.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jobs</h1>
          <p className="text-slate-500 text-sm mt-1">Manage job openings</p>
        </div>
        <Link href="/admin/jobs/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus className="h-4 w-4" /> New Job
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No jobs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{job.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{job.department}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{job.location}</td>
                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">{job.type}</span></td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{job.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/jobs/edit/${job.id}`} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit className="h-4 w-4" /></Link>
                        <button onClick={() => handleDelete(job.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
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
