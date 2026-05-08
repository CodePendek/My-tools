// Dynamic base path - akan diisi otomatis dari scope
let BASE_PATH = '';

self.addEventListener('install', event => {
  // Ambil base path dari scope
  const scopeUrl = new URL(self.registration.scope);
  BASE_PATH = scopeUrl.pathname;
  
  const urlsToCache = [
    BASE_PATH,
    BASE_PATH + 'index.html',
    BASE_PATH + 'absensi.html',
    BASE_PATH + 'slip.html',
    BASE_PATH + 'retase.html',
    BASE_PATH + 'manifest.json'
  ];
  
  event.waitUntil(
    caches.open('tools-hub-v1')
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
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== 'tools-hub-v1') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});