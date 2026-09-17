/**
 * TIYATROTIST — Custom Zero-Dependency Markdown Renderer
 *
 * Designed exclusively for Tiyatrotist's pure monochrome,
 * technical, minimal typography.
 * Supports:
 * - H1, H2, H3 headings with anchor links & subtle borders
 * - Terminal code blocks with copy-to-clipboard action
 * - Blockquotes with monochrome accent line
 * - Unordered & ordered lists with custom bullet spacing
 * - Inline formatting: bold, italic, inline code, hyperlinks.
 */

'use client';

import React, { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      style={{
        margin: '1.5rem 0',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        background: '#0a0a0a',
        overflow: 'hidden',
      }}
    >
      {/* Terminal Titlebar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.45rem 0.85rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.7rem',
          fontFamily: 'monospace',
          color: 'rgba(255, 255, 255, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ marginLeft: '0.5rem', letterSpacing: '0.1em' }}>{language ? language.toUpperCase() : 'CODE'}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            fontSize: '0.65rem',
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            padding: '0.2rem 0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: copied ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
            background: copied ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
            borderRadius: '2px',
            transition: 'all 0.2s ease',
          }}
          data-cursor="expand"
        >
          {copied ? '✓ KOPYALANDI' : 'KOPYALA'}
        </button>
      </div>

      {/* Code Text */}
      <pre
        style={{
          padding: '1rem',
          margin: 0,
          overflowX: 'auto',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: '#e0e0e0',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Parses inline markdown: bold, italic, code, links
 */
function renderInline(text: string): React.ReactNode {
  // Split by inline code: `code`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '0.82em',
            padding: '0.15em 0.4em',
            borderRadius: '3px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Process bold, italic, links in regular text
    // Replace markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const subParts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        subParts.push(renderFormatting(part.slice(lastIndex, match.index), `${i}-${lastIndex}`));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      subParts.push(
        <a
          key={`link-${i}-${match.index}`}
          href={linkUrl}
          target={linkUrl.startsWith('http') ? '_blank' : undefined}
          rel={linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          style={{
            color: '#ffffff',
            borderBottom: '1px dotted rgba(255, 255, 255, 0.6)',
            textDecoration: 'none',
          }}
          data-cursor="expand"
        >
          {linkText} ↗
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < part.length) {
      subParts.push(renderFormatting(part.slice(lastIndex), `${i}-${lastIndex}`));
    }

    return <React.Fragment key={i}>{subParts}</React.Fragment>;
  });
}

function renderFormatting(text: string, keyPrefix: string): React.ReactNode {
  // Bold **text**
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);

  return boldParts.map((bPart, bIdx) => {
    if (bPart.startsWith('**') && bPart.endsWith('**')) {
      return (
        <strong key={`${keyPrefix}-b-${bIdx}`} style={{ fontWeight: 600, color: '#ffffff' }}>
          {bPart.slice(2, -2)}
        </strong>
      );
    }

    // Italic *text* or _text_
    const italicParts = bPart.split(/(\*[^*]+\*)/g);
    return italicParts.map((itPart, itIdx) => {
      if (itPart.startsWith('*') && itPart.endsWith('*')) {
        return (
          <em key={`${keyPrefix}-it-${bIdx}-${itIdx}`} style={{ fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.9)' }}>
            {itPart.slice(1, -1)}
          </em>
        );
      }
      return itPart;
    });
  });
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;

  // Split by code blocks first
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div
      className={className}
      style={{
        fontSize: '0.95rem',
        lineHeight: 1.85,
        color: 'rgba(255, 255, 255, 0.8)',
      }}
    >
      {blocks.map((block, blockIndex) => {
        // Code Block
        if (block.startsWith('```') && block.endsWith('```')) {
          const firstLineEnd = block.indexOf('\n');
          const language = block.slice(3, firstLineEnd).trim();
          const code = block.slice(firstLineEnd + 1, -3).trim();
          return <CodeBlock key={blockIndex} code={code} language={language} />;
        }

        // Normal text lines
        const lines = block.split('\n');
        const elements: React.ReactNode[] = [];
        let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
        let currentQuote: string[] = [];

        const flushQuote = (key: string) => {
          if (currentQuote.length > 0) {
            elements.push(
              <blockquote
                key={key}
                style={{
                  margin: '1.25rem 0',
                  padding: '0.75rem 1.25rem',
                  borderLeft: '2px solid rgba(255, 255, 255, 0.4)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  fontStyle: 'italic',
                  color: 'rgba(255, 255, 255, 0.75)',
                }}
              >
                {currentQuote.map((qLine, qIdx) => (
                  <p key={qIdx} style={{ margin: qIdx > 0 ? '0.5rem 0 0 0' : 0 }}>
                    {renderInline(qLine)}
                  </p>
                ))}
              </blockquote>
            );
            currentQuote = [];
          }
        };

        const flushList = (key: string) => {
          if (currentList) {
            if (currentList.type === 'ul') {
              elements.push(
                <ul
                  key={key}
                  style={{
                    margin: '1rem 0 1.25rem 1.5rem',
                    padding: 0,
                    listStyleType: 'square',
                  }}
                >
                  {currentList.items.map((item, itemIdx) => (
                    <li key={itemIdx} style={{ marginBottom: '0.35rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                      {renderInline(item)}
                    </li>
                  ))}
                </ul>
              );
            } else {
              elements.push(
                <ol
                  key={key}
                  style={{
                    margin: '1rem 0 1.25rem 1.5rem',
                    padding: 0,
                  }}
                >
                  {currentList.items.map((item, itemIdx) => (
                    <li key={itemIdx} style={{ marginBottom: '0.35rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                      {renderInline(item)}
                    </li>
                  ))}
                </ol>
              );
            }
            currentList = null;
          }
        };

        lines.forEach((line, lineIdx) => {
          const trimmed = line.trim();

          // Horizontal rule
          if (trimmed === '---' || trimmed === '***') {
            flushQuote(`quote-${blockIndex}-${lineIdx}`);
            flushList(`list-${blockIndex}-${lineIdx}`);
            elements.push(
              <hr
                key={`hr-${blockIndex}-${lineIdx}`}
                style={{
                  border: 'none',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  margin: '2rem 0',
                }}
              />
            );
            return;
          }

          // H1
          if (line.startsWith('# ')) {
            flushQuote(`quote-${blockIndex}-${lineIdx}`);
            flushList(`list-${blockIndex}-${lineIdx}`);
            const text = line.slice(2).trim();
            const headingId = text.toLowerCase().replace(/[^a-z0-9ğüşıöç\s-]/g, '').replace(/\s+/g, '-');
            elements.push(
              <h1
                key={`h1-${blockIndex}-${lineIdx}`}
                id={headingId}
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  margin: '2.5rem 0 1rem 0',
                  letterSpacing: '-0.02em',
                  scrollMarginTop: '100px',
                }}
              >
                {renderInline(text)}
              </h1>
            );
            return;
          }

          // H2
          if (line.startsWith('## ')) {
            flushQuote(`quote-${blockIndex}-${lineIdx}`);
            flushList(`list-${blockIndex}-${lineIdx}`);
            const text = line.slice(3).trim();
            const headingId = text.toLowerCase().replace(/[^a-z0-9ğüşıöç\s-]/g, '').replace(/\s+/g, '-');
            elements.push(
              <h2
                key={`h2-${blockIndex}-${lineIdx}`}
                id={headingId}
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  margin: '2rem 0 0.85rem 0',
                  letterSpacing: '-0.01em',
                  scrollMarginTop: '100px',
                }}
              >
                {renderInline(text)}
              </h2>
            );
            return;
          }

          // H3
          if (line.startsWith('### ')) {
            flushQuote(`quote-${blockIndex}-${lineIdx}`);
            flushList(`list-${blockIndex}-${lineIdx}`);
            const text = line.slice(4).trim();
            const headingId = text.toLowerCase().replace(/[^a-z0-9ğüşıöç\s-]/g, '').replace(/\s+/g, '-');
            elements.push(
              <h3
                key={`h3-${blockIndex}-${lineIdx}`}
                id={headingId}
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 500,
                  color: '#ffffff',
                  margin: '1.5rem 0 0.65rem 0',
                  scrollMarginTop: '100px',
                }}
              >
                {renderInline(text)}
              </h3>
            );
            return;
          }

          // Blockquote
          if (line.startsWith('> ')) {
            flushList(`list-${blockIndex}-${lineIdx}`);
            currentQuote.push(line.slice(2));
            return;
          } else {
            flushQuote(`quote-${blockIndex}-${lineIdx}`);
          }

          // Unordered List (- item or * item)
          if (/^[-*]\s+/.test(line)) {
            const itemText = line.replace(/^[-*]\s+/, '');
            if (!currentList || currentList.type !== 'ul') {
              flushList(`list-${blockIndex}-${lineIdx}`);
              currentList = { type: 'ul', items: [itemText] };
            } else {
              currentList.items.push(itemText);
            }
            return;
          }

          // Ordered List (1. item)
          if (/^\d+\.\s+/.test(line)) {
            const itemText = line.replace(/^\d+\.\s+/, '');
            if (!currentList || currentList.type !== 'ol') {
              flushList(`list-${blockIndex}-${lineIdx}`);
              currentList = { type: 'ol', items: [itemText] };
            } else {
              currentList.items.push(itemText);
            }
            return;
          }

          // If regular line, flush list
          flushList(`list-${blockIndex}-${lineIdx}`);

          // Empty line
          if (!trimmed) {
            return;
          }

          // Paragraph
          elements.push(
            <p
              key={`p-${blockIndex}-${lineIdx}`}
              style={{
                margin: '0.85rem 0',
                lineHeight: 1.8,
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              {renderInline(line)}
            </p>
          );
        });

        flushQuote(`quote-${blockIndex}-end`);
        flushList(`list-${blockIndex}-end`);

        return <React.Fragment key={blockIndex}>{elements}</React.Fragment>;
      })}
    </div>
  );
}
