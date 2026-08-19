/**
 * TIYATROTIST — Hero
 * Ana hero bölümü — nokta tipografisi, giriş animasyonu, fare etkileşimi.
 * (Main hero section — dot typography, entrance animation, mouse interaction)
 *
 * Çalışma prensibi:
 * 1. Siyah ekranla başlar.
 * 2. Küçük beyaz noktalar yavaşça belirir.
 * 3. Noktalar TIYATROTIST oluşumuna dönüşür.
 * 4. Alt başlık ve çevresel parçacık alanı stabilize olur.
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { DotEngine } from '@/engine/DotEngine';
import { textToDots } from '@/engine/DotTypography';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DotEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const initRef = useRef(false);

  // Azaltılmış hareket tespiti
  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    : false;

  const initEngine = useCallback(() => {
    if (initRef.current) return;
    if (!canvasRef.current) return;
    initRef.current = true;

    const canvas = canvasRef.current;

    // Mobil parçacık yoğunluğu ayarı
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;

    // Grid spacing: daha düşük = daha fazla nokta
    const gridSpacing = isMobile ? 7 : isTablet ? 5 : 4;
    const fontSize = isMobile ? 48 : isTablet ? 80 : 120;
    const maxParticles = isMobile ? 1200 : isTablet ? 2000 : 3000;

    console.debug('[Hero] Initializing...', { isMobile, isTablet, gridSpacing, fontSize });

    // DotEngine oluştur
    const engine = new DotEngine({
      canvas,
      maxParticles,
      baseSize: isMobile ? 1.2 : 1.5,
      mouseRadius: isMobile ? 60 : 100,
      mouseForce: 0.25,
      friction: 0.88,
      springForce: 0.06,
      enableMouseInteraction: !isMobile,
      reducedMotion,
    });

    engineRef.current = engine;

    // "TIYATROTIST" metnini nokta koordinatlarına dönüştür
    const layout = textToDots('TIYATROTIST', {
      fontSize,
      fontWeight: '700',
      gridSpacing,
      alphaThreshold: 100,
    });

    console.debug(`[Hero] Text layout: ${layout.dots.length} dots, ${layout.width}x${layout.height}`);

    // Hedef pozisyonları ayarla — canvas merkezine yerleştir
    const centerX = engine.getWidth() / 2;
    const centerY = engine.getHeight() * 0.42;

    engine.setTargets(layout.dots, centerX, centerY, true);

    // Çevresel parçacıklar ekle
    const ambientCount = isMobile ? 30 : isTablet ? 50 : 80;
    engine.addAmbientParticles(ambientCount);

    // Animasyon döngüsünü başlat
    engine.start();

    // Alt başlık ve CTA'yı gecikmeyle göster
    const subtitleDelay = reducedMotion ? 200 : 1200;
    const ctaDelay = reducedMotion ? 400 : 2000;

    setTimeout(() => setShowSubtitle(true), subtitleDelay);
    setTimeout(() => setShowCta(true), ctaDelay);

    console.debug('[Hero] Engine started, waiting for subtitle/CTA reveals');
  }, [reducedMotion]);

  // Component mount
  useEffect(() => {
    // Font yüklenmesini bekle, sonra engine'i başlat
    if (document.fonts) {
      document.fonts.ready.then(() => {
        console.debug('[Hero] Fonts ready');
        initEngine();
      });
    } else {
      // Fallback
      setTimeout(initEngine, 100);
    }

    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
      initRef.current = false;
    };
  }, [initEngine]);

  // Pencere yeniden boyutlandırma
  useEffect(() => {
    const handleResize = () => {
      if (!engineRef.current || !canvasRef.current) return;

      const engine = engineRef.current;
      engine.resize();

      // Metni yeniden hesapla
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth < 1024;
      const gridSpacing = isMobile ? 7 : isTablet ? 5 : 4;
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

      {/* Alt bilgi katmanı (HTML overlay) */}
      <div className="hero__overlay">
        <div
          className={`hero__subtitle ${showSubtitle ? 'hero__subtitle--visible' : ''}`}
        >
          <p className="hero__role">Software Developer</p>
          <p className="hero__tagline">kod ve sahne arasında — between code & stage</p>
        </div>

        <Link
          href="/projects"
          className={`hero__cta ${showCta ? 'hero__cta--visible' : ''}`}
          data-cursor="expand"
          aria-label="Explore projects"
        >
          EXPLORE ↓
        </Link>
      </div>
    </section>
  );
}
