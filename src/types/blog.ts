/**
 * TIYATROTIST — Blog Type Definitions
 */

export interface BlogPostItem {
  id: string;
  slug: string;
  title_tr?: string;
  title_en?: string;
  excerpt_tr?: string;
  excerpt_en?: string;
  content_tr?: string;
  content_en?: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
  read_time_tr?: string;
  read_time_en?: string;
  published: boolean;
  featured: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}
