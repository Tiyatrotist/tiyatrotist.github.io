/**
 * TIYATROTIST — Footer
 * Minimal monochrome footer with localized internal navigation, social links, and hidden Aperture Terminal trigger.
 */

'use client';

import Link from 'next/link';
import { Locale, Dictionary } from '@/dictionaries';

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

const EXTERNAL_LINKS = [
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'X', url: 'https://x.com' },
  { label: 'Instagram', url: 'https://instagram.com' },
  { label: 'YouTube', url: 'https://youtube.com' },
];

export default function Footer({ lang, dict }: FooterProps) {
  const internalNav = [
    { label: dict.nav.home, path: `/${lang}` },
    { label: dict.nav.projects, path: `/${lang}/projects` },
    { label: dict.nav.about, path: `/${lang}/about` },
    { label: dict.nav.now, path: `/${lang}/now` },
    { label: dict.nav.contact, path: `/${lang}/contact` },
  ];

  const triggerAperture = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-aperture-terminal'));
    }
  };

  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <div className="site-footer__nav">
          {internalNav.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className="site-footer__link"
              data-cursor="expand"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="site-footer__social">
          {EXTERNAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__external-link"
              data-cursor="expand"
            >
              {item.label} ↗
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <p className="site-footer__copy">{dict.footer.copy}</p>
          <button
            onClick={triggerAperture}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              color: 'rgba(255, 255, 255, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.15rem 0.4rem',
              borderRadius: '3px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            title="Press ` or type 'portal' / 'cake' / Konami code"
          >
            [ SYS_INIT ]
          </button>
        </div>
      </div>
    </footer>
  );
}
