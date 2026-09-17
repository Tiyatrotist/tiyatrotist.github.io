/**
 * BOOKOS — Hero Section & OS Window Product Reveal Visual
 */

'use client';

import { Locale, Dictionary } from '@/dictionaries';

interface BookOSHeroProps {
  lang: Locale;
  dict: Dictionary;
}

export default function BookOSHero({ dict }: BookOSHeroProps) {
  const b = dict.bookos;

  return (
    <section id="overview" className="bookos-hero">
      <span className="bookos-hero__tag">{b.overviewTag}</span>
      <h1 className="bookos-hero__title">BOOKOS</h1>
      <p className="bookos-hero__tagline">{b.tagline}</p>

      <div className="bookos-hero__actions">
        <a href="#download" className="bookos-btn bookos-btn--primary">
          <span>↓</span> {b.downloadBtn}
        </a>
        <a
          href="https://github.com/Tiyatrotist"
          target="_blank"
          rel="noopener noreferrer"
          className="bookos-btn bookos-btn--secondary"
        >
          {b.githubBtn}
        </a>
      </div>

      {/* Layered OS Window Interface Composition */}
      <div className="bookos-window">
        <div className="bookos-window__bar">
          <div className="bookos-window__dots">
            <span className="bookos-window__dot bookos-window__dot--red" />
            <span className="bookos-window__dot bookos-window__dot--yellow" />
            <span className="bookos-window__dot bookos-window__dot--green" />
          </div>
          <span className="bookos-window__title">bookos://kernel/workspace.v1</span>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--bookos-mono)' }}>x86_64</span>
        </div>

        <div className="bookos-window__body">
          {/* OS Sidebar Panel */}
          <aside className="bookos-sidebar">
            <span className="bookos-sidebar__group-title">NAVIGATION</span>
            <div className="bookos-sidebar__item bookos-sidebar__item--active">
              <span>❖</span> {b.tabVault}
            </div>
            <div className="bookos-sidebar__item">
              <span>⧉</span> {b.tabEditor}
            </div>
            <div className="bookos-sidebar__item">
              <span>◈</span> {b.tabMonitor}
            </div>

            <span className="bookos-sidebar__group-title" style={{ marginTop: '1rem' }}>SYSTEM STATE</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--bookos-text-muted)', fontFamily: 'var(--bookos-mono)' }}>
              CPU: 1.4% <br />
              MEM: 142MB <br />
              UPTIME: 99.98%
            </div>
          </aside>

          {/* OS Main Workspace Panel */}
          <main className="bookos-main-panel">
            <div className="bookos-panel-header">
              <span className="bookos-panel-title">{b.overviewTitle}</span>
              <span className="bookos-panel-badge">STATUS: ACTIVE</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--bookos-text-secondary)', lineHeight: '1.6' }}>
              {b.overviewDesc}
            </p>

            <div className="bookos-code-snippet">
              <span className="bookos-code-comment">// BookOS State Engine Init Routine</span><br />
              <span className="bookos-code-keyword">const</span> kernel = <span className="bookos-code-keyword">await</span> BookOS.<span className="bookos-code-string">boot</span>(&#123; mode: <span className="bookos-code-string">'FOCUS_SURFACE'</span> &#125;);<br />
              kernel.<span className="bookos-code-string">mountLiteratureEngine</span>(&#123; biDirectional: <span className="bookos-code-keyword">true</span> &#125;);
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
