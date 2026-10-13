/**
 * Walk and crawl animation built from the EXISTING artwork — no extra drawings.
 *
 * Each sprite gets a small "rig": legs, arms, cloth and a tail described as capsules (a hip point, a foot point, a radius)
 * over the original picture. A few frames of the cycle are made by bending the picture with a smooth mesh warp:
 * a point near a foot swings forward/back and lifts, a point near the hip hardly moves. The frames are cached,
 * so drawing a walking character costs the same as drawing a still one.
 */

const TAU = Math.PI * 2;

/** All coordinates are in the sprite's own pixels (w × h). `h` = moving left/right, `v` = moving up/down. */
export const RIGS = {
  hero1: {
    w: 250,
    h: 512,
    legs: [
      { hx: 98, hy: 330, fx: 52, fy: 488, r: 38, phase: 0 },
      { hx: 160, hy: 330, fx: 222, fy: 482, r: 38, phase: Math.PI },
    ],
    arms: [
      { hx: 52, hy: 160, fx: 16, fy: 325, r: 30, phase: Math.PI },
      { hx: 198, hy: 152, fx: 232, fy: 320, r: 30, phase: 0 },
    ],
    gait: { h: { stride: 27, lift: 30, arm: 20 }, v: { stride: 11, lift: 20, arm: 8 } },
    sway: { y0: 330, amp: 4 },
  },
  hero2: {
    w: 248,
    h: 512,
    legs: [
      { hx: 100, hy: 395, fx: 78, fy: 482, r: 36, phase: 0 },
      { hx: 150, hy: 395, fx: 197, fy: 482, r: 36, phase: Math.PI },
    ],
    arms: [
      { hx: 58, hy: 135, fx: 62, fy: 300, r: 32, phase: Math.PI },
      { hx: 198, hy: 135, fx: 195, fy: 298, r: 32, phase: 0 },
    ],
    cloth: [
      { x0: 0, x1: 90, y0: 300, y1: 430, amp: 11, phase: 0.8 },
      { x0: 158, x1: 248, y0: 300, y1: 430, amp: 11, phase: 0.8 + Math.PI },
    ],
    gait: { h: { stride: 26, lift: 28, arm: 12 }, v: { stride: 11, lift: 19, arm: 5 } },
    sway: { y0: 395, amp: 3.5 },
  },
  heroine: {
    w: 258,
    h: 640,
    legs: [
      { hx: 118, hy: 528, fx: 106, fy: 618, r: 36, phase: 0 },
      { hx: 138, hy: 528, fx: 142, fy: 580, r: 28, phase: Math.PI },
    ],
    skirt: { y0: 255, y1: 525, amp: { h: 16, v: 6 }, phase: 0.5 },
    gait: { h: { stride: 26, lift: 26, arm: 0 }, v: { stride: 11, lift: 18, arm: 0 } },
    sway: { y0: 520, amp: 4 },
  },
  heroine2: {
    w: 308,
    h: 640,
    legs: [
      { hx: 95, hy: 560, fx: 71, fy: 621, r: 36, phase: 0 },
      { hx: 190, hy: 560, fx: 208, fy: 618, r: 36, phase: Math.PI },
    ],
    arms: [{ hx: 250, hy: 230, fx: 288, fy: 365, r: 28, phase: 0 }],
    skirt: { y0: 225, y1: 585, amp: { h: 14, v: 5 }, phase: 0.5 },
    cloth: [{ x0: 0, x1: 140, y0: 200, y1: 540, amp: 12, phase: 0.6 }],
    wave: { hx: 80, hy: 200, fx: 71, fy: 60, r: 42, amp: 16 },
    gait: { h: { stride: 24, lift: 20, arm: 10 }, v: { stride: 10, lift: 15, arm: 5 }, talk: { stride: 0, lift: 0, arm: 0 } },
    sway: { y0: 560, amp: 3 },
  },
  heroine3: {
    w: 273,
    h: 640,
    legs: [
      { hx: 80, hy: 317, fx: 83, fy: 560, r: 38, phase: 0 },
      { hx: 150, hy: 317, fx: 243, fy: 604, r: 38, phase: Math.PI },
    ],
    cloth: [
      { x0: 150, x1: 273, y0: 150, y1: 300, amp: 7, phase: 1 },
      { x0: 0, x1: 60, y0: 90, y1: 260, amp: 5, phase: 2 },
    ],
    gait: { h: { stride: 27, lift: 28, arm: 0 }, v: { stride: 11, lift: 18, arm: 0 }, talk: { stride: 0, lift: 0, arm: 0 } },
    sway: { y0: 317, amp: 3.5 },
  },
  croc: {
    w: 512,
    h: 333,
    legs: [
      { hx: 300, hy: 222, fx: 296, fy: 318, r: 52, phase: 0, pow: 0.9 },
      { hx: 100, hy: 262, fx: 40, fy: 306, r: 46, phase: Math.PI, pow: 0.9 },
      { hx: 468, hy: 205, fx: 482, fy: 278, r: 48, phase: Math.PI, pow: 0.9 },
    ],
    gait: { h: { stride: 34, lift: 26 }, v: { stride: 34, lift: 26 } },
    undulate: { amp: 7 },
    tail: { bx: 430, by: 150, amp: 30 },
  },
};

const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** How strongly point (x, y) follows a limb: 0 away from it, growing from hip (small) to foot (full). */
function capsuleWeight(l, x, y) {
  const vx = l.fx - l.hx;
  const vy = l.fy - l.hy;
  const len2 = vx * vx + vy * vy || 1;
  let t = ((x - l.hx) * vx + (y - l.hy) * vy) / len2;
  if (t < 0) return 0;
  t = Math.min(1, t);
  const d = Math.hypot(x - (l.hx + vx * t), y - (l.hy + vy * t));
  return smooth(1 - d / l.r) * Math.pow(t, l.pow || 1.25);
}

/** Displacement (sprite pixels) of the point (x, y) at walk phase `ph` (radians) moving along `axis`. */
export function displace(rig, x, y, ph, axis) {
  const g = rig.gait[axis] || rig.gait.h;
  let dx = 0;
  let dy = 0;
  for (const l of rig.legs || []) {
    const w = capsuleWeight(l, x, y);
    if (!w) continue;
    const p = ph + l.phase;
    const swing = Math.sin(p);
    const lift = Math.max(0, Math.cos(p));
    if (axis === "h") dx -= swing * g.stride * w; // the artwork faces left, so "forward" is -x
    else dy += swing * g.stride * w;
    dy -= lift * g.lift * w;
  }
  for (const a of rig.arms || []) {
    const w = capsuleWeight(a, x, y);
    if (!w) continue;
    const swing = Math.sin(ph + a.phase);
    if (axis === "h") dx -= swing * g.arm * w;
    else dy += swing * g.arm * w;
  }
  if (rig.skirt) {
    const k = smooth((y - rig.skirt.y0) / (rig.skirt.y1 - rig.skirt.y0));
    dx += Math.sin(ph + rig.skirt.phase) * rig.skirt.amp[axis] * k * k;
  }
  for (const c of rig.cloth || []) {
    const inX = smooth((x - c.x0) / 14) * smooth((c.x1 - x) / 14);
    dx += Math.sin(ph + c.phase) * c.amp * inX * smooth((y - c.y0) / (c.y1 - c.y0));
  }
  if (rig.wave && axis === "talk") {
    // talking with her hands: the raised hand waves from side to side
    const wv = capsuleWeight(rig.wave, x, y);
    dx += Math.sin(ph * 2) * rig.wave.amp * wv;
    dy += Math.sin(ph * 4) * 3 * wv;
  }
  if (rig.sway) dx += Math.sin(ph) * rig.sway.amp * smooth((rig.sway.y0 - y) / rig.sway.y0);
  if (rig.undulate) dy += Math.sin(ph - (x / rig.w) * 5) * rig.undulate.amp;
  if (rig.tail && y < rig.tail.by + 25) {
    const d = Math.hypot(x - rig.tail.bx, y - rig.tail.by);
    dx += Math.sin(ph * 1.0 + d / 70) * rig.tail.amp * smooth((d - 40) / 170);
  }
  return [dx, dy];
}

/** Maps source triangle (s0, s1, s2) onto (d0, d1, d2) and draws it, clipped slightly larger to hide seams. */
function drawTriangle(g, img, s0, s1, s2, d0, d1, d2) {
  const det = (s1[0] - s0[0]) * (s2[1] - s0[1]) - (s2[0] - s0[0]) * (s1[1] - s0[1]);
  if (Math.abs(det) < 1e-6) return;
  const a = ((d1[0] - d0[0]) * (s2[1] - s0[1]) - (d2[0] - d0[0]) * (s1[1] - s0[1])) / det;
  const c = ((d2[0] - d0[0]) * (s1[0] - s0[0]) - (d1[0] - d0[0]) * (s2[0] - s0[0])) / det;
  const b = ((d1[1] - d0[1]) * (s2[1] - s0[1]) - (d2[1] - d0[1]) * (s1[1] - s0[1])) / det;
  const d = ((d2[1] - d0[1]) * (s1[0] - s0[0]) - (d1[1] - d0[1]) * (s2[0] - s0[0])) / det;
  const e = d0[0] - a * s0[0] - c * s0[1];
  const f = d0[1] - b * s0[0] - d * s0[1];
  const cx = (s0[0] + s1[0] + s2[0]) / 3;
  const cy = (s0[1] + s1[1] + s2[1]) / 3;
  const grow = (p) => {
    const vx = p[0] - cx;
    const vy = p[1] - cy;
    const len = Math.hypot(vx, vy) || 1;
    return [p[0] + (vx / len) * 0.7, p[1] + (vy / len) * 0.7];
  };
  const [p0, p1, p2] = [grow(s0), grow(s1), grow(s2)];
  g.save();
  g.setTransform(a, b, c, d, e, f);
  g.beginPath();
  g.moveTo(p0[0], p0[1]);
  g.lineTo(p1[0], p1[1]);
  g.lineTo(p2[0], p2[1]);
  g.closePath();
  g.clip();
  g.drawImage(img, 0, 0);
  g.restore();
}

/**
 * Builds one frame of the cycle from a sprite ({ canvas, w, h, pad }). Returns a sprite-like object that can be drawn
 * in its place (it has a little extra margin all round for limbs that swing out).
 */
export function makeWalkFrame(sprite, rigName, ph, axis) {
  const rig = RIGS[rigName];
  const src = sprite.canvas;
  const k = sprite.w / rig.w; // sprite pixels per rig pixel
  const margin = Math.ceil(Math.max(sprite.w, sprite.h) * 0.08);
  const out = document.createElement("canvas");
  out.width = src.width + margin * 2;
  out.height = src.height + margin * 2;
  const g = out.getContext("2d");
  g.imageSmoothingQuality = "high";

  const gx = rigName === "croc" ? 16 : 10;
  const gy = Math.max(6, Math.round((gx * src.height) / src.width));
  const grid = [];
  for (let j = 0; j <= gy; j++) {
    const row = [];
    for (let i = 0; i <= gx; i++) {
      const u = (i * src.width) / gx;
      const v = (j * src.height) / gy;
      const [dx, dy] = displace(rig, (u - sprite.pad) / k, (v - sprite.pad) / k, ph, axis);
      row.push({ u, v, x: u + dx * k + margin, y: v + dy * k + margin, still: Math.abs(dx * k) + Math.abs(dy * k) < 0.35 });
    }
    grid.push(row);
  }
  for (let j = 0; j < gy; j++) {
    for (let i = 0; i < gx; i++) {
      const p00 = grid[j][i];
      const p10 = grid[j][i + 1];
      const p01 = grid[j + 1][i];
      const p11 = grid[j + 1][i + 1];
      if (p00.still && p10.still && p01.still && p11.still) {
        g.drawImage(src, p00.u, p00.v, p10.u - p00.u, p01.v - p00.v, p00.x - 0.25, p00.y - 0.25, p10.u - p00.u + 0.5, p01.v - p00.v + 0.5);
        continue;
      }
      drawTriangle(g, src, [p00.u, p00.v], [p10.u, p10.v], [p01.u, p01.v], [p00.x, p00.y], [p10.x, p10.y], [p01.x, p01.y]);
      drawTriangle(g, src, [p10.u, p10.v], [p11.u, p11.v], [p01.u, p01.v], [p10.x, p10.y], [p11.x, p11.y], [p01.x, p01.y]);
    }
  }
  return { canvas: out, w: sprite.w, h: sprite.h, pad: sprite.pad + margin };
}

export const WALK_FRAMES = 8;

/** Caches the frames of one cycle per sprite and axis; built the first time they are needed. */
export class WalkCache {
  constructor() {
    this.sets = new Map();
    this.clock = new WeakMap();
  }

  clear() {
    this.sets.clear();
  }

  /** Advances (and returns) an entity's walk phase while it is moving, at `rate` radians per second. */
  phase(entity, t, rate, moving) {
    let rec = this.clock.get(entity);
    if (!rec) {
      rec = { t, ph: Math.random() * TAU };
      this.clock.set(entity, rec);
    }
    const dt = Math.min(0.1, Math.max(0, t - rec.t));
    rec.t = t;
    if (moving) rec.ph = (rec.ph + dt * rate) % TAU;
    return rec.ph;
  }

  frame(sprite, rigName, axis, ph) {
    if (!sprite) return sprite;
    const idx = Math.floor(((ph % TAU) / TAU) * WALK_FRAMES) % WALK_FRAMES;
    return this.frameAt(sprite, rigName, axis, idx);
  }

  /** Frame number `idx` of the cycle (made now if it has not been made yet). */
  frameAt(sprite, rigName, axis, idx) {
    if (!sprite) return sprite;
    const key = `${rigName}:${axis}:${sprite.canvas.width}x${sprite.canvas.height}:${sprite.pad}`;
    let set = this.sets.get(key);
    if (!set) {
      set = new Array(WALK_FRAMES).fill(null);
      this.sets.set(key, set);
    }
    if (!set[idx]) set[idx] = makeWalkFrame(sprite, rigName, (idx / WALK_FRAMES) * TAU, axis);
    return set[idx];
  }

}
