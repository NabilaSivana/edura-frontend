// src/sw.js
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

// Precache file hasil build
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache Google Fonts (jarang berubah)
registerRoute(
  ({ url }) => url.origin.startsWith('https://fonts.googleapis.com') ||
              url.origin.startsWith('https://fonts.gstatic.com'),
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Cache CDN (cdnjs, jsdelivr)
registerRoute(
  ({ url }) => url.hostname.includes('cdnjs.cloudflare.com') ||
               url.hostname.includes('jsdelivr.net'),
  new StaleWhileRevalidate({
    cacheName: 'cdn-cache',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// Cache CSS dan JS lokal
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Cache gambar lokal (jika kamu punya)
registerRoute(
  ({ request }) => request.destination === 'public',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// Offline fallback bisa ditambahkan jika dibutuhkan (opsional)
// self.addEventListener('fetch', (event) => {...})
