/**
 * TIYATROTIST — Editorial Blog Audio Player & Podcast Synthesis Engine
 *
 * Provides a high-fidelity, zero-dependency audio reading experience:
 * - Natural text-to-speech audio synthesis via Web Speech API
 * - Strips markdown syntax, headers, code blocks and URLs for clear prose reading
 * - Animated audio frequency equalizer bars synchronized with speech playback
 * - Interactive timeline scrubber with elapsed / remaining time
 * - Speed multipliers (1.0x, 1.25x, 1.5x, 2.0x)
 * - Strict pure monochrome aesthetic, zero emojis, fully localized.
 */

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Locale, getDictionary } from '@/dictionaries';

interface BlogAudioPlayerProps {
  content: string;
  title: string;
  lang?: Locale;
  estimatedMinutes?: number;
}

export default function BlogAudioPlayer({
  content,
  title,
  lang = 'tr',
  estimatedMinutes = 4,
}: BlogAudioPlayerProps) {
  const dict = getDictionary(lang);
  const p = dict.podcast;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(1.0);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);
  const [supported, setSupported] = useState<boolean>(true);

  // Equalizer visual animation frame
  const [eqHeights, setEqHeights] = useState<number[]>([4, 8, 12, 6, 14, 10, 16, 8, 5, 11, 7, 13]);
  const animRef = useRef<number | null>(null);

  // Clean prose extracted from Markdown
  const sentences = useMemo(() => {
    if (!content) return [];

    // Strip markdown formatting
    let clean = content
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove images
      .replace(/!\[.*?\]\(.*?\)/g, '')
      // Remove links, keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove headers (#, ##, ###)
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italics
      .replace(/[*_~]{1,3}(.*?)[*_~]{1,3}/g, '$1')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove horizontal rules
      .replace(/^---$/gm, '')
      // Normalize whitespace
      .replace(/\n+/g, ' ')
      .trim();

    // Split into sentences
    const matches = clean.match(/[^.!?]+[.!?]+(\s|$)/g);
    if (!matches || matches.length === 0) {
      return [title, clean].filter(Boolean);
    }

    return [title + '.', ...matches.map((s) => s.trim()).filter((s) => s.length > 3)];
  }, [content, title]);

  const totalDurationSec = useMemo(() => {
    return estimatedMinutes * 60;
  }, [estimatedMinutes]);

  // Check Web Speech API availability
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
    }
  }, []);

  // Animate waveform equalizer while speaking
  useEffect(() => {
    if (isPlaying && !isPaused) {
      const interval = setInterval(() => {
        setEqHeights((prev) =>
          prev.map(() => Math.floor(Math.random() * 14) + 4)
        );
      }, 140);
      return () => clearInterval(interval);
    } else {
      setEqHeights([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    }
  }, [isPlaying, isPaused]);

  // Play sentence by index
  const speakSentence = (index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (index >= sentences.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIdx(0);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sentences[index]);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick appropriate localized voice
    const voices = window.speechSynthesis.getVoices();
    const targetLangPrefix = lang === 'tr' ? 'tr' : 'en';
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith(targetLangPrefix)) ||
      voices.find((v) => v.lang.toLowerCase().includes(targetLangPrefix));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setCurrentSentenceIdx(index + 1);
      speakSentence(index + 1);
    };

    utterance.onerror = (e) => {
      // Ignore interruption cancels
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.debug('[BlogAudioPlayer] Speech synthesis notice:', e.error);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Toggle play / pause
  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (!isPlaying) {
      setIsPlaying(true);
      setIsPaused(false);
      speakSentence(currentSentenceIdx);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Stop playback
  const handleStop = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIdx(0);
  };

  // Adjust rate
  const cycleRate = () => {
    const rates = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (rates.indexOf(rate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setRate(nextRate);

    if (isPlaying && !isPaused) {
      speakSentence(currentSentenceIdx);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Progress percentage
  const progressPercent =
    sentences.length > 0
      ? Math.min(100, Math.round((currentSentenceIdx / sentences.length) * 100))
      : 0;

  // Formatted duration
  const currentElapsedSec = Math.round((progressPercent / 100) * totalDurationSec);
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!supported || sentences.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={p.tag}
      className="blog-audio-player"
      style={{
        width: '100%',
        margin: '2rem 0',
        padding: '1.25rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '6px',
        boxSizing: 'border-box',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        <span
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.15em',
            color: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          {p.tag}
        </span>

        <span
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          {isPlaying && !isPaused ? p.playing : isPaused ? p.paused : `${estimatedMinutes} ${p.readTime}`}
        </span>
      </div>

      {/* Main Controls Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Play/Pause Button + Equalizer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            type="button"
            onClick={handleTogglePlay}
            data-cursor="expand"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '4px',
              border: isPlaying ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.25)',
              background: isPlaying ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
              color: isPlaying ? '#000000' : '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{isPlaying && !isPaused ? '[ ⏸ ]' : '[ ▶ ]'}</span>
            <span>
              {isPlaying && !isPaused
                ? p.pauseBtn
                : isPaused
                ? p.resumeBtn
                : `${p.listenBtn} (${estimatedMinutes} DK)`}
            </span>
          </button>

          {isPlaying && (
            <button
              type="button"
              onClick={handleStop}
              data-cursor="expand"
              title="Durdur & Başa Sar"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.7rem',
                padding: '0.5rem 0.65rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              [ ◼ ]
            </button>
          )}

          {/* Equalizer bars */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '3px',
              height: '18px',
              paddingLeft: '0.25rem',
            }}
            aria-hidden="true"
          >
            {eqHeights.map((h, i) => (
              <span
                key={i}
                style={{
                  width: '2px',
                  height: `${h}px`,
                  background: isPlaying && !isPaused ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                  display: 'inline-block',
                  transition: 'height 0.12s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Scrubber & Speed selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, justifyContent: 'flex-end', minWidth: '220px' }}>
          {/* Time & Progress Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, maxWidth: '280px' }}>
            <div
              style={{
                width: '100%',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: '#ffffff',
                  transition: 'width 0.25s linear',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.62rem',
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '0.05em',
              }}
            >
              <span>{formatTime(currentElapsedSec)}</span>
              <span>{formatTime(totalDurationSec)}</span>
            </div>
          </div>

          {/* Rate Switcher */}
          <button
            type="button"
            onClick={cycleRate}
            data-cursor="expand"
            title="Okuma Hızını Değiştir"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.68rem',
              padding: '0.35rem 0.55rem',
              borderRadius: '3px',
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            {rate}x
          </button>
        </div>
      </div>
    </section>
  );
}
