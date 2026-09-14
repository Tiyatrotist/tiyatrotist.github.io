/**
 * TIYATROTIST — Admin Sidebar
 *
 * Unified Navigation Structure:
 * - DASHBOARD
 * - CONTENT (Projects [parent of releases/media], Blog, About, Contact)
 * - MEDIA (Media Library)
 * - SYSTEM (Site Settings, Emergency)
 * - ACCOUNT (View Site, Logout)
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdminDict } from '@/lib/admin-i18n';
import { supabase } from '@/lib/supabase';
import { clearAdminCookies } from '@/lib/admin-auth';

interface SidebarProps {
  dict: AdminDict;
  open: boolean;
  onClose: () => void;
}

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  pages: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
      <path d="M3 7l9 4 9-4" />
      <path d="M12 11v10" />
    </svg>
  ),
  blog: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 8h6m-6 4h6m-6 4h4" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  ),
  media: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  emergency: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  external: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
};

export default function Sidebar({ dict, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    console.debug('[admin] Logging out and clearing cookies…');
    clearAdminCookies();
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  const isLinkActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard' || pathname === '/admin' || pathname === '/admin/';
    }
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`admin-sidebar-backdrop ${open ? 'visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar ${open ? 'open' : ''}`} role="navigation" aria-label="Admin navigation">
        {/* Brand */}
        <div className="admin-sidebar-logo">
          <span>ADMIN CMS</span>
          <h2>TIYATROTIST</h2>
        </div>

        {/* Categorized Navigation */}
        <nav className="admin-sidebar-nav">
          {/* Dashboard */}
          <div className="admin-nav-group">
            <Link
              href="/admin/dashboard"
              className={`admin-nav-link ${isLinkActive('/admin/dashboard') ? 'active' : ''}`}
              onClick={onClose}
              aria-current={isLinkActive('/admin/dashboard') ? 'page' : undefined}
            >
              {icons.dashboard}
              <span>{dict.nav.dashboard}</span>
            </Link>
          </div>

          {/* Content Group */}
          <div className="admin-nav-group">
            <div className="admin-nav-section-title">{dict.nav.content}</div>
            <Link
              href="/admin/projects"
              className={`admin-nav-link ${isLinkActive('/admin/projects') ? 'active' : ''}`}
              onClick={onClose}
              aria-current={isLinkActive('/admin/projects') ? 'page' : undefined}
            >
              {icons.projects}
              <span>{dict.nav.projects}</span>
            </Link>
            <Link
              href="/admin/blog"
              className={`admin-nav-link ${isLinkActive('/admin/blog') ? 'active' : ''}`}
              onClick={onClose}
              aria-current={isLinkActive('/admin/blog') ? 'page' : undefined}
            >
              {icons.blog}
              <span>{dict.nav.blog}</span>
            </Link>
            <Link
              href="/admin/about"
              className={`admin-nav-link ${isLinkActive('/admin/about') ? 'active' : ''}`}
              onClick={onClose}
              aria-current={isLinkActive('/admin/about') ? 'page' : undefined}
            >
              {icons.about}
              <span>{dict.nav.about}</span>
            </Link>
            <Link
              href="/admin/contact"
              className={`admin-nav-link ${isLinkActive('/admin/contact') ? 'active' : ''}`}
              onClick={onClose}
              aria-current={isLinkActive('/admin/contact') ? 'page' : undefined}
            >
              {icons.contact}
              <span>{dict.nav.contact}</span>
            </Link>
          </div>

          {/* Media Group */}
          <div className="admin-nav-group">
            <div className="admin-nav-section-title">{dict.nav.media}</div>
            <Link
              href="/admin/media"
              className={`admin-nav-link ${isLinkActive('/admin/media') ? 'active' : ''}`}
              onClick={onClose}
              aria-current={isLinkActive('/admin/media') ? 'page' : undefined}
            >
              {icons.media}
              <span>{dict.nav.mediaLibrary}</span>
            </Link>
          </div>

          {/* System Group */}
          <div className="admin-nav-group">
            <div className="admin-nav-section-title">{dict.nav.system}</div>
            <Link
              href="/admin/settings"
              className={`admin-nav-link ${isLinkActive('/admin/settings') ? 'active' : ''}`}
              onClick={onClose}
              aria-current={isLinkActive('/admin/settings') ? 'page' : undefined}
            >
              {icons.settings}
              <span>{dict.nav.settings}</span>
            </Link>
            <Link
              href="/admin/emergency"
              className={`admin-nav-link ${isLinkActive('/admin/emergency') ? 'active' : ''}`}
              onClick={onClose}
              aria-current={isLinkActive('/admin/emergency') ? 'page' : undefined}
            >
              {icons.emergency}
              <span>{dict.nav.emergency}</span>
            </Link>
          </div>
        </nav>

        {/* Footer actions (Account) */}
        <div className="admin-sidebar-footer">
          <Link
            href="/"
            className="admin-nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {icons.external}
            <span>{dict.nav.viewSite}</span>
          </Link>
          <button
            className="admin-nav-link"
            onClick={handleLogout}
            type="button"
            aria-label={dict.nav.logout}
          >
            {icons.logout}
            <span>{dict.nav.logout}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
