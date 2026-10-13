import { mulberry32 } from "./maze.js";
import { doorSide, doorPartner } from "./levels.js";
import { TELEPORT_EFFECT, FLOOD_LEAP_SECONDS } from "./config.js";
import { smashPose } from "./smash.js";
import { trainPos } from "./train.js";
import { splitHeroArms } from "./herolimbs.js";
import { WalkCache, WALK_FRAMES } from "./walk.js";

/** Light grey, black and gold palace — kept on the lighter side so characters read clearly. */
const C = {
  floor: "#e9e8e5",
  floorTileA: "#f5f4f2",
  floorTileB: "#efeeeb",
  grout: "#dcdad5",
  wallTop: "#6a6a71",
  wallTopLight: "#7a7a81",
  wallFace: "#2f2f35",
  inlay: "#d9b862",
  gold: "#d4a93f",
  goldLight: "#f3d27a",
  goldDark: "#a37a1c",
  water: "#c9d3da",
  rug: "rgba(212, 169, 63, 0.14)",
  rugBorder: "rgba(176, 134, 40, 0.5)",
};

const MAX_DPR = 2;

/** Character sprite sizes in cells: upright figures by height, four-legged ones by width. */
/** Every character is drawn 30% larger than the original size so they read well on phones; the maze is unchanged. */
const CHAR_SCALE = 1.3;
const TALL_HEIGHT = 1.55 * CHAR_SCALE;
const WIDE_WIDTH = 1.75 * CHAR_SCALE;
/** Feet sit this far below the cell centre (in cells). */
const FOOT_OFFSET = 0.42;
/** Where the crocodile's tail tip sits in its sprite (fractions of width / height). */
const CROC_TAIL = { u: 0.512, v: 0.024 };

export class Renderer {
  constructor(canvas, images) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.images = images;
    this.cell = 32;
    this.dpr = 1;
    this.level = null;
    this.staticLayer = null;
    this.sprites = {};
    this.icons = {};
    this.walk = new WalkCache();
  }

  /**
   * Sizes the canvas to fit the maze inside the given box (CSS px). With `pan`, tiles are sized to fill the
   * box's height instead; if the maze is then wider than the box, the canvas shows a slice that follows the hero.
   */
  fit(availW, availH, { pan = false } = {}) {
    if (!this.level) return;
    // A board that is already built is left alone for harmless size changes: the space growing a little
    // (a toolbar hiding) or shrinking by a few pixels. Only a real change is worth rebuilding the canvas and
    // every sprite for (that blanks the canvas and takes a moment on a phone).
    if (this.staticLayer && this.staticFor === this.level && this.lastAvail) {
      const dH = availH - this.lastAvail.h;
      const dW = Math.abs(availW - this.lastAvail.w);
      if (dW < 4 && dH > -5 && dH < 60 && this.lastAvail.pan === pan) return;
    }
    const { cols, rows } = this.level.maze;
    const fitCell = Math.floor(Math.min(availW / cols, availH / rows));
    const cell = Math.max(8, Math.min(52, pan ? Math.max(fitCell, Math.floor(availH / rows)) : fitCell));
    const viewW = Math.min(cols * cell, Math.floor(availW));
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    if (cell === this.cell && viewW === this.viewW && dpr === this.dpr && this.staticLayer && this.staticFor === this.level) return;
    this.cell = cell;
    this.viewW = viewW;
    this.dpr = dpr;
    this.worldW = Math.round(cols * cell * dpr);
    this.worldH = Math.round(rows * cell * dpr);
    this.canvas.style.width = `${viewW}px`;
    this.canvas.style.height = `${rows * cell}px`;
    this.canvas.width = viewW === cols * cell ? this.worldW : Math.round(viewW * dpr);
    this.canvas.height = this.worldH;
    this.camX = null;
    this.lastAvail = { w: availW, h: availH, pan };
    this.buildStatic();
    this.buildSprites();
  }

  /**
   * The game says which characters will walk this level; their walk frames are made ahead of time in small
   * slices (during the instruction screen) so nothing hitches the first time someone starts to walk.
   */
  queueWalk() {
    this.walkQueue = [];
    for (const w of this.walkWanted || []) {
      const sp = this.sprites[w.sprite];
      if (!sp) continue;
      for (let i = 0; i < WALK_FRAMES; i++) this.walkQueue.push({ sp, rig: w.rig, axis: w.axis, i });
    }
    clearTimeout(this.walkTimer);
    this.pumpWalk();
  }

  pumpWalk() {
    const start = performance.now();
    while (this.walkQueue.length && performance.now() - start < 4) {
      const j = this.walkQueue.shift();
      this.walk.frameAt(j.sp, j.rig, j.axis, j.i);
    }
    this.walkTimer = this.walkQueue.length ? setTimeout(() => this.pumpWalk(), 24) : 0;
  }

  /** Horizontal scroll (device px) that keeps the hero centred in a panned view, eased so it glides. */
  updateCamera(game, t, s) {
    const maxCam = this.worldW - this.canvas.width;
    const dt = this.lastDrawT == null ? 0 : Math.min(0.1, Math.max(0, t - this.lastDrawT));
    this.lastDrawT = t;
    if (maxCam <= 0 || !game.hero) {
      this.camX = 0;
      return;
    }
    const heroX = (game.hero.x + 0.5) * s;
    const screenX = this.mirrorX ? this.worldW - heroX : heroX;
    const target = Math.max(0, Math.min(maxCam, screenX - this.canvas.width / 2));
    this.camX = this.camX == null ? target : this.camX + (target - this.camX) * (1 - Math.exp(-dt * 8));
  }

  setLevel(level) {
    this.level = level;
    this.camX = null;
    this.staticLayer = null;
    this.side = doorSide(level);
    this.decor = computeDecor(level);
  }

  // ---------- static layer ----------

  buildStatic() {
    const { maze } = this.level;
    const s = this.cell * this.dpr;
    const layer = document.createElement("canvas");
    layer.width = this.worldW;
    layer.height = this.worldH;
    const g = layer.getContext("2d");
    const wall = (c, r) => maze.type(c, r) === "wall";

    g.fillStyle = C.floor;
    g.fillRect(0, 0, layer.width, layer.height);

    maze.forEachCell((c, r, t) => {
      if (t === "wall") return;
      const x = c * s;
      const y = r * s;
      g.fillStyle = (c + r) % 2 ? C.floorTileA : C.floorTileB;
      g.fillRect(x + 0.5, y + 0.5, s - 1, s - 1);
      g.strokeStyle = C.grout;
      g.lineWidth = Math.max(1, s * 0.03);
      g.strokeRect(x + 0.5, y + 0.5, s - 1, s - 1);
      if ((c + r) % 2 === 0) {
        g.fillStyle = "rgba(212, 169, 63, 0.35)";
        diamond(g, x, y, s * 0.07);
        g.fill();
      }
    });

    for (const rug of this.decor.rugs) drawRug(g, rug, s);
    drawRangoli(g, this.level.heroSpawn, s);

    // lamp glow pools on the floor (static)
    for (const d of this.decor.items) {
      if (d.kind !== "lamp") continue;
      const cx = (d.c + 0.5) * s;
      const cy = (d.r + 1.2) * s;
      const grad = g.createRadialGradient(cx, cy, 0, cx, cy, s * 1.3);
      grad.addColorStop(0, "rgba(255, 214, 120, 0.3)");
      grad.addColorStop(1, "rgba(255, 214, 120, 0)");
      g.fillStyle = grad;
      g.fillRect(cx - s * 1.4, cy - s * 1.4, s * 2.8, s * 2.8);
    }

    // walls: top surface + 2.5D front face + gold inlay
    const inset = s * 0.16;
    const faceH = s * 0.26;
    g.lineCap = "square";
    maze.forEachCell((c, r, t) => {
      if (t !== "wall") return;
      const x = c * s;
      const y = r * s;
      const top = !wall(c, r - 1);
      const bottom = !wall(c, r + 1);
      const left = !wall(c - 1, r);
      const right = !wall(c + 1, r);
      const h = bottom ? s - faceH : s;

      g.fillStyle = C.wallTop;
      g.fillRect(x, y, s + 0.5, h + 0.5);
      g.fillStyle = C.wallTopLight;
      g.fillRect(x + inset, y + inset, s - inset * 2, Math.max(0, h - inset * 2));
      if (!left) g.fillRect(x, y + inset, inset, Math.max(0, h - inset * 2));
      if (!right) g.fillRect(x + s - inset, y + inset, inset + 0.5, Math.max(0, h - inset * 2));
      if (!top) g.fillRect(x + (left ? inset : 0), y, s - (left ? inset : 0) - (right ? inset : 0), inset);
      if (!bottom) g.fillRect(x + (left ? inset : 0), y + h - inset, s - (left ? inset : 0) - (right ? inset : 0), inset + 0.5);
      if (bottom) {
        g.fillStyle = C.wallFace;
        g.fillRect(x, y + h, s + 0.5, faceH);
        g.fillStyle = C.gold;
        g.fillRect(x, y + h, s + 0.5, Math.max(1, s * 0.045));
      }

      g.strokeStyle = C.inlay;
      g.lineWidth = Math.max(1, s * 0.05);
      g.beginPath();
      const x0 = left ? x + inset : x;
      const x1 = right ? x + s - inset : x + s;
      const y0 = top ? y + inset : y;
      const y1 = bottom ? y + h - inset : y + s;
      if (top) line(g, x0, y + inset, x1, y + inset);
      if (bottom) line(g, x0, y + h - inset, x1, y + h - inset);
      if (left) line(g, x + inset, y0, x + inset, y1);
      if (right) line(g, x + s - inset, y0, x + s - inset, y1);
      // concave corners
      const lh = wall(c - 1, r + 1) ? s : s - faceH;
      if (!left && !top && !wall(c - 1, r - 1)) polyline(g, [x, y + inset, x + inset, y + inset, x + inset, y]);
      if (!right && !top && !wall(c + 1, r - 1)) polyline(g, [x + s, y + inset, x + s - inset, y + inset, x + s - inset, y]);
      if (!left && !bottom && !wall(c - 1, r + 1)) polyline(g, [x, y + lh - inset, x + inset, y + lh - inset, x + inset, y + s]);
      if (!right && !bottom && !wall(c + 1, r + 1)) polyline(g, [x + s, y + lh - inset, x + s - inset, y + lh - inset, x + s - inset, y + s]);
      g.stroke();
    });

    for (const d of this.decor.items) drawDecor(g, d, s);

    this.staticLayer = layer;
    this.staticFor = this.level;
  }

  // ---------- sprites ----------

  /** Characters are drawn as-is (full figure, no frame); state is shown with glows and tints on the silhouette. */
  buildSprites() {
    this.walk.clear();
    const s = this.cell * this.dpr;
    const img = this.images;
    this.sprites = {
      hero: makeSprite(img.hero, s),
      heroPowered: makeSprite(img.heroPowered, s),
      heroGlow: makeSprite(img.heroPowered, s, { glow: "rgba(176, 96, 255, 0.95)" }),
      heroine: makeSprite(img.heroine, s),
      heroineGlow: makeSprite(img.heroine, s, { glow: "rgba(176, 96, 255, 0.95)" }),
      heroine2: makeSprite(img.heroine2, s),
      heroine2Glow: makeSprite(img.heroine2, s, { glow: "rgba(176, 96, 255, 0.95)" }),
      heroine3: makeSprite(img.heroine3, s),
      heroine3Glow: makeSprite(img.heroine3, s, { glow: "rgba(176, 96, 255, 0.95)" }),
    };
    for (const type of ["creature", "crocodile", "shawlMan"]) {
      this.sprites[type] = makeSprite(img[type], s);
      this.sprites[`${type}Frozen`] = makeSprite(img[type], s, { tint: "rgba(140, 110, 255, 0.45)" });
      this.sprites[`${type}Stunned`] = makeSprite(img[type], s, { grey: true });
    }
    this.heroParts = buildHeroParts(img.hero, this.sprites.hero);
    const iconPx = Math.round(this.cell * 0.95 * this.dpr);
    this.icons = {
      eye: makeIcon("eye", iconPx),
      knife: makeIcon("knife", iconPx),
      boost: makeIcon("boost", iconPx),
      eyeBadge: makeIcon("eye", Math.round(iconPx * 0.55)),
      knifeBadge: makeIcon("knife", Math.round(iconPx * 0.6)),
    };
    this.queueWalk();
  }

  /**
   * Inside a mirrored frame, re-flips content around (cx, cy) so figures stay upright and text stays readable.
   * Horizontal flips are only undone when `x` is set: a mirrored figure should still face where it walks.
   */
  upright(cx, cy, draw, { x = false } = {}) {
    const fx = x && this.mirrorX;
    if (!fx && !this.mirrorY) return draw();
    const { ctx } = this;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(fx ? -1 : 1, this.mirrorY ? -1 : 1);
    ctx.translate(-cx, -cy);
    draw();
    ctx.restore();
  }

  /** Where to draw maze row-centre `y` while upright() is flipping around `pivotY`. */
  uprightY(y, pivotY) {
    return this.mirrorY ? 2 * pivotY - y : y;
  }

  /** Draws a sprite with its feet at (cx, footY). */
  drawSprite(sp, cx, footY, { scale = 1, flip = false, alpha = 1, rotate = 0 } = {}) {
    if (!sp) return;
    const { ctx } = this;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, footY);
    ctx.rotate(rotate);
    ctx.scale(flip ? -scale : scale, scale);
    ctx.drawImage(sp.canvas, -sp.canvas.width / 2, -sp.h - sp.pad);
    ctx.restore();
  }

  // ---------- frame ----------

  draw(game, t) {
    if (!this.staticLayer) return;
    const { ctx } = this;
    const s = this.cell * this.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateCamera(game, t, s);
    ctx.save();
    ctx.translate(-Math.round(this.camX), 0);
    if (game.shake > 0) {
      const k = game.shake / 0.2;
      ctx.translate((Math.random() - 0.5) * s * 0.18 * k, (Math.random() - 0.5) * s * 0.12 * k);
    }
    if (this.mirrorX || this.mirrorY) {
      ctx.translate(this.mirrorX ? this.worldW : 0, this.mirrorY ? this.worldH : 0);
      ctx.scale(this.mirrorX ? -1 : 1, this.mirrorY ? -1 : 1);
    }
    ctx.drawImage(this.staticLayer, 0, 0);

    this.drawTrapFloor(game, s);
    this.drawDoor(game, t, s);
    this.drawTrapObjects(game, t, s);

    for (const col of game.collectibles) {
      if (col.taken) continue;
      const icon = this.icons[col.type];
      const bob = Math.sin(t * 3 + col.c) * s * 0.06;
      const cx = (col.c + 0.5) * s;
      const cy = (col.r + 0.5) * s + bob;
      ctx.globalAlpha = 0.35 + 0.15 * Math.sin(t * 4 + col.r);
      ctx.fillStyle = col.type === "eye" ? "#ff7aa8" : col.type === "knife" ? "#7fb6d6" : "#ffcf3f";
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      this.upright(cx, cy, () => ctx.drawImage(icon, cx - icon.width / 2, cy - icon.height / 2), { x: true });
    }

    for (const fx of game.effects) this.drawEffect(fx, s);
    for (const ch of game.chasers) if (ch.warning) this.drawThathaCue(ch, t, s);

    // painter's order: whoever stands lower on screen is drawn last
    // (the crocodile being swung by its tail is drawn in front of the hero)
    const actors = [
      ...game.chasers.map((ch) => ({ y: ch.state === "SMASHED" ? game.hero.y + 0.01 : ch.y, ch })),
      { y: game.hero.y, hero: true },
    ];
    if (game.heroine) actors.push({ y: game.heroine.y, heroine: true });
    for (const ally of game.allies || []) actors.push({ y: ally.y, ally });
    actors.sort((a, b) => a.y - b.y);
    for (const a of actors) {
      const e = a.hero ? game.hero : a.heroine ? game.heroine : a.ally ? a.ally : a.ch;
      this.upright((e.x + 0.5) * s, (e.y + 0.5) * s, () => {
        if (a.hero) this.drawHero(game, t, s);
        else if (a.heroine) this.drawHeroine(game, t, s);
        else if (a.ally) this.drawHeroine(game, t, s, a.ally);
        else this.drawChaser(a.ch, game, t, s);
      });
    }

    this.drawConversation(game, t, s);

    this.drawTrapOverlay(game, t, s);
    // Doors are discovered by exploration; no directional arrow reveals the correct exit.

    if (game.state === "CAUGHT") {
      const k = Math.min(1, game.caughtTimer / 0.25);
      ctx.fillStyle = `rgba(200, 30, 30, ${0.18 * k})`;
      ctx.fillRect(0, 0, this.worldW, this.worldH);
    }
    ctx.restore();

    // Danger: the board's edges flush red (and pulse) as a hunting chaser closes in.
    const danger = game.state === "PLAYING" ? game.dangerLevel || 0 : 0;
    if (danger > 0.03) {
      const w = this.canvas.width;
      const h = this.canvas.height;
      const pulse = danger > 0.55 ? 0.78 + 0.22 * Math.sin(t * 9) : 1;
      const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.32, w / 2, h / 2, Math.max(w, h) * 0.78);
      grad.addColorStop(0, "rgba(220, 40, 55, 0)");
      grad.addColorStop(1, `rgba(220, 40, 55, ${0.55 * danger * pulse})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }

  drawDoor(game, t, s) {
    if (game.trap?.id === "hiddenDoor" && !game.hiddenDoorRevealed) return;
    this.drawEscapeDoor(this.level.door, this.side, game.doorOpen, t, s);
    const decoy = game.trap?.id === "twoDoors" && game.trap.config.decoyDoor;
    if (decoy) this.drawEscapeDoor(decoy, doorSide({ maze: this.level.maze, door: decoy }), game.decoyOpen || 0, t, s);
  }

  drawEscapeDoor(door, side, open, t, s) {
    const { ctx } = this;
    // The gate stands over BOTH of its tiles (the door tile and its partner), so it is centred on the pair.
    const partner = doorPartner(this.level.maze, door);
    const cx = ((partner ? (door.c + partner.c) / 2 : door.c) + 0.5) * s;
    const cy = ((partner ? (door.r + partner.r) / 2 : door.r) + 0.5) * s;
    const pulse = 0.5 + 0.5 * Math.sin(t * 3);

    // outer halo
    const haloR = s * (2.6 + pulse * 0.4 + open * 1.5);
    const halo = ctx.createRadialGradient(cx, cy, s * 0.2, cx, cy, haloR);
    halo.addColorStop(0, `rgba(255, 214, 90, ${0.75 + pulse * 0.2})`);
    halo.addColorStop(0.35, `rgba(255, 205, 80, ${0.32 + pulse * 0.15})`);
    halo.addColorStop(1, "rgba(255, 205, 80, 0)");
    ctx.fillStyle = halo;
    ctx.fillRect(cx - haloR, cy - haloR, haloR * 2, haloR * 2);

    // slow-turning light rays
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.35);
    const rayLen = s * (2.4 + pulse * 0.3);
    const rays = ctx.createRadialGradient(0, 0, s * 0.3, 0, 0, rayLen);
    rays.addColorStop(0, `rgba(255, 236, 160, ${0.5 + pulse * 0.2})`);
    rays.addColorStop(1, "rgba(255, 236, 160, 0)");
    ctx.fillStyle = rays;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI * 2) / 10;
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a - 0.11) * rayLen, Math.sin(a - 0.11) * rayLen);
      ctx.lineTo(Math.cos(a + 0.11) * rayLen, Math.sin(a + 0.11) * rayLen);
      ctx.closePath();
    }
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    const rot = { top: 0, right: Math.PI / 2, bottom: Math.PI, left: -Math.PI / 2 }[side];
    ctx.rotate(rot);
    // In the rotated frame the maze is "below" (+y), the outside is "above" (-y).
    const half = s / 2;
    // Exactly two tiles wide along the wall it stands in, and only as deep as the wall itself: it never covers a
    // corner, a neighbouring tile or the walkway in front of it.
    const wHalf = partner ? s : s / 2;
    ctx.shadowColor = "rgba(255, 200, 60, 0.95)";
    ctx.shadowBlur = s * (0.6 + pulse * 0.5);
    const light = ctx.createLinearGradient(0, -half, 0, half);
    light.addColorStop(0, "#fffef2");
    light.addColorStop(1, "#ffe08a");
    ctx.fillStyle = light;
    ctx.fillRect(-wHalf, -half, wHalf * 2, s);

    // door leaves
    const leafW = (wHalf - s * 0.12) * (1 - open);
    ctx.fillStyle = C.wallFace;
    ctx.fillRect(-wHalf + s * 0.12, -half + s * 0.18, leafW, s * 0.82);
    ctx.fillRect(wHalf - s * 0.12 - leafW, -half + s * 0.18, leafW, s * 0.82);
    ctx.shadowBlur = 0;
    if (open < 0.6) {
      ctx.fillStyle = C.gold;
      ctx.fillRect(-s * 0.03, -half + s * 0.18, s * 0.06, s * 0.82 * (1 - open));
      ctx.beginPath();
      ctx.arc(-s * 0.1, s * 0.12, s * 0.035, 0, Math.PI * 2);
      ctx.arc(s * 0.1, s * 0.12, s * 0.035, 0, Math.PI * 2);
      ctx.fill();
    }
    // golden arch frame
    ctx.shadowColor = "rgba(255, 200, 60, 0.9)";
    ctx.shadowBlur = s * 0.4;
    ctx.strokeStyle = C.gold;
    ctx.lineWidth = s * 0.12;
    ctx.beginPath();
    ctx.moveTo(-wHalf + s * 0.06, half);
    ctx.lineTo(-wHalf + s * 0.06, -half + s * 0.3);
    ctx.quadraticCurveTo(0, -half - s * 0.12, wHalf - s * 0.06, -half + s * 0.3);
    ctx.lineTo(wHalf - s * 0.06, half);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#fff6cf";
    ctx.lineWidth = s * 0.03;
    ctx.stroke();
    ctx.restore();
  }

  drawTrapFloor(game, s) {
    if (game.trap?.id !== "water") return;
    this.ctx.fillStyle = "rgba(77, 151, 184, 0.58)";
    this.ctx.fillRect(0, 0, this.worldW, this.worldH);
  }

  /** The track switch: a red octagonal STOP sign whose lettering is sized to fit inside it. */
  drawStopSign(p, t, s, fade = 0) {
    if (!p) return;
    const { ctx } = this;
    const x = (p.c + 0.5) * s;
    const y = (p.r + 0.5) * s;
    ctx.save();
    ctx.globalAlpha = 1 - fade;
    ctx.translate(x, y);
    ctx.scale(1 + fade * 0.45, 1 + fade * 0.45);
    ctx.translate(-x, -y);
    const R = s * (0.5 + 0.03 * Math.sin(t * 5));
    const octagon = (radius) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI / 8) * (2 * i + 1);
        const px = x + Math.cos(a) * radius;
        const py = y + Math.sin(a) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = s * 0.12;
    ctx.shadowOffsetY = s * 0.05;
    ctx.fillStyle = "#b3261e";
    octagon(R);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = Math.max(1.5, s * 0.045);
    octagon(R * 0.88);
    ctx.stroke();
    this.upright(
      x,
      y,
      () => {
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let size = s * 0.3;
        ctx.font = `900 ${size}px system-ui, Arial, sans-serif`;
        const maxW = R * 1.5; // the lettering must fit between the octagon's sides
        const w = ctx.measureText("STOP").width;
        if (w > maxW) {
          size *= maxW / w;
          ctx.font = `900 ${size}px system-ui, Arial, sans-serif`;
        }
        ctx.fillText("STOP", x, y + size * 0.04);
      },
      { x: true },
    );
    ctx.restore();
  }

  drawTrapObjects(game, t, s) {
    const trap = game.trap;
    if (!trap?.id) return;
    const { ctx } = this;
    const drawMarker = (p, glyph, color) => {
      if (!p) return;
      const x = (p.c + 0.5) * s;
      const y = (p.r + 0.5) * s;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x, y, s * 0.32, 0, Math.PI * 2); ctx.fill();
      this.upright(x, y, () => {
        ctx.fillStyle = "#fff"; ctx.font = `900 ${Math.round(s * 0.42)}px system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(glyph, x, y + 1);
      }, { x: true });
    };
    if (trap.id === "train") {
      if (!game.trainDiverted) this.drawTrain(game, t, s);
      const since = t - (game.switchFlippedAt ?? -99);
      if (!game.trainDiverted) this.drawStopSign(trap.config.switch, t, s, 0);
      else if (since < 0.4) this.drawStopSign(trap.config.switch, t, s, since / 0.4); // pops and fades, then it is gone
    }
    if (trap.id === "well") {
      for (const well of trap.config.wells || []) {
        const x = (well.c + .5) * s, y = (well.r + .5) * s;
        const grow = Math.min(1, (t - (well.openedAt ?? t)) / 0.25);
        const closing = game.wellOpenTimer < 0.7 && Math.floor(t * 10) % 2 === 0;
        ctx.save();
        ctx.globalAlpha = closing ? 0.45 : 1;
        ctx.translate(x, y);
        ctx.scale(grow, grow);
        ctx.fillStyle = "#6f6a63";
        ctx.beginPath(); ctx.arc(0, 0, s * .46, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#4b4741"; ctx.lineWidth = Math.max(1, s * .03);
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          ctx.beginPath(); ctx.moveTo(Math.cos(a) * s * .31, Math.sin(a) * s * .31); ctx.lineTo(Math.cos(a) * s * .46, Math.sin(a) * s * .46); ctx.stroke();
        }
        const water = ctx.createRadialGradient(0, 0, 0, 0, 0, s * .32);
        water.addColorStop(0, "#071423"); water.addColorStop(1, "#24527a");
        ctx.fillStyle = water;
        ctx.beginPath(); ctx.arc(0, 0, s * .31, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(157,230,255,.8)"; ctx.lineWidth = Math.max(1, s * .035);
        ctx.beginPath(); ctx.arc(0, 0, s * (.12 + .14 * ((t * 1.6) % 1)), 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      if (trap.config.landing) drawMarker(trap.config.landing, "↯", "#70b8d8");
    }
  }

  drawTrain(game, t, s) {
    const { ctx } = this;
    const door = this.level.door;
    const horizontal = this.side === "top" || this.side === "bottom";
    const pos = trainPos(this.level.maze, this.side, t); // same clock the game uses to decide who gets hit
    ctx.save();
    ctx.fillStyle = "rgba(25,25,30,.35)";
    if (horizontal) ctx.fillRect(0, (door.r + (this.side === "top" ? 1 : -1)) * s + s * .38, this.worldW, s * .24);
    else ctx.fillRect((door.c + (this.side === "left" ? 1 : -1)) * s + s * .38, 0, s * .24, this.worldH);
    for (let i = 0; i < 3; i++) {
      const p = (pos + i * 1.25) * s;
      const x = horizontal ? p : (door.c + (this.side === "left" ? 1 : -1)) * s;
      const y = horizontal ? (door.r + (this.side === "top" ? 1 : -1)) * s : p;
      ctx.fillStyle = i === 0 ? "#b3261e" : "#3d3d44";
      ctx.fillRect(x, y, horizontal ? s * 1.05 : s * .78, horizontal ? s * .68 : s * 1.05);
      ctx.fillStyle = "#f3d27a";
      if (horizontal) {
        ctx.fillRect(x + s * .12, y + s * .13, s * .22, s * .2);
        ctx.fillRect(x + s * .62, y + s * .13, s * .22, s * .2);
        ctx.fillStyle = "#1f1f24"; ctx.beginPath(); ctx.arc(x + s * .22, y + s * .72, s * .12, 0, Math.PI * 2); ctx.arc(x + s * .83, y + s * .72, s * .12, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillRect(x + s * .12, y + s * .12, s * .2, s * .22);
        ctx.fillRect(x + s * .12, y + s * .62, s * .2, s * .22);
        ctx.fillStyle = "#1f1f24"; ctx.beginPath(); ctx.arc(x - s * .06, y + s * .22, s * .12, 0, Math.PI * 2); ctx.arc(x - s * .06, y + s * .83, s * .12, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  drawTrapOverlay(game, t, s) {
    const trap = game.trap;
    if (!trap?.id) return;
    const { ctx } = this;
    if (trap.id === "water") this.drawSafeZone(game, t, s);
    if (trap.id === "lights") {
      const x = (game.hero.x + 0.5) * s;
      const y = (game.hero.y + 0.5) * s;
      const r = trap.config.radius * s;
      const g = ctx.createRadialGradient(x, y, r * 0.4, x, y, r);
      g.addColorStop(0, "rgba(4,4,8,0)");
      g.addColorStop(0.7, "rgba(4,4,8,0.9)");
      g.addColorStop(1, "rgba(4,4,8,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.worldW, this.worldH);
    }
  }

  /** Flood safe zone: calm dashed ring, or — while the crocodile is inside — a red ring, edge vignette and countdown. */
  drawSafeZone(game, t, s) {
    const { ctx } = this;
    const flood = game.flood;
    const x = (game.hero.x + 0.5) * s;
    const y = (game.hero.y + 0.5) * s;
    const r = game.trap.config.safeRadius * s;
    const danger = game.state === "PLAYING" && (flood?.crocInSafeZone || flood?.leap);
    if (!danger) {
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = Math.max(2, s * 0.07);
      ctx.setLineDash([s * 0.18, s * 0.12]);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      return;
    }
    const pulse = 0.5 + 0.5 * Math.sin(t * 12);
    const { width, height } = this.canvas;
    const reach = Math.max(width, height);
    const vignette = ctx.createRadialGradient(width / 2, height / 2, reach * 0.42, width / 2, height / 2, reach * 0.75);
    vignette.addColorStop(0, "rgba(190, 20, 30, 0)");
    vignette.addColorStop(1, `rgba(190, 20, 30, ${0.3 + pulse * 0.15})`);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    ctx.fillStyle = `rgba(225, 40, 50, ${0.06 + pulse * 0.05})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(225, 40, 50, ${0.75 + pulse * 0.25})`;
    ctx.lineWidth = Math.max(3, s * 0.12);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();

    if (flood.leap || flood.remaining <= 0) return;
    const count = Math.ceil(flood.remaining);
    const pop = 1 + Math.max(0, flood.remaining - count + 1 - 0.75) * 1.2;
    const size = s * 1.15 * pop;
    const ty = y - s * 1.75;
    this.upright(x, y, () => {
      ctx.font = `900 ${size}px Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineWidth = s * 0.14;
      ctx.strokeStyle = "#7a0d14";
      ctx.strokeText(String(count), x, ty);
      ctx.fillStyle = "#fff4f0";
      ctx.fillText(String(count), x, ty);
    }, { x: true });
  }

  /** Thatha's destination mark: a purple ring that fills over the warning second, with his faint outline inside. */
  drawThathaCue(ch, t, s) {
    const { ctx } = this;
    const { target, remaining, duration } = ch.warning;
    const k = 1 - Math.max(0, remaining) / duration;
    const cx = (target.c + 0.5) * s;
    const cy = (target.r + 0.5) * s;
    const pulse = 0.5 + 0.5 * Math.sin(t * 18);
    const glow = ctx.createRadialGradient(cx, cy, s * 0.1, cx, cy, s * 1.1);
    glow.addColorStop(0, `rgba(178, 92, 255, ${0.4 + pulse * 0.2})`);
    glow.addColorStop(1, "rgba(178, 92, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(cx - s * 1.1, cy - s * 1.1, s * 2.2, s * 2.2);
    ctx.lineWidth = Math.max(2, s * 0.07);
    ctx.strokeStyle = "rgba(122, 52, 160, 0.85)";
    ctx.setLineDash([s * 0.12, s * 0.09]);
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.66, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = Math.max(3, s * 0.11);
    ctx.strokeStyle = "#f1dcff";
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.66, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); ctx.stroke();
    const footY = cy + FOOT_OFFSET * s;
    this.upright(cx, cy, () => this.drawSprite(this.sprites.shawlMan, cx, footY, { alpha: 0.2 + 0.3 * k }));
  }

  drawDoorArrow(t, s) {
    const { ctx } = this;
    const { door } = this.level;
    const dir = { top: [0, -1], bottom: [0, 1], left: [-1, 0], right: [1, 0] }[this.side];
    const bounce = (Math.sin(t * 8) * 0.5 + 0.5) * 0.25;
    const cx = (door.c + 0.5 - dir[0] * (1.15 + bounce)) * s;
    const cy = (door.r + 0.5 - dir[1] * (1.15 + bounce)) * s;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.atan2(dir[1], dir[0]));
    ctx.fillStyle = "#e8a317";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = s * 0.06;
    ctx.beginPath();
    ctx.moveTo(s * 0.38, 0);
    ctx.lineTo(-s * 0.08, -s * 0.34);
    ctx.lineTo(-s * 0.08, -s * 0.13);
    ctx.lineTo(-s * 0.38, -s * 0.13);
    ctx.lineTo(-s * 0.38, s * 0.13);
    ctx.lineTo(-s * 0.08, s * 0.13);
    ctx.lineTo(-s * 0.08, s * 0.34);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  /** Soft contact shadow under the feet so figures sit on the floor. */
  drawShadow(cx, footY, s, w) {
    const { ctx } = this;
    ctx.fillStyle = "rgba(30, 30, 35, 0.18)";
    ctx.beginPath();
    ctx.ellipse(cx, footY, w * CHAR_SCALE, s * 0.1 * CHAR_SCALE, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawHero(game, t, s) {
    const { hero } = game;
    const cx = (hero.x + 0.5) * s;
    const footY = (hero.y + 0.5 + FOOT_OFFSET) * s;
    const bob = hero.moving ? Math.abs(Math.sin(t * 14)) * s * 0.05 : 0;
    let powered = game.heroPoweredVisible(t);
    let sprite = powered || game.hero2Mode ? this.sprites.heroPowered : this.sprites.hero;
    // While he holds the crocodile by the tail his own arms are drawn separately (see drawHeroArms): body only here.
    if (this.smashGripActive(game)) {
      sprite = this.heroParts.body;
      powered = false;
    }
    // Walking: his own picture is bent into a stride (legs and arms swing, the body sways) while he moves.
    let bodySprite = sprite;
    if (hero.moving && !game.smash && game.state === "PLAYING") {
      const rigName = sprite === this.sprites.heroPowered ? "hero2" : "hero1";
      const axis = hero.dir === "left" || hero.dir === "right" ? "h" : "v";
      bodySprite = this.walk.frame(sprite, rigName, axis, this.walk.phase(hero, t, 8.8 * (hero.speed / 4), true));
    } else {
      this.walk.phase(hero, t, 0, false);
    }
    // The artwork looks left: mirror it whenever he is heading right (vertical moves keep the last facing).
    const flip = hero.facing > 0;

    // boost afterimages
    const pivotY = (hero.y + 0.5) * s;
    for (let i = 0; i < hero.trail.length; i += 2) {
      const p = hero.trail[i];
      const trailFootY = this.uprightY((p.y + 0.5) * s, pivotY) + FOOT_OFFSET * s;
      this.drawSprite(sprite, (p.x + 0.5) * s, trailFootY, { alpha: ((i + 1) / hero.trail.length) * 0.3, flip });
    }

    this.drawShadow(cx, footY, s, s * 0.28);
    let scale = 1;
    if (game.state === "CAUGHT") scale = 1 + Math.sin(game.caughtTimer * 30) * 0.06;
    if (game.powerPop > 0) scale += Math.sin((1 - game.powerPop / 0.3) * Math.PI) * 0.25;
    const suplexing = hero.suplexTimer > 0;
    const suplexProgress = suplexing ? 1 - hero.suplexTimer / hero.suplexDuration : 0;
    if (suplexing) scale += Math.sin(suplexProgress * Math.PI) * 0.16;
    const shake = game.state === "CAUGHT" ? Math.sin(game.caughtTimer * 60) * s * 0.06 : 0;
    const alpha = hero.graceTimer > 0 ? 0.45 + 0.55 * (Math.floor(t * 16) % 2) : 1;
    let rotate = suplexing ? Math.sin(suplexProgress * Math.PI) * (hero.suplexDirection?.x || 1) * -0.18 : 0;
    if (game.smash) {
      // Put his back into it: lean into each slam, rise on the lifts.
      const look = heroSmashLook(smashPose(game.smash.t));
      rotate = look.rotate;
      scale += look.scale;
    }

    if (powered) {
      const pulse = 0.55 + 0.45 * Math.sin(t * 7);
      this.drawSprite(this.sprites.heroGlow, cx + shake, footY - bob, { scale, alpha: pulse * alpha, flip, rotate });
    }
    this.drawSprite(bodySprite, cx + shake, footY - bob, { scale, alpha, rotate, flip });

    if (hero.knives > 0) {
      const b = this.icons.knifeBadge;
      const top = footY - bob - (sprite?.h || s) * scale;
      this.ctx.drawImage(b, cx + s * 0.2, top + s * 0.05);
    }
  }

  /** The crocodile dangling by its tail from the hero's fist, being slammed left, right, then flung away. */
  drawSmashedCroc(ch, game, s) {
    const sp = this.sprites.crocodile;
    if (!sp) return;
    const { ctx } = this;
    const pose = smashPose(game.smash.t);
    const hero = game.hero;
    const flip = ch.facing > 0;
    // Where its tail tip was while it stood next to the hero, and where his hand ends up.
    const cx = (ch.x + 0.5) * s;
    const footY = (ch.y + 0.5 + FOOT_OFFSET) * s;
    const tip = { x: cx + (CROC_TAIL.u - 0.5) * sp.w * (flip ? -1 : 1), y: footY - sp.h + CROC_TAIL.v * sp.h };
    const heroFootY = this.uprightY((hero.y + 0.5) * s, (ch.y + 0.5) * s) + FOOT_OFFSET * s;
    const hand = { x: (hero.x + 0.5) * s, y: heroFootY - pose.pivotH * s };
    let px = tip.x + (hand.x - tip.x) * pose.blend;
    let py = tip.y + (hand.y - tip.y) * pose.blend;
    let alpha = 1;
    let scale = 1;
    if (pose.phase === "fling") {
      const f = pose.fling;
      px += (1 - (1 - f) ** 2) * s * 8;
      py += -Math.sin(f * Math.PI * 0.8) * s * 2.4 + f * f * s * 1.4;
      alpha = 1 - Math.max(0, f - 0.6) / 0.4;
      scale = 1 - 0.3 * f;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(px, py);
    ctx.rotate(pose.angle);
    ctx.scale(flip ? -scale : scale, scale);
    ctx.drawImage(sp.canvas, -(sp.pad + sp.w * CROC_TAIL.u), -(sp.pad + sp.h * CROC_TAIL.v));
    ctx.restore();
    if (this.smashGripActive(game)) this.drawHeroArms(game, pose, { x: px, y: py }, (hero.x + 0.5) * s, heroFootY, s);
  }

  /** True while the hero's own arms should be swinging the crocodile (everything but the final fling). */
  smashGripActive(game) {
    return !!game.smash && !!this.heroParts && smashPose(game.smash.t).phase !== "fling";
  }

  /**
   * The hero's OWN arms (cut from his artwork) swing up from his shoulders until the fists close on the
   * crocodile's tail: one on the tail tip, the other a hand's width further down.
   */
  drawHeroArms(game, pose, pivot, heroCx, heroFootY, s) {
    const parts = this.heroParts;
    if (!parts) return;
    const { ctx } = this;
    const hero = game.hero;
    const look = heroSmashLook(pose);
    const scale = 1 + look.scale;
    const rot = look.rotate;
    const fl = hero.facing > 0 ? -1 : 1; // the artwork looks left; mirrored when he runs right
    const alpha = hero.graceTimer > 0 ? 0.45 + 0.55 * (Math.floor(game.t * 16) % 2) : 1;
    const body = parts.body;
    const toLocal = (p) => {
      const x = p.x - heroCx;
      const y = p.y - heroFootY;
      const c = Math.cos(-rot);
      const sn = Math.sin(-rot);
      return { x: ((x * c - y * sn) / scale) * fl, y: (x * sn + y * c) / scale };
    };
    // Sprite-canvas pixels -> the hero's local frame (feet at the origin, before flip / scale / lean).
    const local = (px, py) => ({ x: px - body.canvas.width / 2, y: py - body.h - body.pad });
    const dir = { x: -Math.sin(pose.angle), y: Math.cos(pose.angle) }; // along the tail, away from its tip
    const targets = [pivot, { x: pivot.x + dir.x * s * 0.24, y: pivot.y + dir.y * s * 0.24 }].map(toLocal);

    // The arm nearer the tail tip takes it; the other one grips lower down.
    const shoulders = parts.arms.map((arm) => local(arm.ox + arm.shoulder.x, arm.oy + arm.shoulder.y));
    const order = [0, 1];
    const d0 = Math.hypot(targets[0].x - shoulders[0].x, targets[0].y - shoulders[0].y);
    const d1 = Math.hypot(targets[0].x - shoulders[1].x, targets[0].y - shoulders[1].y);
    if (d1 < d0) order.reverse();

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(heroCx, heroFootY);
    ctx.rotate(rot);
    ctx.scale(fl * scale, scale);
    order.forEach((armIndex, n) => {
      const arm = parts.arms[armIndex];
      const sh = shoulders[armIndex];
      const natural = { x: arm.hand.x - arm.shoulder.x, y: arm.hand.y - arm.shoulder.y };
      const want = { x: targets[n].x - sh.x, y: targets[n].y - sh.y };
      const k = Math.min(1.4, Math.max(0.6, Math.hypot(want.x, want.y) / Math.hypot(natural.x, natural.y)));
      const theta = Math.atan2(want.y, want.x) - Math.atan2(natural.y, natural.x);
      ctx.save();
      ctx.translate(sh.x, sh.y);
      ctx.rotate(theta);
      ctx.scale(k, k);
      ctx.drawImage(arm.canvas, -arm.shoulder.x, -arm.shoulder.y);
      ctx.restore();
    });
    ctx.restore();
  }

  /** The hostage / follower. She shares the hero's powers: glow, boost afterimages and the knife badge. */
  /**
   * Any heroine: the hostage (front-facing), Heroine 2 (Twin Doors) and Heroine 3 (Sudden Wells). They share the
   * hero's powers (glow, boost afterimages, knife badge) once they follow him.
   */
  drawHeroine(game, t, s, who = game.heroine) {
    const h = who;
    const skin = h.skin || "heroine";
    const sprite = this.sprites[skin];
    const { ctx } = this;
    let cx = (h.x + 0.5) * s;
    let footY = (h.y + 0.5 + FOOT_OFFSET) * s;
    const bob = h.moving ? Math.abs(Math.sin(t * 14 + 1)) * s * 0.05 : 0;
    const powered = h.following && game.heroPowered;
    const hostage = skin === "heroine" && !h.following;
    const talking = h.state === "TALKING";
    const emerging = h.state === "EMERGING";
    const hero = game.hero;
    // The new heroines' artwork faces left; mirror it when she is looking or heading right.
    let flip = skin !== "heroine" && (h.facing || 1) > 0;
    if (talking) flip = hero.x > h.x + 0.2;

    let alpha = 1;
    if (talking) {
      // she steps out of the doorway
      const ev = game.event;
      if (ev) {
        const ox = ev.decoy.c - ev.inner.c;
        const oy = ev.decoy.r - ev.inner.r;
        cx += ox * (1 - h.appear) * s * 0.8;
        footY += oy * (1 - h.appear) * s * 0.8;
      }
      alpha = h.appear;
    }
    let lunge = 0;
    let pop = 1;
    if (h.punchT > 0) {
      const p = 1 - h.punchT / 0.5;
      lunge = Math.sin(p * Math.PI) * s * 0.3 * (h.facing || 1);
      pop = 1 + Math.sin(p * Math.PI) * 0.1;
    }

    const pivotY = (h.y + 0.5) * s;
    for (let i = 0; i < h.trail.length; i += 2) {
      const p = h.trail[i];
      const trailFootY = this.uprightY((p.y + 0.5) * s, pivotY) + FOOT_OFFSET * s;
      this.drawSprite(sprite, (p.x + 0.5) * s, trailFootY, { alpha: ((i + 1) / h.trail.length) * 0.3, flip });
    }
    if (!emerging || h.appear > 0.8) this.drawShadow(cx, footY, s, s * 0.28);
    if (hostage) {
      // Captive: a pulsing gold ring and a call for help.
      ctx.strokeStyle = `rgba(243, 210, 122, ${0.55 + 0.3 * Math.sin(t * 5)})`;
      ctx.lineWidth = Math.max(2, s * 0.08);
      ctx.beginPath();
      ctx.ellipse(cx, footY, s * 0.55 * CHAR_SCALE, s * 0.22 * CHAR_SCALE, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (powered) {
      const pulse = 0.55 + 0.45 * Math.sin(t * 7);
      this.drawSprite(this.sprites[`${skin}Glow`], cx, footY - bob, { alpha: pulse, flip });
    }

    let body = sprite;
    if (talking && skin === "heroine2") {
      body = this.walk.frame(sprite, "heroine2", "talk", t * 5.5); // she waves her hand as she talks
    } else if (h.moving && game.state === "PLAYING") {
      const axis = h.dir === "left" || h.dir === "right" ? "h" : "v";
      body = this.walk.frame(sprite, skin, axis, this.walk.phase(h, t, 8.8 * (game.hero.speed / 4), true));
    } else {
      this.walk.phase(h, t, 0, false);
    }
    const sway = talking ? Math.sin(t * 4) * 0.03 : 0;
    ctx.save();
    if (emerging) {
      // climbing out of the well: only the part above the well's rim shows
      const rim = (h.y + 0.5) * s + s * 0.1;
      ctx.beginPath();
      ctx.rect(cx - s * 2, rim - (sprite?.h || s) * 2, s * 4, (sprite?.h || s) * 2);
      ctx.clip();
      footY += (1 - h.appear) * (sprite?.h || s) * 0.95;
    }
    ctx.globalAlpha = alpha;
    this.drawSprite(body, cx + lunge, footY - bob, { flip, scale: pop, rotate: sway });
    ctx.restore();
    if (powered && game.hero.knives > 0) {
      const b = this.icons.knifeBadge;
      const top = footY - bob - (sprite?.h || s);
      ctx.drawImage(b, cx + s * 0.15, top + s * 0.05);
    }
    if (hostage && game.state === "PLAYING") {
      const top = footY - (sprite?.h || s) - s * 0.2 + Math.sin(t * 6) * s * 0.04;
      ctx.font = `900 ${s * 0.36}px Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = s * 0.07;
      ctx.strokeStyle = "#5a1a1a";
      ctx.strokeText("HELP!", cx, top);
      ctx.fillStyle = "#ffe08a";
      ctx.fillText("HELP!", cx, top);
    }
  }

  /** Speech bubbles over the hero and Heroine 2 while they talk at the first door: they take turns. */
  drawConversation(game, t, s) {
    const ev = game.event;
    if (!ev || ev.type !== "twin") return;
    const turnLen = 1.35;
    const turn = Math.floor(ev.t / turnLen);
    if (ev.t > ev.duration - 0.8) return; // the audio has finished
    const local = (ev.t - turn * turnLen) / turnLen;
    const herTurn = turn % 2 === 0;
    const her = ["!?", "…", "!!", "?!", "…", "!!"];
    const him = ["…", "?", "!", "…", "♥", "?"];
    const speaker = herTurn ? ev.she : game.hero;
    const text = (herTurn ? her : him)[Math.floor(turn / 2) % 6];
    const h = herTurn ? this.sprites.heroine2?.h || s : this.sprites.hero?.h || s;
    const x = (speaker.x + 0.5) * s;
    const y = (speaker.y + 0.5 + FOOT_OFFSET) * s - h - s * 0.25;
    const pop = Math.min(1, local / 0.15);
    const shown = text === "…" ? (Math.floor(t * 4) % 3 === 0 ? "." : Math.floor(t * 4) % 3 === 1 ? ".." : "…") : text;
    this.upright(x, y, () => this.drawBubble(x, y, shown, s, pop, herTurn), { x: true });
  }

  drawBubble(x, y, text, s, pop, flipTail) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.5 + 0.5 * pop, 0.5 + 0.5 * pop);
    ctx.globalAlpha = Math.min(1, pop * 1.4);
    ctx.font = `900 ${s * 0.42}px Georgia, serif`;
    const w = Math.max(s * 0.95, ctx.measureText(text).width + s * 0.5);
    const h = s * 0.62;
    const bx = -w / 2;
    const by = -h - s * 0.12;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#26262b";
    ctx.lineWidth = Math.max(2, s * 0.06);
    ctx.beginPath();
    const rad = h * 0.45;
    ctx.moveTo(bx + rad, by);
    ctx.arcTo(bx + w, by, bx + w, by + h, rad);
    ctx.arcTo(bx + w, by + h, bx, by + h, rad);
    ctx.lineTo(flipTail ? -s * 0.05 : s * 0.3, by + h);
    ctx.lineTo(flipTail ? -s * 0.2 : s * 0.12, by + h + s * 0.22);
    ctx.lineTo(flipTail ? -s * 0.3 : s * 0.0, by + h);
    ctx.arcTo(bx, by + h, bx, by, rad);
    ctx.arcTo(bx, by, bx + w, by, rad);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#26262b";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, by + h / 2 + s * 0.02);
    ctx.restore();
  }

  drawChaser(ch, game, t, s) {
    const { ctx } = this;
    if (!ch.active) return; // e.g. the hostage-taker once it has been thrown out for good
    if (ch.state === "SMASHED" && game.smash) {
      this.drawSmashedCroc(ch, game, s);
      return;
    }
    if (ch.alpha <= 0.01 && ch.state !== "TELEPORTING") return;
    const cx = (ch.x + 0.5) * s;
    const footY = (ch.y + 0.5 + FOOT_OFFSET) * s;
    const stunned = ch.state === "STUNNED";
    const paused = ch.state === "PAUSED";
    const suplexing = ch.state === "SUPLEX";
    // After the crocodile has flown away it stays off-screen until its cooldown ends and it respawns.
    if (stunned && (ch.type === "crocodile" || ch.ko) && ch.throwDirection && ch.throwTimer <= 0) return;
    let alpha = ch.alpha;
    if (ch.type === "creature") {
      const inWall = this.level.maze.type(Math.round(ch.x), Math.round(ch.y)) === "wall";
      alpha *= inWall ? 0.6 : 0.9;
    }
    if (stunned) alpha *= 0.8;
    if (alpha <= 0.01) return;

    const thrown = (ch.type === "crocodile" || ch.ko) && ch.throwTimer > 0 && ch.throwDirection;
    const moving = ch.moving && !paused && !stunned && !suplexing;
    const bob = moving ? Math.abs(Math.sin(t * 12 + ch.x)) * s * 0.04 : 0;
    const sway = ch.type === "creature" ? Math.sin(t * 5) * s * 0.04 : 0;
    const sprite = this.sprites[stunned ? `${ch.type}Stunned` : paused ? `${ch.type}Frozen` : ch.type];
    const flip = (ch.type === "crocodile" || ch.type === "creature") && ch.facing > 0;

    ctx.globalAlpha = alpha;
    if (!thrown && !suplexing && ch.state !== "LEAPING") this.drawShadow(cx, footY, s, s * (ch.type === "shawlMan" ? 0.28 : 0.6));
    ctx.globalAlpha = 1;
    if (suplexing && ch.type === "crocodile") {
      const p = 1 - ch.suplexTimer / ch.suplexDuration;
      const hero = game.hero;
      const heroCx = (hero.x + 0.5) * s;
      const heroFootY = this.uprightY((hero.y + 0.5) * s, (ch.y + 0.5) * s) + FOOT_OFFSET * s;
      const dir = ch.suplexDirection || { x: 1, y: 0 };
      const orbit = p * Math.PI * 1.15;
      const grabX = heroCx + dir.x * Math.cos(orbit) * s * 0.7;
      const grabY = heroFootY - s * (0.45 + Math.sin(p * Math.PI) * 1.2);
      this.drawSprite(sprite, grabX, grabY, {
        flip,
        alpha,
        rotate: orbit * (dir.x >= 0 ? 1 : -1),
      });
    } else if (thrown) {
      const progress = 1 - ch.throwTimer / ch.throwDuration;
      const travel = Math.sin(progress * Math.PI * 0.5) * s * 2.2;
      const lift = Math.sin(progress * Math.PI) * s * 1.35;
      const throwAlpha = alpha * (1 - Math.max(0, progress - 0.75) * 4);
      this.drawSprite(sprite, cx + ch.throwDirection.x * travel, footY - lift, {
        flip,
        alpha: throwAlpha,
        rotate: progress * Math.PI * 2.25 * (ch.throwDirection.x >= 0 ? 1 : -1),
      });
    } else if (ch.state === "LEAPING" && game.flood?.leap?.croc === ch) {
      const k = Math.min(1, game.flood.leap.time / FLOOD_LEAP_SECONDS);
      this.drawSprite(sprite, cx, footY - Math.sin(k * Math.PI) * s * 0.9, { flip, alpha, scale: 1 + Math.sin(k * Math.PI) * 0.2, rotate: (flip ? 0.35 : -0.35) * (1 - k) });
    } else if (ch.type === "crocodile" && game.state === "PLAYING" && game.flood?.crocInSafeZone && game.flood.croc === ch) {
      // Bracing to leap: red glow underneath and a nervous shudder.
      const glow = ctx.createRadialGradient(cx, footY, s * 0.1, cx, footY, s * 1.1);
      glow.addColorStop(0, `rgba(230, 40, 50, ${0.45 + 0.2 * Math.sin(t * 14)})`);
      glow.addColorStop(1, "rgba(230, 40, 50, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.ellipse(cx, footY, s * 1.1, s * 0.45, 0, 0, Math.PI * 2); ctx.fill();
      this.drawSprite(sprite, cx + Math.sin(t * 46) * s * 0.05, footY, { flip, alpha, scale: 1 + 0.04 * Math.sin(t * 14) });
      const top = footY - (sprite?.h || s) - s * 0.35;
      ctx.font = `900 ${s * 0.75}px Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = s * 0.1;
      ctx.strokeStyle = "#7a0d14";
      ctx.strokeText("!", cx, top);
      ctx.fillStyle = "#ff5a5f";
      ctx.fillText("!", cx, top);
    } else {
      // Crawling: its legs paddle, the body ripples and the tail swishes (see walk.js).
      let crawler = sprite;
      if (ch.type === "crocodile" && moving && game.state === "PLAYING") {
        crawler = this.walk.frame(sprite, "croc", "h", this.walk.phase(ch, t, ch.speed * 2.4, true));
      }
      this.drawSprite(crawler, cx + sway, footY - (ch.type === "crocodile" && moving ? bob * 0.35 : bob), { flip, alpha });
    }

    const headY = footY - (sprite?.h || s);
    if (paused) {
      const b = this.icons.eyeBadge;
      ctx.globalAlpha = 0.75 + 0.25 * Math.sin(t * 6);
      ctx.drawImage(b, cx - b.width / 2, headY - b.height * 0.9 + Math.sin(t * 4) * s * 0.05);
      ctx.globalAlpha = 1;
    }
    if (stunned) {
      ctx.fillStyle = "#ffd23f";
      for (let i = 0; i < 3; i++) {
        const a = t * 4 + (i * Math.PI * 2) / 3;
        drawStar(ctx, cx + Math.cos(a) * s * 0.4, headY + Math.sin(a) * s * 0.1, s * 0.12);
      }
    }
  }

  drawEffect(fx, s) {
    const { ctx } = this;
    const k = 1 - fx.time / fx.duration;
    const cx = (fx.x + 0.5) * s;
    const cy = (fx.y + 0.5) * s;
    ctx.globalAlpha = Math.max(0, 1 - k);
    ctx.strokeStyle = fx.color;
    ctx.lineWidth = s * 0.1 * (1 - k) + 1;
    ctx.beginPath();
    ctx.arc(cx, cy, s * (0.3 + k * fx.radius), 0, Math.PI * 2);
    ctx.stroke();
    if (fx.kind === "teleport") {
      ctx.beginPath();
      ctx.arc(cx, cy, s * (0.15 + k * fx.radius * 0.5), 0, Math.PI * 2);
      ctx.stroke();
    }
    if (fx.kind === "impact") {
      // Floor slam: a starburst plus a few drifting dust puffs.
      ctx.lineWidth = Math.max(2, s * 0.08 * (1 - k));
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 + 0.2;
        const r0 = s * (0.25 + k * 0.4);
        const r1 = s * (0.55 + k * fx.radius * 0.6);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * 0.6);
        ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1 * 0.6);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(130, 120, 108, 0.55)";
      for (let i = 0; i < 4; i++) {
        const dir = i < 2 ? -1 : 1;
        ctx.beginPath();
        ctx.arc(cx + dir * s * (0.3 + k * (0.7 + i * 0.25)), cy - s * (0.05 + k * 0.45), s * (0.14 + k * 0.2), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (fx.kind === "crocThrow") {
      ctx.fillStyle = "#f2c14e";
      for (let i = 0; i < 5; i++) {
        const a = i * ((Math.PI * 2) / 5) + k * 5;
        drawStar(ctx, cx + Math.cos(a) * s * (0.25 + k * fx.radius), cy + Math.sin(a) * s * (0.25 + k * fx.radius), s * 0.1 * (1 - k));
      }
    }
    ctx.globalAlpha = 1;
  }
}

export const TELEPORT_FX_DURATION = TELEPORT_EFFECT + 0.25;

/** How the hero's body leans and swells through the crocodile smash (shared by his sprite and his arms). */
function heroSmashLook(pose) {
  const side = pose.phase.endsWith("Left") ? -1 : pose.phase.endsWith("Right") ? 1 : 0;
  const slam = pose.phase.startsWith("slam") ? 1 : pose.phase.startsWith("hold") ? 0.7 : 0.2;
  const scale = pose.phase.startsWith("slam") ? 0.05 : pose.phase === "lift" || pose.phase === "recover" ? 0.03 : 0;
  return { rotate: side * 0.16 * slam, scale };
}

// ---------- helpers ----------

function line(g, x0, y0, x1, y1) {
  g.moveTo(x0, y0);
  g.lineTo(x1, y1);
}

function polyline(g, pts) {
  g.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
}

function diamond(g, cx, cy, r) {
  g.beginPath();
  g.moveTo(cx, cy - r);
  g.lineTo(cx + r, cy);
  g.lineTo(cx, cy + r);
  g.lineTo(cx - r, cy);
  g.closePath();
}

function drawStar(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Pre-scales a character image for the current cell size. Optional glow (silhouette-shaped),
 * tint (kept inside the silhouette) or greyscale. Returns { canvas, w, h, pad }.
 */
function makeSprite(img, s, { glow = null, tint = null, grey = false } = {}) {
  if (!img) return null;
  const aspect = img.width / img.height;
  const w = aspect < 1 ? s * TALL_HEIGHT * aspect : s * WIDE_WIDTH;
  const h = aspect < 1 ? s * TALL_HEIGHT : (s * WIDE_WIDTH) / aspect;
  const pad = glow ? Math.ceil(s * 0.3) : 0;
  const cv = document.createElement("canvas");
  cv.width = Math.ceil(w + pad * 2);
  cv.height = Math.ceil(h + pad * 2);
  const g = cv.getContext("2d");
  g.imageSmoothingQuality = "high";
  if (glow) {
    g.shadowColor = glow;
    g.shadowBlur = s * 0.3;
    g.drawImage(img, pad, pad, w, h);
    g.drawImage(img, pad, pad, w, h);
    g.shadowBlur = 0;
  }
  g.drawImage(img, pad, pad, w, h);
  if (tint) {
    g.globalCompositeOperation = "source-atop";
    g.fillStyle = tint;
    g.fillRect(0, 0, cv.width, cv.height);
  }
  if (grey) {
    g.globalCompositeOperation = "saturation";
    g.fillStyle = "#808080";
    g.fillRect(0, 0, cv.width, cv.height);
    g.globalCompositeOperation = "source-atop";
    g.fillStyle = "rgba(255, 255, 255, 0.25)";
    g.fillRect(0, 0, cv.width, cv.height);
    g.globalCompositeOperation = "destination-in";
    g.drawImage(img, pad, pad, w, h);
  }
  g.globalCompositeOperation = "source-over";
  return { canvas: cv, w, h, pad };
}

/** Scales the hero's body-without-arms and his two arms to the in-game sprite size (null if they could not be cut). */
function buildHeroParts(img, sprite) {
  if (!img || !sprite) return null;
  const split = splitHeroArms(img);
  if (!split) return null;
  const k = sprite.w / split.width;
  const scaled = (src, sw, sh) => {
    const cv = document.createElement("canvas");
    cv.width = Math.max(1, Math.ceil(sw));
    cv.height = Math.max(1, Math.ceil(sh));
    const g = cv.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(src, 0, 0, cv.width, cv.height);
    return cv;
  };
  return {
    // Same size and padding as the normal hero sprite, so it can be drawn in its place.
    body: { canvas: scaled(split.body, sprite.canvas.width, sprite.canvas.height), w: sprite.w, h: sprite.h, pad: sprite.pad },
    arms: split.arms.map((arm) => ({
      canvas: scaled(arm.canvas, arm.canvas.width * k, arm.canvas.height * k),
      ox: arm.ox * k + sprite.pad,
      oy: arm.oy * k + sprite.pad,
      shoulder: { x: arm.shoulder.x * k, y: arm.shoulder.y * k },
      hand: { x: arm.hand.x * k, y: arm.hand.y * k },
    })),
  };
}

/** Collectible icons are drawn procedurally (no extra image requests). */
export function makeIcon(type, px) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = px;
  const g = cv.getContext("2d");
  const s = px;
  g.lineJoin = "round";
  g.lineCap = "round";
  g.fillStyle = "#fffaf0";
  g.strokeStyle = type === "eye" ? "#c2185b" : type === "knife" ? "#2c5f7c" : "#c47a00";
  g.lineWidth = s * 0.07;
  g.beginPath();
  g.arc(s / 2, s / 2, s * 0.44, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  if (type === "eye") {
    // Malaysian guava: a pink fruit with a highlight, a dark calyx at the bottom and a leafy stem.
    g.lineWidth = s * 0.04;
    g.strokeStyle = "#2f7a3a";
    g.fillStyle = "#4caf50";
    for (const dir of [-1, 1]) {
      g.beginPath();
      g.moveTo(s * 0.5, s * 0.27);
      g.quadraticCurveTo(s * (0.5 + dir * 0.2), s * 0.12, s * (0.5 + dir * 0.28), s * 0.24);
      g.quadraticCurveTo(s * (0.5 + dir * 0.18), s * 0.34, s * 0.5, s * 0.27);
      g.fill();
      g.stroke();
    }
    g.strokeStyle = "#6b4a2b";
    g.lineWidth = s * 0.05;
    g.beginPath();
    g.moveTo(s * 0.5, s * 0.32);
    g.lineTo(s * 0.5, s * 0.22);
    g.stroke();
    const skin = g.createRadialGradient(s * 0.43, s * 0.5, s * 0.03, s * 0.5, s * 0.58, s * 0.3);
    skin.addColorStop(0, "#ff9ab8");
    skin.addColorStop(0.65, "#e0457b");
    skin.addColorStop(1, "#b8245a");
    g.fillStyle = skin;
    g.strokeStyle = "#8c1745";
    g.lineWidth = s * 0.045;
    g.beginPath();
    g.moveTo(s * 0.5, s * 0.3);
    g.bezierCurveTo(s * 0.66, s * 0.3, s * 0.78, s * 0.45, s * 0.76, s * 0.6);
    g.bezierCurveTo(s * 0.74, s * 0.76, s * 0.62, s * 0.82, s * 0.5, s * 0.82);
    g.bezierCurveTo(s * 0.38, s * 0.82, s * 0.26, s * 0.76, s * 0.24, s * 0.6);
    g.bezierCurveTo(s * 0.22, s * 0.45, s * 0.34, s * 0.3, s * 0.5, s * 0.3);
    g.closePath();
    g.fill();
    g.stroke();
    g.fillStyle = "rgba(255, 255, 255, 0.55)";
    g.beginPath();
    g.ellipse(s * 0.41, s * 0.47, s * 0.07, s * 0.1, -0.5, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#5c1030";
    for (const dx of [-0.05, 0, 0.05]) {
      g.beginPath();
      g.arc(s * (0.5 + dx), s * 0.8, s * 0.018, 0, Math.PI * 2);
      g.fill();
    }
  } else if (type === "knife") {
    g.save();
    g.translate(s / 2, s / 2);
    g.rotate(-Math.PI / 4);
    const blade = g.createLinearGradient(-s * 0.08, 0, s * 0.08, 0);
    blade.addColorStop(0, "#e9f2f7");
    blade.addColorStop(1, "#8fb1c4");
    g.fillStyle = blade;
    g.strokeStyle = "#2c5f7c";
    g.lineWidth = s * 0.035;
    g.beginPath();
    g.moveTo(-s * 0.07, s * 0.05);
    g.lineTo(-s * 0.07, -s * 0.22);
    g.quadraticCurveTo(0, -s * 0.36, s * 0.07, -s * 0.3);
    g.lineTo(s * 0.07, s * 0.05);
    g.closePath();
    g.fill();
    g.stroke();
    g.fillStyle = "#d9a441";
    g.fillRect(-s * 0.14, s * 0.05, s * 0.28, s * 0.06);
    g.fillStyle = "#7a3b1d";
    g.fillRect(-s * 0.05, s * 0.11, s * 0.1, s * 0.2);
    g.restore();
  } else {
    g.fillStyle = "#ffcf3f";
    g.strokeStyle = "#a35f00";
    g.lineWidth = s * 0.04;
    g.beginPath();
    g.moveTo(s * 0.56, s * 0.12);
    g.lineTo(s * 0.26, s * 0.54);
    g.lineTo(s * 0.47, s * 0.54);
    g.lineTo(s * 0.4, s * 0.88);
    g.lineTo(s * 0.74, s * 0.42);
    g.lineTo(s * 0.53, s * 0.42);
    g.closePath();
    g.fill();
    g.stroke();
  }
  return cv;
}

function computeDecor(level) {
  const { maze, hallCenters } = level;
  const rng = mulberry32(level.seed ^ 0x5eed);
  const wall = (c, r) => maze.type(c, r) === "wall";
  const items = [];
  const used = new Set();
  const key = (c, r) => `${c},${r}`;

  hallCenters.forEach((h, i) => {
    items.push({ kind: i % 2 ? "statue" : "fountain", c: h.c, r: h.r });
    used.add(key(h.c, h.r));
  });

  maze.forEachCell((c, r, t) => {
    if (t !== "wall" || used.has(key(c, r))) return;
    const border = c === 0 || r === 0 || c === maze.cols - 1 || r === maze.rows - 1;
    const wallNeighbours = [wall(c - 1, r), wall(c + 1, r), wall(c, r - 1), wall(c, r + 1)].filter(Boolean).length;
    if (!border && (wallNeighbours === 0 || (wallNeighbours === 1 && rng() < 0.35))) {
      items.push({ kind: "pillar", c, r });
      used.add(key(c, r));
      return;
    }
    if (border && r === 0 && c % 4 === 2 && c > 1 && c < maze.cols - 2) {
      items.push({ kind: "balcony", c, r });
      used.add(key(c, r));
      return;
    }
    const floorBelow = !wall(c, r + 1) && maze.type(c, r + 1) !== "door";
    const nearUsed = [[-1, 0], [1, 0], [0, -1], [0, 1], [-2, 0], [2, 0]].some(([dc, dr]) => used.has(key(c + dc, r + dr)));
    if (nearUsed) return;
    if (floorBelow && rng() < 0.14) {
      items.push({ kind: "lamp", c, r });
      used.add(key(c, r));
    } else if (!border && rng() < 0.05) {
      items.push({ kind: "urn", c, r });
      used.add(key(c, r));
    }
  });

  const rugs = [];
  const walkable = (c, r) => maze.type(c, r) === "floor";
  for (let r = 1; r < maze.rows - 1; r++) {
    let start = null;
    for (let c = 1; c <= maze.cols - 1; c++) {
      const corridor = walkable(c, r) && wall(c, r - 1) && wall(c, r + 1);
      if (corridor && start === null) start = c;
      if (!corridor && start !== null) {
        if (c - start >= 4 && rng() < 0.45) rugs.push({ c: start, r, len: c - start, horizontal: true });
        start = null;
      }
    }
  }
  for (let c = 1; c < maze.cols - 1; c++) {
    let start = null;
    for (let r = 1; r <= maze.rows - 1; r++) {
      const corridor = walkable(c, r) && wall(c - 1, r) && wall(c + 1, r);
      if (corridor && start === null) start = r;
      if (!corridor && start !== null) {
        if (r - start >= 4 && rng() < 0.45) rugs.push({ c, r: start, len: r - start, horizontal: false });
        start = null;
      }
    }
  }
  return { items, rugs: rugs.slice(0, 8) };
}

function drawRug(g, rug, s) {
  const pad = s * 0.18;
  const x = rug.c * s + (rug.horizontal ? s * 0.15 : pad);
  const y = rug.r * s + (rug.horizontal ? pad : s * 0.15);
  const w = rug.horizontal ? rug.len * s - s * 0.3 : s - pad * 2;
  const h = rug.horizontal ? s - pad * 2 : rug.len * s - s * 0.3;
  g.fillStyle = C.rug;
  g.fillRect(x, y, w, h);
  g.strokeStyle = C.rugBorder;
  g.lineWidth = Math.max(1, s * 0.04);
  g.strokeRect(x + s * 0.06, y + s * 0.06, w - s * 0.12, h - s * 0.12);
}

function drawRangoli(g, p, s) {
  const cx = (p.c + 0.5) * s;
  const cy = (p.r + 0.5) * s;
  g.save();
  g.globalAlpha = 0.6;
  const colors = [C.gold, "#55555c", C.goldLight];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    g.fillStyle = colors[i % 3];
    g.beginPath();
    g.ellipse(cx + Math.cos(a) * s * 0.24, cy + Math.sin(a) * s * 0.24, s * 0.13, s * 0.07, a, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = C.goldDark;
  g.beginPath();
  g.arc(cx, cy, s * 0.1, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function drawDecor(g, d, s) {
  const x = d.c * s;
  const y = d.r * s;
  const cx = x + s / 2;
  const cy = y + s / 2;
  switch (d.kind) {
    case "pillar": {
      const top = y + s * 0.08;
      const h = s * 0.62;
      g.fillStyle = C.wallFace;
      g.fillRect(cx - s * 0.3, top + s * 0.06, s * 0.6, h);
      g.fillStyle = C.wallTop;
      g.fillRect(cx - s * 0.3, top, s * 0.6, h * 0.8);
      g.strokeStyle = C.gold;
      g.lineWidth = Math.max(1, s * 0.05);
      g.strokeRect(cx - s * 0.3, top, s * 0.6, h * 0.8);
      g.fillStyle = C.gold;
      g.beginPath();
      g.moveTo(cx - s * 0.16, top + h * 0.4);
      g.lineTo(cx, top + h * 0.16);
      g.lineTo(cx + s * 0.16, top + h * 0.4);
      g.lineTo(cx, top + h * 0.64);
      g.closePath();
      g.fill();
      break;
    }
    case "lamp": {
      const ly = y + s * 0.84;
      g.fillStyle = C.goldDark;
      g.fillRect(cx - s * 0.04, y + s * 0.6, s * 0.08, s * 0.16);
      g.fillStyle = "#ffd36b";
      g.beginPath();
      g.arc(cx, ly, s * 0.12, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#fff6d0";
      g.beginPath();
      g.arc(cx, ly - s * 0.02, s * 0.05, 0, Math.PI * 2);
      g.fill();
      break;
    }
    case "urn": {
      g.fillStyle = C.goldDark;
      g.beginPath();
      g.ellipse(cx, cy + s * 0.1, s * 0.2, s * 0.22, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = C.gold;
      g.beginPath();
      g.ellipse(cx - s * 0.03, cy + s * 0.07, s * 0.15, s * 0.17, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = C.wallFace;
      g.fillRect(cx - s * 0.12, cy - s * 0.2, s * 0.24, s * 0.08);
      g.fillStyle = C.goldLight;
      g.fillRect(cx - s * 0.1, cy + s * 0.04, s * 0.2, s * 0.04);
      break;
    }
    case "fountain": {
      const octagon = (r) => {
        g.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = Math.PI / 8 + (i * Math.PI) / 4;
          g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        }
        g.closePath();
      };
      g.fillStyle = C.wallFace;
      octagon(s * 0.42);
      g.fill();
      g.strokeStyle = C.gold;
      g.lineWidth = s * 0.04;
      g.stroke();
      const water = g.createRadialGradient(cx, cy, 0, cx, cy, s * 0.32);
      water.addColorStop(0, "#e9eef1");
      water.addColorStop(1, C.water);
      g.fillStyle = water;
      octagon(s * 0.32);
      g.fill();
      g.fillStyle = C.goldDark;
      g.beginPath();
      g.arc(cx, cy, s * 0.07, 0, Math.PI * 2);
      g.fill();
      break;
    }
    case "statue": {
      g.fillStyle = C.wallFace;
      g.fillRect(cx - s * 0.3, cy + s * 0.12, s * 0.6, s * 0.2);
      g.fillStyle = C.gold;
      g.fillRect(cx - s * 0.3, cy + s * 0.12, s * 0.6, s * 0.04);
      g.fillStyle = C.goldDark;
      g.beginPath();
      g.arc(cx, cy - s * 0.16, s * 0.1, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.moveTo(cx - s * 0.18, cy + s * 0.12);
      g.quadraticCurveTo(cx, cy - s * 0.2, cx + s * 0.18, cy + s * 0.12);
      g.fill();
      break;
    }
    case "balcony": {
      g.fillStyle = C.goldLight;
      g.beginPath();
      g.moveTo(cx - s * 0.3, y + s * 0.74);
      g.lineTo(cx - s * 0.3, y + s * 0.4);
      g.quadraticCurveTo(cx, y + s * 0.05, cx + s * 0.3, y + s * 0.4);
      g.lineTo(cx + s * 0.3, y + s * 0.74);
      g.fill();
      g.fillStyle = C.wallFace;
      g.beginPath();
      g.moveTo(cx - s * 0.18, y + s * 0.74);
      g.lineTo(cx - s * 0.18, y + s * 0.44);
      g.quadraticCurveTo(cx, y + s * 0.2, cx + s * 0.18, y + s * 0.44);
      g.lineTo(cx + s * 0.18, y + s * 0.74);
      g.fill();
      break;
    }
    default:
      break;
  }
}
