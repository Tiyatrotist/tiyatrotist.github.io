/**
 * TIYATROTIST — Admin Projects List
 *
 * Unified Project Management:
 * - Queries public.projects and public.releases
 * - Shows all projects (Published, Drafts, Featured)
 * - Project row displays: Name, Slug, Status, Featured, Latest Release, Updated Date
 * - Single contextual action: Manage (Yönet →)
 * - Resilient error handling without swallowing query errors
 * - Clean empty state with prompt
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import { getUnifiedProjects } from '@/config/projects';

interface ProjectWithRelease {
  id: string;
  slug: string;
  name: string;
  published: boolean;
  featured: boolean;
  updated_at?: string;
  created_at?: string;
  latestRelease?: string | null;
}

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<ProjectWithRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });

  const dict = getAdminDict(locale);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.debug('[admin/projects] Querying public.projects…');

      // Fetch projects first
      const { data: projData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projErr) {
        console.error('[admin/projects] Projects query error:', projErr);
        setError(`Veritabanı hatası: ${projErr.message}`);
        setProjects([]);
        setLoading(false);
        return;
      }

      const allProjects = projData || [];
      console.debug('[admin/projects] Loaded database projects count:', allProjects.length);

      // Fetch releases separately so a releases issue never blocks projects from rendering
      let allReleases: Array<{ project_id: string; version: string; channel: string; is_current: boolean; release_date: string }> = [];
      try {
        const { data: relData, error: relErr } = await supabase
          .from('releases')
          .select('project_id, version, channel, is_current, release_date')
          .order('release_date', { ascending: false });

        if (!relErr && relData) {
          allReleases = relData;
        }
      } catch (relEx) {
        console.warn('[admin/projects] Releases fetch exception:', relEx);
      }

      // Get unified system projects (TypeFlow, BookOS, etc.)
      const unifiedSystemProjects = getUnifiedProjects();

      // Merge database records with unified system projects
      const mergedProjectsMap = new Map<string, any>();

      // 1. Seed system projects
      unifiedSystemProjects.forEach((sp) => {
        mergedProjectsMap.set(sp.slug, {
          id: sp.id,
          slug: sp.slug,
          name: sp.name,
          published: sp.published,
          featured: sp.featured,
          created_at: sp.created_at,
          updated_at: sp.updated_at,
          latestRelease: sp.latestRelease,
        });
      });

      // 2. Overlay database records
      allProjects.forEach((p) => {
        const projReleases = allReleases.filter((r) => r.project_id === p.id);
        const currentRel = projReleases.find((r) => r.is_current) || projReleases[0];
        const latestRelease = currentRel
          ? `${currentRel.version} (${currentRel.channel})`
          : (mergedProjectsMap.get(p.slug)?.latestRelease || null);

        mergedProjectsMap.set(p.slug, {
          id: p.id,
          slug: p.slug || '',
          name: p.name || p.slug || 'İsimsiz Proje',
          published: Boolean(p.published),
          featured: Boolean(p.featured),
          created_at: p.created_at,
          updated_at: p.updated_at,
          latestRelease,
        });
      });

      const mapped: ProjectWithRelease[] = Array.from(mergedProjectsMap.values());
      console.debug('[admin/projects] Total merged projects for admin view:', mapped.length, mapped);
      setProjects(mapped);
    } catch (err: unknown) {
      console.error('[admin/projects] Unexpected fetch error:', err);
      setError(dict.common.error);
    } finally {
      setLoading(false);
    }
  }, [dict.common.error]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = projects.filter((p) => {
    const name = (p.name || '').toLowerCase();
    const slug = (p.slug || '').toLowerCase();
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return name.includes(q) || slug.includes(q);
  });

  if (loading) {
    return <LoadingSpinner text={dict.common.loading} large />;
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>{dict.projects.title}</h1>
      </div>

      {error && (
        <div className="admin-login-error" style={{ marginBottom: '1.25rem' }} role="alert">
          {error}
        </div>
      )}

      {/* Toolbar with Single Primary Action */}
      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="text"
          placeholder={dict.projects.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={dict.projects.search}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={fetchProjects}
            title="Yenile"
          >
            ↻
          </button>
          <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">
            + {dict.projects.newProject}
          </Link>
        </div>
      </div>

      {/* Projects Table or Clean Empty State */}
      {filtered.length === 0 ? (
        <div className="admin-empty">
          <p style={{ fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{dict.projects.noProjects}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
            {dict.projects.noProjectsDesc}
          </p>
          <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">
            + {dict.projects.newProject}
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{dict.projects.name}</th>
                <th>{dict.projects.status}</th>
                <th>{dict.projects.featured}</th>
                <th>{dict.projects.latestRelease}</th>
                <th>{dict.common.updated}</th>
                <th style={{ textAlign: 'right' }}>{dict.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => {
                const updatedDate = project.updated_at || project.created_at;
                const formattedDate = updatedDate
                  ? new Date(updatedDate).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')
                  : '—';

                return (
                  <tr key={project.id}>
                    <td style={{ fontWeight: 500, color: '#fff' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{project.name}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                          /{project.slug}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge ${project.published ? 'admin-badge-published' : 'admin-badge-draft'}`}>
                        {project.published ? dict.projects.publish : dict.projects.unpublish}
                      </span>
                    </td>
                    <td>
                      {project.featured ? (
                        <span style={{ color: '#f1c40f', fontSize: '0.9rem' }}>★</span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>☆</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: project.latestRelease ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                        {project.latestRelease || '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                      {formattedDate}
                    </td>
                    <td>
                      <div className="admin-actions" style={{ justifyContent: 'flex-end' }}>
                        <Link
                          href={`/admin/projects/edit?slug=${project.slug}`}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                          {dict.projects.manage}
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
