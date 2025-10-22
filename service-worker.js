const CACHE_NAME = 'enlit-prototypes';

// Automatically cache everything in your site root
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Fetch the root to find all relative asset links
      const indexResponse = await fetch('./index.html');
      const indexText = await indexResponse.text();

      // Parse and extract file paths (basic scan for .js, .css, .png, .jpg, etc.)
      const urlsToCache = ['./', './index.html'];
      const regex = /"(.*?)\.(js|css|png|jpg|jpeg|gif|svg|json|html)"/g;
      let match;
      while ((match = regex.exec(indexText))) {
        const file = match[1] + '.' + match[2];
        if (!urlsToCache.includes(file)) urlsToCache.push(file);
      }

      // Cache all discovered URLs
      await cache.addAll(urlsToCache);
      console.log('Cached files:', urlsToCache);
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response ||
      fetch(event.request).then(fetchRes => {
        // Cache new requests for next time
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      }).catch(() => caches.match('./index.html'))
    )
  );
});
