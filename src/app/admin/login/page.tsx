'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/constants/api';

const DEVICE_ID_KEY = 'admin_device_id';

function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `device_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('er.sanjayks@gmail.com');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getOrCreateDeviceId();
  }, []);

  const codeInputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      codeInputsRef.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  const submitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const deviceId = getOrCreateDeviceId();
      const response = await fetch(API.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, deviceId }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresVerification) {
          setRequiresVerification(true);
          setError('');
        } else {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          router.push('/admin/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Connection refused. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const deviceId = getOrCreateDeviceId();
      const response = await fetch(API.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, code: code.join(''), deviceId }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Verification failed');
        setCode(['', '', '', '', '', '']);
        codeInputsRef.current[0]?.focus();
      }
    } catch {
      setError('Connection refused. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Admin <span className="text-primary">Portal</span>
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {requiresVerification
              ? `Enter the 6-digit code sent to ${email}`
              : 'Secure login for KSW TechZone Management'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium">
            {error}
          </div>
        )}

        {!requiresVerification ? (
          <form className="mt-8 space-y-6" onSubmit={submitCredentials}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Admin Email</label>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={submitCode}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4 text-center">
                Verification Code
              </label>
              <div className="flex justify-center gap-3">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { codeInputsRef.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.some(d => !d)}
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 ${
                (loading || code.some(d => !d)) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            <button
              type="button"
              onClick={() => {
                setRequiresVerification(false);
                setError('');
                setCode(['', '', '', '', '', '']);
              }}
              className="w-full text-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
