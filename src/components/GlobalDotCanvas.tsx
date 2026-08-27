/**
 * TIYATROTIST — GlobalDotCanvas
 * Site-wide ambient particle nervous system.
 *
 * Provides visual continuity across all pages and sections:
 * - Uses single reusable DotEngine instance with global mouse listener.
 * - Detects active viewport sections (#home, #about, #projects, footer, or subpage routes).
 * - Dynamically updates sectionMode (hero, intro, projects, about, now, contact, footer).
 * - Listens for Aperture Science quantum pulse events.
 * - Low density (120 particles desktop / 40 mobile) to prevent particle spam.
 * - Zero DOM overhead, fixed background canvas, 100% monochrome.
 */

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { DotEngine } from '@/engine/DotEngine';

export default function GlobalDotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DotEngine | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!canvasRef.current) return;

    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    const particleCount = isMobile ? 40 : 120;

    // Create global DotEngine instance
    const engine = new DotEngine({
      canvas: canvasRef.current,
      maxParticles: particleCount,
      baseSize: isMobile ? 1.0 : 1.4,
      scatterRadius: isMobile ? 80 : 120,
      enableMouseInteraction: !isMobile,
      reducedMotion,
      useGlobalMouse: true,
      sectionMode: 'hero',
    });

    engineRef.current = engine;

    // Add initial ambient particles distributed evenly across screen
    engine.addAmbientParticles(particleCount);
    engine.start();

    // Event listener for Aperture Science Quantum Pulse Easter Egg
    const handleAperturePulse = () => {
      if (!engineRef.current) return;
      engineRef.current.scatterAll(1.5);
      setTimeout(() => {
        engineRef.current?.reformAll();
      }, 1800);
    };

    window.addEventListener('aperture-pulse', handleAperturePulse);

    // Section Observer for scroll-driven section modes on home page
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && engineRef.current) {
            const id = entry.target.id;
            if (id === 'home') engineRef.current.setSectionMode('hero');
            else if (id === 'about') engineRef.current.setSectionMode('intro');
            else if (id === 'projects') engineRef.current.setSectionMode('projects');
            else if (entry.target.classList.contains('site-footer')) engineRef.current.setSectionMode('footer');
          }
        });
      },
      { threshold: 0.25 }
    );

    // Observe home page sections if present
    const homeSec = document.getElementById('home');
    const aboutSec = document.getElementById('about');
    const projSec = document.getElementById('projects');
    const footerSec = document.querySelector('.site-footer');

    if (homeSec) sectionObserver.observe(homeSec);
    if (aboutSec) sectionObserver.observe(aboutSec);
    if (projSec) sectionObserver.observe(projSec);
    if (footerSec) sectionObserver.observe(footerSec);

    return () => {
      window.removeEventListener('aperture-pulse', handleAperturePulse);
      sectionObserver.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Update section mode based on route changes for subpages
  useEffect(() => {
    if (!engineRef.current) return;

    const engine = engineRef.current;
    if (pathname === '/') {
      engine.setSectionMode('hero');
    } else if (pathname.startsWith('/projects')) {
      engine.setSectionMode('projects');
    } else if (pathname === '/about') {
      engine.setSectionMode('about');
    } else if (pathname === '/now') {
      engine.setSectionMode('now');
    } else if (pathname === '/contact') {
      engine.setSectionMode('contact');
    }
  }, [pathname]);

  return (
    <canvas
      ref={canvasRef}
      className="global-dot-canvas"
      aria-hidden="true"
    />
  );
}
