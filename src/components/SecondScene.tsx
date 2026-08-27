/**
 * TIYATROTIST — SecondScene
 * Minimal manifesto scene with localized text.
 */

'use client';

import { useRef } from 'react';
import { Dictionary } from '@/dictionaries';

interface SecondSceneProps {
  dict: Dictionary;
}

export default function SecondScene({ dict }: SecondSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const m = dict.manifesto;

  return (
    <section id="about" className="second-scene" ref={containerRef}>
      <div className="second-scene__content">
        <p className="second-scene__label">{m.tag}</p>

        <h2 className="second-scene__heading">
          {m.headingPrefix}
          <span className="second-scene__dot-word">{m.logicWord}</span>
          {m.headingMiddle}
          <span className="second-scene__dot-word">{m.formWord}</span>
          {m.headingSuffix}
        </h2>

        <div className="second-scene__body">
          <p>{m.paragraph1}</p>
          <p className="second-scene__subtext">{m.paragraph2}</p>
        </div>
      </div>
    </section>
  );
}
