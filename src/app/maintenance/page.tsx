/**
 * TIYATROTIST — Maintenance Page
 * Uses DotEngine + DotTypography to render massive particle-based maintenance title.
 * Subtle organic dot assembly: missing dots silently fade and settle in over time.
 * No explicit progress bars or percentages — pure subtle visual feeling.
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { DotEngine } from '@/engine/DotEngine';
import { textToDots } from '@/engine/DotTypography';
import { tr } from '@/dictionaries/tr';
import { en } from '@/dictionaries/en';
import { Locale } from '@/dictionaries/types';
import CustomCursor from '@/components/CustomCursor';
import '../maintenance.css';

export default function MaintenancePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DotEngine | null>(null);
  const initRef = useRef(false);

  const [lang, setLang] = useState<Locale>('tr');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred_lang') as Locale;
      if (stored === 'tr' || stored === 'en') {
        setLang(stored);
        return;
      }
      const navLang = navigator.language || (navigator as any).userLanguage || '';
      if (navLang.toLowerCase().startsWith('tr')) {
        setLang('tr');
      } else {
        setLang('en');
      }
    }
  }, []);

  const dict = lang === 'tr' ? tr : en;

  const initEngine = useCallback(() => {
    if (initRef.current) return;
    if (!canvasRef.current) return;
    initRef.current = true;

    const canvas = canvasRef.current;
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;

    // MASSIVE FONT SIZE (At least 2x larger: 320px desktop, 180px mobile, 100px small mobile)
    const gridSpacing = isSmallMobile ? 6 : isMobile ? 5 : 5;
    const fontSize = isSmallMobile ? 100 : isMobile ? 180 : 320;
    const maxParticles = isSmallMobile ? 1500 : isMobile ? 3000 : 6000;

    const engine = new DotEngine({
      canvas,
      maxParticles,
      baseSize: isMobile ? 1.4 : 1.8,
      enableMouseInteraction: true,
      useGlobalMouse: true,
      sectionMode: 'hero',
    });

    engineRef.current = engine;

    const layout = textToDots(dict.maintenance.title, {
      fontSize,
      fontWeight: '900',
      gridSpacing,
      alphaThreshold: 80,
    });

    const centerX = engine.getWidth() / 2;
    const centerY = engine.getHeight() * 0.42;

    engine.setTargets(layout.dots, centerX, centerY, true);

    // Subtle organic missing dots assembly feeling (no explicit UI text/progress bar)
    const particles = (engine as any).particles;
    const activeCount = (engine as any).activeCount;

    const indices: number[] = [];
    for (let i = 0; i < activeCount; i++) indices.push(i);
    indices.sort((a, b) => Math.sin(a * 777) - Math.sin(b * 777));

    const initialVisibleCount = Math.floor(activeCount * 0.4);

    // Hide 60% of dots initially
    for (let i = 0; i < activeCount; i++) {
      const idx = indices[i];
      const p = particles[idx];
      if (p) {
        if (i >= initialVisibleCount) {
          p.targetOpacity = 0;
          p.opacity = 0;
        }
      }
    }

    const ambientCount = isSmallMobile ? 30 : isMobile ? 60 : 120;
    engine.addAmbientParticles(ambientCount);
    engine.start();

    // Silent organic assembly loop: missing dots silently & gently breathe in
    let currentCount = initialVisibleCount;
    const interval = setInterval(() => {
      if (currentCount < activeCount) {
        const chunkSize = Math.max(1, Math.floor(activeCount * 0.012));
        for (let k = 0; k < chunkSize && currentCount < activeCount; k++) {
          const idx = indices[currentCount];
          const p = particles[idx];
          if (p) {
            p.targetOpacity = Math.random() * 0.4 + 0.6; // Organic opacity variation
            p.x = p.targetX + (Math.random() - 0.5) * 20;
            p.y = p.targetY + (Math.random() - 0.5) * 20;
            p.state = 'RETURNING';
          }
          currentCount++;
        }
      } else {
        // Reset after 5 seconds to continuously maintain subtle organic feeling
        setTimeout(() => {
          currentCount = initialVisibleCount;
          for (let i = initialVisibleCount; i < activeCount; i++) {
            const idx = indices[i];
            const p = particles[idx];
            if (p) {
              p.targetOpacity = 0;
            }
          }
        }, 5000);
      }
    }, 120);

    (canvas as any).__assemblyInterval = interval;
  }, [dict.maintenance.title]);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        initEngine();
      });
    } else {
      setTimeout(initEngine, 100);
    }

    return () => {
      if (canvasRef.current && (canvasRef.current as any).__assemblyInterval) {
        clearInterval((canvasRef.current as any).__assemblyInterval);
      }
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
      const isSmallMobile = window.innerWidth < 480;
      const gridSpacing = isSmallMobile ? 6 : isMobile ? 5 : 5;
      const fontSize = isSmallMobile ? 100 : isMobile ? 180 : 320;

      const layout = textToDots(dict.maintenance.title, {
        fontSize,
        fontWeight: '900',
        gridSpacing,
        alphaThreshold: 80,
      });

      const centerX = engine.getWidth() / 2;
      const centerY = engine.getHeight() * 0.42;

      engine.setTargets(layout.dots, centerX, centerY, false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dict.maintenance.title]);

  return (
    <main className="maintenance">
      <CustomCursor />
      <canvas ref={canvasRef} className="maintenance__canvas" />

      <div className="maintenance__overlay">
        <span className="maintenance__status">{dict.maintenance.status}</span>
        <p className="maintenance__tagline">{dict.maintenance.tagline}</p>
        <div className="maintenance__pulse" />
      </div>
    </main>
  );
}
