/**
 * TYPEFLOW — Minimalist Cockpit Controls Bar
 * Simplified to ONLY the 3 core modes (Words, Story, Dev/CLI) and Duration (Time vs Word count).
 * Free of visual clutter, pure ergonomic focus.
 */

'use client';

import React from 'react';
import { Locale } from '@/dictionaries';
import { TypeFlowMode, WordCountOption, TimeOption } from './types';

interface TypeFlowControlsProps {
  lang: Locale;
  mode: TypeFlowMode;
  wordCount: WordCountOption;
  timeLimit: TimeOption;
  wordModeType: 'words' | 'time';
  caseSensitive?: boolean;
  includePunctuation?: boolean;
  onModeChange: (mode: TypeFlowMode) => void;
  onWordCountChange: (count: WordCountOption) => void;
  onTimeLimitChange: (time: TimeOption) => void;
  onWordModeTypeChange: (type: 'words' | 'time') => void;
  onToggleCaseSensitive?: () => void;
  onTogglePunctuation?: () => void;
}

export default function TypeFlowControls({
  lang,
  mode,
  wordCount,
  timeLimit,
  wordModeType,
  caseSensitive = false,
  includePunctuation = false,
  onModeChange,
  onWordCountChange,
  onTimeLimitChange,
  onWordModeTypeChange,
  onToggleCaseSensitive,
  onTogglePunctuation,
}: TypeFlowControlsProps) {
  const isTr = lang === 'tr';

  return (
    <div className="tf-controls-bar">
      <div className="tf-pills-container">
        {/* 1. 3 Core Modes */}
        <div className="tf-mode-group">
          <button
            className={`tf-pill ${mode === 'words' ? 'active' : ''}`}
            onClick={() => onModeChange('words')}
            title={isTr ? "Sık kullanılan kelimeler" : "Frequent words"}
          >
            <span>●</span>
            <span>{isTr ? 'Kelimeler' : 'Words'}</span>
          </button>

          <button
            className={`tf-pill ${mode === 'story' ? 'active' : ''}`}
            onClick={() => onModeChange('story')}
            title={isTr ? "Algoritmik dinamik hikaye modu" : "Dynamic narrative story"}
          >
            <span>📖</span>
            <span>{isTr ? 'Hikaye' : 'Story'}</span>
          </button>

          <button
            className={`tf-pill ${mode === 'dev' ? 'active' : ''}`}
            onClick={() => onModeChange('dev')}
            title={isTr ? "PowerShell, Terminal ve Kod komutları" : "PowerShell, CLI & Code commands"}
          >
            <span>⚡</span>
            <span>{isTr ? 'Kod & CLI' : 'Dev / CLI'}</span>
          </button>
        </div>

        <div className="tf-pill-divider" />

        {/* 2. Measurement Metric: Süreli mi, Kelimeli mi? */}
        <div className="tf-mode-group">
          <button
            className={`tf-pill ${wordModeType === 'time' ? 'active' : ''}`}
            onClick={() => onWordModeTypeChange('time')}
          >
            {isTr ? 'Süreli' : 'Time'}
          </button>
          <button
            className={`tf-pill ${wordModeType === 'words' ? 'active' : ''}`}
            onClick={() => onWordModeTypeChange('words')}
          >
            {isTr ? 'Kelimeli' : 'Words'}
          </button>

          <div className="tf-pill-divider" />

          {/* Counts or Durations */}
          {wordModeType === 'time' ? (
            <>
              {([15, 30, 60] as TimeOption[]).map((time) => (
                <button
                  key={time}
                  className={`tf-pill ${timeLimit === time ? 'active' : ''}`}
                  onClick={() => onTimeLimitChange(time)}
                >
                  {time}s
                </button>
              ))}
            </>
          ) : (
            <>
              {([15, 25, 50, 100] as WordCountOption[]).map((count) => (
                <button
                  key={count}
                  className={`tf-pill ${wordCount === count ? 'active' : ''}`}
                  onClick={() => onWordCountChange(count)}
                >
                  {count}
                </button>
              ))}
            </>
          )}
        </div>

        {/* 3. Lenient / Strict Writing Modifiers (Aa and !?) */}
        <div className="tf-pill-divider" />

        <div className="tf-mode-group" title={isTr ? "Pratikte Büyük Harf ve Noktalama İsteğe Bağlıdır" : "Casing & Punctuation are optional in practice"}>
          {onToggleCaseSensitive && (
            <button
              className={`tf-pill ${caseSensitive ? 'active' : ''}`}
              onClick={onToggleCaseSensitive}
              title={
                caseSensitive
                  ? (isTr ? 'Büyük/Küçük Harf: ZORUNLU' : 'Casing: STRICT')
                  : (isTr ? 'Büyük/Küçük Harf: SERBEST (İsteğe Bağlı)' : 'Casing: FORGIVING (Optional)')
              }
              style={{
                borderColor: caseSensitive ? 'var(--tf-accent)' : 'rgba(255,255,255,0.1)',
                opacity: caseSensitive ? 1 : 0.75,
              }}
            >
              <span>Aa</span>
              <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>
                {caseSensitive ? '✓' : '○'}
              </span>
            </button>
          )}

          {onTogglePunctuation && (
            <button
              className={`tf-pill ${includePunctuation ? 'active' : ''}`}
              onClick={onTogglePunctuation}
              title={
                includePunctuation
                  ? (isTr ? 'Noktalama: ZORUNLU' : 'Punctuation: STRICT')
                  : (isTr ? 'Noktalama: SERBEST (İsteğe Bağlı)' : 'Punctuation: FORGIVING (Optional)')
              }
              style={{
                borderColor: includePunctuation ? 'var(--tf-accent)' : 'rgba(255,255,255,0.1)',
                opacity: includePunctuation ? 1 : 0.75,
              }}
            >
              <span>!?</span>
              <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>
                {includePunctuation ? '✓' : '○'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
