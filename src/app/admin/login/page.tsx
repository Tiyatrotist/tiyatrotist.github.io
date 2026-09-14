/**
 * TIYATROTIST — Admin Login Page
 *
 * Email/password login form using Supabase Auth.
 * Redirects to /admin/dashboard on success.
 * Denies non-owner authenticated users.
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { supabase, OWNER_ID } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import { setAdminCookies } from '@/lib/admin-auth';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import '../../admin/admin.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [locale, setLocale] = useState<AdminLocale>('tr');

  const dict = getAdminDict(locale);

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id === OWNER_ID) {
          console.debug('[admin/login] Already authenticated as owner, syncing cookie and redirecting…');
          if (session.access_token) {
            setAdminCookies({
              token: session.access_token,
              email: session.user.email || '',
              role: 'owner',
            });
          }
          window.location.href = '/admin/dashboard';
          return;
        }
      } catch (err) {
        console.debug('[admin/login] Session check error:', err);
      }
      setChecking(false);
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.debug('[admin/login] Attempting sign in…');
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.debug('[admin/login] Auth error:', authError.message);
        setError(dict.login.errorInvalid);
        setLoading(false);
        return;
      }

      if (!data.user || data.user.id !== OWNER_ID) {
        console.debug('[admin/login] Non-owner user attempted login:', data.user?.id);
        await supabase.auth.signOut();
        setError(dict.login.errorDenied);
        setLoading(false);
        return;
      }

      console.debug('[admin/login] Owner authenticated, setting cookies and redirecting…');
      if (data.session?.access_token) {
        setAdminCookies({
          token: data.session.access_token,
          email: data.user.email || email,
          role: 'owner',
        });
      }
      window.location.href = '/admin/dashboard';
    } catch {
      console.debug('[admin/login] Network error');
      setError(dict.login.errorNetwork);
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="admin-root">
        <div className="admin-login-page">
          <LoadingSpinner large />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <div className="admin-login-page">
        <div className="admin-login-box">
          <h1>{dict.login.title}</h1>
          <div className="admin-login-brand">TIYATROTIST</div>

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-field">
              <label htmlFor="admin-login-email">{dict.login.email}</label>
              <input
                id="admin-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="admin-field">
              <label htmlFor="admin-login-password">{dict.login.password}</label>
              <input
                id="admin-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading || !email || !password}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? dict.login.loading : dict.login.submit}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              className="admin-lang-toggle"
              onClick={() => setLocale(locale === 'tr' ? 'en' : 'tr')}
              type="button"
            >
              {locale === 'tr' ? 'EN' : 'TR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
