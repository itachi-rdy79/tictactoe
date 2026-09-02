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

let scoreA=0, scoreB=0, scoreD=0;
function renderScores(){ scoreAEl.textContent=scoreA; scoreBEl.textContent=scoreB; scoreDEl.textContent=scoreD; }

function setTheme(v){ document.body.setAttribute("data-theme", v); localStorage.setItem("theme", v); }
themeSelect.addEventListener("change", ()=>setTheme(themeSelect.value));

// Universal win screen
function showWinScreen(message){
  winMessage.textContent = message.toUpperCase();
  winOverlay.classList.remove("hidden");
  winOverlay.classList.remove("show-banner");
  void winOverlay.offsetWidth; // reflow for animation restart
  winOverlay.classList.add("show-banner");
}
function hideWinScreen(){
  winOverlay.classList.add("hidden");
  winOverlay.classList.remove("show-banner");
}
winRestartBtn.addEventListener("click", ()=>{
  hideWinScreen();
  initBoard();
});
winOverlay.addEventListener("click", (e)=>{
  if(e.target===winOverlay){ hideWinScreen(); }
});

// -------- TTT --------
let tttBoard=[], tttSize=3, tttWinLen=3, tttTurn="X", tttOver=false, tttWinCells=[];

function buildLines(size,len){
  const lines=[];
  for(let r=0;r<size;r++) for(let c=0;c<=size-len;c++){ const a=[]; for(let k=0;k<len;k++) a.push(r*size+c+k); lines.push(a); }
  for(let c=0;c<size;c++) for(let r=0;r<=size-len;r++){ const a=[]; for(let k=0;k<len;k++) a.push((r+k)*size+c); lines.push(a); }
  for(let r=0;r<=size-len;r++) for(let c=0;c<=size-len;c++){ const a=[]; for(let k=0;k<len;k++) a.push((r+k)*size+(c+k)); lines.push(a); }
  for(let r=0;r<=size-len;r++) for(let c=len-1;c<size;c++){ const a=[]; for(let k=0;k<len;k++) a.push((r+k)*size+(c-k)); lines.push(a); }
  return lines;
}
function tttWinner(board){
  const lines=buildLines(tttSize,tttWinLen);
  for(const line of lines){
    const v=board[line[0]];
    if(v&&line.every(i=>board[i]===v)) return {winner:v,line};
  }
  if(board.every(Boolean)) return {winner:"draw",line:[]};
  return {winner:null,line:[]};
}
function initTTT(size){
  tttSize=size; tttWinLen=(size===3?3:4);
  tttBoard=Array(size*size).fill(null); tttTurn="X"; tttOver=false; tttWinCells=[];
  renderTTT();
}
function renderTTT(){
  tttBoardEl.style.display="grid"; chessBoardEl.style.display="none"; capturedPanel.style.display="none";
  tttBoardEl.style.gridTemplateColumns=`repeat(${tttSize}, minmax(72px,1fr))`;
  tttBoardEl.innerHTML="";
  tttBoard.forEach((v,i)=>{
    const cell=document.createElement("button");
    cell.className="ttt-cell";
    if(v==="X") cell.classList.add("x");
    if(v==="O") cell.classList.add("o");
    if(tttWinCells.includes(i)) cell.classList.add("win");
    cell.textContent=v||"";
    cell.onclick=()=>onTTTClick(i);
    tttBoardEl.appendChild(cell);
  });
  const r=tttWinner(tttBoard);
  statusEl.textContent=r.winner==="draw"?"Tic-Tac-Toe: Draw!":r.winner?`Tic-Tac-Toe: ${r.winner} wins!`:`Tic-Tac-Toe: ${tttTurn}'s turn`;
}
const aiDelay=d=>d==="easy"?250:d==="medium"?500:760;

function onTTTClick(i){
  const mode=modeSelect.value, ai=(mode==="ttt3-ai"||mode==="ttt5-ai");
  if(tttOver||tttBoard[i]||(ai&&tttTurn==="O")) return;
  tttBoard[i]=tttTurn;
  const r=tttWinner(tttBoard);
  if(r.winner){ finishTTT(r.winner,r.line); return; }
  tttTurn=tttTurn==="X"?"O":"X";
  renderTTT();

  if(ai&&tttTurn==="O"){
    thinkingEl.style.display="block";
    setTimeout(()=>{ tttAIMove(); thinkingEl.style.display="none"; }, aiDelay(difficultySelect.value));
  }
}
function finishTTT(winner,line){
  tttOver=true; tttWinCells=[...line];
  if(winner==="X"){ scoreA++; showWinScreen("X Winner!"); }
  else if(winner==="O"){ scoreB++; showWinScreen("O Winner!"); }
  else { scoreD++; showWinScreen("Draw!"); }
  renderScores(); renderTTT();
}
function tttAIMove(){
  const empty=tttBoard.map((v,i)=>v?null:i).filter(v=>v!==null);
  if(!empty.length) return;

  let chosen=null;
  for(const i of empty){ tttBoard[i]="O"; if(tttWinner(tttBoard).winner==="O"){ chosen=i; tttBoard[i]=null; break;} tttBoard[i]=null; }
  if(chosen===null){ for(const i of empty){ tttBoard[i]="X"; if(tttWinner(tttBoard).winner==="X"){ chosen=i; tttBoard[i]=null; break;} tttBoard[i]=null; } }
  if(chosen===null){
    if(difficultySelect.value==="easy"&&Math.random()<0.6) chosen=empty[Math.floor(Math.random()*empty.length)];
    else chosen=empty[0];
  }
  tttBoard[chosen]="O";

  const r=tttWinner(tttBoard);
  if(r.winner){ finishTTT(r.winner,r.line); return; }
  tttTurn="X"; renderTTT();
}

// -------- Chess --------
let chessBoard=[], chessTurn="w", chessSel=null, chessOver=false;
let whiteCaptured=[], blackCaptured=[];
const P={wp:"♙",wr:"♖",wn:"♘",wb:"♗",wq:"♕",wk:"♔",bp:"♟",br:"♜",bn:"♞",bb:"♝",bq:"♛",bk:"♚"};
const V={p:100,n:320,b:330,r:500,q:900,k:20000};
const key=p=>p?p.color+p.type:null, inb=(r,c)=>r>=0&&r<8&&c>=0&&c<8, clone=b=>b.map(row=>row.map(x=>x?{...x}:null);

function initChess(){
  chessBoard=Array.from({length:8},()=>Array(8).fill(null));
  const back=["r","n","b","q","k","b","n","r"];
  for(let c=0;c<8;c++){
    chessBoard[0][c]={color:"b",type:back[c]}; chessBoard[1][c]={color:"b",type:"p"};
    chessBoard[6][c]={color:"w",type:"p"}; chessBoard[7][c]={color:"w",type:back[c]};
  }
  chessTurn="w"; chessSel=null; chessOver=false; whiteCaptured=[]; blackCaptured=[];
  renderChessCaptured(); renderChess();
}
function renderChessCaptured(){
  whiteCapturedEl.textContent=whiteCaptured.map(x=>P[key(x)]).join(" ");
  blackCapturedEl.textContent=blackCaptured.map(x=>P[key(x)]).join(" ");
}
function renderChess(){
  tttBoardEl.style.display="none"; chessBoardEl.style.display="grid"; capturedPanel.style.display="grid";
  chessBoardEl.innerHTML="";
  const hints=chessSel?pmoves(chessBoard,chessSel.r,chessSel.c):[];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const d=document.createElement("div");
    d.className="chess-cell "+(((r+c)%2===0)?"light":"dark");
    if(chessSel&&chessSel.r===r&&chessSel.c===c) d.classList.add("selected");
    if(hints.some(m=>m.r===r&&m.c===c)) d.classList.add("hint");
    d.textContent=chessBoard[r][c]?P[key(chessBoard[r][c])]:"";
    d.onclick=()=>onChessClick(r,c);
    chessBoardEl.appendChild(d);
  }
  statusEl.textContent=chessOver?"Chess: Game Over":`Chess: ${chessTurn==="w"?"White":"Black"} to move`;
}
function pmoves(b,r,c){
  const p=b[r][c]; if(!p) return [];
  const m=[]; const add=(nr,nc)=>{ if(!inb(nr,nc))return; const t=b[nr][nc]; if(!t||t.color!==p.color)m.push({r:nr,c:nc}); };
  if(p.type==="p"){
    const dir=p.color==="w"?-1:1, st=p.color==="w"?6:1;
    if(inb(r+dir,c)&&!b[r+dir][c]) m.push({r:r+dir,c});
    if(r===st&&!b[r+dir][c]&&!b[r+2*dir][c]) m.push({r:r+2*dir,c});
    for(const dc of [-1,1]){ const nr=r+dir,nc=c+dc; if(inb(nr,nc)&&b[nr][nc]&&b[nr][nc].color!==p.color)m.push({r:nr,c:nc});}
  } else if(p.type==="n"){ [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>add(r+dr,c+dc)); }
  else if(p.type==="k"){ for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) if(dr||dc) add(r+dr,c+dc); }
  else {
    const dirs=[]; if(p.type==="b"||p.type==="q") dirs.push([-1,-1],[-1,1],[1,-1],[1,1]); if(p.type==="r"||p.type==="q") dirs.push([-1,0],[1,0],[0,-1],[0,1]);
    for(const [dr,dc] of dirs){ let nr=r+dr,nc=c+dc; while(inb(nr,nc)){ if(!b[nr][nc]) m.push({r:nr,c:nc}); else { if(b[nr][nc].color!==p.color)m.push({r:nr,c:nc}); break; } nr+=dr; nc+=dc; } }
  }
  return m;
}
function move(b,mv,real=false){
  const p=b[mv.fr][mv.fc], t=b[mv.tr][mv.tc];
  if(t&&real){
    if(t.color==="w") whiteCaptured.push(t); else blackCaptured.push(t);
    if(t.type==="k"){
      chessOver=true;
      if(p.color==="w"){ scoreA++; showWinScreen("White Wins by Checkmate!"); }
      else { scoreB++; showWinScreen("Black Wins by Checkmate!"); }
      renderScores();
    }
    renderChessCaptured();
  }
  b[mv.tr][mv.tc]=p; b[mv.fr][mv.fc]=null;
  if(p.type==="p"&&(mv.tr===0||mv.tr===7)) p.type="q";
}
function allMoves(b,color){
  const arr=[];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(b[r][c]&&b[r][c].color===color) pmoves(b,r,c).forEach(x=>arr.push({fr:r,fc:c,tr:x.r,tc:x.c}));
  return arr;
}
function evalBoard(b){
  let s=0; for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=b[r][c]; if(!p)continue; s+=p.color==="b"?V[p.type]:-V[p.type]; } return s;
}
function mm(b,d,a,bb,maxi){
  if(d===0) return {score:evalBoard(b),mv:null};
  const color=maxi?"b":"w", moves=allMoves(b,color); if(!moves.length) return {score:evalBoard(b),mv:null};
  let best=null;
  if(maxi){
    let v=-Infinity;
    for(const m of moves){ const b2=clone(b); move(b2,m,false); const sc=mm(b2,d-1,a,bb,false).score; if(sc>v){v=sc;best=m;} a=Math.max(a,sc); if(bb<=a) break; }
    return {score:v,mv:best};
  } else {
    let v=Infinity;
    for(const m of moves){ const b2=clone(b); move(b2,m,false); const sc=mm(b2,d-1,a,bb,true).score; if(sc<v){v=sc;best=m;} bb=Math.min(bb,sc); if(bb<=a) break; }
    return {score:v,mv:best};
  }
}
const chessDepth=()=>difficultySelect.value==="easy"?1:difficultySelect.value==="medium"?2:3;

function onChessClick(r,c){
  const mode=modeSelect.value;
  if(chessOver||(mode==="chess-ai"&&chessTurn==="b")) return;
  const p=chessBoard[r][c];
  if(!chessSel){ if(p&&p.color===chessTurn) chessSel={r,c}; renderChess(); return; }
  const legal=pmoves(chessBoard,chessSel.r,chessSel.c).find(x=>x.r===r&&x.c===c);
  if(!legal){ if(p&&p.color===chessTurn) chessSel={r,c}; else chessSel=null; renderChess(); return; }

  move(chessBoard,{fr:chessSel.r,fc:chessSel.c,tr:r,tc:c},true);
  if(chessOver){ renderChess(); return; }

  chessSel=null; chessTurn=chessTurn==="w"?"b":"w"; renderChess();

  if(mode==="chess-ai"&&chessTurn==="b"&&!chessOver){
    thinkingEl.style.display="block";
    setTimeout(()=>{
      const result=mm(chessBoard,chessDepth(),-Infinity,Infinity,true);
      const mv=result.mv||allMoves(chessBoard,"b")[0];
      if(mv){ move(chessBoard,mv,true); if(!chessOver) chessTurn="w"; }
      thinkingEl.style.display="none"; renderChess();
    }, aiDelay(difficultySelect.value));
  }
}

// mode + init
function initBoard(){
  hideWinScreen();
  modeChip.textContent="Mode: "+modeSelect.options[modeSelect.selectedIndex].text;
  difficultySelect.style.display=modeSelect.value.includes("-ai")?"inline-block":"none";
  thinkingEl.style.display="none";

  if(modeSelect.value.startsWith("ttt3")) initTTT(3);
  else if(modeSelect.value.startsWith("ttt5")) initTTT(5);
  else initChess();
}
modeSelect.addEventListener("change", initBoard);
newGameBtn.addEventListener("click", initBoard);
resetScoreBtn.addEventListener("click", ()=>{ scoreA=0;scoreB=0;scoreD=0;renderScores(); });

(function boot(){
  const saved=localStorage.getItem("theme")||"dark";
  themeSelect.value=saved; setTheme(saved);
  renderScores();
  initBoard();
})();