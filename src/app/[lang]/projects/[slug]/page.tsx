/**
 * TIYATROTIST — Public Project Detail Route (/[lang]/projects/[slug])
 *
 * Rules:
 * 1. BookOS renders its approved, bespoke interactive microsite.
 * 2. Other projects render using their assigned scroll template (Cinematic, Product, Minimal).
 * 3. If template_id is missing or invalid, it gracefully falls back to Minimal.
 * 4. Renders 404 fallback for unknown project slugs.
 */

import { Locale, getDictionary } from '@/dictionaries';
import { supabase } from '@/lib/supabase';
import { PROJECT_TEMPLATES } from '@/lib/builder/templates';
import { ProjectTemplateKey, SectionBlock } from '@/types/builder';
import BookOSMicrosite from '@/components/bookos/BookOSMicrosite';
import TypeFlowMicrosite from '@/components/typeflow/TypeFlowMicrosite';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBuilderRenderer from '@/components/builder/PageBuilderRenderer';
import Link from 'next/link';

interface ProjectDetailPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const staticParams = [
    { lang: 'tr', slug: 'bookos' },
    { lang: 'en', slug: 'bookos' },
    { lang: 'tr', slug: 'typeflow' },
    { lang: 'en', slug: 'typeflow' },
  ];

  try {
    const { data: projects } = await supabase
      .from('projects')
      .select('slug')
      .eq('published', true);

    if (projects && projects.length > 0) {
      for (const p of projects) {
        if (p.slug && p.slug !== 'bookos' && p.slug !== 'typeflow') {
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

  // 1. Independent microsite designs
  if (slug === 'bookos') {
    return <BookOSMicrosite lang={currentLang} dict={dict} />;
  }

  if (slug === 'typeflow') {
    return <TypeFlowMicrosite lang={currentLang} dict={dict} />;
  }

  // 2. Fetch project details from database
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

  // 3. Fallback 404 for unknown project slugs
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
