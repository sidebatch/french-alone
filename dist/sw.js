/* Offline app shell. Keep this worker inside the repository's own Pages scope. */
const CACHE_PREFIX = 'french-alone:' + self.registration.scope + ':';
const CACHE_NAME = CACHE_PREFIX + '2026-11-13-release-1.9.0';
const APP_FILES = [
  './', './index.html', './style.css', './pwa.css', './product.css', './app.js', './core.js', './data.js',
  './practice-content.js','./practice-intermediate.js','./practice-lessons.js','./grammar-data.js','./grammar-extra-data.js','./grammar-terms.js','./grammar-core.js','./grammar.js','./grammar.css', './learning.css', './play.css', './practice.js', './practice-core.js', './practice-data.js', './pwa.js', './feedback.js', './ux.css', './study-viewport.js',
  './companion.js', './companion.css', './polish.css', './assets/lou-sprites-v2.webp', './manifest.webmanifest', './icon.svg',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'
];
const APP_URLS = new Set(APP_FILES.map(path => new URL(path, self.registration.scope).href));
const HOME_URL = new URL('./', self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([...APP_URLS].map(url => new Request(url, { cache: 'reload' })));
    // A replacement worker waits. The visitor chooses when to reopen the app.
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'ACTIVATE_UPDATE') self.skipWaiting();
});
async function networkFirst(request, canonicalURL) {
  let cache;
  try { cache = await caches.open(CACHE_NAME); } catch { return fetch(request, { cache: 'no-cache' }); }
  try {
    const response = await fetch(request, { cache: 'no-cache' });
    if (response.ok) {
      try { await cache.put(canonicalURL, response.clone()); } catch { /* Online lessons still work if storage is full. */ }
      return response;
    }
    const cached = await cache.match(canonicalURL);
    return cached || response;
  } catch {
    const cached = await cache.match(canonicalURL);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const home = await cache.match(HOME_URL);
      if (home) return home;
      return new Response('처음 한 번은 인터넷에 연결해 앱을 열어 주세요.', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    return Response.error();
  }
}
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  url.search = ''; url.hash = '';
  if (!APP_URLS.has(url.href)) return;
  event.respondWith(networkFirst(event.request, url.href));
});
