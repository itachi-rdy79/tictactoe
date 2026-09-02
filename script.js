const modeSelect = document.getElementById("modeSelect");
const difficultyWrap = document.getElementById("difficultyWrap");
const difficultySelect = document.getElementById("difficultySelect");
const themeSelect = document.getElementById("themeSelect");
const resetBtn = document.getElementById("resetBtn");

const statusEl = document.getElementById("status");
const aiThinkingEl = document.getElementById("aiThinking");
const modeChip = document.getElementById("modeChip");
const boardEl = document.getElementById("tttBoard");

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDEl = document.getElementById("scoreD");

const SIZE = 5;
const WIN_LEN = 4; // 4 in row to win on 5x5

let board = Array(SIZE * SIZE).fill(null);
let turn = "X";
let gameOver = false;

let scoreX = 0, scoreO = 0, scoreD = 0;

// ---------- helpers ----------
const idx = (r, c) => r * SIZE + c;

function lines() {
  const all = [];
  // rows
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c <= SIZE - WIN_LEN; c++) {
      const line = [];
      for (let k = 0; k < WIN_LEN; k++) line.push(idx(r, c + k));
      all.push(line);
    }
  }
  // cols
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r <= SIZE - WIN_LEN; r++) {
      const line = [];
      for (let k = 0; k < WIN_LEN; k++) line.push(idx(r + k, c));
      all.push(line);
    }
  }
  // diag down-right
  for (let r = 0; r <= SIZE - WIN_LEN; r++) {
    for (let c = 0; c <= SIZE - WIN_LEN; c++) {
      const line = [];
      for (let k = 0; k < WIN_LEN; k++) line.push(idx(r + k, c + k));
      all.push(line);
    }
  }
  // diag down-left
  for (let r = 0; r <= SIZE - WIN_LEN; r++) {
    for (let c = WIN_LEN - 1; c < SIZE; c++) {
      const line = [];
      for (let k = 0; k < WIN_LEN; k++) line.push(idx(r + k, c - k));
      all.push(line);
    }
  }
  return all;
}
const WIN_LINES = lines();

function getWinner(b) {
  for (const line of WIN_LINES) {
    const v = b[line[0]];
    if (!v) continue;
    if (line.every(i => b[i] === v)) return v;
  }
  if (b.every(Boolean)) return "draw";
  return null;
}

function setStatus() {
  const w = getWinner(board);
  if (w === "X") statusEl.textContent = "You win! 🎉";
  else if (w === "O") statusEl.textContent = modeSelect.value === "tttAI" ? "Computer wins!" : "O wins!";
  else if (w === "draw") statusEl.textContent = "It's a draw!";
  else statusEl.textContent = `Tic-Tac-Toe: ${turn}'s turn`;
}

function updateScoreUI() {
  scoreXEl.textContent = scoreX;
  scoreOEl.textContent = scoreO;
  scoreDEl.textContent = scoreD;
}

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((v, i) => {
    const btn = document.createElement("button");
    btn.className = "ttt-cell";
    if (v === "X") btn.classList.add("x");
    if (v === "O") btn.classList.add("o");
    btn.textContent = v || "";
    btn.addEventListener("click", () => onClickCell(i));
    boardEl.appendChild(btn);
  });
  setStatus();
}

function endIfGameOver() {
  const w = getWinner(board);
  if (!w) return false;
  gameOver = true;

  if (w === "X") scoreX++;
  else if (w === "O") scoreO++;
  else scoreD++;

  updateScoreUI();
  renderBoard();
  return true;
}

// ---------- AI ----------
function delayByDifficulty(d) {
  if (d === "easy") return 260;
  if (d === "medium") return 480;
  return 760;
}

function aiMove() {
  const empties = board.map((v, i) => (v ? -1 : i)).filter(i => i !== -1);
  if (!empties.length) return;

  const diff = difficultySelect.value;

  // easy: often random
  if (diff === "easy" && Math.random() < 0.55) {
    playO(empties[Math.floor(Math.random() * empties.length)]);
    return;
  }

  // win now
  for (const i of empties) {
    board[i] = "O";
    if (getWinner(board) === "O") {
      board[i] = null;
      playO(i);
      return;
    }
    board[i] = null;
  }

  // block X
  for (const i of empties) {
    board[i] = "X";
    if (getWinner(board) === "X") {
      board[i] = null;
      playO(i);
      return;
    }
    board[i] = null;
  }

  // heuristic
  let best = -Infinity;
  let bestMoves = [];
  for (const i of empties) {
    board[i] = "O";
    const s = evaluate(board);
    board[i] = null;

    if (s > best) { best = s; bestMoves = [i]; }
    else if (s === best) bestMoves.push(i);
  }

  // medium: occasional non-best
  if (diff === "medium" && bestMoves.length > 1 && Math.random() < 0.28) {
    playO(bestMoves[Math.floor(Math.random() * bestMoves.length)]);
  } else {
    playO(bestMoves[0]);
  }
}

function evaluate(b) {
  let s = 0;
  for (const line of WIN_LINES) {
    let x = 0, o = 0;
    for (const i of line) {
      if (b[i] === "X") x++;
      else if (b[i] === "O") o++;
    }
    if (x && o) continue;
    if (o) s += Math.pow(10, o);
    if (x) s -= Math.pow(10, x);
  }
  // center preference
  const center = idx(2, 2);
  if (b[center] === "O") s += 14;
  if (b[center] === "X") s -= 14;
  return s;
}

function playO(i) {
  board[i] = "O";
  if (endIfGameOver()) return;
  turn = "X";
  renderBoard();
}

// ---------- game flow ----------
function onClickCell(i) {
  if (gameOver || board[i]) return;
  if (modeSelect.value === "tttAI" && turn === "O") return;

  board[i] = turn;
  if (endIfGameOver()) return;

  turn = turn === "X" ? "O" : "X";
  renderBoard();

  if (modeSelect.value === "tttAI" && turn === "O" && !gameOver) {
    aiThinkingEl.style.display = "inline";
    setTimeout(() => {
      aiMove();
      aiThinkingEl.style.display = "none";
      if (!gameOver) renderBoard();
    }, delayByDifficulty(difficultySelect.value));
  }
}

function resetBoardOnly() {
  board = Array(SIZE * SIZE).fill(null);
  turn = "X";
  gameOver = false;
  aiThinkingEl.style.display = "none";
  renderBoard();
}

function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function syncModeUI() {
  const ai = modeSelect.value === "tttAI";
  difficultyWrap.style.display = ai ? "grid" : "none";
  modeChip.textContent = ai ? "Mode: Tic-Tac-Toe vs AI" : "Mode: Tic-Tac-Toe 2 Players";
}

// ---------- events ----------
modeSelect.addEventListener("change", () => {
  syncModeUI();
  resetBoardOnly();
});

difficultySelect.addEventListener("change", () => {
  // difficulty applies on next AI turn
});

themeSelect.addEventListener("change", () => {
  setTheme(themeSelect.value);
});

resetBtn.addEventListener("click", resetBoardOnly);

// ---------- init ----------
(function init() {
  const saved = localStorage.getItem("theme") || "dark";
  themeSelect.value = saved;
  setTheme(saved);

  syncModeUI();
  updateScoreUI();
  resetBoardOnly();
})();