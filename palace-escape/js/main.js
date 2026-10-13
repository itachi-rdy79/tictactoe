import { ASSETS, ASSET_FALLBACKS, AUDIO, AUDIO_CORE, STORAGE_KEY } from "./config.js";
import { Renderer } from "./renderer.js";
import { InputManager } from "./input.js";
import { AudioManager } from "./audio.js";
import { UIManager } from "./ui.js";
import { Game } from "./game.js";
import { shareCertificate } from "./share.js";

const $ = (id) => document.getElementById(id);

// ---------- persistence ----------

const storage = {
  data: { unlocked: 1, completed: false, seenPowers: {}, best: {}, muted: false, name: "", completionTimes: {}, aasthiUnlocked: false, aasthiMilestone: 0, aasthiTotal: 0, aasthiAwards: {}, aasthiBlock: null },
  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      this.data = { ...this.data, ...saved };
      this.data.unlocked = Math.max(1, this.data.unlocked | 0);
      if (this.data.completed && !this.data.aasthiUnlocked) {
        this.data.aasthiUnlocked = true;
        this.data.aasthiMilestone = Math.max(1, this.data.aasthiMilestone || 0);
      }
      // Single-card saves become the first entry of the cumulative total.
      if ("aasthiAmount" in this.data) {
        const level = this.data.aasthiLevel || Math.max(1, this.data.aasthiMilestone || 1) * 10;
        if (this.data.aasthiUnlocked && this.data.aasthiAmount > 0 && !Object.keys(this.data.aasthiAwards).length) {
          this.data.aasthiAwards = { [level]: { amount: this.data.aasthiAmount } };
          this.data.aasthiTotal = this.data.aasthiAmount;
          this.data.aasthiLevel = level;
        }
        delete this.data.aasthiAmount;
      }
    } catch {
      /* private mode / corrupted data: keep defaults */
    }
  },
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      /* storage unavailable */
    }
  },
};

const photoStore = {
  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("palaceEscape", 1);
      request.onupgradeneeded = () => request.result.createObjectStore("photos");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  async set(blob) {
    const db = await this.open();
    await new Promise((resolve, reject) => {
      const tx = db.transaction("photos", "readwrite");
      tx.objectStore("photos").put(blob, "aasthi-photo");
      tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
    });
    db.close();
  },
  async get() {
    const db = await this.open();
    const value = await new Promise((resolve, reject) => {
      const req = db.transaction("photos", "readonly").objectStore("photos").get("aasthi-photo");
      req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
    });
    db.close();
    return value;
  },
};

// ---------- assets ----------

function loadImage(src, fallback) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (fallback && img.src.indexOf(fallback) === -1) {
        img.src = fallback;
      } else {
        resolve(null);
      }
    };
    img.src = src;
  });
}

/** Pictures the game needs once a level starts (everything except the menu picture and the milestone card art,
 *  which the cards load themselves when they are shown). */
const SPRITE_KEYS = ["hero", "heroPowered", "heroine", "heroine2", "heroine3", "shawlMan", "crocodile", "creature"];

async function loadImages(images, keys, onProgress = () => {}) {
  let done = 0;
  await Promise.all(
    keys.map(async (key) => {
      images[key] = await loadImage(ASSETS[key], ASSET_FALLBACKS[key]);
      onProgress(++done / keys.length);
    }),
  );
  return images;
}

/** Resolves after the browser has painted once (so a tap shows its feedback before heavy work begins). */
const nextPaint = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

// ---------- device / layout ----------

const touchQuery = window.matchMedia("(pointer: coarse)");
let isTouch = touchQuery.matches || navigator.maxTouchPoints > 0;

function isPortrait() {
  return window.innerHeight > window.innerWidth * 1.05;
}

function applyBodyClasses() {
  document.body.classList.toggle("touch", isTouch);
  document.body.classList.toggle("portrait", isPortrait());
  document.body.classList.toggle("landscape", !isPortrait());
}

// ---------- boot ----------

async function boot() {
  storage.load();
  applyBodyClasses();

  const audio = new AudioManager(storage.data.muted);
  audio.preload(AUDIO);
  let game;
  // The in-game pictures, loaded once the menu is up and the page has finished loading.
  const assets = { ready: false, promise: null, done: null };
  assets.promise = new Promise((resolve) => (assets.done = resolve));

  const ui = new UIManager({
    storage,
    handlers: {
      onPlay: async (n) => {
        audio.unlock();
        audio.play("click");
        assets.warmAudio?.();
        if (!assets.ready) {
          ui.setPlayBusy(true);
          await assets.promise;
          ui.setPlayBusy(false);
        }
        await nextPaint(); // let the tap show its feedback first; the heavy level setup follows
        game.startLevel(n);
      },
      onRestart: async () => {
        await nextPaint();
        game.restartLevel();
      },
      onNext: async () => {
        await nextPaint();
        game.nextLevel();
      },
      onMenu: () => {
        audio.play("click");
        game.toMenu();
      },
      onPause: () => {
        audio.play("click");
        game.pause();
      },
      onResume: () => {
        audio.play("click");
        game.resume();
      },
      onInGameLegend: () => {
        audio.play("click");
        const paused = game.pause({ silent: true });
        ui.showLegend(() => {
          if (paused) game.resume();
        }, game.trap ?? null);
      },
      onBachelorCard: () => {
        audio.play("click");
        const paused = game.pause({ silent: true });
        ui.showBachelorCard(() => {
          if (paused) game.resume();
        });
      },
      onToggleMute: () => {
        storage.data.muted = !storage.data.muted;
        storage.save();
        audio.setMuted(storage.data.muted);
        ui.setMuted(storage.data.muted);
        audio.unlock();
        audio.play("click");
      },
      onShare: async (canvas) => {
        audio.play("click");
        const result = await shareCertificate(canvas);
        if (result === "downloaded") ui.toast("Saved! Share it with your friends 📸");
      },
      onPhoto: async (file) => {
        try { await photoStore.set(file); } catch { ui.toast("Photo will remain available in this session."); }
      },
    },
  });
  ui.setMuted(storage.data.muted);
  ui.setImages();
  try { ui.setPhoto(await photoStore.get()); } catch { /* IndexedDB unavailable */ }

  // The menu needs only its own picture. Everything else loads once the menu is showing.
  const images = {};
  await loadImages(images, ["heroMenu"], (p) => ui.setLoading(p));
  const renderer = new Renderer($("game"), images);

  const layout = {
    isPortrait,
    refit() {
      applyBodyClasses();
      const stage = $("stage");
      const cs = getComputedStyle(stage);
      const w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 12;
      const h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 12;
      renderer.fit(w, h, { pan: isTouch && isPortrait() });
    },
  };

  const input = new InputManager({
    swipeArea: $("stage"),
    onPress: (dir) => {
      game.hero?.queue(dir);
      game.notePress();
    },
    onAny: () => game.requestSkip(),
    onKey: (e) => {
      if (e.code === "Escape" || e.code === "KeyP") {
        if (ui.escape()) return true;
        if (game.state === "PLAYING" || game.state === "LEVEL_START") {
          game.pause();
          return true;
        }
        return false;
      }
      if (e.code === "Enter" || e.code === "Space") {
        if (document.activeElement instanceof HTMLButtonElement) return false;
        return ui.primaryAction();
      }
      if (e.code === "KeyM") {
        ui.h.onToggleMute();
        return true;
      }
      return false;
    },
  });

  game = new Game({ renderer, ui, audio, input, storage, layout });

  const applyResize = () => {
    const wasPortrait = game.portrait;
    layout.refit();
    if (game.level && game.state === "LEVEL_START" && wasPortrait !== isPortrait() && !ui.topModal) {
      game.startLevel(game.levelNumber, { retry: true });
    }
    // Resizing a canvas blanks it. Paint the board again straight away, before the browser shows a frame,
    // so a real resize never flashes an empty screen.
    if (game.level && game.state !== "MENU") game.renderer.draw(game, game.t);
  };
  // Phones fire bursts of resize events (in-app browser toolbars sliding in and out, the keyboard, rotation):
  // wait until they settle and handle them once.
  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyResize, 90);
  };
  new ResizeObserver(onResize).observe($("stage"));
  window.addEventListener("orientationchange", () => setTimeout(onResize, 150));

  window.addEventListener(
    "touchstart",
    () => {
      if (!isTouch) {
        isTouch = true;
        layout.refit();
      }
    },
    { passive: true, once: true },
  );
  const unlockAudio = () => audio.unlock();
  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) game.pause();
  });
  document.addEventListener("gesturestart", (e) => e.preventDefault());

  const loop = (now) => {
    game.frame(now);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  ui.hideLoading();
  ui.showMenu();

  // ---- after the menu is on screen: fetch the rest quietly, in order of need ----
  const idle = window.requestIdleCallback ? (fn) => requestIdleCallback(fn, { timeout: 1500 }) : (fn) => setTimeout(fn, 300);
  const afterLoad = (fn) => (document.readyState === "complete" ? fn() : window.addEventListener("load", fn, { once: true }));
  // Waiting for the page's load event keeps these downloads out of the "page load time" that analytics report.
  // The first ~1.3 MB of sound is fetched once the visitor shows they are staying (a first tap, key press or scroll),
  // or after a few quiet seconds. People who only glance at the page and leave never pay for it.
  const warm = () => audio.fetchClips(AUDIO_CORE);
  assets.warmAudio = warm;
  for (const ev of ["pointerdown", "keydown", "touchstart", "wheel"]) window.addEventListener(ev, warm, { once: true, passive: true });
  setTimeout(warm, 6000);
  afterLoad(() => {
    loadImages(images, SPRITE_KEYS).then(() => {
      assets.ready = true;
      assets.done();
      idle(() => {
        audio.ensureContext(); // created quietly now (it starts suspended); the first tap only has to resume it
        ui.setLateImages();
        // build the first level's maze while the player reads the menu, so tapping Play is instant
        setTimeout(() => game.prepareLevel(Math.max(1, storage.data.unlocked || 1)), 1200);
      });
    });
  });
}

boot().catch((err) => {
  console.error(err);
  document.getElementById("screen-loading")?.classList.add("show");
  document.querySelector(".loading-text").textContent = "Couldn't open the palace. Please refresh the page.";
});
