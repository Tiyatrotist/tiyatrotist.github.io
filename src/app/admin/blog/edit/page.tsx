/**
 * TIYATROTIST — Edit Blog Post Page
 *
 * Query-param based (?slug=xxx) for Next.js static export compatibility.
 * Tabbed TR/EN editor with translation workflow, save, toggle publish, and delete.
 */

'use client';

import { useState, useEffect, useRef, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import FormField from '@/components/admin/FormField';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TranslationAction from '@/components/admin/TranslationAction';
import SplitMarkdownEditor from '@/components/admin/SplitMarkdownEditor';
import ImageCropModal from '@/components/admin/ImageCropModal';

function EditBlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('slug') || '';

  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });
  const dict = getAdminDict(locale);

  const [activeTab, setActiveTab] = useState<'tr' | 'en'>('tr');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [postId, setPostId] = useState('');

  const [form, setForm] = useState({
    title_tr: '',
    title_en: '',
    slug: '',
    excerpt_tr: '',
    excerpt_en: '',
    content_tr: '',
    content_en: '',
    cover_image: '',
    published: false,
    featured: false,
    published_at: null as string | null,
    updated_at: null as string | null,
  });

  useEffect(() => {
    if (!slugParam) {
      setLoading(false);
      setError(dict.common.notFound);
      return;
    }

    const fetchPost = async () => {
      console.debug('[admin/blog/edit] Fetching post for slug:', slugParam);
      const { data, error: fetchErr } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slugParam)
        .limit(1)
        .single();

      if (fetchErr || !data) {
        console.debug('[admin/blog/edit] Post not found:', fetchErr);
        setError(dict.common.notFound);
      } else {
        setPostId(data.id);
        setForm({
          title_tr: data.title_tr || '',
          title_en: data.title_en || '',
          slug: data.slug || '',
          excerpt_tr: data.excerpt_tr || '',
          excerpt_en: data.excerpt_en || '',
          content_tr: data.content_tr || '',
          content_en: data.content_en || '',
          cover_image: data.cover_image || '',
          published: data.published || false,
          featured: data.featured || false,
          published_at: data.published_at || null,
          updated_at: data.updated_at || null,
        });
      }
      setLoading(false);
    };

    fetchPost();
  }, [slugParam, dict.common.notFound]);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState('');
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const updateField = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropFile(file);
    setIsCropOpen(true);
    if (e.target) e.target.value = '';
  };

  const uploadOptimizedCover = async (file: File) => {
    setUploadingCover(true);
    setCoverError('');
    try {
      const safeName = `cover-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
      const { error: uploadErr } = await supabase.storage
        .from('site-media')
        .upload(safeName, file, { contentType: 'image/webp', cacheControl: '3600', upsert: false });

      if (uploadErr) {
        console.debug('[blog/edit] Cover upload error:', uploadErr);
        if (uploadErr.message?.toLowerCase().includes('bucket not found')) {
          setCoverError(
            locale === 'tr'
              ? "Depolama alanı ('site-media') bulunamadı. Lütfen önce Medya Kütüphanesindeki SQL kurulumunu yapın."
              : "Storage bucket ('site-media') not found. Please complete the SQL setup in Media Library."
          );
        } else {
          setCoverError(uploadErr.message);
        }
      } else {
        const { data } = supabase.storage.from('site-media').getPublicUrl(safeName);
        if (data?.publicUrl) {
          updateField('cover_image', data.publicUrl);
        }
      }
    } catch (err: any) {
      setCoverError(err?.message || 'Yükleme başarısız.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title_tr && !form.title_en) {
      setError(locale === 'tr' ? 'Lütfen en az bir dilde başlık girin.' : 'Please enter a title in at least one language.');
      return;
    }

    setSaving(true);

    try {
      console.debug('[admin/blog/edit] Updating post:', postId);
      const now = new Date().toISOString();
      const nextPublishedAt = form.published
        ? (form.published_at || now)
        : form.published_at;

      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title_tr: form.title_tr || null,
          title_en: form.title_en || null,
          slug: form.slug,
          excerpt_tr: form.excerpt_tr || null,
          excerpt_en: form.excerpt_en || null,
          content_tr: form.content_tr || null,
          content_en: form.content_en || null,
          cover_image: form.cover_image || null,
          published: form.published,
          featured: form.featured,
          published_at: nextPublishedAt,
          updated_at: now,
        })
        .eq('id', postId);

      if (updateError) {
        console.debug('[admin/blog/edit] Update error:', updateError);
        setError(dict.common.error);
      } else {
        setSuccess(dict.common.success);
      }
    } catch {
      setError(dict.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    console.debug('[admin/blog/edit] Deleting post:', postId);

    const { error: delError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (delError) {
      console.debug('[admin/blog/edit] Delete error:', delError);
      setError(dict.common.error);
      setDeleting(false);
    } else {
      router.push('/admin/blog');
    }
  };

  if (loading) {
    return <LoadingSpinner text={dict.common.loading} large />;
  }

  if (error && !postId) {
    return (
      <div className="admin-empty">
        <p>{error}</p>
        <Link href="/admin/blog" className="admin-btn admin-btn-ghost">
          {dict.blog.back}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>{dict.blog.edit}</h1>
        <Link href="/admin/blog" className="admin-btn admin-btn-ghost" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
          {dict.blog.back}
        </Link>
      </div>

      {error && <div className="admin-login-error" role="alert">{error}</div>}
      {success && <div className="admin-success-msg" role="status">{success}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)', gap: '2rem', alignItems: 'start' }}>
          {/* Main Content Area (Tabbed TR / EN) */}
          <div>
            {/* Language Switcher Tabs */}
            <div className="admin-tabs" role="tablist">
              <button
                type="button"
                className={`admin-tab ${activeTab === 'tr' ? 'active' : ''}`}
                onClick={() => setActiveTab('tr')}
                role="tab"
                aria-selected={activeTab === 'tr'}
              >
                {dict.blog.tabTr} {form.title_tr && '✓'}
              </button>
              <button
                type="button"
                className={`admin-tab ${activeTab === 'en' ? 'active' : ''}`}
                onClick={() => setActiveTab('en')}
                role="tab"
                aria-selected={activeTab === 'en'}
              >
                {dict.blog.tabEn} {form.title_en && '✓'}
              </button>
            </div>

            {/* Turkish Tab Panel */}
            {activeTab === 'tr' && (
              <div className="admin-tab-panel">
                <div>
                  <FormField
                    label={dict.blog.postTitleTr}
                    name="title_tr"
                    value={form.title_tr}
                    onChange={(v) => updateField('title_tr', v)}
                    placeholder="Yazı Başlığı..."
                  />
                  <TranslationAction
                    sourceText={form.title_tr}
                    targetText={form.title_en}
                    sourceLang="tr"
                    targetLang="en"
                    context="blog post title"
                    onTranslated={(translated) => updateField('title_en', translated)}
                  />
                </div>

                <div>
                  <FormField
                    label={dict.blog.excerptTr}
                    name="excerpt_tr"
                    type="textarea"
                    value={form.excerpt_tr}
                    onChange={(v) => updateField('excerpt_tr', v)}
                    placeholder="Kısa özet veya spot metin..."
                  />
                  <TranslationAction
                    sourceText={form.excerpt_tr}
                    targetText={form.excerpt_en}
                    sourceLang="tr"
                    targetLang="en"
                    context="blog post excerpt"
                    onTranslated={(translated) => updateField('excerpt_en', translated)}
                  />
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <SplitMarkdownEditor
                    label={dict.blog.contentTr}
                    value={form.content_tr}
                    onChange={(v) => updateField('content_tr', v)}
                    placeholder="# Başlık&#10;&#10;Yazı içeriğinizi markdown formatında yazın..."
                  />
                  <div style={{ marginTop: '0.5rem' }}>
                    <TranslationAction
                      sourceText={form.content_tr}
                      targetText={form.content_en}
                      sourceLang="tr"
                      targetLang="en"
                      context="blog post markdown article"
                      onTranslated={(translated) => updateField('content_en', translated)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* English Tab Panel */}
            {activeTab === 'en' && (
              <div className="admin-tab-panel">
                <div>
                  <FormField
                    label={dict.blog.postTitleEn}
                    name="title_en"
                    value={form.title_en}
                    onChange={(v) => updateField('title_en', v)}
                    placeholder="Post Title..."
                  />
                  <TranslationAction
                    sourceText={form.title_en}
                    targetText={form.title_tr}
                    sourceLang="en"
                    targetLang="tr"
                    context="blog post title"
                    onTranslated={(translated) => updateField('title_tr', translated)}
                  />
                </div>

                <div>
                  <FormField
                    label={dict.blog.excerptEn}
                    name="excerpt_en"
                    type="textarea"
                    value={form.excerpt_en}
                    onChange={(v) => updateField('excerpt_en', v)}
                    placeholder="Short excerpt or teaser..."
                  />
                  <TranslationAction
                    sourceText={form.excerpt_en}
                    targetText={form.excerpt_tr}
                    sourceLang="en"
                    targetLang="tr"
                    context="blog post excerpt"
                    onTranslated={(translated) => updateField('excerpt_tr', translated)}
                  />
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <SplitMarkdownEditor
                    label={dict.blog.contentEn}
                    value={form.content_en}
                    onChange={(v) => updateField('content_en', v)}
                    placeholder="# Heading&#10;&#10;Write post content in markdown..."
                  />
                  <div style={{ marginTop: '0.5rem' }}>
                    <TranslationAction
                      sourceText={form.content_en}
                      targetText={form.content_tr}
                      sourceLang="en"
                      targetLang="tr"
                      context="blog post markdown article"
                      onTranslated={(translated) => updateField('content_tr', translated)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metadata & Publishing Sidebar */}
          <div className="admin-sidebar-box">
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff', marginBottom: '1rem' }}>
              {dict.blog.metadata}
            </h3>

            <FormField
              label={dict.blog.slug}
              name="slug"
              value={form.slug}
              onChange={(v) => updateField('slug', v)}
              required
            />

            <div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <FormField
                    label={dict.blog.coverImage}
                    name="cover_image"
                    type="url"
                    value={form.cover_image}
                    onChange={(v) => updateField('cover_image', v)}
                    placeholder={dict.blog.coverImagePlaceholder}
                  />
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost"
                  style={{ height: '38px', marginBottom: '1.25rem', whiteSpace: 'nowrap', fontSize: '0.75rem' }}
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                >
                  {uploadingCover ? (locale === 'tr' ? 'Yükleniyor…' : 'Uploading…') : (locale === 'tr' ? 'Görsel Kırp & Seç' : 'Crop & Choose')}
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
              </div>

              <ImageCropModal
                file={cropFile}
                isOpen={isCropOpen}
                onClose={() => { setIsCropOpen(false); setCropFile(null); }}
                onConfirm={uploadOptimizedCover}
                defaultAspectRatio={16 / 9}
              />

              {coverError && (
                <p style={{ color: '#ff4d4f', fontSize: '0.72rem', marginTop: '-0.75rem', marginBottom: '1rem' }}>
                  {coverError}
                </p>
              )}

              {form.cover_image && (
                <div style={{ marginTop: '-0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.cover_image}
                    alt="Kapak Önizleme"
                    style={{ width: '80px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => updateField('cover_image', '')}
                  >
                    {locale === 'tr' ? 'Görseli Kaldır' : 'Remove Image'}
                  </button>
                </div>
              )}
            </div>

            {/* Published Switch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{dict.blog.published}</span>
              <label className="admin-toggle" aria-label={dict.blog.published}>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => updateField('published', e.target.checked)}
                />
                <span className="admin-toggle-slider" />
              </label>
            </div>

            {/* Featured Switch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{dict.blog.featured}</span>
              <label className="admin-toggle" aria-label={dict.blog.featured}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateField('featured', e.target.checked)}
                />
                <span className="admin-toggle-slider" />
              </label>
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
              style={{ width: '100%', marginBottom: '0.75rem' }}
            >
              {saving ? dict.blog.saving : dict.blog.save}
            </button>

            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => setConfirmDelete(true)}
              disabled={saving}
              style={{ width: '100%' }}
            >
              {dict.blog.delete}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={confirmDelete}
        title={dict.blog.delete}
        message={dict.blog.deleteConfirm}
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}

export default function EditBlogPage() {
  return (
    <Suspense fallback={<LoadingSpinner large center />}>
      <EditBlogContent />
    </Suspense>
  );
}
