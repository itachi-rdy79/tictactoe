export const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
export const DIR_NAMES = ["up", "down", "left", "right"];
export const OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Grid of cells: "wall" | "floor" | "door" | "spawn" | "collectible".
 * Everything except "wall" is walkable for the hero; the door is off-limits to chasers.
 */
export class Maze {
  constructor(cols, rows, cells) {
    this.cols = cols;
    this.rows = rows;
    this.cells = cells;
  }

  idx(c, r) {
    return r * this.cols + c;
  }

  inBounds(c, r) {
    return c >= 0 && r >= 0 && c < this.cols && r < this.rows;
  }

  type(c, r) {
    return this.inBounds(c, r) ? this.cells[this.idx(c, r)] : "wall";
  }

  setType(c, r, t) {
    this.cells[this.idx(c, r)] = t;
  }

  isWalkable(c, r, forHero = false) {
    const t = this.type(c, r);
    if (t === "wall") return false;
    if (t === "door") return forHero;
    return true;
  }

  canMove(c, r, dir, forHero = false) {
    const d = DIRS[dir];
    return this.isWalkable(c + d.x, r + d.y, forHero);
  }

  /** Breadth-first graph distances from a cell (chaser-walkable cells). -1 = unreachable. */
  distancesFrom(c, r, forHero = false) {
    const n = this.cols * this.rows;
    const dist = new Int16Array(n).fill(-1);
    if (!this.isWalkable(c, r, true)) return dist;
    const queue = new Int32Array(n);
    let head = 0;
    let tail = 0;
    const start = this.idx(c, r);
    dist[start] = 0;
    queue[tail++] = start;
    while (head < tail) {
      const cur = queue[head++];
      const cc = cur % this.cols;
      const cr = (cur - cc) / this.cols;
      for (const name of DIR_NAMES) {
        const d = DIRS[name];
        const nc = cc + d.x;
        const nr = cr + d.y;
        if (!this.isWalkable(nc, nr, forHero)) continue;
        const ni = this.idx(nc, nr);
        if (dist[ni] !== -1) continue;
        dist[ni] = dist[cur] + 1;
        queue[tail++] = ni;
      }
    }
    return dist;
  }

  /** A* over the corridor graph. Returns an array of {c, r} from start (exclusive) to goal (inclusive). */
  findPath(sc, sr, gc, gr, forHero = false) {
    if (sc === gc && sr === gr) return [];
    if (!this.isWalkable(gc, gr, forHero)) return null;
    const n = this.cols * this.rows;
    const g = new Float32Array(n).fill(Infinity);
    const came = new Int32Array(n).fill(-1);
    const closed = new Uint8Array(n);
    const open = new MinHeap();
    const start = this.idx(sc, sr);
    const goal = this.idx(gc, gr);
    g[start] = 0;
    open.push(start, Math.abs(sc - gc) + Math.abs(sr - gr));
    while (open.size) {
      const cur = open.pop();
      if (cur === goal) break;
      if (closed[cur]) continue;
      closed[cur] = 1;
      const cc = cur % this.cols;
      const cr = (cur - cc) / this.cols;
      for (const name of DIR_NAMES) {
        const d = DIRS[name];
        const nc = cc + d.x;
        const nr = cr + d.y;
        if (!this.isWalkable(nc, nr, forHero)) continue;
        const ni = this.idx(nc, nr);
        if (closed[ni]) continue;
        const ng = g[cur] + 1;
        if (ng < g[ni]) {
          g[ni] = ng;
          came[ni] = cur;
          open.push(ni, ng + Math.abs(nc - gc) + Math.abs(nr - gr));
        }
      }
    }
    if (came[goal] === -1) return null;
    const path = [];
    for (let cur = goal; cur !== start; cur = came[cur]) {
      const c = cur % this.cols;
      path.push({ c, r: (cur - c) / this.cols });
    }
    return path.reverse();
  }

  forEachCell(fn) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) fn(c, r, this.cells[this.idx(c, r)]);
    }
  }
}

class MinHeap {
  constructor() {
    this.items = [];
    this.prio = [];
  }

  get size() {
    return this.items.length;
  }

  push(item, p) {
    const { items, prio } = this;
    items.push(item);
    prio.push(p);
    let i = items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (prio[parent] <= prio[i]) break;
      [items[i], items[parent]] = [items[parent], items[i]];
      [prio[i], prio[parent]] = [prio[parent], prio[i]];
      i = parent;
    }
  }

  pop() {
    const { items, prio } = this;
    const top = items[0];
    const lastItem = items.pop();
    const lastPrio = prio.pop();
    if (items.length) {
      items[0] = lastItem;
      prio[0] = lastPrio;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < items.length && prio[l] < prio[m]) m = l;
        if (r < items.length && prio[r] < prio[m]) m = r;
        if (m === i) break;
        [items[i], items[m]] = [items[m], items[i]];
        [prio[i], prio[m]] = [prio[m], prio[i]];
        i = m;
      }
    }
    return top;
  }
}
