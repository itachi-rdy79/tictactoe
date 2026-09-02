const modeSelect = document.getElementById("modeSelect");
const difficultySelect = document.getElementById("difficultySelect");
const themeSelect = document.getElementById("themeSelect");

const gameTypePills = document.getElementById("gameTypePills");
const opponentPills = document.getElementById("opponentPills");
const difficultyPills = document.getElementById("difficultyPills");
const difficultyGroup = document.getElementById("difficultyGroup");
const timerPills = document.getElementById("timerPills");

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

const hubState = {
  game: "ttt3",
  opponent: "ai",
  difficulty: "medium",
  timer: "off", // Strictly Off by default
  theme: "dark"
};

let scoreA = 0, scoreB = 0, scoreD = 0, streak = 0;

/* ---------- State Management ---------- */
function modeFromHub() {
  if (hubState.game === "ttt3") return hubState.opponent === "ai" ? "ttt3-ai" : "ttt3-2p";
  if (hubState.game === "ttt5") return hubState.opponent === "ai" ? "ttt5-ai" : "ttt5-2p";
  return hubState.opponent === "ai" ? "chess-ai" : "chess-2p";
}

function hubFromMode(mode) {
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
  localStorage.setItem("hubState", JSON.stringify(hubState));
  const hash = `#/${hubState.game}?vs=${hubState.opponent}&diff=${hubState.difficulty}&timer=${hubState.timer}&theme=${hubState.theme}`;
  history.replaceState(null, "", hash);
}

function loadHub() {
  const saved = JSON.parse(localStorage.getItem("hubState") || "null");
  if (saved) Object.assign(hubState, saved);

  // Strictly allowed timer values: Off, 30, 60, 90
  if (!["off", "30", "60", "90"].includes(hubState.timer)) hubState.timer = "off";
  if (!["dark", "light", "itachi"].includes(hubState.theme)) hubState.theme = "dark";
  if (!["easy", "medium", "hard"].includes(hubState.difficulty)) hubState.difficulty = "medium";
  if (!["ai", "local"].includes(hubState.opponent)) hubState.opponent = "ai";
  if (!["ttt3", "ttt5", "chess"].includes(hubState.game)) hubState.game = "ttt3";
}

function syncHud() {
  setActive(gameTypePills, "game", hubState.game);
  setActive(opponentPills, "opponent", hubState.opponent);
  setActive(difficultyPills, "difficulty", hubState.difficulty);
  setActive(timerPills, "timer", hubState.timer);

  // Keep difficulty visible but disabled on local mode to prevent layout jumps
  difficultyGroup.classList.toggle("disabled", hubState.opponent !== "ai");
}

/* ---------- Theme Handling ---------- */
function themeMeta(theme) {
  if (theme === "light") return { icon: "🌊", text: "Ocean" };
  if (theme === "itachi") return { icon: "✇", text: "Itachi" };
  return { icon: "🌙", text: "Dark" };
}

function setTheme(theme) {
  hubState.theme = theme;
  themeSelect.value = theme;
  document.body.setAttribute("data-theme", theme);
  const m = themeMeta(theme);
  themeCurrentIcon.textContent = m.icon;
  themeCurrentText.textContent = m.text;
  themeMenu.querySelectorAll(".theme-item").forEach(b => b.classList.toggle("active", b.dataset.theme === theme));
  persistHub();
}

themeTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  themePicker.classList.toggle("open");
});

themeMenu.addEventListener("click", (e) => {
  const b = e.target.closest(".theme-item");
  if (!b) return;
  setTheme(b.dataset.theme);
  themePicker.classList.remove("open");
});

document.addEventListener("click", () => themePicker.classList.remove("open"));

/* ---------- Score Tracking ---------- */
function scoreKey() { return `scores_${modeSelect.value}_${difficultySelect.value}`; }

function renderScores() {
  scoreAEl.textContent = scoreA;
  scoreBEl.textContent = scoreB;
  scoreDEl.textContent = scoreD;
  streakBadge.textContent = `🔥 Streak: ${streak}`;
}

function persistScores() {
  localStorage.setItem(scoreKey(), JSON.stringify({ scoreA, scoreB, scoreD, streak }));
}

function loadScores() {
  const s = JSON.parse(localStorage.getItem(scoreKey()) || "null");
  if (s) { scoreA = s.scoreA || 0; scoreB = s.scoreB || 0; scoreD = s.scoreD || 0; streak = s.streak || 0; }
  else { scoreA = scoreB = scoreD = streak = 0; }
  renderScores();
}

function updateStreak(winA) { streak = winA ? streak + 1 : 0; }

/* ---------- Timer Logic (Pure Integers, No Decimals) ---------- */
let turnTimer = null;
let turnTimeLeft = 0;
let turnTimeTotal = 0;
const CIRC = 2 * Math.PI * 50;

function stopTurnTimer() {
  if (turnTimer) clearInterval(turnTimer);
  turnTimer = null;
}

function showTimerInactive() {
  radialWrap.classList.add("hidden");
  statusPill.classList.remove("hidden");
}

function showTimerActive() {
  statusPill.classList.add("hidden");
  radialWrap.classList.remove("hidden");
}

function renderRadial() {
  if (!turnTimeTotal) return;
  const pct = Math.max(0, turnTimeLeft / turnTimeTotal);
  ringFg.style.strokeDasharray = `${CIRC}`;
  ringFg.style.strokeDashoffset = `${CIRC * (1 - pct)}`;
  // Pure whole integers only (e.g. 47, 36) - no .0 or fractional decimals
  radialText.textContent = Math.ceil(Math.max(0, turnTimeLeft));
}

function startTurnTimer() {
  stopTurnTimer();

  if (hubState.timer === "off") {
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

/* ---------- Win Modal ---------- */
function showWinScreen(msg) {
  winMessage.textContent = msg.toUpperCase();
  winOverlay.classList.remove("hidden");
}

function hideWinScreen() {
  winOverlay.classList.add("hidden");
}

winRestartBtn.addEventListener("click", () => { hideWinScreen(); initBoard(); });
winOverlay.addEventListener("click", (e) => { if (e.target === winOverlay) hideWinScreen(); });

/* ---------- Tic-Tac-Toe ---------- */
let tttBoard = [], tttSize = 3, tttWinLen = 3, tttTurn = "X", tttOver = false, tttWinningCells = [];
let tttSnapshots = [];

function clearWinLine() { winLineSvg.innerHTML = ""; }

function drawWinLineTTT(line) {
  if (!line.length) return;
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
  tttBoardEl.classList.remove("hidden");
  chessBoardEl.classList.add("hidden");
  capturedTop.classList.add("hidden");
  capturedBottom.classList.add("hidden");

  tttBoardEl.innerHTML = "";
  tttBoardEl.style.gridTemplateColumns = `repeat(${tttSize}, minmax(62px, 1fr))`;

  tttBoard.forEach((v, i) => {
    const cell = document.createElement("button");
    cell.className = "ttt-cell";
    if (v === "X") cell.classList.add("x");
    if (v === "O") cell.classList.add("o");
    if (tttWinningCells.includes(i)) cell.classList.add("win");
    cell.textContent = v || "";
    cell.dataset.ghost = tttTurn;
    cell.addEventListener("mouseenter", () => {
      const ai = modeSelect.value.endsWith("-ai");
      if (!v && !tttOver && !(ai && tttTurn === "O")) cell.classList.add("ghost");
    });
    cell.addEventListener("mouseleave", () => cell.classList.remove("ghost"));
    cell.addEventListener("click", () => onTTTClick(i));
    tttBoardEl.appendChild(cell);
  });

  const r = getTTTResult(tttBoard);
  if (hubState.timer === "off") {
    statusPill.textContent = r.winner === "draw" ? "Draw" : r.winner ? `${r.winner} Wins` : `${tttTurn}'s Turn`;
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
}

function finishTTT(winner, line) {
  stopTurnTimer();
  tttOver = true;
  tttWinningCells = [...line];
  drawWinLineTTT(line);

  const aiMode = modeSelect.value.endsWith("-ai");
  if (winner === "X") { scoreA++; updateStreak(aiMode); showWinScreen(aiMode ? "You Win!" : "X Wins!"); }
  else if (winner === "O") { scoreB++; updateStreak(false); showWinScreen(aiMode ? "Computer Wins!" : "O Wins!"); }
  else { scoreD++; showWinScreen("Draw"); }

  persistScores();
  renderScores();
  renderTTT();
}

function onTTTClick(i) {
  const aiMode = modeSelect.value.endsWith("-ai");
  if (tttOver || tttBoard[i]) return;
  if (aiMode && tttTurn === "O") return;

  saveTTTSnapshot();
  tttBoard[i] = tttTurn;
  const r = getTTTResult(tttBoard);
  if (r.winner) return finishTTT(r.winner, r.line);

  tttTurn = tttTurn === "X" ? "O" : "X";
  renderTTT();
  startTurnTimer();

  if (aiMode && tttTurn === "O") {
    if (hubState.timer === "off") statusPill.textContent = "AI Thinking...";
    setTimeout(aiTTTMove, difficultySelect.value === "easy" ? 260 : difficultySelect.value === "medium" ? 500 : 760);
  }
}

/* ---------- Chess ---------- */
let chessBoard = [], chessTurn = "w", chessSelected = null, chessOver = false, whiteCaptured = [], blackCaptured = [], chessSnapshots = [];
const CHESS_U = { wp: "♙", wr: "♖", wn: "♘", wb: "♗", wq: "♕", wk: "♔", bp: "♟", br: "✜", bn: "♞", bb: "♝", bq: "♛", bk: "♚" };
const PIECE_VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function cloneBoard(b) { return b.map(row => row.map(cell => cell ? { ...cell } : null)); }
function saveChessSnapshot() { chessSnapshots.push({ board: cloneBoard(chessBoard), turn: chessTurn, selected: chessSelected ? { ...chessSelected } : null, over: chessOver, whiteCaptured: [...whiteCaptured], blackCaptured: [...blackCaptured], scoreA, scoreB, scoreD, streak }); }

function initChess() {
  chessBoard = Array.from({ length: 8 }, () => Array(8).fill(null));
  const back = ["r", "n", "b", "q", "k", "b", "n", "r"];
  for (let c = 0; c < 8; c++) {
    chessBoard[0][c] = { color: "b", type: back[c] };
    chessBoard[1][c] = { color: "b", type: "p" };
    chessBoard[6][c] = { color: "w", type: "p" };
    chessBoard[7][c] = { color: "w", type: back[c] };
  }
  chessTurn = "w";
  chessSelected = null;
  chessOver = false;
  whiteCaptured = [];
  blackCaptured = [];
  chessSnapshots = [];
  renderCaptured();
  renderChess();
  startTurnTimer();
}

function renderCaptured() {
  whiteCapturedEl.textContent = whiteCaptured.map(p => CHESS_U[p.color + p.type]).join(" ");
  blackCapturedEl.textContent = blackCaptured.map(p => CHESS_U[p.color + p.type]).join(" ");
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
  clearWinLine();
  tttBoardEl.classList.add("hidden");
  chessBoardEl.classList.remove("hidden");
  capturedTop.classList.remove("hidden");
  capturedBottom.classList.remove("hidden");

  chessBoardEl.innerHTML = "";
  const hints = chessSelected ? getPseudoMoves(chessBoard, chessSelected.r, chessSelected.c) : [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const cell = document.createElement("div");
    cell.className = "chess-cell " + (((r + c) % 2 === 0) ? "light" : "dark");
    if (chessSelected && chessSelected.r === r && chessSelected.c === c) cell.classList.add("selected");
    if (hints.some(m => m.r === r && m.c === c)) cell.classList.add("hint");
    const p = chessBoard[r][c];
    cell.textContent = p ? CHESS_U[p.color + p.type] : "";
    cell.addEventListener("click", () => onChessClick(r, c));
    chessBoardEl.appendChild(cell);
  }

  if (hubState.timer === "off") {
    statusPill.textContent = chessOver ? "Game Over" : `${chessTurn === "w" ? "White" : "Black"}'s Turn`;
  }
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
  if (chessOver) { renderChess(); stopTurnTimer(); return; }

  chessSelected = null;
  chessTurn = chessTurn === "w" ? "b" : "w";
  renderChess();
  startTurnTimer();

  if (aiMode && chessTurn === "b" && !chessOver) {
    if (hubState.timer === "off") statusPill.textContent = "AI Thinking...";
    setTimeout(() => {
      saveChessSnapshot();
      const depth = difficultySelect.value === "easy" ? 1 : difficultySelect.value === "medium" ? 2 : 3;
      const res = minimaxChess(chessBoard, depth, -Infinity, Infinity, true);
      const mv = res.move || allMovesForColor(chessBoard, "b")[0];
      if (mv) { moveChess(chessBoard, mv, true); if (!chessOver) chessTurn = "w"; }
      renderChess();
      startTurnTimer();
    }, 500);
  }
}

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
  }
}

/* ---------- Controls Event Listeners ---------- */
newGameBtn.addEventListener("click", initBoard);
resetScoreBtn.addEventListener("click", () => {
  scoreA = 0; scoreB = 0; scoreD = 0; streak = 0;
  persistScores();
  renderScores();
});

undoBtn.addEventListener("click", () => {
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
});

/* ---------- HUD Bar Events ---------- */
gameTypePills.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-game]");
  if (!btn) return;
  hubState.game = btn.dataset.game;
  modeSelect.value = modeFromHub();
  syncHud();
  persistHub();
  initBoard();
});

opponentPills.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-opponent]");
  if (!btn) return;
  hubState.opponent = btn.dataset.opponent;
  modeSelect.value = modeFromHub();
  syncHud();
  persistHub();
  initBoard();
});

difficultyPills.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-difficulty]");
  if (!btn) return;
  hubState.difficulty = btn.dataset.difficulty;
  difficultySelect.value = hubState.difficulty;
  syncHud();
  persistHub();
  loadScores();
});

timerPills.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-timer]");
  if (!btn) return;
  hubState.timer = btn.dataset.timer;
  syncHud();
  persistHub();
  startTurnTimer();
});

function initBoard() {
  hideWinScreen();
  stopTurnTimer();
  clearWinLine();

  hubFromMode(modeSelect.value);
  if (modeSelect.value.startsWith("ttt3")) initTTT(3);
  else if (modeSelect.value.startsWith("ttt5")) initTTT(5);
  else initChess();

  startTurnTimer();
  persistHub();
}

/* ---------- App Initialization ---------- */
(function boot() {
  loadHub();

  if (!hubState.timer) hubState.timer = "off";

  modeSelect.value = modeFromHub();
  difficultySelect.value = hubState.difficulty;
  themeSelect.value = hubState.theme;

  syncHud();
  setTheme(hubState.theme);
  loadScores();

  if (hubState.timer === "off") showTimerInactive();

  initBoard();
})();