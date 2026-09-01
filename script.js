const MODES = {
  ttt5: {
    type: "grid",
    name: "5x5 Battle",
    size: 5,
    win: 4,
    sub: "5x5 board — connect 4 to win"
  },
  ttt3: {
    type: "grid",
    name: "Classic 3x3",
    size: 3,
    win: 3,
    sub: "3x3 board — connect 3 to win"
  },
  connect4: {
    type: "connect4",
    name: "Connect Four",
    cols: 7,
    rows: 6,
    win: 4,
    sub: "7x6 board — connect 4 to win"
  }
};

const els = {
  modeSelect: document.getElementById("modeSelect"),
  modeBadge: document.getElementById("modeBadge"),
  statusText: document.getElementById("statusText"),
  subText: document.getElementById("subText"),
  board: document.getElementById("board"),
  columnBar: document.getElementById("columnBar"),
  newGameBtn: document.getElementById("newGameBtn"),
  resetScoreBtn: document.getElementById("resetScoreBtn"),
  themeBtn: document.getElementById("themeBtn"),
  scoreX: document.getElementById("scoreX"),
  scoreO: document.getElementById("scoreO"),
  scoreDraws: document.getElementById("scoreDraws")
};

function defaultScores() {
  return {
    ttt5: { X: 0, O: 0, draws: 0 },
    ttt3: { X: 0, O: 0, draws: 0 },
    connect4: { X: 0, O: 0, draws: 0 }
  };
}

function loadScores() {
  const saved = JSON.parse(localStorage.getItem("neoArcadeScores") || "null");
  const base = defaultScores();

  if (saved) {
    for (const key of Object.keys(base)) {
      base[key] = { ...base[key], ...(saved[key] || {}) };
    }
  }

  return base;
}

function saveScores() {
  localStorage.setItem("neoArcadeScores", JSON.stringify(scores));
}

let scores = loadScores();
let modeKey = "ttt5";
let currentPlayer = "X";
let gameActive = true;
let winningCells = [];

let tttBoard = [];
let c4Board = [];

function getMode() {
  return MODES[modeKey];
}

function initBoard() {
  const mode = getMode();
  currentPlayer = "X";
  gameActive = true;
  winningCells = [];

  if (mode.type === "grid") {
    tttBoard = Array(mode.size * mode.size).fill(null);
  } else {
    c4Board = Array.from({ length: mode.rows }, () => Array(mode.cols).fill(null));
  }

  els.modeBadge.textContent = `Mode: ${mode.name}`;
  els.subText.textContent = mode.sub;
  els.statusText.textContent = `${currentPlayer}’s turn`;
  render();
  updateScoreboard();
}

function updateScoreboard() {
  const s = scores[modeKey];
  els.scoreX.textContent = s.X;
  els.scoreO.textContent = s.O;
  els.scoreDraws.textContent = s.draws;
}

function render() {
  const mode = getMode();
  els.board.innerHTML = "";
  els.columnBar.innerHTML = "";

  if (mode.type === "grid") {
    els.columnBar.style.display = "none";
    els.board.style.display = "grid";
    els.board.style.gridTemplateColumns = `repeat(${mode.size}, minmax(0, 1fr))`;

    tttBoard.forEach((value, index) => {
      const cell = document.createElement("button");
      cell.className = "cell";

      if (value) cell.classList.add(value.toLowerCase());
      if (winningCells.includes(index)) cell.classList.add("win");

      cell.textContent = value || "";
      cell.disabled = !gameActive || !!value;
      cell.addEventListener("click", () => makeTTTMove(index));
      els.board.appendChild(cell);
    });
  } else {
    els.columnBar.style.display = "grid";
    els.columnBar.style.gridTemplateColumns = `repeat(${mode.cols}, minmax(0, 1fr))`;
    els.board.style.display = "grid";
    els.board.style.gridTemplateColumns = `repeat(${mode.cols}, minmax(0, 1fr))`;

    for (let c = 0; c < mode.cols; c++) {
      const btn = document.createElement("button");
      btn.className = "drop-btn";
      btn.textContent = "↓";
      btn.disabled = !gameActive;
      btn.title = `Drop in column ${c + 1}`;
      btn.addEventListener("click", () => dropConnect4(c));
      els.columnBar.appendChild(btn);
    }

    for (let r = 0; r < mode.rows; r++) {
      for (let c = 0; c < mode.cols; c++) {
        const cell = document.createElement("div");
        const value = c4Board[r][c];
        const flatIndex = r * mode.cols + c;

        cell.className = "piece " + (value ? value.toLowerCase() : "empty");
        if (winningCells.includes(flatIndex)) cell.classList.add("win");
        cell.textContent = value || "•";

        els.board.appendChild(cell);
      }
    }
  }
}

function getGridWinningLines(size, win) {
  const lines = [];

  // Horizontal
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - win; c++) {
      const line = [];
      for (let k = 0; k < win; k++) line.push(r * size + (c + k));
      lines.push(line);
    }
  }

  // Vertical
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - win; r++) {
      const line = [];
      for (let k = 0; k < win; k++) line.push((r + k) * size + c);
      lines.push(line);
    }
  }

  // Diagonal down-right
  for (let r = 0; r <= size - win; r++) {
    for (let c = 0; c <= size - win; c++) {
      const line = [];
      for (let k = 0; k < win; k++) line.push((r + k) * size + (c + k));
      lines.push(line);
    }
  }

  // Diagonal down-left
  for (let r = 0; r <= size - win; r++) {
    for (let c = win - 1; c < size; c++) {
      const line = [];
      for (let k = 0; k < win; k++) line.push((r + k) * size + (c - k));
      lines.push(line);
    }
  }

  return lines;
}

function checkGridWinner() {
  const { size, win } = getMode();
  const lines = getGridWinningLines(size, win);

  for (const line of lines) {
    const first = tttBoard[line[0]];
    if (!first) continue;

    if (line.every(i => tttBoard[i] === first)) {
      return { winner: first, cells: line };
    }
  }

  return null;
}

function makeTTTMove(index) {
  if (!gameActive || tttBoard[index]) return;

  tttBoard[index] = currentPlayer;
  const result = checkGridWinner();

  if (result) {
    gameActive = false;
    winningCells = result.cells;
    scores[modeKey][result.winner] += 1;
    els.statusText.textContent = `Player ${result.winner} wins!`;
    saveScores();
    render();
    updateScoreboard();
    return;
  }

  if (tttBoard.every(Boolean)) {
    gameActive = false;
    scores[modeKey].draws += 1;
    els.statusText.textContent = "It’s a draw!";
    saveScores();
    render();
    updateScoreboard();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  els.statusText.textContent = `${currentPlayer}’s turn`;
  render();
}

function dropConnect4(col) {
  const mode = getMode();
  if (!gameActive) return;

  let rowToPlace = -1;
  for (let r = mode.rows - 1; r >= 0; r--) {
    if (!c4Board[r][col]) {
      rowToPlace = r;
      break;
    }
  }

  if (rowToPlace === -1) return;

  c4Board[rowToPlace][col] = currentPlayer;

  const result = checkConnect4Winner();
  if (result) {
    gameActive = false;
    winningCells = result.cells;
    scores[modeKey][result.winner] += 1;
    els.statusText.textContent = `Player ${result.winner} wins!`;
    saveScores();
    render();
    updateScoreboard();
    return;
  }

  if (c4Board.every(row => row.every(Boolean))) {
    gameActive = false;
    scores[modeKey].draws += 1;
    els.statusText.textContent = "It’s a draw!";
    saveScores();
    render();
    updateScoreboard();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  els.statusText.textContent = `${currentPlayer}’s turn`;
  render();
}

function checkConnect4Winner() {
  const { rows, cols, win } = getMode();
  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal down-right
    [1, -1]   // diagonal down-left
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const player = c4Board[r][c];
      if (!player) continue;

      for (const [dr, dc] of directions) {
        const cells = [[r, c]];
        let ok = true;

        for (let k = 1; k < win; k++) {
          const nr = r + dr * k;
          const nc = c + dc * k;

          if (
            nr < 0 || nr >= rows ||
            nc < 0 || nc >= cols ||
            c4Board[nr][nc] !== player
          ) {
            ok = false;
            break;
          }

          cells.push([nr, nc]);
        }

        if (ok) {
          return {
            winner: player,
            cells: cells.map(([rr, cc]) => rr * cols + cc)
          };
        }
      }
    }
  }

  return null;
}

function resetCurrentScores() {
  scores[modeKey] = { X: 0, O: 0, draws: 0 };
  saveScores();
  updateScoreboard();
  initBoard();
}

els.newGameBtn.addEventListener("click", initBoard);

els.resetScoreBtn.addEventListener("click", resetCurrentScores);

els.modeSelect.addEventListener("change", () => {
  modeKey = els.modeSelect.value;
  initBoard();
});

els.themeBtn.addEventListener("click", () => {
  alert("Neon UI is already active. If you want, I can add dark/light theme switching next.");
});

// Start the game
initBoard();