/**
 * TYPEFLOW — Official Google AdSense Responsive Unit Component
 * 
 * Embeds authentic Google AdSense unit (<ins className="adsbygoogle">)
 * with publisher client ID (ca-pub-7828284439187298) and slot ID.
 * Exclusively displays real Google Ads without any fake sponsors or simulated ads.
 * Automatically hidden for Super TypeFlow subscribers (isPremium: true).
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Crown, Info, Clock, CheckCircle2, Sparkles, Battery, Gem } from 'lucide-react';
import { Locale } from '@/dictionaries';
import { UserProfile } from './types';
import { GOOGLE_ADSENSE_CONFIG, getActiveAdSenseClientId, isAdSenseEnabled } from '@/config/ads';

interface TypeFlowGoogleAdProps {
  lang: Locale;
  profile: UserProfile;
  slot?: string;
  onRewardClaim?: (energyAmount: number, gemAmount: number) => void;
  onOpenSuperModal?: () => void;
}

export const TypeFlowGoogleAd: React.FC<TypeFlowGoogleAdProps> = ({
  lang,
  profile,
  slot,
  onRewardClaim,
  onOpenSuperModal,
}) => {
  const isTr = lang === 'tr';
  const [adSensePushed, setAdSensePushed] = useState(false);
  const [isRewardedModalOpen, setIsRewardedModalOpen] = useState(false);

  const activeClientId = getActiveAdSenseClientId();
  const activeSlotId = slot || GOOGLE_ADSENSE_CONFIG.slots.banner;
  const isEnabled = isAdSenseEnabled();

  // Push AdSense slot when mounted
  useEffect(() => {
    if (profile.isPremium || !isEnabled) return;

    try {
      if (typeof window !== 'undefined') {
        // @ts-expect-error Google adsbygoogle script injects this array
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdSensePushed(true);
        console.debug('[TypeFlow:GoogleAd] Real AdSense unit pushed. Slot:', activeSlotId, 'Client:', activeClientId);
      }
    } catch (err) {
      console.debug('[TypeFlow:GoogleAd] AdSense push notice:', err);
    }
  }, [profile.isPremium, isEnabled, activeSlotId, activeClientId]);

  // Hidden for Super TypeFlow subscribers
  if (profile.isPremium) {
    return null;
  }

  return (
    <>
      <div className="tf-google-ad-container" role="region" aria-label="Google Advertisement">
        {/* Top Meta Bar */}
        <div className="tf-google-ad-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <div className="tf-google-ad-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.72rem' }}>
              {isTr ? 'Google Reklamları' : 'Ads by Google'}
            </span>
            <span
              className="tf-adchoices-icon"
              title={isTr ? 'Reklam Tercihleri (AdChoices)' : 'AdChoices'}
              onClick={() => window.open('https://www.google.com/ads/preferences/', '_blank')}
              style={{ cursor: 'pointer', color: '#38bdf8', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center' }}
            >
              <Info size={12} />
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--tf-text-muted)', fontFamily: 'var(--tf-font-mono)', opacity: 0.65 }}>
              // {activeClientId}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Crown size={13} />
                <span>{isTr ? 'Reklamsız Kullan (Super)' : 'Remove Ads'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Real Google AdSense Display Slot */}
        {isEnabled && (
          <div
            className="tf-adsense-ins-wrap"
            style={{
              minHeight: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '8px',
              border: '1px dashed rgba(255, 255, 255, 0.12)',
              overflow: 'hidden',
              position: 'relative',
              padding: '0.5rem',
            }}
          >
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: '90px', textAlign: 'center', position: 'relative', zIndex: 1 }}
              data-ad-client={activeClientId}
              data-ad-slot={activeSlotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />

            {/* Clean Real AdSense Frame Placeholder (active until Google crawler fills ad iframe) */}
            <div
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 0,
                textAlign: 'center',
                padding: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', color: '#60a5fa', fontFamily: 'var(--tf-font-mono)' }}>
                  GOOGLE ADSENSE
                </span>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'var(--tf-font-mono)' }}>
                  [SLOT: {activeSlotId}]
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--tf-font-mono)' }}>
                {isTr
                  ? 'Gerçek Google reklamları onay süreci tamamlandığında bu alanda otomatik olarak yayınlanacaktır.'
                  : 'Official Google Ads will render automatically here upon domain approval.'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Google AdSense Rewarded Video Ad Modal */}
      {isRewardedModalOpen && (
        <GoogleRewardedAdModal
          lang={lang}
          activeClientId={activeClientId}
          activeSlotId={GOOGLE_ADSENSE_CONFIG.slots.rewarded}
          onClaim={() => {
            if (onRewardClaim) {
              onRewardClaim(2, 15);
            }
            setIsRewardedModalOpen(false);
          }}
          onClose={() => setIsRewardedModalOpen(false)}
        />
      )}
    </>
  );
};

interface GoogleRewardedAdModalProps {
  lang: Locale;
  activeClientId: string;
  activeSlotId: string;
  onClaim: () => void;
  onClose: () => void;
}

function GoogleRewardedAdModal({
  lang,
  activeClientId,
  activeSlotId,
  onClaim,
  onClose,
}: GoogleRewardedAdModalProps) {
  const isTr = lang === 'tr';
  const [countdown, setCountdown] = useState(5);
  const [isRewardReady, setIsRewardReady] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // @ts-expect-error Google adsbygoogle script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {}

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRewardReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);
    onClaim();
  };

  return (
    <div
      className="tf-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="tf-modal-card"
        style={{
          background: '#09090b',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '560px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', background: '#3b82f6', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 800, fontFamily: 'var(--tf-font-mono)' }}>
              GOOGLE REKLAMI
            </span>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'var(--tf-font-mono)' }}>
              {activeClientId}
            </span>
          </div>

          <div style={{ fontFamily: 'var(--tf-font-mono)', fontSize: '0.8rem', fontWeight: 800, color: countdown > 0 ? '#f59e0b' : '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {countdown > 0 ? (
              <>
                <Clock size={14} />
                <span>{countdown}s</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                <span>{isTr ? 'TAMAMLANDI' : 'COMPLETED'}</span>
              </>
            )}
          </div>
        </div>

        {/* Real Google AdSense Slot */}
        <div
          style={{
            minHeight: '200px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '180px', textAlign: 'center', zIndex: 1 }}
            data-ad-client={activeClientId}
            data-ad-slot={activeSlotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />

          <div style={{ position: 'absolute', zIndex: 0, textAlign: 'center', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: '#38bdf8' }}>
              <Sparkles size={32} />
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.25rem' }}>
              {isTr ? 'Google Ödüllü Reklam Alanı' : 'Google Rewarded Ad Space'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--tf-font-mono)' }}>
              Slot ID: {activeSlotId}
            </div>
          </div>
        </div>

        {/* Reward Status & Claim Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isRewardReady ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${isRewardReady ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
            borderRadius: '10px',
            padding: '0.85rem 1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: isRewardReady ? '#10b981' : '#38bdf8', display: 'flex' }}>
              {isRewardReady ? <Sparkles size={22} /> : <Battery size={22} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isRewardReady ? '#10b981' : '#fff' }}>
                {isRewardReady
                  ? (isTr ? 'Ödülünüz Hazır!' : 'Reward Ready!')
                  : (isTr ? 'Ödül İçin Bekleyin' : 'Please wait for reward')}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>+2 Odak Enerjisi & +15 Elmas</span>
              </div>
            </div>
          </div>

          {isRewardReady ? (
            <button
              type="button"
              className="tf-btn-pushable"
              onClick={handleClaim}
              disabled={rewardClaimed}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontFamily: 'var(--tf-font-mono)',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              {rewardClaimed ? (isTr ? '✓ Eklendi' : '✓ Added') : (isTr ? 'Ödülü Al' : 'Claim')}
            </button>
          ) : (
            <button
              type="button"
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
              {isTr ? 'Kapat' : 'Close'} ({countdown}s)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
