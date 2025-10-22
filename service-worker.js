const CACHE_NAME = 'enlit-prototypes-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      const urlsToCache = [
        './',
        './index.html',
        './manifest.json',
        './sledKom-prototypes/resources/',
        './sledKom-prototypes/images/',
        './sledKom-prototypes/review/',
        './sledKom-prototypes/snapshots/',
      ];

      // try to prefetch all discovered URLs
      const cachePromises = urlsToCache.map(async url => {
        try {
          const response = await fetch(url);
          if (response.ok) await cache.put(url, response);
        } catch (err) {
          console.warn('Failed to cache', url, err);
        }
      });

      await Promise.all(cachePromises);
      console.log('✅ Cached files', urlsToCache);
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
