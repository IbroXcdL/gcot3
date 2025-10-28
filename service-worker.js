const APP_VERSION = '1.9.11';
const CACHE_NAME = 'gamebin-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './Logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// --- VERSION COMMUNICATION WITH FRONTEND ---
// --- VERSION COMMUNICATION WITH FRONTEND ---
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    const payload = { type: 'VERSION', version: APP_VERSION };

    // Try to reply directly to the source (works in many browsers)
    if (event.source && typeof event.source.postMessage === 'function') {
      try {
        event.source.postMessage(payload);
        return;
      } catch (err) {
        // fall through to clients-matchAll fallback
      }
    }

    // Fallback: broadcast to all controlled clients
    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
      clients.forEach(client => {
        try { client.postMessage(payload); } catch (e) { /* ignore */ }
      });
    });
  }
});





