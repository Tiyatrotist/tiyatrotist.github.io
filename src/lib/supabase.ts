/**
 * TIYATROTIST — Supabase Client
 *
 * Central Supabase client singleton for the admin panel.
 * Uses NEXT_PUBLIC env vars only — no service-role key.
 *
 * Debug logs are emitted in development mode.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Owner user ID — the only admin allowed */
export const OWNER_ID = '8405e5aa-d46c-4f36-9e1f-1c8d32147b83';

/**
 * Returns the current authenticated user or null.
 * Debug-logs the result in development.
 */
export async function getUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[supabase] getUser session:', session?.user?.id ?? 'none', error ?? '');
  }
  return session?.user ?? null;
}

/**
 * Check if the current user is the authorized owner.
 */
export async function isOwner(): Promise<boolean> {
  const user = await getUser();
  return user?.id === OWNER_ID;
}
