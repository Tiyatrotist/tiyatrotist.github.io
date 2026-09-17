/**
 * TIYATROTIST — PWA Service Worker Registration & Install Prompt
 *
 * Registers public/sw.js and captures beforeinstallprompt
 * to present an unobtrusive monochrome install prompt.
 */

'use client';

import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker in supported browsers
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.debug('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.debug('[PWA] Service Worker registration failed:', err);
        });
    }

    // 2. Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable || dismissed) return null;

  return (
    <div
      className="pwa-install-banner"
      style={{
        position: 'fixed',
        bottom: '4.8rem',
        right: '1.5rem',
        zIndex: 9998,
        background: 'rgba(10, 10, 10, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '6px',
        padding: '0.65rem 0.95rem',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
    >
      <span style={{ fontSize: '0.65rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.3)', padding: '0.15rem 0.35rem', borderRadius: '3px' }}>APP</span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff' }}>
          TIYATROTIST App
        </span>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.45)' }}>
          Cihazınıza uygulama olarak yükleyin
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.5rem' }}>
        <button
          type="button"
          onClick={handleInstall}
          style={{
            background: '#ffffff',
            color: '#000000',
            border: 'none',
            borderRadius: '3px',
            padding: '0.3rem 0.6rem',
            fontSize: '0.68rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          YÜKLE
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            padding: '0.2rem 0.4rem',
          }}
          aria-label="Kapat"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
