const CACHE_NAME = 'justinmind-global-cache-v1';

// File types to cache
const EXTENSIONS = /\.(html|js|css|png|jpg|jpeg|gif|svg|json|woff2?|ttf|ico)$/i;

// Recursively fetch directory listings (Netlify & Vercel support static files)
async function listAllFiles(baseUrl) {
  const response = await fetch(baseUrl);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const links = [...doc.querySelectorAll('a')];

  const urls = [];
  for (const link of links) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('?') || href.startsWith('#')) continue;

    const full = new URL(href, baseUrl).href;
    if (full.endsWith('/')) {
      // recursively scan subfolders
      urls.push(...await listAllFiles(full));
    } else if (EXTENSIONS.test(full)) {
      urls.push(full);
    }
  }
  return urls;
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const allFiles = [
      location.origin + '/',
      location.origin + '/index.html',
    ];

    // recursively scan prototypes folder
    try {
      const prototypeFiles = await listAllFiles(location.origin + '/prototypes/');
      allFiles.push(...prototypeFiles);
    } catch (e) {
      console.warn('Failed to scan prototypes folder:', e);
    }

    await cache.addAll(allFiles);
    console.log('Cached files:', allFiles);
    self.skipWaiting();
  })());
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
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      }).catch(() => caches.match(location.origin + '/index.html'))
    )
  );
});
