const modeSelect = document.getElementById("modeSelect");
const difficultySelect = document.getElementById("difficultySelect");
const themeSelect = document.getElementById("themeSelect");
const newGameBtn = document.getElementById("newGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const modeChip = document.getElementById("modeChip");
const statusEl = document.getElementById("status");
const thinkingEl = document.getElementById("thinking");

const tttBoardEl = document.getElementById("tttBoard");
const chessBoardEl = document.getElementById("chessBoard");
const capturedPanel = document.getElementById("capturedPanel");
const whiteCapturedEl = document.getElementById("whiteCaptured");
const blackCapturedEl = document.getElementById("blackCaptured");

const scoreAEl = document.getElementById("scoreA");
const scoreBEl = document.getElementById("scoreB");
const scoreDEl = document.getElementById("scoreD");

const winOverlay = document.getElementById("winOverlay");
const winMessage = document.getElementById("winMessage");
const winRestartBtn = document.getElementById("winRestartBtn");

/* -------------------- GLOBAL SCORE -------------------- */
let scoreA = 0; // X / White
let scoreB = 0; // O / Black / AI
let scoreD = 0; // Draw

function renderScores() {
  scoreAEl.textContent = scoreA;
  scoreBEl.textContent = scoreB;
  scoreDEl.textContent = scoreD;
}

/* -------------------- THEME -------------------- */
function syncThemeLabel() {
  const themeValueText = document.getElementById("themeValueText");
  const selected = themeSelect.options[themeSelect.selectedIndex];
  if (themeValueText && selected) {
    themeValueText.textContent = selected.textContent;
  }
}

function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  syncThemeLabel();
}

themeSelect.addEventListener("change", () => setTheme(themeSelect.value));

/* -------------------- WIN OVERLAY -------------------- */
function showWinScreen(message) {
  winMessage.textContent = message.toUpperCase();
  winOverlay.classList.remove("hidden");
  winOverlay.classList.remove("show-banner");
  void winOverlay.offsetWidth; // restart animation
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
   TIC TAC TOE
======================================================= */
let tttBoard = [];
let tttSize = 3;
let tttWinLen = 3;
let tttTurn = "X";
let tttOver = false;
let tttWinningCells = [];

function buildTTTLines(size, len) {
  const lines = [];

  // horizontal
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - len; c++) {
      const line = [];
      for (let k = 0; k < len; k++) line.push(r * size + (c + k));
      lines.push(line);
    }
  }

  // vertical
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - len; r++) {
      const line = [];
      for (let k = 0; k < len; k++) line.push((r + k) * size + c);
      lines.push(line);
    }
  }

  // diagonal down-right
  for (let r = 0; r <= size - len; r++) {
    for (let c = 0; c <= size - len; c++) {
      const line = [];
      for (let k = 0; k < len; k++) line.push((r + k) * size + (c + k));
      lines.push(line);
    }
  }

  // diagonal down-left
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

function initTTT(size) {
  tttSize = size;
  tttWinLen = size === 3 ? 3 : 4; // 5x5 uses connect-4
  tttBoard = Array(size * size).fill(null);
  tttTurn = "X";
  tttOver = false;
  tttWinningCells = [];
  renderTTT();
}

function renderTTT() {
  tttBoardEl.style.display = "grid";
  chessBoardEl.style.display = "none";
  capturedPanel.style.display = "none";

  tttBoardEl.innerHTML = "";
  tttBoardEl.style.gridTemplateColumns = `repeat(${tttSize}, minmax(72px, 1fr))`;

  tttBoard.forEach((v, i) => {
    const cell = document.createElement("button");
    cell.className = "ttt-cell";
    if (v === "X") cell.classList.add("x");
    if (v === "O") cell.classList.add("o");
    if (tttWinningCells.includes(i)) cell.classList.add("win");
    cell.textContent = v || "";
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

function onTTTClick(i) {
  const mode = modeSelect.value;
  const aiMode = mode === "ttt3-ai" || mode === "ttt5-ai";

  if (tttOver || tttBoard[i]) return;
  if (aiMode && tttTurn === "O") return; // AI is O

  tttBoard[i] = tttTurn;
  const res = getTTTResult(tttBoard);
  if (res.winner) {
    finishTTT(res.winner, res.line);
    return;
  }

  tttTurn = tttTurn === "X" ? "O" : "X";
  renderTTT();

  if (aiMode && tttTurn === "O") {
    thinkingEl.style.display = "block";
    setTimeout(() => {
      doTTTAIMove();
      thinkingEl.style.display = "none";
    }, tttAIDelay(difficultySelect.value));
  }
}

function finishTTT(winner, line) {
  tttOver = true;
  tttWinningCells = [...line];

  const aiMode = modeSelect.value === "ttt3-ai" || modeSelect.value === "ttt5-ai";

  if (winner === "X") {
    scoreA++;
    showWinScreen(aiMode ? "You Win!" : "Player X Wins!");
  } else if (winner === "O") {
    scoreB++;
    showWinScreen(aiMode ? "Computer Wins!" : "Player O Wins!");
  } else {
    scoreD++;
    showWinScreen("It's a Draw!");
  }

  renderScores();
  renderTTT();
}

function getEmptyCells(board) {
  const arr = [];
  for (let i = 0; i < board.length; i++) if (!board[i]) arr.push(i);
  return arr;
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

    if (x && o) continue;      // blocked line
    if (!x && !o) continue;    // empty line

    if (o) score += Math.pow(10, o);
    if (x) score -= Math.pow(10, x);
  }

  // center control
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
  } else {
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
}

function pickMoveWithLookahead() {
  const diff = difficultySelect.value;
  const empties = getEmptyCells(tttBoard);

  // Easy randomness
  if (diff === "easy" && Math.random() < 0.55) {
    return empties[Math.floor(Math.random() * empties.length)];
  }

  // Tactical: immediate win
  for (const i of empties) {
    tttBoard[i] = "O";
    if (getTTTResult(tttBoard).winner === "O") {
      tttBoard[i] = null;
      return i;
    }
    tttBoard[i] = null;
  }

  // Tactical: immediate block
  for (const i of empties) {
    tttBoard[i] = "X";
    if (getTTTResult(tttBoard).winner === "X") {
      tttBoard[i] = null;
      return i;
    }
    tttBoard[i] = null;
  }

  // 3x3: almost/full search
  if (tttSize === 3) {
    let depth = empties.length;
    if (diff === "medium") depth = Math.min(empties.length, 7);
    if (diff === "easy") depth = Math.min(empties.length, 3);

    const best = minimaxTTT(tttBoard, tttSize, tttWinLen, depth, true, -Infinity, Infinity);
    if (best.move != null) return best.move;
  }

  // 5x5: depth-limited
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

  const chosen = pickMoveWithLookahead();
  tttBoard[chosen] = "O";

  const res = getTTTResult(tttBoard);
  if (res.winner) {
    finishTTT(res.winner, res.line);
    return;
  }

  tttTurn = "X";
  renderTTT();
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

const CHESS_U = {
  wp: "♙", wr: "♖", wn: "♘", wb: "♗", wq: "♕", wk: "♔",
  bp: "♟", br: "♜", bn: "♞", bb: "♝", bq: "♛", bk: "♚"
};
const PIECE_VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}
function cloneBoard(board) {
  return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
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

  renderCaptured();
  renderChess();
}

function renderCaptured() {
  whiteCapturedEl.textContent = whiteCaptured.map(p => CHESS_U[p.color + p.type]).join(" ");
  blackCapturedEl.textContent = blackCaptured.map(p => CHESS_U[p.color + p.type]).join(" ");
}

function renderChess() {
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
    if (r === start && !board[r + dir][c] && !board[r + 2 * dir][c]) {
      moves.push({ r: r + 2 * dir, c });
    }

    for (const dc of [-1, 1]) {
      const nr = r + dir, nc = c + dc;
      if (inBounds(nr, nc) && board[nr][nc] && board[nr][nc].color !== p.color) {
        moves.push({ r: nr, c: nc });
      }
    }
  } else if (p.type === "n") {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => add(r + dr, c + dc));
  } else if (p.type === "k") {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr || dc) add(r + dr, c + dc);
      }
    }
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
        showWinScreen("White Wins by Checkmate!");
      } else {
        scoreB++;
        showWinScreen("Black Wins by Checkmate!");
      }
      renderScores();
    }
    renderCaptured();
  }

  board[mv.tr][mv.tc] = piece;
  board[mv.fr][mv.fc] = null;

  // auto promote pawn to queen
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
  } else {
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

  const legal = getPseudoMoves(chessBoard, chessSelected.r, chessSelected.c)
    .find(m => m.r === r && m.c === c);

  if (!legal) {
    if (p && p.color === chessTurn) chessSelected = { r, c };
    else chessSelected = null;
    renderChess();
    return;
  }

  moveChess(chessBoard, { fr: chessSelected.r, fc: chessSelected.c, tr: r, tc: c }, true);
  if (chessOver) {
    renderChess();
    return;
  }

  chessSelected = null;
  chessTurn = chessTurn === "w" ? "b" : "w";
  renderChess();

  if (aiMode && chessTurn === "b" && !chessOver) {
    thinkingEl.style.display = "block";
    setTimeout(() => {
      const res = minimaxChess(chessBoard, chessDepth(), -Infinity, Infinity, true);
      const mv = res.move || allMovesForColor(chessBoard, "b")[0];

      if (mv) {
        moveChess(chessBoard, mv, true);
        if (!chessOver) chessTurn = "w";
      }

      thinkingEl.style.display = "none";
      renderChess();
    }, tttAIDelay(difficultySelect.value));
  }
}

/* =======================================================
   CUSTOM GLASS DROPDOWNS
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
  buildCustomDropdown("modeWrap", "modeSelect", "modeMenu", "modeValueText");
  buildCustomDropdown("difficultyWrapCustom", "difficultySelect", "difficultyMenu", "difficultyValueText");
  buildCustomDropdown("themeWrap", "themeSelect", "themeMenu", "themeValueText");

  document.addEventListener("click", () => {
    document.querySelectorAll(".gselect.open").forEach(el => el.classList.remove("open"));
  });
}

/* =======================================================
   MODE / INIT
======================================================= */
function isAIMode(mode) {
  return mode.endsWith("-ai");
}

function initBoard() {
  hideWinScreen();

  const mode = modeSelect.value;
  modeChip.textContent = "Mode: " + modeSelect.options[modeSelect.selectedIndex].text;

  const diffWrap = document.getElementById("difficultyWrapCustom");
  if (diffWrap) diffWrap.style.display = isAIMode(mode) ? "block" : "none";

  thinkingEl.style.display = "none";

  if (mode.startsWith("ttt3")) initTTT(3);
  else if (mode.startsWith("ttt5")) initTTT(5);
  else initChess();
}

modeSelect.addEventListener("change", initBoard);
newGameBtn.addEventListener("click", initBoard);

resetScoreBtn.addEventListener("click", () => {
  scoreA = 0;
  scoreB = 0;
  scoreD = 0;
  renderScores();
});

/* -------------------- BOOT -------------------- */
(function boot() {
  initCustomDropdowns();

  const savedTheme = localStorage.getItem("theme") || "dark";
  themeSelect.value = savedTheme;
  setTheme(savedTheme);
  syncThemeLabel();

  renderScores();
  initBoard();
})();