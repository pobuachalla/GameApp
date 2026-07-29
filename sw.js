'use strict';

const CACHE = 'gaa-tracker-28281319fc'; // build.cjs rewrites this with a content hash

// App shell — everything needed to run offline.
// Every page plus the scripts/data each one loads; crests/ (9MB) is left to
// the runtime cache and fills in as crests are viewed.
const SHELL = [
  '/',
  '/index.html',
  '/home.html',
  '/quick.html',
  '/entry.html',
  '/review.html',
  '/season.html',
  '/merge.html',
  '/roster.html',
  '/bronco.html',
  '/bronco-seed.json',
  '/gk-save-guide.html',
  '/User_Manual.html',
  '/tokens.css',
  '/style.css',
  '/js/bundle.js',
  '/js/age-grade.js',
  '/js/constants.js',
  '/js/game-utils.js',
  '/js/pitch-svg.js',
  '/roster.json',
  '/manifest.json',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
];

// Pre-cache shell on install. Add files individually rather than addAll —
// addAll is all-or-nothing, and one missing file would silently leave the
// whole app uncached.
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
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
