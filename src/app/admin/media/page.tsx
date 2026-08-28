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

const BUCKET = 'site-media';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

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
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [error, setError] = useState('');
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });

  const dict = getAdminDict(locale);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      console.debug('[admin/media] Fetching storage files…');
      const { data, error: listErr } = await supabase.storage.from(BUCKET).list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (listErr) {
        console.debug('[admin/media] List error:', listErr);
      }
      setFiles((data as MediaFile[]) || []);
    } catch (err) {
      console.debug('[admin/media] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (fileList: FileList | File[]) => {
    setError('');
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

    setUploading(true);

    try {
      for (const file of filesToUpload) {
        const ext = file.name.split('.').pop();
        const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        console.debug('[admin/media] Uploading:', safeName);

        const { error: uploadErr } = await supabase.storage
          .from(BUCKET)
          .upload(safeName, file, { cacheControl: '3600', upsert: false });

        if (uploadErr) {
          console.debug('[admin/media] Upload error:', uploadErr);
          setError(`${file.name}: ${uploadErr.message}`);
        }
      }
      fetchFiles();
    } catch {
      setError(dict.common.error);
    } finally {
      setUploading(false);
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
    }
    setDeleting(false);
    setDeleteTarget(null);
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
    const isVid = isVideo(f.name, f.metadata?.mimetype);
    if (filterType === 'image') return !isVid;
    if (filterType === 'video') return isVid;
    return true;
  });

  return (
    <>
      <div className="admin-page-header">
        <h1>{dict.media.title}</h1>
      </div>

      {error && <div className="admin-login-error" role="alert">{error}</div>}

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
        <p className="admin-upload-text">{uploading ? dict.media.uploading : dict.media.dragDrop}</p>
        <span className="admin-upload-hint">{dict.media.maxSize}</span>
      </div>

      {/* Filter Tabs */}
      <div className="admin-toolbar" style={{ marginTop: '1.5rem' }}>
        <div className="admin-actions">
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${filterType === 'all' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            onClick={() => setFilterType('all')}
          >
            {dict.media.filterAll} ({files.filter(f => f.name !== '.emptyFolderPlaceholder').length})
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${filterType === 'image' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            onClick={() => setFilterType('image')}
          >
            {dict.media.filterImages}
          </button>
          <button
            type="button"
            className={`admin-btn admin-btn-sm ${filterType === 'video' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            onClick={() => setFilterType('video')}
          >
            {dict.media.filterVideos}
          </button>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          + {dict.media.upload}
        </button>
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
              <div key={file.name} className="admin-media-item">
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
    </>
  );
}
