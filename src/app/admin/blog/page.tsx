/**
 * TIYATROTIST — Admin Blog Posts List
 *
 * CMS area for managing blog posts:
 * - Single primary action: + New Post
 * - Search by title or slug
 * - Translation completeness indicators (TR+EN, Missing EN, Missing TR)
 * - Quick publish / unpublish and feature toggles
 * - Delete with confirmation dialog
 * - Useful empty state
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface BlogPost {
  id: string;
  slug: string;
  title_tr?: string;
  title_en?: string;
  excerpt_tr?: string;
  excerpt_en?: string;
  cover_image?: string;
  published: boolean;
  featured: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });

  const dict = getAdminDict(locale);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setTableMissing(false);
    try {
      console.debug('[admin/blog] Fetching blog posts…');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.debug('[admin/blog] Query error (table may not exist yet or empty):', error);
        if (
          error.code === 'PGRST202' ||
          error.message.includes('Could not find the table') ||
          error.message.includes('does not exist')
        ) {
          setTableMissing(true);
        }
      }
      setPosts(data || []);
    } catch (err) {
      console.debug('[admin/blog] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const togglePublish = async (post: BlogPost) => {
    console.debug('[admin/blog] Toggling publish for:', post.slug);
    const nextState = !post.published;
    const { error } = await supabase
      .from('blog_posts')
      .update({
        published: nextState,
        published_at: nextState ? new Date().toISOString() : post.published_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', post.id);

    if (error) {
      console.debug('[admin/blog] Publish toggle error:', error);
      return;
    }
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, published: nextState } : p))
    );
  };

  const toggleFeatured = async (post: BlogPost) => {
    console.debug('[admin/blog] Toggling featured for:', post.slug);
    const nextState = !post.featured;
    const { error } = await supabase
      .from('blog_posts')
      .update({
        featured: nextState,
        updated_at: new Date().toISOString(),
      })
      .eq('id', post.id);

    if (error) {
      console.debug('[admin/blog] Featured toggle error:', error);
      return;
    }
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, featured: nextState } : p))
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    console.debug('[admin/blog] Deleting post:', deleteTarget.slug);

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', deleteTarget.id);

    if (error) {
      console.debug('[admin/blog] Delete error:', error);
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const filtered = posts.filter((p) => {
    const titleTr = (p.title_tr || '').toLowerCase();
    const titleEn = (p.title_en || '').toLowerCase();
    const slug = (p.slug || '').toLowerCase();
    const q = search.toLowerCase();
    return titleTr.includes(q) || titleEn.includes(q) || slug.includes(q);
  });

  if (loading) {
    return <LoadingSpinner text={dict.common.loading} large />;
  }

  const BLOG_MIGRATION_SQL = `CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_tr TEXT,
  title_en TEXT,
  excerpt_tr TEXT,
  excerpt_en TEXT,
  content_tr TEXT,
  content_en TEXT,
  cover_image TEXT,
  category TEXT DEFAULT 'Engineering',
  tags TEXT[] DEFAULT ARRAY['Tech'],
  published BOOLEAN DEFAULT false NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Authenticated users full access to blog posts" ON public.blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);`;

  const handleCopyMigration = async () => {
    try {
      await navigator.clipboard.writeText(BLOG_MIGRATION_SQL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="admin-page-header">
        <h1>{dict.blog.title}</h1>
      </div>

      {/* Missing table banner */}
      {tableMissing && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 500, fontSize: '0.9rem' }}>
            <span>⚡</span>
            <span>Supabase Veritabanı Bildirimi: blog_posts Tablosu Bulunamadı</span>
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
            Admin panelinden yeni blog yazısı kaydedip yayınlamak için Supabase projenizde blog_posts tablosunun oluşturulması gerekir. Hazırlanan SQL migration kodunu kopyalayarak Supabase Dashboard &gt; SQL Editor alanında çalıştırabilirsiniz.
          </p>
          <div>
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={handleCopyMigration}
              style={{ border: '1px solid rgba(255,255,255,0.3)' }}
            >
              {copiedSql ? '✓ SQL Kopyalandı' : '📋 SQL Migration Kodunu Kopyala'}
            </button>
          </div>
        </div>
      )}

      {/* Toolbar with Single Primary Action */}
      <div className="admin-toolbar">
        <input
          className="admin-search"
          type="text"
          placeholder={dict.blog.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={dict.blog.search}
        />
        <Link href="/admin/blog/new" className="admin-btn admin-btn-primary">
          + {dict.blog.newPost}
        </Link>
      </div>

      {/* Posts Table or Clean Empty State */}
      {filtered.length === 0 ? (
        <div className="admin-empty">
          <p style={{ fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{dict.blog.noPosts}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
            {dict.blog.noPostsDesc}
          </p>
          <Link href="/admin/blog/new" className="admin-btn admin-btn-primary">
            + {dict.blog.newPost}
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{dict.blog.postTitle}</th>
                <th>{dict.blog.slug}</th>
                <th>{dict.blog.languages}</th>
                <th>{dict.blog.status}</th>
                <th>{dict.blog.publishedDate}</th>
                <th style={{ textAlign: 'right' }}>{dict.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => {
                const displayTitle = (locale === 'tr' ? post.title_tr : post.title_en) || post.title_tr || post.title_en || post.slug;
                const hasTr = Boolean(post.title_tr?.trim());
                const hasEn = Boolean(post.title_en?.trim());

                return (
                  <tr key={post.id}>
                    <td style={{ fontWeight: 500, color: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {post.featured && <span style={{ color: '#f1c40f', fontSize: '0.8rem' }}>★</span>}
                        <span>{displayTitle}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                      {post.slug}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <span className={`admin-badge ${hasTr ? 'admin-badge-published' : 'admin-badge-draft'}`} style={{ fontSize: '0.55rem' }}>
                          TR
                        </span>
                        <span className={`admin-badge ${hasEn ? 'admin-badge-published' : 'admin-badge-draft'}`} style={{ fontSize: '0.55rem' }}>
                          EN
                        </span>
                        {hasTr && hasEn ? (
                          <span className="admin-badge admin-badge-published" style={{ fontSize: '0.55rem' }}>✓ TAM</span>
                        ) : hasTr ? (
                          <span className="admin-badge admin-badge-draft" style={{ fontSize: '0.55rem' }}>EN EKSİK</span>
                        ) : (
                          <span className="admin-badge admin-badge-draft" style={{ fontSize: '0.55rem' }}>TR EKSİK</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge ${post.published ? 'admin-badge-published' : 'admin-badge-draft'}`}>
                        {post.published ? dict.blog.published : dict.blog.draft}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                      {post.published_at ? new Date(post.published_at).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US') : '—'}
                    </td>
                    <td>
                      <div className="admin-actions" style={{ justifyContent: 'flex-end' }}>
                        <Link
                          href={`/admin/blog/edit?slug=${post.slug}`}
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                        >
                          {dict.blog.edit}
                        </Link>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => togglePublish(post)}
                          type="button"
                        >
                          {post.published ? dict.blog.unpublish : dict.blog.publish}
                        </button>
                        <button
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => toggleFeatured(post)}
                          type="button"
                          title={post.featured ? dict.blog.unfeature : dict.blog.feature}
                        >
                          {post.featured ? '★' : '☆'}
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => setDeleteTarget(post)}
                          type="button"
                        >
                          {dict.blog.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={dict.blog.delete}
        message={dict.blog.deleteConfirm}
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
