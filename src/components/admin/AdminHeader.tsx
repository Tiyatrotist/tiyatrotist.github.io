/**
 * TIYATROTIST — Admin Header (Top Bar)
 *
 * Sticky top bar with hamburger menu (mobile), breadcrumb context, and language toggle.
 */

'use client';

import { usePathname } from 'next/navigation';
import { AdminLocale, getAdminDict } from '@/lib/admin-i18n';

interface AdminHeaderProps {
  locale: AdminLocale;
  onToggleLocale: () => void;
  onToggleSidebar: () => void;
}

export default function AdminHeader({ locale, onToggleLocale, onToggleSidebar }: AdminHeaderProps) {
  const pathname = usePathname();
  const dict = getAdminDict(locale);

  // Derive breadcrumb from pathname
  const getBreadcrumb = () => {
    if (!pathname || pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/dashboard') {
      return dict.nav.dashboard;
    }
    if (pathname.startsWith('/admin/projects')) {
      if (pathname.includes('/new')) return `${dict.projects.breadcrumb} / ${dict.projects.newProject}`;
      if (pathname.includes('/edit')) return `${dict.projects.breadcrumb} / ${dict.projects.edit}`;
      return dict.projects.breadcrumb;
    }
    if (pathname.startsWith('/admin/blog')) {
      if (pathname.includes('/new')) return `${dict.blog.breadcrumb} / ${dict.blog.newPost}`;
      if (pathname.includes('/edit')) return `${dict.blog.breadcrumb} / ${dict.blog.edit}`;
      return dict.blog.breadcrumb;
    }
    if (pathname.startsWith('/admin/about')) return dict.about.breadcrumb;
    if (pathname.startsWith('/admin/contact')) return dict.contact.breadcrumb;
    if (pathname.startsWith('/admin/media')) return dict.media.breadcrumb;
    if (pathname.startsWith('/admin/settings')) return dict.settings.breadcrumb;
    if (pathname.startsWith('/admin/emergency')) return dict.emergency.breadcrumb;
    return 'Admin';
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          className="admin-hamburger"
          onClick={onToggleSidebar}
          type="button"
          aria-label="Toggle navigation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Subtle Breadcrumb */}
        <div className="admin-breadcrumb" aria-label="Breadcrumb">
          <span className="admin-breadcrumb-segment">{getBreadcrumb()}</span>
        </div>
      </div>

      <div className="admin-topbar-right">
        <button
          className="admin-lang-toggle"
          onClick={onToggleLocale}
          type="button"
          aria-label={`Switch language to ${locale === 'tr' ? 'English' : 'Türkçe'}`}
        >
          {locale === 'tr' ? 'EN' : 'TR'}
        </button>
      </div>
    </header>
  );
}
