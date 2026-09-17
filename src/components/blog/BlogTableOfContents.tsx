/**
 * TIYATROTIST — Dynamic Blog Table of Contents (TOC)
 *
 * Automatically parses Markdown headings (H2, H3),
 * highlights the active section in real-time as the reader scrolls,
 * and enables smooth one-click navigation.
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface BlogTableOfContentsProps {
  content: string;
  lang?: 'tr' | 'en';
}

export default function BlogTableOfContents({ content, lang = 'tr' }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Extract headings from markdown text
  const items: TocItem[] = useMemo(() => {
    if (!content) return [];
    const lines = content.split('\n');
    const parsed: TocItem[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        const text = trimmed.slice(3).trim();
        const id = text.toLowerCase().replace(/[^a-z0-9ğüşıöç\s-]/g, '').replace(/\s+/g, '-');
        parsed.push({ id, text, level: 2 });
      } else if (trimmed.startsWith('### ')) {
        const text = trimmed.slice(4).trim();
        const id = text.toLowerCase().replace(/[^a-z0-9ğüşıöç\s-]/g, '').replace(/\s+/g, '-');
        parsed.push({ id, text, level: 3 });
      }
    });

    return parsed;
  }, [content]);

  // Track active heading on scroll
  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Collapsible Header */}
      <div
        className="blog-toc-mobile"
        style={{
          display: 'none', // Shown via media query in globals.css or responsive layout
          marginBottom: '2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
        }}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          <span>[ {lang === 'tr' ? 'İÇİNDEKİLER' : 'TABLE OF CONTENTS'} ]</span>
          <span>{mobileOpen ? '▲' : '▼'}</span>
        </button>

        {mobileOpen && (
          <nav style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeId === item.id ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  paddingLeft: item.level === 3 ? '1.25rem' : '0.25rem',
                  cursor: 'pointer',
                  fontWeight: activeId === item.id ? 600 : 400,
                }}
              >
                {activeId === item.id ? '› ' : ''}
                {item.text}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside
        className="blog-toc-desktop"
        style={{
          position: 'sticky',
          top: '110px',
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'auto',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          padding: '0 0.5rem 1rem 0.5rem',
        }}
      >
        <div
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            color: 'rgba(255, 255, 255, 0.4)',
            marginBottom: '1rem',
            textTransform: 'uppercase',
          }}
        >
          [ {lang === 'tr' ? 'İÇİNDEKİLER' : 'INDEX'} ]
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                data-cursor="expand"
                style={{
                  textDecoration: 'none',
                  fontSize: item.level === 3 ? '0.72rem' : '0.78rem',
                  lineHeight: 1.45,
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '2px solid #ffffff' : '2px solid transparent',
                  paddingLeft: item.level === 3 ? (isActive ? '1.25rem' : '1rem') : isActive ? '0.45rem' : '0',
                }}
              >
                {item.text}
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
