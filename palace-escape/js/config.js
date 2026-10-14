export const SPRITE_DIR = "assets/sprites";
export const SPRITE_EXT = "webp";

const sprite = (name) => `${SPRITE_DIR}/${name}.${SPRITE_EXT}`;

/** Central asset registry. Change SPRITE_EXT / paths here to swap formats. */
export const ASSETS = {
  // In-game hero: the original characters (normal + powered). The landing page uses the newer art.
  hero: sprite("hero1"),
  heroPowered: sprite("hero2"),
  heroMenu: sprite("hero-new"),
  heroFinal: sprite("hero10"),
  heroine: sprite("heroine"),
  heroine2: sprite("heroine2"),
  heroine3: sprite("heroine3"),
  heroMilestone1: "assets/hero1.png",
  heroMilestone2: "assets/hero2.png",
  heroMilestone3: "assets/hero4.png",
  heroMilestone4: "assets/hero5.png",
  heroMilestone5: "assets/hero10.png",
  shawlMan: sprite("shawlman"),
  crocodile: sprite("crocodile"),
  creature: sprite("creature"),
};

/** Original full-size PNGs, used only if a web sprite fails to load. */
export const ASSET_FALLBACKS = {
  hero: "assets/hero1.png",
  heroPowered: "assets/hero2.png",
  heroMenu: "assets/sprites/hero-new.webp",
  heroine: "assets/sprites/heroine.webp",
  heroine2: "assets/sprites/heroine2.webp",
  heroine3: "assets/sprites/heroine3.webp",
  heroFinal: "assets/hero10.png",
  heroMilestone1: "assets/hero1.png",
  heroMilestone2: "assets/hero2.png",
  heroMilestone3: "assets/hero4.png",
  heroMilestone4: "assets/hero5.png",
  heroMilestone5: "assets/hero10.png",
  shawlMan: "assets/shawlman.png",
  crocodile: "assets/crocodile.png",
  creature: "assets/creature.png",
};

/**
 * Audio clips. `levelFailure` is the failure sound for the crocodile and the train; Navalla Kadu (`chaserKill`) for Thatha and Dhayyam;
 * everything else is the Palace Escape soundtrack.
 */
export const AUDIO = {
  intro: "assets/audio/pandaga_audio.mp3", // plays once per session, then bgm loops
  bgm: "assets/audio/bgm.mp3",
  levelFailure: "assets/audio/levelfailure.m4a", // crocodile
  chaserKill: "assets/audio/Navalla_kadu.mp3", // Thatha / Dhayyam
  levelSuccess: "assets/audio/vui_vui.mp3",
  aasthiAward: "assets/audio/Kolla_Luxuria.mp3", // milestone (every 10th level) card
  punch: "assets/audio/Punch.mp3", // the hero uses a knife on a chaser
  tooClose: "assets/audio/Parigettandi.mp3", // a chaser is right behind the hero
  jamakay: "assets/audio/Malaysia_jamakay.mp3", // Malaysian Jamakay (guava) power
  doorEdira: "assets/audio/Door_Edira.mp3", // Hidden Exit: level intro
  wire: "assets/audio/Wire.mp3", // Lights Out: plays before the bgm on every round
  doorPadipoindi: "assets/audio/Door_padipoindi.mp3", // Twin Doors: round start
  sahana: "assets/audio/Sahana_sahana.mp3", // Hidden Exit: loops while the heroine follows
  nacche: "assets/audio/Nacche_Nacche.mp3", // Sudden Wells: loops once Heroine 3 climbs out of the well
  heroine2: "assets/audio/Heroine2.mp3", // Twin Doors: the conversation when Heroine 2 steps out
};

/** Sounds needed from the very first level: fetched right after the menu appears. The rest are fetched when their round is about to start. */
export const AUDIO_CORE = ["intro", "bgm", "tooClose", "chaserKill", "levelFailure", "levelSuccess", "jamakay", "punch"];

/** Extra sounds a round needs, fetched while its instruction screen is showing. */
export const AUDIO_BY_TRAP = {
  hiddenDoor: ["doorEdira", "sahana"],
  lights: ["wire"],
  twoDoors: ["doorPadipoindi", "heroine2"],
  well: ["nacche"],
};

/** Background music sits at this fraction of its normal level while an action sound plays. */
export const MUSIC_DUCK = 0.35;

export const HERO_BASE_SPEED = 4.0;
export const BOOST_MULTIPLIER = 1.5;
/** Applied to every chaser's move speed (and Shawl Man teleport rate) on top of the per-level values. */
export const CHASER_SPEED_SCALE = 0.8;
export const EYE_DURATION = 3;
export const BOOST_DURATION = 4;
/** A knife guards the hero for this long (or until it blocks a hit). */
export const KNIFE_DURATION = 12;
export const KNIFE_STUN_DURATION = 5;
export const KNIFE_GRACE = 0.6;
export const SAFE_SECONDS = 3;
/** Graph distance (cells) chasers must keep from the hero when they spawn / respawn. */
export const MIN_SAFE_DISTANCE = HERO_BASE_SPEED * SAFE_SECONDS;
/** The Shawl Man always reappears exactly this many seconds of hero travel away. */
export const SHAWL_APPEAR_SECONDS = 1.5;
/** Milestone cards are awarded every ten levels; the campaign continues indefinitely. */
export const TITLE_LEVEL = 10;
export const MILESTONE_LEVELS = 10;

/**
 * Milestone reward bands, by a block's average attempt time rounded to whole seconds.
 * Amounts are in lakhs (₹1,00,000) so every reward is a whole number of ₹0.01 Cr steps.
 */
/** Rewards are paid every round: each band's amount is divided by this, so ten rounds add up to the old block reward. */
export const AASTHI_ROUND_DIVISOR = 10;
export const AASTHI_BANDS = [
  { maxSeconds: 15, minLakhs: 900, maxLakhs: 1000 },
  { maxSeconds: 17, minLakhs: 850, maxLakhs: 950 },
  { maxSeconds: 20, minLakhs: 800, maxLakhs: 900 },
  { maxSeconds: 23, minLakhs: 700, maxLakhs: 800 },
  { maxSeconds: 25, minLakhs: 600, maxLakhs: 700 },
  { maxSeconds: Infinity, minLakhs: 500, maxLakhs: 600 },
];
/** Flood trap: seconds the crocodile must stay inside the safe zone before it leaps. */
export const FLOOD_WARNING_SECONDS = 3;
export const FLOOD_LEAP_SECONDS = 0.35;
export const FLOOD_CROC_SPEED = 0.8;
/** Thatha marks his destination this long before he appears there. */
export const THATHA_WARNING_SECONDS = 1;
/** A marked destination is abandoned if the hero is now within this many corridor steps of it. */
export const THATHA_MIN_LANDING_STEPS = 3;
/** Well trap: each well stays open this long, then the palace waits WELL_COOLDOWN before opening the next. */
export const WELL_VISIBLE_SECONDS = 3;
export const WELL_COOLDOWN = 3;
/** A path well opens at least this many seconds of hero travel ahead of him. */
export const WELL_LEAD_SECONDS = 1.5;
export const WELL_MAX_PATH_SPAWNS = 2;
export const TRAP_IDS = ["train", "well", "water", "lights", "reverse", "rotate", "hiddenDoor", "twoDoors"];

/** Flooded Maze: the safe-zone radius is this share of the generated value (20% smaller). */
export const FLOOD_SAFE_RADIUS_SCALE = 0.8;

/** Knife vs crocodile: the hero grabs its tail, slams it left then right, and flings it out of the maze. */
export const SMASH = {
  lift: 0.45,
  slamLeft: 0.3,
  holdLeft: 0.2,
  recover: 0.4,
  slamRight: 0.3,
  holdRight: 0.2,
  fling: 0.6,
};
export const SMASH_TOTAL = Object.values(SMASH).reduce((a, b) => a + b, 0);

/** Parigettandi plays when a chaser trails the hero within this many cells (re-arms beyond RESET). */
export const TOO_CLOSE_DISTANCE = 2.5;
export const TOO_CLOSE_RESET = 5;
export const TOO_CLOSE_COOLDOWN = 8;

/** Hidden Exit: the heroine trails the hero at this distance (cells of path) once she is freed. */
export const HEROINE_FOLLOW_GAP = 1.2;

export const HERO_RADIUS = 0.32;
export const CHASER_RADIUS = 0.3;
export const QUEUE_TIMEOUT = 0.45;

export const CREATURE_STEER_INTERVAL = 0.12;
export const CROC_REPATH_INTERVAL = 0.4;
/** Walking distance (cells) at which a roaming crocodile notices the hero, and at which it loses interest. */
export const CROC_CHASE_RADIUS = 5;
export const CROC_GIVE_UP_RADIUS = 8;

export const TELEPORT_EFFECT = 0.2;
export const TELEPORT_FADE_IN = 0.12;
export const RESPAWN_FADE_IN = 0.5;

export const FIXED_STEP = 1 / 120;

export const POWER_INFO = {
  eye: { icon: "🍐", name: "MALAYSIAN JAMAKAY", text: "Freeze all chasers for 3 seconds", short: "Freeze chasers — 3 sec" },
  knife: { icon: "🔪", name: "KNIFE", text: "Block the next hit", short: "Block the next hit" },
  boost: { icon: "⚡", name: "BOOST", text: "You move 50% faster for 4 seconds", short: "You ×1.5 speed — 4 sec" },
};

export const CHASER_INFO = {
  creature: {
    name: "DHAYYAM",
    text: "Wanders the palace, then gives chase when you are close.",
    intro: "DHAYYAM IS WATCHING.",
  },
  crocodile: {
    name: "THE CROCODILE",
    text: "Uses palace corridors. Slower than you.",
    intro: "THAT'S ONE HUNGRY CROCODILE.",
  },
  shawlMan: {
    name: "THATHA",
    text: "Teleports around the palace. A glowing mark shows where he will appear one second before he does.",
    intro: "WHERE DID HE COME FROM?!",
  },
};

export const TEXT = {
  start: "RUN, BACHELOR, RUN! 🏃",
  retry: "GO!",
  eye: "MALAYSIAN JAMAKAY! EVERYBODY FREEZE! 🍐",
  boost: "ZOOM ZOOM! ⚡",
  knife: "NEXT HIT IS YOURS. 🔪",
  knifeUsed: "SUPLEX! 💥",
  nearMiss: "OOF. THAT WAS CLOSE.",
  win: "ESCAPED! 👑",
  caughtBy: {
    creature: "The Creature got you.",
    crocodile: "The Crocodile got you.",
    shawlMan: "Thatha got you.",
  },
};

export const STORAGE_KEY = "palaceEscape.v1";

/** "Follow the makers" links on the caught / level-complete cards, shown from this level onward. */
export const FOLLOW_FROM_LEVEL = 3;
export const FOLLOW_LINKS = [];
