'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';
import { Eye, Trash2, Search, X } from 'lucide-react';

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    setToken(t);
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (token) fetchApplications();
    else setLoading(false);
  }, [token]);

  const fetchApplications = async () => {
    try {
      const res = await fetch(API.JOB_APPLICATIONS, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : data.applications || []);
    } catch (err) {
      console.error('Fetch applications error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      const res = await fetch(`${API.JOB_APPLICATIONS}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setApplications(applications.filter((a: any) => a.id !== id));
      } else {
        alert('Failed to delete application');
      }
    } catch (err) {
      console.error('Delete application error:', err);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API.JOB_APPLICATIONS}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setApplications(applications.map((a: any) =>
          a.id === id ? { ...a, status } : a
        ));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    reviewed: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Applications</h1>
          <p className="text-slate-500 mt-1">Review and manage job applications</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400">No applications received yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applicant Name</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Title</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applications.map((app: any) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">{app.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{app.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{app.jobTitle || app.job?.title || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                        className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border-0 cursor-pointer outline-none ${statusColors[app.status] || statusColors.pending}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{formatDate(app.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
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

      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedApp(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Application Details</h3>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Name</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedApp.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                  <p className="text-sm text-slate-900 mt-1">{selectedApp.email}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Job Title</label>
                <p className="text-sm text-slate-900 mt-1">{selectedApp.jobTitle || selectedApp.job?.title || '-'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Cover Letter</label>
                <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{selectedApp.coverLetter || selectedApp.message || 'No cover letter'}</p>
              </div>
              {selectedApp.resume && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Resume</label>
                  <a href={selectedApp.resume} target="_blank" rel="noopener noreferrer"
                    className="block mt-1 text-sm text-primary hover:underline">
                    View Resume
                  </a>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ml-2 ${statusColors[selectedApp.status] || statusColors.pending}`}>
                  {selectedApp.status || 'Pending'}
                </span>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Applied On</label>
                <p className="text-sm text-slate-900 mt-1">{formatDate(selectedApp.createdAt)}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
