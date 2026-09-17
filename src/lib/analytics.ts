/**
 * TIYATROTIST — Privacy-First Internal Analytics Engine
 *
 * Zero external trackers, zero cookies, zero personal data.
 * Records anonymous page views and article read counts securely into Supabase.
 */

'use client';

import { supabase } from '@/lib/supabase';

let lastPath = '';
let timeoutId: NodeJS.Timeout | null = null;

function getDeviceType(): string {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}

function getSessionHash(): string {
  if (typeof window === 'undefined') return 'anon';
  let hash = sessionStorage.getItem('tiyatrotist_session_token');
  if (!hash) {
    hash = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('tiyatrotist_session_token', hash);
  }
  return hash;
}

/**
 * Record a page visit event safely into Supabase
 */
export async function trackPageView(path: string) {
  if (typeof window === 'undefined' || !path) return;
  // Don't track admin pages or API routes
  if (path.startsWith('/admin') || path.startsWith('/api')) return;
  if (lastPath === path) return;
  lastPath = path;

  if (timeoutId) clearTimeout(timeoutId);

  timeoutId = setTimeout(async () => {
    try {
      const device = getDeviceType();
      const referrer = document.referrer ? new URL(document.referrer).hostname : 'direct';
      const sessionHash = getSessionHash();

      // 1. Insert into page_views
      await supabase.from('page_views').insert({
        path,
        referrer,
        device,
        session_hash: sessionHash,
      });

      // 2. If viewing a blog post: e.g. /tr/blog/matrixin-en-buyuk-hatasi...
      const match = path.match(/\/(?:tr|en)\/blog\/([^/?#]+)/);
      if (match && match[1] && match[1] !== 'not-found') {
        const slug = match[1];
        // Try atomic RPC increment first, fallback to table update
        try {
          await supabase.rpc('increment_blog_views', { post_slug: slug });
        } catch {
          // fallback query
          const { data } = await supabase.from('blog_posts').select('views_count').eq('slug', slug).single();
          if (data) {
            await supabase.from('blog_posts').update({ views_count: (data.views_count || 0) + 1 }).eq('slug', slug);
          }
        }
      }
    } catch {
      // ignore telemetry errors silently
    }
  }, 800);
}
