/**
 * TIYATROTIST — Interactive Blog List View
 *
 * Provides real-time instant search, category filters,
 * read-time indicators, and pure monochrome cards.
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Locale, Dictionary } from '@/dictionaries';
import { BlogPostItem } from '@/types/blog';

interface BlogListViewProps {
  posts: BlogPostItem[];
  lang: Locale;
  dict: Dictionary;
}

export default function BlogListView({ posts, lang, dict }: BlogListViewProps) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const b = dict.blogPage;

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      (p.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [posts]);

  // Filter posts
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      // Tag filter
      if (selectedTag !== 'all' && !p.tags?.includes(selectedTag)) {
        return false;
      }
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const title = ((lang === 'tr' ? p.title_tr : p.title_en) || '').toLowerCase();
        const excerpt = ((lang === 'tr' ? p.excerpt_tr : p.excerpt_en) || '').toLowerCase();
        const tags = (p.tags || []).join(' ').toLowerCase();
        return title.includes(q) || excerpt.includes(q) || tags.includes(q) || (p.slug || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [posts, selectedTag, search, lang]);

  return (
    <div className="blog-list-root">
      {/* Search & Tag Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Search Input (Terminal Style) */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="blog-search-input"
            placeholder={b.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              outline: 'none',
              transition: 'border-color 0.25s ease',
            }}
          />
        </div>

        {/* Tag Filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
          }}
          role="tablist"
        >
          <button
            type="button"
            style={{
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              letterSpacing: '0.12em',
              padding: '0.35rem 0.75rem',
              border: selectedTag === 'all' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.12)',
              background: selectedTag === 'all' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: selectedTag === 'all' ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
              borderRadius: '2px',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setSelectedTag('all')}
            data-cursor="expand"
          >
            [ {b.filterAll} ]
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                letterSpacing: '0.12em',
                padding: '0.35rem 0.75rem',
                border: selectedTag === tag ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.12)',
                background: selectedTag === tag ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: selectedTag === tag ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                borderRadius: '2px',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setSelectedTag(tag)}
              data-cursor="expand"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Post Cards */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem 1rem',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          }}
        >
          {b.emptyText}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filtered.map((post) => {
            const displayTitle = (lang === 'tr' ? post.title_tr : post.title_en) || post.title_tr || post.title_en || post.slug;
            const displayExcerpt = (lang === 'tr' ? post.excerpt_tr : post.excerpt_en) || post.excerpt_tr || post.excerpt_en || '';
            const readTime = (lang === 'tr' ? post.read_time_tr : post.read_time_en) || (lang === 'tr' ? '4 dk okuma' : '4 min read');
            const dateStr = post.published_at
              ? new Date(post.published_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '';

            return (
              <Link
                key={post.slug}
                href={`/${lang}/blog/${post.slug}`}
                className="blog-card-item"
                data-cursor="expand"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  padding: '2rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: post.featured ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  transition: 'border-color 0.3s ease, background 0.3s ease, transform 0.2s ease',
                }}
              >
                {/* Meta Top Bar */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>
                      {dateStr}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)' }}>
                      {readTime}
                    </span>
                  </div>

                  {post.featured && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontFamily: 'monospace',
                        letterSpacing: '0.1em',
                        color: '#000000',
                        background: '#ffffff',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '2px',
                        fontWeight: 600,
                      }}
                    >
                      ★ {b.featured}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    margin: '0 0 0.75rem 0',
                    lineHeight: 1.35,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {displayTitle}
                </h2>

                {/* Excerpt */}
                {displayExcerpt && (
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.65)',
                      margin: '0 0 1.25rem 0',
                      lineHeight: 1.65,
                    }}
                  >
                    {displayExcerpt}
                  </p>
                )}

                {/* Tags Bottom Bar */}
                {post.tags && post.tags.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.65rem',
                          fontFamily: 'monospace',
                          color: 'rgba(255, 255, 255, 0.4)',
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '2px',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
