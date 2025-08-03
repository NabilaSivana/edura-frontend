// Updated service worker with better error handling and correct file paths

import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate, NetworkOnly } from "workbox-strategies";

precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

const CACHE_NAMES = {
    STATIC: "edura-static-v1",
    API: "edura-api-v1", 
    IMAGES: "edura-images-v1",
    FONTS: "edura-fonts-v1",
    CDN: "edura-cdn-v1",
    OFFLINE_PAGES: "edura-offline-v1"
};

// Cache strategies (keeping your existing ones)
registerRoute(
    ({ url }) => url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com",
    new CacheFirst({
        cacheName: CACHE_NAMES.FONTS,
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60, purgeOnQuotaError: true })
        ]
    })
);

registerRoute(
    ({ url }) => url.hostname.includes("cdnjs.cloudflare.com") || 
                 url.hostname.includes("jsdelivr.net") || 
                 url.hostname.includes("unpkg.com"),
    new StaleWhileRevalidate({
        cacheName: CACHE_NAMES.CDN,
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60, purgeOnQuotaError: true })
        ]
    })
);

registerRoute(
    ({ request }) => request.destination === "script" || request.destination === "style",
    new StaleWhileRevalidate({
        cacheName: CACHE_NAMES.STATIC,
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 7 * 24 * 60 * 60, purgeOnQuotaError: true })
        ]
    })
);

registerRoute(
    ({ request }) => request.destination === "image" || request.url.includes("/public/"),
    new CacheFirst({
        cacheName: CACHE_NAMES.IMAGES,
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60, purgeOnQuotaError: true })
        ]
    })
);

registerRoute(
    ({ url, request }) => url.pathname.startsWith("/api/") && 
                          (url.pathname.includes("/courses") || 
                           url.pathname.includes("/profile") || 
                           url.pathname.includes("/student/courses") || 
                           url.pathname.includes("/flashcards") || 
                           url.pathname.includes("/recommendations")),
    new NetworkFirst({
        cacheName: CACHE_NAMES.API,
        networkTimeoutSeconds: 3,
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
                headers: { "Content-Type": "application/json" }
            }),
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60, purgeOnQuotaError: true })
        ]
    })
);

registerRoute(
    ({ url }) => url.pathname.includes("/quiz") || url.pathname.includes("/final-exam"),
    new NetworkFirst({
        cacheName: "edura-quiz-v1",
        networkTimeoutSeconds: 5,
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 2 * 60 * 60, purgeOnQuotaError: true })
        ]
    })
);

registerRoute(
    ({ request }) => request.method !== "GET",
    new NetworkOnly()
);

const navigationHandler = new NavigationRoute(
    new NetworkFirst({
        cacheName: CACHE_NAMES.OFFLINE_PAGES,
        plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })]
    })
);

// Helper function to safely cache files
async function safeCacheFiles(cacheName, urls) {
    try {
        const cache = await caches.open(cacheName);
        const results = await Promise.allSettled(
            urls.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        await cache.put(url, response);
                        console.log(`✅ SW: Cached ${url}`);
                        return { url, success: true };
                    } else {
                        console.warn(`⚠️ SW: Failed to fetch ${url} - Status: ${response.status}`);
                        return { url, success: false, error: `Status: ${response.status}` };
                    }
                } catch (error) {
                    console.warn(`⚠️ SW: Error caching ${url}:`, error.message);
                    return { url, success: false, error: error.message };
                }
            })
        );
        
        const successful = results.filter(r => r.value?.success).length;
        const failed = results.filter(r => !r.value?.success).length;
        
        console.log(`📦 SW: Cache operation complete - ${successful} successful, ${failed} failed`);
        return results;
    } catch (error) {
        console.error(`❌ SW: Cache operation failed:`, error);
        throw error;
    }
}

// Offline queue processing (keeping your existing implementation)
async function processOfflineQueue() {
    try {
        console.log("🔄 SW: Processing offline queue");
        const db = await openIndexedDB();
        const queue = await getOfflineQueue(db);
        
        for (const item of queue) {
            try {
                await processQueueItem(item);
                await removeFromQueue(db, item.id);
                console.log("✅ SW: Processed queue item:", item.id);
            } catch (error) {
                console.error("❌ SW: Failed to process queue item:", error);
                if (item.retries < 3) {
                    await updateQueueItem(db, { ...item, retries: item.retries + 1 });
                } else {
                    await removeFromQueue(db, item.id);
                }
            }
        }
    } catch (error) {
        console.error("❌ SW: Background sync failed:", error);
    }
}

async function processQueueItem(item) {
    const { action, data } = item;
    switch (action) {
        case "submit_quiz":
            return fetch("/api/student/quiz/submit", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        case "update_checkpoint":
            return fetch(`/api/student/courses/${data.courseId}/checkpoint`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
        case "sync_profile":
            return fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}

// IndexedDB helper functions (keeping your existing ones)
async function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = self.indexedDB.open("EduraAppDB", 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("offline_queue")) {
                const store = db.createObjectStore("offline_queue", { keyPath: "id", autoIncrement: true });
                store.createIndex("timestamp", "timestamp", { unique: false });
            }
        };
    });
}

async function getOfflineQueue(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["offline_queue"], "readonly");
        const request = transaction.objectStore("offline_queue").getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function removeFromQueue(db, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["offline_queue"], "readwrite");
        const request = transaction.objectStore("offline_queue").delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function updateQueueItem(db, item) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["offline_queue"], "readwrite");
        const request = transaction.objectStore("offline_queue").put(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(cacheNames.map(name => caches.delete(name)));
}

// Register navigation route
registerRoute(navigationHandler);

// Event listeners
self.addEventListener("sync", (event) => {
    if (event.tag === "offline-sync") {
        event.waitUntil(processOfflineQueue());
    }
});

self.addEventListener("push", (event) => {
    if (!event.data) return;
    
    try {
        const data = event.data.json();
        const options = {
            body: data.body || "Anda memiliki notifikasi baru",
            icon: "/logo2.png", // Updated to match your actual icon
            badge: "/logo2.png", // Updated to match your actual icon
            tag: data.tag || "general",
            data: data.data || {},
            actions: data.actions || [],
            requireInteraction: data.requireInteraction || false,
            silent: data.silent || false,
            vibrate: data.vibrate || [200, 100, 200]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || "Edura App", options)
        );
    } catch (error) {
        console.error("❌ SW: Push notification error:", error);
    }
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url || "/";
    
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
            for (const client of clients) {
                if (client.url === url && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

self.addEventListener("activate", (event) => {
    const expectedCaches = Object.values(CACHE_NAMES);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!expectedCaches.includes(cacheName)) {
                        console.log("🗑️ SW: Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("quotaexceeded", (event) => {
    console.warn("⚠️ SW: Cache quota exceeded, cleaning up...");
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAMES.IMAGES).then((cache) => {
                return cache.keys().then((keys) => {
                    const keysToDelete = keys.slice(0, Math.floor(keys.length / 2));
                    return Promise.all(keysToDelete.map((key) => cache.delete(key)));
                });
            }),
            caches.delete(CACHE_NAMES.API)
        ])
    );
});

self.addEventListener("install", (event) => {
    console.log("🔧 SW: Installing...");
    self.skipWaiting();
    
    // Updated to cache files that actually exist
    const essentialFiles = [
        "/", // Main page
        "/logo2.png" // Your actual logo file
    ];
    
    // Optional files that might not exist
    const optionalFiles = [
        "/offline.html"
    ];
    
    event.waitUntil(
        Promise.all([
            // Cache essential files (will fail installation if these don't exist)
            safeCacheFiles(CACHE_NAMES.OFFLINE_PAGES, essentialFiles),
            // Try to cache optional files (won't fail installation)
            safeCacheFiles(CACHE_NAMES.OFFLINE_PAGES, optionalFiles).catch((error) => {
                console.warn("⚠️ SW: Some optional files couldn't be cached:", error);
            })
        ])
    );
});

self.addEventListener("message", (event) => {
    if (!event.data || !event.data.type) return;
    
    switch (event.data.type) {
        case "SKIP_WAITING":
            self.skipWaiting();
            break;
        case "GET_VERSION":
            event.ports[0].postMessage({ version: "1.0.0" });
            break;
        case "CLEAR_CACHE":
            event.waitUntil(clearAllCaches());
            break;
        case "FORCE_SYNC":
            event.waitUntil(processOfflineQueue());
            break;
        default:
            console.log("SW: Unknown message type:", event.data.type);
    }
});

console.log("✅ SW: Service Worker loaded successfully");