'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';
import { Save } from 'lucide-react';
import { ImageUpload } from '@/components/admin/image-upload';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    site_title: '',
    site_description: '',
    meta_keywords: '',
    og_image: '',
    google_analytics_id: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    social_facebook: '',
    social_twitter: '',
    social_linkedin: '',
    social_instagram: '',
    social_youtube: '',
    social_github: '',
  });

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    setToken(t);
    if (t) fetchSettings(t);
    else setFetching(false);
  }, []);

  const fetchSettings = async (t: string) => {
    try {
      const res = await fetch(API.SETTINGS, {
        headers: { 'Authorization': `Bearer ${t}` }
      });
      const data = await res.json();
      if (data) {
        const settings = data.settings || data;
        setFormData({
          site_title: settings.site_title || '',
          site_description: settings.site_description || '',
          meta_keywords: settings.meta_keywords || '',
          og_image: settings.og_image || '',
          google_analytics_id: settings.google_analytics_id || '',
          contact_email: settings.contact_email || '',
          contact_phone: settings.contact_phone || '',
          contact_address: settings.contact_address || '',
          social_facebook: settings.social_facebook || '',
          social_twitter: settings.social_twitter || '',
          social_linkedin: settings.social_linkedin || '',
          social_instagram: settings.social_instagram || '',
          social_youtube: settings.social_youtube || '',
          social_github: settings.social_github || '',
        });
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch(API.SETTINGS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Save settings error:', err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-12 text-slate-400">Loading settings...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage site settings and SEO</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">SEO Settings</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Site Title</label>
                <input type="text" name="site_title" value={formData.site_title} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
              </div>
              <div>
                <ImageUpload value={formData.og_image} onChange={(url) => setFormData(prev => ({ ...prev, og_image: url }))} label="OG Image" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Site Description</label>
              <textarea name="site_description" rows={3} value={formData.site_description} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Meta Keywords</label>
                <input type="text" name="meta_keywords" value={formData.meta_keywords} onChange={handleChange} placeholder="keyword1, keyword2, keyword3"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Google Analytics ID</label>
                <input type="text" name="google_analytics_id" value={formData.google_analytics_id} onChange={handleChange} placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Contact Information</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contact Phone</label>
                <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contact Address</label>
              <textarea name="contact_address" rows={2} value={formData.contact_address} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Facebook</label>
              <input type="text" name="social_facebook" value={formData.social_facebook} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Twitter / X</label>
              <input type="text" name="social_twitter" value={formData.social_twitter} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn</label>
              <input type="text" name="social_linkedin" value={formData.social_linkedin} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Instagram</label>
              <input type="text" name="social_instagram" value={formData.social_instagram} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">YouTube</label>
              <input type="text" name="social_youtube" value={formData.social_youtube} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">GitHub</label>
              <input type="text" name="social_github" value={formData.social_github} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50">
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600 animate-pulse">Settings saved successfully!</span>
          )}
        </div>
      </form>
    </div>
  );
}
