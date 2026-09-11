/**
 * TYPEFLOW — User Profile & SaaS Dashboard View
 * Displays user level, XP progress, daily streaks, goals, lifetime statistics, and lifetime keyboard heatmap.
 */

'use client';

import React from 'react';
import { Locale } from '@/dictionaries';
import { UserProfile } from './types';
import KeyboardHeatmap from './KeyboardHeatmap';

interface TypeFlowProfileViewProps {
  lang: Locale;
  profile: UserProfile;
  onOpenAuth: () => void;
  onBackToTest: () => void;
}

export default function TypeFlowProfileView({
  lang,
  profile,
  onOpenAuth,
  onBackToTest,
}: TypeFlowProfileViewProps) {
  const isTr = lang === 'tr';

  // Calculate level progress (each level is 200 XP)
  const xpNeeded = profile.level * 200;
  const currentLevelXp = profile.xp % xpNeeded;
  const progressPercent = Math.min(Math.round((currentLevelXp / xpNeeded) * 100), 100);

  // Level title rank
  const getLevelTitle = (lvl: number) => {
    if (lvl >= 20) return isTr ? 'Siber Efsane' : 'Cyber Legend';
    if (lvl >= 10) return isTr ? 'Hızlı Kodcu' : 'Fast Coder';
    if (lvl >= 5) return isTr ? 'Hız Ustası' : 'Velocity Master';
    if (lvl >= 2) return isTr ? 'İleri Seviye' : 'Adept';
    return isTr ? 'Çırak Yazıcı' : 'Novice Typist';
  };

  return (
    <div className="tf-profile-dashboard">
      {/* 1. Header Card */}
      <div className="tf-profile-hero-card">
        <div className="tf-profile-main-info">
          <div className="tf-profile-avatar-large">
            <span>{profile.avatar}</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 className="tf-profile-username">{profile.username}</h2>
              <span className="tf-level-badge">LVL {profile.level}</span>
            </div>
            <p className="tf-profile-title">{getLevelTitle(profile.level)}</p>

            {/* XP Progress Bar */}
            <div className="tf-xp-bar-wrapper">
              <div className="tf-xp-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="tf-xp-text">
              {currentLevelXp} / {xpNeeded} XP (%{progressPercent})
            </span>
          </div>
        </div>

        <div className="tf-profile-hero-actions">
          <button className="tf-btn-secondary" onClick={onOpenAuth}>
            ⚙ {profile.isGuest ? (isTr ? 'Giriş Yap / Kaydet' : 'Sign In / Save') : (isTr ? 'Profili Düzenle' : 'Edit Profile')}
          </button>
          <button className="tf-btn-primary" onClick={onBackToTest}>
            ⌨ {isTr ? 'Yazma Testi' : 'Practice Test'}
          </button>
        </div>
      </div>

      {/* 2. SaaS Streak & Goal Row */}
      <div className="tf-saas-banner-row">
        {/* Daily Streak Card */}
        <div className="tf-streak-card">
          <div className="tf-streak-icon-box">🔥</div>
          <div>
            <span className="tf-streak-number">{profile.streakDays} {isTr ? 'GÜN' : 'DAYS'}</span>
            <p className="tf-streak-lbl">
              {isTr ? 'GÜNLÜK SERİ KORUNUYOR' : 'DAILY STREAK ACTIVE'}
            </p>
          </div>
        </div>

        {/* Daily Goal Card */}
        <div className="tf-goal-card">
          <div className="tf-goal-icon-box">🎯</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="tf-goal-title">{isTr ? 'Bugünkü Hedef' : 'Daily Goal'}</span>
              <span className="tf-goal-status">
                {profile.dailyTestsCompleted} / {profile.dailyGoal} {isTr ? 'Test' : 'Tests'}
              </span>
            </div>
            <div className="tf-goal-bar-wrapper">
              <div
                className="tf-goal-bar-fill"
                style={{
                  width: `${Math.min(Math.round((profile.dailyTestsCompleted / profile.dailyGoal) * 100), 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 Duolingo Economy & League Badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', marginTop: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'var(--tf-surface-elevated)', border: '1px solid var(--tf-border)', borderRadius: '12px', padding: '0.85rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1.4rem' }}>💎</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{profile.gems || 0}</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--tf-text-secondary)', fontFamily: 'var(--tf-font-mono)' }}>{isTr ? 'ELMASLAR' : 'GEMS'}</span>
        </div>
        <div style={{ background: 'var(--tf-surface-elevated)', border: '1px solid var(--tf-border)', borderRadius: '12px', padding: '0.85rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1.4rem' }}>❤️</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444' }}>{profile.hearts ?? 5}/5</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--tf-text-secondary)', fontFamily: 'var(--tf-font-mono)' }}>{isTr ? 'CANLAR' : 'HEARTS'}</span>
        </div>
        <div style={{ background: 'var(--tf-surface-elevated)', border: '1px solid var(--tf-border)', borderRadius: '12px', padding: '0.85rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1.4rem' }}>🏆</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', textTransform: 'capitalize' }}>{profile.league || 'Bronz'}</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--tf-text-secondary)', fontFamily: 'var(--tf-font-mono)' }}>{isTr ? 'MEVCUT LİG' : 'LEAGUE'}</span>
        </div>
        <div style={{ background: 'var(--tf-surface-elevated)', border: '1px solid var(--tf-border)', borderRadius: '12px', padding: '0.85rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1.4rem' }}>🧊</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#06b6d4' }}>{profile.streakFreezes || 0}</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--tf-text-secondary)', fontFamily: 'var(--tf-font-mono)' }}>{isTr ? 'DONDURUCU' : 'FREEZES'}</span>
        </div>
      </div>

      {/* 3. Overall Stats Grid */}
      <div className="tf-stat-grid" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
        <div className="tf-hud-metric">
          <span className="tf-hud-val">{profile.totalTests}</span>
          <span className="tf-hud-lbl">{isTr ? 'Toplam Tamamlanan Test' : 'Total Tests Completed'}</span>
        </div>

        <div className="tf-hud-metric">
          <span className="tf-hud-val" style={{ color: 'var(--tf-accent)' }}>
            {profile.topWpm} WPM
          </span>
          <span className="tf-hud-lbl">{isTr ? 'Zirve Hız (Personal Best)' : 'All-time Top Speed'}</span>
        </div>

        <div className="tf-hud-metric">
          <span className="tf-hud-val">{profile.avgWpm} WPM</span>
          <span className="tf-hud-lbl">{isTr ? 'Ortalama Hız' : 'Average Speed'}</span>
        </div>

        <div className="tf-hud-metric">
          <span className="tf-hud-val" style={{ color: '#22c55e' }}>
            {Object.keys(profile.keyStats).length}
          </span>
          <span className="tf-hud-lbl">{isTr ? 'Aktif Tuş Sayısı' : 'Discovered Keys'}</span>
        </div>
      </div>

      {/* 4. Lifetime Keyboard Heatmap */}
      <div style={{ marginTop: '2rem' }}>
        <KeyboardHeatmap lang={lang} keyStats={profile.keyStats} />
      </div>
    </div>
  );
}
