import { AASTHI_BANDS, AASTHI_ROUND_DIVISOR, MILESTONE_LEVELS } from "./config.js";

const LAKH = 100_000;
const CRORE = 10_000_000;

/** Levels 1–10 form block 1, 11–20 block 2, and so on; a block's reward is paid at its last level. */
export function blockOf(level) {
  return Math.ceil(level / MILESTONE_LEVELS);
}

/** Adds one attempt (success or failure) of active play time to its block's running stats. */
export function recordAttempt(data, level, seconds) {
  const block = blockOf(level);
  if (data.aasthiBlock?.block !== block) data.aasthiBlock = { block, time: 0, attempts: 0 };
  data.aasthiBlock.time = Math.round((data.aasthiBlock.time + Math.max(0, seconds)) * 1000) / 1000;
  data.aasthiBlock.attempts += 1;
}

export function bandFor(averageSeconds) {
  const seconds = Math.round(averageSeconds);
  return AASTHI_BANDS.find((band) => seconds <= band.maxSeconds);
}

/**
 * Pays one round: a random whole-lakh amount inside the band for the time this round took (retries included),
 * added to the cumulative total straight away. A round pays only once, so replaying cannot farm money.
 * Every 10th round also unlocks the Aasthi Pathralu card (it shows the running total). Returns the award,
 * or null if this level has been paid before.
 */
export function awardRound(data, level, seconds, random = Math.random) {
  data.aasthiAwards = data.aasthiAwards || {};
  if (data.aasthiAwards[level]) return null;
  const band = bandFor(seconds);
  const minLakhs = Math.round(band.minLakhs / AASTHI_ROUND_DIVISOR);
  const maxLakhs = Math.round(band.maxLakhs / AASTHI_ROUND_DIVISOR);
  const lakhs = minLakhs + Math.floor(random() * (maxLakhs - minLakhs + 1));
  const award = { amount: lakhs * LAKH, seconds: Math.round(seconds * 10) / 10 };
  data.aasthiAwards[level] = award;
  data.aasthiTotal = (data.aasthiTotal || 0) + award.amount;
  if (level % MILESTONE_LEVELS === 0) {
    data.aasthiLevel = level;
    data.aasthiMilestone = blockOf(level);
    data.aasthiUnlocked = true;
  }
  return award;
}

/** Whole rupees → "16.23" (crores, always two decimals). */
export function formatCrore(rupees) {
  return (Math.max(0, Number(rupees) || 0) / CRORE).toFixed(2);
}
