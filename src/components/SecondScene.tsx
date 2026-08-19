/**
 * TIYATROTIST — SecondScene
 * Minimal giriş sahnesi.
 * (Minimal introduction scene)
 *
 * - Kart YOK.
 * - Kutu YOK.
 * - Sadece tipografi ve noktalar.
 * - Bazı önemli kelimeler nokta tipografisine geçiş yapar veya vurgulanır.
 * - Biyografi uydurmak yok (Placeholder içeriği).
 */

'use client';

import { useEffect, useRef } from 'react';

export default function SecondScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="about" className="second-scene" ref={containerRef}>
      <div className="second-scene__content">
        <p className="second-scene__label">[ SCENE 01 — MANIFESTO ]</p>
        
        <h2 className="second-scene__heading">
          Digital experiences constructed from <span className="second-scene__dot-word">pure logic</span> and <span className="second-scene__dot-word">minimal form</span>.
        </h2>

        <div className="second-scene__body">
          <p>
            The interface is not a wrapper. It is a living canvas where typography, code, and space converge into a singular quiet environment.
          </p>
          <p className="second-scene__subtext">
            Sessiz bir dijital alan. Fazlalıklardan arındırılmış, noktaların ve ışığın ritmiyle şekillenen bir deneyim.
          </p>
        </div>
      </div>
    </section>
  );
}
