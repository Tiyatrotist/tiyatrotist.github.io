/**
 * TIYATROTIST — Page Builder Terminal Section
 *
 * Developer CLI / code execution block with copy button and monochrome styling.
 */

'use client';

import { useState } from 'react';
import { SectionBlock } from '@/types/builder';

interface SectionProps {
  section: SectionBlock;
  locale: 'tr' | 'en';
}

export default function TerminalSection({ section, locale }: SectionProps) {
  const { content } = section;
  const [copied, setCopied] = useState(false);

  const tag = locale === 'tr' ? content.tag_tr : content.tag_en;
  const title = locale === 'tr' ? content.title_tr : content.title_en;
  const snippet = content.code_snippet || '';
  const lang = content.code_language || 'bash';

  const copyCode = () => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="builder-section builder-terminal"
      style={{
        padding: '3rem 1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      {tag && (
        <span
          className="page-tag"
          style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '0.75rem',
          }}
        >
          {tag}
        </span>
      )}

      {title && (
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', margin: '0 0 1.25rem 0' }}>
          {title}
        </h3>
      )}

      <div
        style={{
          background: '#09090b',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* Terminal Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 1rem',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          </div>

          <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>
            {lang.toUpperCase()}
          </span>

          <button
            type="button"
            onClick={copyCode}
            style={{
              background: 'transparent',
              border: 'none',
              color: copied ? '#2ecc71' : 'rgba(255,255,255,0.6)',
              fontSize: '0.7rem',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            {copied ? '✓ Kopyalandı' : 'Kopyala'}
          </button>
        </div>

        {/* Terminal Body */}
        <pre
          style={{
            padding: '1.25rem',
            margin: 0,
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            lineHeight: 1.6,
            color: '#ececec',
            overflowX: 'auto',
          }}
        >
          <code>{snippet}</code>
        </pre>
      </div>
    </section>
  );
}
