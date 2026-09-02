const CACHE_NAME = 'loro-paco-v13';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './images/loritovenezolano.png',
  './images/lorito-gringo.png',
  './images/icon-192.png',
  './images/icon-512.png', // <-- Comma agregada aquí
  './images/planta-carnivora.png'
];

// Instalación: cachea todos los archivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Archivos cacheados correctamente');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('❌ Error al cachear archivos:', error);
      })
  );
  self.skipWaiting(); // Fuerza la activación inmediata del nuevo SW
});

// Activación: limpia caches antiguas si actualizas la versión
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Borrando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Toma el control de las páginas abiertas inmediatamente
});

// Intercepta las peticiones: si está en caché, lo usa; si no, va a la red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si está en caché, lo devuelve; si no, lo pide a la red
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Fallback por si se pierde la conexión en un recurso no cacheado
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
