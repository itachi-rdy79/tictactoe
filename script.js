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

let scoreA = 0, scoreB = 0, scoreD = 0;
function renderScores() {
  scoreAEl.textContent = scoreA;
  scoreBEl.textContent = scoreB;
  scoreDEl.textContent = scoreD;
}

/* Theme */
function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}
themeSelect.addEventListener("change", () => setTheme(themeSelect.value));

/* Win Overlay */
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

/* ---------------- TTT ---------------- */
let tttBoard = [];
let tttSize = 3;
let tttWinLen = 3;
let tttTurn = "X";
let tttOver = false;
let tttWinningCells = [];

function buildTTTLines(size, len) {
  const lines = [];
  for (let r = 0; r < size; r++) for (let c = 0; c <= size - len; c++) {
    const line = []; for (let k = 0; k < len; k++) line.push(r * size + (c + k)); lines.push(line);
  }
  for (let c = 0; c < size; c++) for (let r = 0; r <= size - len; r++) {
    const line = []; for (let k = 0; k < len; k++) line.push((r + k) * size + c); lines.push(line);
  }
  for (let r = 0; r <= size - len; r++) for (let c = 0; c <= size - len; c++) {
    const line = []; for (let k = 0; k < len; k++) line.push((r + k) * size + (c + k)); lines.push(line);
  }
  for (let r = 0; r <= size - len; r++) for (let c = len - 1; c < size; c++) {
    const line = []; for (let k = 0; k < len; k++) line.push((r + k) * size + (c - k)); lines.push(line);
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
  tttWinLen = size === 3 ? 3 : 4;
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
    cell.onclick = () => onTTTClick(i);
    tttBoardEl.appendChild(cell);
  });

  const res = getTTTResult(tttBoard);
  if (res.winner === "draw") statusEl.textContent = "Tic-Tac-Toe: Draw!";
  else if (res.winner) statusEl.textContent = `Tic-Tac-Toe: ${res.winner} wins!`;
  else statusEl.textContent = `Tic-Tac-Toe: ${tttTurn}'s turn`;
}

function tttAIDelay(diff) { return diff === "easy" ? 260 : diff === "medium" ? 500 : 760; }

function onTTTClick(i) {
  const aiMode = modeSelect.value === "ttt3-ai" || modeSelect.value === "ttt5-ai";
  if (tttOver || tttBoard[i]) return;
  if (aiMode && tttTurn === "O") return;

  tttBoard[i] = tttTurn;
  const res = getTTTResult(tttBoard);
  if (res.winner) return finishTTT(res.winner, res.line);

  tttTurn = tttTurn === "X" ? "O" : "X";
  renderTTT();

  if (aiMode && tttTurn === "O") {
    thinkingEl.style.display = "block";
    setTimeout(() => { doTTTAIMove(); thinkingEl.style.display = "none"; }, tttAIDelay(difficultySelect.value));
  }
}

function finishTTT(winner, line) {
  tttOver = true;
  tttWinningCells = [...line];
  const aiMode = modeSelect.value === "ttt3-ai" || modeSelect.value === "ttt5-ai";

  if (winner === "X") { scoreA++; showWinScreen(aiMode ? "You Win!" : "Player X Wins!"); }
  else if (winner === "O") { scoreB++; showWinScreen(aiMode ? "Computer Wins!" : "Player O Wins!"); }
  else { scoreD++; showWinScreen("It's a Draw!"); }

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

function minimaxTTT(board, size, winLen, depth, isMax, alpha, beta) {
  const res = getTTTResult(board, size, winLen);
  if (res.winner === "O") return { score: 100000 + depth };
  if (res.winner === "X") return { score: -100000 - depth };
  if (res.winner === "draw") return { score: 0 };
  if (depth === 0) return { score: evaluate5x5Board(board, size, winLen) };

  const empties = getEmptyCells(board);

  if (isMax) {
    let best = { score: -Infinity, move: null };
    for (const i of empties) {
      board[i] = "O";
      const r = minimaxTTT(board, size, winLen, depth - 1, false, alpha, beta);
      board[i] = null;
      if (r.score > best.score) best = { score: r.score, move: i };
      alpha = Math.max(alpha, r.score);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = { score: Infinity, move: null };
    for (const i of empties) {
      board[i] = "X";
      const r = minimaxTTT(board, size, winLen, depth - 1, true, alpha, beta);
      board[i] = null;
      if (r.score < best.score) best = { score: r.score, move: i };
      beta = Math.min(beta, r.score);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function pickMoveWithLookahead() {
  const diff = difficultySelect.value;
  const empties = getEmptyCells(tttBoard);

  if (diff === "easy" && Math.random() < 0.55) return empties[Math.floor(Math.random() * empties.length)];

  for (const i of empties) {
    tttBoard[i] = "O";
    if (getTTTResult(tttBoard).winner === "O") { tttBoard[i] = null; return i; }
    tttBoard[i] = null;
  }
  for (const i of empties) {
    tttBoard[i] = "X";
    if (getTTTResult(tttBoard).winner === "X") { tttBoard[i] = null; return i; }
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

  const chosen = pickMoveWithLookahead();
  tttBoard[chosen] = "O";

  const res = getTTTResult(tttBoard);
  if (res.winner) return finishTTT(res.winner, res.line);

  tttTurn = "X";
  renderTTT();
}

/* ---------------- CHESS ---------------- */
let chessBoard = [], chessTurn = "w", chessSelected = null, chessOver = false;
let whiteCaptured = [], blackCaptured = [];

const CHESS_U = {
  wp: "♙", wr: "♖", wn: "♘", wb: "♗", wq: "♕", wk: "♔",
  bp: "♟", br: "♜", bn: "♞", bb: "♝", bq: "♛", bk: "♚"
};
const PIECE_VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

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
      const d = document.createElement("div");
      d.className = "chess-cell " + (((r + c) % 2 === 0) ? "light" : "dark");
      if (chessSelected && chessSelected.r === r && chessSelected.c === c) d.classList.add("selected");
      if (hints.some(m => m.r === r && m.c === c)) d.classList.add("hint");

      const p = chessBoard[r][c];
      d.textContent = p ? CHESS_U[p.color + p.type] : "";
      d.onclick = () => onChessClick(r, c);
      chessBoardEl.appendChild(d);
    }
  }

  statusEl.textContent = chessOver ? "Chess: Game Over" : `Chess: ${chessTurn === "w" ? "White" : "Black"} to move`;
}

function getPseudoMoves(b, r, c) {
  const p = b[r][c];
  if (!p) return [];
  const m = [];
  const add = (nr, nc) => {
    if (!(nr >= 0 && nr < 8 && nc >= 0 && nc < 8)) return;
    const t = b[nr][nc];
    if (!t || t.color !== p.color) m.push({ r: nr, c: nc });
  };

  if (p.type === "p") {
    const dir = p.color === "w" ? -1 : 1;
    const st = p.color === "w" ? 6 : 1;
    if (r + dir >= 0 && r + dir < 8 && !b[r + dir][c]) m.push({ r: r + dir, c });
    if (r === st && !b[r + dir][c] && !b[r + 2 * dir][c]) m.push({ r: r + 2 * dir, c });
    for (const dc of [-1, 1]) {
      const nr = r + dir, nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && b[nr][nc] && b[nr][nc].color !== p.color) m.push({ r: nr, c: nc });
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
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (!b[nr][nc]) m.push({ r: nr, c: nc });
        else {
          if (b[nr][nc].color !== p.color) m.push({ r: nr, c: nc });
          break;
        }
        nr += dr; nc += dc;
      }
    }
  }
  return m;
}

function moveChess(b, mv, realMove = false) {
  const piece = b[mv.fr][mv.fc];
  const target = b[mv.tr][mv.tc];

  if (target && realMove) {
    if (target.color === "w") whiteCaptured.push(target);
    else blackCaptured.push(target);

    if (target.type === "k") {
      chessOver = true;
      if (piece.color === "w") { scoreA++; showWinScreen("White Wins by Checkmate!"); }
      else { scoreB++; showWinScreen("Black Wins by Checkmate!"); }
      renderScores();
    }
    renderCaptured();
  }

  b[mv.tr][mv.tc] = piece;
  b[mv.fr][mv.fc] = null;
  if (piece.type === "p" && (mv.tr === 0 || mv.tr === 7)) piece.type = "q";
}

function allMovesForColor(b, color) {
  const arr = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    if (b[r][c] && b[r][c].color === color) {
      getPseudoMoves(b, r, c).forEach(x => arr.push({ fr: r, fc: c, tr: x.r, tc: x.c }));
    }
  }
  return arr;
}

function evalChess(b) {
  let s = 0;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = b[r][c];
    if (!p) continue;
    s += p.color === "b" ? PIECE_VAL[p.type] : -PIECE_VAL[p.type];
  }
  return s;
}

function minimaxChess(b, depth, alpha, beta, maxing) {
  if (depth === 0) return { score: evalChess(b), move: null };
  const color = maxing ? "b" : "w";
  const moves = allMovesForColor(b, color);
  if (!moves.length) return { score: evalChess(b), move: null };

  let bestMove = null;

  if (maxing) {
    let best = -Infinity;
    for (const mv of moves) {
      const cpy = b.map(row => row.map(cell => (cell ? { ...cell } : null)));
      moveChess(cpy, mv, false);
      const result = minimaxChess(cpy, depth - 1, alpha, beta, false);
      if (result.score > best) { best = result.score; bestMove = mv; }
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) break;
    }
    return { score: best, move: bestMove };
  } else {
    let best = Infinity;
    for (const mv of moves) {
      const cpy = b.map(row => row.map(cell => (cell ? { ...cell } : null)));
      moveChess(cpy, mv, false);
      const result = minimaxChess(cpy, depth - 1, alpha, beta, true);
      if (result.score < best) { best = result.score; bestMove = mv; }
      beta = Math.min(beta, result.score);
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
    return renderChess();
  }

  const legal = getPseudoMoves(chessBoard, chessSelected.r, chessSelected.c).find(x => x.r === r && x.c === c);
  if (!legal) {
    if (p && p.color === chessTurn) chessSelected = { r, c };
    else chessSelected = null;
    return renderChess();
  }

  moveChess(chessBoard, { fr: chessSelected.r, fc: chessSelected.c, tr: r, tc: c }, true);
  if (chessOver) return renderChess();

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

/* ------------ custom dropdown sync ------------ */
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
      item.onclick = () => {
        select.value = opt.value;
        valueText.textContent = opt.textContent;
        wrap.classList.remove("open");
        select.dispatchEvent(new Event("change", { bubbles: true }));
        renderMenu();
      };
      menu.appendChild(item);
    });
  }

  function syncFromSelect() {
    const active = select.options[select.selectedIndex];
    valueText.textContent = active ? active.textContent : "";
    renderMenu();
  }

  btn.onclick = (e) => {
    e.stopPropagation();
    document.querySelectorAll(".gselect.open").forEach(el => { if (el !== wrap) el.classList.remove("open"); });
    wrap.classList.toggle("open");
  };

  select.addEventListener("change", syncFromSelect);
  syncFromSelect();
}

function initCustomDropdowns() {
  buildCustomDropdown("modeWrap", "modeSelect", "modeMenu", "modeValueText");
  buildCustomDropdown("difficultyWrapCustom", "difficultySelect", "difficultyMenu", "difficultyValueText");
  buildCustomDropdown("themeWrap", "themeSelect", "themeMenu", "themeValueText");
  document.addEventListener("click", () => document.querySelectorAll(".gselect.open").forEach(el => el.classList.remove("open")));
}

/* ------------ mode/init ------------ */
function isAIMode(mode) { return mode.endsWith("-ai"); }

function initBoard() {
  hideWinScreen();
  const mode = modeSelect.value;
  modeChip.textContent = "Mode: " + modeSelect.options[modeSelect.selectedIndex].text;
  document.getElementById("difficultyWrapCustom").style.display = isAIMode(mode) ? "block" : "none";
  thinkingEl.style.display = "none";

  if (mode.startsWith("ttt3")) initTTT(3);
  else if (mode.startsWith("ttt5")) initTTT(5);
  else initChess();
}

modeSelect.addEventListener("change", initBoard);
newGameBtn.addEventListener("click", initBoard);
resetScoreBtn.addEventListener("click", () => { scoreA = 0; scoreB = 0; scoreD = 0; renderScores(); });

(function boot() {
  initCustomDropdowns();
  const savedTheme = localStorage.getItem("theme") || "dark";
  themeSelect.value = savedTheme;
  setTheme(savedTheme);
  renderScores();
  initBoard();
})();