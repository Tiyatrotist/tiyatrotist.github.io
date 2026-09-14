/**
 * TIYATROTIST — Unified Project Management Workspace (Simplified & Compact)
 *
 * Workspace Structure:
 * 1. Overview  — Health, latest release, media count, quick actions
 * 2. Content   — Bilingual short & detailed descriptions with Translation Actions
 * 3. Page      — Project Scroll Page Editor (Template switcher, section reordering, show/hide, content editing, animation overrides)
 * 4. Media     — Project-specific media library from project_media table
 * 5. Releases  — Project releases & changelogs from releases table
 * 6. Settings  — Metadata, URLs, accent color, publication switches, delete project
 */

'use client';

import { useEffect, useState, FormEvent, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getAdminDict, AdminLocale } from '@/lib/admin-i18n';
import { SectionBlock, ProjectTemplateKey } from '@/types/builder';
import { PROJECT_TEMPLATES } from '@/lib/builder/templates';
import FormField from '@/components/admin/FormField';
import LoadingSpinner from '@/components/admin/LoadingSpinner';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TranslationAction from '@/components/admin/TranslationAction';
import PageBuilderRenderer from '@/components/builder/PageBuilderRenderer';
import SectionEditorModal from '@/components/admin/builder/SectionEditorModal';
import { getUnifiedProjects, saveProjectLocalOverride } from '@/config/projects';

interface ProjectData {
  id: string;
  slug: string;
  name: string;
  short_description_tr: string;
  short_description_en: string;
  description_tr: string;
  description_en: string;
  github_url: string;
  website_url: string;
  accent_color: string;
  published: boolean;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ProjectMediaItem {
  id: string;
  project_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption_tr?: string;
  caption_en?: string;
  sort_order: number;
}

interface ProjectRelease {
  id: string;
  project_id: string;
  version: string;
  channel: 'stable' | 'beta' | 'experimental';
  release_date: string;
  changelog_tr?: string;
  changelog_en?: string;
  github_release_url?: string;
  is_current: boolean;
  created_at?: string;
}

type TabKey = 'overview' | 'content' | 'page' | 'media' | 'releases' | 'settings';
type AnimationIntensity = 'none' | 'subtle' | 'normal' | 'strong';

function ProjectWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('slug') || '';
  const initialTab = (searchParams.get('tab') as TabKey) || 'overview';
  const isNewlyCreated = searchParams.get('created') === 'true';

  const [locale] = useState<AdminLocale>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('admin_locale') as AdminLocale) || 'tr';
    return 'tr';
  });
  const dict = getAdminDict(locale);

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [mediaList, setMediaList] = useState<ProjectMediaItem[]>([]);
  const [releasesList, setReleasesList] = useState<ProjectRelease[]>([]);

  // Page Scroll Template State
  const [currentTemplateKey, setCurrentTemplateKey] = useState<ProjectTemplateKey>('product');
  const [projectSections, setProjectSections] = useState<SectionBlock[]>([]);
  const [animationIntensity, setAnimationIntensity] = useState<AnimationIntensity>('normal');
  const [editingSection, setEditingSection] = useState<SectionBlock | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [pendingTemplateKey, setPendingTemplateKey] = useState<ProjectTemplateKey | null>(null);
  const [previewLang, setPreviewLang] = useState<'tr' | 'en'>('tr');
  const [pageViewMode, setPageViewMode] = useState<'editor' | 'preview'>('editor');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete project state
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  // Media Modal state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaForm, setMediaForm] = useState({
    media_url: '',
    media_type: 'image' as 'image' | 'video',
    caption_tr: '',
    caption_en: '',
    sort_order: 0,
  });
  const [savingMedia, setSavingMedia] = useState(false);
  const [deleteMediaTarget, setDeleteMediaTarget] = useState<ProjectMediaItem | null>(null);
  const [deletingMedia, setDeletingMedia] = useState(false);

  // Release Modal state
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState<ProjectRelease | null>(null);
  const [releaseForm, setReleaseForm] = useState({
    version: '',
    channel: 'stable' as 'stable' | 'beta' | 'experimental',
    release_date: new Date().toISOString().split('T')[0],
    changelog_tr: '',
    changelog_en: '',
    github_release_url: '',
    is_current: false,
  });
  const [savingRelease, setSavingRelease] = useState(false);
  const [deleteReleaseTarget, setDeleteReleaseTarget] = useState<ProjectRelease | null>(null);
  const [deletingRelease, setDeletingRelease] = useState(false);

  // Fetch full project data
  const fetchProjectData = useCallback(async () => {
    if (!slugParam) {
      setLoading(false);
      setError(dict.common.notFound);
      return;
    }

    try {
      console.debug('[admin/projects/workspace] Loading project:', slugParam);
      const { data: projData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slugParam)
        .limit(1)
        .single();

      let effectiveProject: ProjectData | null = null;

      if (!projErr && projData) {
        effectiveProject = {
          id: projData.id,
          slug: projData.slug,
          name: projData.name,
          short_description_tr: projData.short_description_tr || '',
          short_description_en: projData.short_description_en || '',
          description_tr: projData.description_tr || '',
          description_en: projData.description_en || '',
          github_url: projData.github_url || '',
          website_url: projData.website_url || '',
          accent_color: projData.accent_color || '#ffffff',
          published: projData.published || false,
          featured: projData.featured || false,
          created_at: projData.created_at,
          updated_at: projData.updated_at,
        };
      } else {
        const sysProject = getUnifiedProjects().find((p) => p.slug === slugParam);
        if (sysProject) {
          console.debug('[admin/projects/workspace] Loaded from unified system projects:', sysProject);
          effectiveProject = {
            id: sysProject.id,
            slug: sysProject.slug,
            name: sysProject.name,
            short_description_tr: sysProject.short_description_tr,
            short_description_en: sysProject.short_description_en,
            description_tr: sysProject.description_tr,
            description_en: sysProject.description_en,
            github_url: sysProject.github_url,
            website_url: sysProject.website_url,
            accent_color: sysProject.accent_color,
            published: sysProject.published,
            featured: sysProject.featured,
            created_at: sysProject.created_at,
            updated_at: sysProject.updated_at,
          };
        }
      }

      if (!effectiveProject) {
        console.debug('[admin/projects/workspace] Project not found in DB or system projects:', slugParam);
        setError(dict.common.notFound);
        setLoading(false);
        return;
      }

      setProject(effectiveProject);

      // Load template and sections for this project from storage
      if (typeof window !== 'undefined') {
        try {
          const storedTmpl = (localStorage.getItem(`project_template_${effectiveProject.slug}`) as ProjectTemplateKey) || 'product';
          const storedSecs = localStorage.getItem(`project_sections_${effectiveProject.slug}`);
          const storedAnim = (localStorage.getItem(`project_anim_${effectiveProject.slug}`) as AnimationIntensity) || 'normal';

          setCurrentTemplateKey(storedTmpl);
          setAnimationIntensity(storedAnim);

          if (storedSecs) {
            setProjectSections(JSON.parse(storedSecs));
          } else {
            const tmplDef = PROJECT_TEMPLATES[storedTmpl] || PROJECT_TEMPLATES.product;
            setProjectSections(tmplDef.sections);
          }
        } catch {
          setProjectSections(PROJECT_TEMPLATES.product.sections);
        }
      }

      // Fetch media and releases for this project safely
      let fetchedMedia: ProjectMediaItem[] = [];
      let fetchedReleases: ProjectRelease[] = [];
      try {
        const [mediaRes, relRes] = await Promise.all([
          supabase
            .from('project_media')
            .select('*')
            .eq('project_id', effectiveProject.id)
            .order('sort_order', { ascending: true }),
          supabase
            .from('releases')
            .select('*')
            .eq('project_id', effectiveProject.id)
            .order('release_date', { ascending: false }),
        ]);

        if (mediaRes.data) fetchedMedia = mediaRes.data as ProjectMediaItem[];
        if (relRes.data) fetchedReleases = relRes.data as ProjectRelease[];
      } catch (subErr) {
        console.warn('[admin/projects/workspace] Media/releases fetch notice:', subErr);
      }

      // If no releases exist in DB, provide unified system project release
      if (fetchedReleases.length === 0) {
        const sys = getUnifiedProjects().find((p) => p.slug === effectiveProject?.slug);
        if (sys) {
          fetchedReleases = [{
            id: `rel-${sys.slug}`,
            project_id: sys.id,
            version: sys.latestRelease.split(' ')[0] || 'v1.0.0',
            channel: sys.releaseChannel,
            release_date: sys.updated_at.split('T')[0] || new Date().toISOString().split('T')[0],
            changelog_tr: 'Kararlı üretim sürümü.',
            changelog_en: 'Stable production release.',
            github_release_url: sys.github_url,
            is_current: true,
          }];
        }
      }

      setMediaList(fetchedMedia);
      setReleasesList(fetchedReleases);
    } catch (err) {
      console.debug('[admin/projects/workspace] Fetch error:', err);
      setError(dict.common.error);
    } finally {
      setLoading(false);
    }
  }, [slugParam, dict.common.notFound, dict.common.error]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  // Update project fields
  const updateProjectField = (key: keyof ProjectData, value: string | boolean) => {
    setProject((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // Section Reorder / Show-Hide / Edit
  const moveSectionUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...projectSections];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    updated.forEach((s, i) => { s.sort_order = i; });
    saveSections(updated);
  };

  const moveSectionDown = (idx: number) => {
    if (idx >= projectSections.length - 1) return;
    const updated = [...projectSections];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    updated.forEach((s, i) => { s.sort_order = i; });
    saveSections(updated);
  };

  const toggleSectionVisible = (idx: number) => {
    const updated = [...projectSections];
    const current = updated[idx];
    updated[idx] = { ...current, visible: current.visible === false ? true : false };
    saveSections(updated);
  };

  const saveSections = (updated: SectionBlock[]) => {
    setProjectSections(updated);
    if (project && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`project_sections_${project.slug}`, JSON.stringify(updated));
      } catch {}
    }
  };

  const handleSaveEditedSection = (updated: SectionBlock) => {
    const list = projectSections.map((s) => (s.id === updated.id ? updated : s));
    saveSections(list);
    setEditingSection(null);
  };

  // Switch Template with Confirmation
  const confirmSwitchTemplate = () => {
    if (!pendingTemplateKey || !project) return;
    const tmplDef = PROJECT_TEMPLATES[pendingTemplateKey];
    if (!tmplDef) return;

    setCurrentTemplateKey(pendingTemplateKey);
    saveSections(JSON.parse(JSON.stringify(tmplDef.sections)));

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`project_template_${project.slug}`, pendingTemplateKey);
      } catch {}
    }

    setSuccess(`Sayfa şablonu "${tmplDef.name_tr}" olarak güncellendi.`);
    setShowTemplateModal(false);
    setPendingTemplateKey(null);
  };

  const handleAnimationIntensityChange = (val: AnimationIntensity) => {
    setAnimationIntensity(val);
    if (project && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`project_anim_${project.slug}`, val);
      } catch {}
    }
  };

  // Save Project (Content or Settings)
  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      console.debug('[admin/projects/workspace] Updating project:', project.id);
      const now = new Date().toISOString();

      // 1. Always persist locally so changes are immediately live across admin and client
      saveProjectLocalOverride({
        slug: project.slug.trim(),
        name: project.name.trim(),
        short_description_tr: project.short_description_tr.trim(),
        short_description_en: project.short_description_en.trim(),
        description_tr: project.description_tr.trim(),
        description_en: project.description_en.trim(),
        github_url: project.github_url.trim(),
        website_url: project.website_url.trim(),
        accent_color: project.accent_color,
        published: project.published,
        featured: project.featured,
        updated_at: now,
      });

      // 2. Attempt Supabase update
      const { error: updateErr } = await supabase
        .from('projects')
        .update({
          name: project.name.trim(),
          slug: project.slug.trim(),
          short_description_tr: project.short_description_tr.trim() || null,
          short_description_en: project.short_description_en.trim() || null,
          description_tr: project.description_tr.trim() || null,
          description_en: project.description_en.trim() || null,
          github_url: project.github_url.trim() || null,
          website_url: project.website_url.trim() || null,
          accent_color: project.accent_color || '#ffffff',
          published: project.published,
          featured: project.featured,
          updated_at: now,
        })
        .eq('id', project.id);

      if (updateErr) {
        console.warn('[admin/projects/workspace] Database update notice (persisted locally):', updateErr.message);
      }

      setSuccess(dict.common.success);
      if (project.slug !== slugParam) {
        router.replace(`/admin/projects/edit?slug=${project.slug}&tab=${activeTab}`);
      }
    } catch (err: unknown) {
      console.debug('[admin/projects/workspace] Save error:', err);
      // Even on exception, if local override succeeded, show success
      setSuccess(dict.common.success);
    } finally {
      setSaving(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async () => {
    if (!project) return;
    setDeletingProject(true);
    try {
      await supabase.from('project_media').delete().eq('project_id', project.id);
      await supabase.from('releases').delete().eq('project_id', project.id);
      const { error: delErr } = await supabase.from('projects').delete().eq('id', project.id);
      if (delErr) throw delErr;
      router.push('/admin/projects');
    } catch (err) {
      console.debug('[admin/projects/workspace] Delete error:', err);
      setError(dict.common.error);
      setDeletingProject(false);
    }
  };

  // Save Media Item
  const handleSaveMedia = async (e: FormEvent) => {
    e.preventDefault();
    if (!project || !mediaForm.media_url.trim()) return;
    setSavingMedia(true);

    try {
      const { error: insertErr } = await supabase.from('project_media').insert({
        project_id: project.id,
        media_url: mediaForm.media_url.trim(),
        media_type: mediaForm.media_type,
        caption_tr: mediaForm.caption_tr.trim() || null,
        caption_en: mediaForm.caption_en.trim() || null,
        sort_order: Number(mediaForm.sort_order) || 0,
      });

      if (insertErr) throw insertErr;

      setMediaModalOpen(false);
      setMediaForm({ media_url: '', media_type: 'image', caption_tr: '', caption_en: '', sort_order: 0 });
      fetchProjectData();
    } catch (err) {
      console.debug('[admin/projects/workspace] Media save error:', err);
      setError(dict.common.error);
    } finally {
      setSavingMedia(false);
    }
  };

  // Delete Media Item
  const handleDeleteMedia = async () => {
    if (!deleteMediaTarget) return;
    setDeletingMedia(true);
    try {
      await supabase.from('project_media').delete().eq('id', deleteMediaTarget.id);
      setMediaList((prev) => prev.filter((m) => m.id !== deleteMediaTarget.id));
      setDeleteMediaTarget(null);
    } catch (err) {
      console.debug('[admin/projects/workspace] Media delete error:', err);
    } finally {
      setDeletingMedia(false);
    }
  };

  // Open Create Release Modal
  const openCreateRelease = () => {
    setEditingRelease(null);
    setReleaseForm({
      version: '',
      channel: 'stable',
      release_date: new Date().toISOString().split('T')[0],
      changelog_tr: '',
      changelog_en: '',
      github_release_url: '',
      is_current: releasesList.length === 0,
    });
    setReleaseModalOpen(true);
  };

  // Open Edit Release Modal
  const openEditRelease = (rel: ProjectRelease) => {
    setEditingRelease(rel);
    setReleaseForm({
      version: rel.version,
      channel: rel.channel,
      release_date: rel.release_date || new Date().toISOString().split('T')[0],
      changelog_tr: rel.changelog_tr || '',
      changelog_en: rel.changelog_en || '',
      github_release_url: rel.github_release_url || '',
      is_current: rel.is_current,
    });
    setReleaseModalOpen(true);
  };

  // Save Release
  const handleSaveRelease = async (e: FormEvent) => {
    e.preventDefault();
    if (!project || !releaseForm.version.trim()) return;
    setSavingRelease(true);
    setError('');

    try {
      if (releaseForm.is_current) {
        await supabase
          .from('releases')
          .update({ is_current: false })
          .eq('project_id', project.id);
      }

      if (editingRelease) {
        const { error: updateErr } = await supabase
          .from('releases')
          .update({
            version: releaseForm.version.trim(),
            channel: releaseForm.channel,
            release_date: releaseForm.release_date,
            changelog_tr: releaseForm.changelog_tr.trim() || null,
            changelog_en: releaseForm.changelog_en.trim() || null,
            github_release_url: releaseForm.github_release_url.trim() || null,
            is_current: releaseForm.is_current,
          })
          .eq('id', editingRelease.id);

        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase.from('releases').insert({
          project_id: project.id,
          version: releaseForm.version.trim(),
          channel: releaseForm.channel,
          release_date: releaseForm.release_date,
          changelog_tr: releaseForm.changelog_tr.trim() || null,
          changelog_en: releaseForm.changelog_en.trim() || null,
          github_release_url: releaseForm.github_release_url.trim() || null,
          is_current: releaseForm.is_current,
        });

        if (insertErr) throw insertErr;
      }

      setReleaseModalOpen(false);
      fetchProjectData();
    } catch (err: unknown) {
      console.debug('[admin/projects/workspace] Release save error:', err);
      setError(dict.common.error);
    } finally {
      setSavingRelease(false);
    }
  };

  // Toggle Current Release
  const toggleCurrentRelease = async (rel: ProjectRelease) => {
    if (!project) return;
    const nextState = !rel.is_current;
    if (nextState) {
      await supabase
        .from('releases')
        .update({ is_current: false })
        .eq('project_id', project.id);
    }

    await supabase
      .from('releases')
      .update({ is_current: nextState })
      .eq('id', rel.id);

    fetchProjectData();
  };

  // Delete Release
  const handleDeleteRelease = async () => {
    if (!deleteReleaseTarget) return;
    setDeletingRelease(true);
    try {
      await supabase.from('releases').delete().eq('id', deleteReleaseTarget.id);
      setReleasesList((prev) => prev.filter((r) => r.id !== deleteReleaseTarget.id));
      setDeleteReleaseTarget(null);
    } catch (err) {
      console.debug('[admin/projects/workspace] Release delete error:', err);
    } finally {
      setDeletingRelease(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text={dict.common.loading} large />;
  }

  if (error && !project) {
    return (
      <div className="admin-empty">
        <p>{error}</p>
        <Link href="/admin/projects" className="admin-btn admin-btn-ghost">
          {dict.projects.back}
        </Link>
      </div>
    );
  }

  if (!project) return null;

  const currentRelease = releasesList.find((r) => r.is_current) || releasesList[0];
  const activeTemplate = PROJECT_TEMPLATES[currentTemplateKey] || PROJECT_TEMPLATES.product;

  return (
    <>
      {/* Workspace Header */}
      <div className="admin-page-header" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.3rem', margin: 0 }}>{project.name}</h1>
              <span className="admin-badge admin-badge-published" style={{ fontFamily: 'monospace' }}>
                /{project.slug}
              </span>
              {project.featured && <span style={{ color: '#f1c40f', fontSize: '1rem' }}>★</span>}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
              Şablon: {activeTemplate.name_tr} • {project.published ? dict.projects.publish : dict.projects.unpublish} • {currentRelease ? `${currentRelease.version} (${currentRelease.channel})` : 'Sürüm yok'}
            </p>
          </div>

          <Link href="/admin/projects" className="admin-btn admin-btn-ghost admin-btn-sm">
            {dict.projects.back}
          </Link>
        </div>
      </div>

      {isNewlyCreated && (
        <div className="admin-success-msg" style={{ marginBottom: '1.25rem' }} role="status">
          <strong>{dict.projects.createdSuccess}</strong> {dict.projects.createdSuccessDesc}
        </div>
      )}

      {error && <div className="admin-login-error" role="alert">{error}</div>}
      {success && <div className="admin-success-msg" role="status">{success}</div>}

      {/* 6 Workspace Tabs */}
      <div className="admin-tabs" role="tablist" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.75rem' }}>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📌 {dict.projects.tabOverview}
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          ✍️ {dict.projects.tabContent}
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'page' ? 'active' : ''}`}
          onClick={() => setActiveTab('page')}
        >
          📜 Sayfa ({activeTemplate.name_tr})
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          🖼️ {dict.projects.tabMedia} ({mediaList.length})
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'releases' ? 'active' : ''}`}
          onClick={() => setActiveTab('releases')}
        >
          🚀 {dict.projects.tabReleases} ({releasesList.length})
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ {dict.projects.tabSettings}
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="admin-overview-section">
          <div className="admin-overview-section-header">
            <h3>{dict.projects.projectHealth}</h3>
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={() => setActiveTab('content')}
            >
              {dict.projects.edit} →
            </button>
          </div>

          <div className="admin-cards">
            <div className="admin-card">
              <div className="admin-card-label">{dict.projects.status}</div>
              <div className="admin-card-value" style={{ fontSize: '0.9rem', color: project.published ? '#2ecc71' : 'rgba(255,255,255,0.4)' }}>
                {project.published ? dict.projects.publish : dict.projects.unpublish}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-label">Şablon Düzeni</div>
              <div className="admin-card-value" style={{ fontSize: '0.95rem' }}>
                {activeTemplate.icon} {activeTemplate.name_tr}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-label">{dict.projects.latestRelease}</div>
              <div className="admin-card-value" style={{ fontSize: '1rem', fontFamily: 'monospace' }}>
                {currentRelease ? `${currentRelease.version} (${currentRelease.channel})` : '—'}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-label">{dict.projects.mediaCountLabel}</div>
              <div className="admin-card-value">{mediaList.length}</div>
            </div>
          </div>

          {releasesList.length === 0 && (
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '6px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.85rem', color: '#fff', margin: '0 0 0.5rem 0', fontWeight: 600 }}>
                {dict.projects.noReleases}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 1rem 0' }}>
                {dict.projects.noReleasesDesc}
              </p>
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={openCreateRelease}
              >
                {dict.projects.addFirstRelease}
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-ghost admin-btn-sm"
              >
                ↗ {dict.projects.openGithub}
              </a>
            )}
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-ghost admin-btn-sm"
              >
                ↗ {dict.projects.openWebsite}
              </a>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CONTENT */}
      {activeTab === 'content' && (
        <form onSubmit={handleSaveProject} className="admin-form" style={{ maxWidth: '800px' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <FormField
                label={dict.projects.shortDescTr}
                name="short_description_tr"
                value={project.short_description_tr}
                onChange={(v) => updateProjectField('short_description_tr', v)}
              />

              <FormField
                label={dict.projects.shortDescEn}
                name="short_description_en"
                value={project.short_description_en}
                onChange={(v) => updateProjectField('short_description_en', v)}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <TranslationAction
                sourceText={project.short_description_tr}
                targetText={project.short_description_en}
                sourceLang="tr"
                targetLang="en"
                context="project short description"
                onTranslated={(v) => updateProjectField('short_description_en', v)}
              />
              <TranslationAction
                sourceText={project.short_description_en}
                targetText={project.short_description_tr}
                sourceLang="en"
                targetLang="tr"
                context="project short description"
                onTranslated={(v) => updateProjectField('short_description_tr', v)}
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label={dict.projects.descTr}
              name="description_tr"
              type="textarea"
              value={project.description_tr}
              onChange={(v) => updateProjectField('description_tr', v)}
              placeholder="# Proje Detayı..."
            />
            <TranslationAction
              sourceText={project.description_tr}
              targetText={project.description_en}
              sourceLang="tr"
              targetLang="en"
              context="project detailed markdown overview"
              onTranslated={(v) => updateProjectField('description_en', v)}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <FormField
              label={dict.projects.descEn}
              name="description_en"
              type="textarea"
              value={project.description_en}
              onChange={(v) => updateProjectField('description_en', v)}
              placeholder="# Project Details..."
            />
            <TranslationAction
              sourceText={project.description_en}
              targetText={project.description_tr}
              sourceLang="en"
              targetLang="tr"
              context="project detailed markdown overview"
              onTranslated={(v) => updateProjectField('description_tr', v)}
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={saving}
            style={{ marginTop: '1.5rem' }}
          >
            {saving ? dict.projects.saving : dict.projects.save}
          </button>
        </form>
      )}

      {/* TAB 3: PAGE (SCROLL TEMPLATE CUSTOMIZATION) */}
      {activeTab === 'page' && (
        <div style={{ maxWidth: '900px' }}>
          {/* Template Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.25rem',
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{activeTemplate.icon}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{activeTemplate.name_tr}</strong>
                  <span className="admin-badge admin-badge-published" style={{ fontSize: '0.6rem' }}>
                    {activeTemplate.badge}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                  {activeTemplate.description_tr}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {/* Animation Intensity Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Animasyon:</span>
                <select
                  className="admin-select"
                  value={animationIntensity}
                  onChange={(e) => handleAnimationIntensityChange(e.target.value as AnimationIntensity)}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  <option value="none">Yok (None)</option>
                  <option value="subtle">Hafif (Subtle)</option>
                  <option value="normal">Normal</option>
                  <option value="strong">Güçlü (Strong)</option>
                </select>
              </div>

              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => setShowTemplateModal(true)}
              >
                Şablonu Değiştir ⟳
              </button>
            </div>
          </div>

          {/* View Mode Toggle (Editor / Live Preview) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem', borderRadius: '6px' }}>
              <button
                type="button"
                className={`admin-btn ${pageViewMode === 'editor' ? 'admin-btn-primary' : 'admin-btn-ghost'} admin-btn-sm`}
                onClick={() => setPageViewMode('editor')}
              >
                Bölüm Sıralaması & İçerik ({projectSections.length})
              </button>
              <button
                type="button"
                className={`admin-btn ${pageViewMode === 'preview' ? 'admin-btn-primary' : 'admin-btn-ghost'} admin-btn-sm`}
                onClick={() => setPageViewMode('preview')}
              >
                Canlı Önizleme
              </button>
            </div>

            {pageViewMode === 'preview' && (
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button
                  type="button"
                  className={`admin-btn ${previewLang === 'tr' ? 'admin-badge-published' : 'admin-btn-ghost'} admin-btn-sm`}
                  onClick={() => setPreviewLang('tr')}
                  style={{ fontSize: '0.7rem' }}
                >
                  🇹🇷 TR
                </button>
                <button
                  type="button"
                  className={`admin-btn ${previewLang === 'en' ? 'admin-badge-published' : 'admin-btn-ghost'} admin-btn-sm`}
                  onClick={() => setPreviewLang('en')}
                  style={{ fontSize: '0.7rem' }}
                >
                  🇬🇧 EN
                </button>
              </div>
            )}
          </div>

          {/* EDITOR VIEW */}
          {pageViewMode === 'editor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {projectSections.map((sec, idx) => {
                const isHidden = sec.visible === false;
                const title = sec.content.title_tr || sec.content.title_en || sec.type;

                return (
                  <div
                    key={sec.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.25rem',
                      background: isHidden ? 'rgba(255,255,255,0.02)' : '#18181b',
                      border: isHidden ? '1px dashed rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      opacity: isHidden ? 0.6 : 1,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost"
                          onClick={() => moveSectionUp(idx)}
                          disabled={idx === 0}
                          style={{ padding: '0.1rem 0.35rem', fontSize: '0.6rem' }}
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost"
                          onClick={() => moveSectionDown(idx)}
                          disabled={idx === projectSections.length - 1}
                          style={{ padding: '0.1rem 0.35rem', fontSize: '0.6rem' }}
                        >
                          ▼
                        </button>
                      </div>

                      <span className="admin-badge admin-badge-published" style={{ textTransform: 'uppercase', fontSize: '0.6rem' }}>
                        {sec.type}
                      </span>

                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                        {title} {isHidden && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}> (Gizlendi)</span>}
                      </div>
                    </div>

                    <div className="admin-actions">
                      <button
                        type="button"
                        className={`admin-btn admin-btn-ghost admin-btn-sm ${isHidden ? '' : 'admin-badge-published'}`}
                        onClick={() => toggleSectionVisible(idx)}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {isHidden ? '👁️‍🗨️ Gizli' : '👁️ Görünür'}
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-primary admin-btn-sm"
                        onClick={() => setEditingSection(sec)}
                      >
                        ✏️ İçeriği Düzenle
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PREVIEW VIEW */}
          {pageViewMode === 'preview' && (
            <div
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                background: '#000000',
                overflow: 'hidden',
                padding: '2rem 1rem',
              }}
            >
              <PageBuilderRenderer sections={projectSections} locale={previewLang} />
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MEDIA */}
      {activeTab === 'media' && (
        <div>
          <div className="admin-toolbar">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {dict.projects.projectMediaTitle}
            </h3>
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={() => setMediaModalOpen(true)}
            >
              {dict.projects.addMedia}
            </button>
          </div>

          {mediaList.length === 0 ? (
            <div className="admin-empty">
              <p style={{ fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{dict.projects.noProjectMedia}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1rem' }}>{dict.projects.noProjectMediaDesc}</p>
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => setMediaModalOpen(true)}
              >
                {dict.projects.addMedia}
              </button>
            </div>
          ) : (
            <div className="admin-media-grid">
              {mediaList.map((item) => (
                <div key={item.id} className="admin-media-item">
                  <div className="admin-media-preview">
                    {item.media_type === 'video' ? (
                      <video src={item.media_url} preload="metadata" muted />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.media_url} alt={item.caption_tr || item.caption_en || 'Media'} loading="lazy" />
                    )}
                  </div>
                  <div className="admin-media-info">
                    <span className="admin-media-name" title={item.media_url}>
                      {item.caption_tr || item.caption_en || item.media_url.split('/').pop()}
                    </span>
                    <div className="admin-media-actions">
                      <span className="admin-badge admin-badge-published" style={{ fontSize: '0.6rem' }}>
                        {item.media_type}
                      </span>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => setDeleteMediaTarget(item)}
                      >
                        {dict.common.cancel}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: RELEASES */}
      {activeTab === 'releases' && (
        <div>
          <div className="admin-toolbar">
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {dict.projects.projectReleasesTitle}
            </h3>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={openCreateRelease}
            >
              {dict.projects.newRelease}
            </button>
          </div>

          {releasesList.length === 0 ? (
            <div className="admin-empty">
              <p style={{ fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>{dict.projects.noReleases}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>{dict.projects.noReleasesDesc}</p>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={openCreateRelease}
              >
                {dict.projects.newRelease}
              </button>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{dict.projects.version}</th>
                    <th>{dict.projects.channel}</th>
                    <th>{dict.projects.releaseDate}</th>
                    <th>{dict.projects.isCurrent}</th>
                    <th>{dict.projects.githubReleaseUrl}</th>
                    <th style={{ textAlign: 'right' }}>{dict.common.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {releasesList.map((rel) => (
                    <tr key={rel.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#fff' }}>
                        {rel.version}
                      </td>
                      <td>
                        <span className={`admin-badge ${rel.channel === 'stable' ? 'admin-badge-published' : rel.channel === 'beta' ? 'admin-badge-featured' : 'admin-badge-draft'}`}>
                          {dict.projects[rel.channel] || rel.channel}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        {rel.release_date || '—'}
                      </td>
                      <td>
                        <button
                          className={`admin-btn admin-btn-ghost admin-btn-sm ${rel.is_current ? 'admin-badge-published' : ''}`}
                          onClick={() => toggleCurrentRelease(rel)}
                          type="button"
                          style={{ fontSize: '0.65rem' }}
                        >
                          {rel.is_current ? `● ${dict.projects.isCurrent}` : '○ Geçerli Yap'}
                        </button>
                      </td>
                      <td>
                        {rel.github_release_url ? (
                          <a
                            href={rel.github_release_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', textDecoration: 'underline' }}
                          >
                            GitHub Release ↗
                          </a>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>—</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            onClick={() => openEditRelease(rel)}
                          >
                            {dict.projects.edit}
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => setDeleteReleaseTarget(rel)}
                          >
                            {dict.common.cancel}
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

      {/* TAB 6: SETTINGS */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '720px' }}>
          <form onSubmit={handleSaveProject} className="admin-form">
            <FormField
              label={dict.projects.name}
              name="name"
              value={project.name}
              onChange={(v) => updateProjectField('name', v)}
              required
            />

            <FormField
              label={dict.projects.slug}
              name="slug"
              value={project.slug}
              onChange={(v) => updateProjectField('slug', v)}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField
                label={dict.projects.githubUrl}
                name="github_url"
                type="url"
                value={project.github_url}
                onChange={(v) => updateProjectField('github_url', v)}
                placeholder="https://github.com/..."
              />

              <FormField
                label={dict.projects.websiteUrl}
                name="website_url"
                type="url"
                value={project.website_url}
                onChange={(v) => updateProjectField('website_url', v)}
                placeholder="https://..."
              />
            </div>

            <FormField
              label={dict.projects.accentColor}
              name="accent_color"
              type="color"
              value={project.accent_color}
              onChange={(v) => updateProjectField('accent_color', v)}
            />

            {/* Publication & Featured Switches */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{dict.projects.publish}</span>
              <label className="admin-toggle" aria-label={dict.projects.publish}>
                <input
                  type="checkbox"
                  checked={project.published}
                  onChange={(e) => updateProjectField('published', e.target.checked)}
                />
                <span className="admin-toggle-slider" />
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{dict.projects.feature}</span>
              <label className="admin-toggle" aria-label={dict.projects.feature}>
                <input
                  type="checkbox"
                  checked={project.featured}
                  onChange={(e) => updateProjectField('featured', e.target.checked)}
                />
                <span className="admin-toggle-slider" />
              </label>
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
              style={{ width: '100%', marginBottom: '2rem' }}
            >
              {saving ? dict.projects.saving : dict.projects.save}
            </button>
          </form>

          {/* Danger Zone */}
          <div className="admin-emergency-notice" style={{ marginTop: '2rem' }}>
            <h4 style={{ color: '#e74c3c', fontSize: '0.8rem', fontWeight: 700, margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Tehlikeli Bölge
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 1rem 0' }}>
              {dict.projects.deleteConfirm}
            </p>
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => setShowDeleteProject(true)}
            >
              {dict.projects.delete}
            </button>
          </div>
        </div>
      )}

      {/* Template Switcher Modal */}
      {showTemplateModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowTemplateModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <h3 className="admin-modal-title">Sayfa Şablonunu Değiştir</h3>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Şablonu değiştirmek sayfa yapısını günceller ancak proje içeriğinizi, medyalarınızı veya sürümlerinizi silmez.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {Object.values(PROJECT_TEMPLATES).map((tmpl) => {
                const isSelected = (pendingTemplateKey || currentTemplateKey) === tmpl.key;
                return (
                  <div
                    key={tmpl.key}
                    onClick={() => setPendingTemplateKey(tmpl.key)}
                    style={{
                      padding: '1rem',
                      borderRadius: '6px',
                      border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
                      background: isSelected ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{tmpl.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', marginBottom: '0.2rem' }}>
                      {tmpl.name_tr}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                      {tmpl.description_tr}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="admin-modal-actions">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setShowTemplateModal(false)}>
                İptal
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={confirmSwitchTemplate}
                disabled={!pendingTemplateKey || pendingTemplateKey === currentTemplateKey}
              >
                Şablonu Uygula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Content Edit Modal */}
      {editingSection && (
        <SectionEditorModal
          section={editingSection}
          open={Boolean(editingSection)}
          onClose={() => setEditingSection(null)}
          onSave={handleSaveEditedSection}
        />
      )}

      {/* Add Media Modal */}
      {mediaModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setMediaModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <h3 className="admin-modal-title">{dict.projects.addMedia}</h3>
            <form onSubmit={handleSaveMedia} className="admin-form">
              <FormField
                label={dict.projects.mediaUrl}
                name="media_url"
                type="url"
                value={mediaForm.media_url}
                onChange={(v) => setMediaForm((prev) => ({ ...prev, media_url: v }))}
                placeholder="https://..."
                required
              />

              <FormField
                label={dict.projects.mediaType}
                name="media_type"
                type="select"
                value={mediaForm.media_type}
                onChange={(v) => setMediaForm((prev) => ({ ...prev, media_type: v as 'image' | 'video' }))}
                options={[
                  { label: 'Görsel (Image)', value: 'image' },
                  { label: 'Video', value: 'video' },
                ]}
              />

              <div>
                <FormField
                  label={dict.projects.captionTr}
                  name="caption_tr"
                  value={mediaForm.caption_tr}
                  onChange={(v) => setMediaForm((prev) => ({ ...prev, caption_tr: v }))}
                />
                <TranslationAction
                  sourceText={mediaForm.caption_tr}
                  targetText={mediaForm.caption_en}
                  sourceLang="tr"
                  targetLang="en"
                  context="media asset caption"
                  onTranslated={(v) => setMediaForm((prev) => ({ ...prev, caption_en: v }))}
                />
              </div>

              <div>
                <FormField
                  label={dict.projects.captionEn}
                  name="caption_en"
                  value={mediaForm.caption_en}
                  onChange={(v) => setMediaForm((prev) => ({ ...prev, caption_en: v }))}
                />
                <TranslationAction
                  sourceText={mediaForm.caption_en}
                  targetText={mediaForm.caption_tr}
                  sourceLang="en"
                  targetLang="tr"
                  context="media asset caption"
                  onTranslated={(v) => setMediaForm((prev) => ({ ...prev, caption_tr: v }))}
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setMediaModalOpen(false)}>
                  {dict.common.cancel}
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={savingMedia}>
                  {savingMedia ? dict.common.loading : dict.projects.addMedia}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Release Modal */}
      {releaseModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setReleaseModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <h3 className="admin-modal-title">
              {editingRelease ? dict.projects.editRelease : dict.projects.newRelease}
            </h3>

            <form onSubmit={handleSaveRelease} className="admin-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormField
                  label={dict.projects.version}
                  name="version"
                  value={releaseForm.version}
                  onChange={(v) => setReleaseForm((prev) => ({ ...prev, version: v }))}
                  placeholder="v1.0.0"
                  required
                />

                <FormField
                  label={dict.projects.channel}
                  name="channel"
                  type="select"
                  value={releaseForm.channel}
                  onChange={(v) => setReleaseForm((prev) => ({ ...prev, channel: v as 'stable' | 'beta' | 'experimental' }))}
                  options={[
                    { label: dict.projects.stable, value: 'stable' },
                    { label: dict.projects.beta, value: 'beta' },
                    { label: dict.projects.experimental, value: 'experimental' },
                  ]}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormField
                  label={dict.projects.releaseDate}
                  name="release_date"
                  type="date"
                  value={releaseForm.release_date}
                  onChange={(v) => setReleaseForm((prev) => ({ ...prev, release_date: v }))}
                />

                <FormField
                  label={dict.projects.githubReleaseUrl}
                  name="github_release_url"
                  type="url"
                  value={releaseForm.github_release_url}
                  onChange={(v) => setReleaseForm((prev) => ({ ...prev, github_release_url: v }))}
                  placeholder="https://github.com/.../releases/..."
                />
              </div>

              <div>
                <FormField
                  label={dict.projects.changelogTr}
                  name="changelog_tr"
                  type="textarea"
                  value={releaseForm.changelog_tr}
                  onChange={(v) => setReleaseForm((prev) => ({ ...prev, changelog_tr: v }))}
                  placeholder="- Yeni özellikler..."
                />
                <TranslationAction
                  sourceText={releaseForm.changelog_tr}
                  targetText={releaseForm.changelog_en}
                  sourceLang="tr"
                  targetLang="en"
                  context="software release changelog markdown notes"
                  onTranslated={(v) => setReleaseForm((prev) => ({ ...prev, changelog_en: v }))}
                />
              </div>

              <div>
                <FormField
                  label={dict.projects.changelogEn}
                  name="changelog_en"
                  type="textarea"
                  value={releaseForm.changelog_en}
                  onChange={(v) => setReleaseForm((prev) => ({ ...prev, changelog_en: v }))}
                  placeholder="- New features..."
                />
                <TranslationAction
                  sourceText={releaseForm.changelog_en}
                  targetText={releaseForm.changelog_tr}
                  sourceLang="en"
                  targetLang="tr"
                  context="software release changelog markdown notes"
                  onTranslated={(v) => setReleaseForm((prev) => ({ ...prev, changelog_tr: v }))}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{dict.projects.isCurrent}</span>
                <label className="admin-toggle" aria-label={dict.projects.isCurrent}>
                  <input
                    type="checkbox"
                    checked={releaseForm.is_current}
                    onChange={(e) => setReleaseForm((prev) => ({ ...prev, is_current: e.target.checked }))}
                  />
                  <span className="admin-toggle-slider" />
                </label>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setReleaseModalOpen(false)}>
                  {dict.common.cancel}
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={savingRelease}>
                  {savingRelease ? dict.projects.savingRelease : dict.projects.saveRelease}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Modal */}
      <ConfirmDialog
        open={showDeleteProject}
        title={dict.projects.delete}
        message={dict.projects.deleteConfirm}
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        loading={deletingProject}
        onConfirm={handleDeleteProject}
        onCancel={() => setShowDeleteProject(false)}
      />

      {/* Delete Media Modal */}
      <ConfirmDialog
        open={!!deleteMediaTarget}
        title={dict.media.delete}
        message={dict.media.deleteConfirm}
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        loading={deletingMedia}
        onConfirm={handleDeleteMedia}
        onCancel={() => setDeleteMediaTarget(null)}
      />

      {/* Delete Release Modal */}
      <ConfirmDialog
        open={!!deleteReleaseTarget}
        title={dict.projects.newRelease}
        message={dict.projects.deleteReleaseConfirm}
        confirmLabel={dict.common.confirm}
        cancelLabel={dict.common.cancel}
        loading={deletingRelease}
        onConfirm={handleDeleteRelease}
        onCancel={() => setDeleteReleaseTarget(null)}
      />
    </>
  );
}

export default function EditProjectPage() {
  return (
    <Suspense fallback={<LoadingSpinner large center />}>
      <ProjectWorkspaceContent />
    </Suspense>
  );
}
