'use client';

/**
 * TYPEFLOW — Official Google AdSense Rewarded Ad Break Modal
 * 
 * Displays authentic Google AdSense rewarded format unit to support free tier,
 * allowing user to recharge +2 Focus Energy & +15 Gems or upgrade to Super TypeFlow to remove ads.
 * Exclusively uses real Google AdSense scripts with ca-pub-7828284439187298.
 */

import React, { useState, useEffect } from 'react';
import { Locale } from '@/dictionaries';
import { GOOGLE_ADSENSE_CONFIG, getActiveAdSenseClientId } from '@/config/ads';

interface TypeFlowAdBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimEnergyReward: () => void;
  onOpenSuperModal: () => void;
  lang: Locale;
  ad?: any; // kept for backwards compatibility if passed from caller
}

export const TypeFlowAdBreakModal: React.FC<TypeFlowAdBreakModalProps> = ({
  isOpen,
  onClose,
  onClaimEnergyReward,
  onOpenSuperModal,
  lang,
}) => {
  const isTr = lang === 'tr';
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  const activeClientId = getActiveAdSenseClientId();
  const activeSlotId = GOOGLE_ADSENSE_CONFIG.slots.rewarded;

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(5);
      setHasClaimed(false);
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        // @ts-expect-error Google adsbygoogle script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {}

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaimAndClose = () => {
    if (!hasClaimed) {
      setHasClaimed(true);
      onClaimEnergyReward();
    }
    onClose();
  };

  const progressPercent = Math.min(100, Math.max(0, Math.round(((5 - secondsLeft) / 5) * 100)));

  return (
    <div
      className="tf-modal-overlay tf-ad-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tf-ad-title"
    >
      <div className="tf-modal-card tf-ad-modal-card" style={{ position: 'relative', overflow: 'hidden', maxWidth: '520px' }}>
        {/* Top Header Bar */}
        <div className="tf-ad-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="tf-ad-badge-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tf-ad-badge" style={{ background: '#3b82f6', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 800, fontFamily: 'var(--tf-font-mono)' }}>
              GOOGLE REKLAMI
            </span>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--tf-font-mono)' }}>
              {activeClientId}
            </span>
          </div>

          <div className="tf-ad-timer-pill" style={{ fontFamily: 'var(--tf-font-mono)' }}>
            {secondsLeft > 0 ? (
              <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.85rem' }}>⏱️ {secondsLeft}s</span>
            ) : (
              <button
                type="button"
                className="tf-ad-skip-btn tf-btn-pushable"
                onClick={handleClaimAndClose}
                style={{ background: '#10b981', color: '#000', fontWeight: 800, border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', cursor: 'pointer' }}
              >
                ✓ {isTr ? 'Ödülü Al' : 'Claim'} ✕
              </button>
            )}
          </div>
        </div>

        {/* Real Google AdSense Rewarded Container */}
        <div
          className="tf-ad-content-box"
          style={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: '160px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '120px', textAlign: 'center', zIndex: 1 }}
            data-ad-client={activeClientId}
            data-ad-slot={activeSlotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />

          <div style={{ position: 'absolute', zIndex: 0, pointerEvents: 'none' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>📢</div>
            <h3 id="tf-ad-title" style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#f1f5f9' }}>
              {isTr ? 'Google Ödüllü Reklamı' : 'Google Rewarded Ad'}
            </h3>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, fontFamily: 'var(--tf-font-mono)' }}>
              Slot: {activeSlotId} • {activeClientId}
            </p>
          </div>

          {/* 5-second progress bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                transition: 'width 1s linear',
              }}
            />
          </div>
        </div>

        {/* Reward Alert */}
        <div
          className="tf-ad-reward-callout"
          style={{
            marginTop: '1rem',
            background: secondsLeft === 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)',
            border: `1px solid ${secondsLeft === 0 ? '#10b981' : 'rgba(16, 185, 129, 0.3)'}`,
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.8rem',
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>🔋</span>
          <span>
            {hasClaimed
              ? (isTr ? '🎉 +2 Odak Enerjisi ve +15 Elmas hesabınıza tanımlandı!' : '🎉 +2 Focus Energy & +15 Gems recharged!')
              : secondsLeft === 0
                ? (isTr ? '✓ Tebrikler! Reklam tamamlandı, ödülünüzü alabilirsiniz.' : '✓ Reward ready! Claim below.')
                : (isTr ? `Reklamı izleyerek +2 Odak Enerjisi ve +15 Elmas kazanın (${secondsLeft}s).` : `Earn +2 Focus Energy & +15 Gems (${secondsLeft}s).`)}
          </span>
        </div>

        {/* CTAs */}
        <div className="tf-ad-actions" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {secondsLeft === 0 ? (
            <button
              type="button"
              className="tf-btn-primary tf-btn-pushable"
              onClick={handleClaimAndClose}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {isTr ? '✓ Ödülü Al ve Devam Et' : '✓ Claim Reward & Continue'}
            </button>
          ) : (
            <button
              type="button"
              className="tf-btn-ghost"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontFamily: 'var(--tf-font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              {isTr ? `Kapat (${secondsLeft}s)` : `Close (${secondsLeft}s)`}
            </button>
          )}

          <button
            type="button"
            className="tf-ad-super-link"
            onClick={onOpenSuperModal}
            style={{
              background: 'none',
              border: 'none',
              color: '#eab308',
              cursor: 'pointer',
              fontFamily: 'var(--tf-font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            👑 {isTr ? 'Super ile Reklamları Kaldır' : 'Remove Ads with Super'}
          </button>
        </div>
      </div>
    </div>
  );
};
