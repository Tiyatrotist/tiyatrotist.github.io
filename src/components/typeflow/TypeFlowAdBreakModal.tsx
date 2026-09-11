'use client';

/**
 * TYPEFLOW — Sponsorlu Teknoloji Reklam Molası (Tech Ad Break) Modal
 * Shows tech sponsors (Keychron, Warp, Neon DB) to support free SaaS tier,
 * allows user to recharge +2 Focus Energy & +15 Gems or upgrade to Super TypeFlow to remove ads.
 */

import React, { useState, useEffect } from 'react';
import { TechAd } from './types';
import { Locale } from '@/dictionaries';

interface TypeFlowAdBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: TechAd;
  onClaimEnergyReward: () => void;
  onOpenSuperModal: () => void;
  lang: Locale;
}

export const TypeFlowAdBreakModal: React.FC<TypeFlowAdBreakModalProps> = ({
  isOpen,
  onClose,
  ad,
  onClaimEnergyReward,
  onOpenSuperModal,
  lang,
}) => {
  const isTr = lang === 'tr';
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(5);
      setHasClaimed(false);
      return;
    }

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

  const handleCtaClick = () => {
    console.debug('[TypeFlow:AdBreak] User clicked CTA:', ad.sponsor);
    window.open(ad.ctaUrl, '_blank', 'noopener,noreferrer');
    if (!hasClaimed) {
      setHasClaimed(true);
      onClaimEnergyReward();
    }
  };

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
      <div className="tf-modal-card tf-ad-modal-card" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Top Header Bar */}
        <div className="tf-ad-top-bar">
          <div className="tf-ad-badge-wrap">
            <span className="tf-ad-badge">{ad.badge}</span>
            <span className="tf-ad-sponsor-name">{ad.sponsor}</span>
          </div>

          <div className="tf-ad-timer-pill">
            {secondsLeft > 0 ? (
              <span style={{ color: '#f59e0b', fontWeight: 800 }}>⏱️ {secondsLeft}s</span>
            ) : (
              <button
                type="button"
                className="tf-ad-skip-btn tf-btn-pushable"
                onClick={handleClaimAndClose}
                style={{ background: '#10b981', color: '#000', fontWeight: 800, border: 'none' }}
              >
                ✓ {isTr ? 'Ödülü Al' : 'Claim'} ✕
              </button>
            )}
          </div>
        </div>

        {/* Sponsor Banner Card */}
        <div className="tf-ad-content-box" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="tf-ad-hero-icon">{ad.icon}</div>
          <h3 id="tf-ad-title" className="tf-ad-title">{ad.tagline}</h3>
          <p className="tf-ad-description">{ad.description}</p>

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
            background: secondsLeft === 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)',
            border: `1px solid ${secondsLeft === 0 ? '#10b981' : 'rgba(16, 185, 129, 0.3)'}`,
          }}
        >
          <span className="tf-ad-energy-icon">🔋</span>
          <span>
            {hasClaimed
              ? (isTr ? '🎉 +2 Odak Enerjisi ve +15 Elmas şarj edildi!' : '🎉 +2 Focus Energy & +15 Gems recharged!')
              : secondsLeft === 0
                ? (isTr ? '✓ Ödül hazır! Aşağıdan ödülünü al ve devam et.' : '✓ Reward ready! Claim below.')
                : (isTr ? `Sponsoru inceleyerek +2 Odak Enerjisi ve +15 Elmas kazan (${secondsLeft}s).` : `Earn +2 Focus Energy & +15 Gems by viewing sponsor (${secondsLeft}s).`)}
          </span>
        </div>

        {/* CTAs */}
        <div className="tf-ad-actions">
          {secondsLeft === 0 ? (
            <button
              type="button"
              className="tf-btn-primary tf-btn-pushable"
              onClick={handleClaimAndClose}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                padding: '0.85rem',
                fontSize: '0.92rem',
                fontWeight: 800,
                width: '100%',
              }}
            >
              🎉 {isTr ? 'Ödülü Al & Devam Et (+2 🔋 & +15 💎)' : 'Claim Reward & Continue (+2 🔋 & +15 💎)'}
            </button>
          ) : (
            <button
              type="button"
              className="tf-ad-cta-btn tf-btn-pushable"
              onClick={handleCtaClick}
            >
              {ad.ctaText} ↗
            </button>
          )}

          <button
            type="button"
            className="tf-ad-super-pitch-btn tf-btn-pushable"
            onClick={() => {
              onClose();
              onOpenSuperModal();
            }}
          >
            👑 {isTr ? 'Super\'a Geç (Tüm Reklamları Kaldır)' : 'Get Super (Remove All Ads)'}
          </button>
        </div>
      </div>
    </div>
  );
};
