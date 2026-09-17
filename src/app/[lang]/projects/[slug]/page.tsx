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
import ParticleSandbox from '@/components/ParticleSandbox';
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
    { lang: 'tr', slug: 'sandbox' },
    { lang: 'en', slug: 'sandbox' },
  ];

  try {
    const { data: projects } = await supabase
      .from('projects')
      .select('slug')
      .eq('published', true);

    if (projects && projects.length > 0) {
      for (const p of projects) {
        if (p.slug && p.slug !== 'bookos' && p.slug !== 'typeflow' && p.slug !== 'sandbox') {
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

  if (slug === 'sandbox') {
    return (
      <main className="main-container">
        <Header lang={currentLang} dict={dict} />
        <div className="page-container" style={{ maxWidth: '1080px', paddingTop: '1.5rem' }}>
          <header className="page-header" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Link
                href={`/${currentLang}/projects`}
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.45)',
                  textDecoration: 'none',
                }}
              >
                ← {currentLang === 'tr' ? 'PROJELERE DÖN' : 'BACK TO PROJECTS'}
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
                v1.0.0 (stable)
              </span>
            </div>
            <h1
              className="page-title"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                lineHeight: 1.2,
                fontWeight: 500,
              }}
            >
              Particle Sandbox
            </h1>
            <p
              className="page-subtitle"
              style={{
                maxWidth: '720px',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {currentLang === 'tr'
                ? 'HTML5 Canvas ve 2D vektörel fizik motoruyla çalışan; kum tanecikleri, viskoz sıvılar, kozmik yıldızlar ve matrix karakterlerinin serbestçe çizilip manipüle edildiği interaktif monokrom fizik laboratuvarı.'
                : 'An interactive monochrome physics laboratory running on HTML5 Canvas and a 2D physics engine, where sand, fluid, cosmic stars, and matrix particles are drawn and manipulated in real time.'}
            </p>
          </header>

          {/* Interactive Physics Sandbox */}
          <ParticleSandbox lang={currentLang} />

          {/* Laboratory Notes / Project Technical Architecture */}
          <div
            style={{
              marginTop: '3rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <div>
              <span style={{ color: '#ffffff', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                01 // MODLAR (SIMULATION MODES)
              </span>
              <span>
                {currentLang === 'tr'
                  ? 'Kum taneleri, sıvı viskozitesi, serbest süzülen kozmik yıldızlar ve düşen matris harfleri arasında geçiş yapın.'
                  : 'Switch between sand grains, fluid viscosity, floating cosmic stars, and falling matrix code.'}
              </span>
            </div>

            <div>
              <span style={{ color: '#ffffff', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                02 // YERÇEKİMİ ALANLARI (GRAVITY FIELDS)
              </span>
              <span>
                {currentLang === 'tr'
                  ? 'Aşağı, Ters (Yukarı), Sıfır-G veya fare imlecinin çekim merkezi olduğu Kara Delik (Vortex) vektörleri.'
                  : 'Down, Inverted Up, Zero-G, or the Mouse-Attracting Black Hole (Vortex) force vector.'}
              </span>
            </div>

            <div>
              <span style={{ color: '#ffffff', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                03 // ANLIK GÖRÜNTÜ AL (SNAPSHOT EXPORT)
              </span>
              <span>
                {currentLang === 'tr'
                  ? 'Oluşturduğunuz generatif kompozisyonu tek tıkla yüksek çözünürlüklü PNG formatında cihazınıza kaydedin.'
                  : 'Export your generative particle composition to high-res PNG with a single click.'}
              </span>
            </div>
          </div>
        </div>
        <Footer lang={currentLang} dict={dict} />
      </main>
    );
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
