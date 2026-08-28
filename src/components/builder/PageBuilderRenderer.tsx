/**
 * TIYATROTIST — Page Builder Dynamic Renderer
 *
 * Takes a collection of SectionBlock definitions and renders them
 * in sequence using the registered modular section components.
 * Honors section visibility, layout, and animation settings.
 */

'use client';

import { SectionBlock } from '@/types/builder';
import HeroSection from './sections/HeroSection';
import ManifestoSection from './sections/ManifestoSection';
import TerminalSection from './sections/TerminalSection';
import ProjectGridSection from './sections/ProjectGridSection';
import MediaGallerySection from './sections/MediaGallerySection';
import MarkdownSection from './sections/MarkdownSection';
import StatsSection from './sections/StatsSection';
import CTASection from './sections/CTASection';
import FeatureSection from './sections/FeatureSection';
import TimelineSection from './sections/TimelineSection';
import QuoteSection from './sections/QuoteSection';
import ReleaseSection from './sections/ReleaseSection';
import DownloadSection from './sections/DownloadSection';
import ContactSection from './sections/ContactSection';
import { SpacerSection, DividerSection } from './sections/LayoutSeparators';

interface PageBuilderRendererProps {
  sections: SectionBlock[];
  locale?: 'tr' | 'en';
}

export default function PageBuilderRenderer({
  sections,
  locale = 'tr',
}: PageBuilderRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  // Filter out hidden sections and sort by sort_order
  const activeSections = sections
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="page-builder-canvas">
      {activeSections.map((section) => {
        const key = section.id || `section-${section.sort_order}`;

        switch (section.type) {
          case 'hero':
            return <HeroSection key={key} section={section} locale={locale} />;
          case 'manifesto':
          case 'text':
            return <ManifestoSection key={key} section={section} locale={locale} />;
          case 'terminal':
            return <TerminalSection key={key} section={section} locale={locale} />;
          case 'projectGrid':
          case 'projectShowcase':
          case 'featuredProjects':
            return <ProjectGridSection key={key} section={section} locale={locale} />;
          case 'mediaGallery':
          case 'gallery':
          case 'image':
          case 'video':
            return <MediaGallerySection key={key} section={section} locale={locale} />;
          case 'markdownArticle':
          case 'blogPosts':
            return <MarkdownSection key={key} section={section} locale={locale} />;
          case 'stats':
            return <StatsSection key={key} section={section} locale={locale} />;
          case 'cta':
            return <CTASection key={key} section={section} locale={locale} />;
          case 'feature':
            return <FeatureSection key={key} section={section} locale={locale} />;
          case 'timeline':
            return <TimelineSection key={key} section={section} locale={locale} />;
          case 'quote':
            return <QuoteSection key={key} section={section} locale={locale} />;
          case 'release':
            return <ReleaseSection key={key} section={section} locale={locale} />;
          case 'download':
            return <DownloadSection key={key} section={section} locale={locale} />;
          case 'contact':
            return <ContactSection key={key} section={section} locale={locale} />;
          case 'spacer':
            return <SpacerSection key={key} section={section} />;
          case 'divider':
            return <DividerSection key={key} section={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
