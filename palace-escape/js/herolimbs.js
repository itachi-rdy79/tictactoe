/**
 * Splits the hero's own artwork into a body without arms plus the two arms (shoulder to fist), so that during the
 * crocodile smash his OWN arms can be swung up to grip the tail instead of drawing replacement hands.
 *
 * The arms hang free at his sides, so for each row between the shoulders and the fists everything outside the
 * first skin pixel scanning outwards from the torso belongs to that arm. Works on the sprite's pixels directly;
 * returns null if the pixels can't be read (then the game just skips the arm animation).
 */
export function splitHeroArms(img) {
  try {
    const W = img.naturalWidth || img.width;
    const H = img.naturalHeight || img.height;
    if (!W || !H) return null;
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const g = cv.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    const data = g.getImageData(0, 0, W, H);
    const px = data.data;
    const solid = (i) => px[i * 4 + 3] > 100;
    const skin = (x, y) => {
      const i = y * W + x;
      if (px[i * 4 + 3] <= 100) return false;
      const r = px[i * 4];
      const gr = px[i * 4 + 1];
      const b = px[i * 4 + 2];
      return (r > 170 && gr > 95 && gr < 200 && b > 60 && b < 170 && r > gr + 35) || (r > 130 && gr < 95 && b < 95);
    };
    const y0 = Math.floor(0.23 * H);
    const y1 = Math.floor(0.69 * H);
    const masks = [new Uint8Array(W * H), new Uint8Array(W * H)];
    for (let y = y0; y < y1; y++) {
      let left = -1;
      for (let x = Math.floor(0.38 * W); x >= 0; x--) if (skin(x, y)) { left = x; break; }
      if (left >= 0) for (let x = 0; x <= Math.min(W - 1, left + 3); x++) if (solid(y * W + x)) masks[0][y * W + x] = 1;
      let right = -1;
      for (let x = Math.ceil(0.62 * W); x < W; x++) if (skin(x, y)) { right = x; break; }
      if (right >= 0) for (let x = Math.max(0, right - 3); x < W; x++) if (solid(y * W + x)) masks[1][y * W + x] = 1;
    }

    const arms = masks.map((mask) => {
      keepLargest(mask, W, H);
      // Edge pixels the colour cut missed (faint anti-aliasing, and the dark outline under each fist) belong to the arm
      // too, or they would be left hanging on the body. Solid pixels are only taken well outside the torso and hips.
      for (let pass = 0; pass < 4; pass++) {
        const add = [];
        for (let y = y0; y < Math.floor(0.72 * H); y++) for (let x = 1; x < W - 1; x++) {
          const i = y * W + x;
          if (mask[i]) continue;
          const a = px[i * 4 + 3];
          if (a === 0) continue;
          if (a > 100 && !(x < 0.18 * W || x > 0.82 * W)) continue;
          if (mask[i - 1] || mask[i + 1] || mask[i - W] || mask[i + W] || mask[i - W - 1] || mask[i - W + 1] || mask[i + W - 1] || mask[i + W + 1]) add.push(i);
        }
        for (const i of add) mask[i] = 1;
      }
      let minX = W, maxX = -1, minY = H, maxY = -1;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (mask[y * W + x]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      if (maxX < 0) return null;
      const w = maxX - minX + 1;
      const h = maxY - minY + 1;
      const out = document.createElement("canvas");
      out.width = w;
      out.height = h;
      const og = out.getContext("2d");
      const od = og.createImageData(w, h);
      let sx = 0, sy = 0, sn = 0, hx = 0, hy = 0, hn = 0;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const si = (y + minY) * W + (x + minX);
        if (!mask[si]) continue;
        const di = (y * w + x) * 4;
        od.data[di] = px[si * 4];
        od.data[di + 1] = px[si * 4 + 1];
        od.data[di + 2] = px[si * 4 + 2];
        od.data[di + 3] = px[si * 4 + 3];
        if (y >= h * 0.04 && y <= h * 0.12) { sx += x; sy += y; sn++; } // the joint, just under the top of the shoulder
        if (y >= h * 0.86) { hx += x; hy += y; hn++; } // the fist
      }
      og.putImageData(od, 0, 0);
      return {
        canvas: out,
        ox: minX,
        oy: minY,
        shoulder: { x: sx / sn, y: sy / sn },
        hand: { x: hx / hn, y: hy / hn },
      };
    });
    if (!arms[0] || !arms[1]) return null;

    const body = document.createElement("canvas");
    body.width = W;
    body.height = H;
    const bd = new ImageData(new Uint8ClampedArray(px), W, H);
    for (const mask of masks) for (let i = 0; i < W * H; i++) if (mask[i]) bd.data[i * 4 + 3] = 0;
    body.getContext("2d").putImageData(bd, 0, 0);
    return { width: W, height: H, body, arms };
  } catch {
    return null; // e.g. a tainted canvas
  }
}

/** Keeps only the biggest 8-connected blob of a mask. */
function keepLargest(mask, W, H) {
  const seen = new Uint8Array(W * H);
  const queue = new Int32Array(W * H);
  let best = null;
  for (let start = 0; start < W * H; start++) {
    if (!mask[start] || seen[start]) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;
    seen[start] = 1;
    const comp = [];
    while (head < tail) {
      const i = queue[head++];
      comp.push(i);
      const x = i % W;
      const y = (i / W) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const ni = ny * W + nx;
        if (mask[ni] && !seen[ni]) { seen[ni] = 1; queue[tail++] = ni; }
      }
    }
    if (!best || comp.length > best.length) best = comp;
  }
  mask.fill(0);
  if (best) for (const i of best) mask[i] = 1;
}
