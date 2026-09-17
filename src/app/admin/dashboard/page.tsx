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
import { getUnifiedProjects } from '@/config/projects';
import {
  getRecentProjectEvents,
  getProjectUsageStats,
  ProjectUsageEvent,
} from '@/lib/project-analytics';

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

  // Guest Usage & Telemetry State
  const [eventsFilter, setEventsFilter] = useState<string>('all');
  const [telemetryEvents, setTelemetryEvents] = useState<ProjectUsageEvent[]>([]);
  const [usageStats, setUsageStats] = useState({
    totalEvents: 0,
    guestEvents: 0,
    todayEvents: 0,
    projectBreakdown: {} as Record<string, number>,
  });

  const refreshTelemetry = useCallback(() => {
    setTelemetryEvents(getRecentProjectEvents(eventsFilter, 40));
    setUsageStats(getProjectUsageStats());
  }, [eventsFilter]);

  const dict = getAdminDict(locale);

  const fetchMetrics = useCallback(async () => {
    try {
      console.debug('[admin/dashboard] Fetching operations overview…');

      // Fetch projects
      const { data: projects } = await supabase
        .from('projects')
        .select('id, slug, published');

      const dbProjects = projects || [];
      const unified = getUnifiedProjects();

      // Combine DB and unified projects
      const allSlugs = new Set<string>();
      let pubProj = 0;
      let draftProj = 0;

      // Add DB projects
      dbProjects.forEach((p: { slug?: string; published: boolean }) => {
        if (p.slug) allSlugs.add(p.slug);
        if (p.published) pubProj++;
        else draftProj++;
      });

      // Add unified projects not in DB
      unified.forEach((up) => {
        if (!allSlugs.has(up.slug)) {
          allSlugs.add(up.slug);
          if (up.published) pubProj++;
          else draftProj++;
        }
      });

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
        : (unified[0]?.latestRelease || 'v2.4.0 (stable)');

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
    refreshTelemetry();
  }, [fetchMetrics, refreshTelemetry]);

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

        {/* 4. Proje Kullanım & Misafir Etkinlikleri (Project Guest Usage & Telemetry) */}
        <section className="admin-overview-section" style={{ marginTop: '1.5rem' }}>
          <div className="admin-overview-section-header">
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <span>PROJE KULLANIM & MİSAFİR ETKİNLİKLERİ</span>
                <span style={{ fontSize: '0.72rem', background: '#10b981', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>CANLI TELEMETRİ</span>
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                Oturum açmadan (misafir) ve kayıtlı olarak projeleri (BookOS, TypeFlow) kullanan ziyaretçilerin kaydolan eylemleri.
              </p>
            </div>
            <button
              type="button"
              onClick={refreshTelemetry}
              className="admin-btn admin-btn-ghost admin-btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              Olayları Yenile
            </button>
          </div>

          {/* Telemetry Summary Cards */}
          <div className="admin-cards">
            <div className="admin-card">
              <div className="admin-card-label">Toplam Kayıtlı Olay</div>
              <div className="admin-card-value" style={{ color: '#38bdf8' }}>{usageStats.totalEvents}</div>
              <div className="admin-card-sub" style={{ color: 'rgba(255,255,255,0.4)' }}>Tüm projeler geneli</div>
            </div>
            <div className="admin-card">
              <div className="admin-card-label">Misafir / Oturum Açılmamış</div>
              <div className="admin-card-value" style={{ color: '#f59e0b' }}>
                {usageStats.guestEvents}
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginLeft: '0.4rem' }}>
                  ({usageStats.totalEvents > 0 ? Math.round((usageStats.guestEvents / usageStats.totalEvents) * 100) : 0}%)
                </span>
              </div>
              <div className="admin-card-sub" style={{ color: 'rgba(255,255,255,0.4)' }}>Oturum açmadan etkileşim</div>
            </div>
            <div className="admin-card">
              <div className="admin-card-label">Bugün Gerçekleşen Olaylar</div>
              <div className="admin-card-value" style={{ color: '#10b981' }}>{usageStats.todayEvents}</div>
              <div className="admin-card-sub" style={{ color: 'rgba(255,255,255,0.4)' }}>Son 24 saat</div>
            </div>
            <div className="admin-card">
              <div className="admin-card-label">BookOS vs TypeFlow</div>
              <div className="admin-card-value" style={{ fontSize: '1rem', color: '#e2e8f0' }}>
                <span style={{ color: '#ff6a00' }}>{usageStats.projectBreakdown['bookos'] || 0}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.35rem' }}>/</span>
                <span style={{ color: '#3b82f6' }}>{usageStats.projectBreakdown['typeflow'] || 0}</span>
              </div>
              <div className="admin-card-sub" style={{ color: 'rgba(255,255,255,0.4)' }}>BookOS / TypeFlow dağılımı</div>
            </div>
          </div>

          {/* Project Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', marginBottom: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>FİLTRELE:</span>
            <button
              onClick={() => setEventsFilter('all')}
              className={`admin-btn admin-btn-sm ${eventsFilter === 'all' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            >
              Tümü ({usageStats.totalEvents})
            </button>
            <button
              onClick={() => setEventsFilter('bookos')}
              className={`admin-btn admin-btn-sm ${eventsFilter === 'bookos' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderColor: eventsFilter === 'bookos' ? '#ff6a00' : undefined, background: eventsFilter === 'bookos' ? '#ff6a00' : undefined, color: eventsFilter === 'bookos' ? '#000' : undefined }}
            >
              BookOS ({usageStats.projectBreakdown['bookos'] || 0})
            </button>
            <button
              onClick={() => setEventsFilter('typeflow')}
              className={`admin-btn admin-btn-sm ${eventsFilter === 'typeflow' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderColor: eventsFilter === 'typeflow' ? '#3b82f6' : undefined, background: eventsFilter === 'typeflow' ? '#3b82f6' : undefined, color: eventsFilter === 'typeflow' ? '#fff' : undefined }}
            >
              TypeFlow ({usageStats.projectBreakdown['typeflow'] || 0})
            </button>
          </div>

          {/* Real-time Telemetry Event Feed Table */}
          <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>PROJE</th>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>KULLANICI TÜRÜ</th>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>GERÇEKLEŞEN OLAY</th>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>DETAYLAR</th>
                  <th style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textAlign: 'right' }}>ZAMAN</th>
                </tr>
              </thead>
              <tbody>
                {telemetryEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                      Henüz kaydedilmiş misafir olayı bulunmuyor. Ziyaretçiler BookOS veya TypeFlow'u kullandıkça olaylar burada canlı listelenecektir.
                    </td>
                  </tr>
                ) : (
                  telemetryEvents.map((evt) => (
                    <tr key={evt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.65rem 0.85rem', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            background: evt.project_slug === 'bookos' ? 'rgba(255, 106, 0, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                            color: evt.project_slug === 'bookos' ? '#ff8c38' : '#60a5fa',
                            border: `1px solid ${evt.project_slug === 'bookos' ? 'rgba(255, 106, 0, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                          }}
                        >
                          {evt.project_slug.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', whiteSpace: 'nowrap' }}>
                        <span style={{ color: evt.is_guest ? '#f59e0b' : '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>{evt.is_guest ? '[ Misafir ]' : '[ Kayıtlı ]'}</span>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                            ({evt.user_identifier})
                          </span>
                        </span>
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', color: '#ffffff', fontWeight: 500 }}>
                        {evt.event_name}
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {evt.metadata ? Object.entries(evt.metadata).map(([k, v]) => `${k}: ${v}`).join(' | ') : '—'}
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', color: 'rgba(255,255,255,0.4)', textAlign: 'right', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                        {evt.created_at ? new Date(evt.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

