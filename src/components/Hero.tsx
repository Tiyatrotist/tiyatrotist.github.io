/**
 * TIYATROTIST — Hero
 * Main hero section — enlarged dot typography, responsive mobile density, independent particle interaction.
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { DotEngine } from '@/engine/DotEngine';
import { textToDots } from '@/engine/DotTypography';
import { Locale, Dictionary } from '@/dictionaries';

interface HeroProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Hero({ lang, dict }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DotEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const initRef = useRef(false);

  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    : false;

  // Calculates responsive typography settings
  const getTypographyConfig = useCallback(() => {
    if (typeof window === 'undefined') {
      return { fontSize: 150, gridSpacing: 5, isMobile: false, isTablet: false };
    }

    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    let fontSize: number;
    let gridSpacing: number;

    if (isMobile) {
      // Dynamic fit for mobile screens: crisp, readable, dense dots without overflow
      fontSize = Math.floor(Math.max(Math.min((width - 24) / 7.0, 68), 34));
      gridSpacing = 3;
    } else if (isTablet) {
      fontSize = Math.floor(Math.min(width * 0.12, 120));
      gridSpacing = 4;
    } else {
      // Desktop: significantly larger, impactful hero presence as requested
      fontSize = Math.floor(Math.min(Math.max(width * 0.135, 145), 220));
      gridSpacing = 5;
    }

    return { fontSize, gridSpacing, isMobile, isTablet };
  }, []);

  const initEngine = useCallback(() => {
    if (initRef.current) return;
    if (!canvasRef.current) return;
    initRef.current = true;

    const canvas = canvasRef.current;
    const { fontSize, gridSpacing, isMobile, isTablet } = getTypographyConfig();
    const maxParticles = isMobile ? 3500 : isTablet ? 4500 : 6000;

    const engine = new DotEngine({
      canvas,
      maxParticles,
      baseSize: isMobile ? 1.3 : 1.6,
      enableMouseInteraction: !isMobile,
      reducedMotion,
      useGlobalMouse: true,
      sectionMode: 'hero',
    });

    engineRef.current = engine;

    const layout = textToDots('TIYATROTIST', {
      fontSize,
      fontWeight: '800',
      gridSpacing,
      alphaThreshold: isMobile ? 85 : 95,
    });

    const centerX = engine.getWidth() / 2;
    const centerY = engine.getHeight() * 0.42;

    engine.setTargets(layout.dots, centerX, centerY, true);
    const ambientCount = isMobile ? 25 : isTablet ? 50 : 80;
    engine.addAmbientParticles(ambientCount);
    engine.start();

    const subtitleDelay = reducedMotion ? 200 : 1200;
    const ctaDelay = reducedMotion ? 400 : 2000;

    setTimeout(() => setShowSubtitle(true), subtitleDelay);
    setTimeout(() => setShowCta(true), ctaDelay);
  }, [reducedMotion, getTypographyConfig]);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        initEngine();
      });
    } else {
      setTimeout(initEngine, 100);
    }

    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
      initRef.current = false;
    };
  }, [initEngine]);

  useEffect(() => {
    const handleResize = () => {
      if (!engineRef.current || !canvasRef.current) return;

      const engine = engineRef.current;
      engine.resize();

      const { fontSize, gridSpacing, isMobile } = getTypographyConfig();

      const layout = textToDots('TIYATROTIST', {
        fontSize,
        fontWeight: '800',
        gridSpacing,
        alphaThreshold: isMobile ? 85 : 95,
      });

      const centerX = engine.getWidth() / 2;
      const centerY = engine.getHeight() * 0.42;

      engine.setTargets(layout.dots, centerX, centerY, false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getTypographyConfig]);

  return (
    <section id="home" className="hero" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="hero__canvas"
      />

      <div className="hero__overlay">
        <div
          className={`hero__subtitle ${showSubtitle ? 'hero__subtitle--visible' : ''}`}
        >
          <p className="hero__role">{dict.hero.role}</p>
          <p className="hero__tagline">{dict.hero.tagline}</p>
        </div>

        <Link
          href={`/${lang}/projects`}
          className={`hero__cta ${showCta ? 'hero__cta--visible' : ''}`}
          data-cursor="expand"
          aria-label={dict.hero.cta}
        >
          {dict.hero.cta}
        </Link>
      </div>
    </section>
  );
}
