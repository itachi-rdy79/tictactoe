/* =========================================================================
   GAP Arcade — PWA Offline Service Worker
   Caches all essential game assets, styles, logic, and offline data
   ========================================================================= */

const CACHE_NAME = "gap-arcade-v59.0";
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./data/stills/index.json"
];

// 1. Install & Pre-cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[GAP SW] Precache warning:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate & Clean Outdated Caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            console.log("[GAP SW] Removing stale cache:", k);
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch — Cache-First for static assets, network fallback + runtime caching
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // Skip caching non-http/https (e.g. chrome-extension)
  if (!url.protocol.startsWith("http")) return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate)
        fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache
      return fetch(e.request).then((res) => {
        if (!res || res.status !== 200) return res;
        // Cache same-origin responses
        if (res.type === "basic" || res.type === "cors") {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        }
        return res;
      }).catch(() => {
        // Fallback for navigation
        if (e.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
