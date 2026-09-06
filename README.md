# GAP — Arcade Gaming Hub (100% Offline-First)

A high-performance, completely offline, zero-dependency browser arcade gaming hub built with Vanilla HTML5, CSS3, and JavaScript (ES6+). Includes **Tic-Tac-Toe (3×3 & 5×5)**, **Chess Engine & Tactical UI**, and **Wordle Engine with Offline Dictionary**, backed by intelligent AI algorithms and responsive glassmorphism visual design.

---

## 🚨 Strict Architectural Principles

1. **100% Offline / Zero Internet**:
   - **No CDNs, no remote fonts, no remote scripts, and zero network API calls**.
   - System font stack utilized exclusively: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
   - All vector icons and illustrations are self-contained **inline SVGs**.
   - Runs directly and flawlessly by double-clicking `index.html` via `file://` or serving from any local HTTP server.
2. **Zero Audio / No Sound Effects**:
   - Strictly visual haptic feedback: dynamic glowing borders, 3D flip rotations, tile pop scaling, row shakes, and confetti particle physics.
   - Zero usage of Web Audio API, `AudioContext`, synthesizer oscillators, or audio elements.

---

## 🎮 Game Modes & Logic

### 1. Tic-Tac-Toe (3×3 & 5×5)
- **3×3 Mode**:
  - **Easy**: Casual play with basic blocking.
  - **Medium**: Immediate win detection and critical player threat blocking.
  - **Hard**: Mathematically unbeatable full depth-first minimax algorithm with Alpha-Beta pruning.
- **5×5 Mode (4-in-a-Row Objective)**:
  - Precomputes all four-in-a-row winning vectors across rows, columns, and diagonals.
  - **AI Heuristics**: Immediate 4-in-a-row win and block detection, open-3 threat recognition, center board weight prioritization, and candidate move pruning for guaranteed sub-50ms turn latency.
- Turn indicator, move counters, undo stack, and SVG strikethrough win-lines.

### 2. Chess Engine & Tactical UI
- **Intelligent Chess AI**:
  - Full legal move generation (Pawns with 2-square initial push and diagonal captures, Knights, Bishops, Rooks, Queens, Kings).
  - Minimax with Alpha-Beta Pruning.
  - **Evaluation Function**: Standard material values combined with Piece-Square Tables (PST) for positional center control, knight mobility, and pawn advancement.
  - **Move Ordering**: MVV-LVA (Most Valuable Victim – Least Valuable Aggressor) to maximize alpha-beta cutoff efficiency.
  - **King Capture Evaluation**: $\pm 50,000$ to prevent suicidal blunders and force checkmates.
- **Chess UI Rules (CRITICAL)**:
  - **NO MOVE HINT DOTS**: When a piece is clicked/selected, move destination hint dots are never rendered, preserving authentic over-the-board strategic play.
  - **SIDE-FLANKED CAPTURED PIECE TRAYS**: Captured pieces are positioned on the **Left (White captured)** and **Right (Black captured)** sides of the board rather than top/bottom.
  - **3D Embossed Tactile Piece Counters**: Grouped tactile chips showing piece icons and count badges (e.g., `♟ ×3`, `♞ ×1`).

### 3. Wordle Engine & Offline Dictionary
- **Embedded 1,940+ Word Offline Dictionary**:
  - 100% offline local dictionary including everyday vocabulary (`CRANE`, `BREAD`, `HEART`, `AISLE`, `PIPER`, `SLATE`, etc.).
  - Target words stratified across **Easy**, **Medium**, and **Hard** tiers.
- **Two-Pass Clue Scoring**:
  - Pass 1: Identifies exact position matches (**Green**).
  - Pass 2: Identifies misplaced matches (**Yellow**) while properly balancing duplicate letter counts.
- **Micro-Animations**:
  - Tile pop scale on character entry.
  - Sequential **3D Flip Animation** on row submit (`rotateX(90deg)` reveals clue color, then `rotateX(0deg)`).
  - Row shake on invalid words or incomplete submissions.
- **Virtual On-Screen Keyboard**: Full QWERTY keyboard dynamically updated with clue colors (Green > Yellow > Gray).
- **Keyboard Event Guard**: When playing Wordle, physical key presses type letters directly into Wordle and never trigger global shortcuts (`R` types 'R', NOT New Game; `Z` types 'Z', NOT Undo).

### 4. Texas Hold'em Poker (Heads-Up vs AI & Local 2P)
- **100% Offline 52-Card Deck**:
  - Full deck shuffled with cryptographic/Fisher-Yates randomness.
  - Standard street progression: **Pre-Flop**, **Flop** (3 cards), **Turn** (1 card), **River** (1 card), and **Showdown**.
- **Exact 7-Card Hand Evaluator**:
  - Generates and ranks the best 5 of 7 cards across all 9 standard poker categories: *Royal Flush, Straight Flush, Four of a Kind, Full House, Flush, Straight, Three of a Kind, Two Pair, One Pair, High Card*.
  - Hand tie-breakers with accurate kicker calculations.
  - Highlights winning 5-card combinations on table showdown with luminous gold borders.
- **Tactile Chip Wagering & Action Dock**:
  - Pot management, blinds posting (SB $10 / BB $20), and chip bankroll tracking ($1,000 starting stacks).
  - Quick bet buttons: `Min`, `½ Pot`, `Pot`, `All-In`, and custom bet slider.
  - Actions: `Fold`, `Check / Call`, `Raise`, and `Next Hand`.
- **AI Decision Engine**:
  - Stratified by difficulty: *Easy* (passive caller, folds to pressure), *Medium* (pot odds aware, values pairs and draws), *Hard* (aggressive value betting, bluffing, and pot leverage).
- **Thematic Visuals**:
  - Naruto: Shinobi bounty Ryo chips and Leaf Village card backs.
  - Game of Thrones: Iron Bank dragon coins and Stark/Targaryen card backs.
  - Itachi: Sharingan betting coins and Tsukuyomi crimson card backs.

### 5. The Imposter (Single-Device Pass & Play Mystery Game)
- **Social Deduction for 3 to 8 Players**:
  - Pass-and-play party game inspired by *Spyfall* and *The Chameleon*.
- **Four Offline Word Packs**:
  - *World Locations*: Airport, Casino, Hospital, Pirate Ship, Space Station, Submarine, Circus Tent...
  - *Naruto Shinobi World*: Hidden Leaf Village, Valley of the End, Akatsuki Hideout, Chunin Exams Arena...
  - *Game of Thrones*: Winterfell, King's Landing, The Wall, Dragonstone, Braavos, Sunspear...
  - *Everyday Objects*: Smartphone, Bicycle, Umbrella, Acoustic Guitar, Wristwatch, Laptop...
- **Privacy Curtain Mechanism**:
  - Touch-and-hold interactive curtain reveals the secret word to Innocents or displays *"YOU ARE THE IMPOSTER"*. Releasing hides the screen immediately before handing to the next player.
- **Investigation & Accusation Phases**:
  - 3-minute visual countdown timer with rotating conversational prompt suggestions.
  - Voting round to accuse the suspected Imposter.
  - **Last Chance Guess**: If caught, the Imposter gets one shot to guess the secret word from a 8-item grid to steal the victory!

---

## 🎨 Design, Theming & Vector Branding

- **Konohagakure Flame Vector Branding**:
  - Glowing Leaf Village spiral flame emblem integrated into the top command island and inline SVG page favicon.
- **Themes**:
  - **Light**: Crisp glass panels paired with soft pastel background tint matching the active reload color.
  - **Dark**: Deep true black (`#000000`) canvas with glowing neon buttons and borders.
  - **Itachi Theme**: Blood-red SVG moon with rotating Sharingan blades, silhouette crows, crimson markers, and Tsukuyomi victory screens.
  - **Naruto Theme ("Will of Fire")**:
    - Radiant fiery orange (`#ea580c`) & electric cyan Rasengan styling.
    - Custom Kurama flame backdrop with central Konoha spiral leaf vector art.
    - **Chess Pieces**: Sky-blue chakra white pieces with cyan auras (`#0284c7`) and crimson cloak rogue black pieces (`#e11d48`).
    - **Captured Piece Trays**: Dynamic headers for **"Konoha Shinobi"** and **"Akatsuki Rogue"** with glowing 3D chips.
    - **Tic-Tac-Toe**: Thematic inline SVG marks — **Konoha Leaf** (`X`) vs **Akatsuki Cloud** (`O`).
  - **Game of Thrones Theme ("Ice & Fire")**:
    - Glacial permafrost blue (`#38bdf8`) & Valyrian dragonfire gold-crimson styling.
    - Northern blizzard backdrop with Stark Direwolf and Targaryen 3-headed dragon crests.
    - **Chess Pieces**: Stark winter frost white pieces (`#f0f9ff`) and Targaryen dragonfire crimson black pieces (`#dc2626`).
    - **Captured Piece Trays**: Dynamic headers for **"Winterfell (Stark)"** and **"Dragonstone (Targaryen)"**.
    - **Tic-Tac-Toe**: Thematic inline SVG marks — **Direwolf Sigil** (`X`) vs **Dragon Fire** (`O`).
- **Dynamic Reload Palettes**:
  - Randomly assigns one of 5 vibrant neon accent palettes on reload: **Emerald**, **Amber**, **Violet**, **Teal**, or **Lime**.
- **Layout**:
  - Scaled-up **Top Command Island (84px)** and **Bottom Dock (76px)** for effortless touch and desktop interaction.
  - Fully responsive across mobile (320px) up to 4K desktop screens.

---

## ⌨️ Keyboard Shortcuts

| Key | Action (In TTT / Chess / Poker / Imposter) | Action (In Wordle) |
|---|---|---|
| `1` | Switch to 3×3 Tic-Tac-Toe | Switch to 3×3 Tic-Tac-Toe |
| `2` | Switch to 5×5 Tic-Tac-Toe | Switch to 5×5 Tic-Tac-Toe |
| `3` | Switch to Chess | Switch to Chess |
| `4` | Switch to Wordle | — |
| `5` | Switch to Texas Hold'em Poker | Switch to Texas Hold'em Poker |
| `6` | Switch to The Imposter | Switch to The Imposter |
| `R` | Trigger New Game / New Hand | Types letter 'R' |
| `Z` | Undo last move (TTT / Chess) | Types letter 'Z' |
| `A-Z` | — | Inputs letter into current tile |
| `Enter` | — | Submits 5-letter guess |
| `Backspace` | — | Deletes previous letter |

---

## 📁 File Structure

```text
├── index.html       # Semantic HTML5 layout, inline SVG flame assets & command docks
├── style.css        # Responsive CSS styling, CSS variables, themes & 3D animations
├── script.js        # Minimax/tactical AI, chess rules & PST, Wordle dictionary & logic
└── README.md        # Comprehensive documentation
```

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser:

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

Or run any local static HTTP server (optional):
```bash
python -m http.server 8080
# or
npx serve .
```