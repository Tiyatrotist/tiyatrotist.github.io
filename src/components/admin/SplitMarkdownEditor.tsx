/**
 * TIYATROTIST — Admin Split-View Markdown Editor
 *
 * Provides a live side-by-side editing experience for blog posts.
 * Left: Code editor with quick formatting toolbar
 * Right: Exact monochrome MarkdownRenderer preview
 * Modes: Edit Only | Split View | Preview Only | Zen Fullscreen
 */

'use client';

import React, { useState, useRef } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface SplitMarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
}

type ViewMode = 'split' | 'edit' | 'preview';

export default function SplitMarkdownEditor({
  value,
  onChange,
  label = 'İçerik (Markdown)',
  placeholder = 'Markdown formatında yazınızı buraya yazın...',
  minHeight = '420px',
}: SplitMarkdownEditorProps) {
  const [mode, setMode] = useState<ViewMode>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert markdown syntax at cursor position
  const insertSyntax = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const nextVal = value.substring(0, start) + replacement + value.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarActions = [
    { label: 'H1', title: 'Büyük Başlık (H1)', action: () => insertSyntax('# ', '', 'Başlık 1') },
    { label: 'H2', title: 'Orta Başlık (H2)', action: () => insertSyntax('## ', '', 'Başlık 2') },
    { label: 'H3', title: 'Küçük Başlık (H3)', action: () => insertSyntax('### ', '', 'Başlık 3') },
    { label: 'B', title: 'Kalın (Bold)', action: () => insertSyntax('**', '**', 'kalın metin'), style: { fontWeight: 700 } },
    { label: 'I', title: 'Eğik (Italic)', action: () => insertSyntax('*', '*', 'eğik metin'), style: { fontStyle: 'italic' } },
    { label: '❝', title: 'Alıntı (Quote)', action: () => insertSyntax('> ', '', 'Alıntı metni...') },
    { label: '`<>`', title: 'Kod Bloğu (Code)', action: () => insertSyntax('```typescript\n', '\n```', '// kodlar...') },
    { label: '• List', title: 'Madde İmi (List)', action: () => insertSyntax('- ', '', 'Madde') },
    { label: 'Link', title: 'Bağlantı (Link)', action: () => insertSyntax('[', '](https://...)', 'Bağlantı Başlığı') },
    { label: 'Resim', title: 'Görsel (Image)', action: () => insertSyntax('![Açıklama](', ')', 'https://...') },
    { label: '― HR', title: 'Yatay Çizgi (HR)', action: () => insertSyntax('\n---\n') },
  ];

  return (
    <div
      className={`admin-split-markdown-container ${isFullscreen ? 'zen-fullscreen' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '6px',
        background: '#090909',
        overflow: 'hidden',
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : undefined,
        zIndex: isFullscreen ? 99999 : undefined,
        height: isFullscreen ? '100vh' : 'auto',
      }}
    >
      {/* Editor Header & Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.85rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.72rem',
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.08em',
          }}
        >
          {label.toUpperCase()}
        </span>

        {/* View Mode Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`admin-btn admin-btn-sm ${mode === 'edit' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
          >
            Düzenle
          </button>
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`admin-btn admin-btn-sm ${mode === 'split' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
          >
            ◫ İki Panel (Split)
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`admin-btn admin-btn-sm ${mode === 'preview' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}
          >
            Önizleme
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="admin-btn admin-btn-ghost admin-btn-sm"
            style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', marginLeft: '0.4rem' }}
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Zen Tam Ekran Modu'}
          >
            {isFullscreen ? 'Normale Dön' : 'Zen Modu'}
          </button>
        </div>
      </div>

      {/* Formatting Toolbar (Visible in edit and split modes) */}
      {mode !== 'preview' && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.4rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.015)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {toolbarActions.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={btn.action}
              title={btn.title}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                padding: '0.2rem 0.45rem',
                borderRadius: '3px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                ...btn.style,
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Workspace (Split / Single) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            mode === 'split' ? '1fr 1fr' : mode === 'edit' ? '1fr' : '1fr',
          flex: 1,
          minHeight: isFullscreen ? 'calc(100vh - 85px)' : minHeight,
          overflow: 'hidden',
        }}
      >
        {/* Left / Edit Panel */}
        {mode !== 'preview' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRight: mode === 'split' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
              background: '#0a0a0a',
            }}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              spellCheck={false}
              style={{
                width: '100%',
                height: '100%',
                padding: '1.25rem',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '0.88rem',
                lineHeight: 1.7,
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        {/* Right / Live Preview Panel */}
        {mode !== 'edit' && (
          <div
            style={{
              padding: '1.5rem',
              overflowY: 'auto',
              background: '#040404',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                marginBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                fontFamily: 'monospace',
                fontSize: '0.65rem',
                color: 'rgba(255, 255, 255, 0.35)',
                letterSpacing: '0.1em',
              }}
            >
              <span>CANLI ÖNİZLEME (MARKDOWN RENDERER)</span>
              <span>{value.length} KARAKTER</span>
            </div>

            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontStyle: 'italic',
                  fontSize: '0.85rem',
                  padding: '2rem 0',
                  textAlign: 'center',
                }}
              >
                Sol panelde yazdığınız metin burada anında render edilecektir...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
