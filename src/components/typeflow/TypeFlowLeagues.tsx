/**
 * TYPEFLOW — Real User Weekly Leagues Component
 * 5-Tier weekly league progression (Bronze -> Silver -> Gold -> Sapphire -> Diamond)
 * with real community typists, real user placement, live Sunday reset countdown,
 * and zero simulated bot accounts.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/dictionaries';
import { UserProfile, LeagueTier, LeagueMember } from './types';
import { LEAGUE_TIERS } from './duolingoData';
import { supabase } from '@/lib/supabase';

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
  const userTier: LeagueTier = profile.league || 'bronze';

  const [selectedTier, setSelectedTier] = useState<LeagueTier>(userTier);
  const [communityMembers, setCommunityMembers] = useState<Record<LeagueTier, LeagueMember[]>>({
    bronze: [],
    silver: [],
    gold: [],
    sapphire: [],
    diamond: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ─── 1. Live Countdown to Sunday 23:59:59 UTC ─────────────────────────────
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      // Calculate remaining time until coming Sunday 23:59:59 UTC
      const currentDay = now.getUTCDay(); // 0 is Sunday, 1 is Monday...
      const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay;

      const target = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + daysUntilSunday,
        23, 59, 59, 999
      ));

      const diff = Math.max(0, target.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // ─── 2. Fetch Real Community Members from Supabase & Local Sessions ────────
  useEffect(() => {
    async function loadRealLeagueMembers() {
      setIsLoading(true);
      console.debug('[TypeFlow:Leagues] Loading real league contenders');

      const realMap: Record<LeagueTier, LeagueMember[]> = {
        bronze: [],
        silver: [],
        gold: [],
        sapphire: [],
        diamond: [],
      };

      try {
        // 1. Fetch real scores from Supabase
        const { data, error } = await supabase
          .from('typeflow_scores')
          .select('username, avatar, wpm, accuracy, created_at')
          .order('created_at', { ascending: false })
          .limit(100);

        if (!error && data && data.length > 0) {
          // Aggregate real user activity
          const userStats: Record<string, { username: string; avatar: string; weeklyXp: number }> = {};

          data.forEach((row: any) => {
            const uname = row.username || 'Anonim';
            // Skip current user's entry in remote pool (we insert the current user dynamically)
            if (uname === profile.username) return;

            if (!userStats[uname]) {
              userStats[uname] = {
                username: uname,
                avatar: row.avatar || '⚡',
                weeklyXp: 0,
              };
            }
            // Estimate weekly XP from actual test runs
            const wpm = Number(row.wpm) || 30;
            const acc = Number(row.accuracy) || 90;
            userStats[uname].weeklyXp += Math.round(wpm * 1.5 + (acc >= 95 ? 40 : 20));
          });

          // Allocate real contenders to tiers based on their real weekly XP
          Object.values(userStats).forEach((u, i) => {
            let tier: LeagueTier = 'bronze';
            if (u.weeklyXp >= 2000) tier = 'diamond';
            else if (u.weeklyXp >= 1200) tier = 'sapphire';
            else if (u.weeklyXp >= 600) tier = 'gold';
            else if (u.weeklyXp >= 250) tier = 'silver';

            realMap[tier].push({
              id: `real_${tier}_${i}`,
              username: u.username,
              avatar: u.avatar,
              weeklyXp: u.weeklyXp,
              rank: 1,
            });
          });
        }
      } catch (err) {
        console.debug('[TypeFlow:Leagues] Supabase query notice (proceeding with local store):', err);
      }

      // 2. Also check real local community sessions from localStorage
      try {
        const localCommunityStr = localStorage.getItem('tf_community_league_members');
        if (localCommunityStr) {
          const parsed = JSON.parse(localCommunityStr);
          if (Array.isArray(parsed)) {
            parsed.forEach((m: LeagueMember) => {
              if (m.username !== profile.username && !realMap.bronze.some(b => b.username === m.username)) {
                realMap.bronze.push(m);
              }
            });
          }
        }
      } catch {}

      setCommunityMembers(realMap);
      setIsLoading(false);
    }

    loadRealLeagueMembers();
  }, [profile.username]);

  // ─── 3. Construct Standings for Selected Tier ─────────────────────────────
  // IMPORTANT: The current user is ONLY inserted into their ACTUAL league tier (userTier)
  const isViewingUserTier = selectedTier === userTier;
  const otherContendersInTier = (communityMembers[selectedTier] || []).filter(
    (m) => m.username !== profile.username
  );

  let displayedMembers: LeagueMember[] = [];

  if (isViewingUserTier) {
    // Current user belongs to this tier: insert them with their REAL weekly XP
    const currentUserEntry: LeagueMember = {
      id: 'current_user_me',
      username: profile.username,
      avatar: profile.avatar || '⚡',
      weeklyXp: profile.weeklyXp || 0,
      rank: 1,
      isCurrentUser: true,
    };

    displayedMembers = [...otherContendersInTier, currentUserEntry]
      .sort((a, b) => b.weeklyXp - a.weeklyXp)
      .map((m, idx) => ({ ...m, rank: idx + 1 }));
  } else {
    // Other tier: show ONLY participants who actually belong to that tier (NO current user)
    displayedMembers = [...otherContendersInTier]
      .sort((a, b) => b.weeklyXp - a.weeklyXp)
      .map((m, idx) => ({ ...m, rank: idx + 1 }));
  }

  const currentTierInfo = LEAGUE_TIERS.find((t) => t.id === selectedTier) || LEAGUE_TIERS[0];
  const userTierInfo = LEAGUE_TIERS.find((t) => t.id === userTier) || LEAGUE_TIERS[0];
  const userRankInActiveTier = displayedMembers.find((m) => m.isCurrentUser)?.rank || 1;

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
            ? 'Haftalık en çok XP toplayan ilk 3 daktilocu bir üst lige terfi eder!'
            : 'Top 3 XP earners this week advance to the next league!'}
        </p>

        {/* Live Weekly Countdown */}
        <div
          style={{
            marginTop: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--tf-surface-elevated)',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            border: '1px solid var(--tf-border)',
            fontSize: '0.8rem',
            fontFamily: 'var(--tf-font-mono)',
          }}
        >
          <span>⏳</span>
          <span style={{ color: 'var(--tf-text-secondary)' }}>
            {isTr ? 'Haftalık Lig Bitişine:' : 'League Resets In:'}
          </span>
          <strong style={{ color: '#f59e0b' }}>
            {countdown.days}{isTr ? 'g ' : 'd '}
            {countdown.hours}{isTr ? 'sa ' : 'h '}
            {countdown.minutes}{isTr ? 'dk ' : 'm '}
            {countdown.seconds}{isTr ? 'sn' : 's'}
          </strong>
        </div>

        {/* League Tiers Selector */}
        <div className="tf-tier-tabs">
          {LEAGUE_TIERS.map((tier) => {
            const isUserCurrent = userTier === tier.id;
            return (
              <button
                key={tier.id}
                className={`tf-tier-pill ${selectedTier === tier.id ? 'active' : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                <span>{tier.icon}</span>
                <span>{isTr ? tier.nameTr : tier.nameEn}</span>
                {isUserCurrent && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      marginLeft: '4px',
                    }}
                  >
                    {isTr ? 'SEN' : 'YOU'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active User Status Context Card (Shown if viewing current tier) */}
      {isViewingUserTier ? (
        <div
          style={{
            background: 'var(--tf-surface)',
            border: '1px solid var(--tf-border)',
            borderRadius: '14px',
            padding: '1rem 1.4rem',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.8rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--tf-text-muted)', fontFamily: 'var(--tf-font-mono)' }}>
              {isTr ? 'SENİN MEVCUT LİG DURUMUN' : 'YOUR CURRENT LEAGUE STATUS'}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.2rem' }}>
              {userRankInActiveTier <= 3 && (profile.weeklyXp || 0) > 0 ? (
                <span style={{ color: '#10b981' }}>
                  🟢 {isTr ? `Sıran: #${userRankInActiveTier} (Terfi Hattındasın!)` : `Rank: #${userRankInActiveTier} (Promotion Zone!)`}
                </span>
              ) : (profile.weeklyXp || 0) === 0 ? (
                <span style={{ color: '#f59e0b' }}>
                  ⚠️ {isTr ? 'Bu hafta henüz XP kazanmadın' : 'No XP earned yet this week'}
                </span>
              ) : (
                <span style={{ color: 'var(--tf-text-secondary)' }}>
                  ⚪ {isTr ? `Sıran: #${userRankInActiveTier} (Güvenli Bölge)` : `Rank: #${userRankInActiveTier} (Safe Zone)`}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--tf-text-muted)' }}>
                {isTr ? 'Haftalık XP' : 'Weekly XP'}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--tf-font-mono)' }}>
                {profile.weeklyXp || 0} XP
              </div>
            </div>
            <button
              className="tf-btn tf-btn-pushable"
              onClick={onBackToTest}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                fontSize: '0.85rem',
                padding: '0.5rem 1rem',
                border: 'none',
              }}
            >
              ⚡ {isTr ? 'XP Topla' : 'Earn XP'}
            </button>
          </div>
        </div>
      ) : (
        /* Explanatory banner when inspecting other tiers */
        <div
          style={{
            background: 'var(--tf-surface)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '14px',
            padding: '1rem 1.4rem',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '2rem' }}>{currentTierInfo.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              {isTr ? `${currentTierInfo.nameTr} Önizlemesi` : `${currentTierInfo.nameEn} Preview`}
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--tf-text-secondary)', lineHeight: 1.4 }}>
              {isTr
                ? `Sen şu anda ${userTierInfo.nameTr} ligindesin. Bu ligde yer almak için mevcut ligini hafta sonunda ilk 3 sırada bitirerek terfi etmelisin.`
                : `You are currently in ${userTierInfo.nameEn}. To enter this tier, finish in the top 3 of your current league at the end of the week.`}
            </p>
          </div>
          <button
            className="tf-btn"
            onClick={() => setSelectedTier(userTier)}
            style={{
              background: 'var(--tf-surface-elevated)',
              border: '1px solid var(--tf-border)',
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
            }}
          >
            {isTr ? 'Ligime Dön' : 'My League'}
          </button>
        </div>
      )}

      {/* 3. League Standings Table */}
      <div className="tf-league-table-card">
        {/* Promotion Zone Tag */}
        <div className="tf-zone-divider promo">
          {isTr ? '🟢 YÜKSELME HATTI (İLK 3 BİR ÜST LİGE GEÇER)' : '🟢 PROMOTION ZONE (TOP 3 ADVANCE)'}
        </div>

        {isLoading ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--tf-text-muted)' }}>
            ⏳ {isTr ? 'Gerçek lig katılımcıları yükleniyor...' : 'Loading real league participants...'}
          </div>
        ) : displayedMembers.length === 0 ? (
          /* Honest empty state when no real players have populated this tier */
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>🏆</div>
            <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', fontWeight: 700 }}>
              {isTr ? 'Bu Ligde Henüz Katılımcı Yok' : 'No Contenders in This League Yet'}
            </h4>
            <p style={{ margin: '0 auto 1.2rem auto', maxWidth: '400px', fontSize: '0.85rem', color: 'var(--tf-text-secondary)', lineHeight: 1.5 }}>
              {isTr
                ? `${currentTierInfo.nameTr} ligine bu hafta henüz kimse ulaşamadı. Pratik yaparak puanını artır ve bu lige yükselen ilk daktilocu ol!`
                : `No typists have reached ${currentTierInfo.nameEn} yet this week. Practice to climb and become the first to claim this tier!`}
            </p>
            <button
              className="tf-btn tf-btn-pushable"
              onClick={onBackToTest}
              style={{ background: 'var(--tf-accent)', color: '#000', fontWeight: 800 }}
            >
              {isTr ? 'Hemen Başla ve Lider Ol' : 'Start Typing to Take #1'}
            </button>
          </div>
        ) : (
          displayedMembers.map((member, idx) => {
            const isPromotion = member.rank <= 3;
            const isDemotion = member.rank >= displayedMembers.length - 1 && displayedMembers.length > 5;

            return (
              <React.Fragment key={member.id}>
                <div
                  className={`tf-league-row ${member.isCurrentUser ? 'is-user' : ''} ${isPromotion ? 'in-promotion' : ''} ${isDemotion ? 'in-demotion' : ''}`}
                  style={
                    member.isCurrentUser
                      ? {
                          background: 'rgba(245, 158, 11, 0.12)',
                          border: '1px solid rgba(245, 158, 11, 0.5)',
                        }
                      : undefined
                  }
                >
                  {/* Rank / Medal */}
                  <div className="tf-league-rank">
                    {member.rank === 1 ? '🥇' : member.rank === 2 ? '🥈' : member.rank === 3 ? '🥉' : `#${member.rank}`}
                  </div>

                  {/* Avatar & User */}
                  <div className="tf-league-user">
                    <span style={{ fontSize: '1.25rem' }}>{member.avatar}</span>
                    <span
                      style={{
                        fontWeight: member.isCurrentUser ? 800 : 500,
                        color: member.isCurrentUser ? '#f59e0b' : 'inherit',
                      }}
                    >
                      {member.username}
                    </span>
                    {member.isCurrentUser && (
                      <span
                        style={{
                          background: '#f59e0b',
                          color: '#000',
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          padding: '0.1rem 0.45rem',
                          borderRadius: '4px',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {isTr ? 'SEN' : 'YOU'}
                      </span>
                    )}
                  </div>

                  {/* Weekly XP */}
                  <div
                    className="tf-league-xp"
                    style={{
                      fontFamily: 'var(--tf-font-mono)',
                      fontWeight: member.isCurrentUser ? 800 : 600,
                      color: member.weeklyXp > 0 ? (member.isCurrentUser ? '#f59e0b' : 'inherit') : 'var(--tf-text-muted)',
                    }}
                  >
                    {member.weeklyXp} XP
                  </div>
                </div>

                {/* Demotion Zone Divider before bottom items if cohort has over 5 members */}
                {idx === displayedMembers.length - 3 && displayedMembers.length > 5 && (
                  <div className="tf-zone-divider demo">
                    {isTr ? '🔴 DÜŞME HATTI (SON 2 BİR ALT LİGE DÜŞER)' : '🔴 RELEGATION ZONE (BOTTOM 2 DEMOTED)'}
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* 4. Real User Actions */}
      <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="tf-btn tf-btn-pushable"
          onClick={onBackToTest}
          style={{ background: 'var(--tf-surface-elevated)', border: '1px solid var(--tf-border)' }}
        >
          {isTr ? '⌨️ Pratik Yaparak XP Topla' : '⌨️ Practice to Earn XP'}
        </button>
      </div>
    </div>
  );
}
