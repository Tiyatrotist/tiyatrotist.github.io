/**
 * TIYATROTIST — Header
 * Minimal, centered navigation with subtle TR / EN language switcher.
 * Left side remains 100% empty per design rules.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, Dictionary } from '@/dictionaries';

interface HeaderProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Header({ lang, dict }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (delta > 5 && currentY > 80) {
          setHidden(true);
        } else if (delta < -5) {
          setHidden(false);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: dict.nav.home, path: `/${lang}` },
    { label: dict.nav.projects, path: `/${lang}/projects` },
    { label: dict.nav.about, path: `/${lang}/about` },
    { label: dict.nav.now, path: `/${lang}/now` },
    { label: dict.nav.contact, path: `/${lang}/contact` },
  ];

  // Calculate target path for language toggle preserving current subpath
  const getLangSwitchPath = (targetLang: Locale) => {
    if (!pathname) return `/${targetLang}`;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return `/${targetLang}`;
    if (segments[0] === 'tr' || segments[0] === 'en') {
      segments[0] = targetLang;
      return '/' + segments.join('/');
    }
    return `/${targetLang}/${segments.join('/')}`;
  };

  const handleLangSwitch = (targetLang: Locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_lang', targetLang);
      document.cookie = `preferred_lang=${targetLang};path=/;max-age=31536000`;
    }
  };

  return (
    <header
      ref={headerRef}
      className={`site-header ${hidden ? 'site-header--hidden' : ''}`}
    >
      <nav className="site-header__nav">
        {navItems.map((item) => {
          const isActive =
            item.path === `/${lang}`
              ? pathname === `/${lang}`
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`site-header__link ${isActive ? 'site-header__link--active' : ''}`}
              data-cursor="expand"
            >
              {item.label}
            </Link>
          );
        })}

        {/* Minimal Language Switcher */}
        <div className="site-header__lang-switcher">
          <Link
            href={getLangSwitchPath('tr')}
            onClick={() => handleLangSwitch('tr')}
            className={`site-header__lang-btn ${lang === 'tr' ? 'site-header__lang-btn--active' : ''}`}
            data-cursor="expand"
          >
            TR
          </Link>
          <span className="site-header__lang-divider">/</span>
          <Link
            href={getLangSwitchPath('en')}
            onClick={() => handleLangSwitch('en')}
            className={`site-header__lang-btn ${lang === 'en' ? 'site-header__lang-btn--active' : ''}`}
            data-cursor="expand"
          >
            EN
          </Link>
        </div>
      </nav>
    </header>
  );
}
