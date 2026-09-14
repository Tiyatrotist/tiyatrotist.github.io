/**
 * TIYATROTIST — Unified Project Usage & Guest Telemetry Analytics
 *
 * Tracks guest and authenticated user interactions across all projects (TypeFlow, BookOS, etc.)
 * Ensures anonymous usage events are stored locally and mirrored to Supabase.
 */

import { supabase } from './supabase';

export interface ProjectUsageEvent {
  id: string;
  project_slug: string;
  event_type: 'session_start' | 'page_view' | 'feature_interaction' | 'content_edit' | 'download_click' | 'test_complete';
  event_name: string;
  is_guest: boolean;
  user_identifier: string;
  metadata?: Record<string, any>;
  created_at: string;
}

const GLOBAL_EVENTS_KEY = 'tf_project_events';
const GUEST_COOKIE_KEY = 'guest_device_id';

/**
 * Get or generate a persistent guest identifier stored in cookie and localStorage
 */
export function getOrCreateGuestSessionId(): string {
  if (typeof window === 'undefined') return 'gst_ssr';

  try {
    // 1. Check document.cookie
    const match = document.cookie.match(new RegExp('(?:^|; )' + GUEST_COOKIE_KEY + '=([^;]*)'));
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }

    // 2. Check localStorage
    const local = localStorage.getItem('tf_guest_device_id');
    if (local) {
      // Re-set cookie for cross-route sync
      document.cookie = `${GUEST_COOKIE_KEY}=${encodeURIComponent(local)}; path=/; max-age=31536000; SameSite=Lax`;
      return local;
    }

    // 3. Generate fresh guest ID
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const newId = `gst_${Date.now().toString(36)}_${randomSuffix}`;

    localStorage.setItem('tf_guest_device_id', newId);
    document.cookie = `${GUEST_COOKIE_KEY}=${encodeURIComponent(newId)}; path=/; max-age=31536000; SameSite=Lax`;

    return newId;
  } catch {
    return 'gst_fallback';
  }
}

export type RecordProjectEventParams = {
  project_slug?: string;
  projectSlug?: string;
  event_type: 'session_start' | 'page_view' | 'feature_interaction' | 'content_edit' | 'download_click' | 'test_complete';
  event_name: string;
  is_guest?: boolean;
  user_identifier?: string;
  metadata?: Record<string, any>;
};

/**
 * Record a usage event for any project (Guest or Authenticated)
 */
export function recordProjectEvent(params: RecordProjectEventParams): ProjectUsageEvent {
  const guestId = getOrCreateGuestSessionId();
  const resolvedSlug = params.project_slug || params.projectSlug || 'general';

  const event: ProjectUsageEvent = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    project_slug: resolvedSlug,
    event_type: params.event_type,
    event_name: params.event_name,
    is_guest: params.is_guest !== undefined ? params.is_guest : true,
    user_identifier: params.user_identifier || (params.is_guest !== false ? `Misafir (${guestId.substring(0, 10)})` : 'Kullanıcı'),
    metadata: params.metadata || {},
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      // 1. Save to global list
      const raw = localStorage.getItem(GLOBAL_EVENTS_KEY);
      const list: ProjectUsageEvent[] = raw ? JSON.parse(raw) : [];
      list.unshift(event);
      // Keep up to 200 recent events
      if (list.length > 200) list.length = 200;
      localStorage.setItem(GLOBAL_EVENTS_KEY, JSON.stringify(list));

      // 2. Save to project specific list
      const projKey = `tf_project_events_${resolvedSlug}`;
      const projRaw = localStorage.getItem(projKey);
      const projList: ProjectUsageEvent[] = projRaw ? JSON.parse(projRaw) : [];
      projList.unshift(event);
      if (projList.length > 100) projList.length = 100;
      localStorage.setItem(projKey, JSON.stringify(projList));
    } catch (e) {
      console.debug('[ProjectAnalytics] Local storage write notice:', e);
    }
  }

  // 3. Non-blocking cloud mirror to Supabase
  (async () => {
    try {
      await supabase.from('project_events').insert({
        project_slug: event.project_slug,
        event_type: event.event_type,
        event_name: event.event_name,
        is_guest: event.is_guest,
        user_identifier: event.user_identifier,
        metadata: event.metadata,
        created_at: event.created_at,
      });
    } catch (cloudErr) {
      // Suppress network or missing table errors gracefully
      console.debug('[ProjectAnalytics] Supabase mirror notice (offline/table pending):', cloudErr);
    }
  })();

  console.debug(
    `[ProjectAnalytics] Event: [${event.project_slug.toUpperCase()}] ${event.event_name} - ${event.is_guest ? 'Guest' : 'User'}`
  );

  return event;
}

/**
 * Get recent recorded events (optionally filtered by project slug)
 */
export function getRecentProjectEvents(projectSlug?: string, limit: number = 50): ProjectUsageEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(GLOBAL_EVENTS_KEY);
    let list: ProjectUsageEvent[] = raw ? JSON.parse(raw) : [];

    if (projectSlug && projectSlug !== 'all') {
      list = list.filter((e) => e.project_slug === projectSlug);
    }

    return list.slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Get aggregated statistics for the admin dashboard
 */
export function getProjectUsageStats(): {
  totalEvents: number;
  guestEvents: number;
  todayEvents: number;
  projectBreakdown: Record<string, number>;
} {
  if (typeof window === 'undefined') {
    return { totalEvents: 0, guestEvents: 0, todayEvents: 0, projectBreakdown: {} };
  }

  try {
    const raw = localStorage.getItem(GLOBAL_EVENTS_KEY);
    const list: ProjectUsageEvent[] = raw ? JSON.parse(raw) : [];

    const todayStr = new Date().toISOString().split('T')[0];
    let guestCount = 0;
    let todayCount = 0;
    const breakdown: Record<string, number> = {};

    list.forEach((e) => {
      if (e.is_guest) guestCount++;
      if (e.created_at && e.created_at.startsWith(todayStr)) todayCount++;
      breakdown[e.project_slug] = (breakdown[e.project_slug] || 0) + 1;
    });

    return {
      totalEvents: list.length,
      guestEvents: guestCount,
      todayEvents: todayCount,
      projectBreakdown: breakdown,
    };
  } catch {
    return { totalEvents: 0, guestEvents: 0, todayEvents: 0, projectBreakdown: {} };
  }
}
