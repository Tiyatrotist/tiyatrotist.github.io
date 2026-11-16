import type { MetadataRoute } from 'next';
import { SYSTEM_PROJECTS } from '@/config/projects';
import { getAllBlogPosts } from '@/lib/blog-service';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tiyatrotist.com.tr';
  const currentDate = new Date();

  const staticRoutes = [
    { path: '', changeFrequency: 'daily' as const, priorityTr: 1.0, priorityEn: 0.9 },
    { path: 'about', changeFrequency: 'monthly' as const, priorityTr: 0.8, priorityEn: 0.7 },
    { path: 'projects', changeFrequency: 'weekly' as const, priorityTr: 0.9, priorityEn: 0.85 },
    { path: 'blog', changeFrequency: 'daily' as const, priorityTr: 0.95, priorityEn: 0.9 },
    { path: 'contact', changeFrequency: 'monthly' as const, priorityTr: 0.7, priorityEn: 0.6 },
    { path: 'hire', changeFrequency: 'monthly' as const, priorityTr: 0.75, priorityEn: 0.65 },
    { path: 'now', changeFrequency: 'weekly' as const, priorityTr: 0.75, priorityEn: 0.65 },
  ];

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          tr: `${baseUrl}/tr`,
          en: `${baseUrl}/en`,
        },
      },
    },
  ];

  // Localized static routes
  for (const route of staticRoutes) {
    const trUrl = route.path ? `${baseUrl}/tr/${route.path}` : `${baseUrl}/tr`;
    const enUrl = route.path ? `${baseUrl}/en/${route.path}` : `${baseUrl}/en`;

    entries.push({
      url: trUrl,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priorityTr,
      alternates: {
        languages: {
          tr: trUrl,
          en: enUrl,
        },
      },
    });

    entries.push({
      url: enUrl,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priorityEn,
      alternates: {
        languages: {
          tr: trUrl,
          en: enUrl,
        },
      },
    });
  }

  // BookOS standalone entry
  entries.push({
    url: `${baseUrl}/bookos`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
    alternates: {
      languages: {
        tr: `${baseUrl}/tr/projects/bookos`,
        en: `${baseUrl}/en/projects/bookos`,
      },
    },
  });

  // System Projects (Dedicated 3D Scrollytelling Microsites)
  for (const proj of SYSTEM_PROJECTS) {
    if (proj.slug) {
      const trUrl = `${baseUrl}/tr/projects/${proj.slug}`;
      const enUrl = `${baseUrl}/en/projects/${proj.slug}`;

      entries.push({
        url: trUrl,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            tr: trUrl,
            en: enUrl,
          },
        },
      });

      entries.push({
        url: enUrl,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            tr: trUrl,
            en: enUrl,
          },
        },
      });
    }
  }

  // Unified Blog Posts (Git-tracked Markdown & Supabase)
  try {
    const posts = await getAllBlogPosts();
    for (const post of posts) {
      if (post.slug) {
        const rawDate = post.updated_at || post.published_at;
        const lastMod = rawDate ? new Date(rawDate) : currentDate;
        const trUrl = `${baseUrl}/tr/blog/${post.slug}`;
        const enUrl = `${baseUrl}/en/blog/${post.slug}`;

        entries.push({
          url: trUrl,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: post.featured ? 0.9 : 0.85,
          alternates: {
            languages: {
              tr: trUrl,
              en: enUrl,
            },
          },
        });

        entries.push({
          url: enUrl,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: post.featured ? 0.85 : 0.8,
          alternates: {
            languages: {
              tr: trUrl,
              en: enUrl,
            },
          },
        });
      }
    }
  } catch (error) {
    console.warn('[sitemap] Failed to query blog posts:', error);
  }

  return entries;
}
