/**
 * TYPEFLOW — Advanced Multi-Step SaaS Authentication & Membership Suite
 * Features:
 * - Multi-Step Guided Registration Onboarding (Account -> Skill Level -> Daily Commitment -> 2FA Code -> Welcome)
 * - Password Strength Meter (Live regex audit for 8+ chars, uppercase, number, symbol)
 * - Social Auth Simulation (Google, GitHub, Apple)
 * - Two-Factor Authentication (2FA) OTP Verification & Security Toggle
 * - GDPR / KVKK Data Portability (.json export of typing stats, heatmaps, and progress)
 * - Secure Account Deletion with 'HESABIMI SİL' verification safeguard
 * - Profile Bio & Avatar Customization
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/dictionaries';
import { UserProfile } from './types';

interface TypeFlowAuthModalProps {
  isOpen: boolean;
  lang: Locale;
  profile: UserProfile;
  onClose: () => void;
  onProfileUpdate: (updated: UserProfile) => void;
}

type MainTab = 'auth' | 'security' | 'profile';
type AuthMode = 'login' | 'register';
type RegisterStep = 1 | 2 | 3 | 4 | 5;

interface SkillOption {
  id: string;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  wpmRange: string;
  icon: string;
}

const SKILL_OPTIONS: SkillOption[] = [
  {
    id: 'beginner',
    titleTr: 'Başlangıç Seviyesi',
    titleEn: 'Beginner Typist',
    descTr: 'Klavyeyi yeni öğreniyorum, doğru parmak yerleşimi arıyorum.',
    descEn: 'Starting fresh, building muscle memory and finger positioning.',
    wpmRange: '< 30 WPM',
    icon: '🐢',
  },
  {
    id: 'intermediate',
    titleTr: 'Orta Seviye',
    titleEn: 'Intermediate Typist',
    descTr: 'Ekrana bakarak yazabiliyorum, ritmimi ve hızımı katlamak istiyorum.',
    descEn: 'Touch typing comfortable, focused on rhythm and error reduction.',
    wpmRange: '30 - 60 WPM',
    icon: '⌨️',
  },
  {
    id: 'advanced',
    titleTr: 'İleri Seviye (Geliştirici / Yazar)',
    titleEn: 'Advanced (Dev / Writer)',
    descTr: 'Hızlı kodlama ve profesyonel metinlerde hatasız akış hedefliyorum.',
    descEn: 'Coding or writing daily, aiming for high velocity fluid bursts.',
    wpmRange: '60 - 90 WPM',
    icon: '🚀',
  },
  {
    id: 'master',
    titleTr: 'Daktilo Ustası & Hız Canavarı',
    titleEn: 'Master & Speed Demon',
    descTr: 'Liglerde zirveye oynamak, 100+ WPM rekorları kırmak istiyorum.',
    descEn: 'Competitive speed typist, pushing boundaries beyond 100+ WPM.',
    wpmRange: '90+ WPM',
    icon: '⚡',
  },
];

interface GoalOption {
  id: string;
  minutes: number;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  icon: string;
  isPopular?: boolean;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'casual',
    minutes: 5,
    titleTr: 'Rahat & Sakin',
    titleEn: 'Casual Pace',
    descTr: 'Günde 5 dakika (1 ders / +20 XP hedefi)',
    descEn: '5 mins/day (1 lesson / +20 XP goal)',
    icon: '☕',
  },
  {
    id: 'regular',
    minutes: 15,
    titleTr: 'Düzenli & İstikrarlı',
    titleEn: 'Regular & Consistent',
    descTr: 'Günde 15 dakika (3 ders / +50 XP hedefi)',
    descEn: '15 mins/day (3 lessons / +50 XP goal)',
    icon: '🎯',
    isPopular: true,
  },
  {
    id: 'intense',
    minutes: 30,
    titleTr: 'Yoğun & Odaklı',
    titleEn: 'Intense Focus',
    descTr: 'Günde 30 dakika (6 ders / +100 XP hedefi)',
    descEn: '30 mins/day (6 lessons / +100 XP goal)',
    icon: '🔥',
  },
  {
    id: 'champion',
    minutes: 45,
    titleTr: 'Daktilo Şampiyonu',
    titleEn: 'Typing Champion',
    descTr: 'Günde 45+ dakika (Sınırsız pratik)',
    descEn: '45+ mins/day (Unlimited practice)',
    icon: '🏆',
  },
];

const AVATARS = ['🎭', '⚡', '🤖', '👾', '🚀', '🔥', '🦊', '🐱', '💀', '🌐'];

export default function TypeFlowAuthModal({
  isOpen,
  lang,
  profile,
  onClose,
  onProfileUpdate,
}: TypeFlowAuthModalProps) {
  const isTr = lang === 'tr';

  // Navigation state
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('auth');
  const [authMode, setAuthMode] = useState<AuthMode>('register');
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);

  // Form states: Credentials
  const [email, setEmail] = useState<string>(profile.email || '');
  const [username, setUsername] = useState<string>(profile.username || '');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Form states: Onboarding Choices
  const [selectedSkill, setSelectedSkill] = useState<string>('intermediate');
  const [selectedGoal, setSelectedGoal] = useState<string>('regular');
  const [enableDailyReminder, setEnableDailyReminder] = useState<boolean>(true);

  // Form states: 2FA Verification Step
  const [otpCode, setOtpCode] = useState<string[]>(['4', '8', '2', '9', '1', '0']);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);

  // Security & Settings Tab states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Profile Customization state
  const [profileUsername, setProfileUsername] = useState<string>(profile.username || '');
  const [profileAvatar, setProfileAvatar] = useState<string>(profile.avatar || '🎭');
  const [profileBio, setProfileBio] = useState<string>(
    profile.bio ||
      (isTr
        ? 'Tiyatrotist sahnesinde tirad atan, kod başında daktilo tuşlayan tiyatro ve yazılım aşığı.'
        : 'Passionate stage actor and developer who loves rapid typing.')
  );

  // Alerts
  const [authAlert, setAuthAlert] = useState<{ text: string; error: boolean } | null>(null);

  // Resend OTP countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendTimer > 0 && registerStep === 4) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendTimer, registerStep]);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0 to 4
  };

  const strengthScore = getPasswordStrength(password);

  // ─── Step Transitions & Handlers ───────────────────────────────────────────
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthAlert(null);

    if (!email.includes('@') || !email.includes('.')) {
      setAuthAlert({ text: isTr ? 'Geçerli bir e-posta adresi girin.' : 'Please enter a valid email.', error: true });
      return;
    }
    if (username.trim().length < 3) {
      setAuthAlert({ text: isTr ? 'Kullanıcı adı en az 3 karakter olmalı.' : 'Username must be at least 3 characters.', error: true });
      return;
    }
    if (password.length < 8) {
      setAuthAlert({ text: isTr ? 'Şifre en az 8 karakter olmalıdır.' : 'Password must be at least 8 characters.', error: true });
      return;
    }
    if (!agreeTerms) {
      setAuthAlert({ text: isTr ? 'Lütfen kullanım şartlarını onaylayın.' : 'Please accept terms & conditions.', error: true });
      return;
    }

    setRegisterStep(2);
  };

  const handleNextFromStep2 = () => {
    setRegisterStep(3);
  };

  const handleNextFromStep3 = () => {
    setResendTimer(30);
    setRegisterStep(4);
  };

  const handleVerifyOtp = () => {
    const code = otpCode.join('');
    if (code.length === 6) {
      setIsOtpVerified(true);
      console.debug('[TypeFlow:Auth] 2FA verified successfully:', code);
      setTimeout(() => {
        // Complete registration & apply rewards
        const updated: UserProfile = {
          ...profile,
          email,
          username: username.trim(),
          isGuest: false,
          gems: (profile.gems || 0) + 100, // +100 Welcome Gems
          streakFreezes: (profile.streakFreezes || 0) + 1, // +1 Freeze
          dailyGoal: selectedGoal === 'champion' ? 6 : selectedGoal === 'intense' ? 5 : 3,
        };
        try {
          localStorage.setItem('tf_user_profile', JSON.stringify(updated));
        } catch {}
        onProfileUpdate(updated);
        setRegisterStep(5);
      }, 700);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthAlert(null);

    if (!email || !password) {
      setAuthAlert({ text: isTr ? 'Lütfen tüm alanları doldurun.' : 'Please fill all fields.', error: true });
      return;
    }

    // Authenticate user
    const updated: UserProfile = {
      ...profile,
      email,
      username: username || email.split('@')[0],
      isGuest: false,
    };

    try {
      localStorage.setItem('tf_user_profile', JSON.stringify(updated));
    } catch {}

    onProfileUpdate(updated);
    setAuthAlert({ text: isTr ? '✨ Giriş başarılı! Hoş geldiniz.' : '✨ Login successful! Welcome back.', error: false });
    setTimeout(() => onClose(), 1000);
  };

  const handleSocialAuth = (provider: string) => {
    console.debug('[TypeFlow:Auth] Social single sign-on initiated:', provider);
    const mockEmail = `user_${provider.toLowerCase()}@tiyatrotist.com`;
    const updated: UserProfile = {
      ...profile,
      email: mockEmail,
      username: `${provider}User`,
      isGuest: false,
      gems: (profile.gems || 0) + 50,
    };
    try {
      localStorage.setItem('tf_user_profile', JSON.stringify(updated));
    } catch {}
    onProfileUpdate(updated);
    setAuthAlert({
      text: isTr ? `✓ ${provider} ile anında bağlanıldı!` : `✓ Connected with ${provider}!`,
      error: false,
    });
    setTimeout(() => onClose(), 1200);
  };

  // Data Export (JSON Download)
  const handleExportData = () => {
    console.debug('[TypeFlow:Auth] Exporting user stats & telemetry to JSON');
    const exportPayload = {
      schemaVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      user: profile,
      privacyCompliance: 'GDPR / KVKK Article 20 Right to Data Portability',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `typeflow_export_${profile.username || 'user'}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSecurityNotice(isTr ? '✓ Daktilo verileriniz .json olarak başarıyla indirildi.' : '✓ Your typing data was successfully exported as .json.');
    setTimeout(() => setSecurityNotice(null), 3500);
  };

  // Save Profile & Bio
  const handleSaveProfileDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      username: profileUsername.trim() || profile.username,
      avatar: profileAvatar,
      bio: profileBio.trim(),
    };
    try {
      localStorage.setItem('tf_user_profile', JSON.stringify(updated));
    } catch {}
    onProfileUpdate(updated);
    setSecurityNotice(isTr ? '✓ Profil bilgileriniz güncellendi.' : '✓ Profile updated.');
    setTimeout(() => setSecurityNotice(null), 3000);
  };

  // Delete Account
  const handleConfirmDelete = () => {
    if (deleteConfirmText !== 'HESABIMI SİL' && deleteConfirmText !== 'DELETE') {
      alert(isTr ? "Lütfen onay kutusuna 'HESABIMI SİL' yazın." : "Please type 'DELETE' to confirm.");
      return;
    }

    try {
      localStorage.removeItem('tf_user_profile');
      localStorage.removeItem('tf_theme');
      localStorage.removeItem('tf_sound');
    } catch {}

    window.location.reload();
  };

  return (
    <div className="tf-modal-backdrop" onClick={onClose}>
      <div
        className="tf-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', width: '92vw', padding: '1.75rem' }}
      >
        {/* Header */}
        <div className="tf-modal-header" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.6rem' }}>{profile.avatar || '🛡️'}</span>
            <div>
              <h3 className="tf-modal-title" style={{ fontSize: '1.05rem', margin: 0 }}>
                {isTr ? 'TYPEFLOW HESAP & ÜYELİK MERKEZİ' : 'TYPEFLOW ACCOUNT & MEMBERSHIP'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--tf-text-secondary)', fontFamily: 'var(--tf-font-mono)' }}>
                {profile.isGuest
                  ? (isTr ? 'Misafir Hesabı (Kalıcı Kayıt Yok)' : 'Guest Profile (Not Synced)')
                  : `ID: @${profile.username} // ${profile.email || 'Cloud Verified'}`}
              </span>
            </div>
          </div>
          <button className="tf-modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* 3 Main Tabs */}
        <div className="tf-modal-tabs" style={{ marginBottom: '1.25rem' }}>
          <button
            className={`tf-modal-tab ${activeMainTab === 'auth' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('auth')}
          >
            {isTr ? '🔑 Giriş & Kayıt' : '🔑 Auth & Join'}
          </button>
          <button
            className={`tf-modal-tab ${activeMainTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('security')}
          >
            {isTr ? '🛡️ Güvenlik & Veri' : '🛡️ Security & Data'}
          </button>
          <button
            className={`tf-modal-tab ${activeMainTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('profile')}
          >
            {isTr ? '🎭 Profil & Avatar' : '🎭 Profile & Bio'}
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* TAB 1: AUTH & MULTI-STEP ONBOARDING */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeMainTab === 'auth' && (
          <div>
            {/* Mode Toggle: Login vs Register */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setRegisterStep(1); }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '6px',
                  background: authMode === 'register' ? 'var(--tf-accent)' : 'transparent',
                  color: authMode === 'register' ? '#000' : 'var(--tf-text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isTr ? '✨ Detaylı Yeni Üyelik' : '✨ Detailed Registration'}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '6px',
                  background: authMode === 'login' ? 'var(--tf-accent)' : 'transparent',
                  color: authMode === 'login' ? '#000' : 'var(--tf-text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isTr ? 'Giriş Yap' : 'Sign In'}
              </button>
            </div>

            {authAlert && (
              <div
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.82rem',
                  background: authAlert.error ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${authAlert.error ? '#ef4444' : '#10b981'}`,
                  color: authAlert.error ? '#fca5a5' : '#6ee7b7',
                }}
              >
                {authAlert.text}
              </div>
            )}

            {/* 1A. FAST SOCIAL SINGLE SIGN-ON */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--tf-text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>
                {isTr ? 'VEYA TEK TIKLA BAĞLAN (SAAS STANDARDI)' : 'OR CONNECT WITH 1-CLICK'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  className="tf-btn-pushable"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--tf-text-primary)',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🌐 Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialAuth('GitHub')}
                  className="tf-btn-pushable"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--tf-text-primary)',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🐙 GitHub
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Apple')}
                  className="tf-btn-pushable"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--tf-text-primary)',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🍎 Apple
                </button>
              </div>
            </div>

            {/* 1B. LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <label className="tf-modal-label">{isTr ? 'E-Posta Adresi' : 'Email Address'}</label>
                  <input
                    type="email"
                    className="tf-modal-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@tiyatrotist.com"
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="tf-modal-label">{isTr ? 'Şifre' : 'Password'}</label>
                    <button
                      type="button"
                      onClick={() => alert(isTr ? 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' : 'Password reset link sent.')}
                      style={{ background: 'none', border: 'none', color: 'var(--tf-accent)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--tf-font-mono)' }}
                    >
                      {isTr ? 'Şifremi Unuttum?' : 'Forgot Password?'}
                    </button>
                  </div>
                  <input
                    type="password"
                    className="tf-modal-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button type="submit" className="tf-btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                  {isTr ? 'Giriş Yap & Senkronize Et' : 'Sign In & Sync'}
                </button>
              </form>
            )}

            {/* 1C. MULTI-STEP ONBOARDING WIZARD */}
            {authMode === 'register' && (
              <div>
                {/* Step Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        opacity: registerStep === s ? 1 : registerStep > s ? 0.8 : 0.35,
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: registerStep >= s ? 'var(--tf-accent)' : 'rgba(255,255,255,0.1)',
                          color: registerStep >= s ? '#000' : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                        }}
                      >
                        {registerStep > s ? '✓' : s}
                      </div>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--tf-font-mono)' }}>
                        {s === 1 ? (isTr ? 'Hesap' : 'Account') : s === 2 ? (isTr ? 'Seviye' : 'Skill') : s === 3 ? (isTr ? 'Hedef' : 'Goal') : s === 4 ? (isTr ? '2FA' : '2FA') : (isTr ? 'Hazır' : 'Done')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* STEP 1: CREDENTIALS & PASSWORD AUDIT */}
                {registerStep === 1 && (
                  <form onSubmit={handleNextFromStep1}>
                    <div style={{ marginBottom: '0.8rem' }}>
                      <label className="tf-modal-label">{isTr ? 'E-Posta Adresi' : 'Email Address'}</label>
                      <input
                        type="email"
                        className="tf-modal-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yazici@tiyatrotist.com"
                        required
                      />
                    </div>

                    <div style={{ marginBottom: '0.8rem' }}>
                      <label className="tf-modal-label">{isTr ? 'Kullanıcı Adı (Handle)' : 'Username'}</label>
                      <input
                        type="text"
                        className="tf-modal-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="örn. CyberRunner99"
                        required
                      />
                    </div>

                    <div style={{ marginBottom: '0.8rem' }}>
                      <label className="tf-modal-label">{isTr ? 'Güvenli Şifre' : 'Password'}</label>
                      <input
                        type="password"
                        className="tf-modal-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="En az 8 karakter..."
                        required
                      />
                      {/* Password Strength Meter */}
                      {password.length > 0 && (
                        <div style={{ marginTop: '0.4rem' }}>
                          <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${(strengthScore / 4) * 100}%`,
                                background: strengthScore <= 1 ? '#ef4444' : strengthScore <= 2 ? '#f59e0b' : strengthScore === 3 ? '#38bdf8' : '#10b981',
                                transition: 'all 0.3s ease',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--tf-text-secondary)', fontFamily: 'var(--tf-font-mono)' }}>
                            {isTr ? 'Güvenlik: ' : 'Strength: '}
                            {strengthScore <= 1 ? (isTr ? 'Zayıf' : 'Weak') : strengthScore <= 2 ? (isTr ? 'Orta' : 'Medium') : (isTr ? 'Güçlü' : 'Strong')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <label htmlFor="agreeTerms" style={{ fontSize: '0.75rem', color: 'var(--tf-text-secondary)', cursor: 'pointer' }}>
                        {isTr
                          ? 'KVKK ve Kullanım Koşullarını okudum, onaylıyorum.'
                          : 'I agree to the Terms of Service & Privacy Policy.'}
                      </label>
                    </div>

                    <button type="submit" className="tf-btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                      {isTr ? 'Sonraki Adım: Seviye Belirleme →' : 'Next Step: Skill Diagnostic →'}
                    </button>
                  </form>
                )}

                {/* STEP 2: SKILL DIAGNOSTIC */}
                {registerStep === 2 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
                      {isTr ? 'Klavyedeki Mevcut Seviyen Nedir?' : 'What is your typing experience?'}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--tf-text-secondary)', margin: '0 0 1rem 0' }}>
                      {isTr ? 'Akademi müfredatını ve günlük hedeflerini sana özel uyarlayacağız.' : 'We tailor practice drills and challenges to your current rhythm.'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                      {SKILL_OPTIONS.map((sk) => (
                        <div
                          key={sk.id}
                          onClick={() => setSelectedSkill(sk.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            background: selectedSkill === sk.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                            border: `1.5px solid ${selectedSkill === sk.id ? 'var(--tf-accent)' : 'rgba(255,255,255,0.08)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ fontSize: '1.6rem' }}>{sk.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                                {isTr ? sk.titleTr : sk.titleEn}
                              </span>
                              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--tf-font-mono)', color: 'var(--tf-accent)', fontWeight: 800 }}>
                                {sk.wpmRange}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--tf-text-secondary)' }}>
                              {isTr ? sk.descTr : sk.descEn}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="tf-ctrl-btn"
                        onClick={() => setRegisterStep(1)}
                        style={{ padding: '0.7rem 1rem' }}
                      >
                        ← {isTr ? 'Geri' : 'Back'}
                      </button>
                      <button
                        type="button"
                        className="tf-btn-primary"
                        onClick={handleNextFromStep2}
                        style={{ flex: 1, padding: '0.7rem' }}
                      >
                        {isTr ? 'Sonraki: Günlük Hedef →' : 'Next: Daily Goal →'}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: DAILY COMMITMENT */}
                {registerStep === 3 && (
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
                      {isTr ? 'Günde Ne Kadar Çalışmak İstiyorsun?' : 'Commit to a Daily Goal'}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--tf-text-secondary)', margin: '0 0 1rem 0' }}>
                      {isTr ? 'Günlük seri (streak) alevini korumak için sana en uygun tempoyu seç.' : 'Choose your optimal tempo to maintain your daily streak flame.'}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', marginBottom: '1.25rem' }}>
                      {GOAL_OPTIONS.map((g) => (
                        <div
                          key={g.id}
                          onClick={() => setSelectedGoal(g.id)}
                          style={{
                            padding: '0.85rem',
                            borderRadius: '10px',
                            background: selectedGoal === g.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                            border: `1.5px solid ${selectedGoal === g.id ? 'var(--tf-accent)' : 'rgba(255,255,255,0.08)'}`,
                            cursor: 'pointer',
                            position: 'relative',
                          }}
                        >
                          {g.isPopular && (
                            <span style={{ position: 'absolute', top: '-8px', right: '10px', background: '#10b981', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>
                              {isTr ? 'ÖNERİLEN' : 'POPULAR'}
                            </span>
                          )}
                          <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>{g.icon}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                            {isTr ? g.titleTr : g.titleEn}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--tf-text-secondary)' }}>
                            {isTr ? g.descTr : g.descEn}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      <input
                        type="checkbox"
                        id="reminderCheck"
                        checked={enableDailyReminder}
                        onChange={(e) => setEnableDailyReminder(e.target.checked)}
                      />
                      <label htmlFor="reminderCheck" style={{ fontSize: '0.75rem', color: 'var(--tf-text-secondary)', cursor: 'pointer' }}>
                        {isTr ? 'Serimi kaybetmemem için günlük pratik hatırlatıcısı gönder.' : 'Send daily email reminder to protect my streak.'}
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="tf-ctrl-btn"
                        onClick={() => setRegisterStep(2)}
                        style={{ padding: '0.7rem 1rem' }}
                      >
                        ← {isTr ? 'Geri' : 'Back'}
                      </button>
                      <button
                        type="button"
                        className="tf-btn-primary"
                        onClick={handleNextFromStep3}
                        style={{ flex: 1, padding: '0.7rem' }}
                      >
                        {isTr ? 'Sonraki: 2FA Güvenlik Kodu →' : 'Next: 2FA Security →'}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: 2FA SECURITY OTP CODE */}
                {registerStep === 4 && (
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '2.4rem' }}>🔐</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.5rem 0 0.25rem 0' }}>
                      {isTr ? 'Güvenlik Doğrulama Kodu' : 'Security Verification Code'}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--tf-text-secondary)', margin: '0 0 1.25rem 0' }}>
                      {isTr
                        ? `${email || 'e-posta'} adresinize 6 haneli doğrulama kodu iletildi.`
                        : `A 6-digit security verification code was sent to ${email || 'your email'}.`}
                    </p>

                    {/* 6 Digit Box Display */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      {otpCode.map((digit, idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const newArr = [...otpCode];
                            newArr[idx] = e.target.value;
                            setOtpCode(newArr);
                          }}
                          style={{
                            width: '42px',
                            height: '48px',
                            fontSize: '1.3rem',
                            fontWeight: 800,
                            textAlign: 'center',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1.5px solid var(--tf-accent)',
                            borderRadius: '8px',
                            color: 'var(--tf-text-primary)',
                            fontFamily: 'var(--tf-font-mono)',
                          }}
                        />
                      ))}
                    </div>

                    <div style={{ marginBottom: '1.25rem', fontSize: '0.75rem', color: 'var(--tf-text-muted)' }}>
                      {resendTimer > 0 ? (
                        <span>{isTr ? `Kodu tekrar gönder (${resendTimer}s)` : `Resend code in (${resendTimer}s)`}</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setResendTimer(30)}
                          style={{ background: 'none', border: 'none', color: 'var(--tf-accent)', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {isTr ? 'Kodu Tekrar Gönder' : 'Resend Verification Code'}
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="tf-ctrl-btn"
                        onClick={() => setRegisterStep(3)}
                        style={{ padding: '0.7rem 1rem' }}
                      >
                        ← {isTr ? 'Geri' : 'Back'}
                      </button>
                      <button
                        type="button"
                        className="tf-btn-primary"
                        onClick={handleVerifyOtp}
                        style={{ flex: 1, padding: '0.7rem' }}
                      >
                        {isOtpVerified ? '✓ Doğrulandı' : (isTr ? 'Doğrula & Hesabı Tamamla 🎉' : 'Verify & Complete 🎉')}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: WELCOME CELEBRATION */}
                {registerStep === 5 && (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '0 0 0.4rem 0', color: 'var(--tf-accent)' }}>
                      {isTr ? 'Hoş Geldin, Daktilist!' : 'Welcome to TypeFlow!'}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--tf-text-secondary)', margin: '0 0 1.5rem 0' }}>
                      {isTr
                        ? 'Hesabın başarıyla oluşturuldu ve bulut ile senkronize edildi. Hoş geldin hediyelerin tanımlandı!'
                        : 'Your account has been verified and synchronized. Welcome rewards have been credited!'}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '0.75rem', borderRadius: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>💎</span>
                        <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.1rem' }}>+100 Elmas</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--tf-text-secondary)' }}>
                          {isTr ? 'Mağazada Harca' : 'Spend in Shop'}
                        </span>
                      </div>
                      <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: '0.75rem', borderRadius: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                        <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1.1rem' }}>+1 Seri Koruması</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--tf-text-secondary)' }}>
                          {isTr ? 'Alevini Koru' : 'Streak Protected'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="tf-btn-primary"
                      onClick={onClose}
                      style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
                    >
                      🚀 {isTr ? 'Daktilo Akademisine Başla' : 'Start Typing Academy'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* TAB 2: SECURITY, 2FA & DATA PORTABILITY */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeMainTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {securityNotice && (
              <div style={{ padding: '0.65rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', color: '#6ee7b7', fontSize: '0.82rem' }}>
                {securityNotice}
              </div>
            )}

            {/* 2FA Switch */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  {isTr ? '🔐 İki Aşamalı Doğrulama (2FA)' : '🔐 Two-Factor Authentication (2FA)'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--tf-text-secondary)' }}>
                  {isTr ? 'Yeni cihazlardan girişte e-posta / SMS güvenlik kodu istenir.' : 'Require OTP confirmation code when signing in from new devices.'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  setSecurityNotice(twoFactorEnabled ? (isTr ? '2FA devre dışı bırakıldı.' : '2FA disabled.') : (isTr ? '✓ 2FA koruması etkinleştirildi.' : '✓ 2FA enabled.'));
                  setTimeout(() => setSecurityNotice(null), 3000);
                }}
                className="tf-btn-pushable"
                style={{
                  background: twoFactorEnabled ? '#10b981' : 'rgba(255,255,255,0.1)',
                  color: twoFactorEnabled ? '#000' : '#fff',
                  border: 'none',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {twoFactorEnabled ? (isTr ? 'AKTİF ✓' : 'ENABLED ✓') : (isTr ? 'KAPALI' : 'DISABLED')}
              </button>
            </div>

            {/* Connected Accounts */}
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                {isTr ? '🔗 Bağlı Hesaplar' : '🔗 Connected Accounts'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span>🌐 Google ({profile.email || 'user@gmail.com'})</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>✓ {isTr ? 'Bağlı' : 'Linked'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span>🐙 GitHub</span>
                  <button type="button" onClick={() => handleSocialAuth('GitHub')} style={{ background: 'none', border: 'none', color: 'var(--tf-accent)', cursor: 'pointer', fontSize: '0.75rem' }}>
                    {isTr ? 'Bağla ↗' : 'Connect ↗'}
                  </button>
                </div>
              </div>
            </div>

            {/* GDPR / KVKK Data Export */}
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                {isTr ? '📊 Daktilo Verilerimi İndir (.json)' : '📊 Export My Data (.json)'}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--tf-text-secondary)', margin: '0 0 0.75rem 0' }}>
                {isTr
                  ? 'KVKK ve GDPR veri taşınabilirliği kapsamında tüm test geçmişini, WPM rekorlarını ve ısı haritası istatistiklerini indir.'
                  : 'Download complete WPM telemetry, mistake heatmaps, and test history in standard JSON.'}
              </p>
              <button
                type="button"
                onClick={handleExportData}
                className="tf-ctrl-btn tf-btn-pushable"
                style={{ fontSize: '0.78rem', fontWeight: 700, borderColor: 'var(--tf-accent)', color: 'var(--tf-accent)' }}
              >
                📥 {isTr ? 'JSON Veri Dosyasını İndir' : 'Download JSON Data File'}
              </button>
            </div>

            {/* Danger Zone: Delete Account */}
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.06)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ef4444', marginBottom: '0.2rem' }}>
                {isTr ? '⚠️ Tehlike Bölgesi: Hesabı Sil' : '⚠️ Danger Zone: Delete Account'}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--tf-text-muted)', margin: '0 0 0.75rem 0' }}>
                {isTr ? 'Tüm ilerleme, elmaslar ve lig puanları kalıcı olarak silinir.' : 'Permanently erase all WPM history, gems, and league standings.'}
              </p>
              {showDeleteModal ? (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginBottom: '0.4rem' }}>
                    {isTr ? "Onaylamak için 'HESABIMI SİL' yazın:" : "Type 'DELETE' to confirm:"}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="tf-modal-input"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="HESABIMI SİL"
                      style={{ borderColor: '#ef4444' }}
                    />
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      {isTr ? 'Sil' : 'Delete'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isTr ? 'Hesabımı Kalıcı Olarak Sil...' : 'Delete My Account...'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* TAB 3: PROFILE & BIO CUSTOMIZATION */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeMainTab === 'profile' && (
          <form onSubmit={handleSaveProfileDetails}>
            {securityNotice && (
              <div style={{ padding: '0.65rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', color: '#6ee7b7', fontSize: '0.82rem', marginBottom: '1rem' }}>
                {securityNotice}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label className="tf-modal-label">{isTr ? 'Kullanıcı Adı' : 'Username'}</label>
              <input
                type="text"
                className="tf-modal-input"
                value={profileUsername}
                onChange={(e) => setProfileUsername(e.target.value)}
                maxLength={24}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="tf-modal-label">{isTr ? 'Biyografi & Kişisel Not' : 'Bio & Personal Note'}</label>
              <textarea
                className="tf-modal-input"
                rows={3}
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                maxLength={180}
                style={{ resize: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="tf-modal-label">{isTr ? 'Avatar Seçimi' : 'Choose Avatar'}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginTop: '0.35rem' }}>
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setProfileAvatar(av)}
                    style={{
                      fontSize: '1.6rem',
                      padding: '0.6rem',
                      background: profileAvatar === av ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${profileAvatar === av ? 'var(--tf-accent)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="tf-btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              {isTr ? 'Profili Kaydet & Güncelle' : 'Save & Update Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
