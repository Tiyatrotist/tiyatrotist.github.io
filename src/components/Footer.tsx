/**
 * TIYATROTIST — Footer
 * Minimal monochrome footer with functional internal navigation and external social links.
 */

'use client';

import Link from 'next/link';

const INTERNAL_NAV = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'About', path: '/about' },
  { label: 'Now', path: '/now' },
  { label: 'Contact', path: '/contact' },
];

const EXTERNAL_LINKS = [
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'X', url: 'https://x.com' },
  { label: 'Instagram', url: 'https://instagram.com' },
  { label: 'YouTube', url: 'https://youtube.com' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__content">
        <div className="site-footer__nav">
          {INTERNAL_NAV.map((item) => (
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

        <p className="site-footer__copy">
          TIYATROTIST © {new Date().getFullYear()} — PURE MONOCHROME DIGITAL SPACE
        </p>
      </div>
    </footer>
  );
}
