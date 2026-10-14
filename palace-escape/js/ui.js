import { ASSETS, CHASER_INFO, POWER_INFO, FOLLOW_LINKS, FOLLOW_FROM_LEVEL } from "./config.js";
import { makeIcon } from "./renderer.js";
import { renderCertificate } from "./share.js";
import { formatCrore } from "./aasthi.js";
import { icon, TRAP_ICON, stripEmoji } from "./icons.js";

const $ = (id) => document.getElementById(id);

const TRAP_BRIEFS = {
  train: ["train", "TRAIN GUARD", ["A train patrols the exit track — if it hits you, you're out.", "Keep off the rails while it passes.", "Find the hidden switch to divert it and open the path."]],
  well: ["well", "SUDDEN WELLS", ["The floor can give way under you at any moment — and you will fall.", "Someone climbs out after you and knocks out a chaser (two, from level 13).", "Once she joins you, lead her to the exit."]],
  water: ["water", "FLOODED MAZE", ["The palace is completely flooded. Stay away from the crocodile.", "If it enters your safe zone, you have 3 seconds to move away.", "Use that time, or it will jump and catch you."]],
  lights: ["lights", "LIGHTS OUT", ["Your vision is limited to a small area around you.", "You cannot see the maze far ahead.", "Explore carefully and remember the paths you've taken."]],
  reverse: ["reverse", "REVERSED CONTROLS", ["Your movement controls are reversed.", "Stay calm and adjust your direction to escape."]],
  rotate: ["rotate", "MIRROR MAZE", ["The maze flips or mirrors every 10 seconds.", "Your position stays the same relative to the maze.", "Reorient yourself quickly after every flip."]],
  hiddenDoor: ["lock", "HIDDEN EXIT", ["There is no visible exit door.", "The crocodile is holding a hostage. Grab a knife and take it out.", "Free her, then lead her to the exit — your powers protect her too."]],
  twoDoors: ["twoDoors", "TWIN DOORS", ["Two identical doors. Someone is waiting behind the first one you open.", "Hear her out, then take her through the other door.", "You can skip the conversation after the first time."]],
  null: ["sparkles", "CLEAR PASSAGE", ["No special trap is active in this palace.", "All chasers are still in play.", "Find the glowing exit door."]],
};

const trapBrief = (trap) => TRAP_BRIEFS[trap?.id || "null"];

const pointItems = (points) => points.map((point) => {
  const li = document.createElement("li");
  li.textContent = point;
  return li;
});

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** DOM overlays, HUD and cards. Gameplay state lives in Game; this only renders it. */
export class UIManager {
  constructor({ handlers, storage }) {
    this.h = handlers;
    this.storage = storage;
    this.iconUrls = {};
    for (const type of ["eye", "knife", "boost"]) this.iconUrls[type] = makeIcon(type, 96).toDataURL();
    this.powerKey = "";
    this.bannerTimer = null;
    this.modalStack = [];
    this.cdTimers = [];
    this.bind();
    this.buildLegend();
    this.bindIcons();
    this.buildProgress();
    this.buildFollow();
  }

  /** The quiet "follow the makers" row that sits under the buttons on the caught and level-complete cards. */
  buildFollow() {}
  /** Fills every [data-icon] hook with its line icon (so the HTML carries no emoji). */
  bindIcons(root = document) {
    root.querySelectorAll("[data-icon]").forEach((el) => {
      if (el.dataset.iconDone) return;
      el.dataset.iconDone = "1";
      el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon));
    });
  }

  /** Ten dots = the ten levels of the current Aasthi block. */
  buildProgress() {
    const box = $("hud-progress");
    box.innerHTML = "";
    for (let i = 0; i < 10; i++) box.appendChild(document.createElement("i"));
  }

  bind() {
    const h = this.h;
    $("btn-play").onclick = () => h.onPlay(this.storage.data.unlocked);
    $("btn-start-over").onclick = () => h.onPlay(1);
    $("btn-menu-bachelor-card").onclick = () => this.showBachelorCard();
    $("btn-howto").onclick = () => this.openModal("modal-howto");
    $("btn-menu-legend").onclick = () => this.showLegend(null);
    $("btn-mute-menu").onclick = () => h.onToggleMute();
    $("btn-mute-pause").onclick = () => h.onToggleMute();
    $("btn-legend").onclick = () => h.onInGameLegend();
    $("btn-bachelor-card").onclick = () => h.onBachelorCard();
    $("btn-pause").onclick = () => h.onPause();
    $("btn-resume").onclick = () => h.onResume();
    $("btn-pause-restart").onclick = () => h.onRestart();
    $("btn-pause-menu").onclick = () => h.onMenu();
    $("btn-restart").onclick = () => h.onRestart();
    $("btn-caught-menu").onclick = () => h.onMenu();
    $("btn-next").onclick = () => h.onNext();
    $("btn-play-from-start").onclick = () => h.onPlay(1);
    $("btn-game-end-menu").onclick = () => h.onMenu();
    $("btn-powers-go").onclick = () => this.closePowers();
    $("btn-trap-brief-go").onclick = () => this.closeTrapBrief();
    $("btn-keep-going").onclick = () => h.onNext();
    $("btn-share").onclick = () => this.shareCard("final-card-canvas", "name-input");
    $("btn-bachelor-share").onclick = () => this.shareCard("bachelor-card-canvas", "bachelor-name-input");
    $("btn-bachelor-close").onclick = () => this.closeBachelorCard();
    $("btn-hero2-mode-go").onclick = () => this.closeHero2Mode();
    document.querySelectorAll(".card-name-input").forEach((input) => {
      input.oninput = () => this.setCardName(input.value);
      input.form.onsubmit = (e) => {
        e.preventDefault();
        input.blur();
      };
    });
    document.querySelectorAll(".card-photo-input").forEach((input) => {
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
          input.value = "";
          this.toast("Use a PNG, JPEG or WebP under 5 MB.");
          return;
        }
        this.setPhoto(file);
        await h.onPhoto?.(file);
      };
    });
    document.querySelectorAll("[data-close]").forEach((btn) => {
      btn.setAttribute("data-primary", "");
      btn.onclick = () => this.closeModal(btn.closest(".overlay").id);
    });
    document.querySelectorAll(".overlay").forEach((ov) => {
      ov.addEventListener("pointerdown", (e) => {
        if (e.target === ov && ov.querySelector("[data-close]")) this.closeModal(ov.id);
      });
    });
  }

  /** Only the menu picture at start-up: everything else is loaded after the menu is on screen. */
  setImages() {
    $("menu-hero").src = ASSETS.heroMenu;
  }

  /** Pictures in cards and help screens that nobody sees yet. */
  setLateImages() {
    $("hero2-mode-art").src = ASSETS.heroPowered;
    $("powers-hero2").src = ASSETS.heroPowered;
  }

  /** While the game's pictures are still arriving (slow connection) the Play button says so. */
  setPlayBusy(busy) {
    const btn = $("btn-play");
    const label = $("btn-play-label");
    if (busy) {
      this.playLabelSaved = label.textContent;
      label.textContent = "LOADING…";
      btn.disabled = true;
    } else {
      if (this.playLabelSaved != null) label.textContent = this.playLabelSaved;
      this.playLabelSaved = null;
      btn.disabled = false;
    }
  }

  setPhoto(blob) {
    if (!blob) return;
    if (this.photoUrl) URL.revokeObjectURL(this.photoUrl);
    this.photoUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      if (img.src !== this.photoUrl) return;
      this.photoImg = img;
      this.renderCards();
    };
    img.src = this.photoUrl;
  }

  setCardName(value) {
    this.storage.data.name = value.replace(/\s+/g, " ").trim().slice(0, 24);
    this.storage.save();
    this.renderCards();
  }

  /** Draws the Aasthi card into a canvas from the saved name, photo, milestone avatar and reward. */
  renderCard(canvasId) {
    return renderCertificate($(canvasId), {
      name: this.storage.data.name || "",
      heroSrc: this.milestoneAvatar(this.storage.data.aasthiMilestone || 1),
      amount: this.storage.data.aasthiTotal,
      level: this.storage.data.aasthiLevel,
      photoImg: this.photoImg,
    });
  }

  renderCards() {
    if ($("card-final").classList.contains("show")) this.renderCard("final-card-canvas");
    if ($("modal-bachelor-card").classList.contains("show")) this.renderCard("bachelor-card-canvas");
  }

  async shareCard(canvasId, nameInputId) {
    if (!this.storage.data.name) {
      const input = $(nameInputId);
      input.focus();
      input.animate(
        [{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
        { duration: 220 },
      );
      this.toast("Enter your name to claim your Aasthi");
      return;
    }
    this.h.onShare(await this.renderCard(canvasId));
  }

  updateAasthiAccess() {
    const unlocked = !!this.storage.data.aasthiUnlocked;
    for (const id of ["btn-menu-bachelor-card", "btn-bachelor-card"]) $(id).classList.toggle("hidden", !unlocked);
  }

  milestoneAvatar(milestone) {
    return ASSETS[`heroMilestone${Math.min(5, Math.max(1, milestone))}`] || ASSETS.heroFinal;
  }

  setLoading(progress) {
    $("loading-progress").style.width = `${Math.round(progress * 100)}%`;
  }

  hideLoading() {
    $("screen-loading").classList.remove("show");
  }

  // ---------- menu ----------

  showMenu() {
    this.hideCoach();
    this.closeAllModals();
    $("hud").classList.add("hidden");
    $("screen-menu").classList.add("show");
    $("btn-play").disabled = !!this.playLabelSaved; // enabled now that the game script is running
    const { unlocked } = this.storage.data;
    $("btn-play-label").textContent = unlocked > 1 ? `CONTINUE · LEVEL ${unlocked}` : "PLAY";
    $("btn-start-over").classList.toggle("hidden", unlocked <= 1);
    this.updateAasthiAccess();
  }

  showGame() {
    const stage = $("stage");
    stage.classList.remove("enter");
    void stage.offsetWidth;
    stage.classList.add("enter");
    $("screen-menu").classList.remove("show");
    $("hud").classList.remove("hidden");
    this.updateAasthiAccess();
  }

  setMuted(muted) {
    document.querySelectorAll(".mute-toggle").forEach((b) => {
      b.innerHTML = `<span class="btn-ico">${icon(muted ? "soundOff" : "soundOn")}</span>${muted ? "Sound off" : "Sound on"}`;
    });
  }

  // ---------- modals ----------

  openModal(id) {
    $(id).classList.add("show");
    this.modalStack = this.modalStack.filter((m) => m !== id);
    this.modalStack.push(id);
    $(id).querySelector("[data-primary]")?.focus({ preventScroll: true });
  }

  closeModal(id) {
    $(id).classList.remove("show");
    this.modalStack = this.modalStack.filter((m) => m !== id);
    if (id === "modal-legend" && this.onLegendClose) {
      const cb = this.onLegendClose;
      this.onLegendClose = null;
      cb();
    }
  }

  closeAllModals() {
    for (const id of [...this.modalStack]) $(id).classList.remove("show");
    this.modalStack = [];
    this.onLegendClose = null;
    this.powersDone = null;
    this.bachelorCardDone = null;
    this.hero2ModeDone = null;
  }

  get topModal() {
    return this.modalStack[this.modalStack.length - 1] || null;
  }

  /** Triggers the primary button of whatever is on top (Enter / Space). */
  primaryAction() {
    const top = this.topModal;
    let el = top ? $(top) : null;
    if (!el) el = [...document.querySelectorAll(".overlay.show")].pop() || null;
    const btn = el?.querySelector(".final-step:not(.hidden) [data-primary], [data-primary]");
    if (btn && btn.offsetParent !== null) {
      btn.click();
      return true;
    }
    return false;
  }

  escape() {
    const top = this.topModal;
    if (!top) return false;
    if (top === "modal-powers") this.closePowers();
    else if (top === "modal-bachelor-card") this.closeBachelorCard();
    else if (top === "modal-hero2-mode") this.closeHero2Mode();
    else if (top === "modal-pause") this.h.onResume();
    else this.closeModal(top);
    return true;
  }

  /** In-game, the legend also explains the current level's trap; from the menu there is no trap to show. */
  showLegend(onClose, trap) {
    this.onLegendClose = onClose;
    const row = $("legend-trap");
    row.classList.toggle("hidden", trap === undefined);
    if (trap !== undefined) {
      const [iconName, title, points] = trapBrief(trap);
      row.querySelector(".legend-trap-icon").innerHTML = icon(iconName);
      row.querySelector("b").textContent = `THIS ROUND · ${title}`;
      row.querySelector("ul").replaceChildren(...pointItems(points));
    }
    this.openModal("modal-legend");
  }

  buildLegend() {
    const grid = $("legend-grid");
    const items = [
      { img: ASSETS.hero, name: "HERO", text: "You. Transforms while a power is active." },
      ...["creature", "crocodile", "shawlMan"].map((type) => ({
        img: ASSETS[type],
        name: CHASER_INFO[type].name,
        text: CHASER_INFO[type].text,
      })),
      { door: true, name: "DOOR", text: "Reach it to finish the level." },
      ...["eye", "knife", "boost"].map((type) => ({
        icon: this.iconUrls[type],
        name: POWER_INFO[type].name,
        text: POWER_INFO[type].short,
      })),
    ];
    grid.innerHTML = "";
    for (const it of items) {
      const row = document.createElement("div");
      row.className = "legend-item";
      let visual;
      if (it.door) {
        visual = document.createElement("div");
        visual.className = "legend-swatch legend-door";
      } else {
        visual = document.createElement("img");
        visual.src = it.img || it.icon;
        visual.alt = "";
        if (it.img) visual.className = "character";
      }
      const copy = document.createElement("div");
      const b = document.createElement("b");
      b.textContent = it.name;
      const span = document.createElement("span");
      span.textContent = it.text;
      copy.append(b, span);
      row.append(visual, copy);
      grid.appendChild(row);
    }
  }

  showPowers(types, onDone) {
    const list = $("powers-list");
    list.innerHTML = "";
    for (const type of ["eye", "knife", "boost"]) {
      if (!types.includes(type)) continue;
      const row = document.createElement("div");
      row.className = "power-row";
      const img = document.createElement("img");
      img.src = this.iconUrls[type];
      img.alt = "";
      const copy = document.createElement("div");
      const b = document.createElement("b");
      b.textContent = POWER_INFO[type].name;
      const span = document.createElement("span");
      span.textContent = POWER_INFO[type].text;
      copy.append(b, span);
      row.append(img, copy);
      list.appendChild(row);
    }
    this.powersDone = onDone;
    $("btn-powers-go").textContent = onDone ? "LET'S GO" : "GOT IT";
    this.openModal("modal-powers");
  }

  // ---------- permanent bachelor card ----------

  showBachelorCard(onDone = null) {
    this.bachelorCardDone = onDone;
    $("bachelor-name-input").value = this.storage.data.name || "";
    this.openModal("modal-bachelor-card");
    this.renderCard("bachelor-card-canvas");
  }

  closeBachelorCard() {
    this.closeModal("modal-bachelor-card");
    const cb = this.bachelorCardDone;
    this.bachelorCardDone = null;
    cb?.();
  }

  showHero2Mode(onDone) {
    this.hero2ModeDone = onDone;
    this.openModal("modal-hero2-mode");
  }

  closeHero2Mode() {
    this.closeModal("modal-hero2-mode");
    const cb = this.hero2ModeDone;
    this.hero2ModeDone = null;
    cb?.();
  }

  closePowers() {
    this.closeModal("modal-powers");
    const cb = this.powersDone;
    this.powersDone = null;
    cb?.();
  }

  /** The friendly swipe coach on level 1: a gold fingertip slides in the direction the hero can run. */
  showCoach(dir, text, atTop = false) {
    let el = document.getElementById("coach");
    if (!el) {
      el = document.createElement("div");
      el.id = "coach";
      el.className = "coach";
      el.innerHTML = '<div class="coach-swipe"><i class="coach-trail"></i><i class="coach-finger"></i></div><p class="coach-text"></p>';
      document.body.appendChild(el);
    }
    const rot = { right: 0, down: 90, left: 180, up: -90 }[dir] ?? 0;
    el.querySelector(".coach-swipe").style.setProperty("--rot", `${rot}deg`);
    el.querySelector(".coach-text").textContent = text;
    el.classList.toggle("top", !!atTop);
    el.classList.add("show");
  }

  setCoachText(text) {
    const t = document.querySelector("#coach .coach-text");
    if (t) t.textContent = text;
  }

  hideCoach() {
    document.getElementById("coach")?.classList.remove("show");
  }

  /** A small "swipe or press any key to skip" note while a skippable conversation plays. */
  showSkipHint(show) {
    let el = document.getElementById("skip-hint");
    if (!el) {
      el = document.createElement("div");
      el.id = "skip-hint";
      el.className = "skip-hint";
      el.textContent = "Swipe or press any key to skip";
      document.body.appendChild(el);
    }
    el.classList.toggle("show", !!show);
  }

  showTrapBrief(trap, onDone, { lock = true } = {}) {
    const [iconName, title, points] = trapBrief(trap);
    $("trap-brief-icon").innerHTML = icon(iconName);
    $("trap-brief-title").textContent = title;
    $("trap-brief-lead").textContent = points[0];
    $("trap-brief-points").replaceChildren(...pointItems(points.slice(1)));
    this.trapBriefDone = onDone;
    this.openModal("modal-trap-brief");
    // Every round: the Start button fills up and unlocks after a few seconds, so the instructions get read.
    if (lock) this.lockTrapBrief(trap?.id ? 4 : 3);
    else this.unlockTrapBrief();
  }

  /** Start is ready immediately (used from level 10 on). */
  unlockTrapBrief() {
    const btn = $("btn-trap-brief-go");
    const label = btn.querySelector(".btn-label") || btn;
    clearInterval(this.lockTimer);
    if (this.briefLabel) label.textContent = this.briefLabel;
    btn.disabled = false;
    btn.classList.remove("locked", "ready");
    btn.focus({ preventScroll: true });
  }

  /** Locks the round's Start button for `seconds`, showing a fill and a "Start in N" count. */
  lockTrapBrief(seconds) {
    const btn = $("btn-trap-brief-go");
    const label = btn.querySelector(".btn-label") || btn;
    if (!this.briefLabel) this.briefLabel = label.textContent.trim();
    const original = this.briefLabel;
    const caps = original === original.toUpperCase();
    const text = (n) => (caps ? `START IN ${n}` : `Start in ${n}`);
    clearInterval(this.lockTimer);
    let left = seconds;
    btn.disabled = true;
    btn.classList.remove("ready");
    btn.classList.add("locked");
    btn.style.setProperty("--lock-ms", `${seconds * 1000}ms`);
    label.textContent = text(left);
    this.lockTimer = setInterval(() => {
      left -= 1;
      if (left > 0) {
        label.textContent = text(left);
        return;
      }
      clearInterval(this.lockTimer);
      label.textContent = original;
      btn.disabled = false;
      btn.classList.remove("locked");
      btn.classList.add("ready");
      setTimeout(() => btn.classList.remove("ready"), 1000);
      btn.focus({ preventScroll: true });
    }, 1000);
  }

  closeTrapBrief() {
    this.closeModal("modal-trap-brief");
    const cb = this.trapBriefDone;
    this.trapBriefDone = null;
    cb?.();
  }

  showPause() {
    this.openModal("modal-pause");
  }

  hidePause() {
    for (const id of ["modal-pause", "modal-legend", "modal-powers", "modal-trap-brief"]) {
      if (id === "modal-powers" && this.powersDone) continue;
      $(id).classList.remove("show");
      this.modalStack = this.modalStack.filter((m) => m !== id);
    }
  }

  // ---------- HUD ----------

  setHud({ level, time }) {
    if (level !== this.lastLevel) {
      this.lastLevel = level;
      $("hud-level").textContent = level;
      // Ten dots show how far through the current ten-level Aasthi block you are.
      const here = ((level - 1) % 10) + 1;
      [...$("hud-progress").children].forEach((dot, i) => {
        dot.className = i < here - 1 ? "done" : i === here - 1 ? "now" : "";
      });
    }
    const txt = formatTime(time);
    if (txt !== this.lastTime) {
      this.lastTime = txt;
      $("hud-time").textContent = txt;
    }
    const aasthi = `₹${formatCrore(this.storage.data.aasthiTotal)} CR`;
    if (aasthi !== this.lastAasthi) {
      const first = this.lastAasthi === undefined;
      this.lastAasthi = aasthi;
      $("hud-aasthi").textContent = aasthi;
      if (!first) {
        const coins = document.querySelector(".hud-coins");
        coins.classList.remove("bump");
        void coins.offsetWidth;
        coins.classList.add("bump");
      }
    }
  }

  updatePowers(list) {
    const el = $("hud-powers");
    // The icons are created once and then only shown, hidden or updated, never torn down and rebuilt:
    // re-creating images on every pickup made them flash while they decoded again.
    const P = (this.powerEls ??= { avatar: null, chips: {} });
    if (!P.avatar) {
      P.avatar = document.createElement("img");
      P.avatar.className = "power-avatar hidden";
      P.avatar.src = ASSETS.heroPowered;
      P.avatar.alt = "Powered up!";
      el.prepend(P.avatar);
    }
    const key = list.map((p) => `${p.type}${p.count || ""}`).join("|");
    if (key !== this.powerKey) {
      this.powerKey = key;
      P.avatar.classList.toggle("hidden", !list.length);
      $("hud").classList.toggle("has-powers", list.length > 0); // lets narrow phones make room for the icons
      const present = new Set(list.map((p) => p.type));
      for (const type of Object.keys(P.chips)) {
        if (!present.has(type)) {
          P.chips[type].remove();
          delete P.chips[type];
        }
      }
      for (const p of list) {
        let chip = P.chips[p.type];
        if (!chip) {
          chip = document.createElement("div");
          chip.className = "power-chip";
          chip.dataset.type = p.type;
          chip.style.setProperty("--p", "100");
          const ring = document.createElement("span");
          ring.className = "power-ring";
          const img = document.createElement("img");
          img.src = this.iconUrls[p.type];
          img.alt = POWER_INFO[p.type].name;
          ring.appendChild(img);
          chip.appendChild(ring);
          el.appendChild(chip);
          P.chips[p.type] = chip;
        }
        let span = chip.querySelector(".power-count");
        if (p.count > 1) {
          if (!span) {
            span = document.createElement("span");
            span.className = "power-count";
            chip.appendChild(span);
          }
          span.textContent = `×${p.count}`;
        } else if (span) {
          span.remove();
        }
      }
    }
    for (const p of list) {
      if (p.total == null) continue;
      const chip = P.chips[p.type];
      if (chip) chip.style.setProperty("--p", String(Math.max(0, Math.min(100, (p.remaining / p.total) * 100))));
    }
  }


  /** Red edge-glow that grows as a hunting chaser gets close (v is 0-1). */
  setDanger(v) {
    const q = Math.round(v * 20) / 20;
    if (q === this.lastDanger) return;
    this.lastDanger = q;
    const el = $("danger");
    el.style.opacity = String(q);
    el.classList.toggle("pulse", q > 0.55);
  }

  /** Big 3-2-1 before a fresh round (retries just get a quick GO). */
  showCountdown({ total, level, retry }) {
    this.hideBanner();
    const el = $("countdown");
    el.querySelector(".cd-level").textContent = `LEVEL ${level}`;
    const num = el.querySelector(".cd-num");
    const steps = retry ? ["READY"] : ["3", "2", "1"];
    const per = total / steps.length;
    el.classList.add("show");
    steps.forEach((label, i) => {
      this.cdTimers.push(
        setTimeout(() => {
          num.textContent = label;
          num.classList.remove("tick");
          void num.offsetWidth;
          num.classList.add("tick");
        }, i * per * 1000),
      );
    });
    this.cdTimers.push(setTimeout(() => el.classList.remove("show"), total * 1000));
  }

  showGo() {
    const el = $("countdown");
    el.querySelector(".cd-level").textContent = "";
    const num = el.querySelector(".cd-num");
    num.textContent = "GO!";
    num.classList.remove("tick");
    void num.offsetWidth;
    num.classList.add("tick");
    el.classList.add("show", "go");
    this.cdTimers.push(setTimeout(() => el.classList.remove("show", "go"), 650));
  }

  showBanner(title, sub, duration) {
    const el = $("banner");
    el.querySelector(".banner-title").textContent = title;
    el.querySelector(".banner-sub").textContent = sub;
    el.classList.add("show");
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => el.classList.remove("show"), duration * 1000);
  }

  hideBanner() {
    clearTimeout(this.bannerTimer);
    $("banner").classList.remove("show");
    this.cdTimers.forEach(clearTimeout);
    this.cdTimers = [];
    $("countdown").classList.remove("show", "go");
  }

  toast(text, delay = 0) {
    const show = () => {
      const box = $("toasts");
      while (box.children.length >= 2) box.firstChild.remove();
      const t = document.createElement("div");
      t.className = "toast";
      t.textContent = text;
      box.appendChild(t);
      setTimeout(() => t.remove(), 1750);
    };
    if (delay > 0) setTimeout(show, delay * 1000);
    else show();
  }

  flash(text) {
    const el = $("flash");
    el.textContent = text;
    el.classList.remove("show");
    void el.offsetWidth;
    el.classList.add("show");
  }

  // ---------- cards ----------

  hideCards() {
    this.setDanger(0);
    for (const id of ["card-caught", "card-complete", "card-final", "card-game-end"]) $(id).classList.remove("show");
    this.closeAllModals();
    this.hideBanner();
    $("toasts").innerHTML = "";
    $("flash").classList.remove("show");
  }

  showCaught({ level = 0 } = {}) {
    this.hideCoach();
    this.setFollow(level >= FOLLOW_FROM_LEVEL);
    navigator.vibrate?.([70, 40, 140]);
    $("card-caught").classList.add("show");
    $("btn-restart").focus({ preventScroll: true });
  }

  showLevelComplete({ level = 0, time, best, isBest, earned = 0, seconds = time }) {
    this.setFollow(level >= FOLLOW_FROM_LEVEL);
    this.hideCoach();
    navigator.vibrate?.([30, 30, 30]);
    const stars = seconds <= 17 ? 3 : seconds <= 24 ? 2 : 1;
    document.querySelectorAll("#complete-stars .star").forEach((star, i) => {
      star.classList.remove("on");
      star.style.setProperty("--d", `${0.4 + i * 0.3}s`);
      if (i < stars) star.classList.add("on");
    });
    const chips = [`<span class="chip">${icon("timer")}${formatTime(time)}</span>`];
    if (isBest) chips.push(`<span class="chip gold">${icon("star")}New best</span>`);
    else if (best) chips.push(`<span class="chip">Best ${formatTime(best)}</span>`);
    $("complete-stats").innerHTML = chips.join("");
    const reward = document.querySelector("#card-complete .reward");
    reward.classList.toggle("empty", earned <= 0);
    const amount = $("reward-amount");
    const total = this.storage.data.aasthiTotal || 0;
    $("reward-total").textContent = `Total ₹${formatCrore(total)} CR`;
    this.countUp(amount, earned, 1300, 550);
    $("card-complete").classList.add("show");
    $("btn-next").focus({ preventScroll: true });
    this.startConfetti();
  }

  /** Animates "+₹0.00 CR" up to the earned amount. */
  countUp(el, rupees, duration, delay) {
    cancelAnimationFrame(this.countRaf);
    el.textContent = "+₹0.00 CR";
    if (rupees <= 0) return;
    const start = performance.now() + delay;
    const tick = (now) => {
      const k = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - (1 - k) ** 3;
      el.textContent = `+₹${formatCrore(rupees * eased)} CR`;
      if (k < 1) this.countRaf = requestAnimationFrame(tick);
    };
    this.countRaf = requestAnimationFrame(tick);
  }

  /** A short gold-and-crimson confetti burst behind the win card. */
  startConfetti() {
    const cv = $("confetti-canvas");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    const g = cv.getContext("2d");
    const colors = ["#d4a93f", "#c0392b", "#26262b", "#4d97b8", "#f3d27a", "#8a6a1c"];
    const bits = Array.from({ length: 110 }, () => ({
      x: Math.random() * cv.width,
      y: -Math.random() * cv.height * 0.6,
      w: (6 + Math.random() * 8) * dpr,
      h: (4 + Math.random() * 6) * dpr,
      vx: (Math.random() - 0.5) * 2.2 * dpr,
      vy: (2 + Math.random() * 3.4) * dpr,
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.3,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));
    cancelAnimationFrame(this.confettiRaf);
    const t0 = performance.now();
    const frame = (now) => {
      const age = now - t0;
      g.clearRect(0, 0, cv.width, cv.height);
      for (const b of bits) {
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.vr;
        g.save();
        g.globalAlpha = Math.max(0, 1 - age / 3200);
        g.translate(b.x, b.y);
        g.rotate(b.rot);
        g.fillStyle = b.c;
        g.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        g.restore();
      }
      if (age < 3200 && $("card-complete").classList.contains("show")) this.confettiRaf = requestAnimationFrame(frame);
      else g.clearRect(0, 0, cv.width, cv.height);
    };
    this.confettiRaf = requestAnimationFrame(frame);
  }

  showGameEnd() {
    $("game-end-art").src = "assets/level20 success image.png"; // only fetched when the final card is about to show
    $("hud").classList.add("hidden");
    $("card-game-end").classList.add("show");
    $("btn-play-from-start").focus({ preventScroll: true });
  }

  showFinal(nextLevel) {
    this.updateAasthiAccess();
    $("hud").classList.add("hidden");
    $("btn-keep-going").textContent = `KEEP ESCAPING → LEVEL ${nextLevel}`;
    $("name-input").value = this.storage.data.name || "";
    $("card-final").classList.add("show");
    this.renderCard("final-card-canvas");
    setTimeout(() => $("btn-keep-going").focus({ preventScroll: true }), 50);
  }
}
