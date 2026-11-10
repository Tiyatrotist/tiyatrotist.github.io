/**
 * TIYATROTIST — Centralized Projects System Configuration
 *
 * Single Source of Truth for projects built across Antigravity.
 * Synchronizes code-level project data with public routes and admin management interfaces.
 */

export interface SystemProject {
  id: string;
  slug: string;
  name: string;
  published: boolean;
  featured: boolean;
  short_description_tr: string;
  short_description_en: string;
  description_tr: string;
  description_en: string;
  github_url: string;
  website_url: string;
  accent_color: string;
  latestRelease: string;
  releaseChannel: 'stable' | 'beta' | 'experimental';
  year: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const SYSTEM_PROJECTS: SystemProject[] = [
  {
    id: 'proj-edith-01',
    slug: 'edith',
    name: 'E.D.I.T.H',
    published: true,
    featured: true,
    short_description_tr: 'Kişisel, açık kaynaklı ve otonom yapay zekâ asistanı & agent platformu.',
    short_description_en: 'Personal, open-source autonomous AI assistant & agent framework.',
    description_tr: 'E.D.I.T.H; yerel model desteği, otonom görev yürütme, sistem araçları entegrasyonu ve çok yönlü iş akışları sağlayan kişisel yapay zekâ ajanıdır.',
    description_en: 'E.D.I.T.H is an open-source personal AI agent framework designed for autonomous tool execution, local LLMs, and multi-modal workflows.',
    github_url: 'https://github.com/Tiyatrotist/E.D.I.T.H',
    website_url: '/projects/edith',
    accent_color: '#3b82f6',
    latestRelease: 'v1.0.0',
    releaseChannel: 'stable',
    year: '2026',
    tags: ['AI AGENT', 'PYTHON', 'AUTOMATION', 'OPEN SOURCE'],
    created_at: '2026-10-07T16:15:00.000Z',
    updated_at: '2026-11-09T17:00:00.000Z',
  },
  {
    id: 'proj-etapkitap-01',
    slug: 'etapkitap',
    name: 'EtapKitap',
    published: true,
    featured: true,
    short_description_tr: 'Pardus ETAP 23 ve akıllı tahtalar için etkileşimli dijital ders kitabı motoru ve çalışma ortamı (C++20 & Qt 6).',
    short_description_en: 'Interactive digital textbook engine and environment for Pardus ETAP 23 smart boards (C++20 & Qt 6).',
    description_tr: 'EtapKitap; C++20 ve Qt 6 ile geliştirilen, dokunmatik ekran optimizasyonlu, düşük gecikmeli etkileşimli içerik ve ders kitabı sunum motorudur.',
    description_en: 'EtapKitap is a native interactive textbook platform engineered with C++20 and Qt 6 for touch-first smart classroom boards.',
    github_url: 'https://github.com/Tiyatrotist/EtapKitap',
    website_url: '/projects/etapkitap',
    accent_color: '#10b981',
    latestRelease: 'v1.0.0',
    releaseChannel: 'stable',
    year: '2026',
    tags: ['C++20', 'QT6', 'PARDUS', 'EDUCATION'],
    created_at: '2026-11-07T20:14:00.000Z',
    updated_at: '2026-11-09T17:00:00.000Z',
  },
  {
    id: 'proj-openpet-01',
    slug: 'openpet',
    name: 'OpenPet',
    published: true,
    featured: true,
    short_description_tr: 'Windows 11 için yerel, modüler ve hafif masaüstü yol arkadaşı & pet platformu.',
    short_description_en: 'Local-first, extensible desktop companion and virtual pet platform for Windows 11.',
    description_tr: 'OpenPet; sistem kaynaklarını minimumda tutarak masaüstünüzde yaşayan, modüler animasyon ve etkileşim yeteneklerine sahip açık kaynaklı masaüstü yol arkadaşıdır.',
    description_en: 'OpenPet is a lightweight desktop companion engineered for Windows 11 with modular animation state machines and native OS integration.',
    github_url: 'https://github.com/Tiyatrotist/OpenPet',
    website_url: '/projects/openpet',
    accent_color: '#f59e0b',
    latestRelease: 'v0.9.0',
    releaseChannel: 'beta',
    year: '2026',
    tags: ['DESKTOP', 'WINDOWS 11', 'ANIMATION', 'OPEN SOURCE'],
    created_at: '2026-11-01T12:00:00.000Z',
    updated_at: '2026-11-09T17:00:00.000Z',
  },
  {
    id: 'proj-explorer-terminal-01',
    slug: 'explorer-terminal',
    name: 'explorer-terminal',
    published: true,
    featured: true,
    short_description_tr: 'Windows Dosya Gezgini pencerelerine kenetlenen gerçek zamanlı terminal (Windhawk modu).',
    short_description_en: 'A real terminal docked directly inside the Windows File Explorer window (Windhawk mod).',
    description_tr: 'Windows Dosya Gezgini arayüzüne doğrudan entegre olan, bulunulan dizini otomatik algılayan ve pencerelerle senkronize çalışan Windhawk tabanlı C++ modu.',
    description_en: 'A native Windhawk mod embedding a fully functional terminal dock into Windows File Explorer with automatic working directory tracking.',
    github_url: 'https://github.com/Tiyatrotist/explorer-terminal',
    website_url: '/projects/explorer-terminal',
    accent_color: '#6366f1',
    latestRelease: 'v1.0.0',
    releaseChannel: 'stable',
    year: '2026',
    tags: ['WINDHAWK', 'C++', 'WINDOWS', 'DEVELOPER TOOLS'],
    created_at: '2026-11-06T17:08:00.000Z',
    updated_at: '2026-11-09T17:00:00.000Z',
  },
  {
    id: 'proj-bookos-01',
    slug: 'bookos',
    name: 'BookOS',
    published: true,
    featured: false,
    short_description_tr: 'Minimalist, dikkat dağıtmayan dijital okuma, not alma ve kişisel çalışma alanı konsepti.',
    short_description_en: 'Minimalist, distraction-free digital reading, note-taking, and workspace environment.',
    description_tr: 'BookOS; okuma deneyimini ve odaklanmayı merkeze alan, temiz tipografi ve odaklanma alanı sunan çalışma alanı tasarımıdır.',
    description_en: 'BookOS is a distraction-free workspace concept focused on deep reading, markdown notes, and typographic clarity.',
    github_url: 'https://github.com/Tiyatrotist/BookOS',
    website_url: '/bookos',
    accent_color: '#FF6A00',
    latestRelease: 'v1.0.0',
    releaseChannel: 'stable',
    year: '2026',
    tags: ['WORKSPACE', 'NOTES', 'MINIMALISM'],
    created_at: '2026-08-28T18:27:01.897Z',
    updated_at: '2026-11-09T17:00:00.000Z',
  },
];

/**
 * Returns merged project list: System built-in projects combined with localStorage/Supabase overrides
 */
export function getUnifiedProjects(): SystemProject[] {
  if (typeof window === 'undefined') {
    return SYSTEM_PROJECTS;
  }

  try {
    const customProjectsJson = localStorage.getItem('tf_admin_custom_projects');
    const customProjects: SystemProject[] = customProjectsJson ? JSON.parse(customProjectsJson) : [];

    // Merge system projects with user edits
    const merged = SYSTEM_PROJECTS.map((sp) => {
      const override = customProjects.find((cp) => cp.slug === sp.slug || cp.id === sp.id);
      return override ? { ...sp, ...override } : sp;
    });

    // Add any completely new projects added via Admin
    customProjects.forEach((cp) => {
      if (!merged.some((m) => m.slug === cp.slug || m.id === cp.id)) {
        merged.push(cp);
      }
    });

    return merged;
  } catch (err) {
    console.debug('[config/projects] Error merging unified projects:', err);
    return SYSTEM_PROJECTS;
  }
}

/**
 * Save project edit locally to guarantee persistence across admin pages
 */
export function saveProjectLocalOverride(project: Partial<SystemProject> & { slug: string }): void {
  if (typeof window === 'undefined') return;

  try {
    const customProjectsJson = localStorage.getItem('tf_admin_custom_projects');
    const customProjects: SystemProject[] = customProjectsJson ? JSON.parse(customProjectsJson) : [];
    const index = customProjects.findIndex((p) => p.slug === project.slug);

    if (index >= 0) {
      customProjects[index] = { ...customProjects[index], ...project } as SystemProject;
    } else {
      const base = SYSTEM_PROJECTS.find((p) => p.slug === project.slug) || {
        id: `custom-${Date.now()}`,
        slug: project.slug,
        name: project.name || project.slug,
        published: true,
        featured: false,
        short_description_tr: '',
        short_description_en: '',
        description_tr: '',
        description_en: '',
        github_url: '',
        website_url: `/${project.slug}`,
        accent_color: '#ffffff',
        latestRelease: 'v1.0.0',
        releaseChannel: 'stable',
        year: new Date().getFullYear().toString(),
        tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      customProjects.push({ ...base, ...project } as SystemProject);
    }

    localStorage.setItem('tf_admin_custom_projects', JSON.stringify(customProjects));
    console.debug('[config/projects] Project override saved locally for:', project.slug);
  } catch (err) {
    console.debug('[config/projects] Failed to save project override:', err);
  }
}
