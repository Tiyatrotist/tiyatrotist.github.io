/**
 * TIYATROTIST — Project Scroll Templates & Section Types
 *
 * Lightweight project templates:
 * - cinematic
 * - product
 * - minimal
 */

export type SectionType =
  | 'hero'
  | 'text'
  | 'manifesto'
  | 'image'
  | 'video'
  | 'gallery'
  | 'mediaGallery'
  | 'projectShowcase'
  | 'projectGrid'
  | 'featuredProjects'
  | 'blogPosts'
  | 'feature'
  | 'timeline'
  | 'quote'
  | 'release'
  | 'download'
  | 'cta'
  | 'contact'
  | 'spacer'
  | 'divider'
  | 'terminal'
  | 'stats'
  | 'markdownArticle';

export type LayoutType = 'fullWidth' | 'split' | 'grid' | 'centered';

export type AnimationType = 'none' | 'fadeIn' | 'slideUp' | 'typewriter' | 'dotMatrixBurst';

export type ResponsiveBehavior = 'normal' | 'stackedMobile' | 'hideMobile' | 'carouselMobile';

export interface TimelineItem {
  date_tr: string;
  date_en: string;
  title_tr: string;
  title_en: string;
  description_tr?: string;
  description_en?: string;
}

export interface FeatureItem {
  icon?: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
}

export interface SectionContent {
  tag_tr?: string;
  tag_en?: string;
  title_tr?: string;
  title_en?: string;
  subtitle_tr?: string;
  subtitle_en?: string;
  body_tr?: string;
  body_en?: string;
  button_label_tr?: string;
  button_label_en?: string;
  button_url?: string;
  secondary_button_label_tr?: string;
  secondary_button_label_en?: string;
  secondary_button_url?: string;
  code_snippet?: string;
  code_language?: string;
  media_urls?: string[];
  image_url?: string;
  video_url?: string;
  quote_author_tr?: string;
  quote_author_en?: string;
  quote_role_tr?: string;
  quote_role_en?: string;
  stats?: Array<{ label_tr: string; label_en: string; value: string }>;
  features?: FeatureItem[];
  timeline?: TimelineItem[];
  principles?: Array<{ text_tr: string; text_en: string }>;
  contact_email?: string;
  contact_links?: Array<{ label: string; url: string }>;
  accent_color?: string;
  spacer_height?: number;
}

export interface SectionBlock {
  id: string;
  type: SectionType;
  layout: LayoutType;
  animation: AnimationType;
  responsive: ResponsiveBehavior;
  visible: boolean;
  content: SectionContent;
  settings?: Record<string, unknown>;
  sort_order: number;
}

export type ProjectTemplateKey = 'cinematic' | 'product' | 'minimal';
