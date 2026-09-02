# GAP — Arcade Deck (Style B)

Offline-first arcade game platform with a **Top HUD + Studio Stage** architecture.

## Modes
- Tic-Tac-Toe 3x3 (2P / AI)
- Tic-Tac-Toe 5x5 (2P / AI)
- Chess (2P / AI)

## Style B Layout
- Sticky top HUD
  - Game selector
  - Opponent
  - Difficulty (AI only)
  - Timer
  - Score ticker + streak
  - Theme toggle + audio toggle
- Studio stage board area
  - Floating status pill
  - Timer progress bar
  - Centered board
  - Captured strips above/below board for chess only
- Desktop: no vertical scrolling
- Mobile (<768px): HUD collapses and scrolling is allowed

## Core Features
- URL state sync (`#/ttt3?vs=ai&diff=medium&timer=off&theme=dark`)
- localStorage persistence for:
  - hub state
  - scores per mode+difficulty
- move history + undo
- AI thinking indicator
- Itachi theme symbols:
  - X = Sharingan SVG
  - O = Akatsuki cloud SVG

## Run
Open `index.html` directly in your browser (no build tools required).

## Files
- `index.html`
- `style.css`
- `script.js`
- `README.md`