/**
 * TIYATROTIST — Admin Operations Dashboard
 *
 * Coherent operations overview grouped into:
 * - CONTENT (Projects & Blog status)
 * - MEDIA (Assets count)
 * - RELEASES (Current version across projects)
 * - SYSTEM & SECURITY (Maintenance status & Emergency center link)
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import LoadingSpinner from '@/components/admin/LoadingSpinner';

interface DashboardMetrics {
  publishedProjects: number;
  draftProjects: number;
  publishedPosts: number;
  draftPosts: number;
  timelineCount: number;
  mediaCount: number;
  latestRelease: string | null;
  maintenanceMode: boolean;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });

  const dict = getAdminDict(locale);

  const fetchMetrics = useCallback(async () => {
    try {
      console.debug('[admin/dashboard] Fetching operations overview…');

      // Fetch projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id, published');

      const allProjects = projects || [];
      const pubProj = allProjects.filter((p: { published: boolean }) => p.published).length;
      const draftProj = allProjects.filter((p: { published: boolean }) => !p.published).length;

      // Fetch blog posts safely
      let pubPosts = 0;
      let draftPosts = 0;
      try {
        const { data: posts, error: postErr } = await supabase
          .from('blog_posts')
          .select('id, published');

        if (!postErr && posts) {
          pubPosts = posts.filter((p: { published: boolean }) => p.published).length;
          draftPosts = posts.filter((p: { published: boolean }) => !p.published).length;
        } else if (postErr) {
          console.debug('[admin/dashboard] blog_posts notice:', postErr.message);
        }
      } catch (e) {
        console.debug('[admin/dashboard] blog_posts fetch exception:', e);
      }

      // Fetch timeline count safely
      let timelineCount = 6;
      try {
        const { data: tData, error: tErr } = await supabase.from('about_timeline').select('id');
        if (!tErr && tData && tData.length > 0) timelineCount = tData.length;
      } catch {
        // fallback
      }

      // Fetch releases
      const { data: releases } = await supabase
        .from('releases')
        .select('version, channel, is_current')
        .order('release_date', { ascending: false })
        .limit(1);

      const latestRelease = releases?.[0]
        ? `${releases[0].version} (${releases[0].channel})`
        : null;

      // Fetch media count
      const { data: mediaFiles } = await supabase
        .from('project_media')
        .select('id');

      // Fetch site settings
      const { data: settings } = await supabase
        .from('site_settings')
        .select('maintenance_mode')
        .limit(1)
        .single();

      setMetrics({
        publishedProjects: pubProj,
        draftProjects: draftProj,
        publishedPosts: pubPosts,
        draftPosts,
        timelineCount,
        mediaCount: mediaFiles?.length || 0,
        latestRelease,
        maintenanceMode: settings?.maintenance_mode || false,
      });
    } catch (err) {
      console.debug('[admin/dashboard] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  if (loading) {
    return <LoadingSpinner text={dict.common.loading} large />;
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>{dict.dashboard.title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
          {dict.dashboard.operationsOverview}
        </p>
      </div>

      <div className="admin-dashboard-groups">
        {/* 1. Content Group */}
        <section className="admin-overview-section">
          <div className="admin-overview-section-header">
            <h3>{dict.dashboard.contentGroup}</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/admin/projects" className="admin-btn admin-btn-ghost admin-btn-sm">
                {dict.nav.projects} →
              </Link>
              <Link href="/admin/blog" className="admin-btn admin-btn-ghost admin-btn-sm">
                {dict.nav.blog} →
              </Link>
              <Link href="/admin/about" className="admin-btn admin-btn-secondary admin-btn-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}>
                {dict.nav.about} →
              </Link>
              <Link href="/admin/contact" className="admin-btn admin-btn-ghost admin-btn-sm">
                {dict.nav.contact} →
              </Link>
            </div>
          </div>
          <div className="admin-cards">
            <div className="admin-card">
              <div className="admin-card-label">{dict.dashboard.publishedProjects}</div>
              <div className="admin-card-value">{metrics?.publishedProjects ?? 0}</div>
            </div>
            <div className="admin-card">
              <div className="admin-card-label">{dict.dashboard.draftProjects}</div>
              <div className="admin-card-value">{metrics?.draftProjects ?? 0}</div>
            </div>
            <div className="admin-card">
              <div className="admin-card-label">{dict.dashboard.publishedPosts}</div>
              <div className="admin-card-value">{metrics?.publishedPosts ?? 0}</div>
            </div>
            <Link href="/admin/about" className="admin-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div className="admin-card-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{dict.nav.about} & TİMELİNE</span>
                <span style={{ color: '#ffffff' }}>➔</span>
              </div>
              <div className="admin-card-value">{metrics?.timelineCount ?? 6}</div>
              <div className="admin-card-sub" style={{ color: 'rgba(255,255,255,0.5)' }}>Kilometre Taşı & Düzenleme</div>
            </Link>
          </div>
        </section>

        {/* 2. Media & Releases Group */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          {/* Media Section */}
          <section className="admin-overview-section">
            <div className="admin-overview-section-header">
              <h3>{dict.dashboard.mediaGroup}</h3>
              <Link href="/admin/media" className="admin-btn admin-btn-ghost admin-btn-sm">
                {dict.nav.mediaLibrary} →
              </Link>
            </div>
            <div className="admin-cards" style={{ gridTemplateColumns: '1fr' }}>
              <div className="admin-card">
                <div className="admin-card-label">{dict.dashboard.mediaCount}</div>
                <div className="admin-card-value">{metrics?.mediaCount ?? 0}</div>
              </div>
            </div>
          </section>

          {/* Releases Section */}
          <section className="admin-overview-section">
            <div className="admin-overview-section-header">
              <h3>{dict.dashboard.releasesGroup}</h3>
              <Link href="/admin/projects" className="admin-btn admin-btn-ghost admin-btn-sm">
                {dict.nav.projects} →
              </Link>
            </div>
            <div className="admin-cards" style={{ gridTemplateColumns: '1fr' }}>
              <div className="admin-card">
                <div className="admin-card-label">{dict.dashboard.latestRelease}</div>
                <div className="admin-card-value" style={{ fontSize: '1.2rem' }}>
                  {metrics?.latestRelease ?? '—'}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 3. System & Security Overview */}
        <section className="admin-overview-section" style={{ marginTop: '1.5rem' }}>
          <div className="admin-overview-section-header">
            <h3>{dict.dashboard.systemGroup}</h3>
            <Link href="/admin/emergency" className="admin-btn admin-btn-danger admin-btn-sm">
              {dict.dashboard.goToEmergency}
            </Link>
          </div>
          <div className="admin-cards">
            <div className="admin-card">
              <div className="admin-card-label">{dict.dashboard.maintenanceStatus}</div>
              <div className="admin-card-value" style={{ fontSize: '1rem', color: metrics?.maintenanceMode ? '#e74c3c' : '#2ecc71' }}>
                {metrics?.maintenanceMode ? dict.dashboard.maintenanceOn : dict.dashboard.maintenanceOff}
              </div>
            </div>
            <div className="admin-card">
              <div className="admin-card-label">{dict.dashboard.siteStatus}</div>
              <div className="admin-card-value" style={{ fontSize: '1rem', color: '#2ecc71' }}>
                ● OK
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
