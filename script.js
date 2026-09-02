const modeSelect = document.getElementById("modeSelect");
const difficultyWrap = document.getElementById("difficultyWrap");
const difficultySelect = document.getElementById("difficultySelect");
const themeSelect = document.getElementById("themeSelect");
const newGameBtn = document.getElementById("newGameBtn");
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

const winnerScreen = document.getElementById("winnerScreen");
const winnerText = document.getElementById("winnerText");
const restartBtn = document.getElementById("restartBtn");

let scoreA = 0, scoreB = 0, scoreD = 0;
const renderScores = () => { scoreAEl.textContent=scoreA; scoreBEl.textContent=scoreB; scoreDEl.textContent=scoreD; };

function setTheme(theme){ document.body.setAttribute("data-theme", theme); localStorage.setItem("theme", theme); }
themeSelect.addEventListener("change", ()=>setTheme(themeSelect.value));

function showWinnerScreenMessage(msg){
  winnerText.textContent = msg.toUpperCase();
  winnerScreen.classList.add("show");
}
function hideWinnerScreen(){ winnerScreen.classList.remove("show"); }
restartBtn.addEventListener("click", hideWinnerScreen);
winnerScreen.addEventListener("click", (e)=>{ if(e.target===winnerScreen) hideWinnerScreen(); });

// ----- TTT -----
let tttBoard = [];
let tttSize = 3;
let tttWinLen = 3;
let tttTurn = "X";
let tttOver = false;

function buildWinLines(size, len){
  const lines = [];
  for(let r=0;r<size;r++) for(let c=0;c<=size-len;c++){ const a=[]; for(let k=0;k<len;k++) a.push(r*size+c+k); lines.push(a); }
  for(let c=0;c<size;c++) for(let r=0;r<=size-len;r++){ const a=[]; for(let k=0;k<len;k++) a.push((r+k)*size+c); lines.push(a); }
  for(let r=0;r<=size-len;r++) for(let c=0;c<=size-len;c++){ const a=[]; for(let k=0;k<len;k++) a.push((r+k)*size+(c+k)); lines.push(a); }
  for(let r=0;r<=size-len;r++) for(let c=len-1;c<size;c++){ const a=[]; for(let k=0;k<len;k++) a.push((r+k)*size+(c-k)); lines.push(a); }
  return lines;
}
function tttWinner(board){
  const lines = buildWinLines(tttSize, tttWinLen);
  for(const line of lines){ const v=board[line[0]]; if(v && line.every(i=>board[i]===v)) return v; }
  return board.every(Boolean) ? "draw" : null;
}
function initTTT(size){
  tttSize=size; tttWinLen=(size===3?3:4);
  tttBoard=Array(size*size).fill(null); tttTurn="X"; tttOver=false;
  renderTTT();
}
function renderTTT(){
  tttBoardEl.style.display="grid"; chessBoardEl.style.display="none"; capturedPanel.style.display="none";
  tttBoardEl.innerHTML=""; tttBoardEl.style.gridTemplateColumns=`repeat(${tttSize}, minmax(56px,1fr))`;
  tttBoard.forEach((v,i)=>{
    const cell=document.createElement("button");
    cell.className="ttt-cell"+(v==="X"?" x":v==="O"?" o":"");
    cell.textContent=v||""; cell.onclick=()=>onTTTClick(i);
    tttBoardEl.appendChild(cell);
  });
  const w=tttWinner(tttBoard);
  statusEl.textContent = w==="draw"?"Tic-Tac-Toe: Draw!":w?`Tic-Tac-Toe: ${w} wins!`:`Tic-Tac-Toe: ${tttTurn}'s turn`;
}
const aiDelay = d => d==="easy"?280:d==="medium"?520:760;

function onTTTClick(i){
  const mode=modeSelect.value, aiMode=(mode==="ttt3-ai"||mode==="ttt5-ai");
  if(tttOver||tttBoard[i]||(aiMode&&tttTurn==="O")) return;

  tttBoard[i]=tttTurn;
  const w=tttWinner(tttBoard);
  if(w){ finishTTT(w); return; }

  tttTurn=tttTurn==="X"?"O":"X"; renderTTT();

  if(aiMode && tttTurn==="O"){
    thinkingEl.style.display="inline";
    setTimeout(()=>{ tttAIMove(); thinkingEl.style.display="none"; }, aiDelay(difficultySelect.value));
  }
}
function finishTTT(w){
  tttOver=true;
  if(w==="X"){ scoreA++; showWinnerScreenMessage("X Winner!"); }
  else if(w==="O"){ scoreB++; showWinnerScreenMessage("O Winner!"); }
  else { scoreD++; showWinnerScreenMessage("Draw!"); }
  renderScores(); renderTTT();
}
function tttAIMove(){
  const empty=tttBoard.map((v,i)=>v?null:i).filter(v=>v!==null);
  if(!empty.length) return;
  const diff=difficultySelect.value;
  if(diff==="easy" && Math.random()<0.55){ tttBoard[empty[Math.floor(Math.random()*empty.length)]]="O"; }
  else{
    let chosen=null;
    for(const i of empty){ tttBoard[i]="O"; if(tttWinner(tttBoard)==="O"){ chosen=i; tttBoard[i]=null; break; } tttBoard[i]=null; }
    if(chosen===null){ for(const i of empty){ tttBoard[i]="X"; if(tttWinner(tttBoard)==="X"){ chosen=i; tttBoard[i]=null; break; } tttBoard[i]=null; } }
    if(chosen===null) chosen=empty[Math.floor(Math.random()*empty.length)];
    tttBoard[chosen]="O";
  }
  const w=tttWinner(tttBoard);
  if(w){ finishTTT(w); return; }
  tttTurn="X"; renderTTT();
}

// ----- Chess -----
let chessBoard=[], chessTurn="w", chessSel=null, chessOver=false;
let whiteCaptured=[], blackCaptured=[];

const P={wp:"♙",wr:"♖",wn:"♘",wb:"♗",wq:"♕",wk:"♔",bp:"♟",br:"♜",bn:"♞",bb:"♝",bq:"♛",bk:"♚"};
const V={p:100,n:320,b:330,r:500,q:900,k:20000};
const key=p=>p?p.color+p.type:null, inb=(r,c)=>r>=0&&r<8&&c>=0&&c<8;
const clone=b=>b.map(row=>row.map(x=>x?{...x}:null));

function initChess(){
  chessBoard=Array.from({length:8},()=>Array(8).fill(null));
  const back=["r","n","b","q","k","b","n","r"];
  for(let c=0;c<8;c++){ chessBoard[0][c]={color:"b",type:back[c]}; chessBoard[1][c]={color:"b",type:"p"}; chessBoard[6][c]={color:"w",type:"p"}; chessBoard[7][c]={color:"w",type:back[c]}; }
  chessTurn="w"; chessSel=null; chessOver=false; whiteCaptured=[]; blackCaptured=[];
  renderChessCaptured(); renderChess();
}
function renderChessCaptured(){ whiteCapturedEl.textContent=whiteCaptured.map(x=>P[key(x)]).join(" "); blackCapturedEl.textContent=blackCaptured.map(x=>P[key(x)]).join(" "); }
function renderChess(){
  tttBoardEl.style.display="none"; chessBoardEl.style.display="grid"; capturedPanel.style.display="grid";
  chessBoardEl.innerHTML="";
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const d=document.createElement("div");
    d.className="chess-cell "+(((r+c)%2===0)?"light":"dark");
    if(chessSel&&chessSel.r===r&&chessSel.c===c) d.classList.add("selected");
    d.textContent=chessBoard[r][c]?P[key(chessBoard[r][c])]:"";
    d.onclick=()=>onChessClick(r,c); chessBoardEl.appendChild(d);
  }
  statusEl.textContent=chessOver?"Chess: Game Over":`Chess: ${chessTurn==="w"?"White":"Black"} to move`;
}
function pmoves(board,r,c){
  const p=board[r][c]; if(!p) return [];
  const m=[]; const add=(nr,nc)=>{ if(!inb(nr,nc)) return; const t=board[nr][nc]; if(!t||t.color!==p.color)m.push({r:nr,c:nc}); };
  if(p.type==="p"){
    const dir=p.color==="w"?-1:1, st=p.color==="w"?6:1;
    if(inb(r+dir,c)&&!board[r+dir][c]) m.push({r:r+dir,c});
    if(r===st && !board[r+dir][c] && !board[r+2*dir][c]) m.push({r:r+2*dir,c});
    for(const dc of [-1,1]){ const nr=r+dir,nc=c+dc; if(inb(nr,nc)&&board[nr][nc]&&board[nr][nc].color!==p.color)m.push({r:nr,c:nc}); }
  }else if(p.type==="n"){ [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>add(r+dr,c+dc)); }
  else if(p.type==="k"){ for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) if(dr||dc) add(r+dr,c+dc); }
  else{
    const dirs=[]; if(p.type==="b"||p.type==="q") dirs.push([-1,-1],[-1,1],[1,-1],[1,1]); if(p.type==="r"||p.type==="q") dirs.push([-1,0],[1,0],[0,-1],[0,1]);
    for(const [dr,dc] of dirs){ let nr=r+dr,nc=c+dc; while(inb(nr,nc)){ if(!board[nr][nc]) m.push({r:nr,c:nc}); else { if(board[nr][nc].color!==p.color)m.push({r:nr,c:nc}); break; } nr+=dr; nc+=dc; } }
  }
  return m;
}
function move(board,mv,real=false){
  const p=board[mv.fr][mv.fc], t=board[mv.tr][mv.tc];
  if(t&&real){
    if(t.color==="w") whiteCaptured.push(t); else blackCaptured.push(t);
    if(t.type==="k"){
      chessOver=true;
      if(p.color==="w"){ scoreA++; showWinnerScreenMessage("White Winner!"); }
      else { scoreB++; showWinnerScreenMessage("Black Winner!"); }
      renderScores();
    }
    renderChessCaptured();
  }
  board[mv.tr][mv.tc]=p; board[mv.fr][mv.fc]=null;
  if(p.type==="p" && (mv.tr===0||mv.tr===7)) p.type="q";
}
function allMoves(board,color){
  const arr=[]; for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(board[r][c]&&board[r][c].color===color) pmoves(board,r,c).forEach(x=>arr.push({fr:r,fc:c,tr:x.r,tc:x.c}));
  return arr;
}
function evalBoard(board){ let s=0; for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=board[r][c]; if(!p)continue; s+=p.color==="b"?V[p.type]:-V[p.type]; } return s; }
function mm(board,depth,a,b,maxi){
  if(depth===0) return {score:evalBoard(board),mv:null};
  const color=maxi?"b":"w", moves=allMoves(board,color); if(!moves.length) return {score:evalBoard(board),mv:null};
  let best=null;
  if(maxi){
    let v=-Infinity;
    for(const m of moves){ const b2=clone(board); move(b2,m,false); const sc=mm(b2,depth-1,a,b,false).score; if(sc>v){v=sc;best=m;} a=Math.max(a,sc); if(b<=a)break; }
    return {score:v,mv:best};
  }else{
    let v=Infinity;
    for(const m of moves){ const b2=clone(board); move(b2,m,false); const sc=mm(b2,depth-1,a,b,true).score; if(sc<v){v=sc;best=m;} b=Math.min(b,sc); if(b<=a)break; }
    return {score:v,mv:best};
  }
}
const chessDepth=()=>difficultySelect.value==="easy"?1:difficultySelect.value==="medium"?2:3;

function onChessClick(r,c){
  const mode=modeSelect.value;
  if(chessOver || (mode==="chess-ai" && chessTurn==="b")) return;

  const p=chessBoard[r][c];
  if(!chessSel){ if(p&&p.color===chessTurn) chessSel={r,c}; renderChess(); return; }

  const legal=pmoves(chessBoard,chessSel.r,chessSel.c).find(x=>x.r===r&&x.c===c);
  if(!legal){ if(p&&p.color===chessTurn) chessSel={r,c}; else chessSel=null; renderChess(); return; }

  move(chessBoard,{fr:chessSel.r,fc:chessSel.c,tr:r,tc:c},true);
  if(chessOver){ renderChess(); return; }

  chessSel=null; chessTurn=chessTurn==="w"?"b":"w"; renderChess();

  if(mode==="chess-ai" && chessTurn==="b" && !chessOver){
    thinkingEl.style.display="inline";
    setTimeout(()=>{
      const result=mm(chessBoard,chessDepth(),-Infinity,Infinity,true);
      const mv=result.mv || allMoves(chessBoard,"b")[0];
      if(mv){ move(chessBoard,mv,true); if(!chessOver) chessTurn="w"; }
      thinkingEl.style.display="none"; renderChess();
    }, aiDelay(difficultySelect.value));
  }
}

// ----- Mode -----
function applyMode(){
  hideWinnerScreen();
  const mode=modeSelect.value;
  modeChip.textContent="Mode: "+modeSelect.options[modeSelect.selectedIndex].text;
  difficultyWrap.style.display=mode.includes("-ai")?"grid":"none";
  thinkingEl.style.display="none";

  if(mode.startsWith("ttt3")) initTTT(3);
  else if(mode.startsWith("ttt5")) initTTT(5);
  else initChess();
}
modeSelect.addEventListener("change", applyMode);
newGameBtn.addEventListener("click", applyMode);

// ----- Boot -----
(function boot(){
  const savedTheme=localStorage.getItem("theme")||"dark";
  themeSelect.value=savedTheme; setTheme(savedTheme);
  renderScores(); applyMode();
})();