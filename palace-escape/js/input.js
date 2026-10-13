const KEY_DIRS = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  KeyW: "up",
  KeyS: "down",
  KeyA: "left",
  KeyD: "right",
};

const SWIPE_THRESHOLD = 22;

/**
 * Collects direction intent from keyboard (arrows + WASD) and swipes on the maze.
 * `onPress(dir)` fires on every new press; `held` is the key direction currently held, if any.
 */
export class InputManager {
  constructor({ swipeArea, onPress, onKey, onAny }) {
    this.onPress = onPress;
    this.onKey = onKey;
    this.onAny = onAny; // any fresh key press or touch (used to skip a conversation)
    this.keysHeld = [];
    this.enabled = false;
    this.bindKeyboard();
    this.bindSwipe(swipeArea);
  }

  get held() {
    if (!this.enabled) return null;
    return this.keysHeld[this.keysHeld.length - 1] || null;
  }

  press(dir) {
    if (this.enabled && dir) this.onPress(dir);
  }

  reset() {
    this.keysHeld = [];
  }

  bindKeyboard() {
    window.addEventListener("keydown", (e) => {
      if (e.target instanceof HTMLInputElement) return;
      if (!e.repeat) this.onAny?.();
      const dir = KEY_DIRS[e.code];
      if (dir) {
        e.preventDefault();
        if (!this.keysHeld.includes(dir)) this.keysHeld.push(dir);
        if (!e.repeat) this.press(dir);
        return;
      }
      if (this.onKey(e)) e.preventDefault();
    });
    window.addEventListener("keyup", (e) => {
      const dir = KEY_DIRS[e.code];
      if (dir) this.keysHeld = this.keysHeld.filter((d) => d !== dir);
    });
    window.addEventListener("blur", () => this.reset());
  }

  bindSwipe(area) {
    let start = null;
    area.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse") return;
      this.onAny?.();
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    });
    area.addEventListener("pointermove", (e) => {
      if (!start || e.pointerId !== start.id) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.hypot(dx, dy) < SWIPE_THRESHOLD) return;
      this.press(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    });
    const end = () => {
      start = null;
    };
    area.addEventListener("pointerup", end);
    area.addEventListener("pointercancel", end);
  }
}
