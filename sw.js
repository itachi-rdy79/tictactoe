/* =========================================================================
   GAP Arcade — PWA Offline Service Worker (v60.0 Engine Upgrade)
   Caches all 10 games, versioned resources, nested games, offline
   dictionaries, and local media for 100% offline operation.
   ========================================================================= */

const CACHE_NAME = "gap-arcade-v60.0";
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./style.css?v=60.0",
  "./script.js",
  "./script.js?v=60.0",
  "./manifest.json",
  "./data/wordle-words.js",
  "./data/wordle-words.js?v=60.0",
  "./data/tollywood-movies.json",
  "./data/stills/index.json",
  "./data/daily/meta-data.json",
  "./data/daily/1.jpg",
  "./data/daily/2.jpg",
  "./data/daily/3.jpg",
  "./data/daily/4.jpg",
  "./data/daily/5.jpg",
  "./assets/itachi-bg.png",
  "./assets/scenic_bg.jpg",

  // Bundled PC Guesser offline stills
  "./data/stills/1610/meta-data.json",
  "./data/stills/1610/1.jpg",
  "./data/stills/1610/2.jpg",
  "./data/stills/1610/3.jpg",
  "./data/stills/1610/4.jpg",
  "./data/stills/1610/5.jpg",
  "./data/stills/1609/meta-data.json",
  "./data/stills/1609/1.jpg",
  "./data/stills/1609/2.jpg",
  "./data/stills/1609/3.jpg",
  "./data/stills/1609/4.jpg",
  "./data/stills/1609/5.jpg",
  "./data/stills/1608/meta-data.json",
  "./data/stills/1608/1.jpg",
  "./data/stills/1608/2.jpg",
  "./data/stills/1608/3.jpg",
  "./data/stills/1608/4.jpg",
  "./data/stills/1608/5.jpg",

  // Palace Escape (Nested Game)
  "./palace-escape/",
  "./palace-escape/index.html",
  "./palace-escape/css/style.css",
  "./palace-escape/css/theme-adapter.css",
  "./palace-escape/css/v1x.css",
  "./palace-escape/js/main.js",
  "./palace-escape/js/game.js",
  "./palace-escape/js/renderer.js",
  "./palace-escape/js/entities.js",
  "./palace-escape/js/levels.js",
  "./palace-escape/js/ui.js",
  "./palace-escape/js/audio.js",
  "./palace-escape/js/config.js",
  "./palace-escape/js/input.js",
  "./palace-escape/js/maze.js",
  "./palace-escape/js/walk.js",
  "./palace-escape/js/herolimbs.js",
  "./palace-escape/js/icons.js",
  "./palace-escape/js/share.js",
  "./palace-escape/js/smash.js",
  "./palace-escape/js/train.js",
  "./palace-escape/js/aasthi.js",
  "./palace-escape/assets/hero1.png",
  "./palace-escape/assets/hero2.png",
  "./palace-escape/assets/hero4.png",
  "./palace-escape/assets/hero5.png",
  "./palace-escape/assets/hero10.png",
  "./palace-escape/assets/creature.png",
  "./palace-escape/assets/crocodile.png",
  "./palace-escape/assets/shawlman.png",
  "./palace-escape/assets/aasthipathralucard.jpg",
  "./palace-escape/assets/level20 success image.png",

  // Pass It On (Nested Game)
  "./pass-it-on/",
  "./pass-it-on/index.html",
  "./pass-it-on/a-tfi-reward.1954e6dd.js",
  "./pass-it-on/a-baby.4f022132.png",
  "./pass-it-on/a-font-patrick-hand.2fed3514.woff2",
  "./pass-it-on/a-sprite-cop.8ea47034.webp",
  "./pass-it-on/a-sprite-cop3.d43f7614.webp",
  "./pass-it-on/a-sprite-crow.d9626ba3.webp",
  "./pass-it-on/a-sprite-dog.c5470c8c.webp",
  "./pass-it-on/a-sprite-mach.c706f850.webp",
  "./pass-it-on/a-sprite-man.90fd97ce.webp",
  "./pass-it-on/a-sprite-tribal.fee10ba9.webp",
  "./pass-it-on/a-sprite-woman.85cc15bb.webp",
  "./pass-it-on/a-doodle-crow.6f5296e9.webp",
  "./pass-it-on/a-doodle-dog.29b8a6d2.webp",
  "./pass-it-on/a-doodle-mach.b418cc1d.webp",
  "./pass-it-on/a-doodle-man.39a2e526.webp",
  "./pass-it-on/a-doodle-tribal.be8cbcc5.webp",
  "./pass-it-on/a-doodle-woman.bcec6bd8.webp",
  "./pass-it-on/a-caught.a03bfc2d.mp3",
  "./pass-it-on/a-claim.cfcb276e.mp3",
  "./pass-it-on/a-music.e9c23339.mp3",
  "./pass-it-on/a-pass1.b146aec8.mp3",
  "./pass-it-on/a-pass2.a3344b28.mp3",
  "./pass-it-on/a-start.4d0d44c1.mp3",
  "./pass-it-on/a-success.8b6e1648.mp3",
  "./pass-it-on/a-whoosh.03b93988.mp3"
];

// 1. Install & Pre-cache
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        PRECACHE_ASSETS.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.warn(`[GAP SW] Could not pre-cache ${asset}:`, err);
          });
        })
      );
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

// 3. Fetch — Cache-First with ignoreSearch & Runtime Fallback
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // Skip caching non-http/https (e.g. chrome-extension)
  if (!url.protocol.startsWith("http")) return;

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-while-revalidate for same-origin
        if (url.origin === self.location.origin) {
          fetch(e.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
            }
          }).catch(() => {});
        }
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache
      return fetch(e.request).then((res) => {
        if (!res || res.status !== 200) return res;
        if (res.type === "basic" || res.type === "cors") {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        }
        return res;
      }).catch(() => {
        // Offline Fallback for Navigation
        if (e.request.mode === "navigate") {
          if (url.pathname.includes("/palace-escape")) {
            return caches.match("./palace-escape/index.html", { ignoreSearch: true });
          }
          if (url.pathname.includes("/pass-it-on")) {
            return caches.match("./pass-it-on/index.html", { ignoreSearch: true });
          }
          return caches.match("./index.html", { ignoreSearch: true });
        }
      });
    })
  );
});
