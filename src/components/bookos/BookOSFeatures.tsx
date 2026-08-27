/**
 * BOOKOS — Features Section
 * Editorial product feature sections (alternating visual + technical metadata).
 */

'use client';

import { Dictionary } from '@/dictionaries';

interface BookOSFeaturesProps {
  dict: Dictionary;
}

export default function BookOSFeatures({ dict }: BookOSFeaturesProps) {
  const b = dict.bookos;

  const features = [
    {
      title: b.feature1Title,
      desc: b.feature1Desc,
      meta: b.feature1Meta,
      snippet: `struct MatrixEngine {\n  boot_time_us: u32,\n  state_buffer: Vec<u8>,\n  is_standalone: bool,\n}`,
    },
    {
      title: b.feature2Title,
      desc: b.feature2Desc,
      meta: b.feature2Meta,
      snippet: `// Monolithic focus layout configuration\n{\n  chrome_visible: false,\n  distraction_free: true,\n  contrast_mode: "TACTILE_DARK"\n}`,
    },
    {
      title: b.feature3Title,
      desc: b.feature3Desc,
      meta: b.feature3Meta,
      snippet: `// Bi-directional knowledge graph node\nnode.connect("literature/scene_01", {\n  weight: 0.95,\n  rel: "CONCEPTUAL_ANCESTRY"\n});`,
    },
  ];

  return (
    <section id="features" className="bookos-section">
      <div className="bookos-section-header">
        <span className="bookos-section-tag">{b.featuresTag}</span>
        <h2 className="bookos-section-title">ENGINEERED FOR DEEP INTELLECTUAL WORK</h2>
      </div>

      <div className="bookos-features-list">
        {features.map((feat, index) => (
          <div
            key={feat.title}
            className={`bookos-feature-row ${index % 2 === 1 ? 'bookos-feature-row--reversed' : ''}`}
          >
            <div className="bookos-feature-info">
              <span className="bookos-feature-meta">{feat.meta}</span>
              <h3 className="bookos-feature-title">{feat.title}</h3>
              <p className="bookos-feature-desc">{feat.desc}</p>
            </div>

            <div className="bookos-feature-visual">
              <div className="bookos-window__bar" style={{ marginBottom: '1rem', background: 'transparent' }}>
                <span className="bookos-window__title">bookos://sys/feature_{index + 1}.rs</span>
              </div>
              <pre className="bookos-code-snippet">
                <code>{feat.snippet}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
