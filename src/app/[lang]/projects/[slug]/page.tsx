/**
 * TIYATROTIST — Public Project Detail Route (/[lang]/projects/[slug])
 *
 * Renders dedicated project showcases for active repositories:
 * - E.D.I.T.H
 * - EtapKitap
 * - OpenPet
 * - explorer-terminal
 * - BookOS
 * Fallback to database dynamic projects or 404.
 */

import type { Metadata } from 'next';
import { Locale, getDictionary } from '@/dictionaries';
import { supabase } from '@/lib/supabase';
import { PROJECT_TEMPLATES } from '@/lib/builder/templates';
import { ProjectTemplateKey, SectionBlock } from '@/types/builder';
import { SYSTEM_PROJECTS, SystemProject } from '@/config/projects';
import BookOSMicrosite from '@/components/bookos/BookOSMicrosite';
import EdithMicrosite from '@/components/edith/EdithMicrosite';
import EtapKitapMicrosite from '@/components/etapkitap/EtapKitapMicrosite';
import ExplorerTerminalMicrosite from '@/components/explorer-terminal/ExplorerTerminalMicrosite';
import OpenPetMicrosite from '@/components/openpet/OpenPetMicrosite';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBuilderRenderer from '@/components/builder/PageBuilderRenderer';
import Link from 'next/link';

interface ProjectDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const isTr = currentLang === 'tr';

  const systemProj = SYSTEM_PROJECTS.find((p) => p.slug === slug);
  if (systemProj) {
    const title = `${systemProj.name} — ${isTr ? systemProj.short_description_tr : systemProj.short_description_en}`;
    const description = isTr ? systemProj.description_tr : systemProj.description_en;

    return {
      title,
      description,
      alternates: {
        canonical: `/${currentLang}/projects/${slug}`,
        languages: {
          tr: `/tr/projects/${slug}`,
          en: `/en/projects/${slug}`,
        },
      },
      openGraph: {
        title: `${systemProj.name} | TIYATROTIST`,
        description,
        url: `https://tiyatrotist.com.tr/${currentLang}/projects/${slug}`,
        type: 'website',
        images: [
          {
            url: '/icon.svg',
            width: 512,
            height: 512,
            alt: systemProj.name,
          },
        ],
      },
      twitter: {
        card: 'summary',
        title: `${systemProj.name} | TIYATROTIST`,
        description,
        creator: '@tiyatrotist',
      },
    };
  }

  // Fallback to DB
  try {
    const { data: proj } = await supabase
      .from('projects')
      .select('name, description, description_tr, description_en')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (proj) {
      const title = proj.name;
      const description = (isTr ? proj.description_tr : proj.description_en) || proj.description || '';
      return {
        title,
        description,
        alternates: {
          canonical: `/${currentLang}/projects/${slug}`,
          languages: {
            tr: `/tr/projects/${slug}`,
            en: `/en/projects/${slug}`,
          },
        },
      };
    }
  } catch {}

  return {
    title: slug.toUpperCase(),
  };
}

export async function generateStaticParams() {
  const staticParams: Array<{ lang: string; slug: string }> = [];

  // Add all system projects for both languages
  for (const p of SYSTEM_PROJECTS) {
    staticParams.push({ lang: 'tr', slug: p.slug });
    staticParams.push({ lang: 'en', slug: p.slug });
  }

  try {
    const { data: projects } = await supabase
      .from('projects')
      .select('slug')
      .eq('published', true);

    if (projects && projects.length > 0) {
      for (const p of projects) {
        if (p.slug && !SYSTEM_PROJECTS.some((sp) => sp.slug === p.slug)) {
          staticParams.push({ lang: 'tr', slug: p.slug });
          staticParams.push({ lang: 'en', slug: p.slug });
        }
      }
    }
  } catch {}

  return staticParams;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { lang, slug } = await params;
  const currentLang = (lang === 'tr' ? 'tr' : 'en') as Locale;
  const dict = getDictionary(currentLang);
  const isTr = currentLang === 'tr';

  const systemProjForSchema = SYSTEM_PROJECTS.find((p) => p.slug === slug);
  const jsonLd = systemProjForSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: systemProjForSchema.name,
        description: isTr ? systemProjForSchema.description_tr : systemProjForSchema.description_en,
        applicationCategory: 'DeveloperApplication',
        operatingSystem:
          systemProjForSchema.slug === 'etapkitap'
            ? 'Linux (Pardus ETAP 23)'
            : systemProjForSchema.slug === 'explorer-terminal'
            ? 'Windows 11'
            : systemProjForSchema.slug === 'openpet'
            ? 'Windows / Linux'
            : 'Linux / Android / Windows',
        author: {
          '@type': 'Person',
          name: 'Buğra Dere',
          alternateName: 'Tiyatrotist',
          url: 'https://tiyatrotist.com.tr',
        },
        url: `https://tiyatrotist.com.tr/${currentLang}/projects/${slug}`,
        codeRepository: systemProjForSchema.github_url,
      }
    : null;

  const renderJsonLd = jsonLd ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  ) : null;

  // 1. BookOS microsite
  if (slug === 'bookos') {
    return (
      <>
        {renderJsonLd}
        <BookOSMicrosite lang={currentLang} dict={dict} />
      </>
    );
  }

  // 2. E.D.I.T.H microsite
  if (slug === 'edith') {
    return (
      <>
        {renderJsonLd}
        <EdithMicrosite lang={currentLang} dict={dict} />
      </>
    );
  }

  // 3. EtapKitap microsite
  if (slug === 'etapkitap') {
    return (
      <>
        {renderJsonLd}
        <EtapKitapMicrosite lang={currentLang} dict={dict} />
      </>
    );
  }

  // 4. explorer-terminal microsite
  if (slug === 'explorer-terminal') {
    return (
      <>
        {renderJsonLd}
        <ExplorerTerminalMicrosite lang={currentLang} dict={dict} />
      </>
    );
  }

  // 5. OpenPet microsite
  if (slug === 'openpet') {
    return (
      <>
        {renderJsonLd}
        <OpenPetMicrosite lang={currentLang} dict={dict} />
      </>
    );
  }

  // 2. Check built-in system projects (E.D.I.T.H, EtapKitap, OpenPet, explorer-terminal)
  const systemProj = SYSTEM_PROJECTS.find((p) => p.slug === slug);
  if (systemProj) {
    const isTr = currentLang === 'tr';
    const title = systemProj.name;
    const desc = isTr ? systemProj.description_tr : systemProj.description_en;
    const shortDesc = isTr ? systemProj.short_description_tr : systemProj.short_description_en;

    return (
      <main className="main-container">
        <Header lang={currentLang} dict={dict} />
        <div className="page-container" style={{ maxWidth: '960px', paddingTop: '2rem', paddingBottom: '4rem' }}>
          {/* Navigation Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Link
              href={`/${currentLang}/projects`}
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.45)',
                textDecoration: 'none',
              }}
            >
              ← {isTr ? 'TÜM PROJELERE DÖN' : 'BACK TO ALL PROJECTS'}
            </Link>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>//</span>
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'ui-monospace, monospace',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '0.15rem 0.5rem',
                borderRadius: '3px',
                color: '#ffffff',
              }}
            >
              {systemProj.latestRelease}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'ui-monospace, monospace',
                color: 'rgba(255, 255, 255, 0.4)',
                marginLeft: 'auto',
              }}
            >
              {systemProj.year}
            </span>
          </div>

          {/* Project Header */}
          <header className="page-header" style={{ marginBottom: '2.5rem' }}>
            <h1
              className="page-title"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                lineHeight: 1.15,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}
            >
              {title}
            </h1>
            <p
              className="page-subtitle"
              style={{
                maxWidth: '720px',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.75)',
                marginBottom: '1.25rem',
              }}
            >
              {shortDesc}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {systemProj.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'ui-monospace, monospace',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '3px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'rgba(255, 255, 255, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {systemProj.github_url && (
                <a
                  href={systemProj.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-intro__enter-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span>GITHUB DEPOSU</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          </header>

          {/* Project Overview Block */}
          <div
            style={{
              padding: '2rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)',
              marginBottom: '3rem',
            }}
          >
            <h2
              style={{
                fontSize: '0.75rem',
                fontFamily: 'ui-monospace, monospace',
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.4)',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}
            >
              [ {isTr ? 'PROJE GENEL BAKIŞ' : 'PROJECT OVERVIEW'} ]
            </h2>
            <p
              style={{
                fontSize: '0.98rem',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
              }}
            >
              {desc}
            </p>
          </div>
        </div>
        <Footer lang={currentLang} dict={dict} />
      </main>
    );
  }

  // 3. Fetch project details from database
  let projectData = null;
  try {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .single();

    if (data) {
      projectData = data;
    }
  } catch {}

  if (projectData && (projectData.published !== false)) {
    const templateKey: ProjectTemplateKey = (projectData.template_id in PROJECT_TEMPLATES)
      ? (projectData.template_id as ProjectTemplateKey)
      : 'minimal';

    const defaultSections: SectionBlock[] = PROJECT_TEMPLATES[templateKey]?.sections || PROJECT_TEMPLATES.minimal.sections;

    return (
      <main className="main-container">
        <Header lang={currentLang} dict={dict} />
        <div style={{ paddingTop: '5rem', minHeight: '80vh' }}>
          <PageBuilderRenderer sections={defaultSections} locale={currentLang} />
        </div>
        <Footer lang={currentLang} dict={dict} />
      </main>
    );
  }

  // 4. Fallback 404 for unknown project slugs
  return (
    <main className="main-container">
      <Header lang={currentLang} dict={dict} />
      <div className="page-container">
        <header className="page-header">
          <span className="page-tag">[ 404 // NOT FOUND ]</span>
          <h1 className="page-title">{dict.projectDetail.notFoundTitle}</h1>
          <p className="page-subtitle">{dict.projectDetail.notFoundSubtitle}</p>
        </header>
        <Link href={`/${currentLang}/projects`} className="project-intro__enter-btn" style={{ width: 'fit-content' }}>
          {dict.projectDetail.backBtn}
        </Link>
      </div>
      <Footer lang={currentLang} dict={dict} />
    </main>
  );
}
