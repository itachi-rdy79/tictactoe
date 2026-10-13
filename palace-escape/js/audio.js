import { MUSIC_DUCK } from "./config.js";

const MUSIC_VOLUME = 0.8;
/** Action sounds (clips and gameplay effects) always play at full level. */
const ACTION_VOLUME = 1;
/** How quickly the music dips / recovers around an action sound (seconds, time constant). */
const DUCK_IN = 0.04;
const DUCK_OUT = 0.25;

/** Result stingers: starting one stops any other stinger that is still playing. */
const STINGERS = ["levelFailure", "levelSuccess", "aasthiAward", "chaserKill"];
/** A stinger can list alternates here; the failure sounds are fixed: levelFailure (croc, train) and chaserKill (Thatha, Dhayyam). */
const STINGER_VARIANTS = {};
/** One-shot clips that are not stingers (they overlap freely and just duck the music). */
const CLIPS = ["tooClose", "jamakay", "doorPadipoindi", "punch", "heroine2"];
/** Synthesized gameplay effects that duck the music (menu clicks and the countdown blip do not). */
const DUCKING_EFFECTS = new Set(["pickup", "boost", "knife", "slash", "teleport", "powerdown", "win"]);

/**
 * Music + action sounds.
 *
 * Music is a queue of segments: optional intro(s) that play once, then a looping bgm. Action sounds play at
 * 100% and pull the music down to MUSIC_DUCK of its level while they sound. A looped clip (the Hidden Exit
 * theme) silences the music completely until the level ends.
 * Files are fetched at boot but only decoded once the first user gesture unlocks the AudioContext.
 */
export class AudioManager {
  constructor(muted = false) {
    this.muted = muted;
    this.ctx = null;
    this.raw = {};
    this.buffers = {};
    this.failed = new Set();
    this.stingers = new Set();
    this.duckUntil = 0;
    this.music = { wanted: false, paused: false, queue: [], src: null, startedAt: 0, offset: 0 };
    this.loop = null; // { name, src, startedAt, offset }
  }

  /** Remembers where the clips live. Nothing is downloaded yet: see fetchClips. */
  preload(files) {
    this.files = files;
  }

  /**
   * Starts downloading the named clips (each only once). They are fetched shortly before they are needed instead
   * of all at start-up, so the menu and the first screens do not compete with ~3 MB of sound for a phone's bandwidth.
   */
  fetchClips(names) {
    for (const name of names) {
      const url = this.files?.[name];
      if (!url || name in this.raw) continue;
      this.raw[name] = fetch(url)
        .then((r) => (r.ok ? r.arrayBuffer() : null))
        .catch(() => null);
    }
    if (this.ctx) this.decodeAll();
  }

  /**
   * Creates the audio context and its volume controls. This is allowed before any tap (the context simply starts
   * suspended), so the page does it quietly while the menu is on screen; the tap then only has to resume it.
   */
  ensureContext() {
    if (this.ctx) return true;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return false;
    this.ctx = new Ctx();
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = MUSIC_VOLUME;
    this.musicGain.connect(this.ctx.destination);
    this.actionGain = this.ctx.createGain();
    this.actionGain.gain.value = ACTION_VOLUME;
    this.actionGain.connect(this.ctx.destination);
    this.decodeAll();
    return true;
  }

  unlock() {
    if (!this.ensureContext()) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  /**
   * Decodes the clips ONE AT A TIME, most urgent first, with a short breather between each. Decoding a dozen
   * music-length MP3s all at once starves the page's main thread (the whole game froze on slower machines).
   */
  /** Ends any ducking of the music right away (used when a long clip is cut short). */
  stopDuck() {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    this.duckUntil = 0;
    const g = this.musicGain.gain;
    g.cancelScheduledValues(now);
    g.setTargetAtTime(MUSIC_VOLUME, now, 0.08);
  }

  /** Length in seconds of a decoded clip (0 until it has finished decoding). */
  duration(name) {
    return this.buffers[name]?.duration || 0;
  }

  async decodeAll() {
    if (this.decoding) return; // a run is already going; it will pick up newly fetched clips too
    this.decoding = true;
    const first = ["bgm", "intro", "tooClose", "chaserKill", "levelFailure"];
    try {
      for (;;) {
        const pending = Object.keys(this.raw).filter((n) => !(n in this.buffers) && !this.failed.has(n));
        if (!pending.length) break;
        const name = first.find((n) => pending.includes(n)) || pending[0];
        const data = await this.raw[name];
        if (!data) {
          this.markFailed(name);
          continue;
        }
        try {
          // Promise form only: passing callbacks as well makes a failed decode an unhandled rejection too.
          this.buffers[name] = await this.ctx.decodeAudioData(data);
          this.kick(); // the music may have been waiting for this clip
        } catch {
          this.markFailed(name);
        }
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
    } finally {
      this.decoding = false;
    }
  }

  markFailed(name) {
    this.failed.add(name);
    this.kick();
  }

  /** Something the music or loop was waiting for has decoded (or failed): try again. */
  kick() {
    this.startMusicSource();
    this.startLoopSource();
  }

  setMuted(m) {
    this.muted = m;
    if (m) {
      this.pauseMusicSource();
      this.pauseLoopSource();
      this.stopStingers();
    } else {
      this.kick();
    }
  }

  // ---------- ducking ----------

  /** Dips the music to MUSIC_DUCK of its level for `seconds`, then eases it back. */
  duck(seconds) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    this.duckUntil = Math.max(this.duckUntil, now + seconds);
    const g = this.musicGain.gain;
    g.cancelScheduledValues(now);
    g.setTargetAtTime(MUSIC_VOLUME * MUSIC_DUCK, now, DUCK_IN);
    g.setTargetAtTime(MUSIC_VOLUME, this.duckUntil, DUCK_OUT);
  }

  // ---------- music ----------

  /**
   * Starts the background music from the top. `intro` is a list of one-shot clips to play first
   * ({ name, music }: `music` clips go through the (duckable) music bus, others play at full level).
   * `pandaga` adds the Pandaga song after them; either way the bgm loops afterwards.
   */
  startMusic({ intro = [], pandaga = false } = {}) {
    this.stopMusicSource();
    this.stopLoop();
    const queue = [];
    for (const clip of intro) queue.push({ name: clip.name, loop: false, bus: clip.music ? "music" : "action" });
    if (pandaga) queue.push({ name: "intro", loop: false, bus: "music" });
    queue.push({ name: "bgm", loop: true, bus: "music" });
    this.music = { wanted: true, paused: false, queue, src: null, startedAt: 0, offset: 0 };
    this.startMusicSource();
  }

  pauseMusic() {
    this.music.paused = true;
    this.pauseMusicSource();
    this.pauseLoopSource();
  }

  resumeMusic() {
    this.music.paused = false;
    this.kick();
  }

  /** Stops the music and any looped clip (level over, caught, back to menu). */
  stopMusic() {
    this.music.wanted = false;
    this.music.paused = false;
    this.music.offset = 0;
    this.music.queue = [];
    this.stopMusicSource();
    this.stopLoop();
  }

  startMusicSource() {
    const m = this.music;
    if (!m.wanted || m.paused || m.src || this.muted || !this.ctx || this.loop) return;
    const seg = m.queue[0];
    if (!seg) return;
    const buffer = this.buffers[seg.name];
    if (!buffer) {
      // An intro that could not be loaded is skipped; the bgm loop waits for its own file.
      if (!seg.loop && (this.failed.has(seg.name) || !(seg.name in this.raw))) {
        m.queue.shift();
        this.startMusicSource();
      }
      return;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = seg.loop;
    src.connect(seg.bus === "music" ? this.musicGain : this.actionGain);
    const offset = seg.loop ? m.offset % buffer.duration : Math.min(m.offset, Math.max(0, buffer.duration - 0.05));
    src.onended = () => {
      if (m.src !== src) return; // stopped or replaced on purpose
      m.src = null;
      if (!seg.loop) {
        m.queue.shift();
        m.offset = 0;
        this.startMusicSource();
      }
    };
    src.start(0, offset);
    m.startedAt = this.ctx.currentTime - offset;
    m.src = src;
  }

  pauseMusicSource() {
    const m = this.music;
    if (!m.src) return;
    const seg = m.queue[0];
    m.offset = this.ctx.currentTime - m.startedAt;
    if (seg?.loop) m.offset %= m.src.buffer.duration;
    this.stopMusicSource();
  }

  stopMusicSource() {
    const m = this.music;
    const src = m.src;
    if (!src) return;
    m.src = null; // clear first so onended knows this stop was deliberate
    try {
      src.stop();
    } catch {
      /* already stopped */
    }
    src.disconnect();
  }

  // ---------- looped clip (Hidden Exit theme) ----------

  /** Silences the music and loops `name` at full level until stopLoop() / stopMusic(). */
  startLoop(name) {
    if (this.loop?.name === name) return;
    this.stopLoop();
    this.stopMusicSource(); // the bgm drops out entirely; it comes back with the next level
    this.music.wanted = false;
    this.loop = { name, src: null, startedAt: 0, offset: 0 };
    this.startLoopSource();
  }

  startLoopSource() {
    const l = this.loop;
    if (!l || l.src || this.muted || !this.ctx || this.music.paused) return;
    const buffer = this.buffers[l.name];
    if (!buffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.connect(this.actionGain);
    const offset = l.offset % buffer.duration;
    src.start(0, offset);
    l.startedAt = this.ctx.currentTime - offset;
    l.src = src;
  }

  pauseLoopSource() {
    const l = this.loop;
    if (!l?.src) return;
    l.offset = (this.ctx.currentTime - l.startedAt) % l.src.buffer.duration;
    try {
      l.src.stop();
    } catch {
      /* already stopped */
    }
    l.src.disconnect();
    l.src = null;
  }

  stopLoop() {
    if (!this.loop) return;
    this.pauseLoopSource();
    this.loop = null;
  }

  // ---------- one-shots ----------

  playClip(name, { duck = true } = {}) {
    const buffer = this.buffers[name];
    if (this.muted || !this.ctx || !buffer) return null;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.actionGain);
    src.onended = () => this.stingers.delete(src);
    this.stingers.add(src);
    src.start();
    if (duck) this.duck(buffer.duration);
    return buffer.duration;
  }

  stopStingers() {
    for (const src of this.stingers) {
      try {
        src.stop();
      } catch {
        /* already stopped */
      }
    }
    this.stingers.clear();
  }

  /**
   * A train horn: two blasts (short, then long) from a three-note chord through a soft low-pass, so it sounds like a
   * real horn rather than a beep. `gain` (0-1) is how loud it is for the hero (closer to the track = louder).
   */
  horn(gain = 1) {
    if (this.muted || !this.ctx) return;
    this.duck(2.4);
    const t0 = this.ctx.currentTime;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1500;
    const master = this.ctx.createGain();
    const level = 0.42 * gain;
    master.gain.setValueAtTime(0.0001, t0);
    for (const [start, len] of [[0, 0.5], [0.68, 1.25]]) {
      master.gain.setValueAtTime(0.0001, t0 + start);
      master.gain.exponentialRampToValueAtTime(level, t0 + start + 0.06);
      master.gain.setValueAtTime(level, t0 + start + len - 0.14);
      master.gain.exponentialRampToValueAtTime(0.0001, t0 + start + len);
    }
    for (const f of [233.1, 311.1, 392]) {
      const osc = this.ctx.createOscillator();
      const og = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = f;
      og.gain.value = 0.33;
      osc.connect(og).connect(filter);
      osc.start(t0);
      osc.stop(t0 + 2.1);
    }
    filter.connect(master).connect(this.actionGain);
  }

  tone(freq, dur, { type = "sine", vol = 0.18, slide = null, delay = 0 } = {}) {
    if (this.muted || !this.ctx) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(this.actionGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  play(name) {
    if (STINGERS.includes(name)) {
      this.stopStingers();
      const loaded = (STINGER_VARIANTS[name] || [name]).filter((clip) => this.buffers[clip]);
      this.playClip(loaded[Math.floor(Math.random() * loaded.length)] || name);
      return;
    }
    if (CLIPS.includes(name)) {
      this.playClip(name);
      return;
    }
    if (DUCKING_EFFECTS.has(name)) this.duck(0.5);
    switch (name) {
      case "click":
        this.tone(660, 0.06, { type: "triangle", vol: 0.12 });
        break;
      case "start":
        [523, 659, 784].forEach((f, i) => this.tone(f, 0.12, { type: "triangle", delay: i * 0.08 }));
        break;
      case "pickup":
        [784, 988, 1319].forEach((f, i) => this.tone(f, 0.1, { type: "square", vol: 0.08, delay: i * 0.05 }));
        break;
      case "boost":
        this.tone(300, 0.3, { type: "sawtooth", vol: 0.08, slide: 1200 });
        break;
      case "knife":
        this.tone(1800, 0.12, { type: "sawtooth", vol: 0.07, slide: 600 });
        break;
      case "slash":
        this.tone(2400, 0.18, { type: "sawtooth", vol: 0.1, slide: 300 });
        this.tone(140, 0.2, { type: "square", vol: 0.08 });
        break;
      case "thud":
        this.duck(0.4);
        this.tone(90, 0.22, { type: "square", vol: 0.22, slide: 40 });
        this.tone(180, 0.12, { type: "sawtooth", vol: 0.1, slide: 60 });
        break;
      case "teleport":
        this.tone(900, 0.25, { type: "sine", vol: 0.08, slide: 200 });
        break;
      case "powerdown":
        this.tone(500, 0.18, { type: "triangle", vol: 0.08, slide: 250 });
        break;
      case "win":
        [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.18, { type: "triangle", vol: 0.16, delay: i * 0.1 }));
        break;
      default:
        break;
    }
  }
}
