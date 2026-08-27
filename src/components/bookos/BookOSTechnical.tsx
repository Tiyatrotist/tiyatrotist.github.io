/**
 * BOOKOS — Technical Section
 * Concise technical facts grid for system specs and architecture.
 */

'use client';

import { Dictionary } from '@/dictionaries';

interface BookOSTechnicalProps {
  dict: Dictionary;
}

export default function BookOSTechnical({ dict }: BookOSTechnicalProps) {
  const b = dict.bookos;

  const specs = [
    { label: b.archLabel, val: b.archVal },
    { label: b.runtimeLabel, val: b.runtimeVal },
    { label: b.memoryLabel, val: b.memoryVal },
    { label: b.binaryLabel, val: b.binaryVal },
    { label: b.licenseLabel, val: b.licenseVal },
  ];

  return (
    <section id="technical" className="bookos-section">
      <div className="bookos-section-header">
        <span className="bookos-section-tag">{b.techTag}</span>
        <h2 className="bookos-section-title">{b.techTitle}</h2>
      </div>

      <div className="bookos-tech-grid">
        {specs.map((item) => (
          <div key={item.label} className="bookos-tech-card">
            <span className="bookos-tech-label">{item.label}</span>
            <span className="bookos-tech-val">{item.val}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
