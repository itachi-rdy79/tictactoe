import { SMASH, SMASH_TOTAL } from "./config.js";

/**
 * Knife vs crocodile: the hero grabs the crocodile by its tail, hauls it overhead, slams it down on his
 * left, hauls it back up and slams it down on his right, then flings it out of the maze.
 *
 * smashPose(t) describes the crocodile at time t (seconds into the move):
 *  - angle: rotation about the tail tip, in radians (0 = hanging straight down, π = held straight up,
 *    positive swings it to the hero's left, negative / > π to his right)
 *  - pivotH: how high the hero's hands are above his feet, in cells
 *  - blend: 0→1 while the crocodile travels from where it stood into the hero's grip
 *  - impact: "left" / "right" on the frames where it hits the floor
 */
const HANG = 0;
const OVERHEAD = Math.PI * 0.98;
const SLAM_LEFT = 0.95;
const SLAM_RIGHT = Math.PI * 2 - 0.95;
// (in cells above his feet; scaled with the 30% larger characters)
const HANDS_LOW = 0.7 * 1.3;
const HANDS_HIGH = 1.45 * 1.3;
const HANDS_GRAB = 0.5 * 1.3;

const lerp = (a, b, k) => a + (b - a) * k;
const easeInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const easeIn = (p) => p * p * p;
const easeOut = (p) => 1 - (1 - p) ** 3;

export const SMASH_DURATION = SMASH_TOTAL;

/** Elapsed times at which the two floor impacts happen. */
export const SMASH_IMPACT_LEFT = SMASH.lift + SMASH.slamLeft;
export const SMASH_IMPACT_RIGHT = SMASH.lift + SMASH.slamLeft + SMASH.holdLeft + SMASH.recover + SMASH.slamRight;

export function smashPose(t) {
  let k = t;
  const step = (len) => {
    if (k < len) return true;
    k -= len;
    return false;
  };
  const p = (len) => Math.min(1, Math.max(0, k / len));

  if (step(SMASH.lift)) {
    const e = easeInOut(p(SMASH.lift));
    // The tail is in his fist by about a third of the way up, then hauled overhead.
    const grab = easeOut(Math.min(1, p(SMASH.lift) / 0.35));
    return { phase: "lift", angle: lerp(HANG, OVERHEAD, e), pivotH: lerp(HANDS_GRAB, HANDS_HIGH, e), blend: grab };
  }
  if (step(SMASH.slamLeft)) {
    const e = easeIn(p(SMASH.slamLeft));
    return { phase: "slamLeft", angle: lerp(OVERHEAD, SLAM_LEFT, e), pivotH: lerp(HANDS_HIGH, HANDS_LOW, e), blend: 1 };
  }
  if (step(SMASH.holdLeft)) {
    const wobble = Math.sin(p(SMASH.holdLeft) * Math.PI * 3) * 0.05 * (1 - p(SMASH.holdLeft));
    return { phase: "holdLeft", angle: SLAM_LEFT + wobble, pivotH: HANDS_LOW, blend: 1 };
  }
  if (step(SMASH.recover)) {
    const e = easeInOut(p(SMASH.recover));
    return { phase: "recover", angle: lerp(SLAM_LEFT, OVERHEAD, e), pivotH: lerp(HANDS_LOW, HANDS_HIGH, e), blend: 1 };
  }
  if (step(SMASH.slamRight)) {
    const e = easeIn(p(SMASH.slamRight));
    return { phase: "slamRight", angle: lerp(OVERHEAD, SLAM_RIGHT, e), pivotH: lerp(HANDS_HIGH, HANDS_LOW, e), blend: 1 };
  }
  if (step(SMASH.holdRight)) {
    const wobble = Math.sin(p(SMASH.holdRight) * Math.PI * 3) * 0.05 * (1 - p(SMASH.holdRight));
    return { phase: "holdRight", angle: SLAM_RIGHT + wobble, pivotH: HANDS_LOW, blend: 1 };
  }
  const f = p(SMASH.fling);
  return { phase: "fling", angle: SLAM_RIGHT + easeOut(f) * Math.PI * 3.5, pivotH: HANDS_LOW, blend: 1, fling: f };
}
