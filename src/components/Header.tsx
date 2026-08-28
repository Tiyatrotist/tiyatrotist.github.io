/**
 * TIYATROTIST — Header
 * Minimal, centered navigation with subtle TR / EN language switcher.
 * Left side remains 100% empty per design rules.
 * Mobile: hamburger icon → fullscreen overlay nav.
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const pathname = usePathname();

  // Scroll hide/show logic (desktop & mobile)
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const navItems = [
    { label: dict.nav.home, path: `/${lang}` },
    { label: dict.nav.projects, path: `/${lang}/projects` },
    { label: dict.nav.about, path: `/${lang}/about` },
    { label: dict.nav.blog, path: `/${lang}/blog` },
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
    <>
      <header
        ref={headerRef}
        className={`site-header ${hidden && !mobileMenuOpen ? 'site-header--hidden' : ''}`}
      >
        {/* Desktop Nav */}
        <nav className="site-header__nav site-header__nav--desktop">
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

        {/* Mobile Hamburger Button */}
        <button
          className={`site-header__hamburger ${mobileMenuOpen ? 'site-header__hamburger--active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span className="site-header__hamburger-line" />
          <span className="site-header__hamburger-line" />
          <span className="site-header__hamburger-line" />
        </button>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'mobile-menu-overlay--open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="mobile-menu-overlay__nav">
          {navItems.map((item) => {
            const isActive =
              item.path === `/${lang}`
                ? pathname === `/${lang}`
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.label}
                href={item.path}
                className={`mobile-menu-overlay__link ${isActive ? 'mobile-menu-overlay__link--active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Language Switcher in Mobile Menu */}
          <div className="mobile-menu-overlay__lang">
            <Link
              href={getLangSwitchPath('tr')}
              onClick={() => {
                handleLangSwitch('tr');
                setMobileMenuOpen(false);
              }}
              className={`mobile-menu-overlay__lang-btn ${lang === 'tr' ? 'mobile-menu-overlay__lang-btn--active' : ''}`}
            >
              TR
            </Link>
            <span className="mobile-menu-overlay__lang-divider">/</span>
            <Link
              href={getLangSwitchPath('en')}
              onClick={() => {
                handleLangSwitch('en');
                setMobileMenuOpen(false);
              }}
              className={`mobile-menu-overlay__lang-btn ${lang === 'en' ? 'mobile-menu-overlay__lang-btn--active' : ''}`}
            >
              EN
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
