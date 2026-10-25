import { buildLevel, createTrap, applyTrapToLevel, doorSide, doorPartner } from "./levels.js";
import { Hero, Heroine, Fighter, createChaser } from "./entities.js";
import { smashPose, SMASH_DURATION, SMASH_IMPACT_LEFT, SMASH_IMPACT_RIGHT } from "./smash.js";
import { trainCars, trainHits, trainTrack, TRAIN } from "./train.js";
import { DIRS, DIR_NAMES, mulberry32 } from "./maze.js";
import {
  BOOST_DURATION,
  EYE_DURATION,
  KNIFE_DURATION,
  KNIFE_STUN_DURATION,
  SHAWL_APPEAR_SECONDS,
  TITLE_LEVEL,
  MILESTONE_LEVELS,
  KNIFE_GRACE,
  HERO_RADIUS,
  CHASER_RADIUS,
  MIN_SAFE_DISTANCE,
  HERO_BASE_SPEED,
  FIXED_STEP,
  CHASER_INFO,
  TEXT,
  WELL_VISIBLE_SECONDS,
  WELL_COOLDOWN,
  WELL_LEAD_SECONDS,
  WELL_MAX_PATH_SPAWNS,
  FLOOD_WARNING_SECONDS,
  FLOOD_LEAP_SECONDS,
  FLOOD_CROC_SPEED,
  THATHA_MIN_LANDING_STEPS,
  TOO_CLOSE_DISTANCE,
  TOO_CLOSE_RESET,
  TOO_CLOSE_COOLDOWN,
  AUDIO,
  AUDIO_BY_TRAP,
} from "./config.js";
import { TELEPORT_FX_DURATION } from "./renderer.js";
import { recordAttempt, awardRound } from "./aasthi.js";

const FIRST_APPEARANCE = { crocodile: 1, creature: 4 };
const CAUGHT_CARD_DELAY = 0.75;
const COMPLETE_CARD_DELAY = 0.8;
/** The train cannot hit the hero during the first moments of a round. */
const TRAIN_START_GRACE = 1.5;
const POWER_FLICKER = 0.8;

/**
 * Game states: MENU | LEVEL_START | PLAYING | PAUSED | CAUGHT | LEVEL_COMPLETE | FINAL_SUCCESS
 */
export class Game {
  constructor({ renderer, ui, audio, input, storage, layout }) {
    this.renderer = renderer;
    this.ui = ui;
    this.audio = audio;
    this.input = input;
    this.storage = storage;
    this.layout = layout;
    this.state = "MENU";
    this.level = null;
    this.t = 0;
    this.accumulator = 0;
    this.lastFrame = 0;
    this.hudTick = 0;
    this.chasers = [];
    this.collectibles = [];
    this.effects = [];
  }

  // ---------- lifecycle ----------

  /**
   * Builds a level's maze ahead of time (while the player is on the menu or looking at a result card) so that
   * starting it does not have to do the work during their tap.
   */
  prepareLevel(n) {
    const portrait = this.layout.isPortrait();
    const seed = Math.floor(Math.random() * 0x7fffffff);
    this.prepared = { n, portrait, seed, level: buildLevel(n, portrait, seed) };
  }

  startLevel(n, { retry = false } = {}) {
    n = Math.max(1, n);
    this.levelNumber = n;
    this.portrait = this.layout.isPortrait();
    const prep = !retry && this.prepared && this.prepared.n === n && this.prepared.portrait === this.portrait ? this.prepared : null;
    this.prepared = null;
    this.runSeed = retry ? this.runSeed : prep ? prep.seed : Math.floor(Math.random() * 0x7fffffff);
    this.rng = mulberry32(this.runSeed);
    this.level = prep ? prep.level : buildLevel(n, this.portrait, this.runSeed);
    const history = this.storage.data;
    if (!retry) this.trap = createTrap(this.level, {
      previousTrap: history.previousTrap ?? null,
      bag: history.trapBag,
      seed: this.runSeed,
    });
    if (!retry) {
      history.previousTrap = this.trap.id;
      history.trapBag = this.trap.bag;
      this.storage.save();
    } else {
      if (this.trap.id === "twoDoors" && this.trap.config.pair) {
        // the doors' roles may have been swapped in the last attempt; every attempt starts afresh
        this.trap.config.decoyDoor = { ...this.trap.config.pair.decoy };
      }
      applyTrapToLevel(this.level, this.trap);
    }
    this.maze = this.level.maze;
    this.doorInner = this.findDoorInner();
    this.refreshDoorInner2();
    this.hero = new Hero(this.level.heroSpawn);
    this.hero.reverseControls = this.trap.id === "reverse";
    this.chasers = this.level.chasers.map((cfg) => createChaser(cfg));
    this.collectibles = this.level.collectibles.map((c) => ({ ...c, taken: false }));
    this.effects = [];
    this.smash = null;
    this.shake = 0;
    this.tooClose = { armed: true, cooldown: 0 };
    this.dangerLevel = 0;
    this.heroine = null;
    this.setupHostage();
    // Extra heroines: Twin Doors (Heroine 2) and Sudden Wells (Heroine 3) each play out a little story.
    // Sounds this round needs are fetched now, while its instruction screen is showing.
    this.audio.fetchClips(AUDIO_BY_TRAP[this.trap.id] || []);
    if (n % 10 >= 8 || n % 10 === 0) this.audio.fetchClips(["aasthiAward"]);
    if (!this.fetchedRest) {
      this.fetchedRest = true; // once play is under way, quietly fetch whatever is left for later levels
      setTimeout(() => this.audio.fetchClips(Object.keys(AUDIO)), 20000);
    }
    // Walk frames to prepare ahead of time (while the instruction screen is up) so nothing hitches mid-game.
    const want = [
      { sprite: "hero", rig: "hero1", axis: "h" },
      { sprite: "hero", rig: "hero1", axis: "v" },
      { sprite: "crocodile", rig: "croc", axis: "h" },
    ];
    if (this.trap.id === "hiddenDoor") want.push({ sprite: "heroine", rig: "heroine", axis: "h" }, { sprite: "heroine", rig: "heroine", axis: "v" });
    if (this.trap.id === "twoDoors") want.push({ sprite: "heroine2", rig: "heroine2", axis: "talk" }, { sprite: "heroine2", rig: "heroine2", axis: "h" }, { sprite: "heroine2", rig: "heroine2", axis: "v" });
    if (this.trap.id === "well") want.push({ sprite: "heroine3", rig: "heroine3", axis: "h" }, { sprite: "heroine3", rig: "heroine3", axis: "v" });
    want.push({ sprite: "heroPowered", rig: "hero2", axis: "h" }, { sprite: "heroPowered", rig: "hero2", axis: "v" });
    this.renderer.walkWanted = want;
    this.renderer.queueWalk();
    this.allies = [];
    this.event = null;
    this.twinDone = this.trap.id !== "twoDoors";
    this.decoyOpen = 0;
    this.storyDone = this.trap.id !== "well";
    this.wellStory = this.trap.id === "well" ? { stage: "WAIT", t: 0 } : null;
    this.lockToastCd = 0;
    // Level 1 coaches a first-time player: a light-hearted nudge to swipe (or press a key) until it has been learnt.
    this.ui.hideCoach();
    this.coach = this.levelNumber === 1 && !this.storage.data.swipeLearned ? { presses: 0, t: 0, nudged: false } : null;
    this.switchFlippedAt = -99;
    this.trainPass = null;
    this.trainHornCd = 0;
    this.trainHornPending = false;
    // Play time from earlier attempts at this level; it counts toward the Aasthi completion time.
    this.retryTime = retry ? (this.retryTime || 0) + (this.elapsed || 0) : 0;
    this.elapsed = 0;
    this.eyeTimer = 0;
    this.doorOpen = 0;
    this.caughtTimer = 0;
    this.completeTimer = 0;
    this.cardShown = false;
    this.powerPop = 0;
    this.doorArrowTimer = 0;
    this.nearMissCooldown = 0;
    this.shawlToastCooldown = 0;
    this.wasPowered = false;
    this.retry = retry;
    this.trapElapsed = 0;
    this.rotateTimer = this.trap.id === "rotate" ? this.trap.config.interval : 0;
    this.mirror = { x: false, y: false };
    this.applyMirror();
    this.wellCooldown = this.trap.id === "well" ? this.trap.config.wellDelay : 0;
    this.wellOpenTimer = 0;
    this.wellPathSpawns = 0;
    this.wellSpawns = 0;
    if (this.trap.id === "well") {
      this.trap.config.wells = [];
      this.trap.config.landing = null;
    }
    // Hidden Exit: the exit stays hidden until the hero has freed the heroine (see setupHostage).
    this.hiddenDoorRevealed = this.trap.id !== "hiddenDoor" || !this.heroine;
    this.trainDiverted = this.trap.id !== "train";
    this.flood = { crocInSafeZone: false, croc: null, dangerStart: 0, remaining: FLOOD_WARNING_SECONDS, ambushTriggered: false, leap: null };
    if (this.trap.id === "water") {
      for (const ch of this.chasers) if (ch.type === "crocodile") ch.speed = HERO_BASE_SPEED * FLOOD_CROC_SPEED;
    }
    this.newAward = null;
    this.roundAward = null;

    this.audio.stopStingers();
    this.renderer.setLevel(this.level);
    this.layout.refit();
    this.input.reset();
    this.ui.hideCards();
    this.ui.showGame();
    this.ui.setHud({ level: n, time: 0 });
    this.ui.updatePowers([]);
    this.state = "LEVEL_START";
    this.countingDown = false;

    if (retry) {
      this.beginCountdown();
    } else {
      this.input.enabled = false;
      // The instruction screen is ready immediately so players can read or tap Start right away
      this.ui.showTrapBrief(this.trap, () => this.beginCountdown(), { lock: false });
    }
  }

  beginCountdown() {
    this.startTimer = 0.45; // a beat for the music to start; the player already had their time on the instruction screen
    this.countingDown = true;
    this.input.enabled = true;
    this.audio.play("start");
    // Level 1 always opens with Pandaga, whatever the trap, then the bgm loops. Each trap has its own opening sound
    // (Hidden Exit "Door Edira", Lights Out "Wire", Twin Doors "Door Padipoindi") and it plays on every attempt,
    // retries and restarts included. Other levels go straight to the bgm.
    // Lights Out opens with "Wire" before the bgm on every round, retries included.
    const intro = [];
    if (this.trap.id === "hiddenDoor") intro.push({ name: "doorEdira", music: false });
    if (this.trap.id === "lights") intro.push({ name: "wire", music: false });
    this.audio.startMusic({ intro, pandaga: this.levelNumber === 1 });
    if (this.trap.id === "twoDoors") this.audio.play("doorPadipoindi");
  }

  beginPlay() {
    this.ui.showGo();
    // Levels 12, 14 and 16 each bring one more chaser (and more power-ups): say so the first time.
    if (!this.retry && this.levelNumber > 10 && this.levelNumber <= 16 && this.levelNumber % 2 === 0) {
      const names = { crocodile: "crocodile", creature: "Dhayyam", shawlMan: "Thatha" };
      const newest = this.chasers[this.chasers.length - 1];
      setTimeout(() => {
        if (this.state === "PLAYING") this.ui.toast(`Another ${names[newest.type]} joins the hunt! More power-ups too.`);
      }, 900);
    }
    if (this.coach) {
      const step = this.level.route?.[1];
      const from = this.level.heroSpawn;
      const dx = step ? step.c - from.c : 1;
      const dy = step ? step.r - from.r : 0;
      const dir = Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      // keep the guide out of the way of the hero: at the top when he starts in the lower half of the maze
      this.ui.showCoach(dir, this.coachText("intro"), from.r > this.maze.rows / 2);
    }
    this.state = "PLAYING";
    this.countingDown = false;
    this.doorArrowTimer = 2.6;
    if (!this.retry) {
      let delay = 0.2;
      for (const ch of this.chasers) {
        if (FIRST_APPEARANCE[ch.type] === this.levelNumber) {
          this.ui.toast(CHASER_INFO[ch.type].intro, delay);
          delay += 1.4;
        }
      }
    }
  }

  restartLevel() {
    this.audio.play("click");
    this.startLevel(this.levelNumber, { retry: true });
  }

  nextLevel() {
    this.audio.play("click");
    this.startLevel(this.levelNumber + 1);
  }

  toMenu() {
    this.state = "MENU";
    this.input.enabled = false;
    this.audio.stopMusic();
    this.audio.stopStingers();
    this.ui.hideCards();
    this.ui.showMenu();
  }

  pause({ silent = false } = {}) {
    if (this.state !== "PLAYING" && this.state !== "LEVEL_START") return false;
    this.pausedFrom = this.state;
    this.state = "PAUSED";
    this.input.enabled = false;
    this.input.reset();
    this.audio.pauseMusic();
    if (!silent) this.ui.showPause();
    return true;
  }

  resume() {
    if (this.state !== "PAUSED") return;
    this.state = this.pausedFrom;
    this.input.enabled = this.state === "PLAYING" || this.countingDown;
    this.ui.hidePause();
    this.audio.resumeMusic();
    this.lastFrame = performance.now();
  }

  // ---------- loop ----------

  frame(now) {
    const dt = Math.min(0.1, Math.max(0, (now - (this.lastFrame || now)) / 1000));
    this.lastFrame = now;
    if (this.state === "MENU" || !this.level) return;
    if (this.state !== "PAUSED") {
      this.t += dt;
      this.accumulator += dt;
      while (this.accumulator >= FIXED_STEP) {
        this.update(FIXED_STEP);
        this.accumulator -= FIXED_STEP;
      }
    }
    this.renderer.draw(this, this.t);
  }

  update(dt) {
    for (const fx of this.effects) fx.time -= dt;
    this.effects = this.effects.filter((fx) => fx.time > 0);
    if (this.powerPop > 0) this.powerPop = Math.max(0, this.powerPop - dt);
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt);

    switch (this.state) {
      case "LEVEL_START":
        if (this.countingDown) {
          this.startTimer -= dt;
          if (this.startTimer <= 0) this.beginPlay();
        }
        break;
      case "PLAYING":
        this.updatePlaying(dt);
        break;
      case "CAUGHT":
        this.caughtTimer += dt;
        if (!this.cardShown && this.caughtTimer >= CAUGHT_CARD_DELAY) {
          this.cardShown = true;
          this.ui.showCaught({ level: this.levelNumber });
        }
        break;
      case "LEVEL_COMPLETE":
        this.completeTimer += dt;
        this.doorOpen = Math.min(1, this.doorOpen + dt * 2.5);
        if (!this.cardShown && this.completeTimer >= COMPLETE_CARD_DELAY) {
          this.cardShown = true;
          this.showCompletionCard();
        }
        break;
      default:
        break;
    }
  }

  updatePlaying(dt) {
    const { hero, maze } = this;
    if (this.smash) {
      this.updateSmash(dt); // the whole palace holds its breath while the hero swings the crocodile
      return;
    }
    if (this.event) {
      this.updateEvent(dt); // ...and while two characters talk
      return;
    }
    this.elapsed += dt;
    this.updateTrap(dt);
    if (this.state !== "PLAYING") return;
    if (this.doorArrowTimer > 0) this.doorArrowTimer -= dt;
    if (this.nearMissCooldown > 0) this.nearMissCooldown -= dt;
    if (this.shawlToastCooldown > 0) this.shawlToastCooldown -= dt;
    if (this.eyeTimer > 0) this.eyeTimer = Math.max(0, this.eyeTimer - dt);

    hero.update(dt, maze, this.input.held);
    for (const ch of this.chasers) ch.update(dt, this);
    this.heroine?.update(dt, this);
    for (const a of this.allies) a.update(dt, this);
    for (const ch of this.chasers) {
      if (ch.fatalTimer > 0) {
        ch.fatalTimer -= dt;
        if (ch.fatalTimer <= 0) {
          ch.active = false;
          ch.state = "DEAD";
        }
      }
    }
    if (this.lockToastCd > 0) this.lockToastCd -= dt;
    if (this.coach && this.coach.presses === 0 && !this.coach.nudged) {
      this.coach.t += dt;
      if (this.coach.t > 6) {
        this.coach.nudged = true;
        this.ui.setCoachText(this.coachText("nudge"));
      }
    }

    if (this.checkTrain()) return;
    this.updateTrainHorn(dt);
    this.checkTrapInteractions();
    this.checkHostage();
    this.updateTooClose(dt);
    this.checkCollectibles();
    if (this.checkChaserCollisions()) return;
    if (this.checkDoor()) return;

    const powered = this.heroPowered;
    if (this.wasPowered && !powered) this.audio.play("powerdown");
    this.wasPowered = powered;

    this.hudTick -= dt;
    if (this.hudTick <= 0) {
      this.hudTick = 0.1;
      this.ui.setHud({ level: this.levelNumber, time: this.elapsed });
      this.ui.updatePowers(this.activePowers());
      this.ui.setDanger(this.dangerLevel);
    }
  }

  // ---------- rules ----------

  checkCollectibles() {
    const { hero } = this;
    for (const col of this.collectibles) {
      if (col.taken) continue;
      if (Math.abs(hero.x - col.c) + Math.abs(hero.y - col.r) > 0.5) continue;
      col.taken = true;
      this.maze.setType(col.c, col.r, "floor");
      this.applyPower(col.type);
      this.effects.push({ kind: "pickup", x: col.c, y: col.r, time: 0.45, duration: 0.45, radius: 1.2, color: "#f2c14e" });
    }
  }

  applyPower(type) {
    this.powerPop = 0.3;
    // The Malaysian Jamakay (guava) plays only its own clip; the other powers keep the pickup chime.
    if (type !== "eye") this.audio.play("pickup");
    if (type === "eye") {
      this.eyeTimer = EYE_DURATION;
      for (const ch of this.chasers) ch.pause(EYE_DURATION);
      this.audio.play("jamakay");
      this.ui.toast(TEXT.eye);
    } else if (type === "knife") {
      this.hero.knives += 1;
      this.hero.knifeTimer = KNIFE_DURATION;
      this.audio.play("knife");
      this.ui.toast(TEXT.knife);
    } else if (type === "boost") {
      this.hero.boostTimer = BOOST_DURATION;
      this.audio.play("boost");
      this.ui.toast(TEXT.boost);
    }
    this.ui.updatePowers(this.activePowers());
  }

  updateTrap(dt) {
    if (!this.trap) return;
    this.trapElapsed += dt;
    if (this.trap.id === "rotate") {
      this.rotateTimer -= dt;
      if (this.rotateTimer <= 0 && !this.ui.topModal) {
        this.rotateTimer = this.trap.config.interval;
        const leftRight = this.rng() < 0.5;
        if (leftRight) this.mirror.x = !this.mirror.x;
        else this.mirror.y = !this.mirror.y;
        this.applyMirror();
        for (const ch of this.chasers) ch.pause(3);
        this.ui.toast(leftRight ? "The palace flips left ↔ right!" : "The palace flips upside down!");
      }
    }
    if (this.trap.id === "well") {
      this.updateWellStory(dt);
      this.updateWells(dt);
    }
    if (this.trap.id === "water") this.updateFlood(dt);
  }

  /** The flip trap mirrors the drawn maze; controls stay screen-relative so "left" still moves left on screen. */
  applyMirror() {
    this.renderer.mirrorX = this.mirror.x;
    this.renderer.mirrorY = this.mirror.y;
    this.hero.mirrorX = this.mirror.x;
    this.hero.mirrorY = this.mirror.y;
  }

  checkTrapInteractions() {
    const { hero } = this;
    if (this.trap.id === "train" && !this.trainDiverted) {
      const sw = this.trap.config.switch;
      if (sw && Math.abs(hero.x - sw.c) + Math.abs(hero.y - sw.r) < 0.55) {
        this.trainDiverted = true;
        this.switchFlippedAt = this.t; // the STOP sign pops away
        this.ui.toast("Track switched — the exit is clear!");
      }
    }
    if (this.trap.id === "well") {
      const well = this.trap.config.wells?.find(
        (w) => !w.exit && (!w.story || this.wellStory?.stage === "OPEN") && Math.abs(hero.x - w.c) + Math.abs(hero.y - w.r) < 0.55,
      );
      if (well) {
        const landing = this.trap.config.landing;
        hero.x = landing.c; hero.y = landing.r; hero.dir = null; hero.queued = null; hero.graceTimer = 1;
        this.effects.push({ kind: "teleport", x: well.c, y: well.r, time: 0.45, duration: 0.45, radius: 1.4, color: "#5a7ca8" });
        this.effects.push({ kind: "teleport", x: landing.c, y: landing.r, time: 0.6, duration: 0.6, radius: 1.6, color: "#8fd0ef" });
        if (well.story) {
          // The story well: it stays open, and the hero comes out of ANOTHER well. Someone will climb out of this one.
          this.trap.config.wells = [{ ...well }, { c: landing.c, r: landing.r, openedAt: this.t, exit: true }];
          this.wellStory = { stage: "FELL", t: 0, A: { c: well.c, r: well.r } };
          hero.graceTimer = 2.2; // a moment to get his bearings before the chasers arrive
          this.wellOpenTimer = Infinity;
          this.ui.toast("The floor gave way! 🕳️");
        } else {
          this.closeWell();
          this.ui.toast("The well sends you elsewhere!");
        }
      }
    }
  }

  /** Wells cycle: open for WELL_VISIBLE_SECONDS, closed for WELL_COOLDOWN, then open somewhere new. */
  updateWells(dt) {
    const story = this.wellStory;
    if (story && !this.storyDone) return; // the story runs the wells until it is over
    if (this.trap.config.wells.length) {
      this.wellOpenTimer -= dt;
      if (this.wellOpenTimer <= 0) this.closeWell();
      return;
    }
    this.wellCooldown -= dt;
    if (this.wellCooldown <= 0) this.openWell();
  }

  closeWell() {
    this.trap.config.wells = [];
    this.trap.config.landing = null;
    this.wellCooldown = WELL_COOLDOWN;
  }

  openWell() {
    const scripted = this.wellStory?.stage === "WAIT"; // the first well is the story well: on the hero's path, and it waits for him
    const onPath = scripted || this.wellPathSpawns === 0 || (this.wellPathSpawns < WELL_MAX_PATH_SPAWNS && this.rng() < 0.4);
    const entrance = (onPath && this.cellAheadOfHero()) || this.randomWellCell();
    if (!entrance) {
      this.wellCooldown = 0.25;
      return;
    }
    if (onPath && entrance.ahead) this.wellPathSpawns++;
    this.wellSpawns++;
    const landing = this.wellLanding(entrance);
    this.trap.config.wells = [{ c: entrance.c, r: entrance.r, openedAt: this.t, story: scripted }];
    this.trap.config.landing = landing;
    this.wellOpenTimer = scripted ? Infinity : WELL_VISIBLE_SECONDS;
    if (scripted) this.wellStory = { stage: "OPEN", t: 0, A: { c: entrance.c, r: entrance.r } };
    this.effects.push({ kind: "teleport", x: entrance.c, y: entrance.r, time: 0.7, duration: 0.7, radius: 1.6, color: "#5a7ca8" });
    this.effects.push({ kind: "teleport", x: landing.c, y: landing.r, time: 0.7, duration: 0.7, radius: 1.6, color: "#8fd0ef" });
    if (entrance.ahead) this.ui.toast("A well opens in your path!");
  }

  /** A cell on the hero's route to the exit, at least WELL_LEAD_SECONDS of his travel ahead of him. */
  cellAheadOfHero() {
    const { hero, maze } = this;
    const steps = Math.ceil(hero.speed * WELL_LEAD_SECONDS) + 1;
    const route = maze.findPath(hero.cell.c, hero.cell.r, this.doorInner.c, this.doorInner.r) || [];
    const cell = route.slice(steps - 1).find((p) => this.isWellCell(p));
    return cell ? { ...cell, ahead: true } : null;
  }

  randomWellCell() {
    const { hero, maze } = this;
    const dist = maze.distancesFrom(hero.cell.c, hero.cell.r);
    const cells = [];
    maze.forEachCell((c, r) => {
      const d = dist[maze.idx(c, r)];
      if (d >= 4 && this.isWellCell({ c, r })) cells.push({ c, r });
    });
    return cells[Math.floor(this.rng() * cells.length)] || null;
  }

  isWellCell(p) {
    const type = this.maze.type(p.c, p.r);
    if (type !== "floor") return false;
    if (p.c === this.doorInner.c && p.r === this.doorInner.r) return false;
    if (this.doorInner2 && p.c === this.doorInner2.c && p.r === this.doorInner2.r) return false;
    return !this.collectibles.some((col) => !col.taken && col.c === p.c && col.r === p.r);
  }

  wellLanding(entrance) {
    const { hero, maze } = this;
    const dist = maze.distancesFrom(hero.cell.c, hero.cell.r);
    const candidates = [];
    maze.forEachCell((c, r, type) => {
      if (type !== "floor" && type !== "spawn") return;
      const d = dist[maze.idx(c, r)];
      if (d < 7 || Math.abs(c - entrance.c) + Math.abs(r - entrance.r) < 4) return;
      if (this.chasers.some((ch) => Math.hypot(ch.x - c, ch.y - r) < 3)) return;
      candidates.push({ c, r });
    });
    return candidates[Math.floor(this.rng() * candidates.length)] || this.level.heroSpawn;
  }

  /**
   * Flood trap. The safe zone is a straight-line radius around the hero (walls do not shield him):
   * once the crocodile is inside it, the hero has FLOOD_WARNING_SECONDS to open the gap again before it leaps.
   */
  updateFlood(dt) {
    const flood = this.flood;
    const { hero } = this;
    if (flood.leap) {
      const leap = flood.leap;
      leap.time += dt;
      const k = Math.min(1, leap.time / FLOOD_LEAP_SECONDS);
      leap.croc.x = leap.from.x + (hero.x - leap.from.x) * k;
      leap.croc.y = leap.from.y + (hero.y - leap.from.y) * k;
      if (k >= 1) {
        const croc = leap.croc;
        flood.leap = null;
        flood.crocInSafeZone = false;
        flood.croc = null;
        flood.remaining = FLOOD_WARNING_SECONDS;
        croc.x = hero.cell.c;
        croc.y = hero.cell.r;
        croc.dir = null;
        croc.state = "CHASE";
        if (hero.knives > 0 || hero.graceTimer > 0) this.checkChaserCollisions();
        else this.caught(croc);
      }
      return;
    }
    const croc = this.chasers
      .filter((c) => c.type === "crocodile" && c.dangerous)
      .sort((a, b) => Math.hypot(a.x - hero.x, a.y - hero.y) - Math.hypot(b.x - hero.x, b.y - hero.y))[0];
    const inside = !!croc && Math.hypot(croc.x - hero.x, croc.y - hero.y) <= this.trap.config.safeRadius;
    if (!inside) {
      flood.crocInSafeZone = false;
      flood.croc = null;
      flood.remaining = FLOOD_WARNING_SECONDS;
      return;
    }
    if (!flood.crocInSafeZone) {
      flood.crocInSafeZone = true;
      flood.croc = croc;
      flood.dangerStart = this.elapsed;
    }
    flood.remaining = Math.max(0, FLOOD_WARNING_SECONDS - (this.elapsed - flood.dangerStart));
    if (flood.remaining > 0) return;
    flood.ambushTriggered = true;
    flood.leap = { croc, from: { x: croc.x, y: croc.y }, time: 0 };
    croc.state = "LEAPING";
    croc.facing = hero.x > croc.x ? 1 : -1;
    this.audio.play("slash");
  }

  checkChaserCollisions() {
    const { hero } = this;
    const hitDist = HERO_RADIUS + CHASER_RADIUS;
    for (const ch of this.chasers) {
      if (!ch.active) continue;
      const d = Math.hypot(ch.x - hero.x, ch.y - hero.y);
      if (ch.harmlessUntilClear && d > hitDist + 0.35) ch.harmlessUntilClear = false;
      if (!ch.dangerous) {
        ch.nearMiss = false;
        continue;
      }
      if (d < hitDist) {
        if (hero.graceTimer > 0) continue;
        if (hero.knives > 0) {
          hero.knives -= 1;
          if (hero.knives === 0) hero.knifeTimer = 0;
          hero.graceTimer = KNIFE_GRACE;
          ch.nearMiss = false;
          if (ch.type === "crocodile") {
            this.beginSmash(ch);
            return false;
          }
          ch.stun(KNIFE_STUN_DURATION);
          this.audio.play("punch");
          this.audio.play("slash");
          this.ui.toast(TEXT.knifeUsed);
          this.effects.push({ kind: "slash", x: ch.x, y: ch.y, time: 0.4, duration: 0.4, radius: 1.4, color: "#ffffff" });
          continue;
        }
        this.caught(ch);
        return true;
      }
      if (d < 1.1) ch.nearMiss = true;
      else if (ch.nearMiss && d > 2.2) {
        ch.nearMiss = false;
        if (this.nearMissCooldown <= 0) {
          this.nearMissCooldown = 8;
          this.ui.toast(TEXT.nearMiss);
        }
      }
    }
    return false;
  }

  caught(ch) {
    this.state = "CAUGHT";
    this.caughtBy = ch.type;
    this.caughtTimer = 0;
    this.cardShown = false;
    this.input.enabled = false;
    this.input.reset();
    this.endAttempt();
    this.ui.updatePowers([]);
    this.ui.setDanger(0);
    this.shake = Math.max(this.shake || 0, 0.3);
    this.audio.stopMusic();
    // The moment he is caught: Thatha and Dhayyam get "Navalla Kadu"; the crocodile and the train keep the original sound.
    this.audio.play(ch.type === "creature" || ch.type === "shawlMan" ? "chaserKill" : "levelFailure");
    this.ui.flash("CHAMPESADU");
  }

  // ---------- Train Guard: the train is deadly ----------

  /** A horn sounds each time the train comes round to cross the board (louder the nearer you are to its track). */
  updateTrainHorn(dt) {
    if (this.trap.id !== "train" || this.trainDiverted) return;
    const side = this.renderer.side;
    const horizontal = side === "top" || side === "bottom";
    const loop = (horizontal ? this.maze.cols : this.maze.rows) + 7;
    const pass = Math.floor((this.t * TRAIN.speed) / loop);
    if (this.trainPass == null) {
      this.trainPass = pass;
      this.trainHornCd = 0.8; // the first blast comes just after the round begins, so you know what is coming
      this.trainHornPending = true;
    }
    if (pass !== this.trainPass) {
      this.trainPass = pass;
      this.trainHornPending = true;
    }
    if (this.trainHornCd > 0) {
      this.trainHornCd -= dt;
      return;
    }
    if (!this.trainHornPending) return;
    this.trainHornPending = false;
    const line = trainTrack(this.level.door, side).line;
    const away = horizontal ? Math.abs(this.hero.y - line) : Math.abs(this.hero.x - line);
    this.audio.horn(Math.max(0.35, Math.min(1, 1 - away / 14)));
  }

  /**
   * While the train is still running, any car that reaches the hero flattens him. (A short grace at the start
   * of the round means it can never catch him standing at the spawn.) Returns true when he was hit.
   */
  checkTrain() {
    if (this.trap.id !== "train" || this.trainDiverted || this.elapsed < TRAIN_START_GRACE) return false;
    const cars = trainCars(this.maze, this.level.door, this.renderer.side, this.t);
    const { hero } = this;
    if (!trainHits(cars, hero.x + 0.5, hero.y + 0.5, HERO_RADIUS)) return false;
    this.effects.push({ kind: "impact", x: hero.x, y: hero.y, time: 0.55, duration: 0.55, radius: 1.5, color: "#f2c14e" });
    this.shake = 0.3;
    this.audio.play("thud");
    this.ui.toast("Flattened by the train! 🚆");
    this.caught({ type: "train" });
    return true;
  }

  // ---------- Hidden Exit: the heroine is held hostage by the crocodile ----------

  /** Puts the heroine at the crocodile's post and guarantees knives, since only a knife can take it out. */
  setupHostage() {
    if (!this.trap || this.trap.id !== "hiddenDoor") return;
    const croc = this.chasers.find((c) => c.type === "crocodile");
    if (!croc || !Number.isFinite(croc.spawn.c)) return;
    const { maze, hero } = this;
    const post = { c: croc.spawn.c, r: croc.spawn.r };
    // The captor stands guard on a neighbouring cell, on the hero's side of the heroine.
    const heroDist = maze.distancesFrom(hero.cell.c, hero.cell.r);
    const guard =
      DIR_NAMES.map((n) => ({ c: post.c + DIRS[n].x, r: post.r + DIRS[n].y }))
        .filter((p) => maze.isWalkable(p.c, p.r))
        .sort((a, b) => heroDist[maze.idx(a.c, a.r)] - heroDist[maze.idx(b.c, b.r)])[0] || post;
    croc.spawn = { c: guard.c, r: guard.r };
    croc.guard = { c: guard.c, r: guard.r };
    croc.reset();
    this.heroine = new Heroine(post);
    this.hostageToastCooldown = 0;
    this.placeBonusKnives(guard);
  }

  /** Two extra knives in the corridors leading to the captor, so the level can always be finished. */
  placeBonusKnives(post) {
    const { maze, hero } = this;
    const fromPost = maze.distancesFrom(post.c, post.r);
    const fromHero = maze.distancesFrom(hero.cell.c, hero.cell.r);
    const used = (c, r) =>
      this.collectibles.some((col) => col.c === c && col.r === r) ||
      (c === this.level.door.c && r === this.level.door.r) ||
      (c === this.heroine.spawn.c && r === this.heroine.spawn.r) ||
      (c === hero.cell.c && r === hero.cell.r);
    for (const target of [7, 13]) {
      const options = [];
      maze.forEachCell((c, r, type) => {
        if (type !== "floor") return;
        const d = fromPost[maze.idx(c, r)];
        if (d < 0 || Math.abs(d - target) > 1 || used(c, r)) return;
        options.push({ c, r, h: fromHero[maze.idx(c, r)] });
      });
      options.sort((a, b) => a.h - b.h);
      const pick = options[0];
      if (!pick) continue;
      maze.setType(pick.c, pick.r, "collectible");
      this.collectibles.push({ type: "knife", c: pick.c, r: pick.r, taken: false });
    }
  }

  /** Touching the heroine frees her, but only once her captor is gone. */
  checkHostage() {
    const h = this.heroine;
    if (!h || h.following) return;
    if (Math.hypot(this.hero.x - h.x, this.hero.y - h.y) > 0.75) return;
    const captor = this.chasers.find((c) => c.type === "crocodile");
    if (captor?.active) {
      if (this.hostageToastCooldown <= 0) {
        this.hostageToastCooldown = 3;
        this.ui.toast("Take out the crocodile first! 🔪");
      }
      return;
    }
    h.free();
    this.hiddenDoorRevealed = true;
    this.audio.startLoop("sahana");
    this.ui.toast("She's free — get her to the exit! 💃");
  }

  // ---------- knife vs crocodile ----------

  /** The hero grabs the crocodile by the tail; the move itself is played out by updateSmash / the renderer. */
  beginSmash(croc) {
    const hero = this.hero;
    hero.moving = false;
    croc.moving = false;
    croc.state = "SMASHED";
    croc.nearMiss = false;
    this.smash = {
      t: 0,
      croc,
      killed: this.trap.id === "hiddenDoor" && !!this.heroine,
      left: false,
      right: false,
      heroDx: croc.x - hero.x || -1,
    };
    this.audio.play("punch");
    this.audio.play("slash");
    this.ui.toast(TEXT.knifeUsed);
  }

  updateSmash(dt) {
    const sm = this.smash;
    const prev = sm.t;
    sm.t += dt;
    const hero = this.hero;
    const impact = (side) => {
      const x = hero.x + (side === "left" ? -0.9 : 0.9);
      this.effects.push({ kind: "impact", x, y: hero.y + 0.35, time: 0.55, duration: 0.55, radius: 1.5, color: "#f2c14e" });
      this.audio.play("thud");
      this.shake = 0.2;
    };
    if (!sm.left && prev < SMASH_IMPACT_LEFT && sm.t >= SMASH_IMPACT_LEFT) {
      sm.left = true;
      impact("left");
    }
    if (!sm.right && prev < SMASH_IMPACT_RIGHT && sm.t >= SMASH_IMPACT_RIGHT) {
      sm.right = true;
      impact("right");
    }
    if (sm.t < SMASH_DURATION) return;

    // Thrown clear of the maze: gone for a while, or for good if it was the hostage-taker.
    const croc = sm.croc;
    this.smash = null;
    hero.graceTimer = Math.max(hero.graceTimer, 1);
    if (sm.killed) {
      croc.state = "DEAD";
      croc.active = false;
      this.ui.toast("The crocodile is gone — free her! 💥");
    } else {
      croc.throwDirection = { x: 1, y: 0 };
      croc.throwTimer = 0;
      croc.stun(KNIFE_STUN_DURATION);
    }
  }

  // ---------- "Parigettandi": something is right behind the hero ----------

  /** True while this chaser is actively hunting the hero (not wandering, frozen or stunned). */
  isHunting(ch) {
    if (!ch.dangerous) return false;
    if (ch.type === "crocodile") return ch.mode === "HUNT";
    if (ch.type === "creature") return ch.mode === "CHASE";
    return true; // Thatha always closes in
  }

  /**
   * Plays once when a hunting chaser is TRAILING the hero: close behind him, in the corridor he just ran
   * through, and following him. A chaser that is merely nearby (beside, ahead, or behind a wall) does not count.
   * It re-arms once he has shaken the chaser off.
   */
  updateTooClose(dt) {
    const s = this.tooClose;
    if (s.cooldown > 0) s.cooldown -= dt;
    const { hero, maze } = this;
    const heading = hero.moving && hero.dir ? DIRS[hero.dir] : null;
    const fromHero = maze.isWalkable(hero.cell.c, hero.cell.r) ? maze.distancesFrom(hero.cell.c, hero.cell.r) : null;
    let nearest = Infinity;
    let hunted = Infinity;
    let trailing = false;
    for (const ch of this.chasers) {
      if (!ch.dangerous) continue;
      const dx = ch.x - hero.x;
      const dy = ch.y - hero.y;
      const d = Math.hypot(dx, dy);
      nearest = Math.min(nearest, d);
      if (this.isHunting(ch)) hunted = Math.min(hunted, d);
      if (!heading || !this.isHunting(ch) || !ch.moving || d > TOO_CLOSE_DISTANCE) continue;
      const behind = -(dx * heading.x + dy * heading.y); // how far back along his running direction
      const aside = Math.abs(dx * heading.y - dy * heading.x); // how far off to the side
      const steps = fromHero ? fromHero[maze.idx(ch.cell.c, ch.cell.r)] : -1; // corridor distance
      if (behind >= 0.6 && aside <= 0.7 && steps >= 0 && steps <= Math.ceil(TOO_CLOSE_DISTANCE) + 1) trailing = true;
    }
    // The screen edges flush red as a hunting chaser closes in (see ui.setDanger).
    const target = Number.isFinite(hunted) ? Math.min(1, Math.max(0, 1 - hunted / 5.5)) : 0;
    this.dangerLevel += (target - this.dangerLevel) * Math.min(1, dt * 6);
    if (!s.armed) {
      if (s.cooldown <= 0 && nearest > TOO_CLOSE_RESET) s.armed = true;
      return;
    }
    if (trailing && s.cooldown <= 0) {
      s.armed = false;
      s.cooldown = TOO_CLOSE_COOLDOWN;
      this.audio.play("tooClose");
    }
  }

  // ---------- Twin Doors: Heroine 2 steps out of the first door ----------

  /** The cell just inside a door (where the hero stands to meet whoever is in the doorway). */
  innerOf(door) {
    for (const n of DIR_NAMES) {
      const c = door.c + DIRS[n].x;
      const r = door.r + DIRS[n].y;
      if (this.maze.isWalkable(c, r)) return { c, r };
    }
    return this.level.heroSpawn;
  }

  coachText(kind) {
    const touch = document.body.classList.contains("touch");
    const words = {
      intro: touch ? "Swipe anywhere on the maze to run. Go on, give it a try!" : "Tap an arrow key (or swipe) to run. Go on, give it a try!",
      nudge: touch ? "Psst… slide your finger across the maze. It won't bite! 😄" : "Psst… press an arrow key. It won't bite! 😄",
      cheer: touch ? "Look at you go! Swipe is working 🎉" : "Look at you go! 🎉",
      tip: touch ? "Pro tip: swipe a turn early. He'll take it at the next junction 😉" : "Pro tip: press a turn early. He'll take it at the next junction 😉",
    };
    return words[kind];
  }

  /** Counts the player's swipes / key presses on level 1 and reacts to the first ones with a little cheer. */
  notePress() {
    const c = this.coach;
    if (!c || this.state !== "PLAYING") return;
    c.presses++;
    if (c.presses === 1) {
      this.ui.hideCoach();
      this.ui.toast(this.coachText("cheer"));
    } else if (c.presses === 5) {
      this.ui.toast(this.coachText("tip"));
      this.storage.data.swipeLearned = true; // learnt: no more coaching on later attempts
      this.storage.save();
      this.coach = null;
    }
  }

  /** A swipe, tap or key press: skips the Twin Doors conversation, but only once it has been heard in full before. */
  requestSkip() {
    const ev = this.event;
    if (ev && ev.skippable && ev.t > 0.5) ev.skip = true;
  }

  /**
   * The hero has reached a door. Whichever of the two it is becomes Heroine 2's door; the other one is the way out
   * (if he happened to open the real exit first, the two doors simply swap roles).
   */
  beginTwinEvent(door) {
    const { hero, level } = this;
    if (door.c === level.door.c && door.r === level.door.r) {
      const other = this.trap.config.decoyDoor;
      this.trap.config.decoyDoor = { c: door.c, r: door.r };
      level.door = { c: other.c, r: other.r };
      this.doorInner = this.findDoorInner();
      this.refreshDoorInner2();
      this.renderer.side = doorSide(level);
    }
    const decoy = this.trap.config.decoyDoor;
    const inner = this.innerOf(decoy);
    hero.x = inner.c;
    hero.y = inner.r;
    hero.dir = null;
    hero.queued = null;
    hero.moving = false;
    hero.facing = decoy.c > inner.c ? 1 : decoy.c < inner.c ? -1 : hero.facing;
    this.input.reset();
    const she = new Heroine({ c: decoy.c, r: decoy.r }, "heroine2");
    she.state = "TALKING";
    she.appear = 0;
    this.allies.push(she);
    const talk = this.audio.duration("heroine2") || 8;
    // The first time it is heard in full; from the second time any swipe, tap or key press skips it.
    const skippable = !!this.storage.data.twinSeen;
    this.event = { type: "twin", t: 0, duration: talk + 0.8, decoy, inner, she, skippable, skip: false };
    this.audio.play("heroine2");
    this.ui.showSkipHint(skippable);
    this.ui.toast("Someone is behind this door… 👀");
  }

  updateEvent(dt) {
    const ev = this.event;
    ev.t += dt;
    this.decoyOpen = Math.min(1, ev.t * 1.8);
    ev.she.appear = Math.min(1, Math.max(0, (ev.t - 0.3) / 0.7));
    if (ev.t < ev.duration && !ev.skip) return;
    // The conversation is over (or skipped): she joins him, and the other door can open.
    this.audio.stopStingers();
    this.audio.stopDuck();
    this.ui.showSkipHint(false);
    this.decoyOpen = 1;
    ev.she.x = ev.inner.c;
    ev.she.y = ev.inner.r;
    ev.she.appear = 1;
    ev.she.free();
    this.twinDone = true;
    this.event = null;
    if (!this.storage.data.twinSeen) {
      this.storage.data.twinSeen = true;
      this.storage.save();
    }
    this.hero.graceTimer = Math.max(this.hero.graceTimer, 1.5);
    this.ui.toast("She's with you. Now the other door! 🚪");
  }

  // ---------- Sudden Wells: Heroine 3 climbs out of the well ----------

  /** How many chasers Heroine 3 knocks out: one, or two from level 13 on. */
  fighterQuota() {
    return this.levelNumber >= 13 ? 2 : 1;
  }

  /**
   * The floor gives way under the hero without warning, a few seconds into the round while he is on the move,
   * so he is sure to fall in and the story can begin (he never has to walk back to a well).
   */
  openStoryWell() {
    const { hero } = this;
    const entrance = { c: hero.cell.c, r: hero.cell.r };
    const landing = this.wellLanding(entrance);
    if (!landing) return false;
    this.wellSpawns++;
    this.trap.config.wells = [{ c: entrance.c, r: entrance.r, openedAt: this.t, story: true }];
    this.trap.config.landing = landing;
    this.wellOpenTimer = Infinity;
    this.wellStory = { stage: "OPEN", t: 0, A: entrance };
    this.shake = Math.max(this.shake || 0, 0.3);
    this.audio.play("thud");
    this.effects.push({ kind: "impact", x: entrance.c, y: entrance.r, time: 0.5, duration: 0.5, radius: 1.5, color: "#8a6a3a" });
    return true;
  }

  updateWellStory(dt) {
    const st = this.wellStory;
    if (!st) return;
    if (st.stage === "WAIT") {
      st.t += dt;
      st.delay = st.delay ?? 2.6 + this.rng() * 1.6;
      // wait for a moment when he is running along, so it is a complete surprise
      if (st.t >= st.delay && (this.hero.moving || st.t >= st.delay + 6)) {
        if (!this.openStoryWell()) st.t = st.delay - 0.4; // no good landing right now: try again shortly
      }
    } else if (st.stage === "FELL") {
      st.t += dt;
      if (st.t >= 1.5) {
        st.fighter = new Fighter(st.A);
        this.allies.push(st.fighter);
        st.stage = "EMERGE";
        st.t = 0;
        // She arrives with her own music: the background music stops and her song takes over for the rest of the round.
        this.audio.startLoop("nacche");
        this.ui.toast("Someone is climbing out of the well! 👀");
      }
    } else if (st.stage === "HUNT") {
      st.t += dt;
      if (st.t > 0.6 && this.trap.config.wells.length) this.trap.config.wells = []; // both wells close behind her
    }
  }

  onFighterOut() {
    if (this.wellStory) {
      this.wellStory.stage = "HUNT";
      this.wellStory.t = 0;
    }
    this.ui.toast(this.fighterQuota() > 1 ? "She's going after two of the chasers! 💪" : "She's going after a chaser! 💪");
  }

  onFighterJoined() {
    this.storyDone = true;
    if (this.wellStory) this.wellStory.stage = "DONE";
    this.trap.config.wells = [];
    this.wellCooldown = WELL_COOLDOWN;
    this.hero.graceTimer = Math.max(this.hero.graceTimer, 1);
    this.ui.toast("She's with you. Find the exit! 🚪");
  }

  /** Heroine 3 knocks a chaser out cold for good. */
  fighterPunch(f, ch) {
    const dx = ch.x - f.x;
    const dy = ch.y - f.y;
    const len = Math.hypot(dx, dy) || 1;
    const dir = { x: dx / len, y: dy / len };
    f.punchT = 0.5;
    f.kills = (f.kills || 0) + 1;
    f.facing = dx >= 0 ? 1 : -1;
    this.audio.play("punch");
    this.shake = Math.max(this.shake || 0, 0.25);
    this.effects.push({ kind: "slash", x: ch.x, y: ch.y, time: 0.4, duration: 0.4, radius: 1.4, color: "#ffffff" });
    this.effects.push({ kind: "impact", x: ch.x, y: ch.y, time: 0.55, duration: 0.55, radius: 1.5, color: "#f2c14e" });
    ch.ko = true;
    ch.nearMiss = false;
    ch.throwAway(dir, 999);
    ch.fatalTimer = 0.75;
    this.ui.toast(ch.type === "creature" ? "Dhayyam is out cold! 👊" : "The crocodile is out cold! 👊");
  }

  /** Every finished attempt (caught or escaped) counts toward its 10-level block's Aasthi average. */
  endAttempt() {
    for (const ch of this.chasers) ch.cancelTeleportWarning?.();
    recordAttempt(this.storage.data, this.levelNumber, this.elapsed);
    this.storage.save();
  }

  checkDoor() {
    const { hero, level } = this;
    if (!this.hiddenDoorRevealed || !this.trainDiverted) return false;
    // Twin Doors: the FIRST door the hero reaches (either one) is Heroine 2's. Reaching it starts their conversation.
    if (this.trap.id === "twoDoors" && this.trap.config.decoyDoor && !this.twinDone) {
      for (const d of [this.trap.config.decoyDoor, level.door]) {
        // either of a door's two tiles counts
        if (this.doorTiles(d).some((tile) => Math.abs(hero.x - tile.c) + Math.abs(hero.y - tile.r) <= 1.05)) {
          this.beginTwinEvent({ c: d.c, r: d.r });
          return false;
        }
      }
    }
    // The exit is two tiles wide: the hero leaves from whichever of the two he walks into.
    const exitTile = this.doorTiles(level.door).find((tile) => Math.abs(hero.x - tile.c) + Math.abs(hero.y - tile.r) <= 0.55);
    if (!exitTile) return false; // the hero has to reach the door itself
    // The real exit stays shut until the round's story has been played.
    const locked = this.trap.id === "well" && !this.storyDone ? "The exit is sealed until the stranger from the well joins you." : null;
    if (locked) {
      const back = this.innerOf(exitTile);
      hero.x = back.c;
      hero.y = back.r;
      hero.dir = null;
      hero.queued = null;
      if (this.lockToastCd <= 0) {
        this.lockToastCd = 3;
        this.ui.toast(locked);
      }
      return false;
    }
    this.state = "LEVEL_COMPLETE";
    setTimeout(() => this.prepareLevel(this.levelNumber + 1), 700); // so "Next level" is instant
    this.completeTimer = 0;
    this.cardShown = false;
    this.input.enabled = false;
    this.input.reset();
    this.ui.updatePowers([]);
    this.ui.setDanger(0);
    this.audio.stopMusic();
    this.ui.toast(TEXT.win);

    const data = this.storage.data;
    const n = this.levelNumber;
    data.unlocked = Math.max(data.unlocked, n + 1);
    if (n >= TITLE_LEVEL) data.completed = true;
    data.completionTimes = data.completionTimes || {};
    data.completionTimes[n] = Math.round((this.retryTime + this.elapsed) * 10) / 10;
    this.isBest = !data.best[n] || this.elapsed < data.best[n];
    if (this.isBest) data.best[n] = Math.round(this.elapsed * 10) / 10;
    this.endAttempt();
    // Aasthi is paid every round, from this round's time (earlier attempts included), and the HUD total moves at once.
    this.roundAward = awardRound(data, n, data.completionTimes[n]);
    if (n % MILESTONE_LEVELS === 0) this.newAward = this.roundAward; // the milestone card, the first time only
    this.storage.save();
    this.ui.setHud({ level: n, time: this.elapsed });
    return true;
  }

  showCompletionCard() {
    if (this.newAward) {
      this.state = "FINAL_SUCCESS";
      this.audio.play("aasthiAward");
      this.ui.showFinal(this.levelNumber + 1);
    } else {
      this.audio.play("levelSuccess");
      this.ui.showLevelComplete({
        level: this.levelNumber,
        time: this.elapsed,
        best: this.storage.data.best[this.levelNumber],
        isBest: this.isBest,
        seconds: this.storage.data.completionTimes?.[this.levelNumber] ?? this.elapsed,
        earned: this.roundAward?.amount ?? 0,
      });
    }
  }

  // ---------- powers ----------

  get heroPowered() {
    const h = this.hero;
    return !!h && (h.boostTimer > 0 || this.eyeTimer > 0 || h.knives > 0);
  }

  /** hero2 avatar is shown while any power is valid; it flickers back to hero1 just before expiring. */
  heroPoweredVisible(t) {
    if (!this.heroPowered) return false;
    if (this.state !== "PLAYING") return true;
    const remaining = Math.max(this.hero.boostTimer, this.eyeTimer, this.hero.knives > 0 ? this.hero.knifeTimer : 0);
    if (remaining > POWER_FLICKER) return true;
    return Math.floor(t * 10) % 2 === 0;
  }

  activePowers() {
    const list = [];
    if (this.eyeTimer > 0) list.push({ type: "eye", remaining: this.eyeTimer, total: EYE_DURATION });
    if (this.hero?.boostTimer > 0) list.push({ type: "boost", remaining: this.hero.boostTimer, total: BOOST_DURATION });
    if (this.hero?.knives > 0) {
      list.push({ type: "knife", count: this.hero.knives, remaining: this.hero.knifeTimer, total: KNIFE_DURATION });
    }
    return list;
  }

  get showDoorArrow() {
    return false;
  }

  // ---------- chaser support ----------

  /** The tile in front of the exit's second (partner) tile. */
  refreshDoorInner2() {
    const partner = doorPartner(this.maze, this.level.door);
    this.doorInner2 = partner ? this.innerOf(partner) : this.doorInner;
  }

  /** The two tiles a door is made of. */
  doorTiles(d) {
    const partner = doorPartner(this.maze, d);
    return partner ? [{ c: d.c, r: d.r }, partner] : [{ c: d.c, r: d.r }];
  }

  findDoorInner() {
    const { door } = this.level;
    for (const n of DIR_NAMES) {
      const c = door.c + DIRS[n].x;
      const r = door.r + DIRS[n].y;
      if (this.maze.isWalkable(c, r)) return { c, r };
    }
    return this.level.heroSpawn;
  }

  /** Picks a respawn cell, preferring the far half of cells at least 3 seconds of hero travel away. */
  findSafeCell({ exclude = null, euclidMin = 0 } = {}) {
    const { maze, hero } = this;
    let from = hero.cell;
    if (!maze.isWalkable(from.c, from.r)) from = this.doorInner;
    const dist = maze.distancesFrom(from.c, from.r);
    const others = this.chasers.filter((c) => c !== exclude && c.active);
    const candidates = [];
    maze.forEachCell((c, r, t) => {
      if (t !== "floor" && t !== "spawn") return;
      const i = maze.idx(c, r);
      if (dist[i] < MIN_SAFE_DISTANCE) return;
      if (euclidMin && Math.hypot(c - hero.x, r - hero.y) < euclidMin) return;
      if (others.some((o) => Math.abs(o.x - c) + Math.abs(o.y - r) < 3)) return;
      candidates.push({ c, r, d: dist[i] });
    });
    if (!candidates.length) return null;
    const pool = candidates.sort((a, b) => b.d - a.d).slice(0, Math.max(1, Math.ceil(candidates.length / 2)));
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return { c: pick.c, r: pick.r };
  }

  /**
   * The Shawl Man reappears exactly SHAWL_APPEAR_SECONDS of hero travel away (by corridor distance):
   * never closer, never farther. `ambush` biases the pick towards the hero's route to the door.
   */
  findShawlCell(shawl) {
    const { maze, hero } = this;
    let from = hero.cell;
    if (!maze.isWalkable(from.c, from.r)) from = this.doorInner;
    const dist = maze.distancesFrom(from.c, from.r);
    // Base speed, not boosted: a boost must not push the Shawl Man's landing spot further out with the hero.
    const target = Math.max(2, Math.round(HERO_BASE_SPEED * SHAWL_APPEAR_SECONDS));
    const others = this.chasers.filter((c) => c !== shawl && c.active);
    const cells = [];
    maze.forEachCell((c, r, t) => {
      if (t !== "floor" && t !== "spawn") return;
      const d = dist[maze.idx(c, r)];
      if (d < target) return;
      if (others.some((o) => Math.abs(o.x - c) + Math.abs(o.y - r) < 2)) return;
      if (Math.abs(shawl.x - c) + Math.abs(shawl.y - r) < 3) return;
      cells.push({ c, r, d });
    });
    if (!cells.length) return null;
    const best = Math.min(...cells.map((x) => x.d));
    let pool = cells.filter((x) => x.d === best);
    const ambush = shawl.cfg.ambush || 0;
    if (ambush > 0 && Math.random() < ambush) {
      const route = maze.findPath(from.c, from.r, this.doorInner.c, this.doorInner.r) || [];
      const onRoute = new Set(route.map((p) => maze.idx(p.c, p.r)));
      const ahead = pool.filter((x) => onRoute.has(maze.idx(x.c, x.r)));
      if (ahead.length) pool = ahead;
    }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return { c: pick.c, r: pick.r };
  }

  /** Thatha's warned destination is called off if the hero has since run right up to it. */
  thathaLandingValid(spot) {
    const { maze, hero } = this;
    if (!maze.isWalkable(hero.cell.c, hero.cell.r)) return true;
    const d = maze.distancesFrom(hero.cell.c, hero.cell.r)[maze.idx(spot.c, spot.r)];
    return d < 0 || d >= THATHA_MIN_LANDING_STEPS;
  }

  onShawlBlink(shawl, target) {
    this.audio.play("teleport");
    const color = "#8e44ad";
    this.effects.push({ kind: "teleport", x: shawl.x, y: shawl.y, time: TELEPORT_FX_DURATION, duration: TELEPORT_FX_DURATION, radius: 1.1, color });
    this.effects.push({ kind: "teleport", x: target.c, y: target.r, time: TELEPORT_FX_DURATION, duration: TELEPORT_FX_DURATION, radius: 1.1, color });
  }

  onShawlTeleport() {
    if (this.shawlToastCooldown <= 0) {
      this.shawlToastCooldown = 18;
      this.ui.toast(CHASER_INFO.shawlMan.intro);
    }
  }
}
