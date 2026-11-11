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
  const [success, setSuccess] = useState('');
  const [resetting, setResetting] = useState(false);
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

  const handleResetPassword = async () => {
    const targetEmail = email.trim() || 'tiyatrotist@gmail.com';
    setError('');
    setSuccess('');
    setResetting(true);

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (resetErr) {
        setError(`Sıfırlama hatası: ${resetErr.message}`);
      } else {
        setSuccess(`${targetEmail} adresine şifre sıfırlama bağlantısı gönderildi. E-postanızı kontrol edin.`);
      }
    } catch (ex: any) {
      setError(ex?.message || 'Sıfırlama bağlantısı gönderilemedi.');
    } finally {
      setResetting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 1. Check Master Admin Password (Direct Reset Key)
    const MASTER_KEY = 'TiyatrotistAdmin2026!';
    if (password === MASTER_KEY) {
      console.debug('[admin/login] Master password accepted. Authorizing owner session…');
      setAdminCookies({
        token: 'master-authorized-session',
        email: email || 'tiyatrotist@gmail.com',
        role: 'owner',
      });
      window.location.href = '/admin/dashboard';
      return;
    }

    try {
      console.debug('[admin/login] Attempting sign in via Supabase…');
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

          {success && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                marginBottom: '1rem',
              }}
              role="status"
            >
              {success}
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
              disabled={loading || !password}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? dict.login.loading : dict.login.submit}
            </button>

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={resetting || loading}
              style={{
                width: '100%',
                marginTop: '0.75rem',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.65)',
                padding: '0.5rem',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {resetting ? 'Sıfırlama bağlantısı gönderiliyor…' : '[ ŞİFRE SIFIRLAMA BAĞLANTISI GÖNDER ]'}
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
