/**
 * TIYATROTIST — Admin Emergency Control Center
 *
 * Dedicated page for critical system operations:
 * - Quick Maintenance Mode toggle
 * - Emergency Lockdown (unpublish all projects) with confirmation dialog
 * - Restore All Projects with confirmation dialog
 * - Clear explanation and distinct visual cues for dangerous actions
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface EmergencyData {
  maintenanceMode: boolean;
  settingsId: string | null;
  publishedProjectsCount: number;
  totalProjectsCount: number;
}

export default function EmergencyPage() {
  const [data, setData] = useState<EmergencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => Promise<void>;
  }>({ open: false, title: '', message: '', action: async () => {} });

  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });

  const dict = getAdminDict(locale);

  const fetchData = useCallback(async () => {
    try {
      console.debug('[admin/emergency] Fetching emergency status…');

      // Fetch site settings
      const { data: settings } = await supabase
        .from('site_settings')
        .select('id, maintenance_mode')
        .limit(1)
        .single();

      // Fetch projects stats
      const { data: projects } = await supabase
        .from('projects')
        .select('id, published');

      const all = projects || [];
      const publishedCount = all.filter((p: { published: boolean }) => p.published).length;

      setData({
        maintenanceMode: settings?.maintenance_mode || false,
        settingsId: settings?.id || null,
        publishedProjectsCount: publishedCount,
        totalProjectsCount: all.length,
      });
    } catch (err) {
      console.debug('[admin/emergency] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle Maintenance Mode
  const handleToggleMaintenance = async () => {
    if (!data) return;
    setActionLoading(true);
    const nextState = !data.maintenanceMode;

    try {
      console.debug('[admin/emergency] Setting maintenance mode:', nextState);
      if (data.settingsId) {
        await supabase
          .from('site_settings')
          .update({ maintenance_mode: nextState })
          .eq('id', data.settingsId);
      } else {
        const { data: newSettings } = await supabase
          .from('site_settings')
          .insert({ maintenance_mode: nextState })
          .select()
          .single();
        if (newSettings) setData((prev) => (prev ? { ...prev, settingsId: newSettings.id } : prev));
      }
      setData((prev) => (prev ? { ...prev, maintenanceMode: nextState } : prev));
    } catch (err) {
      console.debug('[admin/emergency] Maintenance error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Emergency Lockdown: Unpublish all projects
  const handleUnpublishAll = async () => {
    setActionLoading(true);
    try {
      console.debug('[admin/emergency] Unpublishing all projects…');
      await supabase
        .from('projects')
        .update({ published: false })
        .neq('id', '00000000-0000-0000-0000-000000000000');
      fetchData();
    } catch (err) {
      console.debug('[admin/emergency] Lockdown error:', err);
    } finally {
      setActionLoading(false);
      setConfirmModal({ open: false, title: '', message: '', action: async () => {} });
    }
  };

  // Restore All Projects: Publish all
  const handlePublishAll = async () => {
    setActionLoading(true);
    try {
      console.debug('[admin/emergency] Publishing all projects…');
      await supabase
        .from('projects')
        .update({ published: true })
        .neq('id', '00000000-0000-0000-0000-000000000000');
      fetchData();
    } catch (err) {
      console.debug('[admin/emergency] Restore all error:', err);
    } finally {
      setActionLoading(false);
      setConfirmModal({ open: false, title: '', message: '', action: async () => {} });
    }
  };

  if (loading) {
    return <LoadingSpinner text={dict.common.loading} large />;
  }

  const isLockdownActive = (data?.publishedProjectsCount === 0 && (data?.totalProjectsCount || 0) > 0);

  return (
    <>
      <div className="admin-page-header">
        <h1>{dict.emergency.title}</h1>
      </div>

      {/* Warning Notice Box */}
      <div className="admin-emergency-notice">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e74c3c', fontFamily: 'monospace' }}>[!]</span>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e74c3c', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            {dict.emergency.warningTitle}
          </h3>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
          {dict.emergency.warningDesc}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* 1. Quick Maintenance Mode Action */}
        <div className={`admin-emergency-action-card ${data?.maintenanceMode ? 'card-active-danger' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {dict.emergency.quickMaintenance}
            </h4>
            <span className={`admin-badge ${data?.maintenanceMode ? 'admin-badge-draft' : 'admin-badge-published'}`}>
              {data?.maintenanceMode ? dict.emergency.statusMaintenance : dict.emergency.statusOnline}
            </span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
            {dict.emergency.quickMaintenanceDesc}
          </p>

          <button
            type="button"
            className={`admin-btn ${data?.maintenanceMode ? 'admin-btn-primary' : 'admin-btn-danger'}`}
            onClick={handleToggleMaintenance}
            disabled={actionLoading}
            style={{ width: '100%' }}
          >
            {data?.maintenanceMode ? dict.emergency.disableMaintenance : dict.emergency.enableMaintenance}
          </button>
        </div>

        {/* 2. Emergency Lockdown Action */}
        <div className={`admin-emergency-action-card ${isLockdownActive ? 'card-active-danger' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {dict.emergency.lockdown}
            </h4>
            <span className={`admin-badge ${isLockdownActive ? 'admin-badge-draft' : 'admin-badge-published'}`}>
              {isLockdownActive ? dict.emergency.statusLocked : dict.emergency.statusUnlocked}
            </span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
            {dict.emergency.lockdownDesc} ({data?.publishedProjectsCount} / {data?.totalProjectsCount} yayında)
          </p>

          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={() =>
              setConfirmModal({
                open: true,
                title: dict.emergency.lockdown,
                message: dict.emergency.lockdownConfirm,
                action: handleUnpublishAll,
              })
            }
            disabled={actionLoading || data?.publishedProjectsCount === 0}
            style={{ width: '100%' }}
          >
            {dict.emergency.lockdownBtn}
          </button>
        </div>

        {/* 3. Restore All Action */}
        <div className="admin-emergency-action-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {dict.emergency.restoreAll}
            </h4>
            <span className="admin-badge admin-badge-published">
              {data?.totalProjectsCount} Proje
            </span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
            {dict.emergency.restoreAllDesc}
          </p>

          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() =>
              setConfirmModal({
                open: true,
                title: dict.emergency.restoreAll,
                message: dict.emergency.restoreAllConfirm,
                action: handlePublishAll,
              })
            }
            disabled={actionLoading}
            style={{ width: '100%' }}
          >
            {dict.emergency.restoreAllBtn}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        loading={actionLoading}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal({ open: false, title: '', message: '', action: async () => {} })}
      />
    </>
  );
}
