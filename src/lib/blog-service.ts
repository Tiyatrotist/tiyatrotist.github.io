import fs from 'fs';
import path from 'path';
import { BlogPostItem } from '@/types/blog';
import { supabase } from '@/lib/supabase';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');

interface ParsedMarkdown {
  frontmatter: Record<string, any>;
  content: string;
}

/**
 * Lightweight, zero-dependency YAML frontmatter parser
 */
function parseFrontmatter(fileContent: string): ParsedMarkdown {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: fileContent.trim() };
  }

  const yamlBlock = match[1];
  const content = match[2].trim();
  const frontmatter: Record<string, any> = {};

  yamlBlock.split(/\r?\n/).forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let val = line.slice(colonIndex + 1).trim();

    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    // Parse booleans
    if (val.toLowerCase() === 'true') {
      frontmatter[key] = true;
    } else if (val.toLowerCase() === 'false') {
      frontmatter[key] = false;
    } else if (val.startsWith('[') && val.endsWith(']')) {
      // Parse array like ["A", "B", "C"]
      const items = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      frontmatter[key] = items;
    } else {
      frontmatter[key] = val;
    }
  });

  return { frontmatter, content };
}

/**
 * Calculates reading time in minutes based on word count
 */
function calculateReadingTime(text: string): { tr: string; en: string } {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return {
    tr: `${minutes} dk okuma`,
    en: `${minutes} min read`,
  };
}

/**
 * Reads all local Markdown posts from content/posts/
 */
export function getLocalBlogPosts(): BlogPostItem[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }

  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  const posts: BlogPostItem[] = [];

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;

    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(POSTS_DIRECTORY, fileName);
    const rawContent = fs.readFileSync(fullPath, 'utf8');

    const { frontmatter, content } = parseFrontmatter(rawContent);

    if (frontmatter.published === false) continue;

    const readTime = calculateReadingTime(content);

    // Detect if authentic human audio recording exists
    let audioUrlTr = frontmatter.audio_tr || frontmatter.audio_url_tr || frontmatter.audio || undefined;
    let audioUrlEn = frontmatter.audio_en || frontmatter.audio_url_en || undefined;

    const publicAudioDir = path.join(process.cwd(), 'public', 'audio', 'blog');
    if (!audioUrlTr && fs.existsSync(path.join(publicAudioDir, `${slug}.tr.mp3`))) {
      audioUrlTr = `/audio/blog/${slug}.tr.mp3`;
    } else if (!audioUrlTr && fs.existsSync(path.join(publicAudioDir, `${slug}.mp3`))) {
      audioUrlTr = `/audio/blog/${slug}.mp3`;
    }

    if (!audioUrlEn && fs.existsSync(path.join(publicAudioDir, `${slug}.en.mp3`))) {
      audioUrlEn = `/audio/blog/${slug}.en.mp3`;
    }

    posts.push({
      id: `local-${slug}`,
      slug: frontmatter.slug || slug,
      title_tr: frontmatter.title_tr || frontmatter.title || slug,
      title_en: frontmatter.title_en || frontmatter.title || slug,
      excerpt_tr: frontmatter.excerpt_tr || frontmatter.excerpt || '',
      excerpt_en: frontmatter.excerpt_en || frontmatter.excerpt || '',
      content_tr: frontmatter.content_tr || content,
      content_en: frontmatter.content_en || content,
      cover_image: frontmatter.cover_image,
      audio_url_tr: audioUrlTr,
      audio_url_en: audioUrlEn,
      category: frontmatter.category || 'Mühendislik',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : ['Tech'],
      read_time_tr: frontmatter.read_time_tr || readTime.tr,
      read_time_en: frontmatter.read_time_en || readTime.en,
      published: true,
      featured: Boolean(frontmatter.featured),
      published_at: frontmatter.date || new Date().toISOString(),
    });
  }

  return posts;
}

/**
 * Fetches all blog posts, merging local markdown files with Supabase entries
 */
export async function getAllBlogPosts(): Promise<BlogPostItem[]> {
  const localPosts = getLocalBlogPosts();
  const seenSlugs = new Set<string>(localPosts.map((p) => p.slug));

  let remotePosts: BlogPostItem[] = [];

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (!error && data && data.length > 0) {
      for (const d of data) {
        if (!seenSlugs.has(d.slug)) {
          seenSlugs.add(d.slug);
          const readTime = calculateReadingTime(d.content_tr || d.content_en || '');
          remotePosts.push({
            id: d.id,
            slug: d.slug,
            title_tr: d.title_tr || '',
            title_en: d.title_en || '',
            excerpt_tr: d.excerpt_tr || '',
            excerpt_en: d.excerpt_en || '',
            content_tr: d.content_tr || '',
            content_en: d.content_en || '',
            cover_image: d.cover_image,
            category: d.category || 'Mühendislik',
            tags: d.tags || ['Tech'],
            read_time_tr: d.read_time_tr || readTime.tr,
            read_time_en: d.read_time_en || readTime.en,
            published: d.published,
            featured: d.featured || false,
            likes_count: d.likes_count || 0,
            views_count: d.views_count || 0,
            published_at: d.published_at || d.created_at || new Date().toISOString(),
          });
        }
      }
    }
  } catch (err) {
    console.debug('[blog-service] Supabase query notice:', err);
  }

  const all = [...localPosts, ...remotePosts];
  // Sort descending by published_at
  all.sort((a, b) => {
    const timeA = new Date(a.published_at || 0).getTime();
    const timeB = new Date(b.published_at || 0).getTime();
    return timeB - timeA;
  });

  return all;
}

/**
 * Finds a single post by slug from local markdown or Supabase
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostItem | null> {
  const all = await getAllBlogPosts();
  return all.find((p) => p.slug === slug) || null;
}
