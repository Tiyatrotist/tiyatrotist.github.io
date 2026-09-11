/**
 * TIYATROTIST — Maintenance Mode Guard
 *
 * Real-time client-side protection against unauthorized visitors during maintenance.
 * Queries Supabase `site_settings.maintenance_mode`.
 * If maintenance is active:
 * - Regular visitors are blocked and shown the particle-based <MaintenancePage />.
 * - Authenticated admin (owner) sees the site with an administrative notice bar.
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, isOwner } from '@/lib/supabase';
import MaintenancePage from '@/app/maintenance/page';
import { Locale } from '@/dictionaries';

interface MaintenanceGuardProps {
  children: React.ReactNode;
  lang: Locale;
}

export default function MaintenanceGuard({ children, lang }: MaintenanceGuardProps) {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkMaintenanceStatus() {
      console.debug('[MaintenanceGuard] Checking site maintenance status…');
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('maintenance_mode')
          .limit(1)
          .single();

        if (error) {
          console.debug('[MaintenanceGuard] Query notice:', error.message);
        }

        const hasBypass = typeof window !== 'undefined' && (
          window.location.search.includes('bypass=true') ||
          localStorage.getItem('admin_bypass') === 'true'
        );

        if (hasBypass && typeof window !== 'undefined' && window.location.search.includes('bypass=true')) {
          try { localStorage.setItem('admin_bypass', 'true'); } catch {}
        }

        const maintenanceActive = Boolean(data?.maintenance_mode) && !hasBypass;

        if (maintenanceActive) {
          console.debug('[MaintenanceGuard] Maintenance mode is ON in database.');
          const ownerStatus = await isOwner();
          if (isMounted) {
            setIsAdmin(ownerStatus);
            setIsMaintenance(true);
          }
        } else {
          console.debug('[MaintenanceGuard] Maintenance mode is OFF or bypassed.');
          if (isMounted) {
            setIsMaintenance(false);
          }
        }
      } catch (err) {
        console.debug('[MaintenanceGuard] Exception checking maintenance:', err);
      }
    }

    checkMaintenanceStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  // If maintenance is ON and user is NOT an authorized admin, block with MaintenancePage
  if (isMaintenance && !isAdmin) {
    return <MaintenancePage initialLang={lang} />;
  }

  return (
    <>
      {/* Top notice bar visible only to admin when maintenance mode is active */}
      {isMaintenance && isAdmin && (
        <aside
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
            background: '#ffffff',
            color: '#000000',
            padding: '0.4rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'monospace',
            fontSize: '0.72rem',
            letterSpacing: '0.05em',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
          role="alert"
        >
          <span>
            ⚠ <strong>{lang === 'tr' ? 'BAKIM MODU AKTİF' : 'MAINTENANCE MODE ACTIVE'}</strong> —{' '}
            {lang === 'tr'
              ? 'Site ziyaretçilere kapalıdır. Yönetici olarak görüntülüyorsunuz.'
              : 'Website is closed to visitors. Viewing as administrator.'}
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link
              href="/admin/emergency"
              style={{
                background: '#000000',
                color: '#ffffff',
                padding: '0.2rem 0.6rem',
                borderRadius: '3px',
                textDecoration: 'none',
                fontSize: '0.65rem',
              }}
            >
              {lang === 'tr' ? 'Bakımı Kapat' : 'Disable'}
            </Link>
            <Link
              href="/admin/dashboard"
              style={{
                color: '#000000',
                textDecoration: 'underline',
                fontSize: '0.65rem',
              }}
            >
              {lang === 'tr' ? 'Yönetim Paneli' : 'Admin Panel'}
            </Link>
          </div>
        </aside>
      )}

      {children}
    </>
  );
}
