/**
 * TIYATROTIST — Blog Studio Types
 *
 * Types for the Visual AI Blog Studio & Asset Pipeline.
 * Handles screenshot requirements, Banana 2 / AI image prompts,
 * asset statuses, and draft synchronization.
 */

export type VisualAssetType = 'SCREENSHOT_REQUIRED' | 'AI_IMAGE_PROMPT';

export type VisualAssetStatus = 'pending' | 'ready';

export interface VisualAssetSpecs {
  // Screenshot-specific specs
  resolution?: string; // e.g. "1920x1080 (16:9 Desktop)"
  targetInterface?: string; // e.g. "TypeFlow Skor Tablosu ve WPM Grafiği"
  detailsToCapture?: string; // e.g. "Karanlık mod, liderlik tablosu, net mono vurgular"

  // AI Prompt-specific specs
  prompt?: string; // e.g. "Editorial architectural isometric wireframe..."
  negativePrompt?: string;
  styleEngine?: string; // e.g. "Banana 2 / Midjourney v6 / Imagen 3"
  aspectRatioHint?: string; // e.g. "--ar 16:9"
}

export interface VisualAsset {
  id: string;
  placeholderToken: string; // e.g. "<!-- ASSET:asset-hero -->" or token in markdown
  type: VisualAssetType;
  title: string;
  context: string; // Where and why in the article
  aspectRatio: '16:9' | '4:3' | '1:1' | '9:16';
  specs: VisualAssetSpecs;
  status: VisualAssetStatus;
  imageUrl: string | null;
  fileName?: string;
  fileSize?: number;
  uploadedAt?: string;
}

export interface BlogStudioTopicPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  category: string;
  tags: string[];
  tone: string;
  defaultTitleTr: string;
  defaultTitleEn: string;
}

export interface BlogStudioDraft {
  id: string;
  topic: string;
  tone: string;
  category: string;
  tags: string[];
  targetAudience: string;
  title_tr: string;
  title_en: string;
  slug: string;
  excerpt_tr: string;
  excerpt_en: string;
  content_tr: string;
  content_en: string;
  cover_image: string;
  visualAssets: VisualAsset[];
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
