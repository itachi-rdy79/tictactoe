# GAP — Arcade Gaming Hub (Offline-First)

A high-contrast, fully offline web arcade featuring **Tic-Tac-Toe (3×3 & 5×5)** and **Chess** playable in local two-player or against a heuristic/minimax-driven AI[cite: 7]. Engineered with tactile arcade-scale controls, zero-drift layout sizing, and strict offline portability[cite: 7].

## Features
* **Game Selection**: Play classic 3×3 Tic-Tac-Toe, 5×5 Tic-Tac-Toe, or full-board Chess[cite: 7].
* **Minimax AI Engine**: Dynamic search depth adapting to selected difficulty (Easy, Medium, Hard)[cite: 7].
* **Turn Countdown Timers**: Optional blitz clocks (15s, 30s, 45s, 60s) with SVG radial indicator; strictly disabled by default[cite: 7].
* **Zero-Shift Responsive Layout**: HUD bar maintains balanced symmetry when switching between 2P and AI modes.
* **Theme System**:
  * **Dark**: Matte charcoal/slate base (`#0b0e14`) paired with rich metallic gold accents.
  * **Light**: Crisp high-contrast surface with dark slate borders (`#94a3b8`) and vivid emerald buttons.
  * **Itachi**: Deep obsidian palette (`#060102`) accentuated with fiery crimson borders and controls[cite: 7].
* **Match Continuity**: Turn undo functionality, match reset tools, and persistent scoreboard counters via `localStorage`[cite: 7].

## 100% Offline Portability
* Zero external font or CSS dependencies (uses system-native typography)[cite: 7].
* Zero external icon scripts or CDNs[cite: 7].
* Fully functional standalone web application that executes instantly via file system or static hosting[cite: 7].

## File Structure
```text
├── index.html       # Semantic HUD, Arena stage, and Quick-Dock layout
├── style.css        # High-contrast theme variables, board grids, and 3D buttons
├── script.js        # Minimax algorithms, timer loops, and board state controller
└── README.md        # Documentation and deployment instructions