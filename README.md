# GAP — Arcade Deck (Offline)

A polished **offline arcade web app** with:

- **Tic-Tac-Toe 3x3** (Local 2P / AI)
- **Tic-Tac-Toe 5x5 (Connect-4 win length)** (Local 2P / AI)
- **Chess** (Local 2P / AI)
- Theme system: **Dark**, **Light**, **Itachi**
- Visual game hub with pill-based controls
- URL routing via hash (shareable mode links)
- Move history + Undo
- Persistent per-mode stats and streaks
- Optional turn timer (Off / 5s / 10s)
- Fully client-side and **no internet required**

---

## Features

## 1) Game Hub Navigation
- Game type pills: `3x3 TTT`, `5x5 TTT`, `Chess`
- Opponent pills: `Local 2P`, `AI`
- Difficulty pills: `Easy`, `Medium`, `Hard`
- Timer pills: `Off`, `5s`, `10s`
- Difficulty row visually disables for Local 2P mode.

## 2) Game-State Isolation
- Chess-only captured-piece panel is hidden in TTT.
- TTT board and Chess board are conditionally toggled by mode.

## 3) URL Routing + Resume
App syncs current state into hash URL:
- Example: `#/chess?vs=ai&diff=hard&timer=10&theme=itachi`

On reload, app restores:
- game type
- opponent
- difficulty
- timer
- theme

## 4) Micro-Interactions
- TTT hover ghost marker on valid empty cells.
- Placement “pop” animation for new moves.
- Animated TTT winning line overlay.
- AI thinking indicator + board highlight shimmer.

## 5) Itachi Theme Polish
- TTT **X** replaced by inline **Sharingan SVG**.
- TTT **O** replaced by inline **Akatsuki cloud SVG**.
- Crimson/obsidian visual accents.

## 6) Retention / Engagement
- Per-mode + per-difficulty persistent stats (`localStorage`)
- Win streak tracking
- Move history pills for both games
- Undo support for both TTT and Chess
- Optional blitz-like turn timer

---

## Tech Stack

- **HTML5**
- **CSS3** (custom properties, glassmorphism, animations)
- **Vanilla JavaScript** (no frameworks, no APIs)

Everything runs offline from static files.

---

## Project Structure

```txt
.
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## Run Locally (Offline)

Option A:
- Open `index.html` directly in browser.

Option B (recommended for some browser policies):
- Use VS Code Live Server (or any local static server).

No dependencies, no build step.

---

## Controls

- **New Game**: restart current mode.
- **Undo**: revert one move/snapshot.
- **Reset Score**: clears current mode+difficulty score bucket.

### TTT
- Click an empty tile to place mark.
- 3x3 win length = 3
- 5x5 win length = 4 (connect-4 style)

### Chess
- Click a piece, then click a highlighted legal destination.
- Basic movement + capture + auto-queen pawn promotion.
- AI uses depth-limited minimax.

---

## Persistence Keys (localStorage)

- `hubState`  
  Stores current UI state:
  - `game`, `opponent`, `difficulty`, `timer`, `theme`

- `scores_<mode>_<difficulty>`  
  Stores:
  - `scoreA`, `scoreB`, `scoreD`, `streak`

- `theme`  
  Mirrors selected theme for quick restore.

---

## Notes / Limitations

- Chess engine is simplified:
  - no castling
  - no en passant
  - no strict check/checkmate legality
- Winner in chess is currently king capture in this ruleset.
- Designed for smooth UX and arcade feel rather than tournament-grade chess validation.

---

## Roadmap Ideas

- Full legal chess rules (check, checkmate, stalemate, castling, en passant)
- Sound FX (offline local files)
- Advanced badge system
- Export/import profile JSON
- PWA install support

---

## License

Use and modify freely for personal/learning projects.