import { DIRS, DIR_NAMES, OPPOSITE } from "./maze.js";
import {
  HERO_BASE_SPEED,
  BOOST_MULTIPLIER,
  QUEUE_TIMEOUT,
  CREATURE_STEER_INTERVAL,
  CROC_REPATH_INTERVAL,
  CROC_CHASE_RADIUS,
  CROC_GIVE_UP_RADIUS,
  TELEPORT_FADE_IN,
  RESPAWN_FADE_IN,
  CHASER_SPEED_SCALE,
  THATHA_WARNING_SECONDS,
} from "./config.js";

const EPS = 1e-4;

/**
 * Deterministic grid movement: positions are in cell units with integer values at cell centres.
 * `decide(c, r)` is consulted at every cell centre and returns the direction to take (or null to stop).
 */
export function moveOnGrid(e, distance, decide) {
  let remaining = distance;
  for (let guard = 0; remaining > EPS && guard < 12; guard++) {
    const cx = Math.round(e.x);
    const cy = Math.round(e.y);
    if (Math.abs(e.x - cx) < EPS && Math.abs(e.y - cy) < EPS) {
      e.x = cx;
      e.y = cy;
      const dir = decide(cx, cy);
      if (!dir) {
        e.moving = false;
        return;
      }
      e.dir = dir;
    }
    const d = DIRS[e.dir];
    if (!d) {
      e.moving = false;
      return;
    }
    const tx = d.x > 0 ? Math.floor(e.x + EPS) + 1 : d.x < 0 ? Math.ceil(e.x - EPS) - 1 : e.x;
    const ty = d.y > 0 ? Math.floor(e.y + EPS) + 1 : d.y < 0 ? Math.ceil(e.y - EPS) - 1 : e.y;
    const gap = Math.abs(tx - e.x) + Math.abs(ty - e.y);
    const step = Math.min(remaining, gap);
    if (step >= gap - EPS) {
      e.x = tx;
      e.y = ty;
    } else {
      e.x += d.x * step;
      e.y += d.y * step;
    }
    remaining -= step;
    e.moving = true;
    if (d.x) e.facing = d.x;
  }
}

export class Hero {
  constructor(spawn) {
    this.spawn = spawn;
    this.reset();
  }

  reset() {
    this.x = this.spawn.c;
    this.y = this.spawn.r;
    this.dir = null;
    this.queued = null;
    this.queuedAge = 0;
    this.moving = false;
    this.facing = 1;
    this.boostTimer = 0;
    this.knives = 0;
    this.knifeTimer = 0;
    this.graceTimer = 0;
    this.trail = [];
    this.reverseControls = false;
    this.mirrorX = false;
    this.mirrorY = false;
    this.suplexTimer = 0;
    this.suplexDuration = 0;
    this.suplexDirection = null;
  }

  get cell() {
    return { c: Math.round(this.x), r: Math.round(this.y) };
  }

  get speed() {
    return HERO_BASE_SPEED * (this.boostTimer > 0 ? BOOST_MULTIPLIER : 1);
  }

  beginSuplex(direction, duration) {
    this.suplexTimer = duration;
    this.suplexDuration = duration;
    this.suplexDirection = direction;
    this.moving = false;
  }

  queue(dir) {
    if (!dir) return;
    const horizontal = dir === "left" || dir === "right";
    if ((horizontal && this.mirrorX) || (!horizontal && this.mirrorY)) dir = OPPOSITE[dir];
    if (this.reverseControls) dir = OPPOSITE[dir];
    const atCenter = Math.abs(this.x - Math.round(this.x)) < EPS && Math.abs(this.y - Math.round(this.y)) < EPS;
    if (this.dir && dir === OPPOSITE[this.dir] && !atCenter) {
      this.dir = dir;
      this.queued = null;
      return;
    }
    this.queued = dir;
    this.queuedAge = 0;
  }

  update(dt, maze, heldDir) {
    if (heldDir) this.queue(heldDir);
    else if (this.queued) {
      this.queuedAge += dt;
      if (this.queuedAge > QUEUE_TIMEOUT && this.moving) this.queued = null;
    }
    if (this.boostTimer > 0) this.boostTimer = Math.max(0, this.boostTimer - dt);
    if (this.graceTimer > 0) this.graceTimer = Math.max(0, this.graceTimer - dt);
    if (this.knifeTimer > 0) {
      this.knifeTimer = Math.max(0, this.knifeTimer - dt);
      if (this.knifeTimer === 0) this.knives = 0;
    }
    if (this.suplexTimer > 0) {
      this.suplexTimer = Math.max(0, this.suplexTimer - dt);
      this.moving = false;
      return;
    }

    moveOnGrid(this, this.speed * dt, (c, r) => {
      if (this.queued && maze.canMove(c, r, this.queued, true)) {
        this.dir = this.queued;
        this.queued = null;
      }
      return this.dir && maze.canMove(c, r, this.dir, true) ? this.dir : null;
    });

    if (this.boostTimer > 0) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 7) this.trail.shift();
    } else if (this.trail.length) {
      this.trail.shift();
    }
  }
}

/** Generic chaser. States: CHASE | PAUSED | STUNNED | DEAD | TELEPORTING | RESPAWNING */
export class Chaser {
  constructor(cfg) {
    this.id = `${cfg.type}`;
    this.type = cfg.type;
    this.cfg = cfg;
    this.spawn = { c: cfg.c, r: cfg.r };
    this.reset();
  }

  reset() {
    this.x = this.spawn.c;
    this.y = this.spawn.r;
    this.speed = (this.cfg.speed || 0) * CHASER_SPEED_SCALE;
    this.state = "CHASE";
    this.prevState = "CHASE";
    this.active = true;
    this.dir = null;
    this.moving = false;
    this.facing = -1;
    this.timer = 0;
    this.pauseTimer = 0;
    this.alpha = 1;
    this.harmlessUntilClear = false;
    this.nearMiss = false;
    this.throwTimer = 0;
    this.throwDuration = 0;
    this.throwDirection = null;
    this.suplexTimer = 0;
    this.suplexDuration = 0;
    this.suplexDirection = null;
  }

  get cell() {
    return { c: Math.round(this.x), r: Math.round(this.y) };
  }

  /** Can this chaser currently catch the hero? */
  get dangerous() {
    return this.active && this.state === "CHASE" && !this.harmlessUntilClear && this.alpha > 0.9;
  }

  pause(duration) {
    if (this.state === "STUNNED" || this.state === "DEAD") return;
    if (this.state !== "PAUSED") this.prevState = this.state;
    this.state = "PAUSED";
    this.pauseTimer = duration;
  }

  stun(duration) {
    this.state = "STUNNED";
    this.timer = duration;
    this.pauseTimer = 0;
  }

  /** A knife sends a crocodile spinning away before its normal cooldown / respawn. */
  throwAway(direction, duration) {
    this.stun(duration);
    this.throwTimer = 0.65;
    this.throwDuration = 0.65;
    this.throwDirection = direction;
  }

  /** Held for the hero's half-second suplex, then launched into the usual cooldown. */
  beginSuplex(direction, duration, cooldown) {
    this.state = "SUPLEX";
    this.timer = duration;
    this.suplexTimer = duration;
    this.suplexDuration = duration;
    this.suplexDirection = direction;
    this.suplexCooldown = cooldown;
    this.pauseTimer = 0;
  }

  /** Shared per-frame state handling. Returns true when the subclass should run its chase logic. */
  updateCommon(dt, game) {
    if (this.state === "SUPLEX") {
      this.timer -= dt;
      this.suplexTimer = Math.max(0, this.suplexTimer - dt);
      if (this.timer <= 0) this.throwAway(this.suplexDirection, this.suplexCooldown);
      return false;
    }
    if (this.state === "PAUSED") {
      this.pauseTimer -= dt;
      if (this.pauseTimer <= 0) {
        this.state = this.prevState;
        this.harmlessUntilClear = true;
      }
      return false;
    }
    if (this.state === "STUNNED") {
      this.timer -= dt;
      if (this.throwTimer > 0) this.throwTimer = Math.max(0, this.throwTimer - dt);
      if (this.timer <= 0) this.beginRespawn(game);
      return false;
    }
    if (this.state === "RESPAWNING") {
      this.timer -= dt;
      this.alpha = 1 - Math.max(0, this.timer) / RESPAWN_FADE_IN;
      if (this.timer <= 0) {
        this.alpha = 1;
        this.state = "CHASE";
      }
      return false;
    }
    return this.state === "CHASE";
  }

  beginRespawn(game) {
    const spot =
      this.type === "shawlMan"
        ? game.findShawlCell(this)
        : game.findSafeCell({ exclude: this, euclidMin: this.type === "creature" ? 8 : 0 });
    if (!spot) {
      this.timer = 0.5;
      return;
    }
    this.x = spot.c;
    this.y = spot.r;
    this.dir = null;
    this.state = "RESPAWNING";
    this.timer = RESPAWN_FADE_IN;
    this.alpha = 0;
  }

  update(dt, game) {
    this.updateCommon(dt, game);
  }
}

/** Dhayyam wanders palace corridors, then pursues only when the hero enters its vicinity. */
export class Creature extends Chaser {
  reset() {
    super.reset();
    this.path = [];
    this.repathTimer = 0;
    this.steerTimer = 0;
    this.mode = "WANDER";
    this.wanderTarget = null;
  }

  update(dt, game) {
    if (!this.updateCommon(dt, game)) return;
    const { hero, maze } = game;
    const heroDist = maze.distancesFrom(hero.cell.c, hero.cell.r);
    const d = heroDist[maze.idx(this.cell.c, this.cell.r)];
    if (this.mode !== "CHASE" && d >= 0 && d <= 7) this.mode = "CHASE";
    else if (this.mode === "CHASE" && (d < 0 || d > 9)) this.mode = "WANDER";
    this.steerTimer -= dt;
    if (this.steerTimer <= 0) {
      this.steerTimer = CREATURE_STEER_INTERVAL * 2;
      if (this.mode === "CHASE") {
        this.path = planPath(maze, nextCenter(this), hero.cell);
      } else if (!this.wanderTarget || (this.cell.c === this.wanderTarget.c && this.cell.r === this.wanderTarget.r)) {
        const cells = [];
        maze.forEachCell((c, r, type) => { if (type === "floor" || type === "spawn") cells.push({ c, r }); });
        this.wanderTarget = cells[Math.floor(game.rng() * cells.length)] || this.cell;
        this.path = planPath(maze, nextCenter(this), this.wanderTarget);
      }
    }
    moveOnGrid(this, this.speed * dt, (c, r) => {
      let dir = followPath(this.path, maze, c, r);
      if (!dir && this.mode === "CHASE") this.path = planPath(maze, { c, r }, hero.cell);
      return dir || followPath(this.path, maze, c, r);
    });
  }
}

/** Corridor-bound: roams at random, and only hunts the hero (A*) while he is within its vicinity. */
export class Crocodile extends Chaser {
  reset() {
    super.reset();
    this.path = [];
    this.repathTimer = 0;
    this.mode = "ROAM";
    /** Hidden Exit: the captor keeps to this post (the heroine's cell) until the hero comes near. */
    this.guard = this.guard || null;
    this.homePath = [];
  }

  update(dt, game) {
    if (!this.updateCommon(dt, game)) return;
    const { hero, maze } = game;
    const heroDist = maze.distancesFrom(hero.cell.c, hero.cell.r);
    const d = heroDist[maze.idx(this.cell.c, this.cell.r)];
    if (this.mode === "ROAM" && d >= 0 && d <= CROC_CHASE_RADIUS) {
      this.mode = "HUNT";
      this.repathTimer = 0;
    } else if (this.mode === "HUNT" && (d < 0 || d > CROC_GIVE_UP_RADIUS)) {
      this.mode = "ROAM";
    }

    if (this.mode === "HUNT") {
      this.repathTimer -= dt;
      if (this.repathTimer <= 0) {
        this.repathTimer = CROC_REPATH_INTERVAL;
        this.path = planPath(maze, nextCenter(this), hero.cell);
      }
    }
    moveOnGrid(this, this.speed * dt, (c, r) => {
      if (this.mode === "HUNT") {
        let dir = followPath(this.path, maze, c, r);
        if (!dir) {
          this.path = planPath(maze, { c, r }, hero.cell);
          dir = followPath(this.path, maze, c, r);
        }
        return dir;
      }
      if (this.guard) {
        if (c === this.guard.c && r === this.guard.r) return null;
        let dir = followPath(this.homePath, maze, c, r);
        if (!dir) {
          this.homePath = planPath(maze, { c, r }, this.guard);
          dir = followPath(this.homePath, maze, c, r);
        }
        return dir;
      }
      const rng = game.rng || Math.random;
      const open = DIR_NAMES.filter((dir) => maze.canMove(c, r, dir));
      const forward = open.filter((dir) => dir !== OPPOSITE[this.dir]);
      const choices = forward.length ? forward : open;
      // Mostly keep going straight down corridors; turn at random at junctions.
      if (this.dir && choices.includes(this.dir) && rng() < 0.6) return this.dir;
      return choices[Math.floor(rng() * choices.length)] || null;
    });
  }
}

/**
 * Thatha: lurks slowly, then marks a cell exactly SHAWL_APPEAR_SECONDS of hero travel away, and
 * THATHA_WARNING_SECONDS later blinks there (unless the hero has run onto the mark in the meantime).
 */
export class ShawlMan extends Chaser {
  reset() {
    super.reset();
    this.teleportTimer = this.nextInterval();
    this.phase = null;
    this.target = null;
    this.warning = null;
    this.path = [];
    this.repathTimer = 0;
    this.speed = (this.cfg.lurk || 0) * CHASER_SPEED_SCALE;
    this.teleports = 0;
  }

  nextInterval() {
    const [lo, hi] = this.cfg.interval || [4, 7];
    return (lo + Math.random() * (hi - lo)) / CHASER_SPEED_SCALE;
  }

  cancelTeleportWarning(retryIn = 1) {
    if (!this.warning) return;
    this.warning = null;
    this.teleportTimer = retryIn;
  }

  /** After a knife stun he leaves the maze and comes back through a marked destination, like any teleport. */
  beginRespawn(game) {
    const spot = game.findShawlCell(this);
    if (!spot) {
      this.timer = 0.5;
      return;
    }
    this.state = "AWAY";
    this.alpha = 0;
    this.warning = { target: spot, remaining: THATHA_WARNING_SECONDS, duration: THATHA_WARNING_SECONDS };
  }

  /** Counts down the marked destination; true once it has resolved (blinked there, or been abandoned). */
  tickWarning(dt, game) {
    this.warning.remaining -= dt;
    if (this.warning.remaining > 0) return false;
    const spot = this.warning.target;
    this.warning = null;
    if (game.thathaLandingValid(spot)) this.blinkTo(spot, game);
    return true;
  }

  update(dt, game) {
    if (this.state === "TELEPORTING") {
      this.updateTeleport(dt, game);
      return;
    }
    if (this.state === "AWAY") {
      if (!this.warning || (this.tickWarning(dt, game) && this.state === "AWAY")) this.beginRespawn(game);
      return;
    }
    if (!this.updateCommon(dt, game)) {
      this.cancelTeleportWarning();
      return;
    }
    const { hero, maze } = game;

    if (this.warning) {
      if (this.tickWarning(dt, game)) {
        if (this.state === "CHASE") this.teleportTimer = 0;
        return;
      }
    } else {
      this.teleportTimer -= dt;
      if (this.teleportTimer <= 0) {
        const spot = game.findShawlCell(this);
        if (spot) this.warning = { target: spot, remaining: THATHA_WARNING_SECONDS, duration: THATHA_WARNING_SECONDS };
        else this.teleportTimer = 1;
      }
    }

    if (this.speed > 0) {
      this.repathTimer -= dt;
      if (this.repathTimer <= 0) {
        this.repathTimer = 0.5;
        this.path = planPath(maze, nextCenter(this), hero.cell);
      }
      moveOnGrid(this, this.speed * dt, (c, r) => followPath(this.path, maze, c, r));
    }
  }

  /** Leaves his current spot and fades in on the marked cell. */
  blinkTo(spot, game) {
    game.onShawlBlink(this, spot);
    this.target = spot;
    this.x = spot.c;
    this.y = spot.r;
    this.dir = null;
    this.moving = false;
    this.path = [];
    this.state = "TELEPORTING";
    this.phase = "in";
    this.timer = TELEPORT_FADE_IN;
    this.alpha = 0;
  }

  updateTeleport(dt, game) {
    this.timer -= dt;
    this.alpha = 1 - Math.max(0, this.timer) / TELEPORT_FADE_IN;
    if (this.timer <= 0) {
      this.alpha = 1;
      this.phase = null;
      this.state = "CHASE";
      this.teleportTimer = this.nextInterval();
      this.teleports++;
      game.onShawlTeleport(this);
    }
  }

  pause(duration) {
    if (this.state === "TELEPORTING") {
      this.alpha = 1;
      this.phase = null;
      this.state = "CHASE";
      this.teleportTimer = this.nextInterval();
    }
    this.cancelTeleportWarning(this.nextInterval());
    super.pause(duration);
  }

  stun(duration) {
    this.cancelTeleportWarning(this.nextInterval());
    super.stun(duration);
  }
}

/**
 * The Hidden Exit hostage. She starts CAPTIVE beside the crocodile; once the hero has dealt with it and
 * reaches her she is FOLLOWING: she walks the corridors behind the hero at his current speed (so a boost
 * carries her too). Chasers ignore her: only the hero can be caught.
 */
export class Heroine {
  /** `skin` picks her picture and walk rig: "heroine" (the hostage), "heroine2" (Twin Doors), "heroine3" (Sudden Wells). */
  constructor(spawn, skin = "heroine") {
    this.spawn = { c: spawn.c, r: spawn.r };
    this.skin = skin;
    this.reset();
  }

  reset() {
    this.x = this.spawn.c;
    this.y = this.spawn.r;
    this.state = "CAPTIVE"; // CAPTIVE | TALKING | EMERGING | HUNT | RETURN | FOLLOWING
    this.appear = 1; // 0-1: how far she has stepped out of a door / climbed out of a well
    this.punchT = 0;
    this.dir = null;
    this.moving = false;
    this.facing = 1;
    this.path = [];
    this.repathTimer = 0;
    this.trail = [];
  }

  get cell() {
    return { c: Math.round(this.x), r: Math.round(this.y) };
  }

  get following() {
    return this.state === "FOLLOWING";
  }

  free() {
    this.state = "FOLLOWING";
    this.repathTimer = 0;
  }

  update(dt, game) {
    if (this.state !== "FOLLOWING") return;
    const { hero, maze } = game;
    const dist = maze.distancesFrom(hero.cell.c, hero.cell.r)[maze.idx(this.cell.c, this.cell.r)];
    // Stay about two cells behind; hurry when she has fallen well back. Powers (boost) apply to her too.
    const catchUp = dist > 5 ? 1.25 : 1;
    const speed = dist >= 2 || dist < 0 ? hero.speed * catchUp : 0;
    this.repathTimer -= dt;
    if (this.repathTimer <= 0) {
      this.repathTimer = 0.25;
      this.path = planPath(maze, nextCenter(this), hero.cell);
    }
    if (speed <= 0) {
      this.moving = false;
    } else {
      moveOnGrid(this, speed * dt, (c, r) => {
        let dir = followPath(this.path, maze, c, r);
        if (!dir) {
          this.path = planPath(maze, { c, r }, hero.cell);
          dir = followPath(this.path, maze, c, r);
        }
        return dir;
      });
    }
    if (hero.boostTimer > 0 && this.moving) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 7) this.trail.shift();
    } else if (this.trail.length) {
      this.trail.shift();
    }
  }
}

/**
 * Heroine 3 (Sudden Wells). She climbs out of the well the hero fell into, runs down the crocodile and Dhayyam one
 * after the other and knocks each out cold with a punch, then walks back to the hero and follows him like any heroine.
 */
export class Fighter extends Heroine {
  constructor(spawn) {
    super(spawn, "heroine3");
    this.state = "EMERGING";
    this.timer = 1.0;
    this.huntClock = 0;
    this.repathTimer = 0;
    this.kills = 0;
  }

  /** The chasers she is after: the crocodile and Dhayyam that are still in the game. */
  targets(game) {
    return game.chasers.filter((c) => (c.type === "crocodile" || c.type === "creature") && c.active && !(c.fatalTimer > 0));
  }

  walkTo(cell, speed, dt, game) {
    const { maze } = game;
    this.repathTimer -= dt;
    if (this.repathTimer <= 0) {
      this.repathTimer = 0.2;
      this.path = planPath(maze, nextCenter(this), cell);
    }
    moveOnGrid(this, speed * dt, (c, r) => {
      let dir = followPath(this.path, maze, c, r);
      if (!dir) {
        this.path = planPath(maze, { c, r }, cell);
        dir = followPath(this.path, maze, c, r);
      }
      return dir;
    });
  }

  update(dt, game) {
    if (this.punchT > 0) this.punchT = Math.max(0, this.punchT - dt);
    if (this.state === "EMERGING") {
      this.timer -= dt;
      this.appear = 1 - Math.max(0, this.timer) / 1.0;
      this.moving = false;
      if (this.timer <= 0) {
        this.appear = 1;
        this.state = "HUNT";
        game.onFighterOut();
      }
      return;
    }
    if (this.state === "HUNT") {
      this.huntClock += dt;
      const quota = game.fighterQuota();
      if (this.kills >= quota) {
        // she has knocked out as many as she is going to: once the punch lands she goes back to the hero
        if (this.punchT > 0) this.moving = false;
        else this.state = "RETURN";
        return;
      }
      const hero = game.hero;
      const all = this.targets(game).sort((a, b) => Math.hypot(a.x - hero.x, a.y - hero.y) - Math.hypot(b.x - hero.x, b.y - hero.y));
      if (!all.length) {
        this.state = "RETURN";
        return;
      }
      if (this.huntClock > 30) {
        // fail-safe: never leave the round waiting forever
        for (const ch of all.slice(0, quota - this.kills)) game.fighterPunch(this, ch);
        return;
      }
      if (this.punchT > 0) {
        this.moving = false;
        return;
      }
      // she goes after the chaser that is closest to the hero, i.e. the one that is hunting him
      const reachable = all.filter((c) => (c.state === "CHASE" || c.state === "PAUSED") && c.alpha > 0.5);
      if (!reachable.length) {
        this.followHeroLoosely(dt, game);
        return;
      }
      const target = reachable[0];
      if (Math.hypot(target.x - this.x, target.y - this.y) < 0.85) {
        this.moving = false;
        game.fighterPunch(this, target);
        return;
      }
      this.walkTo(target.cell, game.hero.speed * 1.3, dt, game);
      return;
    }
    if (this.state === "RETURN") {
      const { hero, maze } = game;
      const dist = maze.distancesFrom(hero.cell.c, hero.cell.r)[maze.idx(this.cell.c, this.cell.r)];
      if (dist >= 0 && dist <= 2) {
        this.free();
        game.onFighterJoined();
        return;
      }
      this.walkTo(hero.cell, game.hero.speed * 1.3, dt, game);
      return;
    }
    super.update(dt, game);
  }

  followHeroLoosely(dt, game) {
    const { hero, maze } = game;
    const dist = maze.distancesFrom(hero.cell.c, hero.cell.r)[maze.idx(this.cell.c, this.cell.r)];
    if (dist >= 4 || dist < 0) this.walkTo(hero.cell, game.hero.speed, dt, game);
    else this.moving = false;
  }
}

export function createChaser(cfg) {
  if (cfg.type === "creature") return new Creature(cfg);
  if (cfg.type === "crocodile") return new Crocodile(cfg);
  return new ShawlMan(cfg);
}

function nextCenter(e) {
  const d = DIRS[e.dir];
  if (!d) return { c: Math.round(e.x), r: Math.round(e.y) };
  const c = d.x > 0 ? Math.floor(e.x + EPS) + 1 : d.x < 0 ? Math.ceil(e.x - EPS) - 1 : Math.round(e.x);
  const r = d.y > 0 ? Math.floor(e.y + EPS) + 1 : d.y < 0 ? Math.ceil(e.y - EPS) - 1 : Math.round(e.y);
  if (Math.abs(e.x - Math.round(e.x)) < EPS && Math.abs(e.y - Math.round(e.y)) < EPS) {
    return { c: Math.round(e.x), r: Math.round(e.y) };
  }
  return { c, r };
}

function planPath(maze, from, target) {
  if (!maze.isWalkable(target.c, target.r) || !maze.isWalkable(from.c, from.r)) return [];
  const path = maze.findPath(from.c, from.r, target.c, target.r);
  return path ? [from, ...path] : [];
}

/** Direction from (c, r) to the next path step, or null if (c, r) is not on the path / the step is invalid. */
function followPath(path, maze, c, r) {
  const i = path.findIndex((p) => p.c === c && p.r === r);
  if (i === -1) return null;
  const next = path[i + 1];
  if (!next || Math.abs(next.c - c) + Math.abs(next.r - r) !== 1) return null;
  const dir = dirTo(c, r, next.c, next.r);
  return maze.canMove(c, r, dir) ? dir : null;
}

function dirTo(c, r, nc, nr) {
  if (nc > c) return "right";
  if (nc < c) return "left";
  if (nr > r) return "down";
  if (nr < r) return "up";
  return null;
}
