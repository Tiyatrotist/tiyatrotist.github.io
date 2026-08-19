/**
 * TIYATROTIST — ProjectIntro
 * Geleceğin Projeler bölümünün başlangıcı (BookOS kapısı).
 * (Beginning of future Projects section — BookOS doorway)
 *
 * - Jenerik kartlar YOK.
 * - Büyük proje başlığı (BookOS).
 * - Muazzam miktarda negatif alan.
 * - Kontrollü nokta alanı.
 * - Monochrome (siyah/bez/gri).
 * - /projects/bookos sayfasına yönlendirir.
 */

'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { textToDots } from '@/engine/DotTypography';
import { DotEngine } from '@/engine/DotEngine';

export default function ProjectIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DotEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const isMobile = window.innerWidth < 768;
    const gridSpacing = isMobile ? 6 : 4;
    const fontSize = isMobile ? 56 : 100;

    const engine = new DotEngine({
      canvas: canvasRef.current,
      maxParticles: isMobile ? 800 : 1800,
      baseSize: isMobile ? 1.2 : 1.5,
      mouseRadius: 90,
      enableMouseInteraction: !isMobile,
    });

    engineRef.current = engine;

    const layout = textToDots('BookOS', {
      fontSize,
      fontWeight: '700',
      gridSpacing,
    });

    const centerX = engine.getWidth() / 2;
    const centerY = engine.getHeight() / 2;

    engine.setTargets(layout.dots, centerX, centerY, true);
    engine.addAmbientParticles(isMobile ? 25 : 50);
    engine.start();

    const handleResize = () => {
      if (!engineRef.current) return;
      engineRef.current.resize();
      const newLayout = textToDots('BookOS', {
        fontSize: window.innerWidth < 768 ? 56 : 100,
        fontWeight: '700',
        gridSpacing: window.innerWidth < 768 ? 6 : 4,
      });
      engineRef.current.setTargets(
        newLayout.dots,
        engineRef.current.getWidth() / 2,
        engineRef.current.getHeight() / 2,
        false
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  return (
    <section id="projects" className="project-intro" ref={containerRef}>
      <div className="project-intro__header">
        <span className="project-intro__tag">[ SELECTED WORK 01 ]</span>
      </div>

      <Link
        href="/projects/bookos"
        className="project-intro__canvas-container"
        data-cursor="expand"
        aria-label="View BookOS project"
      >
        <canvas ref={canvasRef} className="project-intro__canvas" />
      </Link>

      <div className="project-intro__footer">
        <p className="project-intro__desc">
          An experimental digital operating system & workspace concept.
        </p>

        <Link
          href="/projects/bookos"
          className="project-intro__enter-btn"
          data-cursor="expand"
        >
          <span>ENTER ENVIRONMENT</span>
          <span className="project-intro__arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
