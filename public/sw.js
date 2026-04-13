// FirstHomeGuide.ca Service Worker
// Cache-first for static assets, network-first for HTML pages

const CACHE_VERSION = 'fhg-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGES_CACHE = `${CACHE_VERSION}-pages`;

// Max cache ages (in milliseconds)
const MAX_HTML_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_ASSET_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

const PRE_CACHE_URLS = [
  '/',
  '/guide/welcome/',
  '/tools/',
  '/offline/',
];

// Install: pre-cache essential pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRE_CACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Helper: check if a cached response is expired
function isCacheExpired(response, maxAge) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  const cachedTime = new Date(dateHeader).getTime();
  return Date.now() - cachedTime > maxAge;
}

// Fetch: network-first for pages, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Static assets: cache-first with expiration
  if (url.pathname.match(/\.(js|css|webp|svg|png|jpg|jpeg|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached && !isCacheExpired(cached, MAX_ASSET_AGE)) {
          return cached;
        }
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => {
            // If fetch fails and we have a stale cache, use it
            if (cached) return cached;
            return new Response('', { status: 408 });
          });
      })
    );
    return;
  }

  // HTML pages: network-first, cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => {
              if (cached && !isCacheExpired(cached, MAX_HTML_AGE)) {
                return cached;
              }
              // Return stale cache if available, even if expired
              if (cached) return cached;
              return caches.match('/offline/');
            })
        )
    );
    return;
  }
});
