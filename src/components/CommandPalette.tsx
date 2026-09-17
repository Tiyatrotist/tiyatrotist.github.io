/**
 * TIYATROTIST — Minimalist Command Palette (Spotlight / Ctrl+K)
 *
 * Universal keyboard navigation interface.
 * Open with Ctrl+K or Cmd+K or clicking [ ⌘K ] badge.
 * Navigates across pages, projects, mini games, blog posts, and quick system toggles.
 */

'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Locale, getDictionary } from '@/dictionaries';

interface PaletteItem {
  id: string;
  category: 'PAGES' | 'PROJECTS' | 'LABS' | 'BLOG' | 'ACTIONS';
  title: string;
  subtitle?: string;
  badge?: string;
  keywords?: string[];
  action: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [blogItems, setBlogItems] = useState<PaletteItem[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Detect current language from pathname
  const currentLang: Locale = pathname?.startsWith('/en') ? 'en' : 'tr';
  const dict = getDictionary(currentLang);
  const cp = dict.commandPalette;

  // Fetch published blog posts for searchability
  useEffect(() => {
    async function loadBlogPosts() {
      try {
        const { data } = await supabase
          .from('blog_posts')
          .select('slug, title_tr, title_en, category')
          .eq('published', true)
          .limit(10);

        if (data) {
          const items: PaletteItem[] = data.map((post) => ({
            id: `blog-${post.slug}`,
            category: 'BLOG',
            title: (currentLang === 'tr' ? post.title_tr : post.title_en) || post.title_tr || post.slug,
            subtitle: post.category || 'Blog',
            badge: 'YAZI',
            keywords: [post.slug, 'blog', 'makale', 'article'],
            action: () => {
              router.push(`/${currentLang}/blog/${post.slug}`);
              setIsOpen(false);
            },
          }));
          setBlogItems(items);
        }
      } catch (err) {
        console.debug('[CommandPalette] Error loading blog posts:', err);
      }
    }
    loadBlogPosts();
  }, [currentLang, router]);

  // Static items for search
  const baseItems: PaletteItem[] = useMemo(
    () => [
      // PAGES
      {
        id: 'page-home',
        category: 'PAGES',
        title: currentLang === 'tr' ? 'Ana Sayfa' : 'Home',
        subtitle: currentLang === 'tr' ? 'Monokrom Dijital Ortam' : 'Monochrome Digital Environment',
        badge: 'PAGE',
        keywords: ['home', 'landing', 'main', 'ana sayfa'],
        action: () => {
          router.push(`/${currentLang}`);
          setIsOpen(false);
        },
      },
      {
        id: 'page-projects',
        category: 'PAGES',
        title: currentLang === 'tr' ? 'Projeler' : 'Projects',
        subtitle: currentLang === 'tr' ? 'Tüm dijital sistemler ve araçlar' : 'All digital systems & tools',
        badge: 'PAGE',
        keywords: ['projects', 'işler', 'projeler', 'works'],
        action: () => {
          router.push(`/${currentLang}/projects`);
          setIsOpen(false);
        },
      },
      {
        id: 'page-about',
        category: 'PAGES',
        title: currentLang === 'tr' ? 'Hakkında & Zaman Çizelgesi' : 'About & Timeline',
        subtitle: currentLang === 'tr' ? 'Manifesto ve gelişim kronolojisi' : 'Manifesto and evolution timeline',
        badge: 'PAGE',
        keywords: ['about', 'hakkında', 'timeline', 'manifesto', 'vizyon'],
        action: () => {
          router.push(`/${currentLang}/about`);
          setIsOpen(false);
        },
      },
      {
        id: 'page-blog',
        category: 'PAGES',
        title: 'Blog',
        subtitle: currentLang === 'tr' ? 'Yazılar, manifestolar ve teknik notlar' : 'Essays, manifestos and technical notes',
        badge: 'PAGE',
        keywords: ['blog', 'yazılar', 'articles', 'posts'],
        action: () => {
          router.push(`/${currentLang}/blog`);
          setIsOpen(false);
        },
      },
      {
        id: 'page-contact',
        category: 'PAGES',
        title: currentLang === 'tr' ? 'İletişim' : 'Contact',
        subtitle: currentLang === 'tr' ? 'Doğrudan temas kanalları' : 'Direct contact channels',
        badge: 'PAGE',
        keywords: ['contact', 'iletişim', 'mail', 'mesaj'],
        action: () => {
          router.push(`/${currentLang}/contact`);
          setIsOpen(false);
        },
      },

      // PROJECTS
      {
        id: 'project-typeflow',
        category: 'PROJECTS',
        title: 'TypeFlow',
        subtitle: 'Minimalist Kinetic Typography & Speed Instrument',
        badge: 'PROJECT',
        keywords: ['typeflow', 'typing', 'hızlı yazma', 'klavye'],
        action: () => {
          router.push(`/${currentLang}/projects/typeflow`);
          setIsOpen(false);
        },
      },
      {
        id: 'project-bookos',
        category: 'PROJECTS',
        title: 'BookOS',
        subtitle: 'The Minimalist Web-Based Reading & Publishing System',
        badge: 'PROJECT',
        keywords: ['bookos', 'kitap', 'reader', 'publishing'],
        action: () => {
          router.push(`/${currentLang}/projects/bookos`);
          setIsOpen(false);
        },
      },
      {
        id: 'project-sandbox',
        category: 'PROJECTS',
        title: 'Particle Sandbox',
        subtitle: currentLang === 'tr' ? 'İnteraktif monokrom parçacık fiziği laboratuvarı' : 'Interactive monochrome particle physics laboratory',
        badge: 'PROJECT',
        keywords: ['sandbox', 'kum', 'fizik', 'physics', 'partikül', 'canvas', 'proje'],
        action: () => {
          router.push(`/${currentLang}/projects/sandbox`);
          setIsOpen(false);
        },
      },

      // LABS & GAMES
      {
        id: 'lab-breaker',
        category: 'LABS',
        title: 'Dot Breaker',
        subtitle: currentLang === 'tr' ? 'Monokrom piksel kırma oyunu' : 'Monochrome arcade dot breaker',
        badge: 'GAME',
        keywords: ['game', 'oyun', 'breaker', 'dot breaker', 'brick'],
        action: () => {
          window.dispatchEvent(new CustomEvent('open-dot-breaker'));
          setIsOpen(false);
        },
      },

      // ACTIONS
      {
        id: 'action-terminal',
        category: 'ACTIONS',
        title: currentLang === 'tr' ? 'Monokrom Terminali Aç (~ / Ctrl+~)' : 'Open Monochrome Terminal (~ / Ctrl+~)',
        subtitle: currentLang === 'tr' ? 'Geliştiriciler için interaktif CLI konsolu' : 'Interactive CLI console for developers',
        badge: 'CLI',
        keywords: ['terminal', 'cli', 'bash', 'konsol', 'komut'],
        action: () => {
          window.dispatchEvent(new CustomEvent('open-tiyatrotist-terminal'));
          setIsOpen(false);
        },
      },
      {
        id: 'action-lang',
        category: 'ACTIONS',
        title: currentLang === 'tr' ? 'Switch Language to English (EN)' : 'Dili Türkçe Olarak Değiştir (TR)',
        subtitle: currentLang === 'tr' ? 'Change platform language' : 'Platform dilini değiştir',
        badge: 'LANG',
        keywords: ['dil', 'language', 'tr', 'en', 'english', 'türkçe'],
        action: () => {
          const target = currentLang === 'tr' ? 'en' : 'tr';
          localStorage.setItem('preferred_lang', target);
          document.cookie = `preferred_lang=${target};path=/;max-age=31536000`;
          const segments = pathname.split('/').filter(Boolean);
          segments[0] = target;
          router.push('/' + segments.join('/'));
          setIsOpen(false);
        },
      },
      {
        id: 'action-pulse',
        category: 'ACTIONS',
        title: currentLang === 'tr' ? 'Kuantum Partikül Nabzı (Matrix Pulse)' : 'Trigger Quantum Particle Pulse',
        subtitle: currentLang === 'tr' ? 'Arka plandaki tüm noktacıkları dalgalandırır' : 'Distorts background dot grid',
        badge: 'EFFECT',
        keywords: ['pulse', 'matrix', 'partikül', 'dalga', 'animasyon'],
        action: () => {
          window.dispatchEvent(new CustomEvent('aperture-pulse'));
          setIsOpen(false);
        },
      },
    ],
    [currentLang, pathname, router]
  );

  const allItems = useMemo(() => [...baseItems, ...blogItems], [baseItems, blogItems]);

  // Filtered items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase().trim();
    return allItems.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSub = item.subtitle?.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchSub || matchCat || matchKeywords;
    });
  }, [allItems, query]);

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: PaletteItem[] } = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard shortcut listener: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Navigation with Up/Down/Enter
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) {
        current.action();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  let flatCounter = 0;

  return (
    <div
      className="command-palette-backdrop"
      onClick={() => setIsOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '12vh 1rem 2rem 1rem',
      }}
    >
      <div
        className="command-palette-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          background: '#090909',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '8px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '70vh',
        }}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.02)',
            gap: '0.75rem',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', color: 'rgba(255, 255, 255, 0.4)', userSelect: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyDown={handleKeyNavigation}
            placeholder={cp.placeholder}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          />
          <kbd
            style={{
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.4)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '0.15rem 0.45rem',
              borderRadius: '3px',
              userSelect: 'none',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          style={{
            padding: '0.5rem',
            overflowY: 'auto',
            flex: 1,
            maxHeight: '440px',
          }}
        >
          {filteredItems.length === 0 ? (
            <div
              style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
              }}
            >
              [ {currentLang === 'tr' ? 'Eşleşen sonuç bulunamadı' : 'No matching results found'} ]
            </div>
          ) : (
            Object.entries(groupedItems).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: '0.5rem' }}>
                <div
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.65rem',
                    fontFamily: 'monospace',
                    letterSpacing: '0.15em',
                    color: 'rgba(255, 255, 255, 0.35)',
                    textTransform: 'uppercase',
                  }}
                >
                  {cat === 'PAGES'
                    ? (cp?.categories?.pages || 'SAYFALAR')
                    : cat === 'PROJECTS'
                    ? (cp?.categories?.projects || 'PROJELER')
                    : cat === 'LABS'
                    ? (cp?.categories?.labs || 'LABS')
                    : cat === 'BLOG'
                    ? (cp?.categories?.blog || 'BLOG')
                    : cat === 'ACTIONS'
                    ? (cp?.categories?.actions || 'EYLEMLER')
                    : cat}
                </div>
                {items.map((item) => {
                  const thisIndex = flatCounter++;
                  const isSelected = thisIndex === selectedIndex;

                  return (
                    <div
                      key={item.id}
                      data-selected={isSelected}
                      onClick={() => {
                        item.action();
                      }}
                      onMouseEnter={() => setSelectedIndex(thisIndex)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '4px',
                        background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        border: `1px solid ${isSelected ? 'rgba(255, 255, 255, 0.2)' : 'transparent'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        transition: 'all 0.1s ease',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: isSelected ? 600 : 400,
                            color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                          }}
                        >
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              color: 'rgba(255, 255, 255, 0.45)',
                              fontFamily: 'monospace',
                            }}
                          >
                            {item.subtitle}
                          </span>
                        )}
                      </div>

                      {item.badge && (
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.62rem',
                            letterSpacing: '0.08em',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '3px',
                            background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                            color: isSelected ? '#000000' : 'rgba(255, 255, 255, 0.6)',
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer info bar */}
        <div
          style={{
            padding: '0.5rem 1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.015)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.68rem',
            fontFamily: 'monospace',
            color: 'rgba(255, 255, 255, 0.35)',
          }}
        >
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <span>{cp?.shortcuts?.navigate || (currentLang === 'tr' ? '↑↓ Gezin' : '↑↓ Navigate')}</span>
            <span>{cp?.shortcuts?.select || (currentLang === 'tr' ? '↵ Seç' : '↵ Select')}</span>
            <span>{cp?.shortcuts?.exit || (currentLang === 'tr' ? 'ESC Çık' : 'ESC Exit')}</span>
          </div>
          <span>TIYATROTIST // SPOTLIGHT</span>
        </div>
      </div>
    </div>
  );
}
