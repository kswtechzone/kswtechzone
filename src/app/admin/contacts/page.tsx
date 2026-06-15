'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Trash2, CheckCheck, Clock, AlertCircle, X } from 'lucide-react';
import { API } from '@/constants/api';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch(API.CONTACTS);
      const data = await res.json();
      setContacts(data);
    } catch {
      console.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const toggleRead = async (contact: Contact) => {
    const newStatus = contact.status === 'unread' ? 'read' : 'unread';
    await fetch(`${API.CONTACTS}/${contact.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, status: newStatus } : c))
    );
  };

  const deleteContact = async (id: string) => {
    await fetch(`${API.CONTACTS}/${id}`, { method: 'DELETE' });
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const unread = contacts.filter((c) => c.status === 'unread').length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500 mt-1">
            {unread > 0 ? (
              <span className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-red-500" />
                {unread} unread message{unread > 1 ? 's' : ''}
              </span>
            ) : (
              'All messages read'
            )}
          </p>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-1">No messages yet</h3>
          <p className="text-sm text-slate-400">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-2xl border p-5 transition-all cursor-pointer hover:shadow-md ${
                contact.status === 'unread' ? 'border-l-4 border-l-primary border-slate-100' : 'border-slate-100'
              } ${selected?.id === contact.id ? 'ring-2 ring-primary/20' : ''}`}
              onClick={() => setSelected(selected?.id === contact.id ? null : contact)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900">{contact.name}</span>
                    {contact.status === 'unread' && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="text-sm text-slate-500 space-y-0.5">
                    <p>{contact.email}</p>
                    {contact.service && <p className="text-xs">Service: {contact.service}</p>}
                    <p className="text-xs text-slate-400">
                      {new Date(contact.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {selected?.id === contact.id && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{contact.message}</p>
                      {contact.phone && (
                        <p className="text-xs text-slate-400 mt-2">Phone: {contact.phone}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleRead(contact); }}
                    className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-50"
                    title={contact.status === 'unread' ? 'Mark as read' : 'Mark as unread'}
                  >
                    {contact.status === 'unread' ? <CheckCheck className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm('Delete this message?')) deleteContact(contact.id); }}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
