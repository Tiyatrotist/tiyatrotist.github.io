/**
 * TYPEFLOW — Interactive Keyboard Heatmap Component
 * Renders an ergonomic visual keyboard heatmap with dynamic thermal color scaling,
 * error tracking per key, and keypress frequency analysis.
 */

'use client';

import React, { useState } from 'react';
import { Locale } from '@/dictionaries';
import { KeyHeatmapData } from './types';

interface KeyboardHeatmapProps {
  lang: Locale;
  keyStats: KeyHeatmapData;
}

export default function KeyboardHeatmap({ lang, keyStats }: KeyboardHeatmapProps) {
  const isTr = lang === 'tr';
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Keyboard Rows (Turkish Q layout with English fallback)
  const rows = isTr
    ? [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç'],
        ['SPACE'],
      ]
    : [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        ['SPACE'],
      ];

  // Calculate highest keystroke count for normalization
  const counts = Object.values(keyStats).map((k) => k.count);
  const maxCount = Math.max(...counts, 1);

  // Thermal color resolver
  const getKeyColor = (count: number, errors: number) => {
    if (count === 0) return { bg: 'var(--tf-surface-elevated)', border: 'var(--tf-border)', text: 'var(--tf-text-muted)' };

    const ratio = Math.min(count / maxCount, 1);
    const errorRatio = count > 0 ? errors / count : 0;

    if (errorRatio > 0.25) {
      return { bg: 'rgba(239, 68, 68, 0.35)', border: '#ef4444', text: '#ffffff' };
    }

    if (ratio > 0.7) {
      return { bg: 'rgba(245, 158, 11, 0.45)', border: '#f59e0b', text: '#ffffff' };
    } else if (ratio > 0.4) {
      return { bg: 'rgba(16, 185, 129, 0.35)', border: '#10b981', text: '#ffffff' };
    } else if (ratio > 0.15) {
      return { bg: 'rgba(56, 189, 248, 0.25)', border: '#38bdf8', text: '#f0f9ff' };
    } else {
      return { bg: 'rgba(255, 255, 255, 0.08)', border: 'var(--tf-border-active)', text: 'var(--tf-text-primary)' };
    }
  };

  // Top error keys
  const errorEntries = Object.entries(keyStats)
    .filter(([_, stat]) => stat.errors > 0)
    .sort((a, b) => b[1].errors - a[1].errors)
    .slice(0, 3);

  // Most pressed keys
  const topKeys = Object.entries(keyStats)
    .filter(([_, stat]) => stat.count > 0)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4);

  return (
    <div className="tf-heatmap-card" role="region" aria-label="Keyboard Heatmap">
      <div className="tf-heatmap-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🔥</span>
          <h3 className="tf-heatmap-title">
            {isTr ? 'KLAVYE ISI HARİTASI (HEATMAP)' : 'KEYBOARD HEATMAP'}
          </h3>
        </div>

        {/* Legend */}
        <div className="tf-heatmap-legend">
          <span>{isTr ? 'Soğuk' : 'Cold'}</span>
          <div className="tf-legend-bar" />
          <span>{isTr ? 'Sıcak' : 'Hot'}</span>
          <span className="tf-legend-error-tag">■ {isTr ? 'Hata' : 'Error'}</span>
        </div>
      </div>

      {/* Visual Keyboard Matrix */}
      <div className="tf-keyboard-matrix">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="tf-keyboard-row">
            {row.map((k) => {
              const lookup = k.toLowerCase();
              const stat = keyStats[lookup] || { count: 0, errors: 0 };
              const color = getKeyColor(stat.count, stat.errors);
              const isSpace = k === 'SPACE';

              return (
                <button
                  key={k}
                  className={`tf-key-cap ${isSpace ? 'space-key' : ''}`}
                  style={{
                    backgroundColor: color.bg,
                    borderColor: color.border,
                    color: color.text,
                  }}
                  onClick={() => setSelectedKey(lookup)}
                  title={`${k}: ${stat.count} ${isTr ? 'vuruş' : 'presses'}, ${stat.errors} ${isTr ? 'hata' : 'errors'}`}
                >
                  <span className="tf-key-letter">{isSpace ? (isTr ? 'BOŞLUK' : 'SPACE') : k}</span>
                  {stat.count > 0 && <span className="tf-key-count">{stat.count}</span>}
                  {stat.errors > 0 && <span className="tf-key-error-badge">!</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Selected Key or Quick Insights */}
      <div className="tf-heatmap-insights">
        <div className="tf-insight-item">
          <span className="tf-insight-label">{isTr ? 'EN SIK BASILAN TUŞLAR:' : 'MOST ACTIVE KEYS:'}</span>
          <div className="tf-insight-badges">
            {topKeys.length > 0 ? (
              topKeys.map(([char, s]) => (
                <span key={char} className="tf-insight-pill">
                  {char.toUpperCase()}: {s.count}
                </span>
              ))
            ) : (
              <span className="tf-insight-pill muted">{isTr ? 'Veri yok' : 'No data'}</span>
            )}
          </div>
        </div>

        <div className="tf-insight-item">
          <span className="tf-insight-label">{isTr ? 'EN ÇOK HATA YAPILAN TUŞLAR:' : 'MOST ACCIDENTAL KEYS:'}</span>
          <div className="tf-insight-badges">
            {errorEntries.length > 0 ? (
              errorEntries.map(([char, s]) => (
                <span key={char} className="tf-insight-pill error">
                  {char.toUpperCase()}: {s.errors} {isTr ? 'hata' : 'err'}
                </span>
              ))
            ) : (
              <span className="tf-insight-pill green">{isTr ? 'Kusursuz (0 Hata)' : 'Flawless (0 Err)'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
