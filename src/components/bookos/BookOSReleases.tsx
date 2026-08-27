/**
 * BOOKOS — Release Channels Section
 * Visual channels: Stable (v1.2.0), Beta (v1.3.0-b2), Experimental (v1.4.0-nightly).
 * Prepared for future GitHub Release API integrations.
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
      version: 'v1.2.0',
      badgeClass: 'bookos-release-badge--stable',
      badgeText: 'RECOMMENDED',
      desc: b.stableDesc,
      active: true,
    },
    {
      channel: b.betaTitle,
      version: 'v1.3.0-b2',
      badgeClass: 'bookos-release-badge--beta',
      badgeText: 'PRE-RELEASE',
      desc: b.betaDesc,
      active: false,
    },
    {
      channel: b.expTitle,
      version: 'v1.4.0-nightly',
      badgeClass: 'bookos-release-badge--exp',
      badgeText: 'NIGHTLY',
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
            <span style={{ fontFamily: 'var(--bookos-mono)', fontSize: '1.1rem', color: 'var(--bookos-orange)' }}>
              {ch.version}
            </span>
            <p className="bookos-release-desc">{ch.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
