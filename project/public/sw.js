const CACHE_NAME = 'randevu-sistemi-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Service Worker Yükleme
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Cache açıldı');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache yükleme hatası:', err))
  );
  self.skipWaiting();
});

// Fetch olayları (Cache falling back to network)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request).catch(() => {
        // Offline durumunda fallback sayfa
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      }))
  );
});

// Cache güncelleme
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    console.log('Background sync çalışıyor');
    // Burada API isteği veya local storage senkronizasyonu yapılabilir
    // Örnek: await fetch('/api/sync', { method: 'POST', body: JSON.stringify(localData) });
  } catch (err) {
    console.error('Background sync hatası:', err);
  }
}

// Push bildirimleri
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Yeni randevu bildirimi',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id || 1,
      url: data.url || '/'
    },
    actions: [
      { action: 'explore', title: 'Görüntüle', icon: '/icons/icon-192x192.png' },
      { action: 'close', title: 'Kapat', icon: '/icons/icon-192x192.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Randevu Sistemi', options)
  );
});

// Bildirim tıklama
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  if (event.action === 'explore') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) return client.focus();
          }
          if (clients.openWindow) return clients.openWindow(urlToOpen);
        })
    );
  }
});
