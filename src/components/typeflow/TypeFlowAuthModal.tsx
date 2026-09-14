/**
 * TYPEFLOW — Real End-User Authentication & Membership Suite
 * Fully integrated with Supabase Auth:
 * - Real Email & Password Login with live Supabase verification
 * - Real Registration with metadata & email verification
 * - Real Password Reset via Supabase email dispatch
 * - Real Social Sign-On (Google & GitHub OAuth via Supabase)
 * - Real Session Management, Profile Customization & Sign Out
 * - GDPR / KVKK Data Portability (.json export)
 * - Zero mock users, zero fake OTP codes.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/dictionaries';
import { UserProfile } from './types';
import { supabase } from '@/lib/supabase';

interface TypeFlowAuthModalProps {
  isOpen: boolean;
  lang: Locale;
  profile: UserProfile;
  onClose: () => void;
  onProfileUpdate: (updated: UserProfile) => void;
}

type AuthView = 'login' | 'register' | 'forgot' | 'profile';

const AVATARS = ['⚡', '🧑‍💻', '🎭', '🚀', '🔥', '💎', '🦊', '🤖', '👾', '🌐'];

export default function TypeFlowAuthModal({
  isOpen,
  lang,
  profile,
  onClose,
  onProfileUpdate,
}: TypeFlowAuthModalProps) {
  const isTr = lang === 'tr';
  const isAuthenticated = !profile.isGuest && Boolean(profile.email);

  // Active view: default to 'profile' if user is already logged in, otherwise 'login'
  const [view, setView] = useState<AuthView>(isAuthenticated ? 'profile' : 'login');

  // Form states: Credentials
  const [email, setEmail] = useState<string>(profile.email || '');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>(profile.username || '');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Profile customization states
  const [customUsername, setCustomUsername] = useState<string>(profile.username || '');
  const [customAvatar, setCustomAvatar] = useState<string>(profile.avatar || '⚡');
  const [customBio, setCustomBio] = useState<string>(profile.bio || '');

  // Loading & Feedback states
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');

  // Sync state when profile changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setView(isAuthenticated ? 'profile' : 'login');
      setEmail(profile.email || '');
      setPassword('');
      setConfirmPassword('');
      setFeedback(null);
      setCustomUsername(profile.username || '');
      setCustomAvatar(profile.avatar || '⚡');
      setCustomBio(profile.bio || '');
    }
  }, [isOpen, isAuthenticated, profile]);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(password);

  // ─── 1. REAL SUPABASE LOGIN ───────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setFeedback({
        msg: isTr ? 'Lütfen e-posta ve şifrenizi girin.' : 'Please enter your email and password.',
        isError: true,
      });
      return;
    }

    setLoading(true);
    console.debug('[TypeFlow:Auth] Initiating real Supabase sign-in for:', cleanEmail);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        console.warn('[TypeFlow:Auth] Supabase login error:', error.message);
        let errorMsg = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = isTr
            ? 'Geçersiz e-posta veya şifre. Lütfen bilgilerinizi kontrol edin.'
            : 'Invalid email or password. Please try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg = isTr
            ? 'E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzdaki aktivasyon linkine tıklayın.'
            : 'Email address is not verified yet. Please check your inbox for the confirmation link.';
        }
        setFeedback({ msg: errorMsg, isError: true });
        return;
      }

      if (data.user) {
        const authedUser = data.user;
        const metaName = authedUser.user_metadata?.username || authedUser.email?.split('@')[0] || 'Daktilocu';

        const updated: UserProfile = {
          ...profile,
          id: authedUser.id,
          email: authedUser.email,
          username: metaName,
          isGuest: false,
        };

        try {
          localStorage.setItem('tf_user_profile', JSON.stringify(updated));
        } catch {}

        onProfileUpdate(updated);
        setFeedback({
          msg: isTr ? '✨ Giriş başarılı! Hoş geldiniz.' : '✨ Signed in successfully! Welcome back.',
          isError: false,
        });

        setTimeout(() => {
          onClose();
        }, 900);
      }
    } catch (err: any) {
      console.error('[TypeFlow:Auth] Unexpected login error:', err);
      setFeedback({
        msg: isTr ? 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.' : 'Connection error. Please try again.',
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── 2. REAL SUPABASE SIGN UP ─────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanEmail = email.trim();
    const cleanUsername = username.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFeedback({ msg: isTr ? 'Lütfen geçerli bir e-posta adresi girin.' : 'Please enter a valid email.', isError: true });
      return;
    }
    if (cleanUsername.length < 3) {
      setFeedback({ msg: isTr ? 'Kullanıcı adı en az 3 karakter olmalıdır.' : 'Username must be at least 3 characters.', isError: true });
      return;
    }
    if (password.length < 6) {
      setFeedback({ msg: isTr ? 'Şifre en az 6 karakter olmalıdır.' : 'Password must be at least 6 characters.', isError: true });
      return;
    }
    if (password !== confirmPassword) {
      setFeedback({ msg: isTr ? 'Şifreler birbiriyle eşleşmiyor.' : 'Passwords do not match.', isError: true });
      return;
    }
    if (!agreeTerms) {
      setFeedback({ msg: isTr ? 'Lütfen kullanım ve gizlilik koşullarını onaylayın.' : 'Please accept terms & privacy policy.', isError: true });
      return;
    }

    setLoading(true);
    console.debug('[TypeFlow:Auth] Initiating real Supabase registration for:', cleanEmail);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
            avatar: profile.avatar || '⚡',
          },
        },
      });

      if (error) {
        console.warn('[TypeFlow:Auth] Supabase sign up error:', error.message);
        let errorMsg = error.message;
        if (error.message.includes('User already registered')) {
          errorMsg = isTr
            ? 'Bu e-posta adresiyle kayıtlı bir hesap zaten var. Lütfen giriş yapın.'
            : 'An account with this email already exists. Please sign in.';
        }
        setFeedback({ msg: errorMsg, isError: true });
        return;
      }

      if (data.user) {
        // If email confirmation is required by Supabase
        if (data.user && !data.session) {
          setFeedback({
            msg: isTr
              ? `📧 Kayıt oluşturuldu! ${cleanEmail} adresine doğrulama bağlantısı gönderildi. Lütfen e-postanızı onaylayın.`
              : `📧 Account created! A confirmation link was sent to ${cleanEmail}. Please verify your email.`,
            isError: false,
          });
          return;
        }

        // If auto-confirmed session
        const updated: UserProfile = {
          ...profile,
          id: data.user.id,
          email: cleanEmail,
          username: cleanUsername,
          isGuest: false,
          gems: (profile.gems || 0) + 10, // Small welcome bonus in scarce economy
        };

        try {
          localStorage.setItem('tf_user_profile', JSON.stringify(updated));
        } catch {}

        onProfileUpdate(updated);
        setFeedback({
          msg: isTr ? '🎉 Tebrikler! Hesabınız başarıyla oluşturuldu.' : '🎉 Welcome! Account created successfully.',
          isError: false,
        });

        setTimeout(() => {
          onClose();
        }, 1100);
      }
    } catch (err: any) {
      console.error('[TypeFlow:Auth] Unexpected register error:', err);
      setFeedback({
        msg: isTr ? 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.' : 'An error occurred. Please try again.',
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── 3. REAL SUPABASE FORGOT PASSWORD ─────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFeedback({ msg: isTr ? 'Lütfen geçerli bir e-posta adresi girin.' : 'Please enter a valid email.', isError: true });
      return;
    }

    setLoading(true);
    console.debug('[TypeFlow:Auth] Requesting password reset for:', cleanEmail);

    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/typeflow` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setFeedback({ msg: error.message, isError: true });
        return;
      }

      setFeedback({
        msg: isTr
          ? `✓ Şifre sıfırlama bağlantısı ${cleanEmail} adresine gönderildi. Lütfen gelen kutunuzu kontrol edin.`
          : `✓ Password reset link sent to ${cleanEmail}. Please check your inbox.`,
        isError: false,
      });
    } catch (err: any) {
      setFeedback({
        msg: isTr ? 'Şifre sıfırlama isteği gönderilemedi.' : 'Failed to send reset link.',
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── 4. REAL SUPABASE SOCIAL OAUTH SIGN-IN ────────────────────────────────
  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setFeedback(null);
    console.debug('[TypeFlow:Auth] Triggering real OAuth redirect for:', provider);

    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/typeflow` : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        setFeedback({
          msg: error.message || (isTr ? `${provider} ile giriş başlatılamadı.` : `Failed to sign in with ${provider}.`),
          isError: true,
        });
      }
    } catch (err: any) {
      console.error('[TypeFlow:Auth] OAuth error:', err);
      setFeedback({
        msg: isTr ? 'Sosyal giriş bağlantısı kurulamadı.' : 'Social login connection failed.',
        isError: true,
      });
    }
  };

  // ─── 5. REAL SIGN OUT ─────────────────────────────────────────────────────
  const handleSignOut = async () => {
    setLoading(true);
    console.debug('[TypeFlow:Auth] Signing out user');

    try {
      await supabase.auth.signOut();

      const guestProfile: UserProfile = {
        ...profile,
        isGuest: true,
        email: undefined,
        username: 'Daktilocu_' + Math.floor(Math.random() * 900 + 100),
      };

      try {
        localStorage.setItem('tf_user_profile', JSON.stringify(guestProfile));
      } catch {}

      onProfileUpdate(guestProfile);
      setFeedback({
        msg: isTr ? 'Oturum kapatıldı. Misafir moduna geçildi.' : 'Signed out successfully.',
        isError: false,
      });

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error('[TypeFlow:Auth] Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── 6. PROFILE CUSTOMIZATION UPDATE ───────────────────────────────────────
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      username: customUsername.trim() || profile.username,
      avatar: customAvatar,
      bio: customBio.trim(),
    };

    try {
      localStorage.setItem('tf_user_profile', JSON.stringify(updated));
    } catch {}

    onProfileUpdate(updated);
    setFeedback({
      msg: isTr ? '✓ Profil bilgileriniz güncellendi.' : '✓ Profile updated successfully.',
      isError: false,
    });
    setTimeout(() => setFeedback(null), 2500);
  };

  // ─── 7. GDPR DATA EXPORT (.json) ──────────────────────────────────────────
  const handleExportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      user: profile,
      privacy: 'GDPR / KVKK Article 20 Right to Data Portability',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typeflow_data_${profile.username || 'user'}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedback({
      msg: isTr ? '✓ Verileriniz .json olarak başarıyla indirildi.' : '✓ Typing data exported as .json.',
      isError: false,
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  // ─── 8. RESET LOCAL STATS ─────────────────────────────────────────────────
  const handleResetData = () => {
    if (deleteConfirmText !== (isTr ? 'HESABIMI SİL' : 'DELETE')) {
      alert(isTr ? "Lütfen kutuya 'HESABIMI SİL' yazın." : "Please type 'DELETE' to confirm.");
      return;
    }
    try {
      localStorage.removeItem('tf_user_profile');
      localStorage.removeItem('tf_theme');
      localStorage.removeItem('tf_sound');
      localStorage.removeItem('tf_community_league_members');
    } catch {}
    window.location.reload();
  };

  return (
    <div className="tf-modal-backdrop" onClick={onClose}>
      <div
        className="tf-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '500px', width: '92vw', padding: '1.75rem' }}
      >
        {/* Modal Header */}
        <div className="tf-modal-header" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.75rem' }}>{profile.avatar || '⚡'}</span>
            <div>
              <h3 className="tf-modal-title" style={{ fontSize: '1.05rem', margin: 0 }}>
                {isAuthenticated
                  ? (isTr ? 'HESAP & PROFİL YÖNETİMİ' : 'ACCOUNT & PROFILE')
                  : (isTr ? 'TYPEFLOW HESAP MERKEZİ' : 'TYPEFLOW AUTH CENTER')}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--tf-text-secondary)', fontFamily: 'var(--tf-font-mono)' }}>
                {isAuthenticated
                  ? `✓ ${profile.email} (Bulut Doğrulandı)`
                  : (isTr ? 'Misafir Modu // İlerlemeyi bulutta saklamak için bağlan' : 'Guest Mode // Connect to sync progress')}
              </span>
            </div>
          </div>
          <button className="tf-modal-close-btn" onClick={onClose} aria-label={isTr ? 'Kapat' : 'Close'}>✕</button>
        </div>

        {/* Feedback Alert Bar */}
        {feedback && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '1rem',
              background: feedback.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: `1px solid ${feedback.isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
              color: feedback.isError ? '#f87171' : '#34d399',
              lineHeight: 1.4,
            }}
          >
            {feedback.msg}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* VIEW 1: AUTHENTICATED USER PROFILE & SETTINGS */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {isAuthenticated && view === 'profile' && (
          <div>
            {/* Account Quick Stats Pill */}
            <div
              style={{
                background: 'var(--tf-surface-elevated)',
                border: '1px solid var(--tf-border)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--tf-text-muted)' }}>{isTr ? 'En Yüksek Hız' : 'Top WPM'}</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--tf-font-mono)' }}>
                  {profile.topWpm || 0} WPM
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--tf-text-muted)' }}>{isTr ? 'Haftalık XP' : 'Weekly XP'}</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--tf-font-mono)' }}>
                  {profile.weeklyXp || 0} XP
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--tf-text-muted)' }}>{isTr ? 'Elmaslar' : 'Gems'}</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--tf-font-mono)' }}>
                  {profile.gems || 0} 💎
                </div>
              </div>
            </div>

            {/* Profile Customization Form */}
            <form onSubmit={handleSaveProfile} style={{ marginBottom: '1.25rem' }}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--tf-text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  {isTr ? 'Görünen Kullanıcı Adı' : 'Display Username'}
                </label>
                <input
                  type="text"
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  className="tf-input"
                  style={{ width: '100%', padding: '0.55rem 0.8rem', fontSize: '0.85rem' }}
                  required
                />
              </div>

              {/* Avatar Selector */}
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--tf-text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  {isTr ? 'Profil Avatarı' : 'Profile Avatar'}
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setCustomAvatar(av)}
                      style={{
                        fontSize: '1.3rem',
                        padding: '0.35rem 0.6rem',
                        borderRadius: '8px',
                        border: customAvatar === av ? '2px solid var(--tf-accent)' : '1px solid var(--tf-border)',
                        background: customAvatar === av ? 'rgba(245, 158, 11, 0.15)' : 'var(--tf-surface-elevated)',
                        cursor: 'pointer',
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--tf-text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  {isTr ? 'Biyografi & Daktilo Notu' : 'Bio & Typing Note'}
                </label>
                <textarea
                  value={customBio}
                  onChange={(e) => setCustomBio(e.target.value)}
                  className="tf-input"
                  rows={2}
                  placeholder={isTr ? 'Kendinden kısaca bahset...' : 'Briefly describe your typing journey...'}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="tf-btn tf-btn-pushable"
                style={{ width: '100%', background: 'var(--tf-accent)', color: '#000', fontWeight: 800, padding: '0.65rem' }}
              >
                {isTr ? 'Değişiklikleri Kaydet' : 'Save Changes'}
              </button>
            </form>

            {/* Actions: Export Data & Sign Out */}
            <div style={{ display: 'flex', gap: '0.6rem', paddingTop: '0.85rem', borderTop: '1px solid var(--tf-border)' }}>
              <button
                type="button"
                className="tf-btn"
                onClick={handleExportData}
                style={{ flex: 1, background: 'var(--tf-surface-elevated)', border: '1px solid var(--tf-border)', fontSize: '0.8rem' }}
              >
                📥 {isTr ? 'Verilerimi İndir (.json)' : 'Export Data (.json)'}
              </button>
              <button
                type="button"
                className="tf-btn tf-btn-pushable"
                onClick={handleSignOut}
                disabled={loading}
                style={{ flex: 1, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}
              >
                🚪 {isTr ? 'Oturumu Kapat' : 'Sign Out'}
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* VIEW 2: GUEST SIGN IN / SIGN UP TABS */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {(!isAuthenticated || view !== 'profile') && (
          <div>
            {/* View Switcher Bar */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => { setView('login'); setFeedback(null); }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '6px',
                  background: view === 'login' ? 'var(--tf-accent)' : 'transparent',
                  color: view === 'login' ? '#000' : 'var(--tf-text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isTr ? 'Giriş Yap' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setView('register'); setFeedback(null); }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '6px',
                  background: view === 'register' ? 'var(--tf-accent)' : 'transparent',
                  color: view === 'register' ? '#000' : 'var(--tf-text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isTr ? 'Yeni Kayıt Ol' : 'Sign Up'}
              </button>
            </div>

            {/* A. LOGIN FORM */}
            {view === 'login' && (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--tf-text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                    {isTr ? 'E-posta Adresi' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="tf-input"
                    placeholder="ornek@domain.com"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
                    required
                    autoComplete="email"
                  />
                </div>

                <div style={{ marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--tf-text-secondary)', fontWeight: 600 }}>
                      {isTr ? 'Şifre' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setFeedback(null); }}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {isTr ? 'Şifremi unuttum?' : 'Forgot password?'}
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="tf-input"
                      placeholder="••••••••"
                      style={{ width: '100%', padding: '0.6rem 2.4rem 0.6rem 0.85rem', fontSize: '0.85rem' }}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--tf-text-muted)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      {showPassword ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="tf-btn tf-btn-pushable"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'var(--tf-accent)',
                    color: '#000',
                    fontWeight: 800,
                    padding: '0.75rem',
                    marginTop: '0.8rem',
                    fontSize: '0.9rem',
                  }}
                >
                  {loading ? (isTr ? 'Giriş Yapılıyor...' : 'Signing In...') : (isTr ? 'Giriş Yap 🚀' : 'Sign In 🚀')}
                </button>
              </form>
            )}

            {/* B. REGISTER FORM */}
            {view === 'register' && (
              <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--tf-text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>
                    {isTr ? 'E-posta Adresi' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="tf-input"
                    placeholder="ornek@domain.com"
                    style={{ width: '100%', padding: '0.55rem 0.8rem', fontSize: '0.85rem' }}
                    required
                    autoComplete="email"
                  />
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--tf-text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>
                    {isTr ? 'Kullanıcı Adı' : 'Username'}
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="tf-input"
                    placeholder={isTr ? 'Örn: KlavyeUstasi' : 'e.g. SpeedTypist'}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', fontSize: '0.85rem' }}
                    required
                    autoComplete="username"
                  />
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--tf-text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>
                    {isTr ? 'Şifre (En az 6 karakter)' : 'Password (Min 6 chars)'}
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="tf-input"
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '0.55rem 0.8rem', fontSize: '0.85rem' }}
                    required
                    autoComplete="new-password"
                  />
                  {/* Live Password Strength Meter */}
                  {password.length > 0 && (
                    <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${(strengthScore / 4) * 100}%`,
                            height: '100%',
                            background: strengthScore <= 1 ? '#ef4444' : strengthScore <= 2 ? '#f59e0b' : '#10b981',
                            transition: 'width 0.25s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--tf-text-muted)', fontFamily: 'var(--tf-font-mono)' }}>
                        {strengthScore <= 1 ? (isTr ? 'Zayıf' : 'Weak') : strengthScore <= 2 ? (isTr ? 'Orta' : 'Medium') : (isTr ? 'Güçlü' : 'Strong')}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--tf-text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>
                    {isTr ? 'Şifre Tekrarı' : 'Confirm Password'}
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="tf-input"
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '0.55rem 0.8rem', fontSize: '0.85rem' }}
                    required
                    autoComplete="new-password"
                  />
                </div>

                {/* Terms checkbox */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--tf-text-secondary)', marginBottom: '1rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    style={{ marginTop: '2px' }}
                  />
                  <span>
                    {isTr
                      ? 'Kullanım şartlarını ve KVKK aydınlatma metnini okudum, kabul ediyorum.'
                      : 'I agree to the Terms of Service and Privacy Policy.'}
                  </span>
                </label>

                <button
                  type="submit"
                  className="tf-btn tf-btn-pushable"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    fontWeight: 800,
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    border: 'none',
                  }}
                >
                  {loading ? (isTr ? 'Hesap Oluşturuluyor...' : 'Creating Account...') : (isTr ? 'Hesabımı Oluştur ⚡' : 'Create Account ⚡')}
                </button>
              </form>
            )}

            {/* C. FORGOT PASSWORD FORM */}
            {view === 'forgot' && (
              <form onSubmit={handleForgotPassword}>
                <p style={{ fontSize: '0.82rem', color: 'var(--tf-text-secondary)', lineHeight: 1.4, marginBottom: '1rem' }}>
                  {isTr
                    ? 'Kayıtlı e-posta adresinizi girin. Size güvenli bir şifre sıfırlama bağlantısı göndereceğiz.'
                    : 'Enter your account email. We will send you a secure password reset link.'}
                </p>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--tf-text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                    {isTr ? 'E-posta Adresi' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="tf-input"
                    placeholder="ornek@domain.com"
                    style={{ width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.85rem' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    className="tf-btn"
                    onClick={() => { setView('login'); setFeedback(null); }}
                    style={{ flex: 1, background: 'var(--tf-surface-elevated)', border: '1px solid var(--tf-border)' }}
                  >
                    {isTr ? 'Geri Dön' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    className="tf-btn tf-btn-pushable"
                    disabled={loading}
                    style={{ flex: 2, background: 'var(--tf-accent)', color: '#000', fontWeight: 800 }}
                  >
                    {loading ? (isTr ? 'Gönderiliyor...' : 'Sending...') : (isTr ? 'Sıfırlama Linki Gönder' : 'Send Reset Link')}
                  </button>
                </div>
              </form>
            )}

            {/* Social Single Sign-On (Google & GitHub) */}
            {view !== 'forgot' && (
              <div style={{ marginTop: '1.4rem', paddingTop: '1.2rem', borderTop: '1px solid var(--tf-border)' }}>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--tf-text-muted)', marginBottom: '0.85rem', fontFamily: 'var(--tf-font-mono)' }}>
                  {isTr ? 'VEYA SOSYAL HESAPLA BAĞLAN' : 'OR CONTINUE WITH'}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    type="button"
                    className="tf-btn tf-btn-pushable"
                    onClick={() => handleSocialAuth('google')}
                    style={{
                      flex: 1,
                      background: 'var(--tf-surface-elevated)',
                      border: '1px solid var(--tf-border)',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.6rem',
                    }}
                  >
                    <span>🌐</span>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    className="tf-btn tf-btn-pushable"
                    onClick={() => handleSocialAuth('github')}
                    style={{
                      flex: 1,
                      background: 'var(--tf-surface-elevated)',
                      border: '1px solid var(--tf-border)',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.6rem',
                    }}
                  >
                    <span>🐙</span>
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
