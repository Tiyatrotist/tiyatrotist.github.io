/**
 * TYPEFLOW — Dedicated Training Dojo & Currency Grind Hub
 * A high-intensity practice arena where users grind extra XP, Gems (💎),
 * Focus Energy (🔋), and League Points (🏆) through targeted typing challenges.
 * Features strict daily attempt limits per activity (Resets daily at 00:00).
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/dictionaries';
import { UserProfile, TypeFlowMode } from './types';
import { PRACTICE_TOPICS, generateTopicPracticeWords } from './TopicPracticeGenerator';

export interface PracticeDrillConfig {
  mode: TypeFlowMode;
  drillId: 'speed_burst' | 'endurance' | 'sniper' | 'thematic' | 'energy_refill';
  title: string;
  xpReward: number;
  gemReward: number;
  leagueReward: number;
  energyReward?: number;
  minAccuracy?: number;
  timeLimit?: number;
  wordCount?: number;
  topicId?: string;
  caseSensitive?: boolean;
  includePunctuation?: boolean;
  generatedWords?: string[];
}

export const DRILL_LIMITS: Record<string, number> = {
  speed_burst: 3,
  endurance: 2,
  sniper: 2,
  thematic: 3,
  energy_refill: 2,
};

interface TypeFlowPracticeHubProps {
  lang: Locale;
  profile: UserProfile;
  onLaunchDrill: (config: PracticeDrillConfig) => void;
  onOpenAdModal?: () => void;
  onOpenSuperModal?: () => void;
}

export const TypeFlowPracticeHub: React.FC<TypeFlowPracticeHubProps> = ({
  lang,
  profile,
  onLaunchDrill,
  onOpenAdModal,
  onOpenSuperModal,
}) => {
  const isTr = lang === 'tr';

  // Topic selection for thematic drill
  const [selectedTopicId, setSelectedTopicId] = useState<string>('random');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);

  // Daily attempts state (persisted per date)
  const [attempts, setAttempts] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const raw = localStorage.getItem('tf_drill_attempts');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.date === today && parsed.counts) {
          setAttempts(parsed.counts);
          return;
        }
      }
      setAttempts({});
    } catch {}
  }, []);

  const recordAttempt = (drillId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nextCount = (attempts[drillId] || 0) + 1;
    const newCounts = { ...attempts, [drillId]: nextCount };
    setAttempts(newCounts);
    try {
      localStorage.setItem('tf_drill_attempts', JSON.stringify({ date: today, counts: newCounts }));
    } catch {}
  };

  const getRemaining = (drillId: string): number => {
    if (profile.isPremium) return 999;
    const max = DRILL_LIMITS[drillId] || 3;
    const used = attempts[drillId] || 0;
    return Math.max(0, max - used);
  };

  const handleStartSpeedBurst = () => {
    if (getRemaining('speed_burst') <= 0) return;
    recordAttempt('speed_burst');
    onLaunchDrill({
      mode: 'words',
      drillId: 'speed_burst',
      title: isTr ? '⚡ 30s Hız Patlaması Antrenmanı' : '⚡ 30s Speed Burst Drill',
      timeLimit: 30,
      xpReward: 50,
      gemReward: 1,
      leagueReward: 2,
      caseSensitive,
      includePunctuation,
    });
  };

  const handleStartEndurance = () => {
    if (getRemaining('endurance') <= 0) return;
    recordAttempt('endurance');
    onLaunchDrill({
      mode: 'words',
      drillId: 'endurance',
      title: isTr ? '🏃 60s Dayanıklılık Maratonu' : '🏃 60s Endurance Grind',
      timeLimit: 60,
      xpReward: 100,
      gemReward: 2,
      leagueReward: 5,
      caseSensitive,
      includePunctuation,
    });
  };

  const handleStartSniper = () => {
    if (getRemaining('sniper') <= 0) return;
    recordAttempt('sniper');
    onLaunchDrill({
      mode: 'words',
      drillId: 'sniper',
      title: isTr ? '🎯 %98+ Keskin Nişancı Kampı' : '🎯 98%+ Accuracy Sniper Drill',
      wordCount: 25,
      minAccuracy: 98,
      xpReward: 150,
      gemReward: 2,
      leagueReward: 10,
      caseSensitive,
      includePunctuation,
    });
  };

  const handleStartThematic = () => {
    if (getRemaining('thematic') <= 0) return;
    recordAttempt('thematic');
    const activeId = selectedTopicId === 'random' ? undefined : selectedTopicId;
    const generated = generateTopicPracticeWords(lang === 'tr' ? 'tr' : 'en', 35, activeId, includePunctuation, caseSensitive);
    onLaunchDrill({
      mode: 'story',
      drillId: 'thematic',
      title: generated.title,
      generatedWords: generated.words,
      xpReward: 75,
      gemReward: 1,
      leagueReward: 3,
      topicId: generated.topic.id,
      caseSensitive,
      includePunctuation,
    });
  };

  const handleStartEnergyRefill = () => {
    if (getRemaining('energy_refill') <= 0) return;
    recordAttempt('energy_refill');
    onLaunchDrill({
      mode: 'words',
      drillId: 'energy_refill',
      title: isTr ? '🔋 Enerji Kurtarma Alıştırması' : '🔋 Focus Energy Recovery Drill',
      wordCount: 20,
      minAccuracy: 95,
      xpReward: 40,
      gemReward: 1,
      leagueReward: 1,
      energyReward: 1,
      caseSensitive,
      includePunctuation,
    });
  };

  return (
    <div className="tf-practice-hub">
      {/* 1. Training Dojo Hero Banner */}
      <div className="tf-practice-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <span className="tf-badge" style={{ background: 'rgba(234, 179, 8, 0.15)', borderColor: '#eab308', color: '#fbbf24' }}>
            🏋️ {isTr ? 'DAKTİLO ANTRENMAN & BİRİM KAZANMA DOJO\'SU' : 'TYPING TRAINING & REWARD DOJO'}
          </span>
          <span className="tf-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderColor: '#38bdf8' }}>
            ⏱️ {isTr ? 'GÜNLÜK SINIRLI ETKİNLİKLER' : 'DAILY LIMITED EVENTS'}
          </span>
        </div>
        <h2>{isTr ? 'Antrenman Yap, Ekstra XP & Elmas Topla' : 'Train Hard, Farm Extra XP & Gems'}</h2>
        <p>
          {isTr
            ? 'Burası standart derslerin ötesinde günlük limitli bir antrenman arenası! Her etkinlik günlük haklarla sınırlıdır. Zorlu hedefleri tamamla; ekstra XP, Elmas, Lig Puanı ve tükenen Odak Enerjini geri kazan.'
            : 'Step beyond standard lessons into a daily-limited training arena! Complete drills to grind surplus XP, Gems, League rank, and restore depleted Focus Battery cells.'}
        </p>
      </div>

      {/* 2. Live Grind Stats HUD */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.85rem',
        marginBottom: '2rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--tf-border)',
        borderRadius: '14px',
        padding: '1rem',
      }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--tf-text-muted)', fontFamily: 'var(--tf-font-mono)' }}>
            {isTr ? 'TOPLAM XP' : 'TOTAL XP'}
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7' }}>⚡ {profile.xp}</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--tf-text-muted)', fontFamily: 'var(--tf-font-mono)' }}>
            {isTr ? 'ELMAS BAKİYESİ' : 'GEM BALANCE'}
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>💎 {Math.max(0, profile.gems || 0)}</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--tf-text-muted)', fontFamily: 'var(--tf-font-mono)' }}>
            {isTr ? 'HAFTALIK LİG SKORU' : 'WEEKLY LEAGUE XP'}
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>🏆 {profile.weeklyXp || 0}</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--tf-text-muted)', fontFamily: 'var(--tf-font-mono)' }}>
            {isTr ? 'ODAK ENERJİSİ' : 'FOCUS BATTERY'}
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
            🔋 {profile.isPremium ? '♾️' : `${profile.energy ?? profile.hearts ?? 5}/5`}
          </div>
        </div>
      </div>

      {/* 3. Global Practice Preferences (Case & Punctuation) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        background: 'var(--tf-surface-elevated)',
        border: '1px solid var(--tf-border)',
        borderRadius: '12px',
        marginBottom: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>⚙️</span>
          <span style={{ fontFamily: 'var(--tf-font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--tf-text-primary)' }}>
            {isTr ? 'Pratik Kolaylık Ayarları:' : 'Practice Lenience Settings:'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button
            type="button"
            className={`tf-ctrl-btn tf-btn-pushable ${!caseSensitive ? 'active' : ''}`}
            onClick={() => setCaseSensitive(!caseSensitive)}
            title={isTr ? "Büyük/Küçük harf şart olmasın" : "Case insensitive"}
          >
            <span>Aa</span>
            <span>{caseSensitive ? (isTr ? 'Büyük Harf: Şart' : 'Case: Strict') : (isTr ? 'Büyük Harf: Serbest' : 'Case: Free')}</span>
          </button>

          <button
            type="button"
            className={`tf-ctrl-btn tf-btn-pushable ${!includePunctuation ? 'active' : ''}`}
            onClick={() => setIncludePunctuation(!includePunctuation)}
            title={isTr ? "Noktalama işaretleri şart olmasın" : "Punctuation free"}
          >
            <span>!?</span>
            <span>{includePunctuation ? (isTr ? 'Noktalama: Açık' : 'Punctuation: On') : (isTr ? 'Noktalama: Kapalı (Serbest)' : 'Punctuation: Off')}</span>
          </button>
        </div>
      </div>

      {/* 4. The 5 Targeted Challenge Cards (With Strict Activity Limits) */}
      <div className="tf-practice-grid">
        {/* Drill 1: Speed Burst */}
        <div className="tf-practice-card" style={{ borderTop: '3px solid #f59e0b' }}>
          <div>
            <div className="tf-practice-card-header">
              <span className="tf-practice-card-icon">⚡</span>
              <span
                className="tf-practice-badge"
                style={{
                  color: getRemaining('speed_burst') > 0 ? '#f59e0b' : '#ef4444',
                  borderColor: getRemaining('speed_burst') > 0 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                }}
              >
                {profile.isPremium
                  ? '♾️ SINIRSIZ'
                  : (isTr ? `Kalan Hak: ${getRemaining('speed_burst')}/${DRILL_LIMITS.speed_burst}` : `Attempts: ${getRemaining('speed_burst')}/${DRILL_LIMITS.speed_burst}`)}
              </span>
            </div>
            <h3 className="tf-practice-card-title">{isTr ? 'Hız Patlaması Antrenmanı' : 'Speed Burst Drill'}</h3>
            <p className="tf-practice-card-desc">
              {isTr
                ? '30 saniye boyunca duraksamadan yazarak parmak reflekslerini zirveye taşı.'
                : 'Sprint for 30 seconds straight without pausing to push peak velocity.'}
            </p>

            {/* Payout Tag */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className="tf-badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>+50 XP</span>
              <span className="tf-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>+1 💎</span>
              <span className="tf-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>+2 🏆 Lig</span>
            </div>
          </div>

          {getRemaining('speed_burst') > 0 ? (
            <button
              type="button"
              className="tf-practice-start-btn tf-btn-pushable"
              onClick={handleStartSpeedBurst}
            >
              <span>⚡</span>
              <span>{isTr ? 'Hız Patlamasını Başlat' : 'Start Speed Burst'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="tf-practice-start-btn"
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)', color: 'var(--tf-text-muted)' }}
            >
              <span>🔒 {isTr ? 'Günlük Limit Doldu (00:00)' : 'Limit Reached (00:00)'}</span>
            </button>
          )}
        </div>

        {/* Drill 2: Endurance Grind */}
        <div className="tf-practice-card" style={{ borderTop: '3px solid #3b82f6' }}>
          <div>
            <div className="tf-practice-card-header">
              <span className="tf-practice-card-icon">🏃</span>
              <span
                className="tf-practice-badge"
                style={{
                  color: getRemaining('endurance') > 0 ? '#3b82f6' : '#ef4444',
                  borderColor: getRemaining('endurance') > 0 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                }}
              >
                {profile.isPremium
                  ? '♾️ SINIRSIZ'
                  : (isTr ? `Kalan Hak: ${getRemaining('endurance')}/${DRILL_LIMITS.endurance}` : `Attempts: ${getRemaining('endurance')}/${DRILL_LIMITS.endurance}`)}
              </span>
            </div>
            <h3 className="tf-practice-card-title">{isTr ? 'Dayanıklılık Maratonu' : 'Endurance Marathon'}</h3>
            <p className="tf-practice-card-desc">
              {isTr
                ? '60 saniye boyunca temponu koru. Çift XP ve Elmas ödülü toplayarak ligde yüksel.'
                : 'Sustain uninterrupted rhythm for 60 seconds to earn double XP and diamonds.'}
            </p>

            {/* Payout Tag */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className="tf-badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>+100 XP</span>
              <span className="tf-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>+2 💎</span>
              <span className="tf-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>+5 🏆 Lig</span>
            </div>
          </div>

          {getRemaining('endurance') > 0 ? (
            <button
              type="button"
              className="tf-practice-start-btn tf-btn-pushable"
              onClick={handleStartEndurance}
            >
              <span>🏃</span>
              <span>{isTr ? 'Dayanıklılık Koşusunu Başlat' : 'Start Endurance Run'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="tf-practice-start-btn"
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)', color: 'var(--tf-text-muted)' }}
            >
              <span>🔒 {isTr ? 'Günlük Limit Doldu (00:00)' : 'Limit Reached (00:00)'}</span>
            </button>
          )}
        </div>

        {/* Drill 3: Sniper Accuracy */}
        <div className="tf-practice-card" style={{ borderTop: '3px solid #ef4444' }}>
          <div>
            <div className="tf-practice-card-header">
              <span className="tf-practice-card-icon">🎯</span>
              <span
                className="tf-practice-badge"
                style={{
                  color: getRemaining('sniper') > 0 ? '#ef4444' : '#ef4444',
                  borderColor: getRemaining('sniper') > 0 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                }}
              >
                {profile.isPremium
                  ? '♾️ SINIRSIZ'
                  : (isTr ? `Kalan Hak: ${getRemaining('sniper')}/${DRILL_LIMITS.sniper}` : `Attempts: ${getRemaining('sniper')}/${DRILL_LIMITS.sniper}`)}
              </span>
            </div>
            <h3 className="tf-practice-card-title">{isTr ? 'Keskin Nişancı Kampı' : 'Sniper Accuracy Camp'}</h3>
            <p className="tf-practice-card-desc">
              {isTr
                ? 'Sıfır hata disiplini! 25 kelimeyi %98 ve üstü doğrulukla yaz, dev elmas ödülünü kap.'
                : 'Zero tolerance for sloppy typing. Hit 98%+ accuracy across 25 words for maximum gems.'}
            </p>

            {/* Payout Tag */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className="tf-badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>+150 XP</span>
              <span className="tf-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>+2 💎</span>
              <span className="tf-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>+10 🏆 Lig</span>
            </div>
          </div>

          {getRemaining('sniper') > 0 ? (
            <button
              type="button"
              className="tf-practice-start-btn tf-btn-pushable"
              onClick={handleStartSniper}
            >
              <span>🎯</span>
              <span>{isTr ? 'Keskin Nişancı Görevine Başla' : 'Start Sniper Mission'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="tf-practice-start-btn"
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)', color: 'var(--tf-text-muted)' }}
            >
              <span>🔒 {isTr ? 'Günlük Limit Doldu (00:00)' : 'Limit Reached (00:00)'}</span>
            </button>
          )}
        </div>

        {/* Drill 4: Multi-Topic Thematic Chaos Flow */}
        <div className="tf-practice-card" style={{ borderTop: '3px solid #10b981' }}>
          <div>
            <div className="tf-practice-card-header">
              <span className="tf-practice-card-icon">🧩</span>
              <span
                className="tf-practice-badge"
                style={{
                  color: getRemaining('thematic') > 0 ? '#10b981' : '#ef4444',
                  borderColor: getRemaining('thematic') > 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                }}
              >
                {profile.isPremium
                  ? '♾️ SINIRSIZ'
                  : (isTr ? `Kalan Hak: ${getRemaining('thematic')}/${DRILL_LIMITS.thematic}` : `Attempts: ${getRemaining('thematic')}/${DRILL_LIMITS.thematic}`)}
              </span>
            </div>
            <h3 className="tf-practice-card-title">{isTr ? 'Tematik Kelime Fırtınası' : 'Thematic Word Storm'}</h3>
            <p className="tf-practice-card-desc">
              {isTr
                ? 'Yapay zeka, tiyatro, kuantum, siber güvenlik veya derin denizden rastgele konulu yarı-karışık sözcükler.'
                : 'Semi-shuffled vocabulary from AI, theatre, space, cybersecurity, or ocean trenches.'}
            </p>

            {/* Topic Selector */}
            <div style={{ marginBottom: '1rem' }}>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="tf-sound-select"
                style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              >
                <option value="random">🎲 {isTr ? 'Rastgele Konu Seç' : 'Random Topic'}</option>
                {PRACTICE_TOPICS.map((top) => (
                  <option key={top.id} value={top.id}>
                    {top.icon} {isTr ? top.nameTr : top.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Payout Tag */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className="tf-badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>+75 XP</span>
              <span className="tf-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>+1 💎</span>
              <span className="tf-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>+3 🏆 Lig</span>
            </div>
          </div>

          {getRemaining('thematic') > 0 ? (
            <button
              type="button"
              className="tf-practice-start-btn tf-btn-pushable"
              onClick={handleStartThematic}
            >
              <span>🧩</span>
              <span>{isTr ? 'Tematik Akışı Başlat' : 'Start Thematic Flow'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="tf-practice-start-btn"
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)', color: 'var(--tf-text-muted)' }}
            >
              <span>🔒 {isTr ? 'Günlük Limit Doldu (00:00)' : 'Limit Reached (00:00)'}</span>
            </button>
          )}
        </div>

        {/* Drill 5: Focus Energy Recharger Drill */}
        <div className="tf-practice-card" style={{ borderTop: '3px solid #06b6d4', gridColumn: 'span 1' }}>
          <div>
            <div className="tf-practice-card-header">
              <span className="tf-practice-card-icon">🔋</span>
              <span
                className="tf-practice-badge"
                style={{
                  color: getRemaining('energy_refill') > 0 ? '#06b6d4' : '#ef4444',
                  borderColor: getRemaining('energy_refill') > 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                }}
              >
                {profile.isPremium
                  ? '♾️ SINIRSIZ'
                  : (isTr ? `Kalan Hak: ${getRemaining('energy_refill')}/${DRILL_LIMITS.energy_refill}` : `Attempts: ${getRemaining('energy_refill')}/${DRILL_LIMITS.energy_refill}`)}
              </span>
            </div>
            <h3 className="tf-practice-card-title">{isTr ? 'Enerji Kurtarma Alıştırması' : 'Focus Battery Recovery'}</h3>
            <p className="tf-practice-card-desc">
              {isTr
                ? 'Odak Enerjin mi azaldı? Bu özel alıştırmayı tamamla ve beklemeden anında +1 Odak Enerjisi kazan.'
                : 'Running low on focus energy? Complete this drill to recharge +1 battery cell for free.'}
            </p>

            {/* Payout Tag */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className="tf-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 800 }}>
                🔋 +1 ENERJİ ŞARJ
              </span>
              <span className="tf-badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>+1 💎</span>
              <span className="tf-badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>+40 XP</span>
            </div>
          </div>

          {getRemaining('energy_refill') > 0 ? (
            <button
              type="button"
              className="tf-practice-start-btn tf-btn-pushable"
              onClick={handleStartEnergyRefill}
              style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(16, 185, 129, 0.2))', borderColor: '#10b981' }}
            >
              <span>🔋</span>
              <span>{isTr ? 'Enerji Kurtarmayı Başlat' : 'Start Energy Recovery'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="tf-practice-start-btn"
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)', color: 'var(--tf-text-muted)' }}
            >
              <span>🔒 {isTr ? 'Günlük Limit Doldu (00:00)' : 'Limit Reached (00:00)'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
