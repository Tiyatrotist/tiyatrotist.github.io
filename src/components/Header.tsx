/**
 * TIYATROTIST — Header
 * Son derece minimal başlık bileşeni.
 * (Extremely minimal header component)
 *
 * - Sol tarafta HİÇBİR ŞEY yok.
 * - Navigasyon görsel olarak ortalanmış.
 * - Aşağı kaydırmada gizlenir, yukarı kaydırmada görünür.
 * - Sayfa yönlendirmeleri Next.js Link ile gerçek rotalara yapılır.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: 'PROJECTS', path: '/projects' },
  { label: 'ABOUT', path: '/about' },
  { label: 'NOW', path: '/now' },
  { label: 'CONTACT', path: '/contact' },
];

export default function Header() {
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

        // Aşağı kaydırmada gizle (50px eşik), yukarı kaydırmada göster
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

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`site-header ${hidden ? 'site-header--hidden' : ''}`}
    >
      <nav className="site-header__nav">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === '/'
              ? pathname === '/'
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
      </nav>
    </header>
  );
}
