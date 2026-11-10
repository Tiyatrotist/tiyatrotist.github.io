/**
 * TIYATROTIST — Studio Live Article Preview & Split Editor
 *
 * Renders the live editorial article layout matching Tiyatrotist's public design.
 * Features dual language toggle (TR / EN), split markdown editor, and instant asset sync.
 */

'use client';

import React, { useState } from 'react';
import { BlogStudioDraft } from '@/types/blog-studio';
import { syncMarkdownWithAssets } from '@/lib/blog-studio/generator';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import SplitMarkdownEditor from '@/components/admin/SplitMarkdownEditor';

interface StudioLiveArticleProps {
  draft: BlogStudioDraft;
  onUpdateDraft: (updated: BlogStudioDraft) => void;
}

export default function StudioLiveArticle({ draft, onUpdateDraft }: StudioLiveArticleProps) {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [viewMode, setViewMode] = useState<'preview' | 'split'>('preview');

  const content = lang === 'tr' ? draft.content_tr : draft.content_en;
  const title = lang === 'tr' ? draft.title_tr : draft.title_en;
  const excerpt = lang === 'tr' ? draft.excerpt_tr : draft.excerpt_en;

  const resolvedContent = syncMarkdownWithAssets(content, draft.visualAssets);

  const handleContentChange = (newContent: string) => {
    if (lang === 'tr') {
      onUpdateDraft({ ...draft, content_tr: newContent });
    } else {
      onUpdateDraft({ ...draft, content_en: newContent });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language Tabs */}
          <div className="admin-tabs" style={{ margin: 0, padding: 0, border: 'none' }}>
            <button
              type="button"
              onClick={() => setLang('tr')}
              className={`admin-tab ${lang === 'tr' ? 'active' : ''}`}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem' }}
            >
              Türkçe (TR)
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`admin-tab ${lang === 'en' ? 'active' : ''}`}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem' }}
            >
              English (EN)
            </button>
          </div>

          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`admin-tab ${viewMode === 'preview' ? 'active' : ''}`}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem' }}
            >
              ✦ Canlı Makale Önizlemesi
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`admin-tab ${viewMode === 'split' ? 'active' : ''}`}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.7rem' }}
            >
              ✎ Markdown Split Düzenleyici
            </button>
          </div>
        </div>

        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
          Görseller: {draft.visualAssets.filter((a) => a.status === 'ready').length} / {draft.visualAssets.length} yerleşti
        </div>
      </div>

      {viewMode === 'split' ? (
        <SplitMarkdownEditor
          value={content}
          onChange={handleContentChange}
          label={`${lang.toUpperCase()} Markdown İçeriği`}
          minHeight="600px"
        />
      ) : (
        /* Real Editorial Presentation Frame */
        <div
          style={{
            maxWidth: '840px',
            margin: '0 auto',
            width: '100%',
            background: '#0a0a0a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '3rem 2.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* Article Header Metadata */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.7rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                letterSpacing: '0.12em',
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                flexWrap: 'wrap',
              }}
            >
              <span>{draft.category || 'MÜHENDİSLİK'}</span>
              <span>{'//'}</span>
              <span>{new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span>{'//'}</span>
              <span>5 DK OKUMA</span>
              {draft.featured && (
                <span
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '2px',
                    fontWeight: 700,
                  }}
                >
                  [ ÖNE ÇIKAN ]
                </span>
              )}
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 600,
                color: '#ffffff',
                lineHeight: 1.25,
                margin: '0 0 1rem 0',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>

            {excerpt && (
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.65)',
                  margin: 0,
                  borderLeft: '2px solid rgba(255, 255, 255, 0.3)',
                  paddingLeft: '1rem',
                }}
              >
                {excerpt}
              </p>
            )}
          </div>

          {/* Cover image if available or first ready image */}
          {draft.cover_image && (
            <div
              style={{
                margin: '2rem 0',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draft.cover_image}
                alt={title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          )}

          {/* Markdown Content */}
          <div style={{ marginTop: '2.5rem' }}>
            <MarkdownRenderer content={resolvedContent} />
          </div>

          {/* Editorial Footer / Colophon */}
          <div
            style={{
              marginTop: '4rem',
              paddingTop: '2rem',
              borderTop: '1px dashed rgba(255, 255, 255, 0.12)',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              color: 'rgba(255, 255, 255, 0.45)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>{'YAZAR: Buğra // Tiyatrotist'}</div>
            <div>{'[ // TIYATROTIST BLOG STUDIO // ]'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
