const CACHE_NAME = 'longdan-mobile-v2';
const STATIC_FILES = [
  './', './index.html', './manifest.webmanifest',
  './assets/zhaoyun-reference.png', './assets/zhaoyun-actions-v1.png',
  './assets/chibi-units-v1.png', './assets/zhaoyun-walk-v2.png',
  './assets/chapter1-units-v2.png', './assets/zhaoyun-attack-v3.png',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_FILES).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(caches.match(event.request).then(cached => {
    const network = fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => cached);
    return cached || network;
  }));
});
