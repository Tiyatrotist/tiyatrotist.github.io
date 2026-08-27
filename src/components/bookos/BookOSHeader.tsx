/**
 * BOOKOS — Header Navigation
 * Compact product navigation bar with logo, section links, and Back to Tiyatrotist.
 */

'use client';

import Link from 'next/link';
import { Locale, Dictionary } from '@/dictionaries';

interface BookOSHeaderProps {
  lang: Locale;
  dict: Dictionary;
}

export default function BookOSHeader({ lang, dict }: BookOSHeaderProps) {
  const b = dict.bookos;

  return (
    <header className="bookos-header">
      <Link href={`/${lang}/projects/bookos`} className="bookos-header__brand">
        <span className="bookos-header__logo">
          <span className="bookos-header__logo-icon" />
          BOOKOS
        </span>
        <span className="bookos-header__badge">{b.badge}</span>
      </Link>

      <nav className="bookos-header__nav">
        <a href="#overview" className="bookos-header__link">{b.navOverview}</a>
        <a href="#showcase" className="bookos-header__link">{b.navShowcase}</a>
        <a href="#features" className="bookos-header__link">{b.navFeatures}</a>
        <a href="#technical" className="bookos-header__link">{b.navTech}</a>
        <a href="#releases" className="bookos-header__link">{b.navReleases}</a>
        <a href="#download" className="bookos-header__link">{b.navDownload}</a>
      </nav>

      <div className="bookos-header__right">
        <Link href={`/${lang}`} className="bookos-header__back-btn">
          {b.backToMain}
        </Link>
      </div>
    </header>
  );
}
