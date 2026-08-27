/**
 * BOOKOS — Showcase Section
 * Product reveal scene with desktop UI panel tabs and performance stats.
 */

'use client';

import { useState } from 'react';
import { Dictionary } from '@/dictionaries';

interface BookOSShowcaseProps {
  dict: Dictionary;
}

export default function BookOSShowcase({ dict }: BookOSShowcaseProps) {
  const b = dict.bookos;
  const [activeTab, setActiveTab] = useState<'vault' | 'editor' | 'monitor'>('vault');

  return (
    <section id="showcase" className="bookos-section">
      <div className="bookos-section-header" style={{ textAlign: 'center', alignItems: 'center' }}>
        <span className="bookos-section-tag">[ PRODUCT SHOWCASE ]</span>
        <h2 className="bookos-section-title">{b.showcaseTitle}</h2>
        <p className="bookos-section-desc">{b.showcaseSubtitle}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('vault')}
          className={`bookos-btn ${activeTab === 'vault' ? 'bookos-btn--primary' : 'bookos-btn--secondary'}`}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
        >
          {b.tabVault}
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`bookos-btn ${activeTab === 'editor' ? 'bookos-btn--primary' : 'bookos-btn--secondary'}`}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
        >
          {b.tabEditor}
        </button>
        <button
          onClick={() => setActiveTab('monitor')}
          className={`bookos-btn ${activeTab === 'monitor' ? 'bookos-btn--primary' : 'bookos-btn--secondary'}`}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
        >
          {b.tabMonitor}
        </button>
      </div>

      <div className="bookos-window">
        <div className="bookos-window__bar">
          <div className="bookos-window__dots">
            <span className="bookos-window__dot bookos-window__dot--red" />
            <span className="bookos-window__dot bookos-window__dot--yellow" />
            <span className="bookos-window__dot bookos-window__dot--green" />
          </div>
          <span className="bookos-window__title">bookos://showcase/{activeTab}.v1</span>
          <span className="bookos-header__badge">LIVE PREVIEW</span>
        </div>

        <div style={{ padding: '2.5rem', minHeight: '320px', background: 'var(--bookos-card)' }}>
          {activeTab === 'vault' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span className="bookos-feature-meta">KNOWLEDGE GRAPH & LITERATURE VAULT</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff' }}>Bi-Directional Knowledge Network</h3>
              <p style={{ color: 'var(--bookos-text-secondary)', lineHeight: 1.6 }}>
                Every note, reference, and literary excerpt links seamlessly into a non-linear graph database operating entirely offline in client memory.
              </p>
            </div>
          )}

          {activeTab === 'editor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span className="bookos-feature-meta">TACTILE MATRIX EDITOR</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff' }}>Zero-Latency Monolithic Writing Surface</h3>
              <p style={{ color: 'var(--bookos-text-secondary)', lineHeight: 1.6 }}>
                Synthesize ideas using LaTeX mathematical notation, Markdown typography, and instant keybinding controls with zero distraction.
              </p>
            </div>
          )}

          {activeTab === 'monitor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span className="bookos-feature-meta">SYSTEM KERNEL MONITOR</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff' }}>Microsecond Process Diagnostics</h3>
              <div className="bookos-tech-grid" style={{ marginTop: '0.5rem' }}>
                <div className="bookos-tech-card">
                  <span className="bookos-tech-label">PROCESS LATENCY</span>
                  <span className="bookos-tech-val" style={{ color: '#27c93f' }}>0.04ms</span>
                </div>
                <div className="bookos-tech-card">
                  <span className="bookos-tech-label">HEAP ALLOCATION</span>
                  <span className="bookos-tech-val">12.4 MB</span>
                </div>
                <div className="bookos-tech-card">
                  <span className="bookos-tech-label">CACHE HIT RATIO</span>
                  <span className="bookos-tech-val">99.8%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
