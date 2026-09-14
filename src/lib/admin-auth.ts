/**
 * TIYATROTIST — Admin Cookie & Session Utility
 *
 * Manages admin authentication cookies (admin_session, admin_user, admin_role, admin_logged_in)
 * ensuring full persistence across browser reloads, middleware, and DevTools inspections.
 */

export interface AdminCookieData {
  token: string;
  email: string;
  role?: string;
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Set admin session cookies in document.cookie
 */
export function setAdminCookies({ token, email, role = 'owner' }: AdminCookieData): void {
  if (typeof document === 'undefined') return;

  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000).toUTCString();

  const cookieOptions = `; expires=${expires}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax${secureFlag}`;

  document.cookie = `admin_session=${encodeURIComponent(token)}${cookieOptions}`;
  document.cookie = `admin_user=${encodeURIComponent(email)}${cookieOptions}`;
  document.cookie = `admin_role=${encodeURIComponent(role)}${cookieOptions}`;
  document.cookie = `admin_logged_in=true${cookieOptions}`;

  // Also set with /admin path scope for high specificity
  const adminPathOptions = `; expires=${expires}; max-age=${COOKIE_MAX_AGE}; path=/admin; SameSite=Lax${secureFlag}`;
  document.cookie = `admin_session=${encodeURIComponent(token)}${adminPathOptions}`;
  document.cookie = `admin_logged_in=true${adminPathOptions}`;

  console.debug('[admin-auth] Admin session cookies set successfully for:', email);
}

/**
 * Clear all admin cookies on logout
 */
export function clearAdminCookies(): void {
  if (typeof document === 'undefined') return;

  const expiredOptions = '; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';

  // Clear root path
  document.cookie = `admin_session=${expiredOptions}; path=/`;
  document.cookie = `admin_user=${expiredOptions}; path=/`;
  document.cookie = `admin_role=${expiredOptions}; path=/`;
  document.cookie = `admin_logged_in=${expiredOptions}; path=/`;

  // Clear /admin path
  document.cookie = `admin_session=${expiredOptions}; path=/admin`;
  document.cookie = `admin_user=${expiredOptions}; path=/admin`;
  document.cookie = `admin_role=${expiredOptions}; path=/admin`;
  document.cookie = `admin_logged_in=${expiredOptions}; path=/admin`;

  console.debug('[admin-auth] Admin session cookies cleared');
}

/**
 * Read specific cookie from document.cookie
 */
export function getAdminCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Check if admin cookie exists
 */
export function hasAdminCookie(): boolean {
  return Boolean(getAdminCookie('admin_session') || getAdminCookie('admin_logged_in'));
}
