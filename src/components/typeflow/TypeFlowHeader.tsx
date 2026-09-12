/**
 * TYPEFLOW — Duolingo-Grade SaaS Header Component
 * Streamlined top bar featuring Duolingo status pills (Streak 🔥, Gems 💎, Hearts ❤️, Level ⚡),
 * comprehensive 6-tab navigation (Learn Path, Practice, Leagues, Quests, Shop, Profile),
 * and compact theme/sound toggles.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/dictionaries';
import { TypeFlowTheme, SoundType, SaaSTab, UserProfile } from './types';

interface TypeFlowHeaderProps {
  lang: Locale;
  theme: TypeFlowTheme;
  sound: SoundType;
  activeTab: SaaSTab;
  profile: UserProfile;
  onThemeChange?: (theme: TypeFlowTheme) => void;
  onSoundChange?: (sound: SoundType) => void;
  onTabChange: (tab: SaaSTab) => void;
  onOpenAuth?: () => void;
  onOpenSettings?: () => void;
  onOpenProfileDrawer?: () => void;
  onLangChange?: (lang: Locale) => void;
  onOpenSuperModal?: () => void;
  onOpenAdModal?: () => void;
}

export default function TypeFlowHeader({
  lang,
  theme,
  sound,
  activeTab,
  profile,
  onThemeChange,
  onSoundChange,
  onTabChange,
  onOpenAuth,
  onOpenSettings,
  onOpenProfileDrawer,
  onLangChange,
  onOpenSuperModal,
  onOpenAdModal,
}: TypeFlowHeaderProps) {
  const isTr = lang === 'tr';

  const handleOpenDrawer = () => {
    if (onOpenProfileDrawer) {
      onOpenProfileDrawer();
    } else if (onOpenSettings) {
      onOpenSettings();
    } else if (onOpenAuth) {
      onOpenAuth();
    }
  };

  return (
    <header className="tf-header">
      {/* 1. Brand & Return */}
      <div className="tf-brand-group">
        <Link
          href={`/${lang}/projects`}
          className="tf-back-link"
          title={isTr ? "Projeler sayfasına dön" : "Back to projects"}
        >
          <span>←</span>
          <span>{isTr ? 'PROJELER' : 'PROJECTS'}</span>
        </Link>

        <div className="tf-logo-block">
          <h1 className="tf-logo-title">
            TypeFlow<span className="tf-logo-dot">_</span>
          </h1>
        </div>
      </div>

      {/* 2. Compact SaaS Navigation Tabs */}
      <div className="tf-header-tabs">
        <button
          className={`tf-header-tab ${activeTab === 'path' ? 'active' : ''}`}
          onClick={() => onTabChange('path')}
          title={isTr ? "Daktilo Akademisi" : "Learn Path"}
        >
          <span>🗺️</span>
          <span>{isTr ? 'Öğren' : 'Learn'}</span>
        </button>

        <button
          className={`tf-header-tab ${activeTab === 'test' ? 'active' : ''}`}
          onClick={() => onTabChange('test')}
          title={isTr ? "Serbest Yazım Pratiği" : "Free Practice"}
        >
          <span>⌨️</span>
          <span>{isTr ? 'Pratik' : 'Practice'}</span>
        </button>

        <button
          className={`tf-header-tab ${activeTab === 'leagues' ? 'active' : ''}`}
          onClick={() => onTabChange('leagues')}
          title={isTr ? "Haftalık Ligler" : "Weekly Leagues"}
        >
          <span>🏆</span>
          <span>{isTr ? 'Ligler' : 'Leagues'}</span>
        </button>

        <button
          className={`tf-header-tab ${activeTab === 'quests' ? 'active' : ''}`}
          onClick={() => onTabChange('quests')}
          title={isTr ? "Günlük Görevler & Başarımlar" : "Daily Quests & Badges"}
        >
          <span>🎯</span>
          <span>{isTr ? 'Görevler' : 'Quests'}</span>
        </button>

        <button
          className={`tf-header-tab ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => onTabChange('shop')}
          title={isTr ? "Elmas Mağazası" : "Gem Shop"}
        >
          <span>🛍️</span>
          <span>{isTr ? 'Mağaza' : 'Shop'}</span>
        </button>
      </div>

      {/* 3. Compact Status HUD & Profile Drawer Trigger */}
      <div className="tf-header-controls">
        {/* Status Pills: Streak, Gems, Hearts */}
        <div className="tf-duo-status-bar">
          {/* Daily Streak */}
          <div
            className="tf-duo-pill pill-streak"
            title={isTr ? `${profile.streakDays} Günlük Seri` : `${profile.streakDays} Day Streak`}
          >
            <span>🔥</span>
            <span>{profile.streakDays}</span>
          </div>

          {/* Gems */}
          <div
            className="tf-duo-pill pill-gems"
            title={isTr ? `${profile.gems || 0} Elmas` : `${profile.gems || 0} Gems`}
            onClick={() => onTabChange('shop')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTabChange('shop'); } }}
            role="button"
            tabIndex={0}
            aria-label={isTr ? `${profile.gems || 0} Elmas — Mağazaya git` : `${profile.gems || 0} Gems — Go to shop`}
            style={{ cursor: 'pointer' }}
          >
            <span>💎</span>
            <span>{profile.gems || 0}</span>
          </div>

          {/* Focus Battery 🔋 (Replaces Hearts) */}
          <div
            className={`tf-duo-pill pill-energy ${((profile.energy ?? profile.hearts ?? 5) <= 1 && !profile.isPremium) ? 'low' : ''}`}
            title={
              profile.isPremium
                ? (isTr ? 'Sınırsız Odak Enerjisi (Super PRO)' : 'Unlimited Focus Energy (Super PRO)')
                : (isTr ? `${profile.energy ?? profile.hearts ?? 5}/5 Odak Enerjisi` : `${profile.energy ?? profile.hearts ?? 5}/5 Focus Energy`)
            }
            onClick={() => {
              if (profile.isPremium) {
                if (onOpenSuperModal) onOpenSuperModal();
              } else if ((profile.energy ?? profile.hearts ?? 5) <= 1) {
                if (onOpenAdModal) onOpenAdModal();
                else onTabChange('shop');
              } else {
                if (onOpenSuperModal) onOpenSuperModal();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (profile.isPremium) { if (onOpenSuperModal) onOpenSuperModal(); }
                else if ((profile.energy ?? profile.hearts ?? 5) <= 1) { if (onOpenAdModal) onOpenAdModal(); else onTabChange('shop'); }
                else { if (onOpenSuperModal) onOpenSuperModal(); }
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={isTr ? 'Odak Enerjisi' : 'Focus Energy'}
            style={{ cursor: 'pointer' }}
          >
            <span>🔋</span>
            <span>{profile.isPremium ? '♾️' : (profile.energy ?? profile.hearts ?? 5)}</span>
          </div>

          {/* Audit Fix #9: Daily Goal Progress Pill */}
          <div
            className={`tf-daily-goal-pill ${profile.dailyTestsCompleted >= profile.dailyGoal ? 'goal-complete' : ''}`}
            title={
              isTr
                ? `Günlük Hedef: ${profile.dailyTestsCompleted}/${profile.dailyGoal} test`
                : `Daily Goal: ${profile.dailyTestsCompleted}/${profile.dailyGoal} tests`
            }
          >
            <span>🎯</span>
            <span>{profile.dailyTestsCompleted}/{profile.dailyGoal}</span>
            <div className="tf-daily-goal-bar">
              <div
                className="tf-daily-goal-bar-fill"
                style={{ width: `${Math.min(100, (profile.dailyTestsCompleted / Math.max(1, profile.dailyGoal)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Super TypeFlow SaaS Pill / Button */}
          {profile.isPremium ? (
            <div
              className="tf-duo-pill pill-super"
              onClick={onOpenSuperModal}
              title={isTr ? "Super TypeFlow Üyeliği Aktif" : "Super TypeFlow Active"}
            >
              <span>👑</span>
              <span>SUPER</span>
            </div>
          ) : (
            <button
              type="button"
              className="tf-super-header-btn tf-btn-pushable"
              onClick={onOpenSuperModal}
              title={isTr ? "Super TypeFlow'a Yükselt (Reklamsız & Sınırsız)" : "Upgrade to Super TypeFlow"}
            >
              <span>👑</span>
              <span>SUPER</span>
            </button>
          )}
        </div>

        {/* Compact Profile & Settings Drawer Trigger Button */}
        <button
          className="tf-profile-trigger-btn tf-btn-pushable"
          onClick={handleOpenDrawer}
          title={isTr ? `${profile.username} — Profil & Ayarlar` : `${profile.username} — Profile & Settings`}
          aria-label="Open profile and settings drawer"
        >
          <span className="tf-user-avatar" suppressHydrationWarning>{profile.avatar}</span>
          <span className="tf-user-level-badge" suppressHydrationWarning>⚡ L{profile.level}</span>
          <span className="tf-drawer-burger-icon">⚙️</span>
        </button>
      </div>
    </header>
  );
}
