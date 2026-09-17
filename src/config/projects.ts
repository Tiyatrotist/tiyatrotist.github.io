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
    id: 'proj-typeflow-01',
    slug: 'typeflow',
    name: 'TypeFlow',
    published: true,
    featured: true,
    short_description_tr: 'Yeni nesil daktilo yazım akademisi, Duolingo benzeri ligler, mekanik klavye ses motoru ve SaaS üyelik ekosistemi.',
    short_description_en: 'Next-gen speed typing academy featuring Duolingo-style leagues, Web Audio mechanical synth, and SaaS monetization.',
    description_tr: 'TypeFlow; 60 FPS hızında çalışan Web Audio mekanik klavye sentezleyicisi, 5 siberpunk tema, 3 özel yazım modu (Kelimeler, Edebi Tiradlar, CLI Kodları), 10 lig basamağı, odak enerjisi ve Super TypeFlow abonelik altyapısıyla geliştirilmiş bağımsız bir yazım laboratuvarıdır.',
    description_en: 'TypeFlow is an independent speed typing laboratory and SaaS platform engineered with zero-latency Web Audio mechanical synthesis, 5 cyberpunk themes, 3 typing modes (Common Words, Literary Monologues, CLI Commands), 10 competitive leagues, focus energy, and Super TypeFlow billing.',
    github_url: 'https://github.com/Tiyatrotist/tiyatrotist.github.io',
    website_url: '/typeflow',
    accent_color: '#3b82f6',
    latestRelease: 'v2.4.0 (stable)',
    releaseChannel: 'stable',
    year: '2026',
    tags: ['SAAS', 'TYPING ACADEMY', 'NEXTJS', 'AUDIO SYNTH'],
    created_at: '2026-09-01T10:00:00.000Z',
    updated_at: '2026-09-14T20:00:00.000Z',
  },
  {
    id: '37326bbb-cc08-4c0c-a262-c8d038014f90',
    slug: 'bookos',
    name: 'BookOS',
    published: true,
    featured: false,
    short_description_tr: 'Edebiyat, derin odaklanma ve dokunsal bilgi sentezi için bağımsız masaüstü çalışma alanı işletim sistemi mimarisi.',
    short_description_en: 'Independent desktop operating system environment engineered for deep focus, literature, and tactile knowledge synthesis.',
    description_tr: 'BookOS; işletim sistemi mimarilerini edebiyat ve kişisel bilgi yönetimi ile buluşturan, dikkat dağıtmayan monolitik arayüz ve çift yönlü bağlantı motoruna sahip bağımsız bir masaüstü çalışma alanıdır.',
    description_en: 'BookOS is an independent desktop workspace blending operating system architectures with literature and personal knowledge management, featuring a distraction-free monolithic surface and bidirectional linking.',
    github_url: 'https://github.com/Tiyatrotist/tiyatrotist.github.io',
    website_url: '/bookos',
    accent_color: '#FF6A00',
    latestRelease: 'v1.2.0 (stable)',
    releaseChannel: 'stable',
    year: '2026',
    tags: ['DESKTOP OS', 'FOCUS', 'MARKDOWN', 'RUST'],
    created_at: '2026-08-28T18:27:01.897Z',
    updated_at: '2026-08-28T18:27:01.897Z',
  },
  {
    id: 'proj-sandbox-01',
    slug: 'sandbox',
    name: 'Particle Sandbox',
    published: true,
    featured: true,
    short_description_tr: 'İnteraktif monokrom parçacık fiziği laboratuvarı, yerçekimi vektörleri, akışkanlar mekaniği ve generatif çizim tuvali.',
    short_description_en: 'Interactive monochrome particle physics laboratory, gravitational vectors, fluid dynamics, and generative canvas.',
    description_tr: 'Particle Sandbox; 60 FPS HTML5 Canvas ve 2D vektörel fizik motoru üzerinde çalışan; kum tanecikleri, viskoz sıvılar, kozmik yıldızlar ve matrix karakterlerini gerçek zamanlı yerçekimi, ters yerçekimi, sıfır-G ve kara delik (vortex) alanlarıyla simüle eden interaktif bir dijital fizik laboratuvarıdır.',
    description_en: 'Particle Sandbox is an interactive digital physics laboratory running at 60 FPS on HTML5 Canvas, simulating sand grains, viscous fluids, cosmic stars, and matrix glyphs under customizable gravitational vectors, zero-G, and vortex black-hole force fields.',
    github_url: 'https://github.com/Tiyatrotist/tiyatrotist.github.io',
    website_url: '/sandbox',
    accent_color: '#ffffff',
    latestRelease: 'v1.0.0 (stable)',
    releaseChannel: 'stable',
    year: '2026',
    tags: ['PHYSICS SIMULATION', 'CANVAS', 'INTERACTIVE', 'MONOCHROME'],
    created_at: '2026-09-17T12:00:00.000Z',
    updated_at: '2026-09-17T12:00:00.000Z',
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
