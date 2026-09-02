const modeSelect = document.getElementById("modeSelect");
const difficultySelect = document.getElementById("difficultySelect");
const themeSelect = document.getElementById("themeSelect");

const gameTypePills = document.getElementById("gameTypePills");
const opponentPills = document.getElementById("opponentPills");
const difficultyPills = document.getElementById("difficultyPills");
const difficultyGroup = document.getElementById("difficultyGroup");
const timerPills = document.getElementById("timerPills");
const opponentGroup = document.getElementById("opponentGroup");

const newGameBtn = document.getElementById("newGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const undoBtn = document.getElementById("undoBtn");

const statusPill = document.getElementById("statusPill");
const radialWrap = document.getElementById("radialWrap");
const ringFg = document.getElementById("ringFg");
const radialText = document.getElementById("radialText");

const boardWrap = document.getElementById("boardWrap");
const tttBoardEl = document.getElementById("tttBoard");
const chessBoardEl = document.getElementById("chessBoard");
const wordleGameEl = document.getElementById("wordleGame");
const wordleBoardEl = document.getElementById("wordleBoard");
const wordleKeyboardEl = document.getElementById("wordleKeyboard");

const capturedTop = document.getElementById("capturedTop");
const capturedBottom = document.getElementById("capturedBottom");
const whiteCapturedEl = document.getElementById("whiteCaptured");
const blackCapturedEl = document.getElementById("blackCaptured");

const scoreAEl = document.getElementById("scoreA");
const scoreBEl = document.getElementById("scoreB");
const scoreDEl = document.getElementById("scoreD");
const streakBadge = document.getElementById("streakBadge");

const winOverlay = document.getElementById("winOverlay");
const winMessage = document.getElementById("winMessage");
const winRestartBtn = document.getElementById("winRestartBtn");
const winLineSvg = document.getElementById("tttWinLine");

const themePicker = document.getElementById("themePicker");
const themeTrigger = document.getElementById("themeTrigger");
const themeMenu = document.getElementById("themeMenu");
const themeCurrentIcon = document.getElementById("themeCurrentIcon");
const themeCurrentText = document.getElementById("themeCurrentText");

const scoreTickerBtn = document.getElementById("scoreTickerBtn");
const statsModal = document.getElementById("statsModal");
const closeStatsBtn = document.getElementById("closeStatsBtn");
const statsGridContent = document.getElementById("statsGridContent");
const confettiCanvas = document.getElementById("confettiCanvas");

/* ---------- Expanded Dynamic Colors on Reload (No Pink, Non-Gold) ---------- */
const DYNAMIC_PALETTES = [
  { accent: "#06b6d4", border: "#22d3ee", shadow: "#0891b2", tint: "rgba(6, 182, 212, 0.18)", lightBg: "#f1f5f9" },
  { accent: "#10b981", border: "#34d399", shadow: "#059669", tint: "rgba(16, 185, 129, 0.18)", lightBg: "#f1f5f9" },
  { accent: "#f59e0b", border: "#fbbf24", shadow: "#d97706", tint: "rgba(245, 158, 11, 0.18)", lightBg: "#f1f5f9" },
  { accent: "#8b5cf6", border: "#a78bfa", shadow: "#7c3aed", tint: "rgba(139, 92, 246, 0.18)", lightBg: "#f1f5f9" },
  { accent: "#14b8a6", border: "#2dd4bf", shadow: "#0d9488", tint: "rgba(20, 184, 166, 0.18)", lightBg: "#f1f5f9" },
  { accent: "#84cc16", border: "#a3e635", shadow: "#65a30d", tint: "rgba(132, 204, 22, 0.18)", lightBg: "#f1f5f9" },
  { accent: "#3b82f6", border: "#60a5fa", shadow: "#1d4ed8", tint: "rgba(59, 130, 246, 0.18)", lightBg: "#f1f5f9" },
  { accent: "#f97316", border: "#fb923c", shadow: "#c2410c", tint: "rgba(249, 115, 22, 0.18)", lightBg: "#f1f5f9" }
];

function applyRandomPalette() {
  const chosen = DYNAMIC_PALETTES[Math.floor(Math.random() * DYNAMIC_PALETTES.length)];
  const root = document.documentElement;
  root.style.setProperty("--dyn-accent", chosen.accent);
  root.style.setProperty("--dyn-border", chosen.border);
  root.style.setProperty("--dyn-shadow", chosen.shadow);
  root.style.setProperty("--dyn-tint", chosen.tint);
  root.style.setProperty("--dyn-light-bg", chosen.lightBg);
}
applyRandomPalette();

/* ---------- Custom SVGs for Itachi Sharingan & Crow ---------- */
const SHARINGAN_SVG = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#ff0033"/><circle cx="50" cy="50" r="38" fill="none" stroke="#000" stroke-width="4"/><circle cx="50" cy="50" r="10" fill="#000"/><circle cx="50" cy="24" r="7" fill="#000"/><path d="M50 24 Q57 32 50 37" stroke="#000" stroke-width="3" fill="none"/><circle cx="27" cy="63" r="7" fill="#000"/><path d="M27 63 Q23 72 30 75" stroke="#000" stroke-width="3" fill="none"/><circle cx="73" cy="63" r="7" fill="#000"/><path d="M73 63 Q77 72 70 75" stroke="#000" stroke-width="3" fill="none"/></svg>`;
const CROW_SVG = `<svg viewBox="0 0 100 100"><path d="M15 50 C25 25, 60 20, 85 40 C75 45, 65 48, 55 46 C68 55, 75 65, 80 80 C60 70, 40 75, 20 62 C30 62, 40 58, 45 52 C30 52, 20 54, 15 50 Z" fill="currentColor"/><circle cx="70" cy="38" r="3" fill="#ff0033"/></svg>`;

const hubState = {
  game: "ttt3",
  opponent: "ai",
  difficulty: "medium",
  timer: "off",
  theme: "light"
};

let scoreA = 0, scoreB = 0, scoreD = 0, streak = 0;

/* ---------- PERSIST KEYS ---------- */
const LIVE_STATE_KEY = "liveGameState_v3";

/* ---------- Idle Watchdog ---------- */
let idleSeconds = 0;
let idleInterval = null;

function resetIdleWatchdog() {
  idleSeconds = 0;
  statusPill?.classList.remove("idle-nudge");
  boardWrap?.classList.remove("idle-shake");
}

function startIdleWatchdog() {
  if (idleInterval) clearInterval(idleInterval);
  idleSeconds = 0;
  idleInterval = setInterval(() => {
    if (hubState.timer === "off") {
      idleSeconds++;
      if (idleSeconds >= 60) {
        statusPill?.classList.add("idle-nudge");
        boardWrap?.classList.add("idle-shake");
        if (statusPill && !statusPill.textContent.includes("Take your turn!")) {
          statusPill.textContent = "⏳ Take your turn!";
        }
      }
    }
  }, 1000);
}

/* ---------- State Management ---------- */
function modeFromHub() {
  if (hubState.game === "wordle") return "wordle";
  if (hubState.game === "ttt3") return hubState.opponent === "ai" ? "ttt3-ai" : "ttt3-2p";
  if (hubState.game === "ttt5") return hubState.opponent === "ai" ? "ttt5-ai" : "ttt5-2p";
  return hubState.opponent === "ai" ? "chess-ai" : "chess-2p";
}

function hubFromMode(mode) {
  if (mode === "wordle") {
    hubState.game = "wordle";
    hubState.opponent = "local";
    return;
  }
  if (mode.startsWith("ttt3")) hubState.game = "ttt3";
  else if (mode.startsWith("ttt5")) hubState.game = "ttt5";
  else hubState.game = "chess";
  hubState.opponent = mode.endsWith("-ai") ? "ai" : "local";
}

function setActive(groupEl, key, val) {
  groupEl?.querySelectorAll(`[data-${key}]`).forEach(btn => {
    btn.classList.toggle("active", btn.dataset[key] === val);
  });
}

function persistHub() {
  const opponentVal = hubState.game === "wordle" ? "local" : hubState.opponent;
  localStorage.setItem("hubState", JSON.stringify({ ...hubState, opponent: opponentVal }));
  const hash = `#/${hubState.game}?vs=${opponentVal}&diff=${hubState.difficulty}&timer=${hubState.timer}&theme=${hubState.theme}`;
  history.replaceState(null, "", hash);
}

function loadHub() {
  const saved = JSON.parse(localStorage.getItem("hubState") || "null");
  if (saved) Object.assign(hubState, saved);

  // URL sync on reload
  const raw = location.hash || "";
  if (raw.startsWith("#/")) {
    const [path, query = ""] = raw.slice(2).split("?");
    if (["ttt3", "ttt5", "chess", "wordle"].includes(path)) hubState.game = path;

    const q = new URLSearchParams(query);
    const vs = q.get("vs");
    const diff = q.get("diff");
    const timer = q.get("timer");
    const theme = q.get("theme");

    if (["ai", "local"].includes(vs)) hubState.opponent = vs;
    if (["easy", "medium", "hard"].includes(diff)) hubState.difficulty = diff;
    if (["off", "15", "30", "45", "60", "90"].includes(timer)) hubState.timer = timer;
    if (["dark", "light", "itachi"].includes(theme)) hubState.theme = theme;
  }

  // normalize
  if (!["off", "15", "30", "45", "60", "90"].includes(hubState.timer)) hubState.timer = "off";
  if (!["dark", "light", "itachi"].includes(hubState.theme)) hubState.theme = "light";
  if (!["easy", "medium", "hard"].includes(hubState.difficulty)) hubState.difficulty = "medium";
  if (!["ai", "local"].includes(hubState.opponent)) hubState.opponent = "ai";
  if (!["ttt3", "ttt5", "chess", "wordle"].includes(hubState.game)) hubState.game = "ttt3";

  if (hubState.game === "wordle") hubState.opponent = "local";
}

function syncHud() {
  const isWordle = hubState.game === "wordle";
  if (isWordle) hubState.opponent = "local";

  setActive(gameTypePills, "game", hubState.game);
  setActive(opponentPills, "opponent", hubState.opponent);
  setActive(difficultyPills, "difficulty", hubState.difficulty);
  setActive(timerPills, "timer", hubState.timer);

  if (opponentGroup) {
    if (isWordle) opponentGroup.style.setProperty("display", "none", "important");
    else opponentGroup.style.display = "flex";
  }

  if (difficultyGroup) {
    difficultyGroup.style.display = "flex";
    difficultyGroup.classList.toggle("disabled", !isWordle && hubState.opponent !== "ai");
  }
}

/* ---------- Theme Handling ---------- */
function themeMeta(theme) {
  if (theme === "light") return {
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    text: "Light"
  };
  if (theme === "itachi") return {
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2.5"/><circle cx="5.9" cy="15.5" r="2.5"/><circle cx="18.1" cy="15.5" r="2.5"/></svg>`,
    text: "Itachi"
  };
  return {
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    text: "Dark"
  };
}

function setTheme(theme) {
  hubState.theme = theme;
  if (themeSelect) themeSelect.value = theme;
  document.body.setAttribute("data-theme", theme);
  const m = themeMeta(theme);
  if (themeCurrentIcon) themeCurrentIcon.innerHTML = m.icon;
  if (themeCurrentText) themeCurrentText.textContent = m.text;
  themeMenu?.querySelectorAll(".theme-item").forEach(b => b.classList.toggle("active", b.dataset.theme === theme));
  persistHub();

  if (hubState.game.startsWith("ttt")) renderTTT();
  if (hubState.game === "chess") renderChess();
}

themeTrigger?.addEventListener("click", (e) => {
  e.stopPropagation();
  themePicker?.classList.toggle("open");
});

themeMenu?.addEventListener("click", (e) => {
  const b = e.target.closest(".theme-item");
  if (!b) return;
  setTheme(b.dataset.theme);
  themePicker?.classList.remove("open");
});

document.addEventListener("click", () => themePicker?.classList.remove("open"));

/* ---------- Score Tracking & Statistics Modal ---------- */
function scoreKey() { return `scores_${modeSelect.value}_${difficultySelect.value}`; }

function renderScores() {
  if (scoreAEl) scoreAEl.textContent = scoreA;
  if (scoreBEl) scoreBEl.textContent = scoreB;
  if (scoreDEl) scoreDEl.textContent = scoreD;
  if (streakBadge) streakBadge.textContent = `🔥 Streak: ${streak}`;
}

function persistScores() {
  localStorage.setItem(scoreKey(), JSON.stringify({ scoreA, scoreB, scoreD, streak }));
}

function loadScores() {
  const s = JSON.parse(localStorage.getItem(scoreKey()) || "null");
  if (s) {
    scoreA = s.scoreA || 0;
    scoreB = s.scoreB || 0;
    scoreD = s.scoreD || 0;
    streak = s.streak || 0;
  } else {
    scoreA = scoreB = scoreD = streak = 0;
  }
  renderScores();
}

function updateStreak(winA) { streak = winA ? streak + 1 : 0; }

scoreTickerBtn?.addEventListener("click", () => {
  const modes = [
    { label: "3x3 TTT (AI)", key: "scores_ttt3-ai_medium" },
    { label: "5x5 TTT (AI)", key: "scores_ttt5-ai_medium" },
    { label: "Chess (AI)", key: "scores_chess-ai_medium" },
    { label: "Wordle", key: "scores_wordle_medium" }
  ];

  if (!statsGridContent || !statsModal) return;
  statsGridContent.innerHTML = modes.map(m => {
    const data = JSON.parse(localStorage.getItem(m.key) || '{"scoreA":0,"scoreB":0,"scoreD":0,"streak":0}');
    const wins = data.scoreA || 0;
    const losses = data.scoreB || 0;
    const totalForRate = wins + losses;
    const winRate = totalForRate > 0 ? Math.round((wins / totalForRate) * 100) : 0;
    return `
      <div class="stat-card">
        <span>${m.label}</span>
        <span>Wins: <b>${wins}</b> | Losses: <b>${losses}</b> | Win Rate: <b>${winRate}%</b></span>
      </div>
    `;
  }).join("");

  statsModal.classList.remove("hidden");
});

closeStatsBtn?.addEventListener("click", () => statsModal?.classList.add("hidden"));
statsModal?.addEventListener("click", (e) => { if (e.target === statsModal) statsModal.classList.add("hidden"); });

/* ---------- Confetti ---------- */
function triggerConfetti() {
  if (!confettiCanvas) return;
  const ctx = confettiCanvas.getContext("2d");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#ff0033", "#ffd000", "#10b981", "#3b82f6", "#8b5cf6", "#fbbf24"];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: confettiCanvas.width / 2,
      y: confettiCanvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  let animationFrame;
  function loop() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.4; p.rotation += p.vRot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    animationFrame = requestAnimationFrame(loop);
  }
  loop();
  setTimeout(() => cancelAnimationFrame(animationFrame), 3500);
}

/* ---------- Timer Logic ---------- */
let turnTimer = null;
let turnTimeLeft = 0;
let turnTimeTotal = 0;
const CIRC = 2 * Math.PI * 50;

function stopTurnTimer() {
  if (turnTimer) clearInterval(turnTimer);
  turnTimer = null;
}
function showTimerInactive() {
  radialWrap?.classList.add("hidden");
  statusPill?.classList.remove("hidden");
}
function showTimerActive() {
  statusPill?.classList.add("hidden");
  radialWrap?.classList.remove("hidden");
}
function renderRadial() {
  if (!turnTimeTotal || !ringFg || !radialText) return;
  const pct = Math.max(0, turnTimeLeft / turnTimeTotal);
  ringFg.style.strokeDasharray = `${CIRC}`;
  ringFg.style.strokeDashoffset = `${CIRC * (1 - pct)}`;
  radialText.textContent = String(Math.ceil(Math.max(0, turnTimeLeft)));
}
function startTurnTimer() {
  stopTurnTimer();
  resetIdleWatchdog();

  if (hubState.timer === "off" || hubState.game === "wordle") {
    showTimerInactive();
    return;
  }

  const total = Number(hubState.timer);
  if (!Number.isFinite(total) || total <= 0) {
    hubState.timer = "off";
    setActive(timerPills, "timer", "off");
    showTimerInactive();
    persistHub();
    return;
  }

  turnTimeTotal = total;
  turnTimeLeft = total;
  showTimerActive();
  renderRadial();

  turnTimer = setInterval(() => {
    turnTimeLeft -= 0.1;
    renderRadial();
    if (turnTimeLeft <= 0) {
      stopTurnTimer();
      onTimerExpired();
    }
  }, 100);
}

/* ---------- Win ---------- */
function showWinScreen(msg) {
  resetIdleWatchdog();
  if (winMessage) winMessage.textContent = msg.toUpperCase();
  winOverlay?.classList.remove("hidden");
  triggerConfetti();
}
function hideWinScreen() {
  winOverlay?.classList.add("hidden");
}
winRestartBtn?.addEventListener("click", () => { hideWinScreen(); initBoard(true); });
winOverlay?.addEventListener("click", (e) => { if (e.target === winOverlay) hideWinScreen(); });

/* ---------- Tic-Tac-Toe ---------- */
let tttBoard = [], tttSize = 3, tttWinLen = 3, tttTurn = "X", tttOver = false, tttWinningCells = [];
let tttSnapshots = [];

function clearWinLine() { if (winLineSvg) winLineSvg.innerHTML = ""; }

function drawWinLineTTT(line) {
  if (!winLineSvg || !line.length) return;
  const s = tttSize, a = line[0], b = line[line.length - 1];
  const ar = Math.floor(a / s), ac = a % s, br = Math.floor(b / s), bc = b % s;
  winLineSvg.innerHTML = `<line x1="${((ac + 0.5) / s) * 100}" y1="${((ar + 0.5) / s) * 100}" x2="${((bc + 0.5) / s) * 100}" y2="${((br + 0.5) / s) * 100}"></line>`;
}
function buildTTTLines(size, len) {
  const lines = [];
  for (let r = 0; r < size; r++) for (let c = 0; c <= size - len; c++) { const l = []; for (let k = 0; k < len; k++) l.push(r * size + c + k); lines.push(l); }
  for (let c = 0; c < size; c++) for (let r = 0; r <= size - len; r++) { const l = []; for (let k = 0; k < len; k++) l.push((r + k) * size + c); lines.push(l); }
  for (let r = 0; r <= size - len; r++) for (let c = 0; c <= size - len; c++) { const l = []; for (let k = 0; k < len; k++) l.push((r + k) * size + (c + k)); lines.push(l); }
  for (let r = 0; r <= size - len; r++) for (let c = len - 1; c < size; c++) { const l = []; for (let k = 0; k < len; k++) l.push((r + k) * size + (c - k)); lines.push(l); }
  return lines;
}
function getTTTResult(board, size = tttSize, winLen = tttWinLen) {
  for (const line of buildTTTLines(size, winLen)) {
    const first = board[line[0]];
    if (first && line.every(i => board[i] === first)) return { winner: first, line };
  }
  if (board.every(Boolean)) return { winner: "draw", line: [] };
  return { winner: null, line: [] };
}
function getEmptyCells(board) { const a = []; for (let i = 0; i < board.length; i++) if (!board[i]) a.push(i); return a; }
function saveTTTSnapshot() { tttSnapshots.push({ board: [...tttBoard], turn: tttTurn, over: tttOver, win: [...tttWinningCells], scoreA, scoreB, scoreD, streak }); }

function initTTT(size) {
  tttSize = size;
  tttWinLen = size === 3 ? 3 : 4;
  tttBoard = Array(size * size).fill(null);
  tttTurn = "X";
  tttOver = false;
  tttWinningCells = [];
  tttSnapshots = [];
  clearWinLine();
  renderTTT();
  startTurnTimer();
}
function renderTTT() {
  resetIdleWatchdog();
  boardWrap?.classList.remove("wordle-mode", "chess-mode");
  capturedTop?.classList.remove("chess-mode");
  capturedBottom?.classList.remove("chess-mode");
  tttBoardEl?.classList.remove("hidden");
  chessBoardEl?.classList.add("hidden");
  wordleGameEl?.classList.add("hidden");
  capturedTop?.classList.add("hidden");
  capturedBottom?.classList.add("hidden");

  if (!tttBoardEl) return;
  tttBoardEl.innerHTML = "";
  tttBoardEl.style.gridTemplateColumns = `repeat(${tttSize}, minmax(50px, 1fr))`;

  const isItachi = hubState.theme === "itachi";
  tttBoard.forEach((v, i) => {
    const cell = document.createElement("button");
    cell.className = "ttt-cell";
    if (v === "X") { cell.classList.add("x"); cell.innerHTML = isItachi ? SHARINGAN_SVG : "X"; }
    else if (v === "O") { cell.classList.add("o"); cell.innerHTML = isItachi ? CROW_SVG : "O"; }

    if (tttWinningCells.includes(i)) cell.classList.add("win");
    cell.addEventListener("click", () => onTTTClick(i));
    tttBoardEl.appendChild(cell);
  });

  const r = getTTTResult(tttBoard);
  if (hubState.timer === "off" && statusPill) {
    if (isItachi) {
      statusPill.innerHTML = r.winner === "draw" ? "Draw" : r.winner ? (r.winner === "X" ? "Sharingan Wins" : "Crow Wins") : (tttTurn === "X" ? "Sharingan's Turn" : "Crow's Turn");
    } else {
      statusPill.textContent = r.winner === "draw" ? "Draw" : r.winner ? `${r.winner} Wins` : `${tttTurn}'s Turn`;
    }
  }
}
function minimaxTTT(board, size, winLen, depth, maxing) {
  const r = getTTTResult(board, size, winLen);
  if (r.winner === "O") return { score: 1000 + depth };
  if (r.winner === "X") return { score: -1000 - depth };
  if (r.winner === "draw" || depth === 0) return { score: 0 };
  const empties = getEmptyCells(board);
  let best = { score: maxing ? -Infinity : Infinity, move: null };
  for (const i of empties) {
    board[i] = maxing ? "O" : "X";
    const out = minimaxTTT(board, size, winLen, depth - 1, !maxing);
    board[i] = null;
    if (maxing ? out.score > best.score : out.score < best.score) best = { score: out.score, move: i };
  }
  return best;
}
function aiTTTMove() {
  if (tttOver) return;
  const empties = getEmptyCells(tttBoard);
  if (!empties.length) return;

  saveTTTSnapshot();
  let move = empties[Math.floor(Math.random() * empties.length)];
  if (difficultySelect.value !== "easy") {
    const depth = tttSize === 3 ? Math.min(empties.length, 7) : (difficultySelect.value === "medium" ? 2 : 3);
    const best = minimaxTTT(tttBoard, tttSize, tttWinLen, depth, true);
    if (best.move != null) move = best.move;
  }

  tttBoard[move] = "O";
  const r = getTTTResult(tttBoard);
  if (r.winner) return finishTTT(r.winner, r.line);

  tttTurn = "X";
  renderTTT();
  startTurnTimer();
  persistLiveState();
}
function finishTTT(winner, line) {
  stopTurnTimer();
  resetIdleWatchdog();
  tttOver = true;
  tttWinningCells = [...line];
  drawWinLineTTT(line);

  const aiMode = modeSelect.value.endsWith("-ai");
  const isItachi = hubState.theme === "itachi";
  if (winner === "X") {
    scoreA++; updateStreak(aiMode);
    showWinScreen(isItachi ? "Sharingan Triumphs!" : (aiMode ? "You Win!" : "X Wins!"));
  } else if (winner === "O") {
    scoreB++; updateStreak(false);
    showWinScreen(isItachi ? "Crow Triumphs!" : (aiMode ? "Computer Wins!" : "O Wins!"));
  } else {
    scoreD++; showWinScreen("Draw");
  }

  persistScores();
  renderScores();
  renderTTT();
  persistLiveState();
}
function onTTTClick(i) {
  const aiMode = modeSelect.value.endsWith("-ai");
  if (tttOver || tttBoard[i]) return;
  if (aiMode && tttTurn === "O") return;

  resetIdleWatchdog();
  saveTTTSnapshot();
  tttBoard[i] = tttTurn;
  const r = getTTTResult(tttBoard);
  if (r.winner) return finishTTT(r.winner, r.line);

  tttTurn = tttTurn === "X" ? "O" : "X";
  renderTTT();
  startTurnTimer();
  persistLiveState();

  if (aiMode && tttTurn === "O") {
    if (hubState.timer === "off" && statusPill) statusPill.textContent = "AI Thinking...";
    setTimeout(aiTTTMove, difficultySelect.value === "easy" ? 260 : difficultySelect.value === "medium" ? 500 : 760);
  }
}

/* ---------- Chess ---------- */
const CHESS_U = { wp: "♟", wr: "♜", wn: "♞", wb: "♝", wq: "♛", wk: "♚", bp: "♟", br: "♜", bn: "♞", bb: "♝", bq: "♛", bk: "♚" };
const PIECE_VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
let chessBoard = [], chessTurn = "w", chessSelected = null, chessOver = false, whiteCaptured = [], blackCaptured = [], chessSnapshots = [];

function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function cloneBoard(b) { return b.map(row => row.map(cell => cell ? { ...cell } : null)); }
function saveChessSnapshot() {
  chessSnapshots.push({
    board: cloneBoard(chessBoard), turn: chessTurn, selected: chessSelected ? { ...chessSelected } : null,
    over: chessOver, whiteCaptured: [...whiteCaptured], blackCaptured: [...blackCaptured],
    scoreA, scoreB, scoreD, streak
  });
}
function initChess() {
  chessBoard = Array.from({ length: 8 }, () => Array(8).fill(null));
  const back = ["r", "n", "b", "q", "k", "b", "n", "r"];
  for (let c = 0; c < 8; c++) {
    chessBoard[0][c] = { color: "b", type: back[c] };
    chessBoard[1][c] = { color: "b", type: "p" };
    chessBoard[6][c] = { color: "w", type: "p" };
    chessBoard[7][c] = { color: "w", type: back[c] };
  }
  chessTurn = "w"; chessSelected = null; chessOver = false; whiteCaptured = []; blackCaptured = []; chessSnapshots = [];
  renderCaptured();
  renderChess();
  startTurnTimer();
}
function renderCaptured() {
  if (whiteCapturedEl) whiteCapturedEl.textContent = whiteCaptured.map(p => CHESS_U[p.color + p.type]).join(" ");
  if (blackCapturedEl) blackCapturedEl.textContent = blackCaptured.map(p => CHESS_U[p.color + p.type]).join(" ");
}
function getPseudoMoves(board, r, c) {
  const p = board[r][c];
  if (!p) return [];
  const out = [];
  const add = (nr, nc) => { if (!inBounds(nr, nc)) return; const t = board[nr][nc]; if (!t || t.color !== p.color) out.push({ r: nr, c: nc }); };

  if (p.type === "p") {
    const dir = p.color === "w" ? -1 : 1, start = p.color === "w" ? 6 : 1;
    if (inBounds(r + dir, c) && !board[r + dir][c]) out.push({ r: r + dir, c });
    if (r === start && !board[r + dir][c] && !board[r + 2 * dir][c]) out.push({ r: r + 2 * dir, c });
    for (const dc of [-1, 1]) { const nr = r + dir, nc = c + dc; if (inBounds(nr, nc) && board[nr][nc] && board[nr][nc].color !== p.color) out.push({ r: nr, c: nc }); }
  } else if (p.type === "n") {
    [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => add(r + dr, c + dc));
  } else if (p.type === "k") {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (dr || dc) add(r + dr, c + dc);
  } else {
    const dirs = [];
    if (p.type === "b" || p.type === "q") dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    if (p.type === "r" || p.type === "q") dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
    for (const [dr, dc] of dirs) {
      let nr = r + dr, nc = c + dc;
      while (inBounds(nr, nc)) {
        if (!board[nr][nc]) out.push({ r: nr, c: nc });
        else { if (board[nr][nc].color !== p.color) out.push({ r: nr, c: nc }); break; }
        nr += dr; nc += dc;
      }
    }
  }
  return out;
}
function renderChess() {
  resetIdleWatchdog();
  boardWrap?.classList.remove("wordle-mode");
  boardWrap?.classList.add("chess-mode");
  capturedTop?.classList.add("chess-mode");
  capturedBottom?.classList.add("chess-mode");

  clearWinLine();
  tttBoardEl?.classList.add("hidden");
  wordleGameEl?.classList.add("hidden");
  chessBoardEl?.classList.remove("hidden");
  capturedTop?.classList.remove("hidden");
  capturedBottom?.classList.remove("hidden");

  if (!chessBoardEl || !Array.isArray(chessBoard) || !chessBoard.length) return;
  chessBoardEl.innerHTML = "";

  const hints = chessSelected ? getPseudoMoves(chessBoard, chessSelected.r, chessSelected.c) : [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const cell = document.createElement("div");
    cell.className = "chess-cell " + (((r + c) % 2 === 0) ? "light" : "dark");
    if (chessSelected && chessSelected.r === r && chessSelected.c === c) cell.classList.add("selected");
    if (hints.some(m => m.r === r && m.c === c)) cell.classList.add("hint");

    const p = chessBoard[r][c];
    if (p) {
      cell.textContent = CHESS_U[p.color + p.type];
      cell.classList.add(p.color === "w" ? "white-piece" : "black-piece");
    }

    cell.addEventListener("click", () => onChessClick(r, c));
    chessBoardEl.appendChild(cell);
  }

  if (hubState.timer === "off" && statusPill) statusPill.textContent = chessOver ? "Game Over" : `${chessTurn === "w" ? "White" : "Black"}'s Turn`;
}
function moveChess(board, mv, real = false) {
  const piece = board[mv.fr][mv.fc], target = board[mv.tr][mv.tc];
  if (target && real) {
    if (target.color === "w") whiteCaptured.push(target); else blackCaptured.push(target);
    if (target.type === "k") {
      chessOver = true;
      if (piece.color === "w") { scoreA++; updateStreak(modeSelect.value === "chess-ai"); showWinScreen("White Wins"); }
      else { scoreB++; updateStreak(false); showWinScreen("Black Wins"); }
      persistScores(); renderScores();
    }
    renderCaptured();
  }
  board[mv.tr][mv.tc] = piece; board[mv.fr][mv.fc] = null;
  if (piece.type === "p" && (mv.tr === 0 || mv.tr === 7)) piece.type = "q";
}
function allMovesForColor(board, color) {
  const out = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = board[r][c];
    if (!p || p.color !== color) continue;
    getPseudoMoves(board, r, c).forEach(m => out.push({ fr: r, fc: c, tr: m.r, tc: m.c }));
  }
  return out;
}
function evalChess(board) {
  let s = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = board[r][c];
    if (!p) continue;
    s += (p.color === "b" ? 1 : -1) * PIECE_VAL[p.type];
  }
  return s;
}
function minimaxChess(board, depth, alpha, beta, maxing) {
  if (depth === 0) return { score: evalChess(board), move: null };
  const color = maxing ? "b" : "w", moves = allMovesForColor(board, color);
  if (!moves.length) return { score: evalChess(board), move: null };
  let bestMove = null;

  if (maxing) {
    let best = -Infinity;
    for (const mv of moves) {
      const b2 = cloneBoard(board); moveChess(b2, mv, false);
      const r = minimaxChess(b2, depth - 1, alpha, beta, false);
      if (r.score > best) { best = r.score; bestMove = mv; }
      alpha = Math.max(alpha, r.score); if (beta <= alpha) break;
    }
    return { score: best, move: bestMove };
  }

  let best = Infinity;
  for (const mv of moves) {
    const b2 = cloneBoard(board); moveChess(b2, mv, false);
    const r = minimaxChess(b2, depth - 1, alpha, beta, true);
    if (r.score < best) { best = r.score; bestMove = mv; }
    beta = Math.min(beta, r.score); if (beta <= alpha) break;
  }
  return { score: best, move: bestMove };
}
function onChessClick(r, c) {
  const aiMode = modeSelect.value === "chess-ai";
  if (chessOver) return;
  if (aiMode && chessTurn === "b") return;

  resetIdleWatchdog();
  const p = chessBoard[r][c];
  if (!chessSelected) {
    if (p && p.color === chessTurn) chessSelected = { r, c };
    renderChess();
    return;
  }

  const legal = getPseudoMoves(chessBoard, chessSelected.r, chessSelected.c).find(m => m.r === r && m.c === c);
  if (!legal) {
    chessSelected = (p && p.color === chessTurn) ? { r, c } : null;
    renderChess();
    return;
  }

  saveChessSnapshot();
  moveChess(chessBoard, { fr: chessSelected.r, fc: chessSelected.c, tr: r, tc: c }, true);
  if (chessOver) { renderChess(); stopTurnTimer(); persistLiveState(); return; }

  chessSelected = null;
  chessTurn = chessTurn === "w" ? "b" : "w";
  renderChess();
  startTurnTimer();
  persistLiveState();

  if (aiMode && chessTurn === "b" && !chessOver) {
    if (hubState.timer === "off" && statusPill) statusPill.textContent = "AI Thinking...";
    setTimeout(() => {
      saveChessSnapshot();
      const depth = difficultySelect.value === "easy" ? 1 : difficultySelect.value === "medium" ? 2 : 3;
      const res = minimaxChess(chessBoard, depth, -Infinity, Infinity, true);
      const mv = res.move || allMovesForColor(chessBoard, "b")[0];
      if (mv) { moveChess(chessBoard, mv, true); if (!chessOver) chessTurn = "w"; }
      renderChess();
      startTurnTimer();
      persistLiveState();
    }, 500);
  }
}

/* ---------- Wordle ---------- */
const WORDLE_TIERS = {
  easy: ["AISLE","CHAIR","PLANT","CRANE","BEACH","BREAD","CLEAN","DANCE","EARTH","LIGHT"],
  medium: ["PIPER","FLIPS","CHASM","BRAIN","CRAFT","CRIME","DRAFT","DRILL","FLOAT","GLOVE"],
  hard: ["KNOLL","VIVID","FJORD","PROXY","QUIRK","PUPPY","MUMMY","CYNIC","GAUZE","ENVOY"]
};
const VALID_DICTIONARY_WORDS = new Set([...WORDLE_TIERS.easy, ...WORDLE_TIERS.medium, ...WORDLE_TIERS.hard]);

let wordleTarget = "CHAIR", wordleRow = 0, wordleCol = 0, wordleGrid = [], wordleOver = false;

function getWordleTargetByDifficulty() {
  const tier = hubState.difficulty || "medium";
  const pool = WORDLE_TIERS[tier] || WORDLE_TIERS.medium;
  return pool[Math.floor(Math.random() * pool.length)];
}
function initWordle() {
  resetIdleWatchdog();
  clearWinLine();
  stopTurnTimer();
  showTimerInactive();
  boardWrap?.classList.remove("chess-mode");
  capturedTop?.classList.remove("chess-mode");
  capturedBottom?.classList.remove("chess-mode");
  boardWrap?.classList.add("wordle-mode");

  tttBoardEl?.classList.add("hidden");
  chessBoardEl?.classList.add("hidden");
  capturedTop?.classList.add("hidden");
  capturedBottom?.classList.add("hidden");
  wordleGameEl?.classList.remove("hidden");

  wordleTarget = getWordleTargetByDifficulty();
  wordleRow = 0; wordleCol = 0; wordleOver = false;
  wordleGrid = Array.from({ length: 6 }, () => Array(5).fill(""));
  if (statusPill) statusPill.textContent = `Wordle (${hubState.difficulty.toUpperCase()})`;
  renderWordle();
}
function renderWordle() {
  if (!wordleBoardEl || !wordleKeyboardEl) return;
  wordleBoardEl.innerHTML = "";
  for (let r = 0; r < 6; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "wordle-row";
    rowEl.id = `wr-${r}`;
    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.className = "wordle-tile";
      tile.id = `wt-${r}-${c}`;
      tile.textContent = wordleGrid[r][c];
      rowEl.appendChild(tile);
    }
    wordleBoardEl.appendChild(rowEl);
  }
}
function handleWordleKey(k) {
  if (wordleOver || hubState.game !== "wordle") return;
  resetIdleWatchdog();

  if (k === "DEL" || k === "BACKSPACE") {
    if (wordleCol > 0) {
      wordleCol--;
      wordleGrid[wordleRow][wordleCol] = "";
      const tile = document.getElementById(`wt-${wordleRow}-${wordleCol}`);
      if (tile) tile.textContent = "";
    }
    persistLiveState();
    return;
  }

  if (k === "ENTER") {
    if (wordleCol === 5) checkWordleRow();
    return;
  }

  if (/^[A-Z]$/.test(k) && wordleCol < 5) {
    wordleGrid[wordleRow][wordleCol] = k;
    const tile = document.getElementById(`wt-${wordleRow}-${wordleCol}`);
    if (tile) tile.textContent = k;
    wordleCol++;
    persistLiveState();
  }
}
function checkWordleRow() {
  const guess = wordleGrid[wordleRow].join("");
  if (!VALID_DICTIONARY_WORDS.has(guess)) {
    if (statusPill) statusPill.textContent = "Not in word list!";
    setTimeout(() => { if (statusPill) statusPill.textContent = `Wordle (${hubState.difficulty.toUpperCase()})`; }, 1000);
    return;
  }

  if (guess === wordleTarget) {
    wordleOver = true;
    scoreA++; streak++;
    persistScores(); renderScores();
    showWinScreen("Word Solved!");
    persistLiveState();
    return;
  }

  wordleRow++; wordleCol = 0;
  if (wordleRow === 6) {
    wordleOver = true;
    scoreB++; streak = 0;
    persistScores(); renderScores();
    showWinScreen(`The Word was: ${wordleTarget}`);
  }
  persistLiveState();
}

/* ---------- live game persistence ---------- */
function persistLiveState() {
  const payload = {
    hubState: { ...hubState },
    mode: modeSelect.value,
    scores: { scoreA, scoreB, scoreD, streak },
    ttt: {
      board: tttBoard, size: tttSize, winLen: tttWinLen, turn: tttTurn, over: tttOver, winning: tttWinningCells
    },
    chess: {
      board: chessBoard, turn: chessTurn, selected: chessSelected, over: chessOver,
      whiteCaptured, blackCaptured
    },
    wordle: {
      target: wordleTarget, row: wordleRow, col: wordleCol, grid: wordleGrid, over: wordleOver
    }
  };
  localStorage.setItem(LIVE_STATE_KEY, JSON.stringify(payload));
}
function restoreLiveStateIfAny() {
  const raw = localStorage.getItem(LIVE_STATE_KEY);
  if (!raw) return false;
  try {
    const s = JSON.parse(raw);
    if (!s || !s.mode) return false;

    if (s.hubState) Object.assign(hubState, s.hubState);
    modeSelect.value = s.mode;

    if (s.scores) {
      scoreA = s.scores.scoreA || 0;
      scoreB = s.scores.scoreB || 0;
      scoreD = s.scores.scoreD || 0;
      streak = s.scores.streak || 0;
      renderScores();
    }

    // restore by mode
    if (s.mode === "wordle" && s.wordle) {
      wordleTarget = s.wordle.target || getWordleTargetByDifficulty();
      wordleRow = s.wordle.row || 0;
      wordleCol = s.wordle.col || 0;
      wordleGrid = s.wordle.grid || Array.from({ length: 6 }, () => Array(5).fill(""));
      wordleOver = !!s.wordle.over;
      renderWordle();
      statusPill.textContent = `Wordle (${hubState.difficulty.toUpperCase()})`;
      return true;
    }

    if (s.mode.startsWith("ttt") && s.ttt) {
      tttBoard = Array.isArray(s.ttt.board) ? s.ttt.board : [];
      tttSize = s.ttt.size || (s.mode.startsWith("ttt5") ? 5 : 3);
      tttWinLen = s.ttt.winLen || (tttSize === 3 ? 3 : 4);
      tttTurn = s.ttt.turn || "X";
      tttOver = !!s.ttt.over;
      tttWinningCells = Array.isArray(s.ttt.winning) ? s.ttt.winning : [];
      renderTTT();
      return true;
    }

    if (s.mode.startsWith("chess") && s.chess) {
      chessBoard = Array.isArray(s.chess.board) ? s.chess.board : [];
      chessTurn = s.chess.turn || "w";
      chessSelected = s.chess.selected || null;
      chessOver = !!s.chess.over;
      whiteCaptured = Array.isArray(s.chess.whiteCaptured) ? s.chess.whiteCaptured : [];
      blackCaptured = Array.isArray(s.chess.blackCaptured) ? s.chess.blackCaptured : [];

      // if corrupt/empty, re-init chess
      const looksValid = chessBoard.length === 8 && Array.isArray(chessBoard[0]) && chessBoard[0].length === 8;
      if (!looksValid) return false;

      renderCaptured();
      renderChess();
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/* ---------- Global Keyboard ---------- */
window.addEventListener("keydown", (e) => {
  const k = e.key.toUpperCase();

  if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
    if (k === "1") { hubState.game = "ttt3"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    if (k === "2") { hubState.game = "ttt5"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    if (k === "3") { hubState.game = "chess"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    if (k === "4") { hubState.game = "wordle"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }

    if (k === "R") { newGameBtn?.click(); return; }
    if (k === "Z") { undoBtn?.click(); return; }
  }

  if (hubState.game !== "wordle") return;
  if (k === "ENTER" || k === "BACKSPACE" || /^[A-Z]$/.test(k)) handleWordleKey(k);
});

/* ---------- Timer Expiration ---------- */
function onTimerExpired() {
  const mode = modeSelect.value;
  if (mode.startsWith("ttt")) {
    const e = getEmptyCells(tttBoard);
    if (!e.length || tttOver) return;
    onTTTClick(e[Math.floor(Math.random() * e.length)]);
    return;
  }
  if (mode.startsWith("chess") && !chessOver) {
    const moves = allMovesForColor(chessBoard, chessTurn);
    if (!moves.length) return;
    moveChess(chessBoard, moves[Math.floor(Math.random() * moves.length)], true);
    chessTurn = chessTurn === "w" ? "b" : "w";
    renderChess();
    startTurnTimer();
    persistLiveState();
  }
}

/* ---------- Action Controls ---------- */
newGameBtn?.addEventListener("click", () => {
  resetIdleWatchdog();
  initBoard(true);
});

resetScoreBtn?.addEventListener("click", () => {
  resetIdleWatchdog();
  scoreA = 0; scoreB = 0; scoreD = 0; streak = 0;
  persistScores();
  renderScores();
  persistLiveState();
});

undoBtn?.addEventListener("click", () => {
  resetIdleWatchdog();
  if (hubState.game === "wordle") {
    handleWordleKey("DEL");
    return;
  }
  const mode = modeSelect.value;
  if (mode.startsWith("ttt")) {
    const s = tttSnapshots.pop();
    if (!s) return;
    tttBoard = [...s.board]; tttTurn = s.turn; tttOver = s.over; tttWinningCells = [...s.win];
    scoreA = s.scoreA; scoreB = s.scoreB; scoreD = s.scoreD; streak = s.streak;
    hideWinScreen();
    renderScores();
    renderTTT();
    startTurnTimer();
    persistLiveState();
    return;
  }
  const s = chessSnapshots.pop();
  if (!s) return;
  chessBoard = cloneBoard(s.board); chessTurn = s.turn; chessSelected = s.selected; chessOver = s.over;
  whiteCaptured = [...s.whiteCaptured]; blackCaptured = [...s.blackCaptured];
  scoreA = s.scoreA; scoreB = s.scoreB; scoreD = s.scoreD; streak = s.streak;
  hideWinScreen();
  renderCaptured();
  renderScores();
  renderChess();
  startTurnTimer();
  persistLiveState();
});

/* ---------- HUD Bar Events ---------- */
gameTypePills?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-game]");
  if (!btn) return;
  hubState.game = btn.dataset.game;
  modeSelect.value = modeFromHub();
  syncHud();
  persistHub();
  initBoard(true);
});

opponentPills?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-opponent]");
  if (!btn) return;
  hubState.opponent = btn.dataset.opponent;
  modeSelect.value = modeFromHub();
  syncHud();
  persistHub();
  initBoard(true);
});

difficultyPills?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-difficulty]");
  if (!btn) return;
  hubState.difficulty = btn.dataset.difficulty;
  if (difficultySelect) difficultySelect.value = hubState.difficulty;
  syncHud();
  persistHub();
  loadScores();
  if (hubState.game === "wordle") initWordle();
  persistLiveState();
});

timerPills?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-timer]");
  if (!btn) return;
  hubState.timer = btn.dataset.timer;
  syncHud();
  persistHub();
  startTurnTimer();
  persistLiveState();
});

/* ---------- Board Init ---------- */
function initBoard(forceFresh = false) {
  hideWinScreen();
  stopTurnTimer();
  clearWinLine();
  resetIdleWatchdog();

  if (!forceFresh) {
    const restored = restoreLiveStateIfAny();
    if (restored) {
      syncHud();
      if (hubState.game === "wordle") {
        tttBoardEl?.classList.add("hidden");
        chessBoardEl?.classList.add("hidden");
        wordleGameEl?.classList.remove("hidden");
      }
      startTurnTimer();
      persistHub();
      return;
    }
  }

  hubFromMode(modeSelect.value);
  if (hubState.game === "wordle") initWordle();
  else if (modeSelect.value.startsWith("ttt3")) initTTT(3);
  else if (modeSelect.value.startsWith("ttt5")) initTTT(5);
  else initChess();

  startTurnTimer();
  persistHub();
  persistLiveState();
}

/* ---------- App Boot ---------- */
function boot() {
  loadHub();

  if (!hubState.timer) hubState.timer = "off";

  if (modeSelect) modeSelect.value = modeFromHub();
  if (difficultySelect) difficultySelect.value = hubState.difficulty;
  if (themeSelect) themeSelect.value = hubState.theme;

  syncHud();
  setTheme(hubState.theme);
  loadScores();

  if (hubState.timer === "off") showTimerInactive();

  initBoard(false); // try restore live state first
  startIdleWatchdog();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}