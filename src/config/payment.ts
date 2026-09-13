/**
 * TIYATROTIST / TYPEFLOW — Payment Infrastructure Configuration
 * 
 * Centralized payment gateway integration settings supporting:
 * 1. Stripe Checkout / Stripe Payment Links (Global Credit Card, Apple Pay, Google Pay)
 * 2. PayTR / iyzico (Turkish Debit/Credit Cards & Installments)
 * 3. FAST / Bank Wire Transfer (with Order Verification Form)
 * 4. Sandbox / Developer Simulation Mode
 */

export type PaymentGatewayMode = 'stripe' | 'paytr' | 'bank_transfer' | 'sandbox';

export interface StripePaymentLinks {
  super_trial: string;
  super_monthly: string;
  super_yearly: string;
  gems_500: string;
  gems_1500: string;
  gems_5000: string;
  energy_unlimited: string;
}

export interface PaymentConfig {
  /**
   * Active default gateway ('stripe' | 'paytr' | 'bank_transfer' | 'sandbox')
   */
  defaultGateway: PaymentGatewayMode;

  /**
   * Stripe Publishable Key (e.g. pk_live_... or pk_test_...)
   */
  stripePublishableKey: string;

  /**
   * Direct Stripe Hosted Checkout URLs (Stripe Payment Links)
   * These can be generated directly from Stripe Dashboard -> Payment Links
   */
  stripePaymentLinks: StripePaymentLinks;

  /**
   * PayTR / iyzico Hosted Checkout URL
   */
  paytrPaymentUrl: string;

  /**
   * Bank wire / FAST transfer account details
   */
  bankTransfer: {
    bankName: string;
    accountHolder: string;
    iban: string;
    paparaNo: string;
  };
}

export const PAYMENT_CONFIG: PaymentConfig = {
  defaultGateway: 'stripe',
  stripePublishableKey:
    typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      : 'pk_test_51MzTypeFlowDemoKey2026',
  stripePaymentLinks: {
    super_trial: 'https://buy.stripe.com/test_super_trial_7days',
    super_monthly: 'https://buy.stripe.com/test_super_monthly_49try',
    super_yearly: 'https://buy.stripe.com/test_super_yearly_359try',
    gems_500: 'https://buy.stripe.com/test_gems_500',
    gems_1500: 'https://buy.stripe.com/test_gems_1500',
    gems_5000: 'https://buy.stripe.com/test_gems_5000',
    energy_unlimited: 'https://buy.stripe.com/test_energy_unlimited',
  },
  paytrPaymentUrl: 'https://www.paytr.com/odeme/guvenli/tiyatrotist',
  bankTransfer: {
    bankName: 'Türkiye İş Bankası & QNB Enpara',
    accountHolder: 'BUĞRA / TİYATROTİST LABS',
    iban: 'TR33 0006 1005 1234 5678 9012 34',
    paparaNo: '1092837465',
  },
};

/**
 * Returns the active Stripe Payment Link for a specific package ID.
 * Supports localStorage override from Admin Settings.
 */
export function getStripePaymentLink(packageId: string): string | null {
  if (typeof window !== 'undefined') {
    const customLink = localStorage.getItem(`tf_stripe_link_${packageId}`);
    if (customLink && customLink.trim().startsWith('http')) {
      return customLink.trim();
    }
  }

  const links = PAYMENT_CONFIG.stripePaymentLinks;
  if (packageId in links) {
    return links[packageId as keyof StripePaymentLinks];
  }
  return null;
}

/**
 * Check whether a live production Stripe link is configured
 */
export function isLiveStripeConfigured(): boolean {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('tf_stripe_link_super_yearly');
    if (custom && custom.includes('buy.stripe.com') && !custom.includes('test_')) {
      return true;
    }
  }
  return false;
}

export interface PendingWireOrder {
  orderId: string;
  packageId: string;
  packageName: string;
  amountTry: number;
  senderName: string;
  bankName: string;
  referenceNumber: string;
  notes?: string;
  status: 'pending_verification' | 'approved' | 'rejected';
  createdAt: string;
  verifiedAt?: string;
  userEmail: string;
}

export function savePendingWireOrder(order: PendingWireOrder): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getPendingWireOrders();
    const updated = [order, ...existing.filter((o) => o.orderId !== order.orderId)];
    localStorage.setItem('tf_pending_orders', JSON.stringify(updated));
    console.debug('[PaymentConfig] Saved pending wire order:', order.orderId);
  } catch (err) {
    console.error('[PaymentConfig] Error saving pending order:', err);
  }
}

export function getPendingWireOrders(): PendingWireOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('tf_pending_orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function updatePendingOrderStatus(orderId: string, status: 'approved' | 'rejected'): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const orders = getPendingWireOrders();
    const target = orders.find((o) => o.orderId === orderId);
    if (!target) return false;
    target.status = status;
    target.verifiedAt = new Date().toISOString();
    localStorage.setItem('tf_pending_orders', JSON.stringify(orders));
    console.debug('[PaymentConfig] Updated order status:', orderId, status);
    return true;
  } catch {
    return false;
  }
}
