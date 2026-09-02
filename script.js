const modeSelect = document.getElementById("modeSelect");
const difficultySelect = document.getElementById("difficultySelect");
const themeSelect = document.getElementById("themeSelect");

const gameTypePills = document.getElementById("gameTypePills");
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

/* theme picker */
const themePicker = document.getElementById("themePicker");
const themeTrigger = document.getElementById("themeTrigger");
const themeMenu = document.getElementById("themeMenu");
const themeCurrentIcon = document.getElementById("themeCurrentIcon");
const themeCurrentText = document.getElementById("themeCurrentText");

const hubState = {
  game: "ttt3",
  opponent: "ai",
  difficulty: "medium",
  timer: "off", // strict default off
  theme: "dark"
};

let scoreA = 0, scoreB = 0, scoreD = 0, streak = 0;
let moveHistory = [];

/* ---------------- state ---------------- */
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
function persistHub() {
  localStorage.setItem("hubState", JSON.stringify(hubState));
  const hash = `#/${hubState.game}?vs=${hubState.opponent}&diff=${hubState.difficulty}&timer=${hubState.timer}&theme=${hubState.theme}`;
  history.replaceState(null, "", hash);
}
function loadHub() {
  const saved = JSON.parse(localStorage.getItem("hubState") || "null");
  if (saved) Object.assign(hubState, saved);
  // hard enforce timer default off if invalid
  if (!["off","15","30","45","60"].includes(hubState.timer)) hubState.timer = "off";
}
function setActive(group, key, value) {
  group?.querySelectorAll("[data-" + key + "]").forEach(el => {
    el.classList.toggle("active", el.dataset[key] === value);
  });
}

/* ---------------- theme ---------------- */
function themeMeta(theme){
  if (theme === "light") return { icon: "☀️", text: "Light" };
  if (theme === "itachi") return { icon: "✇", text: "Itachi" };
  return { icon: "🌙", text: "Dark" };
}
function syncThemePicker(theme){
  const m = themeMeta(theme);
  themeCurrentIcon.textContent = m.icon;
  themeCurrentText.textContent = m.text;
  themeMenu.querySelectorAll(".theme-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}
function setTheme(theme){
  hubState.theme = theme;
  themeSelect.value = theme;
  document.body.setAttribute("data-theme", theme);
  syncThemePicker(theme);
  persistHub();
}
themeTrigger.addEventListener("click", (e) => {
  e.stopPropagation();
  themePicker.classList.toggle("open");
  themeTrigger.setAttribute("aria-expanded", String(themePicker.classList.contains("open")));
});
themeMenu.addEventListener("click", (e) => {
  const btn = e.target.closest(".theme-item");
  if (!btn) return;
  setTheme(btn.dataset.theme);
  themePicker.classList.remove("open");
});
document.addEventListener("click", () => themePicker.classList.remove("open"));

/* ---------------- score ---------------- */
function scoreKey() { return `scores_${modeSelect.value}_${difficultySelect.value}`; }
function renderScores() {
  scoreAEl.textContent = scoreA;
  scoreBEl.textContent = scoreB;
  scoreDEl.textContent = scoreD;
  streakBadge.textContent = `🔥 ${streak}`;
}
function persistScores(){ localStorage.setItem(scoreKey(), JSON.stringify({ scoreA, scoreB, scoreD, streak })); }
function loadScores() {
  const s = JSON.parse(localStorage.getItem(scoreKey()) || "null");
  if (s) { scoreA = s.scoreA || 0; scoreB = s.scoreB || 0; scoreD = s.scoreD || 0; streak = s.streak || 0; }
  else { scoreA = scoreB = scoreD = streak = 0; }
  renderScores();
}
function updateStreak(winA){ streak = winA ? streak + 1 : 0; }

/* ---------------- timer + radial ---------------- */
let turnTimer = null;
let turnTimeLeft = 0;
let turnTimeTotal = 0;
const CIRC = 2 * Math.PI * 50; // r=50

function stopTurnTimer(){
  if (turnTimer) clearInterval(turnTimer);
  turnTimer = null;
}
function showTimerInactive(){
  radialWrap.classList.add("hidden");
  statusPill.classList.remove("hidden");
}
function showTimerActive(){
  statusPill.classList.add("hidden");
  radialWrap.classList.remove("hidden");
}
function renderRadial(){
  if (!turnTimeTotal) return;
  const pct = Math.max(0, turnTimeLeft / turnTimeTotal);
  ringFg.style.strokeDasharray = String(CIRC);
  ringFg.style.strokeDashoffset = String(CIRC * (1 - pct));
  radialText.textContent = Math.max(0, turnTimeLeft).toFixed(1);
}
function startTurnTimer(){
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

/* ---------------- win overlay ---------------- */
function showWinScreen(msg){
  winMessage.textContent = msg.toUpperCase();
  winOverlay.classList.remove("hidden");
}
function hideWinScreen(){
  winOverlay.classList.add("hidden");
}
winRestartBtn.addEventListener("click", () => { hideWinScreen(); initBoard(); });
winOverlay.addEventListener("click", (e) => { if (e.target === winOverlay) hideWinScreen(); });

/* ---------------- TTT ---------------- */
let tttBoard = [], tttSize = 3, tttWinLen = 3, tttTurn = "X", tttOver = false, tttWinningCells = [], tttSnapshots = [];

function clearWinLine(){ winLineSvg.innerHTML = ""; }
function drawWinLineTTT(line){
  if (!line.length) return;
  const s = tttSize, a = line[0], b = line[line.length - 1];
  const ar = Math.floor(a/s), ac = a%s, br = Math.floor(b/s), bc = b%s;
  const x1 = ((ac+.5)/s)*100, y1 = ((ar+.5)/s)*100, x2 = ((bc+.5)/s)*100, y2 = ((br+.5)/s)*100;
  winLineSvg.innerHTML = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>`;
}
function buildTTTLines(size, len){
  const lines=[];
  for(let r=0;r<size;r++) for(let c=0;c<=size-len;c++){ const l=[]; for(let k=0;k<len;k++) l.push(r*size+c+k); lines.push(l); }
  for(let c=0;c<size;c++) for(let r=0;r<=size-len;r++){ const l=[]; for(let k=0;k<len;k++) l.push((r+k)*size+c); lines.push(l); }
  for(let r=0;r<=size-len;r++) for(let c=0;c<=size-len;c++){ const l=[]; for(let k=0;k<len;k++) l.push((r+k)*size+(c+k)); lines.push(l); }
  for(let r=0;r<=size-len;r++) for(let c=len-1;c<size;c++){ const l=[]; for(let k=0;k<len;k++) l.push((r+k)*size+(c-k)); lines.push(l); }
  return lines;
}
function getTTTResult(board, size = tttSize, winLen = tttWinLen){
  for(const line of buildTTTLines(size, winLen)){
    const first = board[line[0]];
    if (first && line.every(i => board[i] === first)) return { winner:first, line };
  }
  if (board.every(Boolean)) return { winner:"draw", line:[] };
  return { winner:null, line:[] };
}
function getEmptyCells(board){
  const out=[]; for(let i=0;i<board.length;i++) if(!board[i]) out.push(i); return out;
}
function saveTTTSnapshot(){
  tttSnapshots.push({ board:[...tttBoard], turn:tttTurn, over:tttOver, win:[...tttWinningCells], scoreA, scoreB, scoreD, streak });
}
function initTTT(size){
  tttSize = size; tttWinLen = size===3 ? 3 : 4;
  tttBoard = Array(size*size).fill(null);
  tttTurn = "X"; tttOver = false; tttWinningCells = []; tttSnapshots = [];
  clearWinLine();
  renderTTT();
  startTurnTimer();
}
function renderTTT(){
  tttBoardEl.classList.remove("hidden");
  chessBoardEl.classList.add("hidden");
  capturedTop.classList.add("hidden");
  capturedBottom.classList.add("hidden");

  tttBoardEl.innerHTML = "";
  tttBoardEl.style.gridTemplateColumns = `repeat(${tttSize}, minmax(62px, 1fr))`;

  tttBoard.forEach((v, i) => {
    const cell = document.createElement("button");
    cell.className = "ttt-cell";
    if (v==="X") cell.classList.add("x");
    if (v==="O") cell.classList.add("o");
    if (tttWinningCells.includes(i)) cell.classList.add("win");
    cell.textContent = v || "";
    cell.dataset.ghost = tttTurn;
    cell.addEventListener("mouseenter", () => {
      const aiMode = modeSelect.value.endsWith("-ai");
      if (!v && !tttOver && !(aiMode && tttTurn==="O")) cell.classList.add("ghost");
    });
    cell.addEventListener("mouseleave", () => cell.classList.remove("ghost"));
    cell.addEventListener("click", () => onTTTClick(i));
    tttBoardEl.appendChild(cell);
  });

  const res = getTTTResult(tttBoard);
  if (hubState.timer === "off") {
    statusPill.textContent = res.winner==="draw" ? "Draw" : res.winner ? `${res.winner} Wins` : `${tttTurn}'s Turn`;
  }
}
function tttAIDelay(diff){ return diff==="easy" ? 260 : diff==="medium" ? 500 : 760; }

function minimaxTTT(board, size, winLen, depth, maximizing){
  const res = getTTTResult(board,size,winLen);
  if(res.winner==="O") return { score:1000+depth };
  if(res.winner==="X") return { score:-1000-depth };
  if(res.winner==="draw" || depth===0) return { score:0 };

  const empties = getEmptyCells(board);
  let best = { score:maximizing ? -Infinity : Infinity, move:null };

  for(const i of empties){
    board[i] = maximizing ? "O" : "X";
    const r = minimaxTTT(board,size,winLen,depth-1,!maximizing);
    board[i] = null;
    if(maximizing ? r.score > best.score : r.score < best.score) best = { score:r.score, move:i };
  }
  return best;
}
function aiTTTMove(){
  if (tttOver) return;
  const empties = getEmptyCells(tttBoard);
  if (!empties.length) return;

  saveTTTSnapshot();
  let move = empties[Math.floor(Math.random()*empties.length)];
  if (difficultySelect.value !== "easy") {
    const depth = tttSize===3 ? Math.min(empties.length, 7) : (difficultySelect.value==="medium" ? 2 : 3);
    const best = minimaxTTT(tttBoard, tttSize, tttWinLen, depth, true);
    if (best.move != null) move = best.move;
  }

  tttBoard[move] = "O";
  const res = getTTTResult(tttBoard);
  if (res.winner) return finishTTT(res.winner, res.line);

  tttTurn = "X";
  renderTTT();
  startTurnTimer();
}
function finishTTT(winner, line){
  stopTurnTimer();
  tttOver = true;
  tttWinningCells = [...line];
  drawWinLineTTT(line);

  const aiMode = modeSelect.value.endsWith("-ai");
  if (winner==="X"){ scoreA++; updateStreak(aiMode); showWinScreen(aiMode ? "You Win!" : "X Wins!"); }
  else if (winner==="O"){ scoreB++; updateStreak(false); showWinScreen(aiMode ? "Computer Wins!" : "O Wins!"); }
  else { scoreD++; showWinScreen("Draw"); }

  persistScores(); renderScores(); renderTTT();
}
function onTTTClick(i){
  const aiMode = modeSelect.value.endsWith("-ai");
  if (tttOver || tttBoard[i]) return;
  if (aiMode && tttTurn==="O") return;

  saveTTTSnapshot();
  tttBoard[i] = tttTurn;
  const res = getTTTResult(tttBoard);
  if (res.winner) return finishTTT(res.winner, res.line);

  tttTurn = tttTurn==="X" ? "O" : "X";
  renderTTT();
  startTurnTimer();

  if (aiMode && tttTurn==="O"){
    if (hubState.timer==="off") statusPill.textContent = "AI Thinking...";
    setTimeout(() => aiTTTMove(), tttAIDelay(difficultySelect.value));
  }
}

/* ---------------- Chess ---------------- */
let chessBoard = [], chessTurn = "w", chessSelected = null, chessOver = false, whiteCaptured = [], blackCaptured = [], chessSnapshots = [];
const CHESS_U = { wp:"♙",wr:"♖",wn:"♘",wb:"♗",wq:"♕",wk:"♔", bp:"♟",br:"♜",bn:"♞",bb:"♝",bq:"♛",bk:"♚" };
const PIECE_VAL = { p:100,n:320,b:330,r:500,q:900,k:20000 };

function inBounds(r,c){ return r>=0&&r<8&&c>=0&&c<8; }
function cloneBoard(b){ return b.map(row=>row.map(cell=>cell?{...cell}:null)); }
function saveChessSnapshot(){
  chessSnapshots.push({ board:cloneBoard(chessBoard), turn:chessTurn, selected:chessSelected?{...chessSelected}:null, over:chessOver, whiteCaptured:[...whiteCaptured], blackCaptured:[...blackCaptured], scoreA, scoreB, scoreD, streak });
}
function initChess(){
  chessBoard = Array.from({length:8},()=>Array(8).fill(null));
  const back=["r","n","b","q","k","b","n","r"];
  for(let c=0;c<8;c++){
    chessBoard[0][c]={color:"b",type:back[c]};
    chessBoard[1][c]={color:"b",type:"p"};
    chessBoard[6][c]={color:"w",type:"p"};
    chessBoard[7][c]={color:"w",type:back[c]};
  }
  chessTurn="w"; chessSelected=null; chessOver=false; whiteCaptured=[]; blackCaptured=[]; chessSnapshots=[];
  renderCaptured();
  renderChess();
  startTurnTimer();
}
function renderCaptured(){
  whiteCapturedEl.textContent = whiteCaptured.map(p=>CHESS_U[p.color+p.type]).join(" ");
  blackCapturedEl.textContent = blackCaptured.map(p=>CHESS_U[p.color+p.type]).join(" ");
}
function getPseudoMoves(board,r,c){
  const p=board[r][c]; if(!p) return [];
  const out=[];
  const add=(nr,nc)=>{ if(!inBounds(nr,nc)) return; const t=board[nr][nc]; if(!t||t.color!==p.color) out.push({r:nr,c:nc}); };

  if(p.type==="p"){
    const dir=p.color==="w"?-1:1, start=p.color==="w"?6:1;
    if(inBounds(r+dir,c)&&!board[r+dir][c]) out.push({r:r+dir,c});
    if(r===start&&!board[r+dir][c]&&!board[r+2*dir][c]) out.push({r:r+2*dir,c});
    for(const dc of[-1,1]){
      const nr=r+dir,nc=c+dc;
      if(inBounds(nr,nc)&&board[nr][nc]&&board[nr][nc].color!==p.color) out.push({r:nr,c:nc});
    }
  } else if(p.type==="n"){
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>add(r+dr,c+dc));
  } else if(p.type==="k"){
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) if(dr||dc) add(r+dr,c+dc);
  } else {
    const dirs=[];
    if(p.type==="b"||p.type==="q") dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
    if(p.type==="r"||p.type==="q") dirs.push([-1,0],[1,0],[0,-1],[0,1]);
    for(const [dr,dc] of dirs){
      let nr=r+dr,nc=c+dc;
      while(inBounds(nr,nc)){
        if(!board[nr][nc]) out.push({r:nr,c:nc});
        else{
          if(board[nr][nc].color!==p.color) out.push({r:nr,c:nc});
          break;
        }
        nr+=dr; nc+=dc;
      }
    }
  }
  return out;
}
function renderChess(){
  clearWinLine();
  tttBoardEl.classList.add("hidden");
  chessBoardEl.classList.remove("hidden");
  capturedTop.classList.remove("hidden");
  capturedBottom.classList.remove("hidden");

  chessBoardEl.innerHTML="";
  const hints = chessSelected ? getPseudoMoves(chessBoard,chessSelected.r,chessSelected.c) : [];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const d=document.createElement("div");
    d.className="chess-cell "+(((r+c)%2===0)?"light":"dark");
    if(chessSelected&&chessSelected.r===r&&chessSelected.c===c) d.classList.add("selected");
    if(hints.some(h=>h.r===r&&h.c===c)) d.classList.add("hint");
    const p=chessBoard[r][c];
    d.textContent=p?CHESS_U[p.color+p.type]:"";
    d.addEventListener("click",()=>onChessClick(r,c));
    chessBoardEl.appendChild(d);
  }

  if (hubState.timer === "off") statusPill.textContent = chessOver ? "Game Over" : `${chessTurn==="w"?"White":"Black"}'s Turn`;
}
function moveChess(board,mv,real=false){
  const piece=board[mv.fr][mv.fc];
  const target=board[mv.tr][mv.tc];

  if(target&&real){
    if(target.color==="w") whiteCaptured.push(target); else blackCaptured.push(target);
    if(target.type==="k"){
      chessOver=true;
      if(piece.color==="w"){ scoreA++; updateStreak(modeSelect.value==="chess-ai"); showWinScreen("White Wins"); }
      else { scoreB++; updateStreak(false); showWinScreen("Black Wins"); }
      persistScores(); renderScores();
    }
    renderCaptured();
  }

  board[mv.tr][mv.tc]=piece;
  board[mv.fr][mv.fc]=null;
  if(piece.type==="p"&&(mv.tr===0||mv.tr===7)) piece.type="q";
}
function allMovesForColor(board,color){
  const out=[];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p=board[r][c];
    if(!p||p.color!==color) continue;
    getPseudoMoves(board,r,c).forEach(m=>out.push({fr:r,fc:c,tr:m.r,tc:m.c}));
  }
  return out;
}
function evalChess(board){
  let s=0;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p=board[r][c]; if(!p) continue;
    s+=(p.color==="b"?1:-1)*PIECE_VAL[p.type];
  }
  return s;
}
function minimaxChess(board,depth,alpha,beta,maxing){
  if(depth===0) return {score:evalChess(board),move:null};
  const color=maxing?"b":"w";
  const moves=allMovesForColor(board,color);
  if(!moves.length) return {score:evalChess(board),move:null};

  let bestMove=null;
  if(maxing){
    let best=-Infinity;
    for(const mv of moves){
      const b2=cloneBoard(board);
      moveChess(b2,mv,false);
      const r=minimaxChess(b2,depth-1,alpha,beta,false);
      if(r.score>best){best=r.score;bestMove=mv;}
      alpha=Math.max(alpha,r.score);
      if(beta<=alpha) break;
    }
    return {score:best,move:bestMove};
  }

  let best=Infinity;
  for(const mv of moves){
    const b2=cloneBoard(board);
    moveChess(b2,mv,false);
    const r=minimaxChess(b2,depth-1,alpha,beta,true);
    if(r.score<best){best=r.score;bestMove=mv;}
    beta=Math.min(beta,r.score);
    if(beta<=alpha) break;
  }
  return {score:best,move:bestMove};
}
function chessDepth(){
  const d=difficultySelect.value;
  if(d==="easy") return 1;
  if(d==="medium") return 2;
  return 3;
}
function onChessClick(r,c){
  const aiMode = modeSelect.value==="chess-ai";
  if(chessOver) return;
  if(aiMode&&chessTurn==="b") return;

  const p=chessBoard[r][c];
  if(!chessSelected){
    if(p&&p.color===chessTurn) chessSelected={r,c};
    renderChess(); return;
  }

  const legal=getPseudoMoves(chessBoard,chessSelected.r,chessSelected.c).find(m=>m.r===r&&m.c===c);
  if(!legal){
    chessSelected=(p&&p.color===chessTurn)?{r,c}:null;
    renderChess(); return;
  }

  saveChessSnapshot();
  const mv={fr:chessSelected.r,fc:chessSelected.c,tr:r,tc:c};
  moveChess(chessBoard,mv,true);

  if(chessOver){ renderChess(); stopTurnTimer(); return; }

  chessSelected=null;
  chessTurn=chessTurn==="w"?"b":"w";
  renderChess();
  startTurnTimer();

  if(aiMode&&chessTurn==="b"&&!chessOver){
    if (hubState.timer==="off") statusPill.textContent = "AI Thinking...";
    setTimeout(()=>{
      saveChessSnapshot();
      const res=minimaxChess(chessBoard,chessDepth(),-Infinity,Infinity,true);
      const aiMove=res.move||allMovesForColor(chessBoard,"b")[0];
      if(aiMove){
        moveChess(chessBoard,aiMove,true);
        if(!chessOver) chessTurn="w";
      }
      renderChess();
      startTurnTimer();
    }, 500);
  }
}

/* ---------------- timer expiry fallback ---------------- */
function onTimerExpired(){
  const mode = modeSelect.value;

  if (mode.startsWith("ttt")) {
    const empties = getEmptyCells(tttBoard);
    if (!empties.length || tttOver) return;
    onTTTClick(empties[Math.floor(Math.random()*empties.length)]);
    return;
  }

  if (mode.startsWith("chess") && !chessOver) {
    const moves = allMovesForColor(chessBoard,chessTurn);
    if (!moves.length) return;
    const mv = moves[Math.floor(Math.random()*moves.length)];
    moveChess(chessBoard,mv,true);
    chessTurn = chessTurn==="w"?"b":"w";
    renderChess();
    startTurnTimer();
  }
}

/* ---------------- controls ---------------- */
newGameBtn.addEventListener("click", initBoard);
resetScoreBtn.addEventListener("click", () => {
  scoreA=0; scoreB=0; scoreD=0; streak=0;
  persistScores(); renderScores();
});
undoBtn.addEventListener("click", () => {
  const mode = modeSelect.value;
  if (mode.startsWith("ttt")) {
    const s = tttSnapshots.pop(); if (!s) return;
    tttBoard=[...s.board]; tttTurn=s.turn; tttOver=s.over; tttWinningCells=[...s.win];
    scoreA=s.scoreA; scoreB=s.scoreB; scoreD=s.scoreD; streak=s.streak;
    hideWinScreen(); renderScores(); renderTTT(); startTurnTimer();
    return;
  }
  const s = chessSnapshots.pop(); if(!s) return;
  chessBoard=cloneBoard(s.board); chessTurn=s.turn; chessSelected=s.selected; chessOver=s.over;
  whiteCaptured=[...s.whiteCaptured]; blackCaptured=[...s.blackCaptured];
  scoreA=s.scoreA; scoreB=s.scoreB; scoreD=s.scoreD; streak=s.streak;
  hideWinScreen(); renderCaptured(); renderScores(); renderChess(); startTurnTimer();
});

/* ---------------- hub events ---------------- */
function initHubPills(){
  gameTypePills.addEventListener("click", (e) => {
    const b=e.target.closest("[data-game]"); if(!b) return;
    hubState.game = b.dataset.game;
    modeSelect.value = modeFromHub();
    setActive(gameTypePills,"game",hubState.game);
    persistHub();
    initBoard();
  });

  timerPills.addEventListener("click", (e) => {
    const b=e.target.closest("[data-timer]"); if(!b) return;
    hubState.timer = b.dataset.timer; // off | 15 | 30 | 45 | 60
    setActive(timerPills,"timer",hubState.timer);
    persistHub();
    startTurnTimer();
  });
}

function initBoard(){
  hideWinScreen();
  stopTurnTimer();
  clearWinLine();
  chessOver=false; tttOver=false;

  const mode=modeSelect.value;
  if(mode.startsWith("ttt3")) initTTT(3);
  else if(mode.startsWith("ttt5")) initTTT(5);
  else initChess();

  persistHub();
}

/* ---------------- boot ---------------- */
(function boot(){
  loadHub();

  // strict timer default OFF enforcement on first load + invalid values
  if (!hubState.timer || !["off","15","30","45","60"].includes(hubState.timer)) hubState.timer = "off";

  modeSelect.value = modeFromHub();
  difficultySelect.value = hubState.difficulty || "medium";
  themeSelect.value = hubState.theme || "dark";

  setActive(gameTypePills,"game",hubState.game);
  setActive(timerPills,"timer",hubState.timer); // Off active by default
  setTheme(themeSelect.value);

  loadScores();
  initHubPills();
  showTimerInactive(); // hidden radial at startup when off
  initBoard();
})();