/**
 * TIYATROTIST — Admin Media Library
 *
 * Media asset management:
 * - Single primary action: Upload Media
 * - Media type filtering (All | Images | Videos)
 * - Copy URL action for easy linking in Blog / Projects
 * - Drag-and-drop upload zone
 * - Delete with confirmation dialog
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageCropModal from '@/components/admin/ImageCropModal';

const BUCKET = 'site-media';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const STORAGE_MIGRATION_SQL = `-- ==============================================================================
-- TIYATROTIST — Supabase Storage: 'site-media' Bucket & RLS Policies
-- Run this SQL in your Supabase Dashboard > SQL Editor to enable Media Uploads.
-- ==============================================================================

-- 1. Create the 'site-media' public storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  52428800, -- 50 MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif', 'video/mp4', 'video/webm'];

-- 2. Allow public read access to all files in 'site-media'
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public can view site-media" ON storage.objects;
CREATE POLICY "Public can view site-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');

-- 3. Allow authenticated admins to upload files to 'site-media'
DROP POLICY IF EXISTS "Authenticated can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload site-media" ON storage.objects;
CREATE POLICY "Authenticated users can upload site-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-media');

-- 4. Allow authenticated admins to update files in 'site-media'
DROP POLICY IF EXISTS "Authenticated can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update site-media" ON storage.objects;
CREATE POLICY "Authenticated users can update site-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-media');

-- 5. Allow authenticated admins to delete files from 'site-media'
DROP POLICY IF EXISTS "Authenticated can delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete site-media" ON storage.objects;
CREATE POLICY "Authenticated users can delete site-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-media');`;

const ALLOWED_TYPES: Record<string, 'image' | 'video'> = {
  'image/png': 'image',
  'image/jpeg': 'image',
  'image/webp': 'image',
  'image/svg+xml': 'image',
  'image/gif': 'image',
  'video/mp4': 'video',
  'video/webm': 'video',
};

interface MediaFile {
  name: string;
  id: string | null;
  created_at: string | null;
  metadata?: {
    size?: number;
    mimetype?: string;
  } | null;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [tagFilter, setTagFilter] = useState<'all' | 'blog' | 'projects' | 'system' | 'general'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [bucketMissing, setBucketMissing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });

  const dict = getAdminDict(locale);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      console.debug('[admin/media] Fetching storage files…');
      const { data, error: listErr } = await supabase.storage.from(BUCKET).list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (listErr) {
        console.debug('[admin/media] List error:', listErr);
        const errMsg = listErr.message || '';
        const isNotFound =
          errMsg.toLowerCase().includes('bucket not found') ||
          (listErr as any).statusCode === '404' ||
          (listErr as any).code === 'NoSuchBucket';

        if (isNotFound) {
          // Attempt automatic creation if permitted by client session
          try {
            const { error: createErr } = await supabase.storage.createBucket(BUCKET, { public: true });
            if (!createErr) {
              setBucketMissing(false);
              const retry = await supabase.storage.from(BUCKET).list('', { limit: 100 });
              setFiles((retry.data as MediaFile[]) || []);
              return;
            }
          } catch {}
          setBucketMissing(true);
        } else {
          setError(errMsg);
        }
      } else {
        setBucketMissing(false);
        setFiles((data as MediaFile[]) || []);
      }
    } catch (err: any) {
      console.debug('[admin/media] Fetch error:', err);
      setError(err?.message || dict.common.error);
    } finally {
      setLoading(false);
    }
  }, [dict.common.error]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(STORAGE_MIGRATION_SQL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      console.debug('[admin/media] Failed to copy SQL to clipboard');
    }
  };

  const handleUpload = async (fileList: FileList | File[]) => {
    setError('');
    setSuccessMessage('');
    const filesToUpload = Array.from(fileList);
    if (filesToUpload.length === 0) return;

    for (const file of filesToUpload) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name}: ${dict.media.maxSize}`);
        return;
      }
      if (!ALLOWED_TYPES[file.type]) {
        setError(`${file.name}: ${dict.media.invalidType}`);
        return;
      }
    }

    if (bucketMissing) {
      setError(
        locale === 'tr'
          ? "Depolama alanı ('site-media') henüz oluşturulmamış. Lütfen aşağıdaki SQL migration kodunu Supabase Dashboard > SQL Editor alanında çalıştırın."
          : "Storage bucket ('site-media') not found. Please run the SQL migration below in Supabase Dashboard > SQL Editor."
      );
      return;
    }

    setUploading(true);
    let successCount = 0;

    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        setUploadProgressText(
          filesToUpload.length > 1
            ? `${dict.media.uploading} (${i + 1}/${filesToUpload.length}): ${file.name}`
            : `${dict.media.uploading} ${file.name}`
        );

        const ext = file.name.split('.').pop();
        const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        console.debug('[admin/media] Uploading:', safeName);

        const { error: uploadErr } = await supabase.storage
          .from(BUCKET)
          .upload(safeName, file, { cacheControl: '3600', upsert: false });

        if (uploadErr) {
          console.debug('[admin/media] Upload error:', uploadErr);
          const msg = uploadErr.message || '';
          if (msg.toLowerCase().includes('bucket not found')) {
            setBucketMissing(true);
            setError(
              locale === 'tr'
                ? `${file.name}: 'site-media' depolama kovası bulunamadı. Lütfen SQL migration kodunu çalıştırın.`
                : `${file.name}: Storage bucket 'site-media' not found. Please execute the SQL migration.`
            );
          } else if (msg.toLowerCase().includes('security') || msg.toLowerCase().includes('row-level')) {
            setError(
              locale === 'tr'
                ? `${file.name}: Yetki Hatası (RLS). Oturumunuz kapalı olabilir veya yükleme izni tanımlanmamış.`
                : `${file.name}: Permission denied (RLS). Please ensure you are logged in and policies are applied.`
            );
          } else {
            setError(`${file.name}: ${msg}`);
          }
        } else {
          successCount++;
        }
      }

      if (successCount > 0) {
        setSuccessMessage(
          locale === 'tr'
            ? `✓ ${successCount} adet dosya başarıyla yüklendi.`
            : `✓ ${successCount} file(s) uploaded successfully.`
        );
        fetchFiles();
      }
    } catch (err: any) {
      setError(err?.message || dict.common.error);
    } finally {
      setUploading(false);
      setUploadProgressText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    console.debug('[admin/media] Deleting:', deleteTarget);

    const { error: delErr } = await supabase.storage
      .from(BUCKET)
      .remove([deleteTarget]);

    if (delErr) {
      console.debug('[admin/media] Delete error:', delErr);
      setError(delErr.message);
    } else {
      setFiles((prev) => prev.filter((f) => f.name !== deleteTarget));
      setSelectedFiles((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget);
        return next;
      });
      setSuccessMessage(
        locale === 'tr'
          ? `✓ '${deleteTarget}' dosyası başarıyla silindi.`
          : `✓ '${deleteTarget}' deleted successfully.`
      );
    }
    setDeleting(false);
    setDeleteTarget(null);
  };

  const handleBatchDelete = async () => {
    if (selectedFiles.size === 0) return;
    setDeleting(true);
    const toDelete = Array.from(selectedFiles);
    console.debug('[admin/media] Batch deleting:', toDelete);

    const { error: delErr } = await supabase.storage
      .from(BUCKET)
      .remove(toDelete);

    if (delErr) {
      setError(delErr.message);
    } else {
      setFiles((prev) => prev.filter((f) => !selectedFiles.has(f.name)));
      setSuccessMessage(
        locale === 'tr'
          ? `✓ Seçilen ${toDelete.length} adet dosya başarıyla silindi.`
          : `✓ ${toDelete.length} selected files deleted successfully.`
      );
      setSelectedFiles(new Set());
    }
    setDeleting(false);
    setBatchDeleteConfirm(false);
  };

  const toggleSelect = (name: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map((f) => f.name)));
    }
  };

  const getPublicUrl = (name: string) => {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(name);
    return data.publicUrl;
  };

  const copyUrl = (name: string) => {
    const url = getPublicUrl(name);
    navigator.clipboard.writeText(url);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const isVideo = (name: string, mime?: string) => {
    if (mime?.startsWith('video/')) return true;
    const ext = name.split('.').pop()?.toLowerCase();
    return ext === 'mp4' || ext === 'webm';
  };

  const filteredFiles = files.filter((f) => {
    if (f.name === '.emptyFolderPlaceholder') return false;

    // Search filter
    if (searchQuery.trim()) {
      if (!f.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }
    }

    // Media type filter
    const isVid = isVideo(f.name, f.metadata?.mimetype);
    if (filterType === 'image' && isVid) return false;
    if (filterType === 'video' && !isVid) return false;

    // Tag category filter
    const lower = f.name.toLowerCase();
    if (tagFilter === 'blog') {
      if (!lower.startsWith('cover-') && !lower.includes('blog')) return false;
    } else if (tagFilter === 'projects') {
      if (!lower.includes('project') && !lower.includes('bookos') && !lower.includes('typeflow')) return false;
    } else if (tagFilter === 'system') {
      if (!lower.includes('sys') && !lower.includes('icon') && !lower.includes('logo') && !lower.includes('avatar')) return false;
    } else if (tagFilter === 'general') {
      if (lower.startsWith('cover-') || lower.includes('blog') || lower.includes('project')) return false;
    }

    return true;
  });

  return (
    <>
      <div className="admin-page-header">
        <h1>{dict.media.title}</h1>
      </div>

      {/* Supabase Storage Setup Guidance Banner */}
      {bucketMissing && (
        <div
          style={{
            background: 'rgba(255, 170, 0, 0.08)',
            border: '1px solid rgba(255, 170, 0, 0.3)',
            borderRadius: '8px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffaa00', fontFamily: 'monospace' }}>[!]</span>
            <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#ffaa00', fontWeight: 600 }}>
              {locale === 'tr' ? 'Supabase Depolama Alanı (Storage Bucket) Kurulumu Gerekli' : 'Supabase Storage Bucket Setup Required'}
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {locale === 'tr'
              ? "Görsel ve video yükleyebilmek için Supabase projenizde 'site-media' isimli depolama kovasının oluşturulması ve okuma/yazma izinlerinin tanımlanması gerekir. Aşağıdaki SQL kodunu kopyalayarak Supabase Dashboard > SQL Editor alanında çalıştırabilirsiniz."
              : "To upload images and videos, the 'site-media' storage bucket and its policies must be created in your Supabase project. You can copy the SQL code below and run it in Supabase Dashboard > SQL Editor."}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleCopySql}
            >
              {copiedSql ? (locale === 'tr' ? '✓ SQL Kopyalandı' : '✓ SQL Copied') : (locale === 'tr' ? 'SQL Migration Kodunu Kopyala' : 'Copy SQL Migration')}
            </button>
            <a
              href="https://supabase.com/dashboard/project/znsxdqzoojgauevifnel/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-ghost"
            >
              ↗ {locale === 'tr' ? "Supabase SQL Editor'ı Aç" : 'Open Supabase SQL Editor'}
            </a>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={fetchFiles}
              disabled={loading}
            >
              {locale === 'tr' ? 'Tekrar Kontrol Et' : 'Re-check Status'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="admin-login-error" role="alert" style={{ marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            background: 'rgba(0, 255, 128, 0.08)',
            border: '1px solid rgba(0, 255, 128, 0.25)',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            color: '#00ff80',
            fontSize: '0.8rem',
            marginBottom: '1.25rem',
          }}
          role="status"
        >
          {successMessage}
        </div>
      )}

      {/* Upload Zone */}
      <div
        className={`admin-upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files) handleUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={dict.media.dragDrop}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/webm"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files) handleUpload(e.target.files);
          }}
        />
        <div className="admin-upload-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="admin-upload-text">{uploading ? (uploadProgressText || dict.media.uploading) : dict.media.dragDrop}</p>
        <span className="admin-upload-hint">{dict.media.maxSize}</span>
      </div>

      {/* Search, Tagging & Filter Toolbar */}
      <div className="admin-toolbar" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Search & Batch Actions Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px', maxWidth: '400px' }}>
            <span style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.4)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'tr' ? 'Medya dosyalarında ara…' : 'Search media files…'}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '4px',
                padding: '0.35rem 0.65rem',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Batch operations */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={toggleSelectAll}
              className="admin-btn admin-btn-ghost admin-btn-sm"
              style={{ fontSize: '0.72rem' }}
            >
              {selectedFiles.size === filteredFiles.length && filteredFiles.length > 0
                ? (locale === 'tr' ? 'Seçimi Kaldır' : 'Deselect All')
                : (locale === 'tr' ? 'Tümünü Seç' : 'Select All')}
            </button>

            {selectedFiles.size > 0 && (
              <button
                type="button"
                onClick={() => setBatchDeleteConfirm(true)}
                className="admin-btn admin-btn-danger admin-btn-sm"
                style={{ fontSize: '0.72rem', fontWeight: 600 }}
              >
                {locale === 'tr' ? `Seçilenleri Sil (${selectedFiles.size})` : `Delete Selected (${selectedFiles.size})`}
              </button>
            )}
          </div>
        </div>

        {/* Tag Filters Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', alignSelf: 'center', marginRight: '0.25rem' }}>
              ETİKET:
            </span>
            {(['all', 'blog', 'projects', 'system', 'general'] as const).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTagFilter(tag)}
                className={`admin-btn admin-btn-sm ${tagFilter === tag ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
              >
                {tag === 'all'
                  ? 'Tümü'
                  : tag === 'blog'
                  ? 'Blog'
                  : tag === 'projects'
                  ? 'Projeler'
                  : tag === 'system'
                  ? 'Sistem'
                  : 'Genel'}
              </button>
            ))}
          </div>

          {/* Media Type Filter */}
          <div className="admin-actions">
            <button
              type="button"
              className={`admin-btn admin-btn-sm ${filterType === 'all' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              onClick={() => setFilterType('all')}
              style={{ fontSize: '0.7rem' }}
            >
              {dict.media.filterAll}
            </button>
            <button
              type="button"
              className={`admin-btn admin-btn-sm ${filterType === 'image' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              onClick={() => setFilterType('image')}
              style={{ fontSize: '0.7rem' }}
            >
              {dict.media.filterImages}
            </button>
            <button
              type="button"
              className={`admin-btn admin-btn-sm ${filterType === 'video' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              onClick={() => setFilterType('video')}
              style={{ fontSize: '0.7rem' }}
            >
              {dict.media.filterVideos}
            </button>
          </div>
          {/* Actions: Direct Upload + Crop Modal */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const f = e.target?.files?.[0];
                  if (f) {
                    setCropFile(f);
                    setIsCropOpen(true);
                  }
                };
                input.click();
              }}
              style={{ fontSize: '0.75rem' }}
            >
              Görsel Kırp & WebP
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{ fontSize: '0.75rem' }}
            >
              + {dict.media.upload}
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <LoadingSpinner text={dict.common.loading} />
      ) : filteredFiles.length === 0 ? (
        <div className="admin-empty">
          <p style={{ fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{dict.media.noMedia}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{dict.media.noMediaDesc}</p>
        </div>
      ) : (
        <div className="admin-media-grid">
          {filteredFiles.map((file) => {
            const url = getPublicUrl(file.name);
            const isVid = isVideo(file.name, file.metadata?.mimetype);

            return (
              <div
                key={file.name}
                className={`admin-media-item ${selectedFiles.has(file.name) ? 'selected' : ''}`}
                style={{
                  position: 'relative',
                  outline: selectedFiles.has(file.name) ? '2px solid #ffffff' : 'none',
                  borderRadius: '4px',
                }}
              >
                {/* Checkbox Selector */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(file.name);
                  }}
                  title={selectedFiles.has(file.name) ? 'Seçimi Kaldır' : 'Seç'}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    zIndex: 4,
                    background: selectedFiles.has(file.name) ? '#ffffff' : 'rgba(0,0,0,0.7)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    borderRadius: '3px',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {selectedFiles.has(file.name) && (
                    <span style={{ color: '#000000', fontSize: '11px', fontWeight: 800 }}>✓</span>
                  )}
                </div>

                <div className="admin-media-preview">
                  {isVid ? (
                    <video src={url} preload="metadata" muted />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={file.name} loading="lazy" />
                  )}
                </div>
                <div className="admin-media-info">
                  <span className="admin-media-name" title={file.name}>
                    {file.name}
                  </span>
                  <div className="admin-media-actions">
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => copyUrl(file.name)}
                      type="button"
                    >
                      {copiedName === file.name ? dict.media.copied : dict.media.copyUrl}
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => setDeleteTarget(file.name)}
                      type="button"
                    >
                      {dict.media.delete}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={dict.media.delete}
        message={dict.media.deleteConfirm}
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Batch Delete Confirmation Modal */}
      <ConfirmDialog
        open={batchDeleteConfirm}
        title="Toplu Medya Silme"
        message={`Seçilen ${selectedFiles.size} adet medya dosyasını kalıcı olarak silmek istediğinizden emin misiniz?`}
        confirmLabel="Seçilenleri Sil"
        cancelLabel={dict.common.cancel}
        loading={deleting}
        onConfirm={handleBatchDelete}
        onCancel={() => setBatchDeleteConfirm(false)}
      />

      {/* Image Crop & WebP Optimizer Modal */}
      <ImageCropModal
        file={cropFile}
        isOpen={isCropOpen}
        onClose={() => {
          setIsCropOpen(false);
          setCropFile(null);
        }}
        onConfirm={(optimizedFile) => {
          handleUpload([optimizedFile]);
        }}
      />
    </>
  );
}
