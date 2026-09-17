/**
 * TIYATROTIST — Offline Service Worker
 * Caches static core assets and serves the offline experience when disconnected.
 */

const CACHE_NAME = 'tiyatrotist-v2';
const STATIC_ASSETS = [
  '/',
  '/icon.svg',
  '/offline',
  '/tr',
  '/en',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension, admin routes, and external tracking
  const url = new URL(event.request.url);
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api') ||
    !url.origin.includes(self.location.origin)
  ) {
    return;
  }

  // Navigation requests: Network-First with Offline Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(event.request);
        if (cached) return cached;
        return cache.match('/offline') || Response.error();
      })
    );
    return;
  }

  // Static assets (CSS, JS, images): Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
