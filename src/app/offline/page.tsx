/**
 * TIYATROTIST — Offline Fallback Page
 * Displayed by Service Worker when internet connection is lost.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Locale, getDictionary } from '@/dictionaries';

export default function OfflinePage() {
  const [lang, setLang] = useState<Locale>('tr');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred_lang') as Locale | null;
      if (stored === 'en' || stored === 'tr') {
        setLang(stored);
      } else if (document.cookie.includes('preferred_lang=en')) {
        setLang('en');
      }
    }
  }, []);

  const dict = getDictionary(lang);
  const o = dict.offline;

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const launchDotBreaker = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-dot-breaker'));
    }
  };

  const launchTerminal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-tiyatrotist-terminal'));
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          padding: '2.5rem 2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: 'rgba(255, 255, 255, 0.4)',
            display: 'block',
            marginBottom: '1rem',
          }}
        >
          {o.tag}
        </span>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 600,
            margin: '0 0 1rem 0',
            letterSpacing: '-0.02em',
          }}
        >
          {o.title}
        </h1>

        <p
          style={{
            fontSize: '0.85rem',
            lineHeight: 1.7,
            color: 'rgba(255, 255, 255, 0.6)',
            margin: '0 0 2rem 0',
          }}
        >
          {o.subtitle}
        </p>

        {/* Offline Interactive Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '2rem',
          }}
        >
          <button
            type="button"
            onClick={launchTerminal}
            style={{
              padding: '0.65rem 1.25rem',
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            {o.cliBtn}
          </button>

          <button
            type="button"
            onClick={launchDotBreaker}
            style={{
              padding: '0.65rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            {o.gameBtn}
          </button>
        </div>

        {/* Retry link */}
        <button
          type="button"
          onClick={handleReload}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.45)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            textDecoration: 'underline',
            letterSpacing: '0.05em',
          }}
        >
          {o.retryBtn}
        </button>
      </div>
    </main>
  );
}
