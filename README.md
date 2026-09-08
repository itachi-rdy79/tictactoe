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

### 5. Pattukunte Pattucheera (Tollywood Movie Guesser)
- **100% Offline Tollywood Movie Framed / Wordle Experience**:
  - Guess the secret Telugu movie in 5 attempts based on sequential movie frame stills and cinematic clues.
  - **350+ Embedded Telugu Movie Catalog + 1,645+ Extended Database**:
    - Includes blockbusters (*RRR*, *Pushpa*, *Kalki 2898 AD*, *Baahubali*, *Ala Vaikunthapurramuloo*, *Magadheera*, *Pokiri*, *Athadu*, *Khushi*, *Jersey*, *DJ Tillu*, *Hi Nanna*, *Mathu Vadalara*, etc.).
    - Fast, responsive fuzzy autocomplete dropdown with keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).
  - **Dynamic Stills & Stylized Offline Clues**:
    - When online: connects directly to upstream stills CDN mirrors.
    - When offline: automatically falls back to rich cinematic clue cards (opening scenes, character dynamics, iconic dialogues, directors, and songs) so you can play anywhere without Wi-Fi.
  - **Game Modes**:
    - *Daily Puzzle*: Deterministic daily puzzle synchronized with UTC day count.
    - *Random Mode (`🎲 Random`)*: Instant infinite play across any movie in the library.
  - **Stats & Streaks**: Win celebration with confetti, current streak, max streak, and detailed guess histories (🟩 Correct, 🟥 Incorrect, ⏭️ Skipped).

---

## 🤖 Automated Daily GitHub Action (6:00 AM)

- **Workflow**: [`.github/workflows/daily-sync.yml`](file:///.github/workflows/daily-sync.yml)
- **Scheduled Cron**: `0 6 * * *` (Every day at 06:00 UTC / 11:30 AM IST) + `workflow_dispatch` for instant manual runs.
- **Automated Sync**:
  - Automatically fetches the latest additions, corrections, and missing movies from `santoshimz/pattukunte-pattucheera`.
  - Cleans, deduplicates, and sorts the database into `data/tollywood-movies.json`.
  - Commits with `github-actions[bot]` and pushes directly to `main` with zero manual intervention required.

---

## 🎨 Design, Theming & Vector Branding

- **Themes**:
  - **Light**: Crisp glass panels paired with soft pastel background tint matching the active reload color.
  - **Dark**: Deep true black (`#000000`) canvas with glowing neon buttons and borders.
  - **Itachi Theme**: Blood-red SVG moon with rotating Sharingan blades, silhouette crows, crimson markers, and Tsukuyomi victory screens.
  - **Naruto Theme ("Will of Fire")**: Radiant fiery orange (`#ea580c`) & electric cyan Rasengan styling.
  - **Game of Thrones Theme ("Ice & Fire")**: Glacial permafrost blue (`#38bdf8`) & Valyrian dragonfire gold-crimson styling.
- **Browser Mini-Window Mode (Pop-Out Floating App)**:
  - Click the **Mini Window** button in the top right to pop out the entire hub into a compact `430×720px` floating desktop window without browser toolbars or tab strips.
  - All games (TTT 3x3, TTT 5x5, Chess, Wordle, Poker, Pattu) adapt responsively with zero vertical scrolling.
  - Full support for all 5 themes with floating dropdown overlays.

---

## ⌨️ Keyboard Shortcuts

| Key | Action (In TTT / Chess / Poker / Pattu) | Action (In Wordle) |
|---|---|---|
| `1` | Switch to 3×3 Tic-Tac-Toe | Switch to 3×3 Tic-Tac-Toe |
| `2` | Switch to 5×5 Tic-Tac-Toe | Switch to 5×5 Tic-Tac-Toe |
| `3` | Switch to Chess | Switch to Chess |
| `4` | Switch to Wordle | — |
| `5` | Switch to Texas Hold'em Poker | Switch to Texas Hold'em Poker |
| `6` | Switch to Pattu (Tollywood) | Switch to Pattu (Tollywood) |
| `R` | Trigger New Game / New Hand | Types letter 'R' |
| `Z` | Undo last move (TTT / Chess) | Types letter 'Z' |
| `A-Z` | — | Inputs letter into current tile |
| `Enter` | — | Submits 5-letter guess |
| `Backspace` | — | Deletes previous letter |

---

## 🛠️ DevOps & Cloud Architecture

This repository is equipped with a complete, enterprise-grade 5-phase DevOps pipeline:

### 1. Docker Containerization (Non-Root & Hardened)
The container uses `nginx:1.27-alpine-slim` running as an unprivileged non-root user (`nginx`, UID 101) with embedded health checks:
```bash
# Build the local Docker image
docker build -t gap-arcade:latest .

# Run with Docker
docker run -d -p 8080:8080 --name gap-arcade gap-arcade:latest

# Or spin up with Docker Compose
docker compose up -d

# Verify health status
curl -i http://localhost:8080/healthz
```

### 2. CI/CD & Security Scanning (`.github/workflows/ci.yml`)
- **Syntax & Asset Gate**: Validates JavaScript syntax (`node --check`) and required static assets.
- **Trivy Vulnerability Scanner**: Aqua Security Trivy audits image layers for `CRITICAL` and `HIGH` CVEs.
- **Automated GHCR Publish**: Automatically builds and publishes multi-architecture images (`linux/amd64`, `linux/arm64`) to **GitHub Container Registry** (`ghcr.io/your-username/tictactoe:latest`) on every push to `main`.

### 3. Infrastructure as Code (Terraform on AWS Free Tier)
Deploy the gaming hub to an AWS `t2.micro` EC2 instance inside the default VPC:
```bash
cd infra/terraform

# Initialize Terraform providers
terraform init

# Review execution plan
terraform plan

# Deploy to AWS Free Tier
terraform apply -auto-approve

# View public application URL
terraform output application_url

# Teardown when done ($0 cost)
terraform destroy -auto-approve
```

### 4. Kubernetes Orchestration (`k8s/`)
Deploy 3 self-healing pods with rolling updates and resource limits:
```bash
# Deploy to Minikube, Kind, or EKS
kubectl apply -k k8s/

# Verify rollout status
kubectl rollout status deployment/gap-arcade-deployment

# Check running pods
kubectl get pods -l app.kubernetes.io/name=gap-arcade
```

### 5. Performance & Observability (`monitoring/`)
- **Prometheus**: Scrapes `/healthz` metrics defined in `monitoring/prometheus.yml`.
- **k6 Load Testing**: Stress-test the application with 50 concurrent virtual users:
  ```bash
  k6 run monitoring/k6-load-test.js
  ```

---

## 📁 File Structure

```text
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI/CD: Quality gates, Trivy scan, GHCR publish
│       └── daily-sync.yml         # Daily 6 AM automated GitHub Action
├── Dockerfile                     # Hardened non-root Nginx Alpine container (< 25MB)
├── docker-compose.yml             # Local single-command orchestration
├── nginx.conf                     # Custom Nginx with security headers, gzip, caching
├── infra/
│   └── terraform/                 # AWS Free Tier Infrastructure as Code
│       ├── provider.tf            # AWS provider configuration
│       ├── variables.tf           # Region, instance type (t2.micro), GHCR image
│       ├── network.tf             # VPC, security groups (HTTP/HTTPS)
│       ├── compute.tf             # EC2 Free Tier with cloud-init Docker install
│       └── outputs.tf             # Public IP and accessible URL outputs
├── k8s/                           # Declarative Kubernetes Manifests
│   ├── deployment.yaml            # 3 replicas, rolling updates, securityContext
│   ├── service.yaml               # Service load balancer
│   └── kustomization.yaml         # Kustomize resource bundle
├── monitoring/                    # Observability & Stress Testing
│   ├── prometheus.yml             # Prometheus scraper config
│   └── k6-load-test.js            # k6 automated load & stress test script
├── data/
│   └── tollywood-movies.json      # Auto-synced 1,645+ Telugu movies database
├── scripts/
│   ├── sync-tollywood.js          # Node.js sync script for GitHub runner
│   └── sync-tollywood.ps1         # PowerShell sync script for Windows
├── index.html                     # Semantic HTML5 layout & command docks
├── style.css                      # Responsive CSS styling, CSS variables & themes
├── script.js                      # Game engines, AI logic, offline dictionaries & state
└── README.md                      # Comprehensive documentation
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