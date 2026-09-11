/**
 * TIYATROTIST — Admin About Page & Timeline Editor
 *
 * Manage About Page General Content (title, markdown description)
 * and Schematic Timeline Milestones (axis code, period, title, description,
 * status badges, branch direction, sorting, and active visibility).
 */

'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import FormField from '@/components/admin/FormField';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import TranslationAction from '@/components/admin/TranslationAction';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { TimelineMilestone, DEFAULT_MILESTONES } from '@/types/timeline';

const SIDE_OPTIONS = [
  { value: 'right', label: 'Sağ (Right) ➔' },
  { value: 'left', label: '◀ Sol (Left)' },
];

const emptyMilestoneForm: TimelineMilestone = {
  code: '01',
  year: '2026',
  period_tr: '',
  period_en: '',
  title_tr: '',
  title_en: '',
  desc_tr: '',
  desc_en: '',
  status_tr: 'YAYINLANDI',
  status_en: 'RELEASED',
  tag: 'SOFTWARE',
  side: 'right',
  sort_order: 1,
  enabled: true,
};

const SQL_MIGRATION_TEXT = `-- Run in Supabase Dashboard > SQL Editor:
CREATE TABLE IF NOT EXISTS public.about_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL DEFAULT '01',
  year VARCHAR(10) NOT NULL DEFAULT '2026',
  period_tr VARCHAR(100) NOT NULL,
  period_en VARCHAR(100) NOT NULL,
  title_tr VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  desc_tr TEXT NOT NULL,
  desc_en TEXT NOT NULL,
  status_tr VARCHAR(50) NOT NULL DEFAULT 'YAYINLANDI',
  status_en VARCHAR(50) NOT NULL DEFAULT 'RELEASED',
  tag VARCHAR(50) DEFAULT 'SOFTWARE',
  side VARCHAR(10) NOT NULL DEFAULT 'right' CHECK (side IN ('left', 'right')),
  sort_order INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.about_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view enabled about milestones"
  ON public.about_timeline FOR SELECT USING (enabled = true);

CREATE POLICY "Authenticated users can manage about milestones"
  ON public.about_timeline FOR ALL TO authenticated USING (true) WITH CHECK (true);
`;

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'timeline'>('general');

  // General Form State
  const [generalForm, setGeneralForm] = useState({
    id: '',
    title_tr: '',
    title_en: '',
    content_tr: '',
    content_en: '',
  });
  const [generalLoading, setGeneralLoading] = useState(true);
  const [generalSaving, setGeneralSaving] = useState(false);
  const [generalSuccess, setGeneralSuccess] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Timeline Milestones State
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [editingMilestone, setEditingMilestone] = useState<TimelineMilestone | null>(null);
  const [creatingMilestone, setCreatingMilestone] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState<TimelineMilestone>(emptyMilestoneForm);
  const [milestoneSaving, setMilestoneSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TimelineMilestone | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [timelineError, setTimelineError] = useState('');
  const [timelineSuccess, setTimelineSuccess] = useState('');
  const [tableMissingNotice, setTableMissingNotice] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Admin Locale
  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });

  const dict = getAdminDict(locale);

  // Fetch General About Information
  const fetchGeneral = useCallback(async () => {
    setGeneralLoading(true);
    console.debug('[admin/about] Fetching general about data…');
    try {
      const { data, error } = await supabase.from('site_about').select('*').limit(1).single();
      if (error) {
        console.debug('[admin/about] site_about fetch note:', error.message);
      }
      if (data) {
        setGeneralForm({
          id: data.id,
          title_tr: data.title_tr || '',
          title_en: data.title_en || '',
          content_tr: data.content_tr || '',
          content_en: data.content_en || '',
        });
      }
    } catch (err) {
      console.debug('[admin/about] General fetch exception:', err);
    } finally {
      setGeneralLoading(false);
    }
  }, []);

  // Fetch Timeline Milestones
  const fetchMilestones = useCallback(async () => {
    setTimelineLoading(true);
    console.debug('[admin/about] Fetching timeline milestones…');
    try {
      const { data, error } = await supabase
        .from('about_timeline')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.debug('[admin/about] about_timeline query notice:', error);
        if (error.code === 'PGRST205' || error.message?.includes('does not exist') || error.code === '42P01') {
          setTableMissingNotice(true);
        }
        // Fallback to defaults so the UI is usable immediately
        setMilestones(DEFAULT_MILESTONES);
      } else if (data && data.length > 0) {
        setTableMissingNotice(false);
        setMilestones(data);
      } else {
        // Table exists but is empty
        setTableMissingNotice(false);
        setMilestones(DEFAULT_MILESTONES);
      }
    } catch (err) {
      console.debug('[admin/about] Timeline fetch exception:', err);
      setMilestones(DEFAULT_MILESTONES);
    } finally {
      setTimelineLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGeneral();
    fetchMilestones();
  }, [fetchGeneral, fetchMilestones]);

  // General Form Submit
  const handleSaveGeneral = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralSaving(true);
    setGeneralError('');
    setGeneralSuccess('');

    try {
      if (generalForm.id) {
        console.debug('[admin/about] Updating site_about…');
        const { error } = await supabase
          .from('site_about')
          .update({
            title_tr: generalForm.title_tr,
            title_en: generalForm.title_en,
            content_tr: generalForm.content_tr,
            content_en: generalForm.content_en,
          })
          .eq('id', generalForm.id);

        if (error) {
          console.debug('[admin/about] General update error:', error);
          setGeneralError(dict.common.error);
        } else {
          setGeneralSuccess(dict.common.success);
        }
      } else {
        console.debug('[admin/about] Creating site_about row…');
        const { data, error } = await supabase
          .from('site_about')
          .insert({
            title_tr: generalForm.title_tr,
            title_en: generalForm.title_en,
            content_tr: generalForm.content_tr,
            content_en: generalForm.content_en,
          })
          .select()
          .single();

        if (error) {
          console.debug('[admin/about] General create error:', error);
          setGeneralError(dict.common.error);
        } else {
          setGeneralForm((prev) => ({ ...prev, id: data.id }));
          setGeneralSuccess(dict.common.success);
        }
      }
    } catch (err) {
      console.debug('[admin/about] Save general exception:', err);
      setGeneralError(dict.common.error);
    } finally {
      setGeneralSaving(false);
    }
  };

  // Timeline Milestone Actions
  const startCreateMilestone = () => {
    const nextCode = String(milestones.length + 1).padStart(2, '0');
    const nextSort = milestones.length > 0 ? Math.max(...milestones.map((m) => m.sort_order || 0)) + 1 : 1;
    const nextSide: 'left' | 'right' = milestones.length % 2 === 0 ? 'right' : 'left';

    setEditingMilestone(null);
    setMilestoneForm({
      ...emptyMilestoneForm,
      code: nextCode,
      sort_order: nextSort,
      side: nextSide,
    });
    setCreatingMilestone(true);
    setTimelineError('');
    setTimelineSuccess('');
  };

  const startEditMilestone = (item: TimelineMilestone) => {
    setCreatingMilestone(false);
    setEditingMilestone(item);
    setMilestoneForm({ ...item });
    setTimelineError('');
    setTimelineSuccess('');
  };

  const cancelMilestoneForm = () => {
    setCreatingMilestone(false);
    setEditingMilestone(null);
    setMilestoneForm(emptyMilestoneForm);
    setTimelineError('');
  };

  const handleSaveMilestone = async (e: FormEvent) => {
    e.preventDefault();
    setMilestoneSaving(true);
    setTimelineError('');
    setTimelineSuccess('');

    const payload = {
      code: milestoneForm.code.trim() || '01',
      year: milestoneForm.year.trim() || '2026',
      period_tr: milestoneForm.period_tr.trim(),
      period_en: milestoneForm.period_en.trim(),
      title_tr: milestoneForm.title_tr.trim(),
      title_en: milestoneForm.title_en.trim(),
      desc_tr: milestoneForm.desc_tr.trim(),
      desc_en: milestoneForm.desc_en.trim(),
      status_tr: milestoneForm.status_tr.trim() || 'YAYINLANDI',
      status_en: milestoneForm.status_en.trim() || 'RELEASED',
      tag: milestoneForm.tag?.trim() || 'SOFTWARE',
      side: milestoneForm.side,
      sort_order: Number(milestoneForm.sort_order) || 0,
      enabled: milestoneForm.enabled,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingMilestone && editingMilestone.id) {
        console.debug('[admin/about] Updating milestone:', editingMilestone.id);
        const { error } = await supabase
          .from('about_timeline')
          .update(payload)
          .eq('id', editingMilestone.id);

        if (error) {
          console.debug('[admin/about] Milestone update error:', error);
          if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
            setTableMissingNotice(true);
          }
          setTimelineError(dict.common.error);
        } else {
          setTimelineSuccess(dict.common.success);
          cancelMilestoneForm();
          fetchMilestones();
        }
      } else {
        console.debug('[admin/about] Inserting milestone:', payload.code);
        const { error } = await supabase.from('about_timeline').insert(payload);

        if (error) {
          console.debug('[admin/about] Milestone insert error:', error);
          if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
            setTableMissingNotice(true);
          }
          setTimelineError(dict.common.error);
        } else {
          setTimelineSuccess(dict.common.success);
          cancelMilestoneForm();
          fetchMilestones();
        }
      }
    } catch (err) {
      console.debug('[admin/about] Milestone save exception:', err);
      setTimelineError(dict.common.error);
    } finally {
      setMilestoneSaving(false);
    }
  };

  const handleDeleteMilestone = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    console.debug('[admin/about] Deleting milestone:', deleteTarget.id);

    try {
      if (deleteTarget.id) {
        const { error } = await supabase.from('about_timeline').delete().eq('id', deleteTarget.id);
        if (error) {
          console.debug('[admin/about] Milestone delete error:', error);
        }
      }
      setMilestones((prev) => prev.filter((m) => m !== deleteTarget && m.id !== deleteTarget.id));
      setTimelineSuccess(dict.common.success);
    } catch (err) {
      console.debug('[admin/about] Delete exception:', err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const toggleMilestoneEnabled = async (item: TimelineMilestone) => {
    const nextState = !item.enabled;
    if (item.id) {
      const { error } = await supabase
        .from('about_timeline')
        .update({ enabled: nextState })
        .eq('id', item.id);
      if (error) {
        console.debug('[admin/about] Toggle error:', error);
      }
    }
    setMilestones((prev) =>
      prev.map((m) => (m === item || m.id === item.id ? { ...m, enabled: nextState } : m))
    );
  };

  const copySqlMigration = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(SQL_MIGRATION_TEXT);
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 2500);
    }
  };

  if (generalLoading && timelineLoading) {
    return <LoadingSpinner text={dict.common.loading} large />;
  }

  return (
    <>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>{dict.about.title}</h1>
          <p>{dict.about.breadcrumb}</p>
        </div>
        <Link
          href="/tr/about"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
        >
          <span>↗ Sitede Gör</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" role="tablist" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.75rem' }}>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
          role="tab"
          aria-selected={activeTab === 'general'}
        >
          {dict.about.tabGeneral}
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
          role="tab"
          aria-selected={activeTab === 'timeline'}
        >
          {dict.about.tabTimeline}
          <span
            style={{
              marginLeft: '0.5rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '10px',
              fontSize: '0.65rem',
              background: activeTab === 'timeline' ? '#ffffff' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'timeline' ? '#000000' : 'rgba(255,255,255,0.6)',
              fontWeight: 600,
            }}
          >
            {milestones.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GENERAL ABOUT CONTENT */}
      {/* ========================================================================= */}
      {activeTab === 'general' && (
        <div className="admin-tab-panel">
          {generalError && <div className="admin-login-error" role="alert">{generalError}</div>}
          {generalSuccess && (
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px',
                padding: '0.6rem 0.8rem',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '1rem',
              }}
              role="status"
            >
              {generalSuccess}
            </div>
          )}

          <form onSubmit={handleSaveGeneral} className="admin-form" style={{ maxWidth: '800px' }}>
            <div>
              <div className="admin-form-row">
                <FormField
                  label={dict.about.titleTr}
                  name="title_tr"
                  value={generalForm.title_tr}
                  onChange={(v) => {
                    setGeneralForm((p) => ({ ...p, title_tr: v }));
                    setGeneralSuccess('');
                  }}
                />
                <FormField
                  label={dict.about.titleEn}
                  name="title_en"
                  value={generalForm.title_en}
                  onChange={(v) => {
                    setGeneralForm((p) => ({ ...p, title_en: v }));
                    setGeneralSuccess('');
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <TranslationAction
                  sourceText={generalForm.title_tr}
                  targetText={generalForm.title_en}
                  sourceLang="tr"
                  targetLang="en"
                  context="about page heading"
                  onTranslated={(v) => setGeneralForm((p) => ({ ...p, title_en: v }))}
                />
                <TranslationAction
                  sourceText={generalForm.title_en}
                  targetText={generalForm.title_tr}
                  sourceLang="en"
                  targetLang="tr"
                  context="about page heading"
                  onTranslated={(v) => setGeneralForm((p) => ({ ...p, title_tr: v }))}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <FormField
                label={dict.about.contentTr}
                name="content_tr"
                type="textarea"
                value={generalForm.content_tr}
                onChange={(v) => {
                  setGeneralForm((p) => ({ ...p, content_tr: v }));
                  setGeneralSuccess('');
                }}
              />
              <TranslationAction
                sourceText={generalForm.content_tr}
                targetText={generalForm.content_en}
                sourceLang="tr"
                targetLang="en"
                context="about developer profile markdown"
                onTranslated={(v) => setGeneralForm((p) => ({ ...p, content_en: v }))}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <FormField
                label={dict.about.contentEn}
                name="content_en"
                type="textarea"
                value={generalForm.content_en}
                onChange={(v) => {
                  setGeneralForm((p) => ({ ...p, content_en: v }));
                  setGeneralSuccess('');
                }}
              />
              <TranslationAction
                sourceText={generalForm.content_en}
                targetText={generalForm.content_tr}
                sourceLang="en"
                targetLang="tr"
                context="about developer profile markdown"
                onTranslated={(v) => setGeneralForm((p) => ({ ...p, content_tr: v }))}
              />
            </div>

            <div className="admin-actions" style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={generalSaving}>
                {generalSaving ? dict.about.saving : dict.about.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SCHEMATIC TIMELINE MILESTONES */}
      {/* ========================================================================= */}
      {activeTab === 'timeline' && (
        <div className="admin-tab-panel">
          {/* Table missing alert banner if applicable */}
          {tableMissingNotice && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.35rem', color: '#ffffff', fontSize: '0.85rem' }}>
                    ⚙ {dict.about.sqlNoticeTitle}
                  </h4>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', lineHeight: 1.5 }}>
                    {dict.about.sqlNoticeDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copySqlMigration}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {sqlCopied ? `✓ ${dict.about.copiedSqlBtn}` : dict.about.copySqlBtn}
                </button>
              </div>
            </div>
          )}

          {/* Feedback alerts */}
          {timelineError && <div className="admin-login-error" role="alert">{timelineError}</div>}
          {timelineSuccess && (
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px',
                padding: '0.6rem 0.8rem',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '1rem',
              }}
              role="status"
            >
              {timelineSuccess}
            </div>
          )}

          {/* Toolbar */}
          <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Şematik zaman çizelgesindeki tüm kilometre taşlarını, dallanma yönlerini ve teknik rozetleri buradan yönetebilirsiniz.
            </p>
            {!creatingMilestone && !editingMilestone && (
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={startCreateMilestone}
              >
                + {dict.about.newMilestone}
              </button>
            )}
          </div>

          {/* Create / Edit Milestone Form */}
          {(creatingMilestone || editingMilestone) && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '2rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#ffffff', letterSpacing: '0.05em' }}>
                  {editingMilestone ? `${dict.about.editMilestone} (AXIS_0${milestoneForm.code})` : dict.about.newMilestone}
                </h3>
                <button
                  type="button"
                  onClick={cancelMilestoneForm}
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                >
                  ✕ {dict.common.cancel}
                </button>
              </div>

              <form onSubmit={handleSaveMilestone} className="admin-form">
                {/* Meta Row: Code, Year, Tag, Side, Sort Order */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  <FormField
                    label={dict.about.code}
                    name="code"
                    value={milestoneForm.code}
                    onChange={(v) => setMilestoneForm((p) => ({ ...p, code: v }))}
                    placeholder="01"
                    required
                  />
                  <FormField
                    label={dict.about.year}
                    name="year"
                    value={milestoneForm.year}
                    onChange={(v) => setMilestoneForm((p) => ({ ...p, year: v }))}
                    placeholder="2026"
                    required
                  />
                  <FormField
                    label={dict.about.tag}
                    name="tag"
                    value={milestoneForm.tag || ''}
                    onChange={(v) => setMilestoneForm((p) => ({ ...p, tag: v }))}
                    placeholder="SOFTWARE"
                  />
                  <FormField
                    label={dict.about.side}
                    name="side"
                    type="select"
                    value={milestoneForm.side}
                    onChange={(v) => setMilestoneForm((p) => ({ ...p, side: v as 'left' | 'right' }))}
                    options={SIDE_OPTIONS}
                  />
                  <FormField
                    label={dict.about.sortOrder}
                    name="sort_order"
                    type="number"
                    value={String(milestoneForm.sort_order)}
                    onChange={(v) => setMilestoneForm((p) => ({ ...p, sort_order: parseInt(v) || 0 }))}
                  />
                </div>

                {/* Period Row */}
                <div style={{ marginTop: '1rem' }}>
                  <div className="admin-form-row">
                    <FormField
                      label={dict.about.periodTr}
                      name="period_tr"
                      value={milestoneForm.period_tr}
                      onChange={(v) => setMilestoneForm((p) => ({ ...p, period_tr: v }))}
                      placeholder="2026 // AĞUSTOS"
                      required
                    />
                    <FormField
                      label={dict.about.periodEn}
                      name="period_en"
                      value={milestoneForm.period_en}
                      onChange={(v) => setMilestoneForm((p) => ({ ...p, period_en: v }))}
                      placeholder="2026 // AUGUST"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                    <TranslationAction
                      sourceText={milestoneForm.period_tr}
                      targetText={milestoneForm.period_en}
                      sourceLang="tr"
                      targetLang="en"
                      context="milestone period date"
                      onTranslated={(v) => setMilestoneForm((p) => ({ ...p, period_en: v }))}
                    />
                    <TranslationAction
                      sourceText={milestoneForm.period_en}
                      targetText={milestoneForm.period_tr}
                      sourceLang="en"
                      targetLang="tr"
                      context="milestone period date"
                      onTranslated={(v) => setMilestoneForm((p) => ({ ...p, period_tr: v }))}
                    />
                  </div>
                </div>

                {/* Title Row */}
                <div style={{ marginTop: '1rem' }}>
                  <div className="admin-form-row">
                    <FormField
                      label={dict.about.milestoneTitleTr}
                      name="title_tr"
                      value={milestoneForm.title_tr}
                      onChange={(v) => setMilestoneForm((p) => ({ ...p, title_tr: v }))}
                      placeholder="BookOS v1.2.0 Kararlı Sürümü"
                      required
                    />
                    <FormField
                      label={dict.about.milestoneTitleEn}
                      name="title_en"
                      value={milestoneForm.title_en}
                      onChange={(v) => setMilestoneForm((p) => ({ ...p, title_en: v }))}
                      placeholder="BookOS v1.2.0 Stable Release"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                    <TranslationAction
                      sourceText={milestoneForm.title_tr}
                      targetText={milestoneForm.title_en}
                      sourceLang="tr"
                      targetLang="en"
                      context="milestone title"
                      onTranslated={(v) => setMilestoneForm((p) => ({ ...p, title_en: v }))}
                    />
                    <TranslationAction
                      sourceText={milestoneForm.title_en}
                      targetText={milestoneForm.title_tr}
                      sourceLang="en"
                      targetLang="tr"
                      context="milestone title"
                      onTranslated={(v) => setMilestoneForm((p) => ({ ...p, title_tr: v }))}
                    />
                  </div>
                </div>

                {/* Description Row */}
                <div style={{ marginTop: '1rem' }}>
                  <FormField
                    label={dict.about.descTr}
                    name="desc_tr"
                    type="textarea"
                    value={milestoneForm.desc_tr}
                    onChange={(v) => setMilestoneForm((p) => ({ ...p, desc_tr: v }))}
                    placeholder="Edebiyat, derin odaklanma ve dokunsal bilgi sentezi için..."
                    required
                  />
                  <div style={{ marginTop: '0.25rem', marginBottom: '1rem' }}>
                    <TranslationAction
                      sourceText={milestoneForm.desc_tr}
                      targetText={milestoneForm.desc_en}
                      sourceLang="tr"
                      targetLang="en"
                      context="milestone description paragraph"
                      onTranslated={(v) => setMilestoneForm((p) => ({ ...p, desc_en: v }))}
                    />
                  </div>
                  <FormField
                    label={dict.about.descEn}
                    name="desc_en"
                    type="textarea"
                    value={milestoneForm.desc_en}
                    onChange={(v) => setMilestoneForm((p) => ({ ...p, desc_en: v }))}
                    placeholder="Independent desktop operating system environment..."
                    required
                  />
                  <div style={{ marginTop: '0.25rem' }}>
                    <TranslationAction
                      sourceText={milestoneForm.desc_en}
                      targetText={milestoneForm.desc_tr}
                      sourceLang="en"
                      targetLang="tr"
                      context="milestone description paragraph"
                      onTranslated={(v) => setMilestoneForm((p) => ({ ...p, desc_tr: v }))}
                    />
                  </div>
                </div>

                {/* Status Badges Row */}
                <div style={{ marginTop: '1rem' }}>
                  <div className="admin-form-row">
                    <FormField
                      label={dict.about.statusTr}
                      name="status_tr"
                      value={milestoneForm.status_tr}
                      onChange={(v) => setMilestoneForm((p) => ({ ...p, status_tr: v }))}
                      placeholder="YAYINLANDI"
                    />
                    <FormField
                      label={dict.about.statusEn}
                      name="status_en"
                      value={milestoneForm.status_en}
                      onChange={(v) => setMilestoneForm((p) => ({ ...p, status_en: v }))}
                      placeholder="RELEASED"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                    <TranslationAction
                      sourceText={milestoneForm.status_tr}
                      targetText={milestoneForm.status_en}
                      sourceLang="tr"
                      targetLang="en"
                      context="milestone status badge"
                      onTranslated={(v) => setMilestoneForm((p) => ({ ...p, status_en: v }))}
                    />
                    <TranslationAction
                      sourceText={milestoneForm.status_en}
                      targetText={milestoneForm.status_tr}
                      sourceLang="en"
                      targetLang="tr"
                      context="milestone status badge"
                      onTranslated={(v) => setMilestoneForm((p) => ({ ...p, status_tr: v }))}
                    />
                  </div>
                </div>

                {/* Active Checkbox & Submit */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: '#ffffff' }}>
                    <input
                      type="checkbox"
                      checked={milestoneForm.enabled}
                      onChange={(e) => setMilestoneForm((p) => ({ ...p, enabled: e.target.checked }))}
                    />
                    {dict.about.enabled}
                  </label>

                  <div className="admin-actions">
                    <button
                      type="button"
                      onClick={cancelMilestoneForm}
                      className="admin-btn admin-btn-secondary"
                    >
                      {dict.common.cancel}
                    </button>
                    <button
                      type="submit"
                      className="admin-btn admin-btn-primary"
                      disabled={milestoneSaving}
                    >
                      {milestoneSaving ? dict.about.saving : dict.about.save}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Milestones List Table */}
          {milestones.length === 0 ? (
            <div className="admin-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <p style={{ margin: '0 0 0.5rem', color: '#ffffff', fontSize: '0.9rem' }}>
                {dict.about.noMilestones}
              </p>
              <p style={{ margin: '0 0 1.25rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                {dict.about.noMilestonesDesc}
              </p>
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={startCreateMilestone}
              >
                + {dict.about.newMilestone}
              </button>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Eksen</th>
                    <th style={{ width: '70px' }}>Yıl</th>
                    <th style={{ width: '90px' }}>Yön</th>
                    <th>Başlık & Dönem</th>
                    <th>Etiket & Durum</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>Sıra</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>Durum</th>
                    <th style={{ width: '130px', textAlign: 'right' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.7rem',
                            color: 'rgba(255,255,255,0.7)',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '3px',
                          }}
                        >
                          AXIS_0{item.code}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.8rem' }}>
                          {item.year}
                        </span>
                      </td>
                      <td>
                        <span
                          className="admin-badge"
                          style={{
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: item.side === 'right' ? '#ffffff' : 'rgba(255,255,255,0.6)',
                            background: item.side === 'right' ? 'rgba(255,255,255,0.08)' : 'transparent',
                          }}
                        >
                          {item.side === 'right' ? 'SAĞ ➔' : '◀ SOL'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, color: '#ffffff', fontSize: '0.85rem' }}>
                          {locale === 'tr' ? item.title_tr : item.title_en}
                        </div>
                        <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>
                          {locale === 'tr' ? item.period_tr : item.period_en}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {item.tag && (
                            <span
                              className="admin-badge"
                              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
                            >
                              {item.tag}
                            </span>
                          )}
                          <span
                            className="admin-badge"
                            style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', background: 'rgba(255,255,255,0.05)' }}
                          >
                            ● {locale === 'tr' ? item.status_tr : item.status_en}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                        {item.sort_order}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => toggleMilestoneEnabled(item)}
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          style={{
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.65rem',
                            color: item.enabled ? '#2ecc71' : 'rgba(255,255,255,0.3)',
                          }}
                        >
                          {item.enabled ? '● Aktif' : '○ Gizli'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={() => startEditMilestone(item)}
                          >
                            {locale === 'tr' ? 'Düzenle' : 'Edit'}
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => setDeleteTarget(item)}
                          >
                            {locale === 'tr' ? 'Sil' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={dict.about.deleteMilestoneConfirm}
        message={
          deleteTarget
            ? `"${deleteTarget.title_tr || deleteTarget.title_en}" (${deleteTarget.year}) kilometre taşını silmek istediğinize emin misiniz?`
            : ''
        }
        confirmLabel={locale === 'tr' ? 'Sil' : 'Delete'}
        cancelLabel={dict.common.cancel}
        danger
        onConfirm={handleDeleteMilestone}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
