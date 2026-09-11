/**
 * BOOKOS — Footer & Back to Tiyatrotist Link
 */

'use client';

import Link from 'next/link';
import { Locale, Dictionary } from '@/dictionaries';

interface BookOSFooterProps {
  lang: Locale;
  dict: Dictionary;
}

export default function BookOSFooter({ lang, dict }: BookOSFooterProps) {
  const b = dict.bookos;

  return (
    <footer className="bookos-footer">
      <div className="bookos-footer__content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="bookos-header__logo-icon" />
          <span style={{ fontWeight: 700, letterSpacing: '0.1em' }}>BOOKOS</span>
          <span className="bookos-footer__copy" style={{ marginLeft: '1rem' }}>
            © {new Date().getFullYear()} Tiyatrotist — All Rights Reserved.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a
            href="https://github.com/Tiyatrotist"
            target="_blank"
            rel="noopener noreferrer"
            className="bookos-header__link"
          >
            GitHub ↗
          </a>

          <Link href={`/${lang}`} className="bookos-header__back-btn">
            {b.backToMain}
          </Link>
        </div>
      </div>
    </footer>
  );
}
