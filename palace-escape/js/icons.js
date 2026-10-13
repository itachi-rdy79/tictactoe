/**
 * One consistent set of line icons (24×24, stroke = currentColor) used everywhere in the UI instead of emoji.
 * icon("name") returns an inline <svg> string.
 */
const P = {
  x: '<path fill="currentColor" stroke="none" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
  pause: '<rect x="6.5" y="5" width="3.6" height="14" rx="1.2"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.2 9.4a2.9 2.9 0 0 1 5.5 1.1c0 1.9-2.7 2.3-2.7 4"/><circle cx="12" cy="17.6" r=".6" fill="currentColor"/>',
  scroll: '<path d="M7 4h11a2 2 0 0 1 2 2v1H9V6a2 2 0 0 0-2-2Zm0 0a2 2 0 0 0-2 2v11a3 3 0 0 0 3 3h11a2 2 0 0 0 2-2v-1"/><path d="M9 7v11a2 2 0 0 1-2 2"/><path d="M12 11h5M12 14.5h5"/>',
  soundOn: '<path d="M4 9.5v5h3.6L12 18.5v-13L7.6 9.5H4Z"/><path d="M15.2 9.2a4 4 0 0 1 0 5.6M17.6 6.8a7.4 7.4 0 0 1 0 10.4"/>',
  soundOff: '<path d="M4 9.5v5h3.6L12 18.5v-13L7.6 9.5H4Z"/><path d="m16 9.5 5 5m0-5-5 5"/>',
  timer: '<circle cx="12" cy="13.5" r="7"/><path d="M12 9.5v4.2l2.6 1.6M9.5 3.5h5"/>',
  coin: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5.6"/><path d="M12 8.6v6.8M10.2 10.2c.5-.9 3.6-1 3.6.6 0 1.5-3.6.9-3.6 2.6 0 1.6 3.1 1.5 3.7.5"/>',
  crown: '<path d="m3.5 8 4.3 3.8L12 5l4.2 6.8L20.5 8l-1.7 10.5H5.2L3.5 8Z"/><path d="M5.5 21h13"/>',
  star: '<path d="m12 3.4 2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.7l6-.8L12 3.4Z"/>',
  play: '<path d="M8 5.5v13l11-6.5-11-6.5Z"/>',
  restart: '<path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4.5v4.6h4.6"/>',
  home: '<path d="m3.5 11.2 8.5-7 8.5 7"/><path d="M6 9.8V20h12V9.8M10 20v-5.2h4V20"/>',
  skull: '<path d="M12 3.5c-4.3 0-7.5 2.9-7.5 6.7 0 2.2 1 3.8 2.6 4.9V18a1 1 0 0 0 1 1h1v1.5h2.2V19h1.4v1.5H15V19h1a1 1 0 0 0 1-1v-2.9c1.6-1.1 2.5-2.7 2.5-4.9 0-3.8-3.2-6.7-7.5-6.7Z"/><circle cx="9" cy="11.2" r="1.5"/><circle cx="15" cy="11.2" r="1.5"/>',
  swipe: '<circle cx="12" cy="12" r="2.6"/><path d="M3.5 12h4.6m-1.9-2L8.2 12l-2 2M20.5 12h-4.6m1.9-2L15.8 12l2 2"/>',
  controller: '<rect x="3" y="7.5" width="18" height="9.5" rx="4.7"/><path d="M8 10.5v3.6M6.2 12.3h3.6"/><circle cx="15.2" cy="11.4" r=".8" fill="currentColor"/><circle cx="17.4" cy="13.4" r=".8" fill="currentColor"/>',
  bolt: '<path d="M13.2 3 5.5 13.4h5.2L9.8 21l7.7-10.5h-5.2L13.2 3Z"/>',
  door: '<path d="M6 21V8.5a6 6 0 0 1 12 0V21M4 21h16"/><circle cx="14.8" cy="14.2" r=".9" fill="currentColor"/>',
  sparkles: '<path d="m12 3 1.7 4.6L18.3 9.3l-4.6 1.7L12 15.6 10.3 11 5.7 9.3l4.6-1.7L12 3Z"/><path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
  train: '<rect x="5.5" y="3.5" width="13" height="13" rx="3"/><path d="M5.5 11h13"/><circle cx="9" cy="13.8" r=".8" fill="currentColor"/><circle cx="15" cy="13.8" r=".8" fill="currentColor"/><path d="m8 20.5 2-4M16 20.5l-2-4M7 7.4h2.5M14.5 7.4H17"/>',
  well: '<ellipse cx="12" cy="8" rx="7" ry="2.6"/><path d="M5 8v7.5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V8"/><path d="M9 14.5c1 .8 5 .8 6 0"/>',
  water: '<path d="M3 9c1.5 1.6 3 1.6 4.5 0s3-1.6 4.5 0 3 1.6 4.5 0 3-1.6 4.5 0M3 14c1.5 1.6 3 1.6 4.5 0s3-1.6 4.5 0 3 1.6 4.5 0 3-1.6 4.5 0M3 19c1.5 1.6 3 1.6 4.5 0s3-1.6 4.5 0 3 1.6 4.5 0 3-1.6 4.5 0"/>',
  lights: '<path d="M14.8 4.4a8 8 0 1 0 4.8 10.9A6.6 6.6 0 0 1 14.8 4.4Z"/>',
  reverse: '<path d="M4 8h14.5m0 0-3.4-3.4M18.5 8l-3.4 3.4M20 16H5.5m0 0 3.4-3.4M5.5 16l3.4 3.4"/>',
  rotate: '<path d="M12 3.5v17"/><path d="M9 7 3.5 12 9 17zM15 7l5.5 5-5.5 5z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.4"/><path d="M8.2 10.5V7.7a3.8 3.8 0 0 1 7.6 0v2.8"/><circle cx="12" cy="15.5" r="1.1" fill="currentColor"/>',
  twoDoors: '<path d="M3.5 21V9.5a3.2 3.2 0 0 1 6.4 0V21M14.1 21V9.5a3.2 3.2 0 0 1 6.4 0V21M2.5 21h19"/>',
  knife: '<path d="M14.5 3.5c3.2.4 5.5 2.9 6 6L9 21l-6-6L14.5 3.5Z"/><path d="m5.5 18.5-3 3M9 14l3 3"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  fire: '<path d="M12 21c-3.8 0-6.5-2.6-6.5-6.2 0-2.8 1.8-4.5 3-6.1.6-.8.9-1.8.8-3.2 2.7 1.3 4.4 3.6 4.6 6.1.9-.6 1.5-1.6 1.6-2.6 1.4 1.7 2.5 3.5 2.5 5.6 0 3.6-2.7 6.4-6 6.4Z"/>',
};

export function icon(name, extra = "") {
  const body = P[name] || P.sparkles;
  return `<svg class="ico ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/** Trap id -> icon name. */
export const TRAP_ICON = {
  train: "train",
  well: "well",
  water: "water",
  lights: "lights",
  reverse: "reverse",
  rotate: "rotate",
  hiddenDoor: "lock",
  twoDoors: "twoDoors",
  none: "sparkles",
};

/** Removes emoji from visible copy (the UI uses line icons instead). */
export function stripEmoji(text) {
  return String(text)
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([!.?])/g, "$1")
    .trim();
}
