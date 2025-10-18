const CACHE_NAME = 'water-sort-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/sounds/pour.mp3',
  '/sounds/success.mp3',
  '/sounds/click.mp3',
  '/sounds/select.mp3'
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
