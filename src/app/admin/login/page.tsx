'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Auto-reset if stuck for more than 15 seconds (slow network / any browser issue)
    const timeout = setTimeout(() => {
      setLoading(false);
      setError('Request timed out. Please check your internet connection and try again.');
    }, 15000);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      clearTimeout(timeout);

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // Hard redirect — works on all browsers (Safari, Chrome, Firefox, Edge)
      // Ensures Supabase session cookies are fully set before the next page loads
      window.location.href = '/admin';

    } catch (err: any) {
      clearTimeout(timeout);
      setLoading(false);
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-luxury">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            Admin Login
          </h1>
          <p className="mt-2 font-body text-sm text-text-secondary">
            Al Safa Global — Content Management
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded-md bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1 block font-body text-sm font-medium text-text-primary">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-input px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="admin@alsafaglobal.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block font-body text-sm font-medium text-text-primary">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-input px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-3 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
