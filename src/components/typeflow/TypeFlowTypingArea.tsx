/**
 * TYPEFLOW — Ergonomic Dual-Box Typing Area Component
 * Features aggressive auto-focus mechanics, live keyboard heatmap tracking,
 * active-word hero pill, and real-time typo detection.
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { Locale } from '@/dictionaries';
import { WordState, TestStatus, TypeFlowMode } from './types';

interface TypeFlowTypingAreaProps {
  lang: Locale;
  words: WordState[];
  currentWordIndex: number;
  currentInput: string;
  isMismatch: boolean;
  correctWordsCount: number;
  incorrectWordsCount: number;
  timeLeft: number;
  totalTime: number;
  wordProgress: string;
  mode: TypeFlowMode;
  wordModeType: 'words' | 'time';
  modeLabel: string;
  testStatus: TestStatus;
  capsLockActive: boolean;
  liveStreak?: number;
  lessonMistakes?: number;
  maxMistakes?: number;
  caseSensitive?: boolean;
  includePunctuation?: boolean;
  activeStage?: {
    current: number;
    total: number;
    title: string;
    minWpm: number;
    minAccuracy: number;
  };
  onInputChange: (val: string) => void;
  onSpaceSubmit: () => void;
  onBackspaceEmpty: () => void;
  onRestart: () => void;
}

export default function TypeFlowTypingArea({
  lang,
  words,
  currentWordIndex,
  currentInput,
  isMismatch,
  correctWordsCount,
  incorrectWordsCount,
  timeLeft,
  totalTime,
  wordProgress,
  mode,
  wordModeType,
  modeLabel,
  testStatus,
  capsLockActive,
  liveStreak = 0,
  lessonMistakes = 0,
  maxMistakes = 3,
  caseSensitive = false,
  includePunctuation = false,
  activeStage,
  onInputChange,
  onSpaceSubmit,
  onBackspaceEmpty,
  onRestart,
}: TypeFlowTypingAreaProps) {
  const isTr = lang === 'tr';
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsScrollRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // ─── 1. Aggressive Persistent Auto-Focus ──────────────────────────────────
  const ensureFocus = useCallback(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
      console.debug('[TypeFlow:TypingArea] Aggressively refocused input');
    }
  }, []);

  // Auto-focus on mount, test status, and word transitions
  useEffect(() => {
    ensureFocus();
  }, [ensureFocus, testStatus, currentWordIndex]);

  // Global window listeners to intercept any stray keystrokes or clicks
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('select')
      ) {
        return;
      }
      ensureFocus();
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT')
      ) {
        return;
      }

      // If user typed a printable character or backspace, redirect to typing input immediately
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
        ensureFocus();
      }
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [ensureFocus]);

  // ─── 2. Smooth Line Scrolling ──────────────────────────────────────────────
  const updateLineScroll = useCallback(() => {
    if (!wordsScrollRef.current || !activeWordRef.current) return;

    const wordEl = activeWordRef.current;
    const parent = wordsScrollRef.current;

    const wordOffsetTop = wordEl.offsetTop;
    const singleLineHeight = wordEl.offsetHeight || 44;

    // When the word is on the 2nd line or below, scroll parent smoothly
    if (wordOffsetTop > singleLineHeight * 1.2) {
      const targetScroll = wordOffsetTop - singleLineHeight * 0.4;
      parent.style.transform = `translateY(-${targetScroll}px)`;
    } else {
      parent.style.transform = 'translateY(0px)';
    }
  }, []);

  useEffect(() => {
    updateLineScroll();
  }, [currentWordIndex, updateLineScroll]);

  // ─── 3. KeyDown Handling (Shortcuts, Space, Backspace) ───────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Quick restart shortcuts: Esc or Tab
    if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      console.debug('[TypeFlow:TypingArea] Restart triggered via shortcut:', e.key);
      onRestart();
      return;
    }

    // Spacebar: Submit current word
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (currentInput.trim().length > 0) {
        onSpaceSubmit();
      }
      return;
    }

    // Backspace when input is already empty: Step back to previous word
    if (e.key === 'Backspace' && currentInput.length === 0 && currentWordIndex > 0) {
      e.preventDefault();
      onBackspaceEmpty();
      return;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="tf-stage-container"
      onClick={ensureFocus}
      role="region"
      aria-label="Speed typing interface"
    >
      {/* 1. Cockpit Header Bar */}
      <div className="tf-cockpit-bar">
        <div className="tf-cockpit-left">
          <span className="tf-cockpit-mode-tag">
            {(modeLabel || 'TYPING').toUpperCase()}
          </span>

          {/* Dynamic Live Combo Multiplier Streak Badge */}
          {liveStreak >= 5 && (
            <div
              className={`tf-live-combo-badge ${
                liveStreak >= 25 ? 'combo-god' : liveStreak >= 15 ? 'combo-fire' : 'combo-heat'
              }`}
            >
              <span className="tf-combo-fire">🔥</span>
              <span className="tf-combo-count">{liveStreak}x</span>
              <span className="tf-combo-text">
                {liveStreak >= 25
                  ? (isTr ? 'DAKTİLO CANAVARI!' : 'MONSTER!')
                  : liveStreak >= 15
                  ? (isTr ? 'ALEV ALDIN!' : 'ON FIRE!')
                  : (isTr ? 'KOMBO!' : 'COMBO!')}
              </span>
            </div>
          )}

          {/* 3 Mistake Heart Limit for Academy Lessons */}
          {mode === 'lesson' && (
            <div
              className="tf-lesson-mistake-hearts"
              title={isTr ? `Kalan Hata Hakkı: ${Math.max(0, maxMistakes - lessonMistakes)}/${maxMistakes}` : `Remaining mistake tolerance: ${Math.max(0, maxMistakes - lessonMistakes)}/${maxMistakes}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: lessonMistakes >= maxMistakes - 1 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${lessonMistakes >= maxMistakes - 1 ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                padding: '0.25rem 0.6rem',
                borderRadius: '999px',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: lessonMistakes >= maxMistakes - 1 ? '#ef4444' : 'var(--tf-text-secondary)', fontFamily: 'var(--tf-font-mono)' }}>
                {isTr ? 'HATA:' : 'MISTAKES:'}
              </span>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: maxMistakes }).map((_, idx) => {
                  const isAlive = idx < maxMistakes - lessonMistakes;
                  return (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.95rem',
                        transition: 'transform 0.2s',
                        filter: isAlive ? 'none' : 'grayscale(1)',
                        opacity: isAlive ? 1 : 0.3,
                        transform: !isAlive ? 'scale(0.85)' : 'none',
                      }}
                    >
                      {isAlive ? '❤️' : '🤍'}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="tf-cockpit-right">
          {/* Live Correct / Incorrect Word Badges */}
          <div className="tf-cockpit-scores" title={isTr ? "Doğru ve Hatalı Kelimeler" : "Correct & Incorrect Words"}>
            <span className="tf-score-correct">✓ {correctWordsCount}</span>
            <span className="tf-score-incorrect">✗ {incorrectWordsCount}</span>
          </div>

          {/* Quick Restart Button */}
          <button
            className="tf-cockpit-restart-btn tf-btn-pushable"
            onClick={onRestart}
            title={isTr ? "Yeniden Başlat (Tab / Esc)" : "Restart (Tab / Esc)"}
            aria-label="Restart"
          >
            ⇄
          </button>

          {/* Prominent Countdown Timer / Progress Badge */}
          <div
            className={`tf-cockpit-timer ${testStatus === 'running' ? 'running' : ''}`}
            title={mode === 'words' && wordModeType === 'time' ? (isTr ? "Kalan Süre" : "Time Remaining") : (isTr ? "İlerleme" : "Progress")}
          >
            <span className="tf-timer-icon">⏱</span>
            <span className="tf-timer-val">
              {mode === 'words' && wordModeType === 'time'
                ? formatTime(timeLeft)
                : wordProgress}
            </span>
          </div>
        </div>
      </div>

      {/* Optional Stage Progress Indicator for Lessons */}
      {activeStage && (
        <div className="tf-stage-progress-card">
          <div className="tf-stage-progress-header">
            <span className="tf-stage-step-badge">
              {isTr ? `Aşama ${activeStage.current}/${activeStage.total}` : `Stage ${activeStage.current}/${activeStage.total}`}
            </span>
            <span className="tf-stage-step-title">{activeStage.title}</span>
            <span style={{ color: '#10b981', fontWeight: 700, fontFamily: 'var(--tf-font-mono)', fontSize: '0.78rem' }}>
              🎯 {activeStage.minWpm} WPM / %{activeStage.minAccuracy}
            </span>
          </div>
          <div className="tf-stage-progress-track">
            <div
              className="tf-stage-progress-fill"
              style={{ width: `${(activeStage.current / activeStage.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 2. Upper Reading Card (Word Display Box) */}
      <div className="tf-reading-card">
        <div ref={wordsScrollRef} className="tf-words-scroll">
          {words.map((word, wIdx) => {
            const isCurrent = wIdx === currentWordIndex;
            const isPast = wIdx < currentWordIndex;

            let wordClass = 'tf-card-word';
            if (isCurrent) {
              wordClass += ' active-word-pill';
            } else if (isPast) {
              wordClass += word.isCorrect ? ' word-correct' : ' word-incorrect';
            } else {
              wordClass += ' word-upcoming';
            }

            return (
              <span
                key={wIdx}
                ref={isCurrent ? activeWordRef : null}
                className={wordClass}
              >
                {word.original}
              </span>
            );
          })}
        </div>
      </div>

      {/* 3. Dedicated Typing Input Field */}
      <div className="tf-input-section">
        {/* Caps Lock Warning */}
        {capsLockActive && (
          <div className="tf-caps-indicator">
            <span>⇪</span>
            <span>{isTr ? 'CAPS LOCK AÇIK' : 'CAPS LOCK IS ACTIVE'}</span>
          </div>
        )}

        <div className="tf-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className={`tf-typing-input ${isMismatch ? 'has-mismatch' : ''}`}
            value={currentInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              testStatus === 'idle'
                ? (isTr ? 'Buraya yazmaya başlayın...' : 'Start typing here...')
                : ''
            }
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            tabIndex={0}
            autoFocus
          />

          {/* Quick Restart Hint Button */}
          <button
            className="tf-input-reset-btn tf-btn-pushable"
            onClick={onRestart}
            title={isTr ? "Sıfırla" : "Reset"}
          >
            ↺
          </button>
        </div>

        {/* Keyboard Hints */}
        <div className="tf-input-footer-hints">
          <span><kbd className="tf-kbd">Space</kbd> {isTr ? 'Sonraki Kelime' : 'Next Word'}</span>
          <span className="tf-hint-dot">•</span>
          <span><kbd className="tf-kbd">Tab</kbd> / <kbd className="tf-kbd">Esc</kbd> {isTr ? 'Yeniden Başlat' : 'Restart'}</span>
        </div>
      </div>
    </div>
  );
}
