'use strict';

const CACHE = 'gaa-tracker-v3';

// App shell — everything needed to run offline
const SHELL = [
  '/',
  '/review.html',
  '/season.html',
  '/tokens.css',
  '/style.css',
  '/js/bundle.js',
  '/manifest.json',
  '/favicon.png',
  '/apple-touch-icon.png',
];

// Pre-cache shell on install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

// Delete old caches on activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate for same-origin requests; skip external (FA Kit, analytics)
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const network = fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached); // offline fallback
        return cached || network;
      })
    )
  );
});
