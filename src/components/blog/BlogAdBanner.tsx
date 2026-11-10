/**
 * TIYATROTIST — Official Blog AdSense Banner Component
 *
 * Seamlessly integrates Google AdSense into blog posts and blog listings
 * with pure monochrome aesthetic matching Tiyatrotist design guidelines.
 * Supports in-article, in-feed, and pre-footer variants.
 */

'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import { Locale } from '@/dictionaries';
import {
  getActiveAdSenseClientId,
  isBlogAdsEnabled,
  getBlogInArticleSlot,
  getBlogInFeedSlot,
  getBlogSkyscraperLeftSlot,
  getBlogSkyscraperRightSlot,
  GOOGLE_ADSENSE_CONFIG,
} from '@/config/ads';

interface BlogAdBannerProps {
  lang: Locale;
  variant?: 'in-article' | 'in-feed' | 'bottom' | 'skyscraper-left' | 'skyscraper-right' | 'skyscraper';
  slot?: string;
}

export default function BlogAdBanner({
  lang,
  variant = 'in-article',
  slot,
}: BlogAdBannerProps) {
  const isTr = lang === 'tr';
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const adPushedRef = useRef(false);

  const isSkyscraperLeft = variant === 'skyscraper-left';
  const isSkyscraperRight = variant === 'skyscraper-right';
  const isSkyscraper = isSkyscraperLeft || isSkyscraperRight || variant === 'skyscraper';

  const activeClientId = getActiveAdSenseClientId();
  const activeSlot =
    slot ||
    (variant === 'in-feed'
      ? getBlogInFeedSlot()
      : isSkyscraperLeft
      ? getBlogSkyscraperLeftSlot()
      : isSkyscraperRight
      ? getBlogSkyscraperRightSlot()
      : isSkyscraper
      ? getBlogSkyscraperLeftSlot()
      : getBlogInArticleSlot());
  const isEnabled = isBlogAdsEnabled();

  useEffect(() => {
    if (!isClient || !isEnabled || adPushedRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        // @ts-expect-error Google adsbygoogle script injects this array
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adPushedRef.current = true;
        console.debug(
          `[BlogAdBanner] AdSense unit pushed (${variant}). Slot:`,
          activeSlot,
          'Client:',
          activeClientId
        );
      }
    } catch (err) {
      console.debug('[BlogAdBanner] AdSense push notice:', err);
    }
  }, [isClient, isEnabled, activeSlot, activeClientId, variant]);

  if (!isClient || !isEnabled) {
    return null;
  }

  // Variant 0: SKYSCRAPER (rendered in left/right gutters on wide desktop screens)
  if (isSkyscraper) {
    const sideLabel = isSkyscraperRight
      ? (isTr ? 'SAĞ' : 'RIGHT')
      : isSkyscraperLeft
      ? (isTr ? 'SOL' : 'LEFT')
      : (isTr ? 'DİKEY' : 'VERTICAL');

    return (
      <aside
        className={`blog-ad-skyscraper ${isSkyscraperLeft ? 'blog-ad-skyscraper--left' : ''} ${isSkyscraperRight ? 'blog-ad-skyscraper--right' : ''}`}
        aria-label={isTr ? `Sponsorlu Dikey Reklam (${sideLabel})` : `Sponsored Skyscraper (${sideLabel})`}
        style={{
          width: '100%',
          maxWidth: '160px',
          padding: '0.85rem 0.5rem',
          background: 'rgba(255, 255, 255, 0.015)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Monospaced Meta Tag */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.35rem',
            marginBottom: '0.85rem',
            paddingBottom: '0.6rem',
            borderBottom: '1px dashed rgba(255, 255, 255, 0.08)',
          }}
        >
          <span
            style={{
              fontSize: '0.62rem',
              fontFamily: 'monospace',
              letterSpacing: '0.12em',
              color: 'rgba(255, 255, 255, 0.45)',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            [ {isTr ? `SPONSOR // ${sideLabel}` : `SPONSOR // ${sideLabel}`} ]
          </span>
          <a
            href="https://www.google.com/ads/preferences/"
            target="_blank"
            rel="noopener noreferrer"
            title="Google AdChoices"
            style={{
              fontSize: '0.58rem',
              fontFamily: 'monospace',
              color: 'rgba(255, 255, 255, 0.28)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
            }}
          >
            AdChoices ↗
          </a>
        </div>

        {/* Real AdSense Container */}
        <div
          style={{
            minHeight: '600px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <ins
            className="adsbygoogle"
            style={{
              display: 'inline-block',
              width: '100%',
              minWidth: '120px',
              maxWidth: '160px',
              minHeight: '600px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
            data-ad-client={activeClientId}
            data-ad-slot={activeSlot}
            data-ad-format="vertical"
            data-full-width-responsive="false"
          />

          {/* Fallback frame while ad renders or in test mode */}
          {GOOGLE_ADSENSE_CONFIG.testMode && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px dashed rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                zIndex: 0,
                pointerEvents: 'none',
                gap: '0.6rem',
                padding: '1rem 0.25rem',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '0.65rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.12em',
                  color: 'rgba(255, 255, 255, 0.55)',
                  lineHeight: 1.4,
                }}
              >
                ADSENSE SKYSCRAPER
              </span>
              <div
                style={{
                  fontSize: '0.58rem',
                  fontFamily: 'monospace',
                  color: 'rgba(255, 255, 255, 0.35)',
                  lineHeight: 1.5,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '2px',
                }}
              >
                <div>160 × 600</div>
                <div>TOWER</div>
              </div>
              <span
                style={{
                  fontSize: '0.55rem',
                  fontFamily: 'monospace',
                  color: 'rgba(255, 255, 255, 0.28)',
                  wordBreak: 'break-all',
                }}
              >
                Slot: {activeSlot}
              </span>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // Variant 1: IN-FEED (rendered inside blog post listing grid)
  if (variant === 'in-feed') {
    return (
      <aside
        className="blog-ad-in-feed"
        aria-label={isTr ? 'Sponsorlu İçerik' : 'Sponsored Content'}
        style={{
          padding: '1.75rem',
          background: 'rgba(255, 255, 255, 0.015)',
          border: '1px dashed rgba(255, 255, 255, 0.12)',
          borderRadius: '6px',
          position: 'relative',
          overflow: 'hidden',
          margin: '0.5rem 0',
        }}
      >
        {/* Monospaced Meta Tag */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              fontSize: '0.68rem',
              fontFamily: 'monospace',
              letterSpacing: '0.12em',
              color: 'rgba(255, 255, 255, 0.45)',
            }}
          >
            [ {isTr ? 'SPONSOR // İÇERİK' : 'SPONSORED // CONTENT'} ]
          </span>
          <a
            href="https://www.google.com/ads/preferences/"
            target="_blank"
            rel="noopener noreferrer"
            title="Google AdChoices"
            style={{
              fontSize: '0.62rem',
              fontFamily: 'monospace',
              color: 'rgba(255, 255, 255, 0.3)',
              textDecoration: 'none',
              letterSpacing: '0.05em',
            }}
          >
            AdChoices ↗
          </a>
        </div>

        {/* Real AdSense Container */}
        <div
          style={{
            minHeight: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
          }}
        >
          <ins
            className="adsbygoogle"
            style={{
              display: 'block',
              width: '100%',
              minHeight: '100px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
            data-ad-client={activeClientId}
            data-ad-slot={activeSlot}
            data-ad-format="fluid"
            data-ad-layout-key="-fb+5w+4e-db+86"
            data-full-width-responsive="true"
          />

          {/* Fallback frame while ad renders or in test mode */}
          {GOOGLE_ADSENSE_CONFIG.testMode && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px dashed rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                zIndex: 0,
                pointerEvents: 'none',
                gap: '0.35rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                GOOGLE ADSENSE FEED UNIT
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontFamily: 'monospace',
                  color: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                Slot: {activeSlot}
              </span>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // Variant 2: IN-ARTICLE / BOTTOM (rendered inside or below blog post content)
  return (
    <aside
      className={`blog-ad-banner blog-ad-${variant}`}
      aria-label={isTr ? 'Reklam' : 'Advertisement'}
      style={{
        margin: variant === 'in-article' ? '3rem 0' : '2.5rem 0',
        padding: '1.25rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.015)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header Label */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          [ {isTr ? 'SPONSOR // REKLAM' : 'SPONSOR // ADVERTISEMENT'} ]
        </span>
        <a
          href="https://www.google.com/ads/preferences/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.62rem',
            fontFamily: 'monospace',
            color: 'rgba(255, 255, 255, 0.3)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}
        >
          AdChoices ↗
        </a>
      </div>

      {/* AdSense Slot */}
      <div
        style={{
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            minHeight: '100px',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
          data-ad-client={activeClientId}
          data-ad-slot={activeSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />

        {/* Fallback frame while ad renders or in test mode */}
        {GOOGLE_ADSENSE_CONFIG.testMode && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px dashed rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              zIndex: 0,
              pointerEvents: 'none',
              gap: '0.35rem',
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                letterSpacing: '0.15em',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              GOOGLE ADSENSE RESPONSIVE UNIT
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                fontFamily: 'monospace',
                color: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              {`Client: ${activeClientId} // Slot: ${activeSlot}`}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
