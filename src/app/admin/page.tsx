/**
 * TIYATROTIST — Admin Root Page
 *
 * Redirects /admin to /admin/dashboard.
 */

'use client';

import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    window.location.href = '/admin/dashboard';
  }, []);

  return null;
}
