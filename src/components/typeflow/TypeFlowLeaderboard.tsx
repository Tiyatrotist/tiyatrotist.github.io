/**
 * TYPEFLOW — Global Leaderboard Component
 * Competitive SaaS ranking table with mode filters, rank medals, and score submission.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/dictionaries';
import { supabase } from '@/lib/supabase';
import { LeaderboardEntry, UserProfile } from './types';

interface TypeFlowLeaderboardProps {
  lang: Locale;
  profile: UserProfile;
  lastTestWpm?: number;
  lastTestAccuracy?: number;
  lastTestMode?: string;
  onBackToTest: () => void;
}

const SEED_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', rank: 1, username: 'cyber_phoenix', avatar: '🔥', wpm: 124, accuracy: 99.4, mode: 'Kelimeler', date: '2026-09-11' },
  { id: '2', rank: 2, username: 'neo_matrix', avatar: '⚡', wpm: 118, accuracy: 98.8, mode: 'Kod & CLI', date: '2026-09-11' },
  { id: '3', rank: 3, username: 'monochrome_ghost', avatar: '💀', wpm: 112, accuracy: 99.1, mode: 'Hikaye', date: '2026-09-10' },
  { id: '4', rank: 4, username: 'speedy_fox', avatar: '🦊', wpm: 104, accuracy: 97.6, mode: 'Kelimeler', date: '2026-09-10' },
  { id: '5', rank: 5, username: 'terminal_root', avatar: '🤖', wpm: 98, accuracy: 98.2, mode: 'Kod & CLI', date: '2026-09-09' },
  { id: '6', rank: 6, username: 'void_walker', avatar: '🌐', wpm: 92, accuracy: 96.9, mode: 'Hikaye', date: '2026-09-09' },
  { id: '7', rank: 7, username: 'retro_typist', avatar: '👾', wpm: 87, accuracy: 98.0, mode: 'Kelimeler', date: '2026-09-08' },
];

export default function TypeFlowLeaderboard({
  lang,
  profile,
  lastTestWpm,
  lastTestAccuracy,
  lastTestMode,
  onBackToTest,
}: TypeFlowLeaderboardProps) {
  const isTr = lang === 'tr';
  const [filter, setFilter] = useState<'all' | 'words' | 'story' | 'dev'>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Load leaderboard scores from Supabase + localStorage/seed
  useEffect(() => {
    async function loadScores() {
      console.debug('[TypeFlow:Leaderboard] Loading leaderboard entries');
      try {
        const { data, error } = await supabase
          .from('typeflow_scores')
          .select('*')
          .order('wpm', { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          const formatted = data.map((d: any, idx: number) => ({
            id: d.id || String(idx),
            rank: idx + 1,
            username: d.username || 'Anonymous',
            avatar: d.avatar || '⚡',
            wpm: Number(d.wpm),
            accuracy: Number(d.accuracy),
            mode: d.mode || 'Kelimeler',
            date: d.created_at ? d.created_at.split('T')[0] : '2026-09-11',
          }));
          setEntries(formatted);
          return;
        }
      } catch (err) {
        console.debug('[TypeFlow:Leaderboard] Supabase query notice, using local seed:', err);
      }

      // Check stored custom local entries
      try {
        const local = localStorage.getItem('tf_local_leaderboard');
        if (local) {
          const parsed = JSON.parse(local);
          setEntries(parsed);
          return;
        }
      } catch {}

      setEntries(SEED_LEADERBOARD);
    }

    loadScores();
  }, []);

  // Filter entries
  const filtered = entries.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'words') return e.mode.toLowerCase().includes('kelime') || e.mode.toLowerCase().includes('word');
    if (filter === 'story') return e.mode.toLowerCase().includes('hikaye') || e.mode.toLowerCase().includes('story');
    if (filter === 'dev') return e.mode.toLowerCase().includes('kod') || e.mode.toLowerCase().includes('cli') || e.mode.toLowerCase().includes('dev');
    return true;
  });

  // Submit current score
  const handleSubmitScore = async () => {
    if (!lastTestWpm || hasSubmitted) return;

    const newEntry: LeaderboardEntry = {
      id: String(Date.now()),
      username: profile.username,
      avatar: profile.avatar,
      wpm: lastTestWpm,
      accuracy: lastTestAccuracy || 100,
      mode: lastTestMode || 'Kelimeler',
      date: new Date().toISOString().split('T')[0],
    };

    // Try sending to Supabase
    try {
      await supabase.from('typeflow_scores').insert({
        username: newEntry.username,
        avatar: newEntry.avatar,
        wpm: newEntry.wpm,
        accuracy: newEntry.accuracy,
        mode: newEntry.mode,
      });
      console.debug('[TypeFlow:Leaderboard] Score sent to Supabase');
    } catch {}

    // Save locally
    const updated = [...entries, newEntry]
      .sort((a, b) => b.wpm - a.wpm)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    setEntries(updated);
    setHasSubmitted(true);
    try {
      localStorage.setItem('tf_local_leaderboard', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="tf-leaderboard-container">
      {/* Header */}
      <div className="tf-lb-header">
        <div>
          <h2 className="tf-lb-title">
            🏆 {isTr ? 'KÜRESEL LİDERLİK TABLOSU' : 'GLOBAL LEADERBOARD'}
          </h2>
          <p className="tf-lb-subtitle">
            {isTr ? 'Tüm dünyadan en hızlı ve tutarlı klavye ustaları.' : 'Top speed-typists ranked by raw velocity and precision.'}
          </p>
        </div>

        <button className="tf-btn-primary" onClick={onBackToTest}>
          ⌨ {isTr ? 'Yazma Testine Dön' : 'Back to Test'}
        </button>
      </div>

      {/* Submit Recent Score CTA */}
      {lastTestWpm && !hasSubmitted && (
        <div className="tf-lb-submit-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.4rem' }}>⭐</span>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--tf-text-primary)' }}>
                {isTr ? 'Son Test Skorunuz:' : 'Your Recent Score:'} {lastTestWpm} WPM (%{lastTestAccuracy} Acc)
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--tf-text-muted)', margin: 0 }}>
                {profile.username} {isTr ? 'adıyla panoya kaydedin' : 'submit with your nickname'}
              </p>
            </div>
          </div>

          <button className="tf-btn-primary" onClick={handleSubmitScore}>
            {isTr ? 'Skorumu Gönder 🚀' : 'Submit My Score 🚀'}
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="tf-lb-filters">
        <button
          className={`tf-pill ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {isTr ? 'Tüm Modlar' : 'All Modes'}
        </button>
        <button
          className={`tf-pill ${filter === 'words' ? 'active' : ''}`}
          onClick={() => setFilter('words')}
        >
          {isTr ? 'Kelimeler' : 'Words'}
        </button>
        <button
          className={`tf-pill ${filter === 'story' ? 'active' : ''}`}
          onClick={() => setFilter('story')}
        >
          {isTr ? 'Hikaye' : 'Story'}
        </button>
        <button
          className={`tf-pill ${filter === 'dev' ? 'active' : ''}`}
          onClick={() => setFilter('dev')}
        >
          {isTr ? 'Kod & CLI' : 'Dev / CLI'}
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="tf-lb-table-wrapper">
        <table className="tf-lb-table">
          <thead>
            <tr>
              <th style={{ width: '70px' }}>#</th>
              <th>{isTr ? 'YAZICI' : 'TYPIST'}</th>
              <th>WPM</th>
              <th>{isTr ? 'DOĞRULUK' : 'ACCURACY'}</th>
              <th>{isTr ? 'MOD' : 'MODE'}</th>
              <th style={{ textAlign: 'right' }}>{isTr ? 'TARİH' : 'DATE'}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, idx) => {
              const rank = entry.rank || idx + 1;
              const isCurrentUser = entry.username === profile.username;

              let rankBadge = String(rank);
              let medalClass = '';
              if (rank === 1) { rankBadge = '🥇'; medalClass = 'gold'; }
              else if (rank === 2) { rankBadge = '🥈'; medalClass = 'silver'; }
              else if (rank === 3) { rankBadge = '🥉'; medalClass = 'bronze'; }

              return (
                <tr key={entry.id} className={`${isCurrentUser ? 'current-user-row' : ''}`}>
                  <td className={`tf-lb-rank ${medalClass}`}>{rankBadge}</td>
                  <td className="tf-lb-user">
                    <span className="tf-lb-avatar">{entry.avatar || '⚡'}</span>
                    <span className="tf-lb-name">{entry.username}</span>
                    {isCurrentUser && <span className="tf-lb-you-tag">{isTr ? 'SEN' : 'YOU'}</span>}
                  </td>
                  <td className="tf-lb-wpm">{entry.wpm}</td>
                  <td className="tf-lb-acc">%{entry.accuracy}</td>
                  <td className="tf-lb-mode">{entry.mode}</td>
                  <td className="tf-lb-date">{entry.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
