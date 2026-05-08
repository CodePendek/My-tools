// Nama cache yang unik untuk proyek ini
const CACHE_NAME = 'tools-hub-v1';

self.addEventListener('install', event => {
  // Ambil base path secara dinamis dari scope pendaftaran
  const scopeUrl = new URL(self.registration.scope);
  const BASE_PATH = scopeUrl.pathname;
  
  const urlsToCache = [
    BASE_PATH,
    BASE_PATH + 'index.html',
    BASE_PATH + 'absensi.html',
    BASE_PATH + 'absen.html',
    BASE_PATH + 'slip.html',
    BASE_PATH + 'retase.html',
    BASE_PATH + 'manifest.json'
  ];
  
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
        console.log('Caching app shell...');
        return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
        // Return dari cache jika ada, jika tidak ambil dari network
        return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
