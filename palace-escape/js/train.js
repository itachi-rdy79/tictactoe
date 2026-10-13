/**
 * Train Guard: a train of three cars shuttles along the track in front of the exit door. This one module
 * holds its geometry so the renderer (what you see) and the game (what can hit you) always agree.
 * Coordinates are in cells, with cell (c, r) spanning [c, c + 1) × [r, r + 1).
 */
export const TRAIN = { speed: 3.2, cars: 3, gap: 1.25, long: 1.05, shortHoriz: 0.68, shortVert: 0.78 };

/** Where the lead car's rear edge is along the track at time `t` (cells; it loops, entering from off-screen). */
export function trainPos(maze, side, t) {
  const horizontal = side === "top" || side === "bottom";
  const loop = (horizontal ? maze.cols : maze.rows) + 7;
  return ((t * TRAIN.speed) % loop) - 3;
}

/** The track row (or column) the train runs along: the line just inside the door. */
export function trainTrack(door, side) {
  const horizontal = side === "top" || side === "bottom";
  if (horizontal) return { horizontal, line: door.r + (side === "top" ? 1 : -1) };
  return { horizontal, line: door.c + (side === "left" ? 1 : -1) };
}

/** Rectangles of every car at time `t`, in cells. */
export function trainCars(maze, door, side, t) {
  const { horizontal, line } = trainTrack(door, side);
  const pos = trainPos(maze, side, t);
  const cars = [];
  for (let i = 0; i < TRAIN.cars; i++) {
    const p = pos + i * TRAIN.gap;
    cars.push(
      horizontal
        ? { x: p, y: line, w: TRAIN.long, h: TRAIN.shortHoriz }
        : { x: line, y: p, w: TRAIN.shortVert, h: TRAIN.long },
    );
  }
  return cars;
}

/** Does a circle (the hero) overlap any car? */
export function trainHits(cars, cx, cy, radius) {
  return cars.some((car) => {
    const nx = Math.max(car.x, Math.min(cx, car.x + car.w));
    const ny = Math.max(car.y, Math.min(cy, car.y + car.h));
    return Math.hypot(cx - nx, cy - ny) < radius;
  });
}
