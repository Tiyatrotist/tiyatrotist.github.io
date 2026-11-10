import type { MetadataRoute } from 'next';
import { SYSTEM_PROJECTS } from '@/config/projects';
import { getAllBlogPosts } from '@/lib/blog-service';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tiyatrotist.com.tr';
  const currentDate = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tr`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tr/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tr/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tr/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tr/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tr/hire`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/hire`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tr/now`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/now`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/bookos`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // System Projects (Dedicated 3D Scrollytelling Microsites)
  for (const proj of SYSTEM_PROJECTS) {
    if (proj.slug) {
      entries.push({
        url: `${baseUrl}/tr/projects/${proj.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
      entries.push({
        url: `${baseUrl}/en/projects/${proj.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Unified Blog Posts (Git-tracked Markdown & Supabase)
  try {
    const posts = await getAllBlogPosts();
    for (const post of posts) {
      if (post.slug) {
        const lastMod = post.updated_at ? new Date(post.updated_at) : currentDate;
        entries.push({
          url: `${baseUrl}/tr/blog/${post.slug}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.85,
        });
        entries.push({
          url: `${baseUrl}/en/blog/${post.slug}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.75,
        });
      }
    }
  } catch (error) {
    console.warn('[sitemap] Failed to query blog posts:', error);
  }

  return entries;
}
