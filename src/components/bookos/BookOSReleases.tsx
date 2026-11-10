/**
 * BOOKOS — Release Channels & Roadmap Section
 * Shows Development Roadmap: Phase 1 (Mobile & Web), Phase 2 (PC & Smart Boards / Pardus-surpassing), Phase 3 (Ecosystem).
 */

'use client';

import { Dictionary } from '@/dictionaries';

interface BookOSReleasesProps {
  dict: Dictionary;
}

export default function BookOSReleases({ dict }: BookOSReleasesProps) {
  const b = dict.bookos;

  const channels = [
    {
      channel: b.stableTitle,
      version: 'PHASE 01',
      badgeClass: 'bookos-release-badge--stable',
      badgeText: 'IN PROGRESS',
      desc: b.stableDesc,
      active: true,
    },
    {
      channel: b.betaTitle,
      version: 'PHASE 02',
      badgeClass: 'bookos-release-badge--beta',
      badgeText: 'PLANNED',
      desc: b.betaDesc,
      active: false,
    },
    {
      channel: b.expTitle,
      version: 'PHASE 03',
      badgeClass: 'bookos-release-badge--exp',
      badgeText: 'VISION',
      desc: b.expDesc,
      active: false,
    },
  ];

  return (
    <section id="releases" className="bookos-section">
      <div className="bookos-section-header">
        <span className="bookos-section-tag">{b.releasesTag}</span>
        <h2 className="bookos-section-title">{b.releasesTitle}</h2>
      </div>

      <div className="bookos-releases-grid">
        {channels.map((ch) => (
          <div
            key={ch.channel}
            className={`bookos-release-card ${ch.active ? 'bookos-release-card--active' : ''}`}
          >
            <div className="bookos-release-header">
              <span className="bookos-release-channel">{ch.channel}</span>
              <span className={`bookos-release-badge ${ch.badgeClass}`}>{ch.badgeText}</span>
            </div>
            <div className="bookos-release-version">{ch.version}</div>
            <p className="bookos-release-desc">{ch.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
