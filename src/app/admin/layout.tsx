/**
 * TIYATROTIST — Admin Layout
 *
 * Authenticated admin shell with sidebar navigation.
 * Auth guard: redirects unauthenticated users to /admin/login.
 * Owner check: denies non-owner authenticated users.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { supabase, OWNER_ID } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import { setAdminCookies, clearAdminCookies } from '@/lib/admin-auth';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import './admin.css';

type AuthState = 'loading' | 'authenticated' | 'denied' | 'unauthenticated';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locale, setLocale] = useState<AdminLocale>('tr');
  const pathname = usePathname();

  const dict = getAdminDict(locale);

  // Skip auth check for login page (account for trailing slash)
  const isLoginPage = pathname?.startsWith('/admin/login');

  useEffect(() => {
    if (isLoginPage) {
      setAuthState('authenticated'); // Login page manages its own auth
      return;
    }

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.debug('[admin/layout] Session check:', session?.user?.id ?? 'none');

        if (!session?.user) {
          console.debug('[admin/layout] No session, clearing cookies and redirecting to login…');
          clearAdminCookies();
          if (!window.location.pathname.startsWith('/admin/login')) {
            window.location.href = '/admin/login';
          }
          return;
        }

        if (session.user.id !== OWNER_ID) {
          console.debug('[admin/layout] Non-owner user:', session.user.id);
          clearAdminCookies();
          setAuthState('denied');
          return;
        }

        // Refresh/confirm admin session cookies
        if (session.access_token) {
          setAdminCookies({
            token: session.access_token,
            email: session.user.email || '',
            role: 'owner',
          });
        }

        setAuthState('authenticated');
      } catch (err) {
        console.debug('[admin/layout] Auth check error:', err);
        clearAdminCookies();
        if (!window.location.pathname.startsWith('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.debug('[admin/layout] Auth state change:', event);
      if (event === 'SIGNED_OUT') {
        clearAdminCookies();
        if (!window.location.pathname.startsWith('/admin/login')) {
          window.location.href = '/admin/login';
        }
      } else if (event === 'SIGNED_IN' && session?.user?.id === OWNER_ID && session.access_token) {
        setAdminCookies({
          token: session.access_token,
          email: session.user.email || '',
          role: 'owner',
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [isLoginPage]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Persist locale preference
  useEffect(() => {
    const stored = localStorage.getItem('admin_locale') as AdminLocale;
    if (stored === 'tr' || stored === 'en') setLocale(stored);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === 'tr' ? 'en' : 'tr';
      localStorage.setItem('admin_locale', next);
      return next;
    });
  }, []);

  // Login page renders without shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (authState === 'loading') {
    return (
      <div className="admin-root">
        <LoadingSpinner text={dict.common.loading} large center />
      </div>
    );
  }

  // Access denied state
  if (authState === 'denied') {
    return (
      <div className="admin-root">
        <div className="admin-denied">
          <h1>{dict.common.accessDenied}</h1>
          <p>{dict.common.accessDeniedMsg}</p>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/admin/login';
            }}
          >
            {dict.nav.logout}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <div className="admin-layout">
        <Sidebar dict={dict} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="admin-main">
          <AdminHeader
            locale={locale}
            onToggleLocale={toggleLocale}
            onToggleSidebar={() => setSidebarOpen((o) => !o)}
          />
          <div className="admin-content">
            {/* Pass locale and dict to children via context-like props */}
            {/* Since we can't use React context across server/client boundary easily,
                each page will call getAdminDict() independently */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
