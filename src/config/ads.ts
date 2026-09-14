/**
 * TIYATROTIST / TYPEFLOW — Google AdSense Configuration
 * 
 * Centralized settings for official Google AdSense integration,
 * slot identifiers, auto-ads, and fallback rewards.
 */

export interface GoogleAdSenseConfig {
  /**
   * Google AdSense Publisher Client ID (e.g. 'ca-pub-8882049102481920')
   */
  clientId: string;

  /**
   * Global toggle to enable/disable real AdSense scripts & ad units
   */
  enabled: boolean;

  /**
   * Dedicated slot IDs generated from Google AdSense console
   */
  slots: {
    banner: string;
    rewarded: string;
    inFeed: string;
  };

  /**
   * If true, enables test ads mode without impacting production AdSense analytics
   */
  testMode: boolean;
}

export const GOOGLE_ADSENSE_CONFIG: GoogleAdSenseConfig = {
  clientId:
    typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ADSENSE_CLIENT_ID
      ? process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
      : 'ca-pub-7828284439187298',
  enabled: true,
  slots: {
    banner: '8172635490',
    rewarded: '9283746150',
    inFeed: '7364529180',
  },
  testMode: process.env.NODE_ENV !== 'production',
};

/**
 * Returns the currently active AdSense client ID (supports local storage override from admin settings)
 */
export function getActiveAdSenseClientId(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('tf_adsense_client_id');
    if (custom && custom.trim().startsWith('ca-pub-')) {
      return custom.trim();
    }
  }
  return GOOGLE_ADSENSE_CONFIG.clientId;
}

/**
 * Check if AdSense is active for non-premium users
 */
export function isAdSenseEnabled(): boolean {
  if (typeof window !== 'undefined') {
    const customToggle = localStorage.getItem('tf_adsense_enabled');
    if (customToggle !== null) {
      return customToggle === 'true';
    }
  }
  return GOOGLE_ADSENSE_CONFIG.enabled;
}
