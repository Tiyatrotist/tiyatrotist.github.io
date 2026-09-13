/**
 * TIYATROTIST — Maintenance Page
 * Uses DotEngine + DotTypography to render massive particle-based maintenance title.
 * Fully responsive: dynamically calculates optimal font size and grid spacing to fit any screen without clipping.
 * Complete dot rendering: 100% of dots are rendered with organic assembly and interactive physics.
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DotEngine } from '@/engine/DotEngine';
import { textToDots } from '@/engine/DotTypography';
import { tr } from '@/dictionaries/tr';
import { en } from '@/dictionaries/en';
import { Locale } from '@/dictionaries/types';
import CustomCursor from '@/components/CustomCursor';
import '../maintenance.css';

interface MaintenancePageProps {
  initialLang?: Locale;
}

/**
 * Calculates optimal font size and grid spacing to ensure the text fits perfectly
 * within viewport bounds without horizontal overflow or overlay collisions.
 */
function computeMaintenanceTypography(
  text: string,
  viewportWidth: number,
  viewportHeight: number
): { fontSize: number; gridSpacing: number } {
  const isMobile = viewportWidth < 768;
  const isSmallMobile = viewportWidth < 480;

  // Horizontal target bounds (leave comfortable margins on left and right)
  const targetMaxWidth = isSmallMobile
    ? viewportWidth * 0.90
    : isMobile
    ? viewportWidth * 0.86
    : Math.min(viewportWidth * 0.82, 1380);

  // Vertical target bounds (avoid crowding top or bottom overlay)
  const targetMaxHeight = viewportHeight * (isMobile ? 0.26 : 0.32);

  let fontSize = 160;

  if (typeof document !== 'undefined') {
    const offscreen = document.createElement('canvas');
    const ctx = offscreen.getContext('2d');
    if (ctx) {
      ctx.font = '900 100px Inter, Arial, sans-serif';
      const measured = ctx.measureText(text);
      const testWidth = measured.width || 600;

      const scaleW = targetMaxWidth / testWidth;
      const scaleH = targetMaxHeight / 100;
      const scale = Math.min(scaleW, scaleH);

      const maxCap = isSmallMobile ? 76 : isMobile ? 115 : 250;
      fontSize = Math.max(36, Math.min(maxCap, Math.floor(100 * scale)));
    }
  }

  // Adjust grid spacing according to font size to maintain crisp character definition
  const gridSpacing = fontSize > 180 ? 6 : fontSize > 110 ? 5 : fontSize > 65 ? 4 : 3;

  return { fontSize, gridSpacing };
}

export default function MaintenancePage({ initialLang }: MaintenancePageProps = {}) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DotEngine | null>(null);

  const [lang, setLang] = useState<Locale>(() => {
    if (initialLang === 'tr' || initialLang === 'en') return initialLang;
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/en')) return 'en';
      if (pathname.startsWith('/tr')) return 'tr';
      const stored = localStorage.getItem('preferred_lang') as Locale;
      if (stored === 'tr' || stored === 'en') return stored;
      const navLang = navigator.language || '';
      if (navLang.toLowerCase().startsWith('tr')) return 'tr';
    }
    return 'tr';
  });

  // Track initialLang prop changes from parent without overwriting local user toggle actions
  const prevInitialLangRef = useRef<Locale | undefined>(initialLang);
  useEffect(() => {
    if (initialLang && initialLang !== prevInitialLangRef.current) {
      prevInitialLangRef.current = initialLang;
      setLang(initialLang);
    }
  }, [initialLang]);

  const dict = lang === 'tr' ? tr : en;

  const toggleLanguage = () => {
    const nextLang: Locale = lang === 'tr' ? 'en' : 'tr';
    console.debug('[MaintenancePage] Toggling language from', lang, 'to', nextLang);
    setLang(nextLang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('preferred_lang', nextLang);
      } catch {}
      const pathname = window.location.pathname;
      if (pathname.includes('/maintenance')) {
        if (pathname.startsWith('/tr/') || pathname.startsWith('/en/')) {
          router.push(`/${nextLang}/maintenance`);
        } else {
          window.history.replaceState(null, '', `/${nextLang}/maintenance`);
        }
      }
    }
  };

  const setupEngine = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    const titleText = dict.maintenance.title;
    const { fontSize, gridSpacing } = computeMaintenanceTypography(titleText, width, height);

    console.debug(`[MaintenancePage] Rendering title "${titleText}" at ${fontSize}px (grid: ${gridSpacing})`);

    const layout = textToDots(titleText, {
      fontSize,
      fontWeight: '900',
      gridSpacing,
      alphaThreshold: 80,
    });

    // Ensure particle capacity is always large enough to render 100% of dots
    const capacity = Math.max(layout.dots.length + 500, 8000);

    if (!engineRef.current) {
      const engine = new DotEngine({
        canvas,
        maxParticles: capacity,
        baseSize: isMobile ? 1.5 : 1.9,
        enableMouseInteraction: true,
        useGlobalMouse: true,
        sectionMode: 'hero',
      });
      engineRef.current = engine;

      const centerX = engine.getWidth() / 2;
      const centerY = engine.getHeight() * (isMobile ? 0.38 : 0.40);

      // Assemble all dots with initial organic scatter
      engine.setTargets(layout.dots, centerX, centerY, true);

      const ambientCount = isMobile ? 40 : 80;
      engine.addAmbientParticles(ambientCount);
      engine.start();
    } else {
      const engine = engineRef.current;
      engine.resize();
      const centerX = engine.getWidth() / 2;
      const centerY = engine.getHeight() * (isMobile ? 0.38 : 0.40);
      // Morph particles smoothly into new layout coordinates
      engine.setTargets(layout.dots, centerX, centerY, false);
    }
  }, [dict.maintenance.title]);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setupEngine();
      });
    } else {
      setTimeout(setupEngine, 100);
    }

    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, [setupEngine]);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!engineRef.current || !canvasRef.current) return;

        const engine = engineRef.current;
        engine.resize();

        const width = window.innerWidth;
        const height = window.innerHeight;
        const isMobile = width < 768;

        const { fontSize, gridSpacing } = computeMaintenanceTypography(
          dict.maintenance.title,
          width,
          height
        );

        const layout = textToDots(dict.maintenance.title, {
          fontSize,
          fontWeight: '900',
          gridSpacing,
          alphaThreshold: 80,
        });

        const centerX = engine.getWidth() / 2;
        const centerY = engine.getHeight() * (isMobile ? 0.38 : 0.40);

        engine.setTargets(layout.dots, centerX, centerY, false);
      }, 60);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [dict.maintenance.title]);

  return (
    <main className="maintenance">
      <CustomCursor />
      <canvas ref={canvasRef} className="maintenance__canvas" />

      {/* Sleek top navigation for language toggle */}
      <header className="maintenance__top-bar">
        <button
          type="button"
          onClick={toggleLanguage}
          className="maintenance__lang-btn"
          aria-label="Toggle language"
        >
          [ {lang.toUpperCase()} ]
        </button>
      </header>

      <div className="maintenance__overlay">
        <span className="maintenance__status">{dict.maintenance.status}</span>
        <p className="maintenance__tagline">{dict.maintenance.tagline}</p>
        <div className="maintenance__pulse" />
      </div>
    </main>
  );
}
