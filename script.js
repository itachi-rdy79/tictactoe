const modeSelect = document.getElementById("modeSelect");
const difficultySelect = document.getElementById("difficultySelect");
const themeSelect = document.getElementById("themeSelect");
const newGameBtn = document.getElementById("newGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const undoBtn = document.getElementById("undoBtn");

const modeChip = document.getElementById("modeChip");
const statusEl = document.getElementById("status");
const thinkingEl = document.getElementById("thinking");
const boardWrap = document.getElementById("boardWrap");

const tttBoardEl = document.getElementById("tttBoard");
const chessBoardEl = document.getElementById("chessBoard");
const capturedPanel = document.getElementById("capturedPanel");
const whiteCapturedEl = document.getElementById("whiteCaptured");
const blackCapturedEl = document.getElementById("blackCaptured");

const scoreAEl = document.getElementById("scoreA");
const scoreBEl = document.getElementById("scoreB");
const scoreDEl = document.getElementById("scoreD");
const streakBadge = document.getElementById("streakBadge");

const winOverlay = document.getElementById("winOverlay");
const winMessage = document.getElementById("winMessage");
const winRestartBtn = document.getElementById("winRestartBtn");

const historyList = document.getElementById("historyList");

const timerWrap = document.getElementById("timerWrap");
const timerFill = document.getElementById("timerFill");

const winLineSvg = document.getElementById("tttWinLine");

const gameTypePills = document.getElementById("gameTypePills");
const opponentPills = document.getElementById("opponentPills");
const difficultyPills = document.getElementById("difficultyPills");
const timerPills = document.getElementById("timerPills");
const difficultyRow = document.getElementById("difficultyRow");

/* =======================================================
   APP STATE / HUB
======================================================= */
const hubState = {
  game: "ttt3",       // ttt3 | ttt5 | chess
  opponent: "ai",     // ai | local
  difficulty: "medium",
  timer: "off",       // off | 5 | 10
  theme: "dark"
};

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

function setActive(groupEl, key, value) {
  if (!groupEl) return;
  groupEl.querySelectorAll(".pill").forEach(btn => {
    btn.classList.toggle("active", btn.dataset[key] === value);
  });
}
function syncHubVisuals() {
  setActive(gameTypePills, "game", hubState.game);
  setActive(opponentPills, "opponent", hubState.opponent);
  setActive(difficultyPills, "difficulty", hubState.difficulty);
  setActive(timerPills, "timer", hubState.timer);
  if (difficultyRow) difficultyRow.classList.toggle("disabled", hubState.opponent === "local");
}

function updateURLFromState() {
  const g = hubState.game === "chess" ? "chess" : hubState.game;
  const hash = `#/${g}?vs=${hubState.opponent}&diff=${hubState.difficulty}&timer=${hubState.timer}&theme=${hubState.theme}`;
  history.replaceState(null, "", hash);
}
function applyStateFromURL() {
  const raw = location.hash || "";
  if (!raw.startsWith("#/")) return;

  const [path, query = ""] = raw.slice(2).split("?");
  if (["ttt3", "ttt5", "chess"].includes(path)) hubState.game = path;

  const q = new URLSearchParams(query);
  const vs = q.get("vs");
  const diff = q.get("diff");
  const timer = q.get("timer");
  const theme = q.get("theme");

  if (["ai", "local"].includes(vs)) hubState.opponent = vs;
  if (["easy", "medium", "hard"].includes(diff)) hubState.difficulty = diff;
  if (["off", "5", "10"].includes(timer)) hubState.timer = timer;
  if (["dark", "light", "itachi"].includes(theme)) hubState.theme = theme;
}
function persistHub() {
  localStorage.setItem("hubState", JSON.stringify(hubState));
  updateURLFromState();
}
function loadHub() {
  const saved = JSON.parse(localStorage.getItem("hubState") || "null");
  if (saved) Object.assign(hubState, saved);
  applyStateFromURL();
}

/* =======================================================
   THEME
======================================================= */
function syncThemeLabel() {
  const themeValueText = document.getElementById("themeValueText");
  const selected = themeSelect.options[themeSelect.selectedIndex];
  if (themeValueText && selected) themeValueText.textContent = selected.textContent;
}
function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  hubState.theme = theme;
  syncThemeLabel();
  persistHub();
}
themeSelect.addEventListener("change", () => setTheme(themeSelect.value));

/* =======================================================
   SCORE / STATS
======================================================= */
let scoreA = 0;
let scoreB = 0;
let scoreD = 0;
let streak = 0;

function scoreKey() {
  return `scores_${modeSelect.value}_${difficultySelect.value}`;
}
function renderScores() {
  scoreAEl.textContent = scoreA;
  scoreBEl.textContent = scoreB;
  scoreDEl.textContent = scoreD;
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
function updateStreak(winForPlayerA) {
  streak = winForPlayerA ? streak + 1 : 0;
}

/* =======================================================
   WIN OVERLAY
======================================================= */
function showWinScreen(message) {
  winMessage.textContent = message.toUpperCase();
  winOverlay.classList.remove("hidden");
  winOverlay.classList.remove("show-banner");
  void winOverlay.offsetWidth;
  winOverlay.classList.add("show-banner");
}
function hideWinScreen() {
  winOverlay.classList.add("hidden");
  winOverlay.classList.remove("show-banner");
}
winRestartBtn.addEventListener("click", () => {
  hideWinScreen();
  initBoard();
});
winOverlay.addEventListener("click", (e) => {
  if (e.target === winOverlay) hideWinScreen();
});

/* =======================================================
   MOVE HISTORY
======================================================= */
let moveHistory = [];
function addHistory(text) {
  moveHistory.push(text);
  const pill = document.createElement("span");
  pill.className = "history-pill";
  pill.textContent = text;
  historyList.appendChild(pill);
  historyList.scrollTop = historyList.scrollHeight;
}
function rebuildHistory() {
  historyList.innerHTML = "";
  moveHistory.forEach(h => {
    const pill = document.createElement("span");
    pill.className = "history-pill";
    pill.textContent = h;
    historyList.appendChild(pill);
  });
}
function clearHistory() {
  moveHistory = [];
  rebuildHistory();
}

/* =======================================================
   TIMER
======================================================= */
let turnTimer = null;
let turnTimeLeft = 0;

function stopTurnTimer() {
  if (turnTimer) clearInterval(turnTimer);
  turnTimer = null;
}
function startTurnTimer() {
  stopTurnTimer();

  if (hubState.timer === "off") {
    if (timerWrap) timerWrap.style.display = "none";
    return;
  }

  if (timerWrap) timerWrap.style.display = "block";
  turnTimeLeft = Number(hubState.timer);
  if (timerFill) timerFill.style.width = "100%";

  turnTimer = setInterval(() => {
    turnTimeLeft -= 0.1;
    const pct = Math.max(0, (turnTimeLeft / Number(hubState.timer)) * 100);
    if (timerFill) timerFill.style.width = pct + "%";

    if (turnTimeLeft <= 0) {
      stopTurnTimer();
      onTimerExpired();
    }
  }, 100);
}
function onTimerExpired() {
  const mode = modeSelect.value;

  if (mode.startsWith("ttt")) {
    const empties = getEmptyCells(tttBoard);
    if (!empties.length || tttOver) return;
    onTTTClick(empties[Math.floor(Math.random() * empties.length)]);
    return;
  }

  if (mode.startsWith("chess") && !chessOver) {
    const side = chessTurn;
    const moves = allMovesForColor(chessBoard, side);
    if (!moves.length) return;
    const mv = moves[Math.floor(Math.random() * moves.length)];
    moveChess(chessBoard, mv, true);
    chessTurn = chessTurn === "w" ? "b" : "w";
    renderChess();
    startTurnTimer();
  }
}

/* =======================================================
   TIC TAC TOE
======================================================= */
let tttBoard = [];
let tttSize = 3;
let tttWinLen = 3;
let tttTurn = "X";
let tttOver = false;
let tttWinningCells = [];
let tttSnapshots = [];

function clearWinLine() {
  if (winLineSvg) winLineSvg.innerHTML = "";
}
function drawWinLineTTT(line) {
  if (!winLineSvg || !line.length) return;

  const s = tttSize;
  const first = line[0];
  const last = line[line.length - 1];

  const fr = Math.floor(first / s), fc = first % s;
  const lr = Math.floor(last / s), lc = last % s;

  const x1 = ((fc + 0.5) / s) * 100;
  const y1 = ((fr + 0.5) / s) * 100;
  const x2 = ((lc + 0.5) / s) * 100;
  const y2 = ((lr + 0.5) / s) * 100;

  winLineSvg.innerHTML = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>`;
}

function buildTTTLines(size, len) {
  const lines = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - len; c++) {
      const line = [];
      for (let k = 0; k < len; k++) line.push(r * size + (c + k));
      lines.push(line);
    }
  }

  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - len; r++) {
      const line = [];
      for (let k = 0; k < len; k++) line.push((r + k) * size + c);
      lines.push(line);
    }
  }

  for (let r = 0; r <= size - len; r++) {
    for (let c = 0; c <= size - len; c++) {
      const line = [];
      for (let k = 0; k < len; k++) line.push((r + k) * size + (c + k));
      lines.push(line);
    }
  }

  for (let r = 0; r <= size - len; r++) {
    for (let c = len - 1; c < size; c++) {
      const line = [];
      for (let k = 0; k < len; k++) line.push((r + k) * size + (c - k));
      lines.push(line);
    }
  }

  return lines;
}

function getTTTResult(board, size = tttSize, winLen = tttWinLen) {
  const lines = buildTTTLines(size, winLen);

  for (const line of lines) {
    const first = board[line[0]];
    if (!first) continue;
    if (line.every(i => board[i] === first)) return { winner: first, line };
  }

  if (board.every(Boolean)) return { winner: "draw", line: [] };
  return { winner: null, line: [] };
}

function getEmptyCells(board) {
  const arr = [];
  for (let i = 0; i < board.length; i++) if (!board[i]) arr.push(i);
  return arr;
}

function tttToHuman(i) {
  const r = Math.floor(i / tttSize);
  const c = i % tttSize;
  return `r${r + 1}c${c + 1}`;
}

function saveTTTSnapshot() {
  tttSnapshots.push({
    board: [...tttBoard],
    turn: tttTurn,
    over: tttOver,
    win: [...tttWinningCells],
    history: [...moveHistory],
    scoreA, scoreB, scoreD, streak
  });
}

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
  tttBoardEl.style.display = "grid";
  chessBoardEl.style.display = "none";
  capturedPanel.style.display = "none";

  tttBoardEl.innerHTML = "";
  tttBoardEl.style.gridTemplateColumns = `repeat(${tttSize}, minmax(62px, 1fr))`;

  tttBoard.forEach((v, i) => {
    const cell = document.createElement("button");
    cell.className = "ttt-cell";
    if (v === "X") cell.classList.add("x", "placed");
    if (v === "O") cell.classList.add("o", "placed");
    if (tttWinningCells.includes(i)) cell.classList.add("win");
    cell.textContent = v || "";
    cell.dataset.ghost = tttTurn;

    cell.addEventListener("mouseenter", () => {
      const aiMode = modeSelect.value === "ttt3-ai" || modeSelect.value === "ttt5-ai";
      if (!v && !tttOver && !(aiMode && tttTurn === "O")) cell.classList.add("ghost");
    });
    cell.addEventListener("mouseleave", () => cell.classList.remove("ghost"));
    cell.addEventListener("click", () => onTTTClick(i));

    tttBoardEl.appendChild(cell);
  });

  const res = getTTTResult(tttBoard);
  if (res.winner === "draw") statusEl.textContent = "Tic-Tac-Toe: Draw!";
  else if (res.winner) statusEl.textContent = `Tic-Tac-Toe: ${res.winner} wins!`;
  else statusEl.textContent = `Tic-Tac-Toe: ${tttTurn}'s turn`;
}

function tttAIDelay(diff) {
  if (diff === "easy") return 260;
  if (diff === "medium") return 500;
  return 760;
}

function evaluate5x5Board(board, size, winLen) {
  const lines = buildTTTLines(size, winLen);
  let score = 0;

  for (const line of lines) {
    let x = 0, o = 0;
    for (const idx of line) {
      if (board[idx] === "X") x++;
      else if (board[idx] === "O") o++;
    }
    if (x && o) continue;
    if (!x && !o) continue;
    if (o) score += Math.pow(10, o);
    if (x) score -= Math.pow(10, x);
  }

  if (size === 5) {
    if (board[12] === "O") score += 25;
    if (board[12] === "X") score -= 25;
  }

  return score;
}

function minimaxTTT(board, size, winLen, depth, isMaximizing, alpha, beta) {
  const res = getTTTResult(board, size, winLen);

  if (res.winner === "O") return { score: 100000 + depth };
  if (res.winner === "X") return { score: -100000 - depth };
  if (res.winner === "draw") return { score: 0 };
  if (depth === 0) return { score: evaluate5x5Board(board, size, winLen) };

  const empties = getEmptyCells(board);

  if (isMaximizing) {
    let best = { score: -Infinity, move: null };
    for (const i of empties) {
      board[i] = "O";
      const result = minimaxTTT(board, size, winLen, depth - 1, false, alpha, beta);
      board[i] = null;
      if (result.score > best.score) best = { score: result.score, move: i };
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) break;
    }
    return best;
  }

  let best = { score: Infinity, move: null };
  for (const i of empties) {
    board[i] = "X";
    const result = minimaxTTT(board, size, winLen, depth - 1, true, alpha, beta);
    board[i] = null;
    if (result.score < best.score) best = { score: result.score, move: i };
    beta = Math.min(beta, result.score);
    if (beta <= alpha) break;
  }
  return best;
}

function pickMoveWithLookahead() {
  const diff = difficultySelect.value;
  const empties = getEmptyCells(tttBoard);

  if (diff === "easy" && Math.random() < 0.55) {
    return empties[Math.floor(Math.random() * empties.length)];
  }

  for (const i of empties) {
    tttBoard[i] = "O";
    if (getTTTResult(tttBoard).winner === "O") {
      tttBoard[i] = null;
      return i;
    }
    tttBoard[i] = null;
  }

  for (const i of empties) {
    tttBoard[i] = "X";
    if (getTTTResult(tttBoard).winner === "X") {
      tttBoard[i] = null;
      return i;
    }
    tttBoard[i] = null;
  }

  if (tttSize === 3) {
    let depth = empties.length;
    if (diff === "medium") depth = Math.min(empties.length, 7);
    if (diff === "easy") depth = Math.min(empties.length, 3);
    const best = minimaxTTT(tttBoard, tttSize, tttWinLen, depth, true, -Infinity, Infinity);
    if (best.move != null) return best.move;
  }

  if (tttSize === 5) {
    const depth = diff === "easy" ? 1 : diff === "medium" ? 2 : 3;
    const best = minimaxTTT(tttBoard, tttSize, tttWinLen, depth, true, -Infinity, Infinity);
    if (best.move != null) return best.move;
  }

  return empties[Math.floor(Math.random() * empties.length)];
}

function doTTTAIMove() {
  if (tttOver) return;
  const empties = getEmptyCells(tttBoard);
  if (!empties.length) return;

  saveTTTSnapshot();

  const chosen = pickMoveWithLookahead();
  tttBoard[chosen] = "O";
  addHistory(`${moveHistory.length + 1}. O@${tttToHuman(chosen)}`);

  const res = getTTTResult(tttBoard);
  if (res.winner) {
    finishTTT(res.winner, res.line);
    return;
  }

  tttTurn = "X";
  renderTTT();
  startTurnTimer();
}

function finishTTT(winner, line) {
  stopTurnTimer();
  tttOver = true;
  tttWinningCells = [...line];
  drawWinLineTTT(line);

  const aiMode = modeSelect.value === "ttt3-ai" || modeSelect.value === "ttt5-ai";

  if (winner === "X") {
    scoreA++;
    updateStreak(aiMode ? true : false);
    showWinScreen(aiMode ? "You Win!" : "Player X Wins!");
  } else if (winner === "O") {
    scoreB++;
    updateStreak(false);
    showWinScreen(aiMode ? "Computer Wins!" : "Player O Wins!");
  } else {
    scoreD++;
    showWinScreen("It's a Draw!");
  }

  persistScores();
  renderScores();
  renderTTT();
}

function onTTTClick(i) {
  const mode = modeSelect.value;
  const aiMode = mode === "ttt3-ai" || mode === "ttt5-ai";

  if (tttOver || tttBoard[i]) return;
  if (aiMode && tttTurn === "O") return;

  saveTTTSnapshot();

  tttBoard[i] = tttTurn;
  addHistory(`${moveHistory.length + 1}. ${tttTurn}@${tttToHuman(i)}`);

  const res = getTTTResult(tttBoard);
  if (res.winner) {
    finishTTT(res.winner, res.line);
    return;
  }

  tttTurn = tttTurn === "X" ? "O" : "X";
  renderTTT();
  startTurnTimer();

  if (aiMode && tttTurn === "O") {
    thinkingEl.style.display = "flex";
    boardWrap.classList.add("ai-thinking");
    setTimeout(() => {
      doTTTAIMove();
      thinkingEl.style.display = "none";
      boardWrap.classList.remove("ai-thinking");
    }, tttAIDelay(difficultySelect.value));
  }
}

/* =======================================================
   CHESS
======================================================= */
let chessBoard = [];
let chessTurn = "w";
let chessSelected = null;
let chessOver = false;
let whiteCaptured = [];
let blackCaptured = [];
let chessSnapshots = [];

const CHESS_U = {
  wp: "♙", wr: "♖", wn: "♘", wb: "♗", wq: "♕", wk: "♔",
  bp: "♟", br: "♜", bn: "♞", bb: "♝", bq: "♛", bk: "♚"
};
const PIECE_VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function cloneBoard(board) {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
}
function chessToHuman(mv) {
  const file = c => String.fromCharCode(97 + c);
  return `${file(mv.fc)}${8 - mv.fr}-${file(mv.tc)}${8 - mv.tr}`;
}

function saveChessSnapshot() {
  chessSnapshots.push({
    board: cloneBoard(chessBoard),
    turn: chessTurn,
    selected: chessSelected ? { ...chessSelected } : null,
    over: chessOver,
    whiteCaptured: [...whiteCaptured],
    blackCaptured: [...blackCaptured],
    history: [...moveHistory],
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
  const moves = [];

  const add = (nr, nc) => {
    if (!inBounds(nr, nc)) return;
    const t = board[nr][nc];
    if (!t || t.color !== p.color) moves.push({ r: nr, c: nc });
  };

  if (p.type === "p") {
    const dir = p.color === "w" ? -1 : 1;
    const start = p.color === "w" ? 6 : 1;

    if (inBounds(r + dir, c) && !board[r + dir][c]) moves.push({ r: r + dir, c });
    if (r === start && !board[r + dir][c] && !board[r + 2 * dir][c]) moves.push({ r: r + 2 * dir, c });

    for (const dc of [-1, 1]) {
      const nr = r + dir, nc = c + dc;
      if (inBounds(nr, nc) && board[nr][nc] && board[nr][nc].color !== p.color) {
        moves.push({ r: nr, c: nc });
      }
    }
  } else if (p.type === "n") {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => add(r + dr, c + dc));
  } else if (p.type === "k") {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (dr || dc) add(r + dr, c + dc);
  } else {
    const dirs = [];
    if (p.type === "b" || p.type === "q") dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
    if (p.type === "r" || p.type === "q") dirs.push([-1,0],[1,0],[0,-1],[0,1]);

    for (const [dr, dc] of dirs) {
      let nr = r + dr, nc = c + dc;
      while (inBounds(nr, nc)) {
        if (!board[nr][nc]) {
          moves.push({ r: nr, c: nc });
        } else {
          if (board[nr][nc].color !== p.color) moves.push({ r: nr, c: nc });
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
  }

  return moves;
}

function renderChess() {
  clearWinLine();
  tttBoardEl.style.display = "none";
  chessBoardEl.style.display = "grid";
  capturedPanel.style.display = "block";

  chessBoardEl.innerHTML = "";
  const hints = chessSelected ? getPseudoMoves(chessBoard, chessSelected.r, chessSelected.c) : [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = document.createElement("div");
      cell.className = "chess-cell " + (((r + c) % 2 === 0) ? "light" : "dark");

      if (chessSelected && chessSelected.r === r && chessSelected.c === c) cell.classList.add("selected");
      if (hints.some(m => m.r === r && m.c === c)) cell.classList.add("hint");

      const p = chessBoard[r][c];
      cell.textContent = p ? CHESS_U[p.color + p.type] : "";
      cell.addEventListener("click", () => onChessClick(r, c));
      chessBoardEl.appendChild(cell);
    }
  }

  statusEl.textContent = chessOver
    ? "Chess: Game Over"
    : `Chess: ${chessTurn === "w" ? "White" : "Black"} to move`;
}

function moveChess(board, mv, realMove = false) {
  const piece = board[mv.fr][mv.fc];
  const target = board[mv.tr][mv.tc];

  if (target && realMove) {
    if (target.color === "w") whiteCaptured.push(target);
    else blackCaptured.push(target);

    if (target.type === "k") {
      chessOver = true;

      if (piece.color === "w") {
        scoreA++;
        updateStreak(modeSelect.value === "chess-ai");
        showWinScreen("White Wins!");
      } else {
        scoreB++;
        updateStreak(false);
        showWinScreen("Black Wins!");
      }

      persistScores();
      renderScores();
    }

    renderCaptured();
  }

  board[mv.tr][mv.tc] = piece;
  board[mv.fr][mv.fc] = null;
  if (piece.type === "p" && (mv.tr === 0 || mv.tr === 7)) piece.type = "q";
}

function allMovesForColor(board, color) {
  const out = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.color !== color) continue;
      getPseudoMoves(board, r, c).forEach(m => out.push({ fr: r, fc: c, tr: m.r, tc: m.c }));
    }
  }
  return out;
}

function evalChess(board) {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      score += (p.color === "b" ? 1 : -1) * PIECE_VAL[p.type];
    }
  }
  return score;
}

function minimaxChess(board, depth, alpha, beta, maximizing) {
  if (depth === 0) return { score: evalChess(board), move: null };

  const color = maximizing ? "b" : "w";
  const moves = allMovesForColor(board, color);
  if (!moves.length) return { score: evalChess(board), move: null };

  let bestMove = null;

  if (maximizing) {
    let best = -Infinity;
    for (const mv of moves) {
      const b2 = cloneBoard(board);
      moveChess(b2, mv, false);
      const res = minimaxChess(b2, depth - 1, alpha, beta, false);
      if (res.score > best) {
        best = res.score;
        bestMove = mv;
      }
      alpha = Math.max(alpha, res.score);
      if (beta <= alpha) break;
    }
    return { score: best, move: bestMove };
  }

  let best = Infinity;
  for (const mv of moves) {
    const b2 = cloneBoard(board);
    moveChess(b2, mv, false);
    const res = minimaxChess(b2, depth - 1, alpha, beta, true);
    if (res.score < best) {
      best = res.score;
      bestMove = mv;
    }
    beta = Math.min(beta, res.score);
    if (beta <= alpha) break;
  }
  return { score: best, move: bestMove };
}

function chessDepth() {
  const d = difficultySelect.value;
  if (d === "easy") return 1;
  if (d === "medium") return 2;
  return 3;
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
    if (p && p.color === chessTurn) chessSelected = { r, c };
    else chessSelected = null;
    renderChess();
    return;
  }

  saveChessSnapshot();

  const mv = { fr: chessSelected.r, fc: chessSelected.c, tr: r, tc: c };
  moveChess(chessBoard, mv, true);
  addHistory(`${moveHistory.length + 1}. ${chessToHuman(mv)}`);

  if (chessOver) {
    renderChess();
    stopTurnTimer();
    return;
  }

  chessSelected = null;
  chessTurn = chessTurn === "w" ? "b" : "w";
  renderChess();
  startTurnTimer();

  if (aiMode && chessTurn === "b" && !chessOver) {
    thinkingEl.style.display = "flex";
    boardWrap.classList.add("ai-thinking");

    setTimeout(() => {
      saveChessSnapshot();

      const res = minimaxChess(chessBoard, chessDepth(), -Infinity, Infinity, true);
      const aiMove = res.move || allMovesForColor(chessBoard, "b")[0];

      if (aiMove) {
        moveChess(chessBoard, aiMove, true);
        addHistory(`${moveHistory.length + 1}. ${chessToHuman(aiMove)}`);
        if (!chessOver) chessTurn = "w";
      }

      thinkingEl.style.display = "none";
      boardWrap.classList.remove("ai-thinking");
      renderChess();
      startTurnTimer();
    }, tttAIDelay(difficultySelect.value));
  }
}

/* =======================================================
   UNDO
======================================================= */
undoBtn.addEventListener("click", () => {
  const mode = modeSelect.value;

  if (mode.startsWith("ttt")) {
    const snap = tttSnapshots.pop();
    if (!snap) return;

    tttBoard = [...snap.board];
    tttTurn = snap.turn;
    tttOver = snap.over;
    tttWinningCells = [...snap.win];
    moveHistory = [...snap.history];
    scoreA = snap.scoreA;
    scoreB = snap.scoreB;
    scoreD = snap.scoreD;
    streak = snap.streak;

    rebuildHistory();
    renderScores();
    hideWinScreen();
    clearWinLine();
    renderTTT();
    persistScores();
    startTurnTimer();
    return;
  }

  const snap = chessSnapshots.pop();
  if (!snap) return;

  chessBoard = cloneBoard(snap.board);
  chessTurn = snap.turn;
  chessSelected = snap.selected;
  chessOver = snap.over;
  whiteCaptured = [...snap.whiteCaptured];
  blackCaptured = [...snap.blackCaptured];
  moveHistory = [...snap.history];
  scoreA = snap.scoreA;
  scoreB = snap.scoreB;
  scoreD = snap.scoreD;
  streak = snap.streak;

  rebuildHistory();
  renderScores();
  hideWinScreen();
  renderCaptured();
  renderChess();
  persistScores();
  startTurnTimer();
});

/* =======================================================
   CUSTOM THEME DROPDOWN
======================================================= */
function buildCustomDropdown(wrapperId, selectId, menuId, valueTextId) {
  const wrap = document.getElementById(wrapperId);
  const select = document.getElementById(selectId);
  const menu = document.getElementById(menuId);
  const valueText = document.getElementById(valueTextId);
  const btn = wrap.querySelector(".gselect-btn");

  function renderMenu() {
    menu.innerHTML = "";
    [...select.options].forEach(opt => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "gselect-item" + (opt.value === select.value ? " active" : "");
      item.textContent = opt.textContent;

      item.addEventListener("click", () => {
        select.value = opt.value;
        valueText.textContent = opt.textContent;
        wrap.classList.remove("open");
        select.dispatchEvent(new Event("change", { bubbles: true }));
        renderMenu();
      });

      menu.appendChild(item);
    });
  }

  function syncFromSelect() {
    const active = select.options[select.selectedIndex];
    valueText.textContent = active ? active.textContent : "";
    renderMenu();
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".gselect.open").forEach(el => {
      if (el !== wrap) el.classList.remove("open");
    });
    wrap.classList.toggle("open");
  });

  select.addEventListener("change", syncFromSelect);
  syncFromSelect();
}
function initCustomDropdowns() {
  buildCustomDropdown("themeWrap", "themeSelect", "themeMenu", "themeValueText");
  document.addEventListener("click", () => {
    document.querySelectorAll(".gselect.open").forEach(el => el.classList.remove("open"));
  });
}

/* =======================================================
   HUB EVENTS
======================================================= */
function syncHubToSelectsAndInit() {
  modeSelect.value = modeFromHub();
  difficultySelect.value = hubState.difficulty;
  themeSelect.value = hubState.theme;
  syncHubVisuals();
  setTheme(hubState.theme);
  initBoard();
}
function initHubPills() {
  gameTypePills?.addEventListener("click", (e) => {
    const btn = e.target.closest(".pill[data-game]");
    if (!btn) return;
    hubState.game = btn.dataset.game;
    persistHub();
    syncHubToSelectsAndInit();
  });

  opponentPills?.addEventListener("click", (e) => {
    const btn = e.target.closest(".pill[data-opponent]");
    if (!btn) return;
    hubState.opponent = btn.dataset.opponent;
    persistHub();
    syncHubToSelectsAndInit();
  });

  difficultyPills?.addEventListener("click", (e) => {
    const btn = e.target.closest(".pill[data-difficulty]");
    if (!btn) return;
    hubState.difficulty = btn.dataset.difficulty;
    persistHub();
    syncHubToSelectsAndInit();
  });

  timerPills?.addEventListener("click", (e) => {
    const btn = e.target.closest(".pill[data-timer]");
    if (!btn) return;
    hubState.timer = btn.dataset.timer;
    persistHub();
    syncHubVisuals();
    startTurnTimer();
  });
}

/* =======================================================
   MODE / INIT
======================================================= */
function updateGameSpecificUI(mode) {
  const isChess = mode.startsWith("chess");
  capturedPanel.style.display = isChess ? "block" : "none";
  tttBoardEl.style.display = isChess ? "none" : "grid";
  chessBoardEl.style.display = isChess ? "grid" : "none";
}

function initBoard() {
  hideWinScreen();
  stopTurnTimer();
  clearHistory();
  clearWinLine();
  thinkingEl.style.display = "none";
  boardWrap.classList.remove("ai-thinking");

  const mode = modeSelect.value;
  updateGameSpecificUI(mode);

  modeChip.textContent = "Mode: " + modeSelect.options[modeSelect.selectedIndex].text;
  if (difficultyRow) difficultyRow.classList.toggle("disabled", hubState.opponent === "local");

  loadScores();

  if (mode.startsWith("ttt3")) initTTT(3);
  else if (mode.startsWith("ttt5")) initTTT(5);
  else initChess();

  persistHub();
}

modeSelect.addEventListener("change", () => {
  hubFromMode(modeSelect.value);
  persistHub();
  initBoard();
});
difficultySelect.addEventListener("change", () => {
  hubState.difficulty = difficultySelect.value;
  persistHub();
  loadScores();
});
newGameBtn.addEventListener("click", initBoard);

resetScoreBtn.addEventListener("click", () => {
  scoreA = 0;
  scoreB = 0;
  scoreD = 0;
  streak = 0;
  persistScores();
  renderScores();
});

/* =======================================================
   BOOT
======================================================= */
(function boot() {
  loadHub();

  initCustomDropdowns();
  initHubPills();

  modeSelect.value = modeFromHub();
  difficultySelect.value = hubState.difficulty;
  themeSelect.value = hubState.theme || "dark";

  setTheme(themeSelect.value);
  syncHubVisuals();
  initBoard();
})();