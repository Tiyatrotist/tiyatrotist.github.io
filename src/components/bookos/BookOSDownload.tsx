/**
 * BOOKOS — Download Section
 * Visually strong download box prepared for future GitHub Release API integration.
 */

'use client';

import { useState } from 'react';
import { Dictionary } from '@/dictionaries';

interface BookOSDownloadProps {
  dict: Dictionary;
}

export default function BookOSDownload({ dict }: BookOSDownloadProps) {
  const b = dict.bookos;
  const [platform, setPlatform] = useState<'mac' | 'linux' | 'win' | 'wasm'>('mac');

  return (
    <section id="download" className="bookos-section">
      <div className="bookos-download-box">
        <span className="bookos-hero__tag">{b.downloadTag}</span>
        <h2 className="bookos-hero__title" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          {b.downloadTitle}
        </h2>
        <p className="bookos-hero__tagline">{b.downloadSubtitle}</p>

        {/* Platform Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setPlatform('mac')}
            className={`bookos-btn ${platform === 'mac' ? 'bookos-btn--primary' : 'bookos-btn--secondary'}`}
            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
          >
            macOS (Universal)
          </button>
          <button
            onClick={() => setPlatform('linux')}
            className={`bookos-btn ${platform === 'linux' ? 'bookos-btn--primary' : 'bookos-btn--secondary'}`}
            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
          >
            Linux (.AppImage / x86_64)
          </button>
          <button
            onClick={() => setPlatform('win')}
            className={`bookos-btn ${platform === 'win' ? 'bookos-btn--primary' : 'bookos-btn--secondary'}`}
            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
          >
            Windows (x64)
          </button>
          <button
            onClick={() => setPlatform('wasm')}
            className={`bookos-btn ${platform === 'wasm' ? 'bookos-btn--primary' : 'bookos-btn--secondary'}`}
            style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
          >
            WebAssembly Surface
          </button>
        </div>

        <div className="bookos-hero__actions">
          <button
            onClick={() => alert(`[BookOS] Downloading BookOS v1.2.0 for ${platform.toUpperCase()}. Prepared for GitHub Releases API.`)}
            className="bookos-btn bookos-btn--primary"
            style={{ fontSize: '0.95rem', padding: '1rem 2.25rem' }}
          >
            ↓ {b.downloadBtn} [{platform.toUpperCase()}]
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bookos-btn bookos-btn--secondary"
            style={{ fontSize: '0.95rem', padding: '1rem 2.25rem' }}
          >
            {b.githubBtn}
          </a>
        </div>

        <p className="bookos-download-notice">{b.downloadNotice}</p>
      </div>
    </section>
  );
}
