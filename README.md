# GAP — Arcade Gaming Hub (100% Offline-First)

[![Daily Movie Sync](https://github.com/itachi-rdy79/tictactoe/actions/workflows/daily-sync.yml/badge.svg)](https://github.com/itachi-rdy79/tictactoe/actions/workflows/daily-sync.yml)
[![PWA Ready](https://img.shields.io/badge/PWA-100%25%20Offline-success.svg)](manifest.json)
[![Tech Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20ES6%2B-blue.svg)](index.html)
[![Games Included](https://img.shields.io/badge/Games-10%20Arcade%20Games-orange.svg)](#-included-games)

A high-performance, offline-first browser arcade gaming hub built with **Vanilla HTML5, CSS3, and JavaScript (ES6+)**. Zero build step, zero external frameworks, and zero CDN dependencies. Features **10 complete, beautifully crafted games** powered by intelligent AI engines, tactile glassmorphism aesthetics, responsive mobile/desktop layouts, and an offline Progressive Web App (PWA) Service Worker.

---

## 🚨 Strict Architectural Principles

1. **100% Offline-First / Zero Network Dependency**:
   - **No CDNs, no remote fonts, no remote runtime scripts, and zero network API calls**.
   - Offline Progressive Web App enabled via [`sw.js`](sw.js) and [`manifest.json`](manifest.json) with intelligent cache-first asset routing.
   - All vector icons and illustrations are embedded inline SVGs or self-contained WebP/PNG assets.
   - Runs directly and flawlessly by double-clicking [`index.html`](index.html) via `file://`, serving from any static HTTP server, or running in Docker/Kubernetes.
2. **Zero Sound / Visual Haptics by Default**:
   - Core hub games provide visual haptic feedback: dynamic glowing borders, 3D flip rotations, tile pop scaling, row shakes, and particle confetti physics.
   - Dedicated standalone arcade experiences ([`palace-escape/`](palace-escape/) and [`pass-it-on/`](pass-it-on/)) feature modular audio controllers with mute switches and independent volume handling.
3. **Responsive Glassmorphism Design**:
   - Curated HSL glass-morphism panels with specular reflections, backdrop blur filters, and harmonious light/dark themes.
   - Includes a **Mini-Window Mode (Pop-Out Floating App)** for distraction-free desktop gaming.

---

## 🎮 Included Games

### 1. Tic-Tac-Toe (3×3 & 5×5)
- **3×3 Mode**:
  - **Easy**: Casual play with randomized blocking.
  - **Medium**: Immediate win detection and critical threat blocking.
  - **Hard**: Mathematically unbeatable full depth-first minimax algorithm with Alpha-Beta pruning.
- **5×5 Mode (4-in-a-Row Objective)**:
  - Precomputes all winning four-in-a-row vectors across rows, columns, and diagonals.
  - **AI Heuristics**: Immediate 4-in-a-row win/block detection, open-3 threat recognition, center-board weight prioritization, and candidate move pruning for guaranteed sub-50ms turn latency.
- Move counters, undo history stack, SVG strikethrough win-lines, and celebratory confetti.

### 2. Sequence (Sapphire Glass)
- Tactile board game experience with crystalline sapphire chips and playing cards.
- Supports both single-player vs AI and local 2-player pass-and-play.
- Card matching logic, chip sequence placement, horizontal/vertical/diagonal sequence detection, and corner bonus handling.

### 3. Chess Engine & Tactical UI
- **Intelligent Chess AI**:
  - Full legal move generation (Pawns with 2-square initial push, diagonal captures, Knights, Bishops, Rooks, Queens, and Kings).
  - Minimax search algorithm with Alpha-Beta Pruning.
  - **Evaluation Function**: Standard material values combined with Piece-Square Tables (PST) for positional center control, knight mobility, and pawn advancement.
  - **Move Ordering**: MVV-LVA (Most Valuable Victim – Least Valuable Aggressor) to maximize alpha-beta cutoff efficiency.
  - **King Capture Evaluation**: $\pm 50,000$ to prevent blunders and decisively force checkmates.
- **Tactical UI Principles**:
  - **Authentic Play**: No destination hint dots on piece selection, preserving genuine over-the-board strategic calculation.
  - **Side-Flanked Captured Piece Trays**: Captured pieces reside neatly on the Left (White captured) and Right (Black captured) sides of the board.
  - **3D Embossed Piece Counters**: Grouped chips showing piece icons and count badges (e.g., `♟ ×3`, `♞ ×1`).

### 4. Wordle Engine & Offline Dictionary
- **Embedded 1,940+ Word Offline Dictionary**:
  - 100% offline local dictionary featuring everyday vocabulary (`CRANE`, `BREAD`, `HEART`, `AISLE`, `PIPER`, `SLATE`, etc.).
  - Target words stratified across **Easy**, **Medium**, and **Hard** tiers.
- **Two-Pass Clue Scoring**:
  - Pass 1: Identifies exact position matches (**Green**).
  - Pass 2: Identifies misplaced matches (**Yellow**) while properly balancing duplicate letter counts.
- **Micro-Animations**:
  - Tile pop scale on character entry.
  - Sequential **3D Flip Animation** on row submit (`rotateX(90deg)` reveals clue color, then `rotateX(0deg)`).
  - Row shake on invalid words or incomplete submissions.
- **Virtual On-Screen Keyboard**: Full QWERTY keyboard dynamically updated with clue colors (Green > Yellow > Gray).
- **Keyboard Event Guard**: Letters type directly into Wordle without triggering global shortcuts.

### 5. Texas Hold'em Poker (Heads-Up AI & Local 2P)
- **100% Offline 52-Card Deck**:
  - Full deck shuffled with cryptographic Fisher-Yates randomness.
  - Standard street progression: **Pre-Flop**, **Flop** (3 cards), **Turn** (1 card), **River** (1 card), and **Showdown**.
- **Exact 7-Card Hand Evaluator**:
  - Generates and ranks the best 5 of 7 cards across all 9 standard poker categories: *Royal Flush, Straight Flush, Four of a Kind, Full House, Flush, Straight, Three of a Kind, Two Pair, One Pair, High Card*.
  - Accurate tie-breaking with kicker calculations.
  - Highlights winning 5-card combinations on table showdown with luminous gold borders.
- **Tactile Wagering & Action Dock**:
  - Pot management, blinds posting (SB $10 / BB $20), and chip bankroll tracking ($1,000 starting stacks).
  - Quick bet buttons: `Min`, `½ Pot`, `Pot`, `All-In`, and custom bet slider.
  - Actions: `Fold`, `Check / Call`, `Raise`, and `Next Hand`.
- **AI Decision Engine**:
  - Stratified by difficulty: *Easy* (passive caller), *Medium* (pot odds aware, values pairs and draws), *Hard* (aggressive value betting, bluffing, and pot leverage).

### 6. PC Guesser / Pattukunte Pattucheera (Tollywood Movie Guesser)
- **Tollywood Movie Framed / Wordle Experience**:
  - Guess the secret Telugu movie in 5 attempts based on sequential movie frame stills and cinematic clues.
- **1,645+ Telugu Movie Catalog**:
  - Includes blockbusters (*RRR*, *Pushpa*, *Kalki 2898 AD*, *Baahubali*, *Ala Vaikunthapurramuloo*, *Magadheera*, *Pokiri*, *Athadu*, *Khushi*, *Jersey*, *DJ Tillu*, *Hi Nanna*, *Mathu Vadalara*, etc.).
  - Fast, responsive fuzzy autocomplete dropdown with keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).
- **Dynamic Stills & Stylized Offline Clues**:
  - When online: connects directly to upstream stills CDN mirrors.
  - When offline: automatically falls back to rich cinematic clue cards (opening scenes, character dynamics, iconic dialogues, directors, and songs).
- **Game Modes**:
  - *Daily Puzzle*: Deterministic daily puzzle synchronized with UTC day count.
  - *Random Mode (`🎲 Random`)*: Instant infinite play across any movie in the library.
- **Stats & Streaks**: Win celebration with confetti, current streak, max streak, and detailed guess histories.

### 7. Palace Escape (Fast-Paced Palace Chase)
- **Story & Objective**: Escape the royal palace, dodge traps and enemies, and claim maximum **Aasthi** (₹ CR) to earn the title: *PAN INDIA NO.1 BACHELOR*.
- **20 Handcrafted Levels with Unique Trap Mechanics**:
  - *Level 1*: Clear Passage
  - *Level 2*: Twin Doors
  - *Level 3*: Long Hall
  - *Level 4*: The Creature
  - *Level 5*: Power-Ups
  - *Level 6*: Shawl Man
  - *Level 7*: Lights Out
  - *Level 8*: Flooded Maze
  - *Level 9*: Reversed Controls
  - *Level 10*: Thatha's Treasure
  - *Levels 11–20*: Advanced Wings with escalating trap speeds, multi-enemy chases, and labyrinth puzzles.
- **Interactive Level Selector Hub**:
  - Main menu features a **20-Level Chip Grid (1–20)** and **Level Stepper (`◀` / `▶`)** showing trap names.
  - **"Unlock All 20 Levels" Toggle**: Jump directly to any wing or level without restriction.
- **Seamless Navigation**:
  - **Top Navigation Pill**: Clearly divided into **Return to All Games Hub (`⌂`)** and **Palace Escape Home (`🏰 Palace Escape | Menu`)**.
  - **In-Game HUD Home Button**: One-tap return to the level selector directly during active gameplay.
  - **Pause Menu Controls**: Includes **"SKIP TO NEXT LEVEL →"** and **"PALACE HOME · CHOOSE LEVEL"**.
- **Aasthi Pathralu**: Collect and view unlocked bachelor cards and achievements.

### 8. Pass It On ("The Paradise Pass It On")
- **High-Octane Baby Relay Action**:
  - Fast-paced arcade runner inspired by classic comic doodle artistry.
  - Pass the baby from runner to runner across moving street lanes while evading police officers, street dogs, crows, and obstacles.
- **Controls**:
  - Tap or click to pass when runners align.
  - Keyboard shortcut: `Spacebar` / `Enter`.
- **Audio & Haptics**: Full retro soundtrack, comic whooshes, whistle alerts, and celebration audio.

### 9. Ludo King (Multicolored Sea Glass)
- Classic 4-player board game rendered in vibrant Red, Green, Yellow, and Blue glass panels.
- **3D Physics Dice Rolling**: Tactile die bounce with randomized roll outcomes.
- **Rules Engine**:
  - Exact token movement rules, starting gate release on rolling a 6, token capture dynamics, safe star tiles, and home stretch victory tracks.
  - Supports 2 to 4 players with mixed AI and human participants.

### 10. Snake Arena (Glowing Cyber Sea Glass)
- Cyber retro arcade snake with glowing neon segments and smooth turning mechanics.
- **Zero-Latency Turn Engine**: Direction resets and double-turn lag eliminated for precision gameplay.
- **Configurable Settings**:
  - Speed presets: *Casual*, *Classic*, and *Turbo*.
  - Boundary modes: *Pass-Through Wraparound* vs *Deadly Walls*.
- High score persistence with `localStorage`.

---

## 🤖 Automated Daily GitHub Action (6:00 AM UTC)

- **Workflow**: [`.github/workflows/daily-sync.yml`](.github/workflows/daily-sync.yml)
- **Scheduled Cron**: `0 6 * * *` (Every day at 06:00 UTC / 11:30 AM IST) + `workflow_dispatch` for manual triggers.
- **Automated Sync**:
  - Automatically fetches the latest additions, corrections, and missing movies from `santoshimz/pattukunte-pattucheera`.
  - Cleans, deduplicates, and sorts the database into [`data/tollywood-movies.json`](data/tollywood-movies.json).
  - Automatically commits with `github-actions[bot]` and pushes directly to `main` with zero manual overhead.

---

## 🎨 Design, Theming & Vector Branding

- **Themes**:
  - **Light**: Crisp glass panels paired with soft pastel background tint matching the active reload color.
  - **Dark**: Deep true black (`#000000`) canvas with glowing neon buttons and borders.
  - **Pearl & Rainbow**: Radiant crystalline aesthetics with subtle iridescent specular highlights.
- **Browser Mini-Window Mode (Pop-Out Floating App)**:
  - Click the **Mini Window** button in the top navigation pill to pop out the entire hub into a compact `430×720px` floating desktop window without browser toolbars or tab strips.
  - All 10 games adapt responsively with zero vertical scrolling.

---

## ⌨️ Global Keyboard Shortcuts

| Key | Action (Hub & Board Games) | Action (Wordle) | Action (Pass It On) |
|:---:|---|---|---|
| `1` | Switch to 3×3 Tic-Tac-Toe | Switch to 3×3 Tic-Tac-Toe | — |
| `2` | Switch to 5×5 Tic-Tac-Toe | Switch to 5×5 Tic-Tac-Toe | — |
| `3` | Switch to Chess | Switch to Chess | — |
| `4` | Switch to Wordle | — | — |
| `5` | Switch to Texas Hold'em Poker | Switch to Texas Hold'em Poker | — |
| `6` | Switch to PC (Tollywood Guesser) | Switch to PC Guesser | — |
| `R` | Trigger New Game / New Hand | Types letter 'R' | Restart Run |
| `Z` | Undo last move (TTT / Chess) | Types letter 'Z' | — |
| `A-Z` | — | Inputs letter into current tile | — |
| `Enter` | Confirm selection | Submits 5-letter guess | Pass Baby |
| `Space` | Pause / Resume | — | Pass Baby |
| `Backspace` | — | Deletes previous letter | — |
| `Escape` | Close active modal / Drawer | Close active modal | Pause |

---

## 📁 Repository Structure

```text
├── .github/
│   └── workflows/
│       └── daily-sync.yml       # Daily 6 AM UTC automated movie database sync
├── assets/                      # Shared vector and image assets
├── data/
│   └── tollywood-movies.json    # Auto-synced 1,645+ Telugu movies database
├── infra/                       # Cloud infrastructure templates
├── k8s/                         # Kubernetes deployment manifests
├── palace-escape/               # Palace Escape standalone game
│   ├── assets/                  # Sprites, characters, and trap textures
│   ├── css/                     # style.css, v1x.css, theme-adapter.css
│   ├── js/                      # Modular ES6 game engine, levels, renderer, UI
│   └── index.html               # Game shell, navigation pill & level selector hub
├── pass-it-on/                  # Pass It On standalone game
│   ├── *.webp, *.mp3, *.woff2   # Audio, sprites, and comic doodle assets
│   └── index.html               # Canvas renderer, relay physics & game loop
├── scripts/
│   ├── sync-tollywood.js        # Node.js sync script for GitHub Actions runner
│   └── sync-tollywood.ps1       # PowerShell sync script for Windows
├── Dockerfile                   # Production hardened Nginx container
├── docker-compose.yml           # Docker Compose orchestrator with healthchecks
├── index.html                   # Main Arcade Hub HTML layout & command docks
├── manifest.json                # PWA manifest
├── nginx.conf                   # Static caching & security headers config
├── script.js                    # Core engines (TTT, Chess, Wordle, Poker, PC, Ludo, Snake)
├── style.css                    # Glassmorphism styling, animations & theme tokens
├── sw.js                        # Offline Service Worker cache engine
└── README.md                    # Comprehensive repository documentation
```

---

## 🚀 Getting Started

### 1. Direct Browser (Zero Setup)
Simply open [`index.html`](index.html) in any modern web browser:

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 2. Local HTTP Server (Optional)
```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .
```
Then visit `http://localhost:8080` in your browser.

### 3. Docker & Docker Compose
A lightweight, hardened Nginx container is provided with production caching and security headers:

```bash
# Build and run with Docker Compose
docker compose up -d

# Or build directly with Docker
docker build -t gap-arcade .
docker run -p 8080:8080 gap-arcade
```
Visit `http://localhost:8080` (healthcheck endpoint at `/healthz`).

---

## 📄 License

Open-source and available under the [MIT License](LICENSE). Built for high-speed offline entertainment.