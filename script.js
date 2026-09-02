// ------------------------------
// Game Hub: TicTacToe + Chess
// ------------------------------
const modeSelect = document.getElementById("modeSelect");
const difficultyWrap = document.getElementById("difficultyWrap");
const difficultySelect = document.getElementById("difficultySelect");
const resetBtn = document.getElementById("resetBtn");
const statusEl = document.getElementById("status");
const thinkingEl = document.getElementById("aiThinking");

const tttBoardEl = document.getElementById("tttBoard");
const chessBoardEl = document.getElementById("chessBoard");

const capturedPanel = document.getElementById("capturedPanel");
const whiteCapturedEl = document.getElementById("whiteCaptured");
const blackCapturedEl = document.getElementById("blackCaptured");

// -------- Tic Tac Toe state --------
let ttt = Array(9).fill(null);
let tttTurn = "X";
let tttOver = false;

// -------- Chess state --------
let chessBoard = [];
let chessTurn = "w"; // w | b
let selected = null; // {r,c}
let whiteCaptured = [];
let blackCaptured = [];
let chessOver = false;

const PIECE_UNICODE = {
  wp: "♙", wr: "♖", wn: "♘", wb: "♗", wq: "♕", wk: "♔",
  bp: "♟", br: "♜", bn: "♞", bb: "♝", bq: "♛", bk: "♚"
};

function pieceKey(p){ return p ? `${p.color}${p.type}` : null; }
function inBounds(r,c){ return r>=0 && r<8 && c>=0 && c<8; }
function cloneBoard(b){ return b.map(row => row.map(cell => cell ? {...cell} : null)); }

function setStatus(msg){ statusEl.textContent = msg; }

// ------------------------------
// Mode handling
// ------------------------------
function currentMode(){ return modeSelect.value; }

function updateModeUI() {
  const mode = currentMode();
  const aiMode = mode === "tttAI" || mode === "chessAI";
  difficultyWrap.style.display = aiMode ? "inline-flex" : "none";

  if (mode.startsWith("ttt")) {
    tttBoardEl.style.display = "grid";
    chessBoardEl.style.display = "none";
    capturedPanel.style.display = "none";
    thinkingEl.style.display = "none";
  } else {
    tttBoardEl.style.display = "none";
    chessBoardEl.style.display = "grid";
    capturedPanel.style.display = "grid";
  }
}

// ------------------------------
// Tic Tac Toe
// ------------------------------
const TTT_WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function tttWinner(board){
  for(const [a,b,c] of TTT_WINS){
    if(board[a] && board[a]===board[b] && board[b]===board[c]) return board[a];
  }
  if(board.every(Boolean)) return "draw";
  return null;
}

function renderTTT(){
  tttBoardEl.innerHTML = "";
  ttt.forEach((v,i)=>{
    const cell = document.createElement("button");
    cell.className = "ttt-cell";
    cell.textContent = v || "";
    cell.onclick = ()=> onTttClick(i);
    tttBoardEl.appendChild(cell);
  });

  const w = tttWinner(ttt);
  if (w === "draw") setStatus("Tic-Tac-Toe: Draw!");
  else if (w) setStatus(`Tic-Tac-Toe: ${w} wins!`);
  else setStatus(`Tic-Tac-Toe: ${tttTurn}'s turn`);
}

function onTttClick(i){
  if (!currentMode().startsWith("ttt")) return;
  if (tttOver || ttt[i]) return;
  ttt[i] = tttTurn;
  const w = tttWinner(ttt);
  if (w) {
    tttOver = true;
    renderTTT();
    return;
  }
  tttTurn = tttTurn === "X" ? "O" : "X";
  renderTTT();

  if (currentMode()==="tttAI" && tttTurn==="O" && !tttOver) {
    thinkingEl.style.display = "block";
    setTimeout(()=>{
      tttAIMove();
      thinkingEl.style.display = "none";
    }, aiDelayForDifficulty(difficultySelect.value));
  }
}

function tttAIMove(){
  const empty = ttt.map((v,i)=>v?null:i).filter(v=>v!==null);
  if(!empty.length) return;
  const diff = difficultySelect.value;

  let pick;
  if (diff==="easy" && Math.random()<0.55) {
    pick = empty[Math.floor(Math.random()*empty.length)];
  } else {
    // quick optimal move preference
    pick = bestTttMove();
  }

  ttt[pick] = "O";
  const w = tttWinner(ttt);
  if (w) tttOver = true;
  else tttTurn = "X";
  renderTTT();
}

function bestTttMove(){
  let bestScore = -Infinity, move = null;
  for(let i=0;i<9;i++){
    if(!ttt[i]){
      ttt[i]="O";
      const score=minimaxTTT(ttt,false);
      ttt[i]=null;
      if(score>bestScore){bestScore=score; move=i;}
    }
  }
  return move ?? ttt.findIndex(x=>!x);
}
function minimaxTTT(board,isMax){
  const w=tttWinner(board);
  if(w==="O") return 10;
  if(w==="X") return -10;
  if(w==="draw") return 0;
  if(isMax){
    let best=-Infinity;
    for(let i=0;i<9;i++) if(!board[i]){
      board[i]="O";
      best=Math.max(best,minimaxTTT(board,false));
      board[i]=null;
    }
    return best;
  }else{
    let best=Infinity;
    for(let i=0;i<9;i++) if(!board[i]){
      board[i]="X";
      best=Math.min(best,minimaxTTT(board,true));
      board[i]=null;
    }
    return best;
  }
}

// ------------------------------
// Chess setup + rendering
// ------------------------------
function initChess(){
  chessBoard = Array.from({length:8},()=>Array(8).fill(null));

  const back = ["r","n","b","q","k","b","n","r"];
  for(let c=0;c<8;c++){
    chessBoard[0][c] = {color:"b", type:back[c]};
    chessBoard[1][c] = {color:"b", type:"p"};
    chessBoard[6][c] = {color:"w", type:"p"};
    chessBoard[7][c] = {color:"w", type:back[c]};
  }

  chessTurn = "w";
  selected = null;
  whiteCaptured = [];
  blackCaptured = [];
  chessOver = false;
  renderCaptured();
}

function renderCaptured(){
  whiteCapturedEl.innerHTML = whiteCaptured.map(p=>PIECE_UNICODE[pieceKey(p)]).join(" ");
  blackCapturedEl.innerHTML = blackCaptured.map(p=>PIECE_UNICODE[pieceKey(p)]).join(" ");
}

function renderChess(){
  chessBoardEl.innerHTML = "";
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const cell = document.createElement("div");
      cell.className = "chess-cell " + ((r+c)%2===0?"light":"dark");
      if(selected && selected.r===r && selected.c===c) cell.classList.add("selected");

      const p = chessBoard[r][c];
      cell.textContent = p ? PIECE_UNICODE[pieceKey(p)] : "";
      cell.onclick = ()=>onChessClick(r,c);
      chessBoardEl.appendChild(cell);
    }
  }
  setStatus(chessOver ? "Chess: Game over" : `Chess: ${chessTurn==="w"?"White":"Black"} to move`);
}

function onChessClick(r,c){
  const mode = currentMode();
  if (!mode.startsWith("chess") || chessOver) return;

  // in chessAI, human plays white only
  if (mode==="chessAI" && chessTurn==="b") return;

  const piece = chessBoard[r][c];
  if (!selected) {
    if (piece && piece.color===chessTurn) selected={r,c};
    renderChess();
    return;
  }

  const from = selected;
  const moves = getPseudoMoves(chessBoard, from.r, from.c);
  const legal = moves.find(m=>m.r===r && m.c===c);

  if (!legal) {
    if (piece && piece.color===chessTurn) selected={r,c};
    else selected=null;
    renderChess();
    return;
  }

  makeMove(chessBoard, {fromR:from.r, fromC:from.c, toR:r, toC:c}, true);
  selected = null;
  chessTurn = chessTurn==="w" ? "b" : "w";
  renderChess();

  if (mode==="chessAI" && chessTurn==="b" && !chessOver) {
    aiChessMove();
  }
}

// ------------------------------
// Chess move logic (pseudo-legal)
// ------------------------------
function getPseudoMoves(board, r, c){
  const p = board[r][c];
  if(!p) return [];
  const moves = [];

  const push = (nr,nc)=>{
    if(!inBounds(nr,nc)) return;
    const t = board[nr][nc];
    if(!t || t.color!==p.color) moves.push({r:nr,c:nc});
  };

  if(p.type==="p"){
    const dir = p.color==="w" ? -1 : 1;
    const start = p.color==="w" ? 6 : 1;
    if(inBounds(r+dir,c) && !board[r+dir][c]) moves.push({r:r+dir,c});
    if(r===start && !board[r+dir][c] && !board[r+2*dir][c]) moves.push({r:r+2*dir,c});
    for(const dc of [-1,1]){
      const nr=r+dir, nc=c+dc;
      if(inBounds(nr,nc) && board[nr][nc] && board[nr][nc].color!==p.color) moves.push({r:nr,c:nc});
    }
  } else if (p.type==="n"){
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>push(r+dr,c+dc));
  } else if (p.type==="k"){
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
      if(dr||dc) push(r+dr,c+dc);
    }
  } else {
    const dirs = [];
    if (p.type==="b" || p.type==="q") dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
    if (p.type==="r" || p.type==="q") dirs.push([-1,0],[1,0],[0,-1],[0,1]);

    for(const [dr,dc] of dirs){
      let nr=r+dr,nc=c+dc;
      while(inBounds(nr,nc)){
        if(!board[nr][nc]) moves.push({r:nr,c:nc});
        else{
          if(board[nr][nc].color!==p.color) moves.push({r:nr,c:nc});
          break;
        }
        nr+=dr; nc+=dc;
      }
    }
  }
  return moves;
}

function makeMove(board, mv, realMove=false){
  const piece = board[mv.fromR][mv.fromC];
  const target = board[mv.toR][mv.toC];

  if (target && realMove) {
    if (target.color==="w") whiteCaptured.push(target);
    else blackCaptured.push(target);
    if (target.type==="k") chessOver = true;
    renderCaptured();
  }

  board[mv.toR][mv.toC] = piece;
  board[mv.fromR][mv.fromC] = null;

  // promotion to queen
  if (piece.type==="p" && (mv.toR===0 || mv.toR===7)) {
    piece.type = "q";
  }
}

function getAllMovesForColor(board, color){
  const moves = [];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p = board[r][c];
    if(!p || p.color!==color) continue;
    const pm = getPseudoMoves(board,r,c);
    pm.forEach(m=>moves.push({fromR:r,fromC:c,toR:m.r,toC:m.c}));
  }
  return moves;
}

// ------------------------------
// Chess AI
// ------------------------------
const pieceValue = { p:100, n:320, b:330, r:500, q:900, k:20000 };

function evaluate(board){
  let score = 0;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p = board[r][c];
    if(!p) continue;
    const v = pieceValue[p.type] || 0;
    // AI is black => maximize black advantage
    score += (p.color==="b" ? v : -v);
  }
  return score;
}

function movePriority(board, mv){
  // cheap move ordering: captures first, king captures highest
  const t = board[mv.toR][mv.toC];
  if(!t) return 0;
  return (pieceValue[t.type] || 0) + (t.type==="k" ? 50000 : 0);
}

function minimax(board, depth, alpha, beta, maximizing){
  if(depth===0) return {score:evaluate(board), move:null};

  const color = maximizing ? "b" : "w";
  let moves = getAllMovesForColor(board, color);

  if(!moves.length) return {score:evaluate(board), move:null};

  // order moves (hard-mode improvement base)
  moves = moves.sort((a,b)=>movePriority(board,b)-movePriority(board,a));

  let bestMove = null;

  if(maximizing){
    let best = -Infinity;
    for(const mv of moves){
      const b2 = cloneBoard(board);
      makeMove(b2,mv,false);
      const val = minimax(b2, depth-1, alpha, beta, false).score;
      if(val>best){ best=val; bestMove=mv; }
      alpha = Math.max(alpha,val);
      if(beta<=alpha) break;
    }
    return {score:best, move:bestMove};
  } else {
    let best = Infinity;
    for(const mv of moves){
      const b2 = cloneBoard(board);
      makeMove(b2,mv,false);
      const val = minimax(b2, depth-1, alpha, beta, true).score;
      if(val<best){ best=val; bestMove=mv; }
      beta = Math.min(beta,val);
      if(beta<=alpha) break;
    }
    return {score:best, move:bestMove};
  }
}

function aiDelayForDifficulty(diff){
  if(diff==="easy") return 300;
  if(diff==="medium") return 650;
  return 950;
}

function depthForDifficulty(diff){
  if(diff==="easy") return 1;
  if(diff==="medium") return 2;
  return 3;
}

function aiPickMoveWithPersonality(board, diff){
  const legal = getAllMovesForColor(board, "b");
  if(!legal.length) return null;

  // score all moves at small lookahead for personality shaping
  const depth = depthForDifficulty(diff);
  const scored = legal.map(mv=>{
    const b2 = cloneBoard(board);
    makeMove(b2,mv,false);
    const sc = minimax(b2, Math.max(0,depth-1), -Infinity, Infinity, false).score;
    return {mv, sc};
  }).sort((a,b)=>b.sc-a.sc);

  if(diff==="hard") return scored[0].mv;

  if(diff==="medium"){
    if(Math.random()<0.75) return scored[0].mv;
    return (scored[1]?.mv || scored[0].mv);
  }

  // easy
  if(Math.random()<0.55){
    const k = Math.min(legal.length, 4);
    return legal[Math.floor(Math.random()*k)];
  }
  return scored[0].mv;
}

function aiChessMove(){
  thinkingEl.style.display = "block";
  const diff = difficultySelect.value;
  const wait = aiDelayForDifficulty(diff);

  setTimeout(()=>{
    if(chessOver || currentMode()!=="chessAI" || chessTurn!=="b"){
      thinkingEl.style.display = "none";
      return;
    }

    const mv = aiPickMoveWithPersonality(chessBoard, diff);
    if(!mv){
      thinkingEl.style.display = "none";
      return;
    }

    makeMove(chessBoard, mv, true);
    chessTurn = "w";
    renderChess();
    thinkingEl.style.display = "none";
  }, wait);
}

// ------------------------------
// Reset / init
// ------------------------------
function resetCurrentMode(){
  const mode = currentMode();

  if (mode.startsWith("ttt")) {
    ttt = Array(9).fill(null);
    tttTurn = "X";
    tttOver = false;
    renderTTT();
  } else {
    initChess();
    renderChess();
  }
}

modeSelect.addEventListener("change", ()=>{
  updateModeUI();
  resetCurrentMode();
});

difficultySelect.addEventListener("change", ()=>{
  // no immediate action needed; used at AI turn time
});

resetBtn.addEventListener("click", resetCurrentMode);

// boot
updateModeUI();
resetCurrentMode();