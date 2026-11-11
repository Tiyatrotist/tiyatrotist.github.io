/**
 * TIYATROTIST — Admin Reset Password Page
 *
 * Dedicated page accessed via Supabase recovery email link to update the account password.
 */

'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import '../../admin/admin.css';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('Şifre en az 8 karakter uzunluğunda olmalıdır.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Girilen şifreler birbiriyle eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateErr) {
        setError(`Güncelleme hatası: ${updateErr.message}`);
      } else {
        setSuccess('Şifreniz başarıyla güncellendi! Artık yeni şifrenizle giriş yapabilirsiniz.');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      }
    } catch (ex: any) {
      setError(ex?.message || 'Şifre güncellenirken beklenmedik bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-root">
      <div className="admin-login-page">
        <div className="admin-login-box">
          <h1>YENİ ŞİFRE BELİRLE</h1>
          <div className="admin-login-brand">TIYATROTIST ADMIN</div>

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

          <form onSubmit={handleUpdate} className="admin-form">
            <div className="admin-field">
              <label htmlFor="new-password">Yeni Şifre</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
                placeholder="En az 8 karakter"
                autoComplete="new-password"
                autoFocus
              />
            </div>

            <div className="admin-field">
              <label htmlFor="confirm-password">Yeni Şifre (Tekrar)</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={8}
                placeholder="Şifrenizi tekrar girin"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading || !newPassword || !confirmPassword}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Güncelleniyor…' : 'ŞİFREYİ GÜNCELLE'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link
              href="/admin/login"
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.75rem',
                textDecoration: 'none',
                fontFamily: 'monospace',
              }}
            >
              ← Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
