/**
 * TYPEFLOW — Duolingo-Style Leagues Component
 * 5-Tier weekly league progression (Bronze -> Silver -> Gold -> Sapphire -> Diamond)
 * with real-time standings, promotion and demotion zones, and weekly reset timer.
 */

'use client';

import React, { useState } from 'react';
import { Locale } from '@/dictionaries';
import { UserProfile, LeagueTier, LeagueMember } from './types';
import { LEAGUE_TIERS, MOCK_LEAGUE_MEMBERS } from './duolingoData';

interface TypeFlowLeaguesProps {
  lang: Locale;
  profile: UserProfile;
  onBackToTest: () => void;
}

export default function TypeFlowLeagues({
  lang,
  profile,
  onBackToTest,
}: TypeFlowLeaguesProps) {
  const isTr = lang === 'tr';

  const [selectedTier, setSelectedTier] = useState<LeagueTier>(profile.league || 'bronze');

  // Build combined league list with the user inserted based on their weekly XP
  const baseMembers = MOCK_LEAGUE_MEMBERS[selectedTier] || [];
  const userInTier: LeagueMember = {
    id: 'current_user',
    username: `${profile.username} (Sen)`,
    avatar: profile.avatar || '⚡',
    weeklyXp: profile.weeklyXp || 120,
    rank: 1,
    isCurrentUser: true,
  };

  const combined = [...baseMembers.filter(m => m.id !== 'current_user'), userInTier]
    .sort((a, b) => b.weeklyXp - a.weeklyXp)
    .map((m, idx) => ({ ...m, rank: idx + 1 }));

  const currentTierInfo = LEAGUE_TIERS.find(t => t.id === selectedTier) || LEAGUE_TIERS[0];

  return (
    <div className="tf-leagues-wrapper">
      {/* 1. League Hero Banner */}
      <div className="tf-leagues-header-card">
        <div style={{ fontSize: '3rem', marginBottom: '0.4rem' }}>{currentTierInfo.icon}</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
          {isTr ? currentTierInfo.nameTr : currentTierInfo.nameEn}
        </h2>
        <p style={{ color: 'var(--tf-text-secondary)', margin: 0, fontSize: '0.9rem' }}>
          {isTr
            ? 'Haftalık en çok XP toplayan ilk 3 kişi bir üst lige terfi eder!'
            : 'Top 3 XP earners this week advance to the next league!'}
        </p>

        {/* Weekly Countdown */}
        <div style={{ marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--tf-surface-elevated)', padding: '0.35rem 0.85rem', borderRadius: '9999px', border: '1px solid var(--tf-border)', fontSize: '0.8rem', fontFamily: 'var(--tf-font-mono)' }}>
          <span>⏳</span>
          <span style={{ color: 'var(--tf-text-secondary)' }}>
            {isTr ? 'Haftanın Bitmesine:' : 'Week Ends In:'}
          </span>
          <strong style={{ color: '#f59e0b' }}>3g 14s 22d</strong>
        </div>

        {/* League Tiers Selector */}
        <div className="tf-tier-tabs">
          {LEAGUE_TIERS.map((tier) => {
            const isUserCurrent = profile.league === tier.id;
            return (
              <button
                key={tier.id}
                className={`tf-tier-pill ${selectedTier === tier.id ? 'active' : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <span>{tier.icon}</span>
                <span>{isTr ? tier.nameTr : tier.nameEn}</span>
                {isUserCurrent && <span style={{ fontSize: '0.7rem', opacity: 0.75 }}> (Senin Ligin)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. League Standings Table */}
      <div className="tf-league-table-card">
        {/* Promotion Zone Tag */}
        <div className="tf-zone-divider promo">
          {isTr ? '🟢 YÜKSELME HATTI (İLK 3 BİR ÜST LİGE GEÇER)' : '🟢 PROMOTION ZONE (TOP 3 ADVANCE)'}
        </div>

        {combined.map((member, idx) => {
          const isPromotion = member.rank <= 3;
          const isDemotion = member.rank >= combined.length - 1 && combined.length > 5;

          return (
            <React.Fragment key={member.id}>
              <div
                className={`tf-league-row ${member.isCurrentUser ? 'is-user' : ''} ${isPromotion ? 'in-promotion' : ''} ${isDemotion ? 'in-demotion' : ''}`}
              >
                {/* Rank / Medal */}
                <div className="tf-league-rank">
                  {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : `#${member.rank}`}
                </div>

                {/* Avatar & User */}
                <div className="tf-league-user">
                  <span style={{ fontSize: '1.25rem' }}>{member.avatar}</span>
                  <span style={{ color: member.isCurrentUser ? 'var(--tf-accent)' : 'inherit' }}>
                    {member.username}
                  </span>
                  {member.isCurrentUser && (
                    <span style={{ background: 'var(--tf-accent)', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      SEN
                    </span>
                  )}
                </div>

                {/* Weekly XP */}
                <div className="tf-league-xp">
                  {member.weeklyXp} XP
                </div>
              </div>

              {/* Demotion Zone Divider before bottom items */}
              {idx === combined.length - 3 && combined.length > 5 && (
                <div className="tf-zone-divider demo">
                  {isTr ? '🔴 DÜŞME HATTI (SON 2 BİR ALT LİGE DÜŞER)' : '🔴 RELEGATION ZONE (BOTTOM 2 DEMOTED)'}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 3. Back to Practice Button */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          className="tf-btn"
          onClick={onBackToTest}
          style={{ background: 'var(--tf-surface-elevated)', border: '1px solid var(--tf-border)' }}
        >
          {isTr ? '⌨️ Pratik Yaparak XP Kazan' : '⌨️ Practice to Earn XP'}
        </button>
      </div>
    </div>
  );
}
