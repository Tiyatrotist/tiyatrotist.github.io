/**
 * TYPEFLOW — Hierarchical Slide-Over Profile & Settings Menu (Yan Bar)
 * Organized into dedicated, categorized sub-menus (Drill-Down Menu Architecture)
 * - Tapping the Profile Preview Card immediately opens Profile & Account Settings
 * - Account Settings, Cloud Sync, and Account Deletion / Data Reset are unified under Account Details
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/dictionaries';
import { TypeFlowTheme, SoundType, UserProfile, SaaSTab } from './types';
import { soundEngine } from './TypeFlowSoundEngine';
import { supabase } from '@/lib/supabase';
import {
  User,
  Palette,
  Volume2,
  VolumeX,
  Globe,
  Keyboard,
  Target,
  BarChart3,
  Flame,
  Gem,
  BatteryCharging,
  Crown,
  Settings,
  Check,
  Lock,
  Edit2,
  Music,
  Zap,
  Sparkles,
  Trophy,
  Shield,
  ShieldCheck,
  X,
  AlertTriangle,
  ChevronRight,
  LogOut,
  Infinity as InfinityIcon,
  Cloud,
  Trash2,
  ArrowLeft,
  Sliders,
} from 'lucide-react';

interface TypeFlowProfileDrawerProps {
  isOpen: boolean;
  lang: Locale;
  theme: TypeFlowTheme;
  sound: SoundType;
  volume: number;
  profile: UserProfile;
  onClose: () => void;
  onThemeChange: (t: TypeFlowTheme) => void;
  onSoundChange: (s: SoundType) => void;
  onVolumeChange: (v: number) => void;
  onLangChange: (l: Locale) => void;
  onProfileUpdate: (p: UserProfile) => void;
  onNavigateTab: (tab: SaaSTab) => void;
  onOpenShop: () => void;
  onOpenSuperModal?: () => void;
  onOpenAdModal?: () => void;
  onCancelSubscription?: () => void;
  onOpenAuth?: () => void;
}

type DrawerView = 'main' | 'themes' | 'sound' | 'lang' | 'typing' | 'goals' | 'account';

const THEMES_CONFIG: { id: TypeFlowTheme; nameTr: string; nameEn: string; bg: string; surface: string; accent: string }[] = [
  { id: 'carbon', nameTr: 'Carbon (Monokrom)', nameEn: 'Carbon (Monochrome)', bg: '#000000', surface: '#141418', accent: '#ffffff' },
  { id: 'amber', nameTr: 'Cyber Amber (Kehribar)', nameEn: 'Cyber Amber', bg: '#0a0804', surface: '#1e180d', accent: '#f59e0b' },
  { id: 'emerald', nameTr: 'Matrix Emerald (Zümrüt)', nameEn: 'Matrix Emerald', bg: '#040906', surface: '#0e2014', accent: '#10b981' },
  { id: 'slate', nameTr: 'Nordic Slate (Kutup Buz)', nameEn: 'Nordic Slate', bg: '#060b13', surface: '#142036', accent: '#38bdf8' },
  { id: 'violet', nameTr: 'Tokyo Violet (Siber Gece)', nameEn: 'Tokyo Violet', bg: '#090612', surface: '#1c1438', accent: '#a855f7' },
  { id: 'rose', nameTr: 'Rose Quartz (Kuvars)', nameEn: 'Rose Quartz', bg: '#0f070b', surface: '#26121f', accent: '#fb7185' },
  { id: 'cyber', nameTr: 'Cyberpunk Neon (Siyan)', nameEn: 'Cyberpunk Neon', bg: '#030712', surface: '#111d3e', accent: '#22d3ee' },
];

const SOUNDS_CONFIG: { id: SoundType; nameTr: string; nameEn: string }[] = [
  { id: 'thock', nameTr: 'Thock (Linear)', nameEn: 'Thock (Linear)' },
  { id: 'clicky', nameTr: 'Clicky (Model M)', nameEn: 'Clicky (Model M)' },
  { id: 'tactile', nameTr: 'Tactile (Panda)', nameEn: 'Tactile (Panda)' },
  { id: 'synth', nameTr: 'Synth (80s Melodi)', nameEn: 'Synth (80s Chime)' },
  { id: 'off', nameTr: 'Sessiz (Kapalı)', nameEn: 'Muted (Off)' },
];

function getSoundIcon(id: SoundType) {
  switch (id) {
    case 'thock':
      return <Keyboard size={16} />;
    case 'clicky':
      return <Volume2 size={16} />;
    case 'tactile':
      return <Zap size={16} />;
    case 'synth':
      return <Music size={16} />;
    case 'off':
      return <VolumeX size={16} />;
  }
}

const AVATAR_OPTIONS = ['⚡', '🤖', '👾', '🚀', '🔥', '🦊', '🐱', '💀', '🛡', '🌐', '🎯', '💎'];

export default function TypeFlowProfileDrawer({
  isOpen,
  lang,
  theme,
  sound,
  volume,
  profile,
  onClose,
  onThemeChange,
  onSoundChange,
  onVolumeChange,
  onLangChange,
  onProfileUpdate,
  onNavigateTab,
  onOpenShop,
  onOpenSuperModal,
  onOpenAdModal,
  onCancelSubscription,
  onOpenAuth,
}: TypeFlowProfileDrawerProps) {
  const isTr = lang === 'tr';

  // Current active navigation view
  const [currentView, setCurrentView] = useState<DrawerView>('main');

  // Inline editing state for nickname & avatar
  const [isEditingName, setIsEditingName] = useState(false);
  const [usernameInput, setUsernameInput] = useState(profile.username);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Cloud Auth inline state
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  // Preferences
  const [caretStyle, setCaretStyle] = useState<'line' | 'block' | 'underline'>('line');
  const [quickRestart, setQuickRestart] = useState(true);
  const [typoGlow, setTypoGlow] = useState(true);
  const [capsLockAlert, setCapsLockAlert] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Audit Fix #14
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Reset to main view whenever drawer opens
  useEffect(() => {
    if (isOpen) {
      setCurrentView('main');
      setUsernameInput(profile.username);
      setShowAvatarPicker(false);
      setIsEditingName(false);
    }
  }, [isOpen, profile.username]);

  // Keyboard shortcut: close drawer or go back on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (currentView !== 'main') {
          setCurrentView('main');
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentView, onClose]);

  if (!isOpen) return null;

  // Sound audition
  const handleTestSound = (st: SoundType) => {
    soundEngine.setSoundType(st);
    soundEngine.playKey(false, false);
    console.debug('[TypeFlow:Drawer] Auditioned sound:', st);
  };

  // Save nickname
  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    const updated: UserProfile = {
      ...profile,
      username: usernameInput.trim(),
    };
    onProfileUpdate(updated);
    setIsEditingName(false);
    showNotice(isTr ? 'Kullanıcı adı güncellendi!' : 'Username updated!');
  };

  // Change avatar
  const handleSelectAvatar = (av: string) => {
    const updated: UserProfile = { ...profile, avatar: av };
    onProfileUpdate(updated);
    setShowAvatarPicker(false);
    showNotice(isTr ? 'Avatar güncellendi!' : 'Avatar updated!');
  };

  // Save daily goal
  const handleSelectGoal = (g: number) => {
    const updated: UserProfile = { ...profile, dailyGoal: g };
    onProfileUpdate(updated);
    showNotice(isTr ? `Günlük hedef ${g} test olarak ayarlandı.` : `Daily goal set to ${g} tests.`);
  };

  // Feedback toast
  const showNotice = (text: string) => {
    setFeedbackMsg(text);
    setTimeout(() => setFeedbackMsg(null), 2400);
  };

  // Supabase Auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthFeedback(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        const updated: UserProfile = {
          ...profile,
          id: data.user?.id || profile.id,
          username: authEmail.split('@')[0],
          email: authEmail,
          isGuest: false,
        };
        onProfileUpdate(updated);
        setAuthFeedback({
          msg: isTr ? 'Kayıt başarılı! Bulut hesabınız bağlandı.' : 'Account registered and connected.',
          isError: false,
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        const updated: UserProfile = {
          ...profile,
          id: data.user?.id || profile.id,
          username: authEmail.split('@')[0],
          email: authEmail,
          isGuest: false,
        };
        onProfileUpdate(updated);
        setAuthFeedback({
          msg: isTr ? 'Giriş başarılı! Hoş geldiniz.' : 'Signed in successfully.',
          isError: false,
        });
      }
    } catch (err: any) {
      console.warn('[TypeFlow:Drawer] Auth error:', err);
      setAuthFeedback({
        msg: err?.message || (isTr ? 'Giriş yapılamadı.' : 'Authentication failed.'),
        isError: true,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  // Delete account & Wipe local data (Audit Fix #14: requires 2-step inline confirmation)
  const handleResetData = () => {
    try {
      localStorage.removeItem('tf_user_profile');
      localStorage.removeItem('tf_theme');
      localStorage.removeItem('tf_sound');
      localStorage.removeItem('tf_volume');
      localStorage.removeItem('tf_local_scores');
      localStorage.removeItem('tf_drill_attempts');
      localStorage.removeItem('tf_last_energy_time');
      localStorage.removeItem('tf_week_reset');
      console.debug('[TypeFlow:Drawer] All local data wiped. Reloading...');
      window.location.reload();
    } catch (e) {
      console.error('[TypeFlow:Drawer] Reset error:', e);
    }
  };

  const currentThemeObj = THEMES_CONFIG.find((t) => t.id === theme) || THEMES_CONFIG[0];
  const currentSoundObj = SOUNDS_CONFIG.find((s) => s.id === sound) || SOUNDS_CONFIG[0];
  const currentXpProgress = Math.min(100, Math.round((profile.xp % 100) / 100 * 100));

  return (
    <div className="tf-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <aside className="tf-profile-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header (Back button if in sub-view, Close button always) */}
        <div className="tf-drawer-header">
          {currentView === 'main' ? (
            <div className="tf-drawer-header-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} style={{ color: 'var(--tf-accent)' }} />
              <h3 className="tf-drawer-title">{isTr ? 'PROFİL VE AYARLAR' : 'PROFILE & SETTINGS'}</h3>
            </div>
          ) : (
            <button className="tf-drawer-back-btn" onClick={() => setCurrentView('main')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={14} />
              <span>{isTr ? 'Menüye Dön' : 'Back to Menu'}</span>
            </button>
          )}

          <button className="tf-drawer-close-btn" onClick={onClose} aria-label="Close drawer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className="tf-drawer-toast" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={14} style={{ color: '#fbbf24' }} />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <div className="tf-drawer-content">
          {/* ══════════════════════════════════════════════════════════════════════
              VIEW 1: MAIN MENU (Clean, Categorized, Zero Clutter)
             ══════════════════════════════════════════════════════════════════════ */}
          {currentView === 'main' && (
            <div className="tf-drawer-main-view">
              {/* Clickable Profile Card Preview -> Directly opens Account Settings */}
              <div
                className="tf-drawer-profile-card clickable"
                onClick={() => setCurrentView('account')}
                title={isTr ? "Profil ve Hesap Ayarlarını Aç" : "Open Profile & Account Settings"}
              >
                <div className="tf-drawer-avatar-wrap">
                  <div className="tf-drawer-avatar-btn">
                    <span className="tf-drawer-avatar" suppressHydrationWarning>{profile.avatar}</span>
                    <span className="tf-drawer-avatar-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Settings size={10} />
                    </span>
                  </div>

                  <div className="tf-drawer-user-meta">
                    <div className="tf-drawer-name-row">
                      <h4 className="tf-drawer-username" suppressHydrationWarning>{profile.username}</h4>
                    </div>

                    <div className="tf-drawer-badges-row">
                      <span className="tf-drawer-level-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Zap size={11} /> {isTr ? `Seviye ${profile.level}` : `Level ${profile.level}`}
                      </span>
                      <span className="tf-drawer-status-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        {profile.isGuest ? (isTr ? 'Misafir' : 'Guest') : (<><Check size={11} strokeWidth={3} /> Cloud</>)}
                      </span>
                    </div>
                  </div>

                  <span className="tf-card-chevron">›</span>
                </div>

                {/* XP Progress Bar */}
                <div className="tf-drawer-xp-wrap">
                  <div className="tf-drawer-xp-text">
                    <span>XP {profile.xp}</span>
                    <span>{currentXpProgress}%</span>
                  </div>
                  <div className="tf-drawer-xp-track">
                    <div className="tf-drawer-xp-fill" style={{ width: `${currentXpProgress}%` }} />
                  </div>
                </div>

                {/* Quick 3 Stats */}
                <div className="tf-drawer-stats-grid">
                  <div className="tf-drawer-stat-item">
                    <span className="tf-stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Flame size={16} style={{ color: '#f97316' }} />
                    </span>
                    <span className="tf-stat-val">{profile.streakDays}</span>
                    <span className="tf-stat-lbl">{isTr ? 'Gün' : 'Days'}</span>
                  </div>
                  <div className="tf-drawer-stat-item" onClick={(e) => { e.stopPropagation(); onOpenShop(); }} style={{ cursor: 'pointer' }}>
                    <span className="tf-stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Gem size={16} style={{ color: '#38bdf8' }} />
                    </span>
                    <span className="tf-stat-val">{profile.gems || 0}</span>
                    <span className="tf-stat-lbl">{isTr ? 'Elmas' : 'Gems'}</span>
                  </div>
                  <div
                    className="tf-drawer-stat-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenSuperModal) onOpenSuperModal();
                      else onOpenShop();
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="tf-stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BatteryCharging size={16} style={{ color: '#10b981' }} />
                    </span>
                    <span className="tf-stat-val" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      {profile.isPremium ? <InfinityIcon size={16} style={{ color: '#10b981' }} /> : `${profile.energy ?? profile.hearts ?? 5}/5`}
                    </span>
                    <span className="tf-stat-lbl">{isTr ? 'Enerji' : 'Battery'}</span>
                  </div>
                </div>

                <div className="tf-profile-card-cta">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Settings size={14} />
                    <span>{isTr ? 'Hesap ve Profil Ayarlarını Yönet' : 'Manage Account & Profile'}</span>
                  </span>
                  <span>›</span>
                </div>
              </div>

              {/* ─── GROUP 1: AYARLAR & GÖRÜNÜM ─── */}
              <div className="tf-menu-group">
                <div className="tf-menu-group-header">
                  {isTr ? 'AYARLAR & TERCİHLER' : 'SETTINGS & PREFERENCES'}
                </div>

                {/* 0. Super TypeFlow Pro SaaS Row */}
                <button
                  className="tf-menu-item tf-btn-pushable"
                  style={{
                    border: '1px solid rgba(234, 179, 8, 0.4)',
                    background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(56, 189, 248, 0.08))',
                    borderRadius: '10px',
                    marginBottom: '0.5rem',
                  }}
                  onClick={() => onOpenSuperModal?.()}
                >
                  <div className="tf-menu-item-left">
                    <span className="tf-menu-item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                      <Crown size={22} style={{ color: '#fbbf24' }} />
                    </span>
                    <div className="tf-menu-item-info">
                      <span className="tf-menu-item-title" style={{ color: '#fbbf24', fontWeight: 800 }}>
                        {profile.isPremium
                          ? (isTr ? 'Super TypeFlow (Aktif)' : 'Super TypeFlow (Active)')
                          : (isTr ? 'Super TypeFlow Pro\'ya Yükselt' : 'Upgrade to Super TypeFlow Pro')}
                      </span>
                      <span className="tf-menu-item-desc">
                        {isTr
                          ? 'Sınırsız enerji, sıfır reklam, 2X XP'
                          : 'Unlimited energy, zero ads, 2X XP boost'}
                      </span>
                    </div>
                  </div>
                  <div className="tf-menu-item-right">
                    <span className="tf-menu-item-chevron">›</span>
                  </div>
                </button>

                {/* 1. Görünüm & Temalar */}
                <button className="tf-menu-item" onClick={() => setCurrentView('themes')}>
                  <div className="tf-menu-item-left">
                    <span className="tf-menu-item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                      <Palette size={20} style={{ color: 'var(--tf-accent)' }} />
                    </span>
                    <div className="tf-menu-item-info">
                      <span className="tf-menu-item-title">{isTr ? 'Görünüm & Temalar' : 'Themes & Appearance'}</span>
                      <span className="tf-menu-item-desc">{isTr ? 'Renk paleti ve karanlık mod' : 'Color palette and aesthetics'}</span>
                    </div>
                  </div>
                  <div className="tf-menu-item-right">
                    <span className="tf-menu-badge" style={{ color: currentThemeObj.accent }}>
                      ● {isTr ? currentThemeObj.nameTr.split(' ')[0] : currentThemeObj.nameEn.split(' ')[0]}
                    </span>
                    <span className="tf-menu-chevron">›</span>
                  </div>
                </button>

                {/* 2. Ses & Akustik */}
                <button className="tf-menu-item" onClick={() => setCurrentView('sound')}>
                  <div className="tf-menu-item-left">
                    <span className="tf-menu-item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                      <Volume2 size={20} style={{ color: '#38bdf8' }} />
                    </span>
                    <div className="tf-menu-item-info">
                      <span className="tf-menu-item-title">{isTr ? 'Ses & Akustik' : 'Sound & Audio'}</span>
                      <span className="tf-menu-item-desc">{isTr ? 'Mekanik tuş sesleri ve volüm' : 'Mechanical switch acoustics'}</span>
                    </div>
                  </div>
                  <div className="tf-menu-item-right">
                    <span className="tf-menu-badge">
                      {sound === 'off' ? (isTr ? 'Kapalı' : 'Off') : `${currentSoundObj.nameTr.split(' ')[0]} (%${Math.round(volume * 100)})`}
                    </span>
                    <span className="tf-menu-chevron">›</span>
                  </div>
                </button>

                {/* 3. Dil Seçimi */}
                <button className="tf-menu-item" onClick={() => setCurrentView('lang')}>
                  <div className="tf-menu-item-left">
                    <span className="tf-menu-item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                      <Globe size={20} style={{ color: '#10b981' }} />
                    </span>
                    <div className="tf-menu-item-info">
                      <span className="tf-menu-item-title">{isTr ? 'Dil (Language)' : 'Language'}</span>
                      <span className="tf-menu-item-desc">{isTr ? 'Arayüz dili' : 'Interface language'}</span>
                    </div>
                  </div>
                  <div className="tf-menu-item-right">
                    <span className="tf-menu-badge">
                      {isTr ? 'TR Türkçe' : 'EN English'}
                    </span>
                    <span className="tf-menu-chevron">›</span>
                  </div>
                </button>

                {/* 4. Yazım & Caret */}
                <button className="tf-menu-item" onClick={() => setCurrentView('typing')}>
                  <div className="tf-menu-item-left">
                    <span className="tf-menu-item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                      <Keyboard size={20} style={{ color: '#a855f7' }} />
                    </span>
                    <div className="tf-menu-item-info">
                      <span className="tf-menu-item-title">{isTr ? 'Yazım & Caret' : 'Typing & Caret'}</span>
                      <span className="tf-menu-item-desc">{isTr ? 'İmleç tipi, hızlı restart ve hata' : 'Caret, shortcuts & alerts'}</span>
                    </div>
                  </div>
                  <div className="tf-menu-item-right">
                    <span className="tf-menu-badge">
                      {caretStyle === 'line' ? '| Çizgi' : caretStyle === 'block' ? '█ Blok' : '_ Alt Çizgi'}
                    </span>
                    <span className="tf-menu-chevron">›</span>
                  </div>
                </button>
              </div>

              {/* ─── GROUP 2: İLERLEME & HEDEFLER ─── */}
              <div className="tf-menu-group">
                <div className="tf-menu-group-header">
                  {isTr ? 'İLERLEME & İSTATİSTİK' : 'PROGRESS & STATS'}
                </div>

                {/* 5. Günlük Hedef & Lig */}
                <button className="tf-menu-item" onClick={() => setCurrentView('goals')}>
                  <div className="tf-menu-item-left">
                    <span className="tf-menu-item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                      <Target size={20} style={{ color: '#f59e0b' }} />
                    </span>
                    <div className="tf-menu-item-info">
                      <span className="tf-menu-item-title">{isTr ? 'Hedefler & Lig' : 'Goals & League'}</span>
                      <span className="tf-menu-item-desc">{isTr ? 'Günlük test kotası ve lig sıralaması' : 'Daily quota & weekly leagues'}</span>
                    </div>
                  </div>
                  <div className="tf-menu-item-right">
                    <span className="tf-menu-badge">
                      {profile.dailyGoal || 3} Test / {profile.league.toUpperCase()}
                    </span>
                    <span className="tf-menu-chevron">›</span>
                  </div>
                </button>

                {/* 6. Detaylı Profil & Isı Haritası */}
                <button
                  className="tf-menu-item"
                  onClick={() => onNavigateTab('profile')}
                >
                  <div className="tf-menu-item-left">
                    <span className="tf-menu-item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                      <BarChart3 size={20} style={{ color: '#06b6d4' }} />
                    </span>
                    <div className="tf-menu-item-info">
                      <span className="tf-menu-item-title">{isTr ? 'Profil & Isı Haritası' : 'Profile & Heatmap'}</span>
                      <span className="tf-menu-item-desc">{isTr ? 'Tuş doğruluk dağılımı ve geçmiş' : 'Key heatmap & score history'}</span>
                    </div>
                  </div>
                  <div className="tf-menu-item-right">
                    <span className="tf-menu-chevron">›</span>
                  </div>
                </button>
              </div>

              {/* ─── GROUP 3: HESAP & SİLME ─── */}
              <div className="tf-menu-group">
                <div className="tf-menu-group-header">
                  {isTr ? 'HESAP YÖNETİMİ' : 'ACCOUNT MANAGEMENT'}
                </div>

                {/* 7. Profil ve Hesap Ayarları (Bulut + Silme dahil) */}
                <button className="tf-menu-item" onClick={() => setCurrentView('account')}>
                  <div className="tf-menu-item-left">
                    <span className="tf-menu-item-icon" style={{ display: 'flex', alignItems: 'center' }}>
                      <User size={20} style={{ color: '#8b5cf6' }} />
                    </span>
                    <div className="tf-menu-item-info">
                      <span className="tf-menu-item-title">{isTr ? 'Profil, Hesap & Silme' : 'Profile, Account & Reset'}</span>
                      <span className="tf-menu-item-desc">{isTr ? 'Avatar, bulut hesabı ve hesap silme' : 'Avatar, cloud sync & account deletion'}</span>
                    </div>
                  </div>
                  <div className="tf-menu-item-right">
                    <span className="tf-menu-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      {profile.isGuest ? (isTr ? 'Misafir' : 'Guest') : (<><Check size={11} strokeWidth={3} /> Cloud</>)}
                    </span>
                    <span className="tf-menu-chevron">›</span>
                  </div>
                </button>
              </div>

              <div className="tf-drawer-footer-tag">
                TYPEFLOW v2.4 // TIYATROTIST LABS
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              VIEW 2: THEMES SUB-MENU
             ══════════════════════════════════════════════════════════════════════ */}
          {currentView === 'themes' && (
            <div className="tf-submenu-container">
              <div className="tf-submenu-header">
                <h4 className="tf-submenu-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Palette size={18} style={{ color: 'var(--tf-accent)' }} />
                  <span>{isTr ? 'Görünüm & Temalar' : 'Themes & Appearance'}</span>
                </h4>
                <p className="tf-submenu-desc">
                  {isTr ? 'Platform genelinde kullanılacak renk paletini seçin:' : 'Choose your desired visual palette:'}
                </p>
              </div>

              <div className="tf-drawer-theme-grid">
                {THEMES_CONFIG.map((t) => {
                  const isActive = theme === t.id;
                  const isUnlocked = profile.unlockedThemes?.includes(t.id) ?? true;

                  return (
                    <div
                      key={t.id}
                      className={`tf-drawer-theme-card ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
                      onClick={() => {
                        if (isUnlocked) {
                          onThemeChange(t.id);
                          showNotice(`${isTr ? t.nameTr : t.nameEn} ${isTr ? 'uygulandı' : 'applied'}`);
                        }
                      }}
                    >
                      <div className="tf-drawer-theme-swatches" style={{ backgroundColor: t.bg }}>
                        <div className="tf-theme-dot" style={{ backgroundColor: t.surface }} />
                        <div className="tf-theme-dot" style={{ backgroundColor: t.accent }} />
                      </div>

                      <div className="tf-drawer-theme-info">
                        <div className="tf-drawer-theme-name">{isTr ? t.nameTr : t.nameEn}</div>
                        {isActive && (
                          <span className="tf-theme-active-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Check size={11} strokeWidth={3} /> {isTr ? 'Aktif' : 'Active'}
                          </span>
                        )}
                        {!isUnlocked && (
                          <button
                            className="tf-theme-unlock-tag"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenShop();
                            }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Lock size={11} /> 120 <Gem size={11} /> {isTr ? 'Aç' : 'Unlock'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              VIEW 3: SOUND & ACOUSTICS SUB-MENU
             ══════════════════════════════════════════════════════════════════════ */}
          {currentView === 'sound' && (
            <div className="tf-submenu-container">
              <div className="tf-submenu-header">
                <h4 className="tf-submenu-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Volume2 size={18} style={{ color: '#38bdf8' }} />
                  <span>{isTr ? 'Ses & Mekanik Akustik' : 'Sound & Acoustics'}</span>
                </h4>
                <p className="tf-submenu-desc">
                  {isTr ? 'Her tuş vuruşunda çalınacak mekanik switch akustiğini belirleyin:' : 'Select mechanical switch audio acoustics:'}
                </p>
              </div>

              {/* Sound Profile Rows */}
              <div className="tf-drawer-sounds-list">
                {SOUNDS_CONFIG.map((s) => {
                  const isSelected = sound === s.id;
                  return (
                    <div
                      key={s.id}
                      className={`tf-drawer-sound-row ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        onSoundChange(s.id);
                        if (s.id !== 'off') handleTestSound(s.id);
                        showNotice(`${isTr ? s.nameTr : s.nameEn} ${isTr ? 'seçildi' : 'selected'}`);
                      }}
                    >
                      <div className="tf-sound-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="tf-sound-icon" style={{ display: 'flex', alignItems: 'center' }}>
                          {getSoundIcon(s.id)}
                        </span>
                        <span className="tf-sound-name">{isTr ? s.nameTr : s.nameEn}</span>
                      </div>

                      <div className="tf-sound-right">
                        {s.id !== 'off' && (
                          <button
                            className="tf-drawer-sound-test"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTestSound(s.id);
                            }}
                            title={isTr ? "Sesi Dinle" : "Audition Sound"}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Volume2 size={12} />
                            <span>{isTr ? 'Dene' : 'Test'}</span>
                          </button>
                        )}
                        {isSelected && <span className="tf-sound-active-bullet">●</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Volume Slider */}
              {sound !== 'off' && (
                <div className="tf-drawer-volume-box" style={{ marginTop: '1.25rem' }}>
                  <div className="tf-volume-header">
                    <span>{isTr ? 'Ses Düzeyi' : 'Volume Level'}</span>
                    <span className="tf-volume-val">{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="tf-drawer-range"
                  />
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              VIEW 4: LANGUAGE SUB-MENU
             ══════════════════════════════════════════════════════════════════════ */}
          {currentView === 'lang' && (
            <div className="tf-submenu-container">
              <div className="tf-submenu-header">
                <h4 className="tf-submenu-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={18} style={{ color: '#10b981' }} />
                  <span>{isTr ? 'Dil Seçimi (Language)' : 'Language Selection'}</span>
                </h4>
                <p className="tf-submenu-desc">
                  {isTr ? 'Arayüz ve menü dilini seçin:' : 'Choose interface and curriculum language:'}
                </p>
              </div>

              <div className="tf-lang-card-list">
                <div
                  className={`tf-lang-card ${lang === 'tr' ? 'active' : ''}`}
                  onClick={() => {
                    onLangChange('tr');
                    showNotice('Türkçe seçildi');
                  }}
                >
                  <span className="tf-lang-card-flag" style={{ fontFamily: 'var(--tf-font-mono)', fontWeight: 800, fontSize: '0.85rem', color: '#10b981' }}>TR</span>
                  <div className="tf-lang-card-info">
                    <span className="tf-lang-card-title">Türkçe</span>
                    <span className="tf-lang-card-sub">Varsayılan dil ve Türkçe içerikler</span>
                  </div>
                  {lang === 'tr' && <span className="tf-lang-check"><Check size={14} strokeWidth={3} /></span>}
                </div>

                <div
                  className={`tf-lang-card ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => {
                    onLangChange('en');
                    showNotice('English selected');
                  }}
                >
                  <span className="tf-lang-card-flag" style={{ fontFamily: 'var(--tf-font-mono)', fontWeight: 800, fontSize: '0.85rem', color: '#38bdf8' }}>EN</span>
                  <div className="tf-lang-card-info">
                    <span className="tf-lang-card-title">English</span>
                    <span className="tf-lang-card-sub">International interface & english words</span>
                  </div>
                  {lang === 'en' && <span className="tf-lang-check"><Check size={14} strokeWidth={3} /></span>}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              VIEW 5: TYPING & CARET SUB-MENU
             ══════════════════════════════════════════════════════════════════════ */}
          {currentView === 'typing' && (
            <div className="tf-submenu-container">
              <div className="tf-submenu-header">
                <h4 className="tf-submenu-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Keyboard size={18} style={{ color: '#a855f7' }} />
                  <span>{isTr ? 'Yazım & Caret Tercihleri' : 'Typing & Caret'}</span>
                </h4>
                <p className="tf-submenu-desc">
                  {isTr ? 'Yazım alanı imleci ve ergonomik kısayolları özelleştirin:' : 'Customize typing caret style and ergonomic shortcuts:'}
                </p>
              </div>

              {/* Caret Style Selector */}
              <div className="tf-drawer-caret-selector">
                <span className="tf-drawer-sublabel">{isTr ? 'İmleç Stili:' : 'Caret Style:'}</span>
                <div className="tf-caret-options">
                  <button
                    className={`tf-caret-btn ${caretStyle === 'line' ? 'active' : ''}`}
                    onClick={() => {
                      setCaretStyle('line');
                      showNotice(isTr ? 'Çizgi imleç seçildi' : 'Line caret selected');
                    }}
                  >
                    | {isTr ? 'Çizgi' : 'Line'}
                  </button>
                  <button
                    className={`tf-caret-btn ${caretStyle === 'block' ? 'active' : ''}`}
                    onClick={() => {
                      setCaretStyle('block');
                      showNotice(isTr ? 'Blok imleç seçildi' : 'Block caret selected');
                    }}
                  >
                    █ {isTr ? 'Blok' : 'Block'}
                  </button>
                  <button
                    className={`tf-caret-btn ${caretStyle === 'underline' ? 'active' : ''}`}
                    onClick={() => {
                      setCaretStyle('underline');
                      showNotice(isTr ? 'Alt çizgi seçildi' : 'Underline selected');
                    }}
                  >
                    _ {isTr ? 'Alt Çizgi' : 'Underline'}
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="tf-drawer-toggles" style={{ marginTop: '1.25rem' }}>
                <label className="tf-drawer-toggle-row">
                  <div className="tf-toggle-info">
                    <span className="tf-toggle-title">{isTr ? 'Hızlı Yeniden Başlat (Tab / Esc)' : 'Quick Restart (Tab / Esc)'}</span>
                    <span className="tf-toggle-desc">{isTr ? 'Tek tuşla testi sıfırla' : 'Instant test restart'}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={quickRestart}
                    onChange={(e) => setQuickRestart(e.target.checked)}
                    className="tf-checkbox-switch"
                  />
                </label>

                <label className="tf-drawer-toggle-row">
                  <div className="tf-toggle-info">
                    <span className="tf-toggle-title">{isTr ? 'Canlı Hata Parıldaması' : 'Typo Mismatch Glow'}</span>
                    <span className="tf-toggle-desc">{isTr ? 'Yanlış harfte kırmızı uyarı' : 'Red ambient glow on mismatch'}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={typoGlow}
                    onChange={(e) => setTypoGlow(e.target.checked)}
                    className="tf-checkbox-switch"
                  />
                </label>

                <label className="tf-drawer-toggle-row">
                  <div className="tf-toggle-info">
                    <span className="tf-toggle-title">{isTr ? 'Caps Lock Uyarısı' : 'Caps Lock Alert'}</span>
                    <span className="tf-toggle-desc">{isTr ? 'Büyük harf kilidi bildirimi' : 'Visual caps lock notification'}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={capsLockAlert}
                    onChange={(e) => setCapsLockAlert(e.target.checked)}
                    className="tf-checkbox-switch"
                  />
                </label>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              VIEW 6: GOALS & LEAGUE SUB-MENU
             ══════════════════════════════════════════════════════════════════════ */}
          {currentView === 'goals' && (
            <div className="tf-submenu-container">
              <div className="tf-submenu-header">
                <h4 className="tf-submenu-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} style={{ color: '#f59e0b' }} />
                  <span>{isTr ? 'Günlük Hedef & Lig' : 'Daily Goals & League'}</span>
                </h4>
                <p className="tf-submenu-desc">
                  {isTr ? 'Serinizi korumak için günlük tamamlamanız gereken pratik sayısı:' : 'Daily tests target to maintain your streak:'}
                </p>
              </div>

              {/* Goal Pills */}
              <div className="tf-drawer-goals-row">
                {[2, 3, 5, 10].map((goal) => (
                  <button
                    key={goal}
                    className={`tf-goal-pill ${(profile.dailyGoal || 3) === goal ? 'active' : ''}`}
                    onClick={() => handleSelectGoal(goal)}
                  >
                    <span>{goal}</span>
                    <span className="tf-goal-unit">{isTr ? 'Test/Gün' : 'Tests/Day'}</span>
                  </button>
                ))}
              </div>

              {/* Current League Status */}
              <div className="tf-drawer-league-box" style={{ marginTop: '1.25rem' }}>
                <span className="tf-league-badge-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  <Trophy size={28} style={{ color: '#f59e0b' }} />
                </span>
                <div>
                  <div className="tf-league-badge-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {profile.league === 'bronze' && (<><Shield size={16} style={{ color: '#cd7f32' }} /> <span>{isTr ? 'Bronz Lig' : 'Bronze League'}</span></>)}
                    {profile.league === 'silver' && (<><ShieldCheck size={16} style={{ color: '#94a3b8' }} /> <span>{isTr ? 'Gümüş Lig' : 'Silver League'}</span></>)}
                    {profile.league === 'gold' && (<><Trophy size={16} style={{ color: '#f59e0b' }} /> <span>{isTr ? 'Altın Lig' : 'Gold League'}</span></>)}
                    {profile.league === 'sapphire' && (<><Gem size={16} style={{ color: '#38bdf8' }} /> <span>{isTr ? 'Safir Lig' : 'Sapphire League'}</span></>)}
                    {profile.league === 'diamond' && (<><Crown size={16} style={{ color: '#a855f7' }} /> <span>{isTr ? 'Elmas Lig' : 'Diamond League'}</span></>)}
                  </div>
                  <div className="tf-league-badge-sub">
                    {isTr ? 'Haftalık sıralama her Pazar gece yarısı yenilenir.' : 'Leaderboard resets weekly on Sunday.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              VIEW 7: ACCOUNT & PROFILE MANAGEMENT SUB-MENU (With Delete Underneath)
             ══════════════════════════════════════════════════════════════════════ */}
          {currentView === 'account' && (
            <div className="tf-submenu-container">
              <div className="tf-submenu-header">
                <h4 className="tf-submenu-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} style={{ color: '#8b5cf6' }} />
                  <span>{isTr ? 'Profil ve Hesap Ayarları' : 'Profile & Account Settings'}</span>
                </h4>
                <p className="tf-submenu-desc">
                  {isTr
                    ? 'Takma adınızı, avatarınızı ve bulut hesabınızı yönetin:'
                    : 'Manage your avatar, nickname, and cloud account credentials:'}
                </p>
              </div>

              {/* Section 1: Profile & Avatar Details */}
              <div className="tf-account-section-card">
                <h5 className="tf-account-card-heading">
                  <User size={16} style={{ color: 'var(--tf-accent)' }} />
                  <span>{isTr ? 'Profil Detayları & Avatar' : 'Profile Details & Avatar'}</span>
                </h5>

                <div className="tf-drawer-avatar-wrap" style={{ marginBottom: '1rem' }}>
                  <button
                    className="tf-drawer-avatar-btn"
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    title={isTr ? "Avatarı Değiştir" : "Change Avatar"}
                  >
                    <span className="tf-drawer-avatar" suppressHydrationWarning>{profile.avatar}</span>
                    <span className="tf-drawer-avatar-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Edit2 size={10} />
                    </span>
                  </button>

                  <div className="tf-drawer-user-meta">
                    {isEditingName ? (
                      <form onSubmit={handleSaveNickname} className="tf-drawer-name-form">
                        <input
                          type="text"
                          className="tf-drawer-name-input"
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          maxLength={18}
                          autoFocus
                        />
                        <button type="submit" className="tf-drawer-name-save-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={12} strokeWidth={3} />
                        </button>
                        <button type="button" className="tf-drawer-name-cancel-btn" onClick={() => setIsEditingName(false)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <X size={12} />
                        </button>
                      </form>
                    ) : (
                      <div className="tf-drawer-name-row">
                        <h4 className="tf-drawer-username" suppressHydrationWarning>{profile.username}</h4>
                        <button
                          className="tf-drawer-edit-name-btn"
                          onClick={() => setIsEditingName(true)}
                          title={isTr ? "Takma adı düzenle" : "Edit nickname"}
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    )}

                    <div className="tf-drawer-badges-row">
                      <span className="tf-drawer-level-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Zap size={11} /> {isTr ? `Seviye ${profile.level}` : `Level ${profile.level}`}
                      </span>
                      <span className="tf-drawer-status-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        {profile.isGuest ? (isTr ? 'Misafir' : 'Guest') : (<><Check size={11} strokeWidth={3} /> Cloud</>)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Avatar Picker dropdown */}
                {showAvatarPicker && (
                  <div className="tf-drawer-avatar-picker" style={{ marginBottom: '1rem' }}>
                    <span className="tf-drawer-picker-label">{isTr ? 'Yeni Avatar Seç:' : 'Select Avatar:'}</span>
                    <div className="tf-drawer-avatar-grid">
                      {AVATAR_OPTIONS.map((av) => (
                        <button
                          key={av}
                          className={`tf-avatar-chip ${profile.avatar === av ? 'active' : ''}`}
                          onClick={() => handleSelectAvatar(av)}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 1.5: Subscription & Free Trial Management */}
              <div className="tf-account-section-card" style={{ border: '1px solid rgba(234, 179, 8, 0.3)', background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.05), rgba(56, 189, 248, 0.04))' }}>
                <h5 className="tf-account-card-heading">
                  <Crown size={16} style={{ color: '#fbbf24' }} />
                  <span>{isTr ? 'Abonelik & Üyelik Planı' : 'Subscription & Membership'}</span>
                </h5>

                <div style={{ marginBottom: '1rem', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--tf-text-secondary)' }}>{isTr ? 'Aktif Plan:' : 'Active Plan:'}</span>
                    <strong style={{ color: profile.isPremium ? '#10b981' : 'var(--tf-text-primary)' }}>
                      {profile.isPremium
                        ? (profile.subscriptionStatus === 'trialing'
                            ? (isTr ? '7 Günlük Ücretsiz Deneme' : '7-Day Free Trial')
                            : 'Super TypeFlow Pro')
                        : (isTr ? 'Ücretsiz Plan (Temel)' : 'Free Tier (Basic)')}
                    </strong>
                  </div>

                  {profile.subscriptionStatus === 'trialing' && profile.trialEndsAt && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--tf-text-secondary)' }}>{isTr ? 'Deneme Bitiş:' : 'Trial Ends:'}</span>
                      <span style={{ fontFamily: 'var(--tf-font-mono)', color: '#fbbf24', fontWeight: 700 }}>
                        {new Date(profile.trialEndsAt).toLocaleDateString(isTr ? 'tr-TR' : 'en-US')}
                      </span>
                    </div>
                  )}

                  {profile.paymentMethodLast4 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--tf-text-secondary)' }}>{isTr ? 'Kayıtlı Kart:' : 'Card:'}</span>
                      <span style={{ fontFamily: 'var(--tf-font-mono)' }}>
                        {profile.paymentMethodBrand?.toUpperCase() || 'KART'} •••• {profile.paymentMethodLast4}
                      </span>
                    </div>
                  )}
                </div>

                {profile.isPremium ? (
                  <div>
                    {!showCancelConfirm ? (
                      <button
                        type="button"
                        className="tf-ctrl-btn tf-btn-pushable"
                        onClick={() => setShowCancelConfirm(true)}
                        style={{ width: '100%', fontSize: '0.78rem', padding: '0.6rem', color: '#f87171' }}
                      >
                        {isTr ? 'Aboneliği / Denemeyi İptal Et' : 'Cancel Subscription / Trial'}
                      </button>
                    ) : (
                      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#fca5a5' }}>
                          {isTr
                            ? 'Aboneliğinizi iptal etmek istediğinize emin misiniz? Sınırsız enerji ve reklamsız deneyim sonlandırılacaktır.'
                            : 'Are you sure you want to cancel? Unlimited energy and zero ads will end.'}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            className="tf-btn-pushable"
                            style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                            onClick={() => {
                              setShowCancelConfirm(false);
                              if (onCancelSubscription) onCancelSubscription();
                            }}
                          >
                            {isTr ? 'Evet, İptal Et' : 'Yes, Cancel'}
                          </button>
                          <button
                            type="button"
                            className="tf-btn-pushable"
                            style={{ flex: 1, background: 'var(--tf-surface)', color: 'var(--tf-text-primary)', border: '1px solid var(--tf-border)', borderRadius: '6px', padding: '0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}
                            onClick={() => setShowCancelConfirm(false)}
                          >
                            {isTr ? 'Vazgeç' : 'Keep Plan'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="tf-btn-primary tf-btn-pushable"
                    onClick={() => onOpenSuperModal?.()}
                    style={{ width: '100%', fontSize: '0.8rem', padding: '0.65rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Crown size={15} />
                    <span>{isTr ? 'Super TypeFlow Pro\'ya Geç' : 'Upgrade to Super TypeFlow'}</span>
                  </button>
                )}
              </div>

              {/* Section 2: Cloud Account & Supabase */}
              <div className="tf-account-section-card">
                <h5 className="tf-account-card-heading">
                  <Cloud size={16} style={{ color: '#38bdf8' }} />
                  <span>{isTr ? 'Bulut Senkronizasyonu (Supabase)' : 'Cloud Account Sync'}</span>
                </h5>

                {profile.isGuest ? (
                  <div className="tf-drawer-auth-box" style={{ textAlign: 'center', padding: '0.75rem 0' }}>
                    <p className="tf-auth-desc" style={{ marginBottom: '1rem', lineHeight: 1.6, fontSize: '0.86rem' }}>
                      {isTr
                        ? 'İlerlemenizi, serinizi ve lig sıralamanızı buluta kaydetmek için giriş yapın veya yeni hesap oluşturun.'
                        : 'Sign in or create an account to preserve your stats, streaks, and league rank across devices.'}
                    </p>

                    <button
                      type="button"
                      className="tf-btn-primary tf-btn-pushable"
                      onClick={() => {
                        onClose();
                        onOpenAuth?.();
                      }}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1.25rem',
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, var(--tf-accent), #3b82f6)',
                        color: '#000',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
                    >
                      <Sparkles size={16} />
                      <span>{isTr ? 'Giriş Yap / Hesap Oluştur' : 'Sign In / Create Account'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="tf-auth-logged-in" style={{ padding: '0.5rem 0' }}>
                    <div className="tf-auth-email-line" style={{ marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '0.65rem 0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Check size={14} style={{ color: '#10b981' }} strokeWidth={3} />
                      <span style={{ color: '#10b981', fontWeight: 800 }}>{isTr ? 'Giriş Yapıldı:' : 'Signed In:'}</span>{' '}
                      <strong>{profile.email || profile.username}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="tf-ctrl-btn tf-btn-pushable"
                        onClick={() => {
                          onClose();
                          onOpenAuth?.();
                        }}
                        style={{ flex: 1, padding: '0.65rem', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Settings size={14} />
                        <span>{isTr ? 'Hesabı Yönet' : 'Manage Account'}</span>
                      </button>
                      <button
                        type="button"
                        className="tf-auth-signout-btn"
                        onClick={async () => {
                          await supabase.auth.signOut();
                          onProfileUpdate({ ...profile, isGuest: true, email: undefined });
                          showNotice(isTr ? 'Çıkış yapıldı' : 'Signed out');
                        }}
                        style={{ padding: '0.65rem 1rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <LogOut size={13} />
                        <span>{isTr ? 'Çıkış Yap' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Account Deletion & Data Wipe (Right Underneath Account Details) */}
              <div className="tf-account-section-card danger">
                <h5 className="tf-account-card-heading danger" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                  <span>{isTr ? 'Hesap Silme & Verileri Sıfırlama' : 'Account Deletion & Data Reset'}</span>
                </h5>

                <p className="tf-danger-desc">
                  {isTr
                    ? 'Bu işlem tüm yerel pratik skorlarını, kazanılan elmasları, seri günlerini ve ayarları bu tarayıcıdan kalıcı olarak siler.'
                    : 'Permanently deletes all cached stats, streaks, gems, and profile settings from this browser.'}
                </p>

                {/* Audit Fix #14: Two-step inline confirmation for account deletion */}
                {!showDeleteConfirm ? (
                  <button
                    className="tf-account-delete-btn"
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Trash2 size={14} />
                    <span>{isTr ? 'Hesabı ve Tüm Verileri Sil' : 'Delete Account & Reset Data'}</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1.5px solid #ef4444',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      textAlign: 'center',
                    }}>
                      <p style={{ color: '#fca5a5', fontSize: '0.82rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <AlertTriangle size={14} />
                        <span>{isTr ? 'Bu işlem GERİ ALINAMAZ!' : 'This action is IRREVERSIBLE!'}</span>
                      </p>
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: 0, fontFamily: 'var(--tf-font-mono)' }}>
                        {isTr
                          ? 'Tüm XP, elmas, seri günleri, ısı haritası ve ayarlar silinecek.'
                          : 'All XP, gems, streaks, heatmap data, and settings will be permanently deleted.'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="tf-account-delete-btn"
                        style={{ flex: 1, background: '#dc2626', fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        onClick={handleResetData}
                      >
                        <Trash2 size={14} />
                        <span>{isTr ? 'EVET, SİL' : 'YES, DELETE'}</span>
                      </button>
                      <button
                        className="tf-account-delete-btn"
                        style={{
                          flex: 1,
                          background: 'var(--tf-surface-elevated)',
                          color: 'var(--tf-text-secondary)',
                          border: '1px solid var(--tf-border)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        <ArrowLeft size={14} />
                        <span>{isTr ? 'Vazgeç' : 'Cancel'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
