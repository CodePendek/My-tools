const CACHE_NAME = 'tools-hub-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/absensi.html',
  '/slip.html',
  '/retase.html',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch dengan cache first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      
      // Clone request karena stream hanya bisa dibaca sekali
      const fetchRequest = event.request.clone();
      
      return fetch(fetchRequest).then(response => {
        // Cek response valid
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone response untuk cache
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      });
    })
  );
});

// Update cache ketika ada perubahan
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});