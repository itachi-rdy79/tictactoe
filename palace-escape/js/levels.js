import { Maze, DIRS, DIR_NAMES, mulberry32 } from "./maze.js";
import { MIN_SAFE_DISTANCE, SAFE_SECONDS, HERO_BASE_SPEED, SHAWL_APPEAR_SECONDS, CHASER_SPEED_SCALE, FLOOD_SAFE_RADIUS_SCALE } from "./config.js";

/**
 * Reusable maze layouts. Mazes are generated deterministically from a seed (recursive backtracker),
 * then "braided" (dead ends removed → loops) and given a few pillared halls.
 * braid: share of dead ends removed (1 = no dead ends → easiest to evade in).
 */
const LAYOUTS = {
  A: { cols: 17, rows: 13, seed: 1101, braid: 1.0, halls: 1, spawn: "bl" },
  B: { cols: 19, rows: 15, seed: 2203, braid: 0.92, halls: 1, spawn: "bl" },
  C: { cols: 23, rows: 17, seed: 3307, braid: 0.9, halls: 2, spawn: "bl" },
  D: { cols: 25, rows: 19, seed: 4409, braid: 0.95, halls: 3, spawn: "bl" },
  E: { cols: 25, rows: 19, seed: 5501, braid: 0.88, halls: 3, spawn: "tl" },
  F: { cols: 25, rows: 19, seed: 6607, braid: 0.85, halls: 3, spawn: "br" },
};

/**
 * Level definitions. Each level adds one small step of difficulty over the previous one:
 * 1-3 a lone crocodile in growing mazes, 4 the Creature, 5 power-ups, 6 the Shawl Man,
 * 7-10 slightly faster chasers, trickier layouts and more frequent teleports.
 * Speeds here are pre-CHASER_SPEED_SCALE. doorRank: 0 = door at the farthest exit from spawn, higher = closer.
 */
export const LEVELS = [
  {
    level: 1, difficulty: 1, layout: "A", doorRank: 0.2,
    chasers: [{ type: "crocodile", speed: 2.7, spawn: "far" }],
  },
  {
    level: 2, difficulty: 2, layout: "B", doorRank: 0,
    chasers: [{ type: "crocodile", speed: 2.9, spawn: "far" }],
  },
  {
    level: 3, difficulty: 3, layout: "C", doorRank: 0,
    chasers: [{ type: "crocodile", speed: 3.0, spawn: "far" }],
  },
  {
    level: 4, difficulty: 4, layout: "C", doorRank: 0,
    chasers: [
      { type: "crocodile", speed: 3.0, spawn: "far" },
      { type: "creature", speed: 2.2, spawn: "remote" },
    ],
  },
  {
    level: 5, difficulty: 4, layout: "D", doorRank: 0.15,
    chasers: [
      { type: "crocodile", speed: 3.0, spawn: "far" },
      { type: "creature", speed: 2.3, spawn: "remote" },
    ],
    collectibles: { types: ["eye", "knife", "boost", "eye", "boost"], placement: "spread" },
  },
  {
    level: 6, difficulty: 5, layout: "D", doorRank: 0.15,
    chasers: [
      { type: "crocodile", speed: 3.1, spawn: "far" },
      { type: "creature", speed: 2.3, spawn: "remote" },
      { type: "shawlMan", spawn: "far", interval: [6, 8], lurk: 0.6, ambush: 0 },
    ],
    collectibles: { types: ["knife", "eye", "boost", "knife", "eye"], placement: "spread" },
  },
  {
    level: 7, difficulty: 6, layout: "E", doorRank: 0.1,
    chasers: [
      { type: "crocodile", speed: 3.1, spawn: "far" },
      { type: "creature", speed: 2.4, spawn: "remote" },
      { type: "shawlMan", spawn: "far", interval: [5.5, 7.5], lurk: 0.7, ambush: 0 },
    ],
    collectibles: { types: ["boost", "eye", "knife", "boost", "knife"], placement: "spread" },
  },
  {
    level: 8, difficulty: 7, layout: "E", doorRank: 0.05,
    chasers: [
      { type: "crocodile", speed: 3.2, spawn: "far" },
      { type: "creature", speed: 2.4, spawn: "remote" },
      { type: "shawlMan", spawn: "far", interval: [5, 7], lurk: 0.8, ambush: 0.05 },
    ],
    collectibles: { types: ["eye", "knife", "boost", "eye", "knife"], placement: "spread" },
  },
  {
    level: 9, difficulty: 8, layout: "F", doorRank: 0.1,
    chasers: [
      { type: "crocodile", speed: 3.2, spawn: "nearDoor" },
      { type: "creature", speed: 2.5, spawn: "remote" },
      { type: "shawlMan", spawn: "far", interval: [4.5, 6.5], lurk: 0.9, ambush: 0.1 },
    ],
    collectibles: { types: ["knife", "boost", "eye", "knife", "boost"], placement: "spread" },
  },
  {
    level: 10, difficulty: 9, layout: "F", doorRank: 0.05,
    chasers: [
      { type: "crocodile", speed: 3.3, spawn: "far" },
      { type: "creature", speed: 2.5, spawn: "remote" },
      { type: "shawlMan", spawn: "far", interval: [4.5, 6], lurk: 1.0, ambush: 0.15 },
    ],
    collectibles: { types: ["eye", "knife", "boost", "knife", "eye", "boost"], placement: "spread" },
  },
];

export const COLLECTIBLES_FROM_LEVEL = 5;

const ENDLESS_SPAWNS = ["tl", "br", "bl", "tr"];
const ENDLESS_POWERS = ["eye", "knife", "boost", "knife", "eye", "boost"];
/**
 * Levels never end: past the hand-tuned ones, levels are generated from the level number.
 * Difficulty creeps up slowly from Level 10's values and is capped so every level stays winnable.
 */
export function getLevelDef(n) {
  const k = Math.max(0, n - 1);
  if (k < LEVELS.length) return LEVELS[k];
  const lerp = (from, to, steps, startK = 0) => from + (to - from) * Math.min(1, Math.max(0, k - startK) / steps);
  const chasers = [
    { type: "crocodile", speed: +lerp(2.7, 3.9, 40).toFixed(2), spawn: "far" },
    { type: "creature", speed: +lerp(2.1, 3.0, 40).toFixed(2), spawn: "remote" },
    {
      type: "shawlMan",
      spawn: "far",
      interval: [+lerp(6, 3, 40).toFixed(2), +lerp(8, 5, 40).toFixed(2)],
      lurk: +lerp(0.5, 1.4, 40).toFixed(2),
      ambush: +lerp(0, 0.35, 40).toFixed(2),
    },
  ];
  // Past level 10 the palace fills up: one more chaser every two levels (12, 14, 16) until there are six in all.
  // Each new chaser is a second Crocodile, then a second Dhayyam, then a second Thatha.
  const extra = Math.min(3, Math.max(0, Math.floor((n - 10) / 2)));
  const powers = [...ENDLESS_POWERS];
  const newcomers = [
    { type: "crocodile", speed: +(lerp(2.7, 3.9, 40) * 0.96).toFixed(2), spawn: "flank" },
    { type: "creature", speed: +(lerp(2.1, 3.0, 40) * 0.96).toFixed(2), spawn: "remote" },
    { ...chasers[2], spawn: "far" },
  ];
  for (let i = 0; i < extra; i++) {
    chasers.push(newcomers[i]);
    // ...and every extra chaser brings two more power-ups: a Knife and a Malaysian Jamakay / Boost, alternately.
    powers.push("knife", i % 2 === 0 ? "eye" : "boost");
  }
  return {
    level: n,
    difficulty: Math.min(14, 1 + Math.floor(k / 4)),
    layout: {
      cols: 25,
      rows: 19,
      seed: 7001 + n * 7919,
      braid: +lerp(0.9, 0.75, 25).toFixed(2),
      halls: 3,
      spawn: ENDLESS_SPAWNS[n % ENDLESS_SPAWNS.length],
    },
    doorRank: [0.05, 0.1, 0.08][n % 3],
    interceptSlack: +lerp(-0.6, 1.5, 25).toFixed(2),
    chasers,
    collectibles: { types: powers, placement: "spread" },
  };
}

const cache = new Map();

/** Builds (and validates) a level. portrait=true transposes the maze so it fits tall screens. */
export function buildLevel(levelNumber, portrait, runSeed = null) {
  const key = `${levelNumber}:${portrait ? "p" : "l"}:${runSeed ?? "default"}`;
  if (!cache.has(key)) {
    const base = buildLandscape(levelNumber, runSeed);
    cache.set(key, portrait ? transposeLevel(base) : base);
  }
  return cloneLevel(cache.get(key));
}

/** Creates one reproducible, bounded trap configuration for a generated level. */
/** Everything a level can throw at the hero from level 2 on: the eight traps and the Clear Passage round. */
export const TRAP_CYCLE = ["train", "well", "water", "lights", "reverse", "rotate", "hiddenDoor", "twoDoors", "clear"];

/** The hardest round: it always comes last in a cycle, after every other round has been dealt. */
const LAST_IN_CYCLE = "reverse";

/**
 * Shuffle-bag draw: every trap (and Clear Passage) is dealt once before any of them comes round again, and the
 * same round never repeats back-to-back, including across the end of one cycle and the start of the next.
 * Reversed Controls is the exception to the shuffle: it is held back until it is the only round left, so it
 * is always the LAST round of each cycle. `bag` is what is left of the current cycle; returns the pick and the
 * bag that remains.
 */
export function drawFromCycle(bag, previous, rng, cycle = TRAP_CYCLE) {
  let pool = Array.isArray(bag) ? bag.filter((id) => cycle.includes(id)) : [];
  if (!pool.length) pool = [...cycle];
  const dealable = pool.filter((id) => id !== LAST_IN_CYCLE);
  const candidates = dealable.length ? dealable : pool;
  const choices = candidates.filter((id) => id !== previous);
  const from = choices.length ? choices : candidates;
  const pick = from[Math.floor(rng() * from.length)];
  const i = pool.indexOf(pick);
  return { id: pick, bag: [...pool.slice(0, i), ...pool.slice(i + 1)] };
}

/** The eight traps, with no Clear Passage: levels 2-9 deal exactly these, so by level 10 every trap has been played. */
export const OPENING_TRAPS = TRAP_CYCLE.filter((id) => id !== "clear");

/**
 * The round for a level. Level 1 is always Clear Passage; levels 2-9 deal each trap once; then the shuffle bag
 * (see drawFromCycle). `bag` / `previousTrap` are the saved cycle state; the new bag comes back on the result.
 */
export function createTrap(level, { previousTrap = null, bag = null, seed = level.seed } = {}) {
  const rng = mulberry32(seed ^ 0x9e3779b9);
  if (level.number === 1) return { id: null, config: {}, streak: 0, bag: Array.isArray(bag) ? bag : [] };
  // Level 1 is always Clear Passage. Levels 2-9 deal the eight traps once each: seven shuffled, with Reversed
  // Controls last (level 9). From level 10 on the full shuffle (traps + Clear Passage) takes over.
  const opening = level.number >= 2 && level.number <= 9;
  const drawn = drawFromCycle(level.number === 2 ? [] : bag, previousTrap ?? "clear", rng, opening ? OPENING_TRAPS : TRAP_CYCLE);
  if (drawn.id === "clear") return { id: null, config: {}, streak: 0, bag: drawn.bag };
  const id = drawn.id;
  const route = level.route?.length ? level.route : [level.heroSpawn];
  const floors = [];
  level.maze.forEachCell((c, r, type) => {
    if (type === "floor" && Math.abs(c - level.heroSpawn.c) + Math.abs(r - level.heroSpawn.r) > 3) floors.push({ c, r });
  });
  const pick = (list = floors) => list[Math.floor(rng() * list.length)] || level.heroSpawn;
  const along = (portion) => route[Math.min(route.length - 1, Math.max(1, Math.floor(route.length * portion)))] || pick();
  const config = {};
  if (id === "train") config.switch = pick(floors.filter((p) => Math.abs(p.c - level.door.c) + Math.abs(p.r - level.door.r) > 5));
  if (id === "well") config.wellDelay = 2.5 + rng() * 2;
  // Flooded Maze: the safe zone is 20% smaller than the original 5-7 cell radius.
  if (id === "water") config.safeRadius = +((5 + Math.floor(rng() * 3)) * FLOOD_SAFE_RADIUS_SCALE).toFixed(2);
  if (id === "lights") config.radius = 7 + Math.floor(rng() * 3);
  if (id === "rotate") config.interval = 10;
  if (id === "twoDoors") {
    const doors = [];
    const { maze } = level;
    const { cols, rows } = maze;
    for (let c = 1; c < cols - 1; c++) {
      if (maze.isWalkable(c, 1)) doors.push({ c, r: 0 });
      if (maze.isWalkable(c, rows - 2)) doors.push({ c, r: rows - 1 });
    }
    for (let r = 1; r < rows - 1; r++) {
      if (maze.isWalkable(1, r)) doors.push({ c: 0, r });
      if (maze.isWalkable(cols - 2, r)) doors.push({ c: cols - 1, r });
    }
    const far = doors.filter((p) => Math.abs(p.c - level.door.c) + Math.abs(p.r - level.door.r) > 6);
    const options = far.length ? far : doors.filter((p) => p.c !== level.door.c || p.r !== level.door.r);
    // Both doors look the same: the FIRST one the hero opens is Heroine 2's, whichever it is, and the other is the
    // way out (see Game.beginTwinEvent). Keep the second door away from the start so he never walks straight into it.
    const fromSpawn = maze.distancesFrom(level.heroSpawn.c, level.heroSpawn.r);
    const innerOf = (p) => {
      const ic = p.c === 0 ? 1 : p.c === cols - 1 ? cols - 2 : p.c;
      const ir = p.r === 0 ? 1 : p.r === rows - 1 ? rows - 2 : p.r;
      return { c: ic, r: ir };
    };
    const distTo = (p) => {
      const i = innerOf(p);
      return fromSpawn[maze.idx(i.c, i.r)];
    };
    const roomy = options.filter((p) => distTo(p) >= 8);
    const pool = roomy.length ? roomy : options;
    config.decoyDoor = pool[Math.floor(rng() * pool.length)];
    config.pair = { decoy: { c: config.decoyDoor.c, r: config.decoyDoor.r }, exit: { c: level.door.c, r: level.door.r } };
    applyTrapToLevel(level, { id, config });
  }
  return { id, config, streak: 0, bag: drawn.bag, portrait: level.maze.rows > level.maze.cols };
}

/** Re-applies a trap's maze edits to a freshly built (or re-oriented) copy of the same level. */
export function applyTrapToLevel(level, trap) {
  const portrait = level.maze.rows > level.maze.cols;
  if (trap.portrait !== undefined && trap.portrait !== portrait) {
    const swap = (p) => (p && Number.isFinite(p.c) ? { ...p, c: p.r, r: p.c } : p);
    for (const [key, value] of Object.entries(trap.config)) {
      trap.config[key] = Array.isArray(value) ? value.map(swap) : swap(value);
    }
    trap.portrait = portrait;
  }
  const decoy = trap.id === "twoDoors" && trap.config.decoyDoor;
  if (decoy) {
    level.maze.setType(decoy.c, decoy.r, "door");
    addDoorPartner(level.maze, decoy);
  }
}

function buildLandscape(levelNumber, runSeed = null) {
  const def = getLevelDef(levelNumber);
  const layout = typeof def.layout === "string" ? LAYOUTS[def.layout] : def.layout;
  let lastErrors = [];
  let fallback = null;
  for (let attempt = 0; attempt < 120; attempt++) {
    const seed = (runSeed ?? layout.seed) + attempt * 7919;
    const level = assemble(def, layout, seed);
    const errors = validateLevel(level);
    if (!errors.length) {
      fallback = fallback || level;
      errors.push(...crocInterceptErrors(level));
    }
    if (!errors.length) return level;
    lastErrors = errors;
  }
  if (fallback) return fallback;
  console.error(`[levels] Level ${levelNumber} failed validation`, lastErrors);
  throw new Error(`Level ${levelNumber} could not be generated`);
}

function assemble(def, layout, seed) {
  const rng = mulberry32(seed);
  const { cols, rows } = layout;
  const { cells, hallCenters } = generateGrid(cols, rows, rng, layout.braid, layout.halls);
  const maze = new Maze(cols, rows, cells);

  const heroSpawn = nearestFloor(maze, cornerPoint(layout.spawn, cols, rows));
  const heroDist = maze.distancesFrom(heroSpawn.c, heroSpawn.r);
  const door = placeDoor(maze, heroDist, def.doorRank);
  maze.setType(door.c, door.r, "door");
  addDoorPartner(maze, door);

  const doorInner = door.inner;
  const doorDist = maze.distancesFrom(doorInner.c, doorInner.r);
  const mainPath = [heroSpawn, ...(maze.findPath(heroSpawn.c, heroSpawn.r, doorInner.c, doorInner.r) || [])];
  const pathDist = multiSourceDistances(maze, mainPath);
  const ctx = { maze, rng, heroSpawn, heroDist, doorDist, mainPath, pathDist, taken: [heroSpawn] };

  const chasers = def.chasers.map((cfg) => {
    const pos = placeChaser(ctx, cfg);
    if (!pos) return { ...cfg, c: null, r: null };
    ctx.taken.push(pos);
    return { ...cfg, c: pos.c, r: pos.r };
  });

  const collectibles = [];
  if (def.collectibles) {
    for (const type of def.collectibles.types) {
      const pos = placeCollectible(ctx, def.collectibles.placement, collectibles);
      if (pos) {
        collectibles.push({ type, c: pos.c, r: pos.r });
        maze.setType(pos.c, pos.r, "collectible");
      }
    }
  }
  maze.setType(heroSpawn.c, heroSpawn.r, "spawn");

  return {
    number: def.level,
    difficulty: def.difficulty,
    def,
    seed,
    maze,
    heroSpawn,
    door: { c: door.c, r: door.r },
    route: mainPath,
    chasers,
    collectibles,
    hallCenters,
    collectiblesEnabled: true,
  };
}

function generateGrid(cols, rows, rng, braid, halls) {
  const cells = new Array(cols * rows).fill("wall");
  const at = (c, r) => cells[r * cols + c];
  const set = (c, r, v) => {
    cells[r * cols + c] = v;
  };
  const interior = (c, r) => c > 0 && r > 0 && c < cols - 1 && r < rows - 1;

  const startC = 1 + 2 * Math.floor(rng() * ((cols - 1) / 2));
  const startR = 1 + 2 * Math.floor(rng() * ((rows - 1) / 2));
  const stack = [[startC, startR]];
  set(startC, startR, "floor");
  while (stack.length) {
    const [c, r] = stack[stack.length - 1];
    const options = DIR_NAMES.map((n) => DIRS[n]).filter(
      (d) => interior(c + d.x * 2, r + d.y * 2) && at(c + d.x * 2, r + d.y * 2) === "wall",
    );
    if (!options.length) {
      stack.pop();
      continue;
    }
    const d = options[Math.floor(rng() * options.length)];
    set(c + d.x, r + d.y, "floor");
    set(c + d.x * 2, r + d.y * 2, "floor");
    stack.push([c + d.x * 2, r + d.y * 2]);
  }

  const hallCenters = [];
  for (let i = 0, tries = 0; i < halls && tries < 60; tries++) {
    const hc = 2 + 2 * Math.floor(rng() * ((cols - 3) / 2));
    const hr = 2 + 2 * Math.floor(rng() * ((rows - 3) / 2));
    if (hc < 2 || hr < 2 || hc > cols - 3 || hr > rows - 3) continue;
    if (hallCenters.some((h) => Math.abs(h.c - hc) < 5 && Math.abs(h.r - hr) < 5)) continue;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) if (dc || dr) set(hc + dc, hr + dr, "floor");
    }
    hallCenters.push({ c: hc, r: hr });
    i++;
  }

  const floorNeighbours = (c, r) =>
    DIR_NAMES.filter((n) => at(c + DIRS[n].x, r + DIRS[n].y) !== "wall").length;
  const deadEnds = [];
  for (let r = 1; r < rows - 1; r += 2) {
    for (let c = 1; c < cols - 1; c += 2) if (floorNeighbours(c, r) === 1) deadEnds.push({ c, r });
  }
  shuffle(deadEnds, rng);
  for (const { c, r } of deadEnds) {
    if (floorNeighbours(c, r) !== 1 || rng() >= braid) continue;
    const candidates = DIR_NAMES.map((n) => DIRS[n]).filter((d) => {
      const wc = c + d.x;
      const wr = r + d.y;
      return interior(wc, wr) && at(wc, wr) === "wall" && interior(c + d.x * 2, r + d.y * 2);
    });
    if (!candidates.length) continue;
    const preferred = candidates.filter((d) => floorNeighbours(c + d.x * 2, r + d.y * 2) === 1);
    const pool = preferred.length ? preferred : candidates;
    const d = pool[Math.floor(rng() * pool.length)];
    set(c + d.x, r + d.y, "floor");
  }
  return { cells, hallCenters };
}

function cornerPoint(name, cols, rows) {
  switch (name) {
    case "tl": return { c: 1, r: 1 };
    case "tr": return { c: cols - 2, r: 1 };
    case "br": return { c: cols - 2, r: rows - 2 };
    case "center": return { c: Math.floor(cols / 2), r: Math.floor(rows / 2) };
    default: return { c: 1, r: rows - 2 };
  }
}

function nearestFloor(maze, p, filter = () => true) {
  let best = null;
  let bestD = Infinity;
  maze.forEachCell((c, r, t) => {
    if (t === "wall" || t === "door" || !filter(c, r)) return;
    const d = (c - p.c) ** 2 + (r - p.r) ** 2;
    if (d < bestD) {
      bestD = d;
      best = { c, r };
    }
  });
  return best;
}

/** The tile just inside a border tile (the one in front of it). */
function borderInner(maze, p) {
  const { cols, rows } = maze;
  return { c: p.c === 0 ? 1 : p.c === cols - 1 ? cols - 2 : p.c, r: p.r === 0 ? 1 : p.r === rows - 1 ? rows - 2 : p.r };
}

/**
 * The exit is TWO tiles wide: the door tile and one neighbour along the same wall, and walking into either one
 * leaves the level. The partner is always an ordinary wall tile (never a corner, so the gate can never spill onto
 * one), and one that already has an open tile in front of it, so the hero can always reach it. Returns null only
 * if the wall is too short to have one.
 */
export function doorPartner(maze, door) {
  const { cols, rows } = maze;
  const horizontal = door.r === 0 || door.r === rows - 1; // a door in the top or bottom wall runs along the columns
  const len = horizontal ? cols : rows;
  const along = horizontal ? door.c : door.r;
  const at = (a) => (horizontal ? { c: a, r: door.r } : { c: door.c, r: a });
  const options = [along + 1, along - 1].filter((a) => a >= 1 && a <= len - 2).map(at);
  const open = options.find((p) => {
    const i = borderInner(maze, p);
    return maze.isWalkable(i.c, i.r);
  });
  return open || options[0] || null;
}

/** Makes the neighbouring tile a door too (opening the tile in front of it if it was a wall). */
export function addDoorPartner(maze, door) {
  const partner = doorPartner(maze, door);
  if (!partner) return null;
  const inner = borderInner(maze, partner);
  if (maze.type(inner.c, inner.r) === "wall") maze.setType(inner.c, inner.r, "floor");
  maze.setType(partner.c, partner.r, "door");
  return partner;
}

function placeDoor(maze, heroDist, rank) {
  const { cols, rows } = maze;
  const options = [];
  maze.forEachCell((c, r) => {
    const onBorder = c === 0 || r === 0 || c === cols - 1 || r === rows - 1;
    const corner = (c === 0 || c === cols - 1) && (r === 0 || r === rows - 1);
    if (!onBorder || corner) return;
    const inner = { c: c === 0 ? 1 : c === cols - 1 ? cols - 2 : c, r: r === 0 ? 1 : r === rows - 1 ? rows - 2 : r };
    if (maze.type(inner.c, inner.r) === "wall") return;
    const d = heroDist[maze.idx(inner.c, inner.r)];
    if (d > 0) options.push({ c, r, inner, d });
  });
  options.sort((a, b) => b.d - a.d);
  return options[Math.min(options.length - 1, Math.floor(rank * (options.length - 1)))];
}

function multiSourceDistances(maze, sources) {
  const dist = new Int16Array(maze.cols * maze.rows).fill(-1);
  const queue = [];
  for (const s of sources) {
    const i = maze.idx(s.c, s.r);
    if (dist[i] === -1) {
      dist[i] = 0;
      queue.push(s);
    }
  }
  for (let h = 0; h < queue.length; h++) {
    const { c, r } = queue[h];
    for (const n of DIR_NAMES) {
      const nc = c + DIRS[n].x;
      const nr = r + DIRS[n].y;
      if (!maze.isWalkable(nc, nr)) continue;
      const ni = maze.idx(nc, nr);
      if (dist[ni] !== -1) continue;
      dist[ni] = dist[maze.idx(c, r)] + 1;
      queue.push({ c: nc, r: nr });
    }
  }
  return dist;
}

/**
 * A crocodile must not reach the hero's shortest route to the door more than `def.interceptSlack`
 * seconds before the hero does (default: never; it must arrive 0.6 s after).
 * Crocs deliberately placed by the door ("nearDoor") or on the route ("mid") are exempt.
 */
function crocInterceptErrors(level) {
  const { maze, heroSpawn, door } = level;
  const slack = level.def.interceptSlack ?? -0.6;
  const inner = {
    c: Math.min(maze.cols - 2, Math.max(1, door.c)),
    r: Math.min(maze.rows - 2, Math.max(1, door.r)),
  };
  const route = [heroSpawn, ...(maze.findPath(heroSpawn.c, heroSpawn.r, inner.c, inner.r) || [])];
  const errors = [];
  for (const ch of level.chasers) {
    if (ch.type !== "crocodile" || ch.c == null) continue;
    if (ch.spawn === "nearDoor" || ch.spawn === "mid") continue;
    const dist = maze.distancesFrom(ch.c, ch.r);
    const hit = route.findIndex((p, i) => {
      const d = dist[maze.idx(p.c, p.r)];
      return d >= 0 && d / (ch.speed * CHASER_SPEED_SCALE) < i / HERO_BASE_SPEED - slack;
    });
    if (hit >= 0) errors.push(`crocodile at ${ch.c},${ch.r} intercepts route at step ${hit}`);
  }
  return errors;
}

function placeChaser(ctx, cfg) {
  const { maze, rng, heroSpawn, heroDist, doorDist, mainPath, pathDist, taken } = ctx;
  const minGraph = MIN_SAFE_DISTANCE;
  const creatureMin = Math.max(8, (cfg.speed || 2.5) * SAFE_SECONDS);
  const safe = (c, r) => {
    const i = maze.idx(c, r);
    if (heroDist[i] < 0) return false;
    if (taken.some((t) => Math.abs(t.c - c) + Math.abs(t.r - r) < 3)) return false;
    if (cfg.type === "creature") return Math.hypot(c - heroSpawn.c, r - heroSpawn.r) >= creatureMin;
    return heroDist[i] >= minGraph;
  };
  const candidates = [];
  maze.forEachCell((c, r, t) => {
    if (t === "floor" && safe(c, r)) candidates.push({ c, r, i: maze.idx(c, r) });
  });
  if (!candidates.length) return null;

  const [mode, corner] = cfg.spawn.split(":");
  let pool = [];
  if (mode === "corner") {
    const p = cornerPoint(corner, maze.cols, maze.rows);
    const best = nearestFloor(maze, p, (c, r) => safe(c, r));
    if (best) return best;
  } else if (mode === "remote") {
    const routeGap = (x) => Math.min(...mainPath.map((p) => Math.hypot(p.c - x.c, p.r - x.r)));
    const scored = candidates.map((x) => ({ ...x, gap: routeGap(x) })).sort((a, b) => b.gap - a.gap);
    pool = scored.slice(0, Math.max(1, Math.ceil(scored.length * 0.06)));
  } else if (mode === "nearDoor") {
    pool = candidates.filter((x) => doorDist[x.i] >= 4 && doorDist[x.i] <= 8 && heroDist[x.i] >= minGraph + 2);
  } else if (mode === "mid") {
    const lo = Math.floor(mainPath.length * 0.45);
    const hi = Math.floor(mainPath.length * 0.75);
    const segment = new Set(mainPath.slice(lo, hi).map((p) => maze.idx(p.c, p.r)));
    pool = candidates.filter((x) => {
      if (pathDist[x.i] < 2 || pathDist[x.i] > 5) return false;
      return [...segment].some((s) => {
        const sc = s % maze.cols;
        const sr = (s - sc) / maze.cols;
        return Math.abs(sc - x.c) + Math.abs(sr - x.r) <= pathDist[x.i] + 1;
      });
    });
  } else if (mode === "flank") {
    const sorted = candidates
      .filter((x) => doorDist[x.i] >= 10 && pathDist[x.i] >= 3)
      .sort((a, b) => heroDist[b.i] - heroDist[a.i]);
    pool = sorted.slice(0, Math.max(1, Math.ceil(sorted.length * 0.25)));
  } else {
    const sorted = candidates.filter((x) => doorDist[x.i] >= 6).sort((a, b) => heroDist[b.i] - heroDist[a.i]);
    pool = sorted.slice(0, Math.max(1, Math.ceil(sorted.length * 0.12)));
  }
  if (!pool.length) pool = candidates.sort((a, b) => heroDist[b.i] - heroDist[a.i]).slice(0, 6);
  const pick = pool[Math.floor(rng() * pool.length)];
  return { c: pick.c, r: pick.r };
}

function placeCollectible(ctx, placement, existing) {
  const { maze, rng, heroDist, doorDist, mainPath, pathDist, taken } = ctx;
  const along = new Map(mainPath.map((p, i) => [maze.idx(p.c, p.r), i / Math.max(1, mainPath.length - 1)]));
  const gap = placement === "spread" ? 4 : 6;
  const ok = (c, r, i) =>
    heroDist[i] >= 5 &&
    doorDist[i] >= 3 &&
    !taken.some((t) => Math.abs(t.c - c) + Math.abs(t.r - r) < 3) &&
    !existing.some((e) => Math.abs(e.c - c) + Math.abs(e.r - r) < gap);
  const candidates = [];
  maze.forEachCell((c, r, t) => {
    const i = maze.idx(c, r);
    if (t === "floor" && ok(c, r, i)) candidates.push({ c, r, i });
  });
  let pool;
  if (placement === "spread") {
    if (!existing.length) {
      pool = candidates.filter((x) => pathDist[x.i] <= 2 && along.has(x.i) && along.get(x.i) > 0.15 && along.get(x.i) < 0.5);
      if (!pool.length) pool = candidates.filter((x) => pathDist[x.i] <= 2);
    } else {
      const score = (x) => Math.min(...existing.map((e) => Math.hypot(e.c - x.c, e.r - x.r)));
      const scored = candidates.map((x) => ({ ...x, s: score(x) })).sort((a, b) => b.s - a.s);
      pool = scored.slice(0, Math.max(1, Math.ceil(scored.length * 0.15)));
    }
  } else if (placement === "onPath") {
    pool = candidates.filter((x) => along.has(x.i) && along.get(x.i) > 0.2 && along.get(x.i) < 0.85);
  } else if (placement === "nearPath") {
    pool = candidates.filter((x) => pathDist[x.i] >= 1 && pathDist[x.i] <= 3);
  } else {
    pool = candidates.filter((x) => pathDist[x.i] >= 3 && pathDist[x.i] <= 7);
  }
  if (!pool.length) pool = candidates;
  if (!pool.length) return null;
  const pick = pool[Math.floor(rng() * pool.length)];
  return { c: pick.c, r: pick.r };
}

/**
 * Level validation: connectivity, hero→door path, collectible reachability,
 * chaser spawn safety and Shawl Man teleport availability. Returns a list of errors.
 */
export function validateLevel(level) {
  const errors = [];
  const { maze, heroSpawn, door, chasers, collectibles } = level;
  const dist = maze.distancesFrom(heroSpawn.c, heroSpawn.r, true);
  maze.forEachCell((c, r, t) => {
    if (t !== "wall" && dist[maze.idx(c, r)] < 0) errors.push(`unreachable cell ${c},${r}`);
  });
  if (dist[maze.idx(door.c, door.r)] < 0) errors.push("no path from hero to door");
  for (const col of collectibles) {
    if (dist[maze.idx(col.c, col.r)] < 0) errors.push(`collectible ${col.type} unreachable`);
  }
  const chaserDist = maze.distancesFrom(heroSpawn.c, heroSpawn.r);
  for (const ch of chasers) {
    if (ch.c == null) {
      errors.push(`${ch.type} has no safe spawn`);
      continue;
    }
    if (ch.type === "creature") {
      const min = Math.max(8, ch.speed * SAFE_SECONDS);
      if (Math.hypot(ch.c - heroSpawn.c, ch.r - heroSpawn.r) < min) errors.push("creature spawn too close");
    } else if (chaserDist[maze.idx(ch.c, ch.r)] < MIN_SAFE_DISTANCE) {
      errors.push(`${ch.type} spawn too close`);
    }
  }
  if (chasers.some((c) => c.type === "shawlMan")) {
    const appear = Math.round(HERO_BASE_SPEED * SHAWL_APPEAR_SECONDS);
    let spots = 0;
    for (let i = 0; i < chaserDist.length; i++) if (chaserDist[i] === appear) spots++;
    if (spots < 2) errors.push("shawl man has too few teleport spots");
  }
  if (level.collectiblesEnabled && level.def.collectibles && collectibles.length < level.def.collectibles.types.length) {
    errors.push("could not place all collectibles");
  }
  return errors;
}

function transposeLevel(level) {
  const { maze } = level;
  const cols = maze.rows;
  const rows = maze.cols;
  const cells = new Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cells[r * cols + c] = maze.cells[c * maze.cols + r];
  }
  const swap = (p) => ({ ...p, c: p.r, r: p.c });
  return {
    ...level,
    maze: new Maze(cols, rows, cells),
    heroSpawn: swap(level.heroSpawn),
    door: swap(level.door),
    route: level.route?.map(swap),
    chasers: level.chasers.map(swap),
    collectibles: level.collectibles.map(swap),
    hallCenters: level.hallCenters.map(swap),
  };
}

function cloneLevel(level) {
  return {
    ...level,
    maze: new Maze(level.maze.cols, level.maze.rows, level.maze.cells.slice()),
    chasers: level.chasers.map((c) => ({ ...c })),
    collectibles: level.collectibles.map((c) => ({ ...c })),
  };
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function doorSide(level) {
  const { maze, door } = level;
  if (door.r === 0) return "top";
  if (door.r === maze.rows - 1) return "bottom";
  if (door.c === 0) return "left";
  return "right";
}
