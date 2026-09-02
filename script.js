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
  tttAI: {
    type: "ai",
    name: "Tic Tac Toe vs AI",
    size: 3,
    win: 3,
    sub: "3x3 board — you play X, computer plays O"
  },
  connect4: {
    type: "connect4",
    name: "Connect Four",
    cols: 7,
    rows: 6,
    win: 4,
    sub: "7x6 board — connect 4 to win"
  },
  chess: {
    type: "chess",
    name: "Chess",
    sub: "2-player chess — click a piece, then click a legal square"
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
  scoreDraws: document.getElementById("scoreDraws"),
  scoreLabelX: document.getElementById("scoreLabelX"),
  scoreLabelO: document.getElementById("scoreLabelO")
};

function defaultScores() {
  return {
    ttt5: { X: 0, O: 0, draws: 0 },
    ttt3: { X: 0, O: 0, draws: 0 },
    tttAI: { X: 0, O: 0, draws: 0 },
    connect4: { X: 0, O: 0, draws: 0 },
    chess: { X: 0, O: 0, draws: 0 }
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
let currentPlayer = "X"; // X/O for grid games, w/b for chess
let gameActive = true;
let winningCells = [];
let aiTimer = null;
let currentTheme = localStorage.getItem("neoArcadeTheme") || "dark";

let tttBoard = [];
let c4Board = [];
let chessBoard = [];
let selectedChess = null;
let legalChessMoves = [];

const chessSymbols = {
  wK: "♔", wQ: "♕", wR: "♖", wB: "♗", wN: "♘", wP: "♙",
  bK: "♚", bQ: "♛", bR: "♜", bB: "♝", bN: "♞", bP: "♟"
};

function getMode() {
  return MODES[modeKey];
}

function colorName(c) {
  if (c === "w") return "White";
  if (c === "b") return "Black";
  return c;
}

function initBoard() {
  if (aiTimer) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }

  const mode = getMode();
  gameActive = true;
  winningCells = [];
  selectedChess = null;
  legalChessMoves = [];

  if (mode.type === "grid" || mode.type === "ai") {
    currentPlayer = "X";
    tttBoard = Array(mode.size * mode.size).fill(null);
  } else if (mode.type === "connect4") {
    currentPlayer = "X";
    c4Board = Array.from({ length: mode.rows }, () => Array(mode.cols).fill(null));
  } else if (mode.type === "chess") {
    currentPlayer = "w";
    chessBoard = createChessBoard();
  }

  els.modeBadge.textContent = `Mode: ${mode.name}`;
  els.subText.textContent = mode.sub;
  updateScoreboardLabels();
  updateStatusTextForNewGame();
  render();
  updateScoreboard();
}

function updateScoreboardLabels() {
  if (modeKey === "tttAI") {
    els.scoreLabelX.textContent = "You";
    els.scoreLabelO.textContent = "Computer";
  } else if (modeKey === "chess") {
    els.scoreLabelX.textContent = "White";
    els.scoreLabelO.textContent = "Black";
  } else {
    els.scoreLabelX.textContent = "Player X";
    els.scoreLabelO.textContent = "Player O";
  }
}

function updateScoreboard() {
  const s = scores[modeKey];
  els.scoreX.textContent = s.X;
  els.scoreO.textContent = s.O;
  els.scoreDraws.textContent = s.draws;
}

function updateStatusTextForNewGame() {
  if (modeKey === "tttAI") {
    els.statusText.textContent = "Your turn";
  } else if (modeKey === "chess") {
    els.statusText.textContent = "White to move";
  } else if (modeKey === "connect4" || modeKey === "ttt3" || modeKey === "ttt5") {
    els.statusText.textContent = "X's turn";
  } else {
    els.statusText.textContent = "X's turn";
  }
}

function render() {
  const mode = getMode();
  els.board.innerHTML = "";
  els.columnBar.innerHTML = "";

  if (mode.type === "grid" || mode.type === "ai") {
    els.columnBar.style.display = "none";
    els.board.style.display = "grid";
    els.board.style.gridTemplateColumns = `repeat(${mode.size}, minmax(0, 1fr))`;

    tttBoard.forEach((value, index) => {
      const cell = document.createElement("button");
      cell.className = "cell";

      if (value) cell.classList.add(value.toLowerCase());
      if (winningCells.includes(index)) cell.classList.add("win");

      cell.textContent = value || "";
      cell.disabled =
        !gameActive ||
        !!value ||
        (modeKey === "tttAI" && currentPlayer === "O");

      cell.addEventListener("click", () => makeTTTMove(index));
      els.board.appendChild(cell);
    });
  } else if (mode.type === "connect4") {
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
  } else if (mode.type === "chess") {
    els.columnBar.style.display = "none";
    els.board.style.display = "grid";
    els.board.style.gridTemplateColumns = "repeat(8, minmax(0, 1fr))";

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = document.createElement("button");
        const piece = chessBoard[r][c];
        const isLight = (r + c) % 2 === 0;

        cell.className = `piece chess-square ${isLight ? "light" : "dark"}`;

        if (selectedChess && selectedChess.r === r && selectedChess.c === c) {
          cell.classList.add("selected");
        }

        const target = legalChessMoves.find(m => m.r === r && m.c === c);
        if (target) {
          cell.classList.add(piece ? "capture" : "target");
        }

        if (piece) {
          cell.innerHTML = `<span class="${piece[0] === 'w' ? 'white-piece' : 'black-piece'}">${chessSymbols[piece]}</span>`;
        } else if (target) {
          cell.textContent = "•";
          cell.style.color = "#fbbf24";
        } else {
          cell.textContent = "";
        }

        cell.disabled = !gameActive;
        cell.addEventListener("click", () => handleChessClick(r, c));
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

function getGridWinnerOnBoard(board, size, win) {
  const lines = getGridWinningLines(size, win);

  for (const line of lines) {
    const first = board[line[0]];
    if (!first) continue;

    if (line.every(i => board[i] === first)) {
      return { winner: first, cells: line };
    }
  }

  return null;
}

function makeTTTMove(index) {
  if (!gameActive || tttBoard[index]) return;

  // In AI mode, human is always X
  if (modeKey === "tttAI" && currentPlayer !== "X") return;

  tttBoard[index] = currentPlayer;
  const mode = getMode();
  const result = getGridWinnerOnBoard(tttBoard, mode.size, mode.win);

  if (result) {
    gameActive = false;
    winningCells = result.cells;
    scores[modeKey][result.winner] += 1;
    els.statusText.textContent =
      modeKey === "tttAI" && result.winner === "X"
        ? "You win!"
        : modeKey === "tttAI" && result.winner === "O"
        ? "Computer wins!"
        : `Player ${result.winner} wins!`;

    saveScores();
    render();
    updateScoreboard();
    return;
  }

  if (tttBoard.every(Boolean)) {
    gameActive = false;
    scores[modeKey].draws += 1;
    els.statusText.textContent = "It's a draw!";
    saveScores();
    render();
    updateScoreboard();
    return;
  }

  if (modeKey === "tttAI") {
    currentPlayer = "O";
    els.statusText.textContent = "Computer thinking...";
    render();

    if (aiTimer) clearTimeout(aiTimer);
    aiTimer = setTimeout(() => {
      aiTimer = null;
      aiMove();
    }, 350);

    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  els.statusText.textContent = `${currentPlayer}'s turn`;
  render();
}

function aiMove() {
  if (!gameActive || modeKey !== "tttAI" || currentPlayer !== "O") return;

  const move = getBestAIMove();
  if (move === null) return;

  tttBoard[move] = "O";
  const result = getGridWinnerOnBoard(tttBoard, 3, 3);

  if (result) {
    gameActive = false;
    winningCells = result.cells;
    scores.tttAI.O += 1;
    els.statusText.textContent = "Computer wins!";
    saveScores();
    render();
    updateScoreboard();
    return;
  }

  if (tttBoard.every(Boolean)) {
    gameActive = false;
    scores.tttAI.draws += 1;
    els.statusText.textContent = "It's a draw!";
    saveScores();
    render();
    updateScoreboard();
    return;
  }

  currentPlayer = "X";
  els.statusText.textContent = "Your turn";
  render();
}

function getBestAIMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < tttBoard.length; i++) {
    if (tttBoard[i]) continue;

    tttBoard[i] = "O";
    const score = minimax(tttBoard, 0, false);
    tttBoard[i] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  const result = getGridWinnerOnBoard(board, 3, 3);

  if (result) {
    if (result.winner === "O") return 10 - depth;
    if (result.winner === "X") return depth - 10;
  }

  if (board.every(Boolean)) return 0;

  if (isMaximizing) {
    let best = -Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i]) continue;
      board[i] = "O";
      best = Math.max(best, minimax(board, depth + 1, false));
      board[i] = null;
    }

    return best;
  } else {
    let best = Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i]) continue;
      board[i] = "X";
      best = Math.min(best, minimax(board, depth + 1, true));
      board[i] = null;
    }

    return best;
  }
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
    els.statusText.textContent = "It's a draw!";
    saveScores();
    render();
    updateScoreboard();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  els.statusText.textContent = `${currentPlayer}'s turn`;
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

/* ---------------- Chess ---------------- */

function createChessBoard() {
  return [
    ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
    ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
  ];
}

function cloneChessBoard(board) {
  return board.map(row => row.slice());
}

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function pieceColor(piece) {
  return piece ? piece[0] : null;
}

function pieceType(piece) {
  return piece ? piece[1] : null;
}

function isSquareAttacked(board, r, c, byColor) {
  const enemy = byColor;

  // Pawns
  const pawnDir = enemy === "w" ? -1 : 1;
  const pawnRow = r - pawnDir;
  for (const dc of [-1, 1]) {
    const pc = c + dc;
    if (inBounds(pawnRow, pc) && board[pawnRow][pc] === `${enemy}P`) return true;
  }

  // Knights
  const knightOffsets = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];
  for (const [dr, dc] of knightOffsets) {
    const rr = r + dr, cc = c + dc;
    if (inBounds(rr, cc) && board[rr][cc] === `${enemy}N`) return true;
  }

  // Bishops / Queens diagonals
  const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  for (const [dr, dc] of diagDirs) {
    let rr = r + dr, cc = c + dc;
    while (inBounds(rr, cc)) {
      const p = board[rr][cc];
      if (p) {
        if (pieceColor(p) === enemy && (pieceType(p) === "B" || pieceType(p) === "Q")) return true;
        break;
      }
      rr += dr;
      cc += dc;
    }
  }

  // Rooks / Queens orthogonals
  const lineDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of lineDirs) {
    let rr = r + dr, cc = c + dc;
    while (inBounds(rr, cc)) {
      const p = board[rr][cc];
      if (p) {
        if (pieceColor(p) === enemy && (pieceType(p) === "R" || pieceType(p) === "Q")) return true;
        break;
      }
      rr += dr;
      cc += dc;
    }
  }

  // King
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const rr = r + dr, cc = c + dc;
      if (inBounds(rr, cc) && board[rr][cc] === `${enemy}K`) return true;
    }
  }

  return false;
}

function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === `${color}K`) return { r, c };
    }
  }
  return null;
}

function isInCheck(board, color) {
  const king = findKing(board, color);
  if (!king) return true;
  const enemy = color === "w" ? "b" : "w";
  return isSquareAttacked(board, king.r, king.c, enemy);
}

function generatePseudoMoves(board, r, c) {
  const piece = board[r][c];
  if (!piece) return [];
  const color = pieceColor(piece);
  const type = pieceType(piece);
  const moves = [];
  const enemy = color === "w" ? "b" : "w";

  if (type === "P") {
    const dir = color === "w" ? -1 : 1;
    const startRow = color === "w" ? 6 : 1;

    // forward 1
    const nr1 = r + dir;
    if (inBounds(nr1, c) && !board[nr1][c]) {
      moves.push([nr1, c]);

      // forward 2
      const nr2 = r + dir * 2;
      if (r === startRow && !board[nr2][c]) {
        moves.push([nr2, c]);
      }
    }

    // captures
    for (const dc of [-1, 1]) {
      const nr = r + dir;
      const nc = c + dc;
      if (inBounds(nr, nc) && board[nr][nc] && pieceColor(board[nr][nc]) === enemy) {
        moves.push([nr, nc]);
      }
    }
  }

  if (type === "N") {
    const offsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of offsets) {
      const nr = r + dr, nc = c + dc;
      if (!inBounds(nr, nc)) continue;
      if (!board[nr][nc] || pieceColor(board[nr][nc]) === enemy) moves.push([nr, nc]);
    }
  }

  const slideDirs = {
    B: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
    R: [[-1, 0], [1, 0], [0, -1], [0, 1]],
    Q: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]
  };

  if (slideDirs[type]) {
    for (const [dr, dc] of slideDirs[type]) {
      let nr = r + dr, nc = c + dc;
      while (inBounds(nr, nc)) {
        if (!board[nr][nc]) {
          moves.push([nr, nc]);
        } else {
          if (pieceColor(board[nr][nc]) === enemy) moves.push([nr, nc]);
          break;
        }
        nr += dr;
        nc += dc;
      }
    }
  }

  if (type === "K") {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (!inBounds(nr, nc)) continue;
        if (!board[nr][nc] || pieceColor(board[nr][nc]) === enemy) moves.push([nr, nc]);
      }
    }
  }

  return moves;
}

function generateLegalChessMoves(board, r, c) {
  const piece = board[r][c];
  if (!piece || pieceColor(piece) !== currentPlayer) return [];

  const color = pieceColor(piece);
  const type = pieceType(piece);
  const pseudo = generatePseudoMoves(board, r, c);

  const legal = [];
  for (const [nr, nc] of pseudo) {
    const copy = cloneChessBoard(board);
    copy[nr][nc] = copy[r][c];
    copy[r][c] = null;

    // promotion to queen
    if (type === "P") {
      if ((color === "w" && nr === 0) || (color === "b" && nr === 7)) {
        copy[nr][nc] = `${color}Q`;
      }
    }

    if (!isInCheck(copy, color)) legal.push({ r: nr, c: nc });
  }

  return legal;
}

function getAllLegalChessMoves(board, color) {
  const prev = currentPlayer;
  currentPlayer = color;

  const moves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] && pieceColor(board[r][c]) === color) {
        const legal = generateLegalChessMoves(board, r, c);
        for (const m of legal) moves.push({ from: { r, c }, to: m });
      }
    }
  }

  currentPlayer = prev;
  return moves;
}

function handleChessClick(r, c) {
  if (!gameActive) return;

  const piece = chessBoard[r][c];

  if (!selectedChess) {
    if (piece && pieceColor(piece) === currentPlayer) {
      selectedChess = { r, c };
      legalChessMoves = generateLegalChessMoves(chessBoard, r, c);
      render();
    }
    return;
  }

  // clicking own piece changes selection
  if (piece && pieceColor(piece) === currentPlayer) {
    selectedChess = { r, c };
    legalChessMoves = generateLegalChessMoves(chessBoard, r, c);
    render();
    return;
  }

  const target = legalChessMoves.find(m => m.r === r && m.c === c);
  if (!target) {
    selectedChess = null;
    legalChessMoves = [];
    render();
    return;
  }

  performChessMove(selectedChess.r, selectedChess.c, r, c);
}

function performChessMove(fr, fc, tr, tc) {
  const piece = chessBoard[fr][fc];
  const color = pieceColor(piece);
  const type = pieceType(piece);

  chessBoard[tr][tc] = piece;
  chessBoard[fr][fc] = null;

  // pawn promotion
  if (type === "P") {
    if ((color === "w" && tr === 0) || (color === "b" && tr === 7)) {
      chessBoard[tr][tc] = `${color}Q`;
    }
  }

  selectedChess = null;
  legalChessMoves = [];

  // switch turns
  currentPlayer = color === "w" ? "b" : "w";
  finishChessTurn(color);
  render();
}

function finishChessTurn(lastMoverColor) {
  const opponent = currentPlayer;
  const inCheck = isInCheck(chessBoard, opponent);
  const allMoves = getAllLegalChessMoves(chessBoard, opponent);

  if (allMoves.length === 0) {
    gameActive = false;

    if (inCheck) {
      const winnerKey = lastMoverColor === "w" ? "X" : "O";
      scores.chess[winnerKey] += 1;
      els.statusText.textContent = `${colorName(lastMoverColor)} wins by checkmate!`;
    } else {
      scores.chess.draws += 1;
      els.statusText.textContent = "Stalemate! It's a draw.";
    }

    saveScores();
    updateScoreboard();
    return;
  }

  if (inCheck) {
    els.statusText.textContent = `${colorName(opponent)} is in check`;
  } else {
    els.statusText.textContent = `${colorName(opponent)} to move`;
  }
}
/* ---------------- End Chess ---------------- */

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

function applyTheme() {
  document.body.className = currentTheme + "-theme";
  const themeLabels = {
    dark: "🌙 Dark",
    light: "☀️ Light",
    marvel: "🔴 Marvel"
  };
  els.themeBtn.textContent = themeLabels[currentTheme] || "Dark";
  localStorage.setItem("neoArcadeTheme", currentTheme);
}

els.themeBtn.addEventListener("click", () => {
  const themes = ["dark", "light", "marvel"];
  const currentIndex = themes.indexOf(currentTheme);
  currentTheme = themes[(currentIndex + 1) % themes.length];
  applyTheme();
});

// Start the game
applyTheme();
initBoard();
