/**
 * TYPEFLOW — Interactive Google AdSense Banner & Rewarded Video Unit Component
 * Displays authentic Google Ads / AdSense-styled responsive banner unit,
 * and launches a genuine interactive 5-second Rewarded Video Ad player to recharge
 * Focus Energy (🔋) & earn Gems (💎).
 * Automatically hidden if user is subscribed to Super TypeFlow (isPremium: true).
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Locale } from '@/dictionaries';
import { UserProfile } from './types';

interface TypeFlowGoogleAdProps {
  lang: Locale;
  profile: UserProfile;
  slot?: string;
  onRewardClaim?: (energyAmount: number, gemAmount: number) => void;
  onOpenSuperModal?: () => void;
}

interface AdItem {
  id: string;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  sponsor: string;
  ctaTr: string;
  ctaEn: string;
  icon: string;
  url: string;
  videoBadgeTr: string;
  videoBadgeEn: string;
}

const GOOGLE_AD_ITEMS: AdItem[] = [
  {
    id: 'keyboards',
    titleTr: 'Keychron Q Pro Mekanik Klavye — Özel İndirim',
    titleEn: 'Keychron Q Pro Wireless Custom Mechanical Keyboard',
    descTr: 'Çift contalı montaj ve CNC alüminyum gövde ile daktilo yazım hızını ikiye katla.',
    descEn: 'Double-gasket mount & CNC aluminum frame engineered for ultimate typing flow.',
    sponsor: 'keychron.com',
    ctaTr: 'İncele',
    ctaEn: 'Visit Site',
    icon: '⌨️',
    url: 'https://keychron.com',
    videoBadgeTr: 'SPONSOR TANITIMI // KEYCHRON CUSTOM ACOUSTICS',
    videoBadgeEn: 'SPONSOR SPOTLIGHT // KEYCHRON CUSTOM ACOUSTICS',
  },
  {
    id: 'theatre',
    titleTr: 'Tiyatrotist Sahne Festivali — Sezon Biletleri',
    titleEn: 'Tiyatrotist Theatre Festival — Season Passes',
    descTr: 'Klasik tiradlar, modern sahneler ve canlı performanslar için yerini ayırt.',
    descEn: 'Reserve front-row seats for classic monologues and contemporary stage productions.',
    sponsor: 'tiyatrotist.com',
    ctaTr: 'Bilet Al',
    ctaEn: 'Get Tickets',
    icon: '🎭',
    url: 'https://tiyatrotist.com',
    videoBadgeTr: 'SANAT SPONSORU // TİYATROTİST SEZON SAHNESİ',
    videoBadgeEn: 'ARTS SPONSOR // TIYATROTIST STAGE PERFORMANCES',
  },
  {
    id: 'cloud_ide',
    titleTr: 'Warp: Yeni Nesil Yapay Zeka Destekli Terminal',
    titleEn: 'Warp: The Modern AI-Powered Terminal for Devs',
    descTr: 'Geliştiriciler için süper hızlı Rust tabanlı terminal ve komut satırı zekası.',
    descEn: 'Blazing fast Rust-based terminal with inline AI autocomplete and workflows.',
    sponsor: 'warp.dev',
    ctaTr: 'Ücretsiz İndir',
    ctaEn: 'Download Free',
    icon: '🚀',
    url: 'https://warp.dev',
    videoBadgeTr: 'GELİŞTİRİCİ ARAÇLARI // WARP AI RUST TERMINAL',
    videoBadgeEn: 'DEV WORKFLOW // WARP AI RUST TERMINAL',
  },
];

export const TypeFlowGoogleAd: React.FC<TypeFlowGoogleAdProps> = ({
  lang,
  profile,
  onRewardClaim,
  onOpenSuperModal,
}) => {
  const isTr = lang === 'tr';
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isRewardReady, setIsRewardReady] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const ad = GOOGLE_AD_ITEMS[currentAdIndex] || GOOGLE_AD_ITEMS[0];

  // Hidden for Super TypeFlow subscribers
  if (profile.isPremium) {
    return null;
  }

  const handleOpenVideoAd = () => {
    setCountdown(5);
    setIsRewardReady(false);
    setRewardClaimed(false);
    setIsVideoOpen(true);
    console.debug('[TypeFlow:GoogleAd] Starting interactive rewarded video ad:', ad.id);
  };

  const handleNextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % GOOGLE_AD_ITEMS.length);
  };

  const handleClaimReward = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);
    console.debug('[TypeFlow:GoogleAd] Rewarded ad watched! Delivering +2 Energy & +15 Gems');
    if (onRewardClaim) {
      onRewardClaim(2, 15);
    }
    setTimeout(() => {
      setIsVideoOpen(false);
    }, 1200);
  };

  return (
    <>
      <div className="tf-google-ad-container" role="region" aria-label="Google Advertisement">
        {/* Top Meta Bar */}
        <div className="tf-google-ad-top">
          <div className="tf-google-ad-label">
            <span>{isTr ? 'Google Reklamları' : 'Ads by Google'}</span>
            <span
              className="tf-adchoices-icon"
              title={isTr ? 'Reklam Tercihleri' : 'AdChoices'}
              onClick={() => window.open('https://www.google.com/ads/preferences/', '_blank')}
            >
              ⓘ
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {onOpenSuperModal && (
              <button
                type="button"
                onClick={onOpenSuperModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#eab308',
                  cursor: 'pointer',
                  fontFamily: 'var(--tf-font-mono)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                }}
              >
                👑 {isTr ? 'Reklamsız Kullan' : 'Remove Ads'}
              </button>
            )}

            <button
              type="button"
              onClick={handleNextAd}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--tf-text-muted)',
                cursor: 'pointer',
                fontFamily: 'var(--tf-font-mono)',
                fontSize: '0.68rem',
              }}
              title={isTr ? 'Sonraki Reklam' : 'Next Ad'}
            >
              ↻
            </button>
          </div>
        </div>

        {/* Main Banner Content */}
        <div className="tf-google-ad-body">
          <div className="tf-google-ad-info">
            <div className="tf-google-ad-icon">{ad.icon}</div>
            <div className="tf-google-ad-texts">
              <h5>{isTr ? ad.titleTr : ad.titleEn}</h5>
              <p>{isTr ? ad.descTr : ad.descEn}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="tf-google-ad-cta tf-btn-pushable"
              onClick={() => window.open(ad.url, '_blank', 'noopener,noreferrer')}
            >
              {isTr ? ad.ctaTr : ad.ctaEn} ↗
            </button>

            {onRewardClaim && (
              <button
                type="button"
                className="tf-btn-pushable"
                onClick={handleOpenVideoAd}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#fff',
                  border: '1px solid #10b981',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '8px',
                  fontFamily: 'var(--tf-font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                ⚡ {isTr ? 'Reklamı İzle (+2 🔋 & +15 💎)' : 'Watch Ad (+2 🔋 & +15 💎)'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive 5-Second Rewarded Video Ad Modal */}
      {isVideoOpen && (
        <RewardedAdVideoModal
          lang={lang}
          ad={ad}
          countdown={countdown}
          isRewardReady={isRewardReady}
          rewardClaimed={rewardClaimed}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted((m) => !m)}
          onTick={(next) => {
            setCountdown(next);
            if (next <= 0) {
              setIsRewardReady(true);
            }
          }}
          onClaim={handleClaimReward}
          onClose={() => {
            if (isRewardReady && !rewardClaimed) {
              handleClaimReward();
            } else {
              setIsVideoOpen(false);
            }
          }}
        />
      )}
    </>
  );
};

interface RewardedModalProps {
  lang: Locale;
  ad: AdItem;
  countdown: number;
  isRewardReady: boolean;
  rewardClaimed: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onTick: (next: number) => void;
  onClaim: () => void;
  onClose: () => void;
}

function RewardedAdVideoModal({
  lang,
  ad,
  countdown,
  isRewardReady,
  rewardClaimed,
  isMuted,
  onToggleMute,
  onTick,
  onClaim,
  onClose,
}: RewardedModalProps) {
  const isTr = lang === 'tr';

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      onTick(countdown - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, onTick]);

  const progressPercent = Math.min(100, Math.max(0, Math.round(((5 - countdown) / 5) * 100)));

  return (
    <div
      className="tf-modal-overlay tf-ad-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="tf-modal-card"
        style={{
          maxWidth: '580px',
          width: '100%',
          background: '#090d16',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '20px',
          padding: '1.75rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(16, 185, 129, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '3px 9px',
                borderRadius: '9999px',
                fontFamily: 'var(--tf-font-mono)',
                fontSize: '0.72rem',
                fontWeight: 800,
              }}
            >
              ▶ REWARDED AD
            </span>
            <span style={{ fontFamily: 'var(--tf-font-mono)', fontSize: '0.8rem', color: 'var(--tf-text-secondary)' }}>
              {ad.sponsor}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={onToggleMute}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--tf-border)',
                color: '#fff',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '0.82rem',
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            {isRewardReady ? (
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: '#10b981',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--tf-font-mono)',
                }}
              >
                ✕ {isTr ? 'Kapat' : 'Close'}
              </button>
            ) : (
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontFamily: 'var(--tf-font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#f59e0b',
                }}
              >
                ⏱️ {countdown}s
              </span>
            )}
          </div>
        </div>

        {/* Video Player Box with Animated Playback */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(180deg, #0f172a, #020617)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            height: '240px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '1.5rem',
          }}
        >
          {/* Animated Video Frame Elements */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              fontFamily: 'var(--tf-font-mono)',
              fontSize: '0.65rem',
              color: '#38bdf8',
              letterSpacing: '0.08em',
              fontWeight: 700,
            }}
          >
            {isTr ? ad.videoBadgeTr : ad.videoBadgeEn}
          </div>

          <div
            style={{
              fontSize: '3.8rem',
              marginBottom: '0.5rem',
              filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.5))',
            }}
          >
            {ad.icon}
          </div>

          <h4
            style={{
              margin: '0 0 0.4rem 0',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#fff',
            }}
          >
            {isTr ? ad.titleTr : ad.titleEn}
          </h4>

          <p
            style={{
              margin: 0,
              fontSize: '0.86rem',
              color: '#94a3b8',
              maxWidth: '420px',
              lineHeight: 1.45,
            }}
          >
            {isTr ? ad.descTr : ad.descEn}
          </p>

          {/* Video Bottom Progress Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '5px',
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

        {/* Reward Callout Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isRewardReady ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${isRewardReady ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '12px',
            padding: '0.9rem 1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.6rem' }}>{isRewardReady ? '🎉' : '🔋'}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: isRewardReady ? '#10b981' : '#fff' }}>
                {isRewardReady
                  ? (isTr ? 'Tebrikler! Reklam Tamamlandı' : 'Awesome! Ad Completed')
                  : (isTr ? 'Ödül İçin Reklamı İzleyin' : 'Watch to Unlock Reward')}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--tf-text-secondary)' }}>
                {isRewardReady
                  ? (isTr ? '+2 Odak Enerjisi (🔋) ve +15 Elmas (💎) hazır!' : '+2 Focus Energy (🔋) & +15 Gems (💎) ready!')
                  : (isTr ? `${countdown} saniye sonra ödül hesabınıza tanımlanacak.` : `Reward will unlock in ${countdown} seconds.`)}
              </div>
            </div>
          </div>

          {isRewardReady ? (
            <button
              type="button"
              className="tf-btn-pushable"
              onClick={onClaim}
              disabled={rewardClaimed}
              style={{
                background: rewardClaimed ? 'rgba(16, 185, 129, 0.3)' : 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                padding: '0.65rem 1.15rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontFamily: 'var(--tf-font-mono)',
                fontSize: '0.85rem',
                cursor: rewardClaimed ? 'default' : 'pointer',
              }}
            >
              {rewardClaimed
                ? (isTr ? '✓ Yüklendi' : '✓ Claimed')
                : (isTr ? 'Ödülü Al' : 'Claim Reward')}
            </button>
          ) : (
            <button
              type="button"
              disabled
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#64748b',
                border: 'none',
                padding: '0.65rem 1.15rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontFamily: 'var(--tf-font-mono)',
                fontSize: '0.8rem',
                cursor: 'not-allowed',
              }}
            >
              {countdown}s...
            </button>
          )}
        </div>

        {/* Action Link to Sponsor */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => window.open(ad.url, '_blank', 'noopener,noreferrer')}
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              fontFamily: 'var(--tf-font-mono)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isTr ? `${ad.sponsor} Sayfasını Ziyaret Et` : `Visit ${ad.sponsor}`} ↗
          </button>

          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            {isTr ? 'Tiyatrotist Güvenli Sponsor Ağı' : 'Tiyatrotist Verified Sponsor Network'}
          </span>
        </div>
      </div>
    </div>
  );
}
