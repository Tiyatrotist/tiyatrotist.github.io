/**
 * TIYATROTIST — ScrollScene
 * GSAP ScrollTrigger ile kaydırma tabanlı sürekli visual akış.
 * (GSAP ScrollTrigger continuous scroll-driven visual flow)
 *
 * Kullanıcı kaydırdıkça:
 * - Sayfa tek parçalı kesintisiz dijital kompozisyon gibi hissettirir.
 * - Bölümler arası keskin kırılmalar önlenir.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollSceneProps {
  children: React.ReactNode;
}

export default function ScrollScene({ children }: ScrollSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Fade in scenes gracefully on scroll
      const scenes = gsap.utils.toArray<HTMLElement>('.second-scene, .project-intro');

      scenes.forEach((scene) => {
        gsap.fromTo(
          scene,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: scene,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 0.5,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="scroll-scene-wrapper">
      {children}
    </div>
  );
}
