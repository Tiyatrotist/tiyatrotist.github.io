/**
 * TYPEFLOW — Results HUD & Analytics Component
 * Renders post-test analytics, SVG interactive speed timeline graph, PB badges, and sharing.
 */

'use client';

import React, { useState } from 'react';
import { Locale } from '@/dictionaries';
import { TestResult, Lesson } from './types';
import KeyboardHeatmap from './KeyboardHeatmap';

interface TypeFlowResultsProps {
  lang: Locale;
  result: TestResult;
  activeLesson?: Lesson | null;
  onRestart: () => void;
  onReturnToProjects: () => void;
  onViewLeaderboard?: () => void;
  onReturnToPath?: () => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
}

export default function TypeFlowResults({
  lang,
  result,
  activeLesson,
  onRestart,
  onReturnToProjects,
  onViewLeaderboard,
  onReturnToPath,
  onNextLesson,
  onPrevLesson,
}: TypeFlowResultsProps) {
  const isTr = lang === 'tr';
  const [copied, setCopied] = useState(false);

  // Speed rank evaluation
  const getRank = (wpm: number) => {
    if (wpm >= 110) return isTr ? 'IŞIK HIZI // GODSPEED' : 'LIGHTSPEED // GODSPEED';
    if (wpm >= 90) return isTr ? 'SİBER USTA // MASTER' : 'CYBER MASTER // PRO';
    if (wpm >= 70) return isTr ? 'HIZLI YAZAR // SWIFT' : 'SWIFT TYPIST';
    if (wpm >= 50) return isTr ? 'GELİŞMİŞ // PROFICIENT' : 'PROFICIENT';
    return isTr ? 'ÇIRAK // NOVICE' : 'APPRENTICE';
  };

  // Copy result snippet to clipboard
  const handleCopyResult = () => {
    const text = `TypeFlow [${result.mode.toUpperCase()}] — ${result.wpm} WPM | %${result.accuracy} Acc | ${result.cpm} CPM | ${result.rawWpm} Raw WPM | https://tiyatrotist.com/${lang}/projects/typeflow`;
    navigator.clipboard.writeText(text).then(() => {
      console.debug('[TypeFlow:Results] Copied result summary to clipboard');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Calculate SVG timeline points for line chart
  const history = result.history || [];
  const svgWidth = 800;
  const svgHeight = 120;
  const padding = 20;

  const maxWpm = Math.max(
    ...history.map((h) => Math.max(h.wpm, h.rawWpm)),
    result.wpm + 10,
    40
  );

  const pointsWpm = history.map((h, idx) => {
    const x = padding + (idx / Math.max(history.length - 1, 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - (h.wpm / maxWpm) * (svgHeight - padding * 2);
    return `${x},${y}`;
  });

  const pointsRaw = history.map((h, idx) => {
    const x = padding + (idx / Math.max(history.length - 1, 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - (h.rawWpm / maxWpm) * (svgHeight - padding * 2);
    return `${x},${y}`;
  });

  const pathD = pointsWpm.length > 1 ? `M ${pointsWpm.join(' L ')}` : '';
  const pathRawD = pointsRaw.length > 1 ? `M ${pointsRaw.join(' L ')}` : '';

  // Area fill under WPM curve
  const areaD = pointsWpm.length > 1
    ? `M ${padding},${svgHeight - padding} L ${pointsWpm.join(' L ')} L ${svgWidth - padding},${svgHeight - padding} Z`
    : '';

  return (
    <div className="tf-results-container" role="region" aria-label="Test Results">
      {/* Header: Big primary metrics */}
      <div className="tf-results-header">
        <div className="tf-big-score">
          <div className="tf-big-wpm">
            <span>{result.wpm}</span>
            <span className="tf-big-unit">WPM</span>
          </div>
          <span style={{ fontFamily: 'var(--tf-font-mono)', fontSize: '0.8rem', color: 'var(--tf-text-secondary)', marginTop: '0.2rem' }}>
            {getRank(result.wpm)}
          </span>

          {result.isPersonalBest && (
            <div className="tf-pb-tag">
              <span>★</span>
              <span>{isTr ? 'YENİ EN İYİ SKOR!' : 'NEW PERSONAL BEST!'}</span>
            </div>
          )}
        </div>

        <div className="tf-big-score" style={{ textAlign: 'right', alignItems: 'flex-end' }}>
          <div className="tf-big-wpm" style={{ color: result.accuracy >= 98 ? 'var(--tf-accent)' : '#fbbf24' }}>
            <span>%{result.accuracy}</span>
          </div>
          <span style={{ fontFamily: 'var(--tf-font-mono)', fontSize: '0.8rem', color: 'var(--tf-text-muted)', marginTop: '0.2rem' }}>
            {isTr ? 'DOĞRULUK ORANI' : 'ACCURACY'}
          </span>
        </div>
      </div>

      {/* SVG Interactive Speed Timeline Chart */}
      {history.length > 1 && (
        <div className="tf-chart-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="tf-chart-title">
              {isTr ? 'HIZ VE ZAMAN GRAFİĞİ (WPM / SN)' : 'SPEED TIMELINE (WPM / SEC)'}
            </span>
            <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--tf-font-mono)', fontSize: '0.65rem', color: 'var(--tf-text-muted)' }}>
              <span style={{ color: 'var(--tf-accent)' }}>● WPM</span>
              <span style={{ color: 'var(--tf-text-muted)' }}>- - Raw WPM</span>
              <span style={{ color: '#ef4444' }}>▲ {isTr ? 'Hata' : 'Error'}</span>
            </div>
          </div>

          <svg className="tf-chart-svg" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            <defs>
              <linearGradient id="tf-area-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--tf-accent)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--tf-accent)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Background grid lines */}
            <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="var(--tf-border)" strokeWidth="1" />
            <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="var(--tf-border)" strokeDasharray="3 3" strokeWidth="1" />

            {/* Filled area */}
            {areaD && <path d={areaD} fill="url(#tf-area-gradient)" />}

            {/* Raw WPM path */}
            {pathRawD && <path d={pathRawD} fill="none" stroke="var(--tf-text-muted)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />}

            {/* Main WPM path */}
            {pathD && <path d={pathD} fill="none" stroke="var(--tf-accent)" strokeWidth="2.5" strokeLinecap="round" />}

            {/* Error pins */}
            {history.map((h, idx) => {
              if (h.errors <= 0) return null;
              const x = padding + (idx / (history.length - 1)) * (svgWidth - padding * 2);
              const y = svgHeight - padding - (h.wpm / maxWpm) * (svgHeight - padding * 2);
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="3.5" fill="#ef4444" />
                  <line x1={x} y1={y} x2={x} y2={y - 8} stroke="#ef4444" strokeWidth="1.5" />
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Grid of Secondary Metrics */}
      <div className="tf-stat-grid">
        <div className="tf-hud-metric">
          <span className="tf-hud-val">{result.rawWpm}</span>
          <span className="tf-hud-lbl">{isTr ? 'Ham WPM (Raw)' : 'Raw WPM'}</span>
        </div>

        <div className="tf-hud-metric">
          <span className="tf-hud-val">{result.cpm}</span>
          <span className="tf-hud-lbl">{isTr ? 'Harf / Dk (CPM)' : 'Characters / Min'}</span>
        </div>

        <div className="tf-hud-metric">
          <span className="tf-hud-val">%{result.consistency}</span>
          <span className="tf-hud-lbl">{isTr ? 'Kararlılık' : 'Consistency'}</span>
        </div>

        <div className="tf-hud-metric">
          <span className="tf-hud-val">{result.elapsedSeconds.toFixed(1)}s</span>
          <span className="tf-hud-lbl">{isTr ? 'Süre' : 'Time'}</span>
        </div>

        <div className="tf-hud-metric">
          <span className="tf-hud-val" style={{ color: 'var(--tf-char-correct)' }}>
            {result.correctWords}
          </span>
          <span className="tf-hud-lbl">{isTr ? 'Doğru Kelime' : 'Correct Words'}</span>
        </div>

        <div className="tf-hud-metric">
          <span className="tf-hud-val" style={{ color: '#ef4444' }}>
            {result.incorrectWords}
          </span>
          <span className="tf-hud-lbl">{isTr ? 'Hatalı Kelime' : 'Incorrect Words'}</span>
        </div>

        <div className="tf-hud-metric">
          <span className="tf-hud-val" style={{ color: 'var(--tf-text-secondary)' }}>
            {result.correctChars} / {result.incorrectChars}
          </span>
          <span className="tf-hud-lbl">{isTr ? 'Harf (Doğru/Hata)' : 'Chars (Good/Err)'}</span>
        </div>
      </div>

      {/* Interactive Keyboard Heatmap */}
      <div style={{ marginTop: '1rem' }}>
        <KeyboardHeatmap lang={lang} keyStats={result.keyStats || {}} />
      </div>

      {/* Duolingo Lesson Rewards Banner */}
      {result.mode === 'lesson' && (
        result.stars && result.stars > 0 ? (
          <div style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(56, 189, 248, 0.12))', border: '1.5px solid #22c55e', borderRadius: '14px', padding: '1.25rem', marginTop: '1rem', textAlign: 'center', boxShadow: '0 8px 24px rgba(34, 197, 94, 0.15)' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <span className="tf-star-spring-1">{result.stars >= 1 ? '⭐' : '☆'}</span>
              <span className="tf-star-spring-2">{result.stars >= 2 ? '⭐' : '☆'}</span>
              <span className="tf-star-spring-3">{result.stars >= 3 ? '⭐' : '☆'}</span>
            </div>
            <h4 style={{ margin: '0 0 0.25rem 0', color: '#22c55e', fontSize: '1.2rem', fontWeight: 800 }}>
              {isTr ? '🎉 Ders Başarıyla Tamamlandı!' : '🎉 Lesson Completed!'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--tf-text-secondary)' }}>
              {isTr ? `Kazanılan Ödül: +${result.earnedXp || 25} XP ve +${result.earnedGems || 5} 💎 Elmas` : `Rewards: +${result.earnedXp || 25} XP & +${result.earnedGems || 5} 💎 Gems`}
            </p>
            <div style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.18)', color: '#16a34a', padding: '0.25rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
              <span>✓</span>
              <span>{isTr ? 'Akademi Haritasına Kaydedildi' : 'Saved to Academy Path'}</span>
            </div>
          </div>
        ) : (
          <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.12))', border: '1.5px solid #ef4444', borderRadius: '14px', padding: '1.25rem', marginTop: '1rem', textAlign: 'center', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.15)' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <span>☆</span>
              <span>☆</span>
              <span>☆</span>
            </div>
            <h4 style={{ margin: '0 0 0.25rem 0', color: '#ef4444', fontSize: '1.2rem', fontWeight: 800 }}>
              {isTr ? '⚠️ Ustalık Barajı Sağlanamadı' : '⚠️ Mastery Goal Not Met'}
            </h4>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: 'var(--tf-text-secondary)' }}>
              {isTr
                ? `Bu dersi tamamlamak için gereken baraj: ${activeLesson?.minWpm || 20} WPM ve %${activeLesson?.minAccuracy || 90} Doğruluk.`
                : `Target criteria to pass this lesson: ${activeLesson?.minWpm || 20} WPM and %${activeLesson?.minAccuracy || 90} Accuracy.`}
            </p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#f59e0b', fontWeight: 700 }}>
              {isTr ? 'Sonucunuz barajın altında kaldığı için ders henüz tamamlanmadı. Lütfen tekrar deneyin!' : 'Your score fell below target criteria. Please try again!'}
            </p>
          </div>
        )
      )}

      {/* Actions and Sharing (Simplified per User Request) */}
      <div className="tf-results-actions">
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          {result.mode === 'lesson' ? (
            <>
              {onReturnToPath && (
                <button
                  className="tf-btn-secondary tf-btn-pushable"
                  onClick={onReturnToPath}
                  title={isTr ? "Akademi Haritasına Dön" : "Back to Academy Path"}
                  style={{ borderColor: '#38bdf8', color: '#38bdf8', fontWeight: 800 }}
                >
                  <span>🗺️</span>
                  <span>{isTr ? 'Akademiye Dön' : 'Back to Path'}</span>
                </button>
              )}

              <button
                className="tf-btn-primary tf-btn-pushable"
                onClick={onRestart}
                title={isTr ? "Dersi Tekrarla" : "Repeat Lesson"}
                style={{ background: '#3b82f6', color: '#fff', fontWeight: 800 }}
              >
                <span>↺</span>
                <span>{isTr ? 'Dersi Tekrarla' : 'Repeat Lesson'}</span>
              </button>

              {onNextLesson && result.stars && result.stars > 0 && (
                <button
                  className="tf-btn-primary tf-btn-pushable"
                  onClick={onNextLesson}
                  title={isTr ? "Sıradaki Derse Geç" : "Next Lesson"}
                  style={{ background: '#10b981', color: '#fff', fontWeight: 800 }}
                >
                  <span>→</span>
                  <span>{isTr ? 'Sıradaki Ders' : 'Next Lesson'}</span>
                </button>
              )}

              {onPrevLesson && (
                <button
                  className="tf-btn-secondary tf-btn-pushable"
                  onClick={onPrevLesson}
                  title={isTr ? "Önceki Dersi Yükle" : "Previous Lesson"}
                >
                  <span>←</span>
                  <span>{isTr ? 'Önceki Ders' : 'Previous Lesson'}</span>
                </button>
              )}

              <button
                className="tf-btn-secondary tf-btn-pushable"
                onClick={handleCopyResult}
                title={isTr ? "Skoru Paylaş" : "Share Score"}
              >
                <span>📋</span>
                <span>{copied ? (isTr ? 'Kopyalandı!' : 'Copied!') : (isTr ? 'Skoru Paylaş' : 'Share Score')}</span>
              </button>
            </>
          ) : (
            <>
              <button
                className="tf-btn-primary tf-btn-pushable"
                onClick={onRestart}
                title={isTr ? "Yeniden Başlat" : "Restart Test"}
              >
                <span>↺</span>
                <span>{isTr ? 'Yeniden Başlat' : 'Restart Test'}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.75, marginLeft: '0.25rem' }}>
                  (Tab + Enter)
                </span>
              </button>

              <button
                className="tf-btn-secondary tf-btn-pushable"
                onClick={handleCopyResult}
                title={isTr ? "Skoru Paylaş" : "Share Score"}
              >
                <span>📋</span>
                <span>{copied ? (isTr ? 'Kopyalandı!' : 'Copied!') : (isTr ? 'Skoru Paylaş' : 'Share Score')}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
