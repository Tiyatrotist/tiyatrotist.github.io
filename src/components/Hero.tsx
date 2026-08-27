/**
 * TIYATROTIST — Hero
 * Main hero section — dot typography, entrance animation, independent dot particle interaction.
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

  const initEngine = useCallback(() => {
    if (initRef.current) return;
    if (!canvasRef.current) return;
    initRef.current = true;

    const canvas = canvasRef.current;
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;

    const gridSpacing = isMobile ? 7 : isTablet ? 6 : 5;
    const fontSize = isMobile ? 48 : isTablet ? 80 : 120;
    const maxParticles = isMobile ? 1200 : isTablet ? 2000 : 3000;

    const engine = new DotEngine({
      canvas,
      maxParticles,
      baseSize: isMobile ? 1.2 : 1.5,
      enableMouseInteraction: !isMobile,
      reducedMotion,
      useGlobalMouse: true,
      sectionMode: 'hero',
    });

    engineRef.current = engine;

    const layout = textToDots('TIYATROTIST', {
      fontSize,
      fontWeight: '700',
      gridSpacing,
      alphaThreshold: 100,
    });

    const centerX = engine.getWidth() / 2;
    const centerY = engine.getHeight() * 0.42;

    engine.setTargets(layout.dots, centerX, centerY, true);
    const ambientCount = isMobile ? 30 : isTablet ? 50 : 80;
    engine.addAmbientParticles(ambientCount);
    engine.start();

    const subtitleDelay = reducedMotion ? 200 : 1200;
    const ctaDelay = reducedMotion ? 400 : 2000;

    setTimeout(() => setShowSubtitle(true), subtitleDelay);
    setTimeout(() => setShowCta(true), ctaDelay);
  }, [reducedMotion]);

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

      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;
      const gridSpacing = isMobile ? 7 : isTablet ? 6 : 5;
      const fontSize = isMobile ? 48 : isTablet ? 80 : 120;

      const layout = textToDots('TIYATROTIST', {
        fontSize,
        fontWeight: '700',
        gridSpacing,
        alphaThreshold: 100,
      });

      const centerX = engine.getWidth() / 2;
      const centerY = engine.getHeight() * 0.42;

      engine.setTargets(layout.dots, centerX, centerY, false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
