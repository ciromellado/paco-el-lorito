const CACHE_NAME = 'paco-loro-v9';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/loritovenezolano.png',
  '/images/lorito-gringo.png',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// Instalación: cachea todos los archivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación: limpia caches antiguas si actualizas la versión
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta las peticiones: si hay internet, usa la red; si no, usa el cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en cache, lo devuelve; si no, lo pide a la red
        return response || fetch(event.request);
      })
  );
});
