/**
 * TYPEFLOW — Duolingo-Grade Daily Quests & Achievements Component
 * Cleanly organized into 3 distinct zones:
 * 1. Daily Quests (Resets at midnight, progressive bars)
 * 2. Weekly Challenges (Longer horizon grind)
 * 3. Achievement Badges Showroom (Permanent trophies)
 */

'use client';

import React from 'react';
import { Locale } from '@/dictionaries';
import { UserProfile } from './types';
import { getDailyQuests, getAchievementsList } from './duolingoData';
import { TypeFlowGoogleAd } from './TypeFlowGoogleAd';

interface TypeFlowQuestsProps {
  lang: Locale;
  profile: UserProfile;
  onClaimQuest: (questId: string, xpReward: number, gemReward: number) => void;
  onOpenSuperModal?: () => void;
}

export default function TypeFlowQuests({
  lang,
  profile,
  onClaimQuest,
  onOpenSuperModal,
}: TypeFlowQuestsProps) {
  const isTr = lang === 'tr';

  const dailyQuests = getDailyQuests(
    lang,
    profile.dailyTestsCompleted * 15,
    profile.dailyTestsCompleted,
    Object.keys(profile.completedLessons || {}).length
  );

  const completedCount = dailyQuests.filter((q) => q.isCompleted || profile.claimedQuests?.includes(q.id)).length;

  const achievements = getAchievementsList(lang).map((ach) => {
    let current = 0;
    let isUnlocked = profile.unlockedAchievements?.includes(ach.id) || false;

    if (ach.id === 'first-step') {
      current = profile.totalTests > 0 ? 1 : 0;
      if (current >= 1) isUnlocked = true;
    } else if (ach.id === 'sniper-acc') {
      current = Math.min(profile.totalTests, 5);
      if (profile.totalTests >= 5 && profile.avgWpm >= 30) isUnlocked = true;
    } else if (ach.id === 'speed-demon') {
      current = profile.topWpm;
      if (current >= 60) isUnlocked = true;
    } else if (ach.id === 'speed-master') {
      current = profile.topWpm;
      if (current >= 80) isUnlocked = true;
    } else if (ach.id === 'light-speed') {
      current = profile.topWpm;
      if (current >= 100) isUnlocked = true;
    } else if (ach.id === 'hypersonic') {
      current = profile.topWpm;
      if (current >= 120) isUnlocked = true;
    } else if (ach.id === 'fire-keeper') {
      current = profile.streakDays;
      if (current >= 7) isUnlocked = true;
    } else if (ach.id === 'unbreakable-streak') {
      current = profile.streakDays;
      if (current >= 30) isUnlocked = true;
    } else if (ach.id === 'century-club') {
      current = profile.totalTests;
      if (current >= 50) isUnlocked = true;
    } else if (ach.id === 'typing-titan') {
      current = profile.totalTests;
      if (current >= 200) isUnlocked = true;
    } else if (ach.id === 'code-ninja') {
      current = Math.min(profile.totalTests, 15);
      if (current >= 15) isUnlocked = true;
    } else if (ach.id === 'gem-hoarder') {
      current = profile.gems || 0;
      if (current >= 100) isUnlocked = true;
    }

    return { ...ach, current, isUnlocked };
  });

  return (
    <div className="tf-quests-wrapper">
      {/* 1. Header Hero Summary Card */}
      <div style={{
        background: 'var(--tf-surface)',
        border: '1px solid var(--tf-border)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span className="tf-badge" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>
            🎯 {isTr ? 'GÖREV & BAŞARIM MERKEZİ' : 'QUEST & BADGE CENTER'}
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
            {isTr ? 'Günlük Hedeflerini Tamamla' : 'Conquer Your Daily Goals'}
          </h2>
          <p style={{ color: 'var(--tf-text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            {isTr
              ? 'Her gün yeni görevleri tamamla, ligde avantaj kazan ve kalıcı başarım rozetlerini topla.'
              : 'Complete refreshed daily tasks, claim rewards to climb leagues, and unlock trophies.'}
          </p>
        </div>

        {/* Progress Circle Badge */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid #10b981',
          padding: '0.75rem 1.5rem',
          borderRadius: '14px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, fontFamily: 'var(--tf-font-mono)' }}>
            {isTr ? 'GÜNLÜK İLERLEME' : 'DAILY PROGRESS'}
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981' }}>
            {completedCount} / {dailyQuests.length}
          </div>
        </div>
      </div>

      {/* 2. DAILY QUESTS SECTION */}
      <div className="tf-section-heading" style={{ marginBottom: '1rem' }}>
        <span>🎯</span>
        <span>{isTr ? 'Günün Görevleri' : 'Daily Quests'}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--tf-text-muted)', marginLeft: 'auto', fontFamily: 'var(--tf-font-mono)' }}>
          {isTr ? 'Her gece 00:00\'da yenilenir' : 'Resets daily at 00:00'}
        </span>
      </div>

      <div className="tf-quests-list" style={{ marginBottom: '2.5rem' }}>
        {dailyQuests.map((quest) => {
          const isClaimed = profile.claimedQuests?.includes(quest.id) || false;
          const percent = Math.min(Math.round((quest.current / quest.target) * 100), 100);

          return (
            <div key={quest.id} className="tf-quest-item" style={{ borderRadius: '12px' }}>
              <div className="tf-quest-icon" style={{ fontSize: '2rem' }}>{quest.icon}</div>
              <div className="tf-quest-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div className="tf-quest-title" style={{ fontSize: '1rem', fontWeight: 700 }}>
                    {quest.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'var(--tf-font-mono)', color: 'var(--tf-text-muted)' }}>
                    {quest.current} / {quest.target}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="tf-quest-bar-bg" style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' }}>
                  <div className="tf-quest-bar-fill" style={{ width: `${percent}%`, borderRadius: '999px' }} />
                </div>

                {/* Rewards preview */}
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.45rem', fontSize: '0.75rem', fontFamily: 'var(--tf-font-mono)' }}>
                  <span style={{ color: '#a855f7' }}>+{quest.xpReward} XP</span>
                  <span style={{ color: '#38bdf8' }}>+{quest.gemReward} 💎</span>
                </div>
              </div>

              {/* Claim Action */}
              {isClaimed ? (
                <button className="tf-quest-claim-btn claimed" disabled style={{ minWidth: '100px' }}>
                  {isTr ? 'Alındı ✓' : 'Claimed ✓'}
                </button>
              ) : (
                <button
                  className="tf-quest-claim-btn tf-btn-pushable"
                  onClick={() => onClaimQuest(quest.id, quest.xpReward, quest.gemReward)}
                  disabled={!quest.isCompleted}
                  style={{
                    minWidth: '100px',
                    opacity: quest.isCompleted ? 1 : 0.45,
                    cursor: quest.isCompleted ? 'pointer' : 'not-allowed',
                    background: quest.isCompleted ? 'linear-gradient(135deg, #10b981, #059669)' : undefined,
                    color: quest.isCompleted ? '#fff' : undefined,
                  }}
                >
                  {isTr ? 'Ödülü Al 🎁' : 'Claim 🎁'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. PERMANENT ACHIEVEMENTS SHOWROOM */}
      <div className="tf-section-heading" style={{ marginBottom: '1rem' }}>
        <span>🏅</span>
        <span>{isTr ? 'Başarımlar ve Rozet Vitrini' : 'Permanent Achievements & Badges'}</span>
      </div>

      <div className="tf-achievements-grid" style={{ marginBottom: '2.5rem' }}>
        {achievements.map((ach) => {
          return (
            <div
              key={ach.id}
              className={`tf-achievement-card ${ach.isUnlocked ? 'unlocked' : ''}`}
              style={{
                opacity: ach.isUnlocked ? 1 : 0.65,
                background: ach.isUnlocked ? 'rgba(245, 158, 11, 0.05)' : 'var(--tf-surface)',
                border: ach.isUnlocked ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--tf-border)',
                borderRadius: '14px',
                padding: '1.25rem',
              }}
            >
              <div className="tf-achievement-badge" style={{ fontSize: '2rem' }}>
                {ach.isUnlocked ? ach.icon : '🔒'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: ach.isUnlocked ? '#f59e0b' : 'var(--tf-text-primary)' }}>
                    {ach.title}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--tf-font-mono)',
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}>
                    +{ach.rewardGems} 💎
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--tf-text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                  {ach.description}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.72rem', color: ach.isUnlocked ? '#10b981' : 'var(--tf-text-muted)', fontFamily: 'var(--tf-font-mono)', fontWeight: 700 }}>
                    {ach.isUnlocked ? (isTr ? '✓ KİLİT AÇILDI' : '✓ UNLOCKED') : (isTr ? 'KİLİTLİ' : 'LOCKED')}
                  </div>
                  {!ach.isUnlocked && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--tf-text-muted)', fontFamily: 'var(--tf-font-mono)' }}>
                      {ach.current} / {ach.target}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Persistent Google AdSense Banner */}
      <TypeFlowGoogleAd
        lang={lang}
        profile={profile}
        onOpenSuperModal={onOpenSuperModal}
      />
    </div>
  );
}
