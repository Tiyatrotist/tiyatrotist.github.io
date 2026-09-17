/**
 * TIYATROTIST — Official Blog AdSense Banner Component
 *
 * Seamlessly integrates Google AdSense into blog posts and blog listings
 * with pure monochrome aesthetic matching Tiyatrotist design guidelines.
 * Supports in-article, in-feed, and pre-footer variants.
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Locale } from '@/dictionaries';
import {
  getActiveAdSenseClientId,
  isBlogAdsEnabled,
  getBlogInArticleSlot,
  getBlogInFeedSlot,
  GOOGLE_ADSENSE_CONFIG,
} from '@/config/ads';

interface BlogAdBannerProps {
  lang: Locale;
  variant?: 'in-article' | 'in-feed' | 'bottom';
  slot?: string;
}

export default function BlogAdBanner({
  lang,
  variant = 'in-article',
  slot,
}: BlogAdBannerProps) {
  const isTr = lang === 'tr';
  const [mounted, setMounted] = useState(false);
  const adPushedRef = useRef(false);

  const activeClientId = getActiveAdSenseClientId();
  const activeSlot =
    slot ||
    (variant === 'in-feed' ? getBlogInFeedSlot() : getBlogInArticleSlot());
  const isEnabled = isBlogAdsEnabled();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isEnabled || adPushedRef.current) return;

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
  }, [mounted, isEnabled, activeSlot, activeClientId, variant]);

  if (!mounted || !isEnabled) {
    return null;
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
              Client: {activeClientId} // Slot: {activeSlot}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
