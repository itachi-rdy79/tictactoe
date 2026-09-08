const modeSelect = document.getElementById("modeSelect");
const difficultySelect = document.getElementById("difficultySelect");
const themeSelect = document.getElementById("themeSelect");

const gameTypePills = document.getElementById("gameTypePills");
const opponentPills = document.getElementById("opponentPills");
const difficultyPills = document.getElementById("difficultyPills");
const difficultyGroup = document.getElementById("difficultyGroup");
const timerPills = document.getElementById("timerPills");
const opponentGroup = document.getElementById("opponentGroup");

const newGameBtn = document.getElementById("newGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const undoBtn = document.getElementById("undoBtn");

const statusPill = document.getElementById("statusPill");
const moveCounterPill = document.getElementById("moveCounterPill");
const moveCountEl = document.getElementById("moveCount");
const radialWrap = document.getElementById("radialWrap");
const ringFg = document.getElementById("ringFg");
const radialText = document.getElementById("radialText");

const boardWrap = document.getElementById("boardWrap");
const tttBoardEl = document.getElementById("tttBoard");
const chessBoardEl = document.getElementById("chessBoard");
const wordleGameEl = document.getElementById("wordleGame");
const wordleBoardEl = document.getElementById("wordleBoard");
const wordleKeyboardEl = document.getElementById("wordleKeyboard");

// Poker DOM
const pokerGameEl = document.getElementById("pokerGame");
const pokerAiNameEl = document.getElementById("pokerAiName");
const pokerAiChipsEl = document.getElementById("pokerAiChips");
const pokerAiCardsEl = document.getElementById("pokerAiCards");
const pokerAiBetBubbleEl = document.getElementById("pokerAiBetBubble");
const pokerPotAmountEl = document.getElementById("pokerPotAmount");
const pokerCommunityCardsEl = document.getElementById("pokerCommunityCards");
const pokerStatusBannerEl = document.getElementById("pokerStatusBanner");
const pokerPlayerBetBubbleEl = document.getElementById("pokerPlayerBetBubble");
const pokerPlayerCardsEl = document.getElementById("pokerPlayerCards");
const pokerPlayerNameEl = document.getElementById("pokerPlayerName");
const pokerHandEvalEl = document.getElementById("pokerHandEval");
const pokerPlayerChipsEl = document.getElementById("pokerPlayerChips");
const pokerBetControlsEl = document.getElementById("pokerBetControls");
const pokerQuickMinBtn = document.getElementById("pokerQuickMin");
const pokerQuickHalfBtn = document.getElementById("pokerQuickHalf");
const pokerQuickPotBtn = document.getElementById("pokerQuickPot");
const pokerQuickAllInBtn = document.getElementById("pokerQuickAllIn");
const pokerBetSliderEl = document.getElementById("pokerBetSlider");
const pokerSliderValEl = document.getElementById("pokerSliderVal");
const pokerFoldBtn = document.getElementById("pokerFoldBtn");
const pokerCallBtn = document.getElementById("pokerCallBtn");
const pokerRaiseBtn = document.getElementById("pokerRaiseBtn");
const pokerNextHandBtn = document.getElementById("pokerNextHandBtn");

// Imposter DOM
const imposterGameEl = document.getElementById("imposterGame");
const imposterSetupScreenEl = document.getElementById("imposterSetupScreen");
const imposterCountPillsEl = document.getElementById("imposterCountPills");
const imposterCategoryPillsEl = document.getElementById("imposterCategoryPills");
const imposterStartBtn = document.getElementById("imposterStartBtn");
const imposterRevealScreenEl = document.getElementById("imposterRevealScreen");
const imposterPassHeaderEl = document.getElementById("imposterPassHeader");
const imposterCurtainCardEl = document.getElementById("imposterCurtainCard");
const imposterCurtainHiddenEl = document.getElementById("imposterCurtainHidden");
const imposterCurtainRevealedEl = document.getElementById("imposterCurtainRevealed");
const imposterRoleBadgeEl = document.getElementById("imposterRoleBadge");
const imposterWordDisplayEl = document.getElementById("imposterWordDisplay");
const imposterHintDisplayEl = document.getElementById("imposterHintDisplay");
const imposterNextPlayerBtn = document.getElementById("imposterNextPlayerBtn");
const imposterDiscussScreenEl = document.getElementById("imposterDiscussScreen");
const imposterDiscussTimerEl = document.getElementById("imposterDiscussTimer");
const imposterPromptTextEl = document.getElementById("imposterPromptText");
const imposterDiscussRosterEl = document.getElementById("imposterDiscussRoster");
const imposterAccuseBtn = document.getElementById("imposterAccuseBtn");
const imposterVoteScreenEl = document.getElementById("imposterVoteScreen");
const imposterVoteGridEl = document.getElementById("imposterVoteGrid");
const imposterGuessScreenEl = document.getElementById("imposterGuessScreen");
const imposterGuessGridEl = document.getElementById("imposterGuessGrid");

const capturedLeft = document.getElementById("capturedLeft");
const capturedRight = document.getElementById("capturedRight");
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

const themePicker = document.getElementById("themePicker");
const themeTrigger = document.getElementById("themeTrigger");
const themeMenu = document.getElementById("themeMenu");
const themeCurrentIcon = document.getElementById("themeCurrentIcon");
const themeCurrentText = document.getElementById("themeCurrentText");
const miniWindowBtn = document.getElementById("miniWindowBtn");

const scoreTickerBtn = document.getElementById("scoreTickerBtn");
const statsModal = document.getElementById("statsModal");
const closeStatsBtn = document.getElementById("closeStatsBtn");
const statsGridContent = document.getElementById("statsGridContent");
const confettiCanvas = document.getElementById("confettiCanvas");

/* ---------- 5 Vibrant Neon Accent Palettes on Reload ---------- */
const DYNAMIC_PALETTES = [
  { name: "Emerald", accent: "#10b981", border: "#34d399", shadow: "#059669", tint: "rgba(16, 185, 129, 0.2)", lightBg: "#ecfdf5" },
  { name: "Amber",   accent: "#f59e0b", border: "#fbbf24", shadow: "#d97706", tint: "rgba(245, 158, 11, 0.2)", lightBg: "#fffbeb" },
  { name: "Violet",  accent: "#8b5cf6", border: "#a78bfa", shadow: "#7c3aed", tint: "rgba(139, 92, 246, 0.2)", lightBg: "#f5f3ff" },
  { name: "Teal",    accent: "#14b8a6", border: "#2dd4bf", shadow: "#0d9488", tint: "rgba(20, 184, 166, 0.2)", lightBg: "#f0fdfa" },
  { name: "Lime",    accent: "#84cc16", border: "#a3e635", shadow: "#65a30d", tint: "rgba(132, 204, 22, 0.2)", lightBg: "#f7fee7" }
];

function applyRandomPalette() {
  const chosen = DYNAMIC_PALETTES[Math.floor(Math.random() * DYNAMIC_PALETTES.length)];
  const root = document.documentElement;
  root.style.setProperty("--dyn-accent", chosen.accent);
  root.style.setProperty("--dyn-border", chosen.border);
  root.style.setProperty("--dyn-shadow", chosen.shadow);
  root.style.setProperty("--dyn-tint", chosen.tint);
  root.style.setProperty("--dyn-light-bg", chosen.lightBg);
}
applyRandomPalette();

/* ---------- Custom SVGs for Thematic Markers & Crests ---------- */
const SHARINGAN_SVG = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#ff0033"/><circle cx="50" cy="50" r="38" fill="none" stroke="#000" stroke-width="4"/><circle cx="50" cy="50" r="10" fill="#000"/><circle cx="50" cy="24" r="7" fill="#000"/><path d="M50 24 Q57 32 50 37" stroke="#000" stroke-width="3" fill="none"/><circle cx="27" cy="63" r="7" fill="#000"/><path d="M27 63 Q23 72 30 75" stroke="#000" stroke-width="3" fill="none"/><circle cx="73" cy="63" r="7" fill="#000"/><path d="M73 63 Q77 72 70 75" stroke="#000" stroke-width="3" fill="none"/></svg>`;
const CROW_SVG = `<svg viewBox="0 0 100 100"><path d="M15 50 C25 25, 60 20, 85 40 C75 45, 65 48, 55 46 C68 55, 75 65, 80 80 C60 70, 40 75, 20 62 C30 62, 40 58, 45 52 C30 52, 20 54, 15 50 Z" fill="currentColor"/><circle cx="70" cy="38" r="3" fill="#ff0033"/></svg>`;

const KONOHA_LEAF_SVG = `<svg viewBox="0 0 100 100"><path d="M 86 26 L 76 33 C 65 26 44 26 31 43 L 18 68 L 62 68 C 76 68 83 55 80 43 C 77 31 63 25 49 28 C 35 32 30 46 34 58 C 39 68 53 71 64 67 C 72 62 74 51 68 44 C 62 37 51 40 47 48 C 45 54 49 60 55 58 C 59 56 60 52 58 49" fill="none" stroke="#f97316" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const AKATSUKI_CLOUD_SVG = `<svg viewBox="0 0 100 100"><path d="M30 65 A18 18 0 0 1 25 35 A22 22 0 0 1 65 26 A26 26 0 0 1 85 52 A20 20 0 0 1 70 70 Z" fill="#e11d48" stroke="#ffffff" stroke-width="4"/><path d="M40 50 A10 10 0 0 1 60 48" stroke="#ffffff" stroke-width="3" fill="none"/></svg>`;

const DIREWOLF_SVG = `<svg viewBox="0 0 100 100"><polygon points="50,15 65,35 85,38 70,55 75,78 50,65 25,78 30,55 15,38 35,35" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linejoin="round"/><circle cx="42" cy="42" r="4" fill="#38bdf8"/><circle cx="58" cy="42" r="4" fill="#38bdf8"/></svg>`;
const DRAGON_SVG = `<svg viewBox="0 0 100 100"><path d="M20 70 Q35 25 50 45 Q65 25 80 70 Q50 60 20 70 Z" fill="#ef4444" stroke="#f59e0b" stroke-width="5"/><circle cx="38" cy="48" r="4" fill="#f59e0b"/><circle cx="62" cy="48" r="4" fill="#f59e0b"/><path d="M45 62 Q50 72 55 62" stroke="#f59e0b" stroke-width="4" fill="none"/></svg>`;

const hubState = {
  game: "ttt3",
  opponent: "ai",
  difficulty: "medium",
  timer: "off",
  theme: "light"
};

let scoreA = 0, scoreB = 0, scoreD = 0, streak = 0;
let moveCount = 0;

/* ---------- Move Counter Display ---------- */
function updateMoveCounter(show = true) {
  if (!moveCounterPill || !moveCountEl) return;
  if (!show) {
    moveCounterPill.classList.add("hidden");
    return;
  }
  moveCounterPill.classList.remove("hidden");
  moveCountEl.textContent = String(moveCount);
}

/* ---------- PERSIST KEYS ---------- */
const LIVE_STATE_KEY = "liveGameState_v4";

/* ---------- Idle Watchdog ---------- */
let idleSeconds = 0;
let idleInterval = null;

function resetIdleWatchdog() {
  idleSeconds = 0;
  statusPill?.classList.remove("idle-nudge");
  boardWrap?.classList.remove("idle-shake");
}

function startIdleWatchdog() {
  if (idleInterval) clearInterval(idleInterval);
  idleSeconds = 0;
  idleInterval = setInterval(() => {
    if (hubState.timer === "off") {
      idleSeconds++;
      if (idleSeconds >= 60) {
        statusPill?.classList.add("idle-nudge");
        boardWrap?.classList.add("idle-shake");
        if (statusPill && !statusPill.textContent.includes("Take your turn!")) {
          statusPill.textContent = "⏳ Take your turn!";
        }
      }
    }
  }, 1000);
}

/* ---------- State Management ---------- */
function modeFromHub() {
  if (hubState.game === "wordle") return "wordle";
  if (hubState.game === "imposter") return "imposter";
  if (hubState.game === "poker") return hubState.opponent === "ai" ? "poker-ai" : "poker-2p";
  if (hubState.game === "ttt3") return hubState.opponent === "ai" ? "ttt3-ai" : "ttt3-2p";
  if (hubState.game === "ttt5") return hubState.opponent === "ai" ? "ttt5-ai" : "ttt5-2p";
  return hubState.opponent === "ai" ? "chess-ai" : "chess-2p";
}

function hubFromMode(mode) {
  if (mode === "wordle") {
    hubState.game = "wordle";
    hubState.opponent = "local";
    return;
  }
  if (mode === "imposter") {
    hubState.game = "imposter";
    hubState.opponent = "local";
    return;
  }
  if (mode.startsWith("poker")) {
    hubState.game = "poker";
    hubState.opponent = mode.endsWith("-ai") ? "ai" : "local";
    return;
  }
  if (mode.startsWith("ttt3")) hubState.game = "ttt3";
  else if (mode.startsWith("ttt5")) hubState.game = "ttt5";
  else hubState.game = "chess";
  hubState.opponent = mode.endsWith("-ai") ? "ai" : "local";
}

function setActive(groupEl, key, val) {
  groupEl?.querySelectorAll(`[data-${key}]`).forEach(btn => {
    btn.classList.toggle("active", btn.dataset[key] === val);
  });
}

function persistHub() {
  const opponentVal = (hubState.game === "wordle" || hubState.game === "imposter") ? "local" : hubState.opponent;
  localStorage.setItem("hubState", JSON.stringify({ ...hubState, opponent: opponentVal }));
  const hash = `#/${hubState.game}?vs=${opponentVal}&diff=${hubState.difficulty}&timer=${hubState.timer}&theme=${hubState.theme}`;
  history.replaceState(null, "", hash);
}

function loadHub() {
  const saved = JSON.parse(localStorage.getItem("hubState") || "null");
  if (saved) Object.assign(hubState, saved);

  // URL sync on reload
  const raw = location.hash || "";
  if (raw.startsWith("#/")) {
    const [path, query = ""] = raw.slice(2).split("?");
    if (["ttt3", "ttt5", "chess", "wordle", "poker", "imposter"].includes(path)) hubState.game = path;

    const q = new URLSearchParams(query);
    const vs = q.get("vs");
    const diff = q.get("diff");
    const timer = q.get("timer");
    const theme = q.get("theme");

    if (["ai", "local"].includes(vs)) hubState.opponent = vs;
    if (["easy", "medium", "hard"].includes(diff)) hubState.difficulty = diff;
    if (["off", "15", "30", "45", "60", "90"].includes(timer)) hubState.timer = timer;
    if (["dark", "light", "itachi", "naruto", "got"].includes(theme)) hubState.theme = theme;
  }

  // normalize
  if (!["off", "15", "30", "45", "60", "90"].includes(hubState.timer)) hubState.timer = "off";
  if (!["dark", "light", "itachi", "naruto", "got"].includes(hubState.theme)) hubState.theme = "light";
  if (!["easy", "medium", "hard"].includes(hubState.difficulty)) hubState.difficulty = "medium";
  if (!["ai", "local"].includes(hubState.opponent)) hubState.opponent = "ai";
  if (!["ttt3", "ttt5", "chess", "wordle", "poker", "imposter"].includes(hubState.game)) hubState.game = "ttt3";

  if (hubState.game === "wordle" || hubState.game === "imposter") hubState.opponent = "local";
}

function syncHud() {
  const isWordle = hubState.game === "wordle";
  const isImposter = hubState.game === "imposter";
  const isPartyGame = isWordle || isImposter;
  if (isPartyGame) hubState.opponent = "local";

  setActive(gameTypePills, "game", hubState.game);
  setActive(opponentPills, "opponent", hubState.opponent);
  setActive(difficultyPills, "difficulty", hubState.difficulty);
  setActive(timerPills, "timer", hubState.timer);

  if (opponentGroup) {
    if (isPartyGame) opponentGroup.style.setProperty("display", "none", "important");
    else opponentGroup.style.display = "flex";
  }

  if (difficultyGroup) {
    if (isImposter) difficultyGroup.style.setProperty("display", "none", "important");
    else {
      difficultyGroup.style.display = "flex";
      difficultyGroup.classList.toggle("disabled", !isWordle && hubState.opponent !== "ai");
    }
  }
}

/* ---------- Theme Handling ---------- */
function themeMeta(theme) {
  if (theme === "light") return {
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    text: "Light"
  };
  if (theme === "itachi") return {
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2.5"/><circle cx="5.9" cy="15.5" r="2.5"/><circle cx="18.1" cy="15.5" r="2.5"/></svg>`,
    text: "Itachi"
  };
  if (theme === "naruto") return {
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 6 6 9 6 13a6 6 0 0 0 12 0c0-4-2-7-6-11z"/><circle cx="12" cy="13" r="2.5" fill="currentColor"/></svg>`,
    text: "Naruto"
  };
  if (theme === "got") return {
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2v4a2.5 2.5 0 0 0 5 0V2"/><path d="M9.5 2v4a2.5 2.5 0 0 1-5 0V2"/><path d="M12 12v10"/><path d="m8 18 4 4 4-4"/><path d="M7 6h10a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/></svg>`,
    text: "Game of Thrones"
  };
  return {
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    text: "Dark"
  };
}

function setTheme(theme) {
  hubState.theme = theme;
  if (themeSelect) themeSelect.value = theme;
  document.body.setAttribute("data-theme", theme);
  const m = themeMeta(theme);
  if (themeCurrentIcon) themeCurrentIcon.innerHTML = m.icon;
  if (themeCurrentText) themeCurrentText.textContent = m.text;
  themeMenu?.querySelectorAll(".theme-item").forEach(b => b.classList.toggle("active", b.dataset.theme === theme));
  persistHub();

  if (hubState.game.startsWith("ttt")) renderTTT();
  if (hubState.game === "chess") {
    renderCaptured();
    renderChess();
  }
  if (hubState.game === "poker") renderPokerUI();
}

themeTrigger?.addEventListener("click", (e) => {
  e.stopPropagation();
  themePicker?.classList.toggle("open");
});

themeMenu?.addEventListener("click", (e) => {
  const b = e.target.closest(".theme-item");
  if (!b) return;
  setTheme(b.dataset.theme);
  themePicker?.classList.remove("open");
});

document.addEventListener("click", () => themePicker?.classList.remove("open"));

/* ---------- Mini-Window (Pop-Out / Floating Mode) ---------- */
function isMiniWindow() {
  const params = new URLSearchParams(window.location.search);
  return window.name === "GAP_MiniWindow" || params.get("mini") === "1" || window.innerWidth <= 520;
}

function updateMiniWindowUI() {
  const isMini = isMiniWindow();
  document.body.classList.toggle("mini-window", isMini);

  if (miniWindowBtn) {
    const params = new URLSearchParams(window.location.search);
    const inPopout = window.name === "GAP_MiniWindow" || params.get("mini") === "1";
    if (inPopout) {
      miniWindowBtn.title = "Expand to Full Tab";
      miniWindowBtn.setAttribute("aria-label", "Expand to Full Tab");
      miniWindowBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
          <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
          <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
          <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
        </svg>
      `;
    } else {
      miniWindowBtn.title = "Pop out into Mini Window";
      miniWindowBtn.setAttribute("aria-label", "Pop out into Mini Window");
      miniWindowBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h6v6"/>
          <path d="M10 14L21 3"/>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        </svg>
      `;
    }
  }
}

miniWindowBtn?.addEventListener("click", () => {
  persistLiveState();
  persistHub();

  const params = new URLSearchParams(window.location.search);
  const inPopout = window.name === "GAP_MiniWindow" || params.get("mini") === "1";

  if (inPopout) {
    const url = new URL(window.location.href);
    url.searchParams.delete("mini");
    window.open(url.toString(), "_blank");
  } else {
    const url = new URL(window.location.href);
    url.searchParams.set("mini", "1");
    const features = "width=430,height=720,left=100,top=80,menubar=no,toolbar=no,location=no,status=no,resizable=yes";
    window.open(url.toString(), "GAP_MiniWindow", features);
  }
});

window.addEventListener("resize", updateMiniWindowUI);

/* ---------- Score Tracking & Statistics Modal ---------- */
function scoreKey() { return `scores_${modeSelect.value}_${difficultySelect.value}`; }

function renderScores() {
  if (scoreAEl) scoreAEl.textContent = scoreA;
  if (scoreBEl) scoreBEl.textContent = scoreB;
  if (scoreDEl) scoreDEl.textContent = scoreD;
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

function updateStreak(winA) { streak = winA ? streak + 1 : 0; }

scoreTickerBtn?.addEventListener("click", () => {
  const modes = [
    { label: "3x3 TTT (AI)", key: "scores_ttt3-ai_medium" },
    { label: "5x5 TTT (AI)", key: "scores_ttt5-ai_medium" },
    { label: "Chess (AI)", key: "scores_chess-ai_medium" },
    { label: "Wordle", key: "scores_wordle_medium" },
    { label: "Poker (AI)", key: "scores_poker-ai_medium" }
  ];

  if (!statsGridContent || !statsModal) return;
  statsGridContent.innerHTML = modes.map(m => {
    const data = JSON.parse(localStorage.getItem(m.key) || '{"scoreA":0,"scoreB":0,"scoreD":0,"streak":0}');
    const wins = data.scoreA || 0;
    const losses = data.scoreB || 0;
    const totalForRate = wins + losses;
    const winRate = totalForRate > 0 ? Math.round((wins / totalForRate) * 100) : 0;
    return `
      <div class="stat-card">
        <span>${m.label}</span>
        <span>Wins: <b>${wins}</b> | Losses: <b>${losses}</b> | Win Rate: <b>${winRate}%</b></span>
      </div>
    `;
  }).join("");

  statsModal.classList.remove("hidden");
});

closeStatsBtn?.addEventListener("click", () => statsModal?.classList.add("hidden"));
statsModal?.addEventListener("click", (e) => { if (e.target === statsModal) statsModal.classList.add("hidden"); });

/* ---------- Confetti (Zero Audio, Pure Visual) ---------- */
function triggerConfetti() {
  if (!confettiCanvas) return;
  const ctx = confettiCanvas.getContext("2d");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#ff0033", "#ffd000", "#10b981", "#3b82f6", "#8b5cf6", "#fbbf24", "#14b8a6", "#84cc16"];
  for (let i = 0; i < 110; i++) {
    particles.push({
      x: confettiCanvas.width / 2,
      y: confettiCanvas.height / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  let animationFrame;
  function loop() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.42; p.rotation += p.vRot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    animationFrame = requestAnimationFrame(loop);
  }
  loop();
  setTimeout(() => cancelAnimationFrame(animationFrame), 3500);
}

/* ---------- Timer Logic ---------- */
let turnTimer = null;
let turnTimeLeft = 0;
let turnTimeTotal = 0;
const CIRC = 2 * Math.PI * 50;

function stopTurnTimer() {
  if (turnTimer) clearInterval(turnTimer);
  turnTimer = null;
}
function showTimerInactive() {
  radialWrap?.classList.add("hidden");
  statusPill?.classList.remove("hidden");
}
function showTimerActive() {
  statusPill?.classList.add("hidden");
  radialWrap?.classList.remove("hidden");
}
function renderRadial() {
  if (!turnTimeTotal || !ringFg || !radialText) return;
  const pct = Math.max(0, turnTimeLeft / turnTimeTotal);
  ringFg.style.strokeDasharray = `${CIRC}`;
  ringFg.style.strokeDashoffset = `${CIRC * (1 - pct)}`;
  radialText.textContent = String(Math.ceil(Math.max(0, turnTimeLeft)));
}
function startTurnTimer() {
  stopTurnTimer();
  resetIdleWatchdog();

  if (hubState.timer === "off" || hubState.game === "wordle") {
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

/* ---------- Win Modal ---------- */
function showWinScreen(msg) {
  resetIdleWatchdog();
  if (winMessage) winMessage.textContent = msg.toUpperCase();
  winOverlay?.classList.remove("hidden");
  triggerConfetti();
}
function hideWinScreen() {
  winOverlay?.classList.add("hidden");
}
winRestartBtn?.addEventListener("click", () => { hideWinScreen(); initBoard(true); });
winOverlay?.addEventListener("click", (e) => { if (e.target === winOverlay) hideWinScreen(); });

/* ---------- Tic-Tac-Toe (3x3 & 5x5) ---------- */
let tttBoard = [], tttSize = 3, tttWinLen = 3, tttTurn = "X", tttOver = false, tttWinningCells = [];
let tttSnapshots = [];

function clearWinLine() { if (winLineSvg) winLineSvg.innerHTML = ""; }

function drawWinLineTTT(line) {
  if (!winLineSvg || !line.length) return;
  const s = tttSize, a = line[0], b = line[line.length - 1];
  const ar = Math.floor(a / s), ac = a % s, br = Math.floor(b / s), bc = b % s;
  winLineSvg.innerHTML = `<line x1="${((ac + 0.5) / s) * 100}" y1="${((ar + 0.5) / s) * 100}" x2="${((bc + 0.5) / s) * 100}" y2="${((br + 0.5) / s) * 100}"></line>`;
}

function buildTTTLines(size, len) {
  const lines = [];
  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - len; c++) {
      const l = [];
      for (let k = 0; k < len; k++) l.push(r * size + c + k);
      lines.push(l);
    }
  }
  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - len; r++) {
      const l = [];
      for (let k = 0; k < len; k++) l.push((r + k) * size + c);
      lines.push(l);
    }
  }
  // Diagonals down-right
  for (let r = 0; r <= size - len; r++) {
    for (let c = 0; c <= size - len; c++) {
      const l = [];
      for (let k = 0; k < len; k++) l.push((r + k) * size + (c + k));
      lines.push(l);
    }
  }
  // Diagonals down-left
  for (let r = 0; r <= size - len; r++) {
    for (let c = len - 1; c < size; c++) {
      const l = [];
      for (let k = 0; k < len; k++) l.push((r + k) * size + (c - k));
      lines.push(l);
    }
  }
  return lines;
}

const TTT_LINES_3 = buildTTTLines(3, 3);
// 5x5: precompute winning vectors
const TTT_LINES_5 = buildTTTLines(5, 4);

function getTTTLines(size, len) {
  if (size === 3 && len === 3) return TTT_LINES_3;
  if (size === 5 && len === 4) return TTT_LINES_5;
  return buildTTTLines(size, len);
}

function getTTTResult(board, size = tttSize, winLen = tttWinLen) {
  const lines = getTTTLines(size, winLen);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const first = board[line[0]];
    if (!first) continue;
    let match = true;
    for (let k = 1; k < line.length; k++) {
      if (board[line[k]] !== first) { match = false; break; }
    }
    if (match) return { winner: first, line };
  }
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) return { winner: null, line: [] };
  }
  return { winner: "draw", line: [] };
}

function getEmptyCells(board) {
  const a = [];
  for (let i = 0; i < board.length; i++) if (!board[i]) a.push(i);
  return a;
}

function saveTTTSnapshot() {
  tttSnapshots.push({
    board: [...tttBoard], turn: tttTurn, over: tttOver, win: [...tttWinningCells],
    scoreA, scoreB, scoreD, streak, moveCount
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
  moveCount = 0;
  clearWinLine();
  updateMoveCounter(true);
  renderTTT();
  startTurnTimer();
}

function renderTTT() {
  resetIdleWatchdog();
  boardWrap?.classList.remove("wordle-mode", "chess-mode", "poker-mode", "imposter-mode");
  capturedLeft?.classList.add("hidden");
  capturedRight?.classList.add("hidden");
  tttBoardEl?.classList.remove("hidden");
  chessBoardEl?.classList.add("hidden");
  wordleGameEl?.classList.add("hidden");
  pokerGameEl?.classList.add("hidden");
  imposterGameEl?.classList.add("hidden");

  if (!tttBoardEl) return;
  tttBoardEl.innerHTML = "";
  tttBoardEl.style.gridTemplateColumns = `repeat(${tttSize}, minmax(48px, 1fr))`;

  const theme = hubState.theme;
  function getIcon(mark) {
    if (mark === "X") {
      if (theme === "itachi") return SHARINGAN_SVG;
      if (theme === "naruto") return KONOHA_LEAF_SVG;
      if (theme === "got") return DIREWOLF_SVG;
      return "X";
    }
    if (mark === "O") {
      if (theme === "itachi") return CROW_SVG;
      if (theme === "naruto") return AKATSUKI_CLOUD_SVG;
      if (theme === "got") return DRAGON_SVG;
      return "O";
    }
    return "";
  }

  tttBoard.forEach((v, i) => {
    const cell = document.createElement("button");
    cell.className = "ttt-cell";
    if (v === "X") { cell.classList.add("x"); cell.innerHTML = getIcon("X"); }
    else if (v === "O") { cell.classList.add("o"); cell.innerHTML = getIcon("O"); }

    if (tttWinningCells.includes(i)) cell.classList.add("win");
    cell.addEventListener("click", () => onTTTClick(i));
    tttBoardEl.appendChild(cell);
  });

  const r = getTTTResult(tttBoard);
  if (hubState.timer === "off" && statusPill) {
    if (theme === "got") {
      statusPill.textContent = r.winner === "draw" ? "The Long Night (Draw)" : r.winner ? (r.winner === "X" ? "House Stark Victorious" : "House Targaryen Ascends") : (tttTurn === "X" ? "Direwolf's Turn (Stark)" : "Dragon's Turn (Targaryen)");
    } else if (theme === "naruto") {
      statusPill.textContent = r.winner === "draw" ? "Shinobi Draw" : r.winner ? (r.winner === "X" ? "Konoha Leaf Prevails" : "Akatsuki Strikes") : (tttTurn === "X" ? "Leaf Ninja's Turn" : "Akatsuki's Turn");
    } else if (theme === "itachi") {
      statusPill.innerHTML = r.winner === "draw" ? "Draw" : r.winner ? (r.winner === "X" ? "Sharingan Wins" : "Crow Wins") : (tttTurn === "X" ? "Sharingan's Turn" : "Crow's Turn");
    } else {
      statusPill.textContent = r.winner === "draw" ? "Draw" : r.winner ? `${r.winner} Wins` : `${tttTurn}'s Turn`;
    }
  }
}

/* ---------- 3x3 Tic-Tac-Toe Minimax (Mathematically Unbeatable on Hard) ---------- */
function minimaxTTT3(board, depth, alpha, beta, maxing) {
  const r = getTTTResult(board, 3, 3);
  if (r.winner === "O") return { score: 1000 + depth, move: null };
  if (r.winner === "X") return { score: -1000 - depth, move: null };
  if (r.winner === "draw" || depth === 0) return { score: 0, move: null };

  const empties = getEmptyCells(board);
  let best = { score: maxing ? -Infinity : Infinity, move: empties[0] };

  for (let i = 0; i < empties.length; i++) {
    const idx = empties[i];
    board[idx] = maxing ? "O" : "X";
    const out = minimaxTTT3(board, depth - 1, alpha, beta, !maxing);
    board[idx] = null;
    if (maxing) {
      if (out.score > best.score) { best.score = out.score; best.move = idx; }
      alpha = Math.max(alpha, best.score);
      if (beta <= alpha) break;
    } else {
      if (out.score < best.score) { best.score = out.score; best.move = idx; }
      beta = Math.min(beta, best.score);
      if (beta <= alpha) break;
    }
  }
  return best;
}

/* ---------- 5x5 Tic-Tac-Toe Tactical Heuristic & AI ---------- */
const TTT5_CENTER_WEIGHTS = [
  1, 2, 3, 2, 1,
  2, 4, 6, 4, 2,
  3, 6, 9, 6, 3,
  2, 4, 6, 4, 2,
  1, 2, 3, 2, 1
];

function evalTTT5(board) {
  let score = 0;
  const lines = TTT_LINES_5;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let o = 0, x = 0;
    for (let k = 0; k < 4; k++) {
      const v = board[line[k]];
      if (v === "O") o++;
      else if (v === "X") x++;
    }
    if (o > 0 && x > 0) continue;
    if (o === 4) return 100000;
    if (x === 4) return -100000;
    if (o === 3) score += 950;
    else if (o === 2) score += 75;
    else if (o === 1) score += 6;
    if (x === 3) score -= 1300;
    else if (x === 2) score -= 90;
    else if (x === 1) score -= 7;
  }
  for (let i = 0; i < 25; i++) {
    const v = board[i];
    if (v === "O") score += TTT5_CENTER_WEIGHTS[i];
    else if (v === "X") score -= TTT5_CENTER_WEIGHTS[i];
  }
  return score;
}

function getTTT5Candidates(board) {
  const empties = getEmptyCells(board);
  if (empties.length === 25) return [12];
  if (empties.length <= 1) return empties;

  const candidates = [];
  for (let i = 0; i < empties.length; i++) {
    const idx = empties[i];
    const r = Math.floor(idx / 5), c = idx % 5;
    let hasNeighbor = false;
    for (let dr = -2; dr <= 2 && !hasNeighbor; dr++) {
      for (let dc = -2; dc <= 2 && !hasNeighbor; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
          if (board[nr * 5 + nc]) hasNeighbor = true;
        }
      }
    }
    if (hasNeighbor) candidates.push(idx);
  }
  return candidates.length ? candidates : empties;
}

function findTTTImmediateThreat(board, size, winLen, piece) {
  const lines = getTTTLines(size, winLen);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let pieceCount = 0, emptyIdx = null;
    for (let k = 0; k < line.length; k++) {
      const v = board[line[k]];
      if (v === piece) pieceCount++;
      else if (!v) emptyIdx = line[k];
    }
    if (pieceCount === winLen - 1 && emptyIdx != null) {
      return emptyIdx;
    }
  }
  return null;
}

function minimaxTTT5(board, depth, alpha, beta, maxing) {
  const res = getTTTResult(board, 5, 4);
  if (res.winner === "O") return { score: 100000 + depth, move: null };
  if (res.winner === "X") return { score: -100000 - depth, move: null };
  if (res.winner === "draw" || depth === 0) return { score: evalTTT5(board), move: null };

  const candidates = getTTT5Candidates(board);
  let best = { score: maxing ? -Infinity : Infinity, move: candidates[0] };

  for (let i = 0; i < candidates.length; i++) {
    const idx = candidates[i];
    board[idx] = maxing ? "O" : "X";
    const out = minimaxTTT5(board, depth - 1, alpha, beta, !maxing);
    board[idx] = null;
    if (maxing) {
      if (out.score > best.score) { best.score = out.score; best.move = idx; }
      alpha = Math.max(alpha, best.score);
      if (beta <= alpha) break;
    } else {
      if (out.score < best.score) { best.score = out.score; best.move = idx; }
      beta = Math.min(beta, best.score);
      if (beta <= alpha) break;
    }
  }
  return best;
}

function aiTTTMove() {
  if (tttOver) return;
  const empties = getEmptyCells(tttBoard);
  if (!empties.length) return;

  saveTTTSnapshot();
  const diff = difficultySelect.value;
  let move = empties[Math.floor(Math.random() * empties.length)];

  if (tttSize === 3) {
    if (diff === "easy") {
      if (Math.random() > 0.5) {
        const best = minimaxTTT3(tttBoard, 1, -Infinity, Infinity, true);
        if (best.move != null) move = best.move;
      }
    } else if (diff === "medium") {
      const winMove = findTTTImmediateThreat(tttBoard, 3, 3, "O");
      if (winMove != null) {
        move = winMove;
      } else {
        const blockMove = findTTTImmediateThreat(tttBoard, 3, 3, "X");
        if (blockMove != null) {
          move = blockMove;
        } else if (!tttBoard[4] && Math.random() < 0.7) {
          move = 4;
        } else {
          const best = minimaxTTT3(tttBoard, 4, -Infinity, Infinity, true);
          if (best.move != null) move = best.move;
        }
      }
    } else {
      // Hard: Mathematically unbeatable full depth-first alpha-beta minimax algorithm
      const best = minimaxTTT3(tttBoard, 9, -Infinity, Infinity, true);
      if (best.move != null) move = best.move;
    }
  } else {
    // 5x5 Tic-Tac-Toe: sub-50ms latency tactical heuristic
    const winMove = findTTTImmediateThreat(tttBoard, 5, 4, "O");
    if (winMove != null) {
      move = winMove;
    } else {
      const blockMove = findTTTImmediateThreat(tttBoard, 5, 4, "X");
      if (blockMove != null) {
        move = blockMove;
      } else if (diff === "easy") {
        if (Math.random() > 0.4) {
          const best = minimaxTTT5(tttBoard, 1, -Infinity, Infinity, true);
          if (best.move != null) move = best.move;
        }
      } else if (diff === "medium") {
        const best = minimaxTTT5(tttBoard, 2, -Infinity, Infinity, true);
        if (best.move != null) move = best.move;
      } else {
        // Hard: Depth 3 search with candidate pruning and heuristic
        const best = minimaxTTT5(tttBoard, 3, -Infinity, Infinity, true);
        if (best.move != null) move = best.move;
      }
    }
  }

  tttBoard[move] = "O";
  moveCount++;
  updateMoveCounter(true);
  const r = getTTTResult(tttBoard);
  if (r.winner) return finishTTT(r.winner, r.line);

  tttTurn = "X";
  renderTTT();
  startTurnTimer();
  persistLiveState();
}

function finishTTT(winner, line) {
  stopTurnTimer();
  resetIdleWatchdog();
  tttOver = true;
  tttWinningCells = [...line];
  drawWinLineTTT(line);

  const aiMode = modeSelect.value.endsWith("-ai");
  const theme = hubState.theme;
  if (winner === "X") {
    scoreA++; updateStreak(aiMode);
    let msg = aiMode ? "You Win!" : "X Wins!";
    if (theme === "got") msg = "House Stark Victorious!";
    else if (theme === "naruto") msg = "Will of Fire Prevails!";
    else if (theme === "itachi") msg = "Sharingan Triumphs!";
    showWinScreen(msg);
  } else if (winner === "O") {
    scoreB++; updateStreak(false);
    let msg = aiMode ? "Computer Wins!" : "O Wins!";
    if (theme === "got") msg = "Dragon Flame Prevails!";
    else if (theme === "naruto") msg = "Akatsuki Triumphs!";
    else if (theme === "itachi") msg = "Crow Triumphs!";
    showWinScreen(msg);
  } else {
    scoreD++;
    showWinScreen(theme === "got" ? "The Long Night (Draw)" : "Draw");
  }

  persistScores();
  renderScores();
  renderTTT();
  persistLiveState();
}

function onTTTClick(i) {
  const aiMode = modeSelect.value.endsWith("-ai");
  if (tttOver || tttBoard[i]) return;
  if (aiMode && tttTurn === "O") return;

  resetIdleWatchdog();
  saveTTTSnapshot();
  tttBoard[i] = tttTurn;
  moveCount++;
  updateMoveCounter(true);
  const r = getTTTResult(tttBoard);
  if (r.winner) return finishTTT(r.winner, r.line);

  tttTurn = tttTurn === "X" ? "O" : "X";
  renderTTT();
  startTurnTimer();
  persistLiveState();

  if (aiMode && tttTurn === "O") {
    if (hubState.timer === "off" && statusPill) statusPill.textContent = "AI Thinking...";
    setTimeout(aiTTTMove, difficultySelect.value === "easy" ? 220 : difficultySelect.value === "medium" ? 420 : 640);
  }
}

/* ---------- Chess Engine & Custom UI ---------- */
const CHESS_U = { wp: "♟", wr: "♜", wn: "♞", wb: "♝", wq: "♛", wk: "♚", bp: "♟", br: "♜", bn: "♞", bb: "♝", bq: "♛", bk: "♚" };
const PIECE_VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
let chessBoard = [], chessTurn = "w", chessSelected = null, chessOver = false, whiteCaptured = [], blackCaptured = [], chessSnapshots = [];

function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function cloneBoard(b) { return b.map(row => row.map(cell => cell ? { ...cell } : null)); }

function saveChessSnapshot() {
  chessSnapshots.push({
    board: cloneBoard(chessBoard), turn: chessTurn, selected: chessSelected ? { ...chessSelected } : null,
    over: chessOver, whiteCaptured: [...whiteCaptured], blackCaptured: [...blackCaptured],
    scoreA, scoreB, scoreD, streak, moveCount
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
  chessTurn = "w"; chessSelected = null; chessOver = false; whiteCaptured = []; blackCaptured = []; chessSnapshots = [];
  moveCount = 0;
  updateMoveCounter(true);
  renderCaptured();
  renderChess();
  startTurnTimer();
}

/* ---------- 3D Embossed Tactile Chess Captured Counters ---------- */
function renderCaptured() {
  const pieceOrder = ["q", "r", "b", "n", "p"];

  function buildTrayHTML(capturedList, pieceColor) {
    if (!capturedList.length) return "";
    const counts = {};
    capturedList.forEach(p => {
      counts[p.type] = (counts[p.type] || 0) + 1;
    });

    return pieceOrder
      .filter(type => counts[type])
      .map(type => {
        const glyph = CHESS_U[pieceColor + type];
        const pieceClass = pieceColor === "w" ? "white-piece" : "black-piece";
        const count = counts[type];
        return `
          <div class="captured-piece-chip" title="${count} piece(s) captured">
            <span class="chip-icon ${pieceClass}">${glyph}</span>
            <span class="chip-badge">×${count}</span>
          </div>
        `;
      })
      .join("");
  }

  // Dynamic theme-based tray headers
  const whiteH = document.getElementById("whiteCapturedHeader");
  const blackH = document.getElementById("blackCapturedHeader");
  if (whiteH && blackH) {
    if (hubState.theme === "got") {
      whiteH.textContent = "Winterfell (Stark)";
      blackH.textContent = "Dragonstone (Targaryen)";
    } else if (hubState.theme === "naruto") {
      whiteH.textContent = "Konoha Shinobi";
      blackH.textContent = "Akatsuki Rogue";
    } else if (hubState.theme === "itachi") {
      whiteH.textContent = "Crow Captures";
      blackH.textContent = "Sharingan Captures";
    } else {
      whiteH.textContent = "White Captured";
      blackH.textContent = "Black Captured";
    }
  }

  // Left tray holds white captured pieces; Right tray holds black captured pieces
  if (whiteCapturedEl) {
    whiteCapturedEl.innerHTML = buildTrayHTML(whiteCaptured, "w");
  }
  if (blackCapturedEl) {
    blackCapturedEl.innerHTML = buildTrayHTML(blackCaptured, "b");
  }
}

function getPseudoMoves(board, r, c) {
  const p = board[r][c];
  if (!p) return [];
  const out = [];
  const add = (nr, nc) => { if (!inBounds(nr, nc)) return; const t = board[nr][nc]; if (!t || t.color !== p.color) out.push({ r: nr, c: nc }); };

  if (p.type === "p") {
    const dir = p.color === "w" ? -1 : 1, start = p.color === "w" ? 6 : 1;
    if (inBounds(r + dir, c) && !board[r + dir][c]) out.push({ r: r + dir, c });
    if (r === start && !board[r + dir][c] && !board[r + 2 * dir][c]) out.push({ r: r + 2 * dir, c });
    for (const dc of [-1, 1]) { const nr = r + dir, nc = c + dc; if (inBounds(nr, nc) && board[nr][nc] && board[nr][nc].color !== p.color) out.push({ r: nr, c: nc }); }
  } else if (p.type === "n") {
    [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => add(r + dr, c + dc));
  } else if (p.type === "k") {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (dr || dc) add(r + dr, c + dc);
  } else {
    const dirs = [];
    if (p.type === "b" || p.type === "q") dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    if (p.type === "r" || p.type === "q") dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
    for (const [dr, dc] of dirs) {
      let nr = r + dr, nc = c + dc;
      while (inBounds(nr, nc)) {
        if (!board[nr][nc]) out.push({ r: nr, c: nc });
        else { if (board[nr][nc].color !== p.color) out.push({ r: nr, c: nc }); break; }
        nr += dr; nc += dc;
      }
    }
  }
  return out;
}

function renderChess() {
  resetIdleWatchdog();
  boardWrap?.classList.remove("wordle-mode", "poker-mode", "imposter-mode");
  boardWrap?.classList.add("chess-mode");

  clearWinLine();
  tttBoardEl?.classList.add("hidden");
  wordleGameEl?.classList.add("hidden");
  pokerGameEl?.classList.add("hidden");
  imposterGameEl?.classList.add("hidden");
  chessBoardEl?.classList.remove("hidden");
  capturedLeft?.classList.remove("hidden");
  capturedRight?.classList.remove("hidden");

  if (!chessBoardEl || !Array.isArray(chessBoard) || !chessBoard.length) return;
  chessBoardEl.innerHTML = "";

  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const cell = document.createElement("div");
    cell.className = "chess-cell " + (((r + c) % 2 === 0) ? "light" : "dark");
    if (chessSelected && chessSelected.r === r && chessSelected.c === c) cell.classList.add("selected");

    const p = chessBoard[r][c];
    if (p) {
      cell.textContent = CHESS_U[p.color + p.type];
      cell.classList.add(p.color === "w" ? "white-piece" : "black-piece");
    }

    cell.addEventListener("click", () => onChessClick(r, c));
    chessBoardEl.appendChild(cell);
  }

  if (hubState.timer === "off" && statusPill) {
    if (hubState.theme === "got") {
      statusPill.textContent = chessOver ? "The Iron Throne is Decided" : `${chessTurn === "w" ? "Stark" : "Targaryen"}'s Move`;
    } else if (hubState.theme === "naruto") {
      statusPill.textContent = chessOver ? "Shinobi War Concluded" : `${chessTurn === "w" ? "Leaf Shinobi" : "Akatsuki"}'s Turn`;
    } else if (hubState.theme === "itachi") {
      statusPill.textContent = chessOver ? "Tsukuyomi Shattered" : `${chessTurn === "w" ? "White" : "Black"}'s Turn`;
    } else {
      statusPill.textContent = chessOver ? "Game Over" : `${chessTurn === "w" ? "White" : "Black"}'s Turn`;
    }
  }
}

function moveChess(board, mv, real = false) {
  const piece = board[mv.fr][mv.fc], target = board[mv.tr][mv.tc];
  if (target && real) {
    if (target.color === "w") whiteCaptured.push(target); else blackCaptured.push(target);
    if (target.type === "k") {
      chessOver = true;
      if (piece.color === "w") {
        scoreA++;
        updateStreak(modeSelect.value === "chess-ai");
        let winTxt = "White Wins";
        if (hubState.theme === "got") winTxt = "House Stark Conquers the Realm!";
        else if (hubState.theme === "naruto") winTxt = "Will of Fire Prevails!";
        else if (hubState.theme === "itachi") winTxt = "Tsukuyomi Ascendant!";
        showWinScreen(winTxt);
      } else {
        scoreB++;
        updateStreak(false);
        let winTxt = "Black Wins";
        if (hubState.theme === "got") winTxt = "Fire and Blood Reigns Supreme!";
        else if (hubState.theme === "naruto") winTxt = "Akatsuki Rules the World!";
        else if (hubState.theme === "itachi") winTxt = "Crow Flight Victorious!";
        showWinScreen(winTxt);
      }
      persistScores(); renderScores();
    }
    renderCaptured();
  }
  board[mv.tr][mv.tc] = piece; board[mv.fr][mv.fc] = null;
  if (piece.type === "p" && (mv.tr === 0 || mv.tr === 7)) piece.type = "q";
}

function allMovesForColor(board, color) {
  const out = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = board[r][c];
    if (!p || p.color !== color) continue;
    getPseudoMoves(board, r, c).forEach(m => out.push({ fr: r, fc: c, tr: m.r, tc: m.c }));
  }
  return out;
}

/* ---------- Chess Positional Tables (PST) & Move Ordering ---------- */
const PST_W = {
  p: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [ 5,  5, 10, 25, 25, 10,  5,  5],
    [ 0,  0,  0, 20, 20,  0,  0,  0],
    [ 5, -5,-10,  0,  0,-10, -5,  5],
    [ 5, 10, 10,-20,-20, 10, 10,  5],
    [ 0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [ 0,  0,  0,  5,  5,  0,  0,  0],
    [10, 10, 10, 10, 10, 10, 10, 10],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [ 5, 10, 10, 10, 10, 10, 10,  5],
    [ 0,  0,  0,  5,  5,  0,  0,  0]
  ],
  q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

function orderChessMoves(board, moves) {
  return moves.map(mv => {
    const target = board[mv.tr][mv.tc];
    const piece = board[mv.fr][mv.fc];
    let score = 0;
    if (target) {
      score = 10000 + (PIECE_VAL[target.type] || 0) * 10 - (PIECE_VAL[piece.type] || 0);
    }
    return { mv, score };
  }).sort((a, b) => b.score - a.score).map(x => x.mv);
}

function evalChess(board) {
  let s = 0;
  let hasWhiteKing = false, hasBlackKing = false;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const base = PIECE_VAL[p.type] || 0;
      const pst = PST_W[p.type] ? (p.color === "w" ? PST_W[p.type][r][c] : PST_W[p.type][7 - r][c]) : 0;
      const total = base + pst;
      if (p.color === "b") {
        s += total;
        if (p.type === "k") hasBlackKing = true;
      } else {
        s -= total;
        if (p.type === "k") hasWhiteKing = true;
      }
    }
  }
  if (!hasBlackKing) return -50000;
  if (!hasWhiteKing) return 50000;
  return s;
}

function minimaxChess(board, depth, alpha, beta, maxing) {
  const currentEval = evalChess(board);
  if (Math.abs(currentEval) >= 40000) return { score: currentEval, move: null };
  if (depth === 0) return { score: currentEval, move: null };

  const color = maxing ? "b" : "w";
  let moves = allMovesForColor(board, color);
  if (!moves.length) return { score: currentEval, move: null };
  moves = orderChessMoves(board, moves);
  let bestMove = moves[0];

  if (maxing) {
    let best = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      const mv = moves[i];
      const target = board[mv.tr][mv.tc];
      if (target && target.type === "k") return { score: 50000 + depth, move: mv };
      const b2 = cloneBoard(board);
      moveChess(b2, mv, false);
      const r = minimaxChess(b2, depth - 1, alpha, beta, false);
      if (r.score > best) { best = r.score; bestMove = mv; }
      alpha = Math.max(alpha, best.score);
      if (beta <= alpha) break;
    }
    return { score: best, move: bestMove };
  } else {
    let best = Infinity;
    for (let i = 0; i < moves.length; i++) {
      const mv = moves[i];
      const target = board[mv.tr][mv.tc];
      if (target && target.type === "k") return { score: -50000 - depth, move: mv };
      const b2 = cloneBoard(board);
      moveChess(b2, mv, false);
      const r = minimaxChess(b2, depth - 1, alpha, beta, true);
      if (r.score < best) { best = r.score; bestMove = mv; }
      beta = Math.min(beta, r.score);
      if (beta <= alpha) break;
    }
    return { score: best, move: bestMove };
  }
}

function onChessClick(r, c) {
  const aiMode = modeSelect.value === "chess-ai";
  if (chessOver) return;
  if (aiMode && chessTurn === "b") return;

  resetIdleWatchdog();
  const p = chessBoard[r][c];
  if (!chessSelected) {
    if (p && p.color === chessTurn) chessSelected = { r, c };
    renderChess();
    return;
  }

  const legal = getPseudoMoves(chessBoard, chessSelected.r, chessSelected.c).find(m => m.r === r && m.c === c);
  if (!legal) {
    chessSelected = (p && p.color === chessTurn) ? { r, c } : null;
    renderChess();
    return;
  }

  saveChessSnapshot();
  moveChess(chessBoard, { fr: chessSelected.r, fc: chessSelected.c, tr: r, tc: c }, true);
  moveCount++;
  updateMoveCounter(true);

  if (chessOver) { renderChess(); stopTurnTimer(); persistLiveState(); return; }

  chessSelected = null;
  chessTurn = chessTurn === "w" ? "b" : "w";
  renderChess();
  startTurnTimer();
  persistLiveState();

  if (aiMode && chessTurn === "b" && !chessOver) {
    if (hubState.timer === "off" && statusPill) statusPill.textContent = "AI Thinking...";
    setTimeout(() => {
      saveChessSnapshot();
      const diff = difficultySelect.value;
      const allMoves = allMovesForColor(chessBoard, "b");
      let mv = null;

      if (diff === "easy") {
        if (Math.random() < 0.35 && allMoves.length) {
          mv = allMoves[Math.floor(Math.random() * allMoves.length)];
        } else {
          const res = minimaxChess(chessBoard, 1, -Infinity, Infinity, true);
          mv = res.move || allMoves[0];
        }
      } else if (diff === "medium") {
        const res = minimaxChess(chessBoard, 2, -Infinity, Infinity, true);
        mv = res.move || allMoves[0];
      } else {
        // Hard: Depth 3 search with PST and MVV-LVA move ordering
        const res = minimaxChess(chessBoard, 3, -Infinity, Infinity, true);
        mv = res.move || allMoves[0];
      }

      if (mv) {
        moveChess(chessBoard, mv, true);
        moveCount++;
        updateMoveCounter(true);
        if (!chessOver) chessTurn = "w";
      }
      renderChess();
      startTurnTimer();
      persistLiveState();
    }, 420);
  }
}

/* ---------- Wordle Engine & Offline Dictionary ---------- */
const WORDLE_TIERS = {
  easy: [
    "APPLE","BEACH","BREAD","CHAIR","CLEAN","CLOUD","CRANE","DANCE","EARTH","FLAME",
    "FRUIT","GRASS","GREEN","HEART","HOUSE","LIGHT","MONEY","MUSIC","NIGHT","OCEAN",
    "PARTY","PHONE","PIANO","PLANT","POWER","QUEEN","RADIO","RIVER","ROUND","SHARE",
    "SHINE","SIGHT","SLEEP","SMILE","SNAKE","SPACE","STAGE","STORM","SUGAR","SWEET",
    "TABLE","TIGER","TRAIN","TRUTH","VOICE","WATCH","WATER","WHITE","WOMAN","WORLD",
    "YOUTH","ANGEL","BIRTH","BLACK","BRAIN","BRAVE","BROWN","CHILD","CLOCK","CROSS",
    "CROWN","DREAM","DRIVE","EAGLE","EARLY","FIELD","FIRST","FLASH","FRESH","FRONT",
    "GLASS","GLOBE","GLOVE","GRACE","GRAND","GRAPE","GREAT","GROUP","GUARD","GUIDE",
    "HAPPY","HORSE","HOTEL","IMAGE","LARGE","LEARN","LEMON","LUCKY","MAGIC","MAJOR",
    "MARCH","MATCH","METAL","MOUNT","MOUSE","MOUTH","NOBLE","NORTH","OFFER","PAINT",
    "PAPER","PEACE","PEACH","PILOT","PITCH","PLACE","PLAIN","PLANE","PLATE","POINT",
    "PRIDE","PRIZE","PROUD","QUIET","RANGE","REACH","RIGHT","ROBOT","ROYAL","SCALE",
    "SCENE","SCOPE","SCORE","SHAPE","SHARP","SHIRT","SHOCK","SHOOT","SHORT","SKILL",
    "SMART","SOLID","SOUND","SOUTH","SPEAK","SPEED","SPEND","SPORT","STAFF","STAND",
    "START","STATE","STEAM","STEEL","STONE","STORY","STYLE","TASTE","TEACH","THANK",
    "THEME","THINK","TOTAL","TOUCH","TOWER","TRACK","TRADE","TREAT","TREND","TRIAL",
    "TRUCK","TRUST","UNCLE","UNDER","UNION","VALUE","VIDEO","VISIT","WHEEL","WHOLE",
    "WRITE","WRONG"
  ],
  medium: [
    "ABOVE","ACUTE","ADAPT","ADMIT","ADULT","ALERT","ALIVE","ALLOW","ALTER","AMBER",
    "ANGER","ANGLE","ANGRY","APART","APPLY","ARENA","ARGUE","ARISE","ARROW","ASIDE",
    "ASSET","AUDIO","AUDIT","AVOID","AWAIT","AWAKE","AWARD","AWARE","BADGE","BASIC",
    "BASIN","BASIS","BATCH","BEAST","BEGAN","BEGIN","BEGUN","BEING","BELOW","BENCH",
    "BERRY","BLADE","BLAME","BLANK","BLAST","BLAZE","BLEED","BLEND","BLESS","BLIND",
    "BLINK","BLOCK","BLOOD","BLOOM","BLOWN","BLUSH","BOARD","BOAST","BOOST","BOOTH",
    "BOUND","BRACE","BRAID","BRAKE","BRAND","BRASS","BREED","BRICK","BRIDE","BRIEF",
    "BRING","BROAD","BROKE","BROOK","BROOM","BROTH","BRUSH","BUILD","BUILT","BURST",
    "CABIN","CABLE","CAMEL","CANAL","CANDY","CANOE","CARGO","CARRY","CARVE","CATER",
    "CAUSE","CEASE","CELLO","CHALK","CHAMP","CHANT","CHAOS","CHARM","CHART","CHASE",
    "CHASM","CHEAP","CHEAT","CHECK","CHEEK","CHEER","CHEST","CHIEF","CHILL","CHIPS",
    "CHOIR","CHOKE","CHORD","CHOSE","CHUNK","CIDER","CIGAR","CIVIC","CIVIL","CLAIM",
    "CLAMP","CLASH","CLASP","CLASS","CLEAR","CLERK","CLICK","CLIFF","CLIMB","CLOAK",
    "CLONE","CLOSE","CLOTH","CLOWN","COAST","COBRA","COCOA","COLON","COLOR","COMET",
    "COMIC","CORAL","COUCH","COUGH","COULD","COUNT","COURT","COVER","CRACK","CRAFT",
    "CRASH","CRATE","CRAZY","CREAM","CREEK","CREST","CRIME","CRISP","CROWD","CRUEL",
    "CRUSH","CRUST","CUBIC","CURRY","CURSE","CURVE","CYCLE","DAILY","DAIRY","DATED",
    "DEALT","DEATH","DEBIT","DEBUT","DECAY","DECOR","DELAY","DELTA","DEMON","DENSE",
    "DEPOT","DEPTH","DERBY","DETER","DEVIL","DIARY","DIGIT","DIRTY","DISCO","DITCH",
    "DIVER","DODGE","DOING","DONOR","DONUT","DOUBT","DOUGH","DOZEN","DRAFT","DRAIN",
    "DRAMA","DRANK","DRAWN","DREAD","DRESS","DRIED","DRIFT","DRILL","DRINK","DROLL",
    "DROVE","DROWN","DRUNK","DRYER","DUSKY","DUSTY","DUTCH","DWELL","DYING","EAGER",
    "EASEL","EATEN","EIGHT","ELBOW","ELDER","ELECT","ELITE","EMBER","EMPTY","ENACT",
    "ENEMY","ENJOY","ENTER","ENTRY","EQUAL","EQUIP","ERASE","ERECT","ERROR","ERUPT",
    "ESSAY","ETHER","ETHIC","EVENT","EVERY","EXACT","EXALT","EXCEL","EXERT","EXILE",
    "EXIST","EXTRA","FAINT","FAITH","FALSE","FANCY","FATAL","FAULT","FAVOR","FEAST",
    "FEVER","FIBER","FIEND","FIFTH","FIFTY","FIGHT","FINAL","FINCH","FIRST","FISHY",
    "FLASK","FLEET","FLESH","FLOAT","FLOCK","FLOOD","FLOOR","FLOUR","FLOWN","FLUID",
    "FLUTE","FOCUS","FORCE","FORGE","FORTH","FORTY","FORUM","FOUND","FOYER","FRAIL",
    "FRAME","FRANK","FRAUD","FREAK","FROST","FROZE","FUDGE","FUNNY","GIANT","GIVEN",
    "GLARE","GLAZE","GLEAM","GLIDE","GLORY","GOING","GOOSE","GORGE","GRAIN","GRANT",
    "GRAPH","GRASP","GRAVE","GRAVY","GREED","GREET","GRIEF","GRILL","GRIND","GROAN",
    "GROOM","GROSS","GROVE","GROWL","GROWN","GRUNT","GUESS","GUEST","GUILT","HABIT",
    "HAIRY","HANDY","HARSH","HASTE","HASTY","HATCH","HAVEN","HAVOC","HAZEL","HEAVY",
    "HEDGE","HELLO","HENCE","HONEY","HONOR","HOUND","HOVER","HUMAN","HUMID","HUMOR",
    "HURRY","INDEX","INNER","INPUT","ISSUE","IVORY","JEANS","JELLY","JEWEL","JOINT",
    "JOKER","JUDGE","JUICE","JUICY","KNIFE","KNOCK","KNOWN","LABEL","LABOR","LASER",
    "LATCH","LATER","LAUGH","LAYER","LEAST","LEAVE","LEGAL","LEVEL","LEVER","LIMIT",
    "LINEN","LOCAL","LODGE","LOGIC","LOOSE","LOWER","LOYAL","LUCID","LUNCH","MAGIC",
    "MAKER","MANOR","MARRY","MARSH","MASON","MAYOR","MEANT","MEDAL","MEDIA","MELON",
    "MERCY","MERGE","MERIT","MERRY","METER","METRO","MICRO","MIDST","MIGHT","MINOR",
    "MINUS","MODEL","MODEM","MOIST","MONTH","MORAL","MOTOR","MOTTO","MOUNT","MOURN",
    "MOUSE","MOUTH","MOVIE","MUDDY","MURAL","MUSIC","NAIVE","NERVE","NEVER","NEWER",
    "NICER","NICHE","NIGHT","NINJA","NINTH","NOBLE","NOISE","NORTH","NOTED","NOVEL",
    "NURSE","OCCUR","OCTAL","OFFER","OFTEN","OLDER","OLIVE","ONION","ONSET","OPERA",
    "OPTIC","ORBIT","ORDER","ORGAN","OTHER","OTTER","OUGHT","OUNCE","OUTER","OWNER",
    "OXIDE","PAGAN","PANEL","PANIC","PAPER","PARTY","PASTA","PASTE","PATCH","PATIO",
    "PAUSE","PEARL","PENNY","PERCH","PERIL","PETAL","PHASE","PHOTO","PIECE","PINCH",
    "PITCH","PIXEL","PIZZA","PLAZA","POINT","POLAR","PORCH","POUND","POWER","PRANK",
    "PRESS","PRICE","PRIDE","PRIME","PRINT","PRIOR","PRIZE","PROBE","PRONE","PROOF",
    "PROSE","PROUD","PROVE","PULSE","PUNCH","PUPIL","PUPPY","PURSE","QUEEN","QUERY",
    "QUEST","QUICK","QUIET","QUOTA","QUOTE","RADAR","RADIO","RAISE","RALLY","RANCH",
    "RAPID","RATIO","RAVEN","RAZOR","REACT","READY","REALM","REBEL","REFER","RELAX",
    "REPLY","RESET","RIDGE","RIGHT","RIGID","RIVAL","ROAST","ROBOT","ROUGH","ROUTE",
    "ROYAL","RULER","RUMOR","RURAL","RUSTY","SADLY","SAINT","SALAD","SALON","SALSA",
    "SALTY","SAUCE","SAUNA","SAVOR","SCALE","SCARF","SCENE","SCENT","SCOPE","SCORE",
    "SCORN","SCOUT","SCRAP","SCREW","SCRUB","SEDAN","SEIZE","SENSE","SERVE","SETUP",
    "SEVEN","SEVER","SHADE","SHAFT","SHAKE","SHAME","SHARE","SHARK","SHARP","SHEEP",
    "SHEET","SHELF","SHELL","SHIFT","SHINE","SHIRT","SHOCK","SHOOT","SHORE","SHORT",
    "SHOUT","SHOWN","SIGHT","SINCE","SIREN","SIXTH","SIXTY","SKILL","SKIRT","SKULL",
    "SLASH","SLATE","SLEEP","SLICE","SLIDE","SLOPE","SMART","SMELL","SMILE","SMOKE",
    "SNACK","SNAKE","SOLAR","SOLID","SOLVE","SORRY","SOUND","SOUTH","SPACE","SPARE",
    "SPARK","SPEAK","SPEAR","SPEED","SPELL","SPEND","SPENT","SPICE","SPICY","SPILL",
    "SPINE","SPITE","SPLIT","SPOON","SPORT","SPRAY","SQUAD","STAFF","STAGE","STAIN",
    "STAIR","STAKE","STALE","STAMP","STAND","STARE","START","STATE","STEAM","STEEL",
    "STEEP","STEER","STICK","STIFF","STILL","STOCK","STONE","STOOL","STOOP","STORE",
    "STORM","STORY","STRAP","STRAW","STRIP","STUCK","STUDY","STUFF","STYLE","SUGAR",
    "SUITE","SUNNY","SUPER","SURGE","SWEAT","SWEET","SWIFT","SWING","SWORD","TABLE",
    "TAKEN","TASTE","TEACH","TEETH","TEMPO","THANK","THEFT","THEIR","THEME","THERE",
    "THESE","THICK","THIEF","THIGH","THING","THINK","THIRD","THOSE","THREE","THREW",
    "THROW","THUMB","TIGER","TIGHT","TIMER","TITLE","TOAST","TODAY","TOKEN","TOOTH",
    "TOPIC","TOTAL","TOUCH","TOUGH","TOWER","TOXIC","TRACE","TRACK","TRADE","TRAIL",
    "TRAIN","TRAIT","TRASH","TREAT","TREND","TRIAL","TRIBE","TRICK","TRIED","TROOP",
    "TRUCK","TRULY","TRUMP","TRUNK","TRUST","TRUTH","TUTOR","TWICE","TWIST","UNCLE",
    "UNDER","UNION","UNITE","UNITY","UNTIL","UPPER","UPSET","URBAN","USAGE","USUAL",
    "VALID","VALUE","VALVE","VAPOR","VAULT","VEGAN","VENUE","VERSE","VIDEO","VIRAL",
    "VIRUS","VISIT","VITAL","VOICE","VOTER","VOWEL","WASTE","WATCH","WATER","WEARY",
    "WEAVE","WEIGH","WEIRD","WHEAT","WHEEL","WHERE","WHICH","WHILE","WHITE","WHOLE",
    "WHOSE","WIDOW","WIDTH","WINDY","WOMAN","WOMEN","WORLD","WORRY","WORSE","WORST",
    "WORTH","WOULD","WOUND","WRIST","WRITE","WRONG","YACHT","YEARN","YEAST","YIELD",
    "YOUNG","YOUTH","ZEBRA"
  ],
  hard: [
    "KNOLL","VIVID","FJORD","PROXY","QUIRK","PUPPY","MUMMY","CYNIC","GAUZE","ENVOY",
    "GLYPH","OZONE","WALTZ","CRYPT","ABYSS","AGONY","AMISS","ANNEX","APHID","ATOLL",
    "AXIOM","BAYOU","BICEP","BOGEY","BOOZE","BUXOM","CABAL","COVEN","DECOY","DIZZY",
    "DOWRY","DWARF","EPOXY","EQUIP","FEIGN","FERRY","FLAIL","FLUFF","FOYER","FUNKY",
    "GAFFE","GECKO","GIZMO","GNOME","GOLEM","GOUGE","GUPPY","HYENA","ICHOR","IDIOM",
    "IGLOO","IONIC","ITCHY","JAZZY","JERKY","JOUST","JUMBO","JUMPY","JUNTO","KAPUT",
    "KAYAK","KAZOO","KHAKI","KINKY","KIOSK","KOALA","KRILL","KUDOS","LEMUR","LILAC",
    "LIMBO","LIVID","LLAMA","LOBBY","LYMPH","MADAM","MAFIA","MAGMA","MAMBO","MAXIM",
    "MIMIC","MINX","MODAL","MOCHA","MOGUL","MYRRH","NADIR","NANNY","NYMPH","OCTAL",
    "ODDLY","OFFAL","OGRE","OPINE","OPIUM","OXIDE","PADDY","PALSY","PAPPY","PIQUE",
    "PIZZA","POLYP","POPPY","POSSE","POUCH","PYGMY","QUACK","QUAFF","QUAIL","QUAKE",
    "QUALM","QUARK","QUART","QUASH","QUASI","QUELL","QUEUE","QUILL","QUILT","RADII",
    "RADON","RAYON","RHINO","ROUGE","SALVO","SAVVY","SCION","SCOFF","SEGUE","SHEIK",
    "SHREW","SHRUB","SHRUG","SKULK","SLOTH","SMELT","SNOUT","SNOWY","SPASM","SQUID",
    "SWAMI","SWAMP","SYNOD","TAFFY","TALON","THYME","TIARA","TIBIA","TITAN","TONIC",
    "TOPAZ","TOXIN","TRAWL","TRIAD","TRITE","TROLL","TWANG","UDDER","ULCER","ULTRA",
    "UMBRA","UNFED","UNFIT","UNIFY","UNLIT","UNMET","UNSET","UNTIE","UNZIP","UPBEAT",
    "USURP","VALET","VALOR","VENOM","VERGE","VICAR","VIGOR","VILLA","VINYL","VIOLA",
    "VIPER","VISOR","VISTA","VIXEN","VODKA","VOGUE","VOILA","WAFER","WAGER","WHELP",
    "WHINY","WHIRL","WHISK","WIGHT","WINCH","WOKEN","WRACK","WRATH","WREAK","WRECK",
    "WRUNG","WRYLY","XENON","YUCCA","ZESTY","ZILCH","ZONAL"
  ]
};

const WORDLE_DICTIONARY_RAW = "ABOUT ABOVE ABUSE ACTOR ACUTE ADAPT ADMIT ADOPT ADULT AFTER AGAIN AGENT AGREE AHEAD AISLE ALARM ALBUM ALERT ALIKE ALIVE ALLOW ALONE ALONG ALTER AMBER AMISS AMONG AMUSE ANGEL ANGER ANGLE ANGRY ANNEX ANNOY APART APHID APPLE APPLY ARENA ARGUE ARISE ARRAY ARROW ASIDE ASSET ATOLL AUDIO AUDIT AVOID AWAIT AWAKE AWARD AWARE AWFUL AXIOM BACON BADGE BADLY BAKER BALDY BANJO BARGE BARON BASIC BASIN BASIS BATCH BATHE BAYOU BEACH BEAST BEGAN BEGIN BEGUN BEING BELLY BELOW BENCH BERRY BERTH BESET BIBLE BICEP BIKER BIRTH BISON BLACK BLADE BLAME BLANK BLAST BLAZE BLEAK BLEED BLEND BLESS BLIMP BLIND BLINK BLISS BLOCK BLOND BLOOD BLOOM BLOWN BLUFF BLUNT BLURB BLURT BLUSH BOARD BOAST BOBBY BOGEY BOOST BOOTH BOOTY BOOZE BOSOM BOSSY BOUND BOWEL BOXER BRACE BRAID BRAIN BRAKE BRAND BRASS BRAVE BREAD BREAK BREED BRIAR BRIBE BRICK BRIDE BRIEF BRINE BRING BRINK BROAD BROKE BROOD BROOK BROOM BROTH BROWN BRUSH BRUTE BUDDY BUILD BUILT BULGE BULLY BUNCH BUNNY BURST BUYER BYLAW CABAL CABIN CABLE CADET CAMEL CANAL CANDY CANOE CANON CARAT CARGO CARRY CARVE CATER CAUSE CEASE CELLO CHAIR CHALK CHAMP CHANT CHAOS CHARM CHART CHASE CHASM CHEAP CHEAT CHECK CHEEK CHEER CHESS CHEST CHICK CHIEF CHILD CHILL CHIPS CHOIR CHOKE CHORD CHOSE CHUCK CHUNK CHURN CIDER CIGAR CINCH CIRCA CIVIC CIVIL CLAIM CLAMP CLASH CLASP CLASS CLEAN CLEAR CLERK CLICK CLIFF CLIMB CLING CLOAK CLOCK CLONE CLOSE CLOTH CLOUD CLOVE CLOWN COAST COBRA COCOA COLON COLOR COMET COMIC CONDO CORAL COUCH COUGH COULD COUNT COUPE COURT COVEN COVER CRACK CRAFT CRANE CRANK CRASH CRATE CRAVE CRAZY CREAM CREEK CREEP CREST CRICK CRIME CRIMP CRISP CROAK CROCK CRONY CROOK CROSS CROWD CROWN CRUDE CRUEL CRUSH CRUST CRYPT CUBIC CUPID CURRY CURSE CURVE CYCLE CYNIC DADDY DAILY DAIRY DAISY DANCE DANDY DATED DEALT DEATH DEBIT DEBUT DECAL DECAY DECOY DECRY DEFER DEIGN DELAY DELTA DEMON DEMUR DENIM DENSE DEPOT DEPTH DERBY DETER DETOX DEUCE DEVIL DIARY DICEY DIGIT DINER DINGO DIRTY DISCO DITCH DIVER DIZZY DODGE DOGMA DOING DONOR DONUT DOPEY DOUBT DOUGH DOWRY DOZEN DRAFT DRAIN DRAMA DRANK DRAWN DREAD DREAM DRESS DRIED DRIFT DRILL DRINK DRIVE DROLL DRONE DROOP DROVE DROWN DRUID DRUNK DRYER DUCAL DULLY DUMMY DUMPY DUNCE DUSKY DUSTY DUTCH DWARF DWELL DYING EAGER EAGLE EARLY EARTH EASEL EATEN EATER EBONY ECLAT EDEMA EERIE EIGHT ELBOW ELDER ELECT ELEGY ELFIN ELITE ELUDE EMBER EMPTY ENACT ENDOW ENEMY ENJOY ENNUI ENTER ENTRY ENVOY EPOCH EPOXY EQUAL EQUIP ERASE ERECT ERODE ERROR ERUPT ESSAY ETHER ETHIC ETHOS EVADE EVENT EVERY EVICT EXACT EXALT EXCEL EXERT EXILE EXIST EXPEL EXTRA FAINT FAITH FAKIR FALSE FANCY FATAL FATTY FAULT FAUNA FAVOR FEAST FECAL FEIGN FEINT FELON FEMUR FENCE FERAL FERRY FETCH FEVER FEWER FIBER FIELD FIEND FIERY FIFTH FIFTY FIGHT FILER FILTH FINAL FINCH FINER FIRST FISHY FIXER FJORD FLACK FLAIL FLAIR FLAKE FLAME FLANK FLASH FLASK FLECK FLEET FLESH FLICK FLIER FLING FLINT FLIPS FLIRT FLOAT FLOCK FLOOD FLOOR FLORA FLOUR FLOWN FLUFF FLUID FLUKE FLUNG FLUSH FLUTE FLYER FOAMY FOCAL FOCUS FOGGY FOIST FOLIO FOLLY FORAY FORCE FORGE FORGO FORTE FORTH FORTY FORUM FOUND FOUNT FOYER FRAIL FRAME FRANK FRAUD FREAK FREED FREER FRESH FRIAR FRIED FRILL FRISK FROST FROTH FROWN FROZE FRUIT FUDGE FUGUE FULLY FUNGI FUNKY FUNNY FUROR FURRY FUSED FUSSY FUZZY GAFFE GAILY GAMER GAMMA GAMUT GAUGE GAUZE GAWKY GECKO GEESE GENIE GENRE GHOST GHOUL GIANT GIDDY GIVEN GIVER GLADE GLAND GLARE GLASS GLAZE GLEAM GLEAN GLIDE GLINT GLOAT GLOBE GLOOM GLORY GLOSS GLOVE GLYPH GNASH GNOME GODLY GOING GOLEM GONER GOOFY GOOSE GORGE GOUGE GOURD GRACE GRADE GRAFT GRAIL GRAIN GRAND GRANT GRAPE GRAPH GRASP GRASS GRATE GRAVE GRAVY GRAZE GREAT GREED GREEN GREET GRIEF GRILL GRIME GRIMY GRIND GRIPE GROAN GROIN GROOM GROSS GROUP GROUT GROVE GROWL GROWN GRUEL GRUFF GRUNT GUARD GUAVA GUESS GUEST GUIDE GUILD GUILT GUISE GULCH GULLY GUMBO GUMMY GUPPY GUSTO GUSTY HABIT HAIRY HALVE HANDY HAPPY HARDY HAREM HARSH HASTE HASTY HATCH HATER HAUNT HAUTE HAVEN HAVOC HAZEL HEADY HEARD HEART HEATH HEAVE HEAVY HEDGE HEFTY HELLO HENCE HERON HILLY HINGE HIPPO HIPPY HITCH HOARD HOBBY HOIST HOLLY HOMER HONEY HONOR HORDE HORSE HOTEL HOUND HOUSE HOVEL HOVER HOWDY HUMAN HUMID HUMOR HUMPH HUMUS HUNCH HURRY HUSKY HUTCH HYDRA HYENA HYPER ICING IDEAL IDIOT IGLOO ILIAC IMAGE IMBUE IMPEL IMPLY INANE INCUR INDEX INEPT INERT INFER INGOT INLAY INLET INNER INPUT INTER INTRO IONIC IRATE IRONY ISLET ISSUE ITCHY IVORY JAUNT JAZZY JELLY JERKY JETTY JEWEL JIFFY JOINT JOKER JOLLY JOUST JUDGE JUICE JUICY JUMBO JUMPY JUNTO JUROR KARMA KAYAK KEBAB KHAKI KIOSK KNACK KNAVE KNEAD KNEEL KNELT KNIFE KNOCK KNOLL KNOWN KOALA KRILL LABEL LABOR LADLE LAGER LANCE LANKY LAPEL LAPSE LARGE LARVA LASER LATCH LATER LATHE LATTE LAUGH LAYER LEACH LEAFY LEAKY LEANT LEAPT LEARN LEASE LEASH LEAST LEAVE LEDGE LEECH LEERY LEFTY LEGAL LEGGY LEMON LEMUR LEPER LEVEL LEVER LIBEL LIEGE LIGHT LIKEN LILAC LIMBO LIMIT LINEN LINER LINGO LIPID LITHE LIVER LIVID LLAMA LOAMY LOATH LOBBY LOCAL LOCUS LODGE LOFTY LOGIC LOGIN LOOSE LORRY LOSER LOTTO LOTUS LOUSE LOUSY LOVER LOWER LOWLY LOYAL LUCID LUCKY LUMEN LUMPY LUNAR LUNCH LUNGE LURCH LURID LUSTY LYING LYMPH LYNCH LYRIC MACAW MACHO MACRO MADAM MADLY MAFIA MAGIC MAGMA MAIZE MAJOR MAKER MAMBO MAMMA MAMMY MANGA MANGO MANGY MANIA MANIC MANLY MANOR MAPLE MARCH MARRY MARSH MASON MATCH MATEY MAUVE MAXIM MAYBE MAYOR MEALY MEANT MEATY MECCA MEDAL MEDIA MEDIC MELEE MELON MERCY MERGE MERIT MERRY METAL METER METRO MICRO MIDGE MIDST MIGHT MILKY MIMIC MINCE MINER MINOR MINTY MINUS MIRTH MISER MISSY MOCHA MODAL MODEL MODEM MOIST MOLAR MOLDY MONEY MONTH MOODY MOOSE MORAL MORON MORPH MOSSY MOTEL MOTIF MOTOR MOTTO MOULT MOUND MOUNT MOURN MOUSE MOUTH MOVER MOVIE MOWER MUCKY MUCUS MUDDY MULCH MUMMY MURAL MURKY MUSHY MUSIC MUSKY MUSTY MYRRH NADIR NAIVE NANNY NASAL NASTY NATAL NAVAL NAVEL NEEDY NEIGH NERDY NERVE NEVER NEWER NEWLY NICER NICHE NIECE NIGHT NINJA NINTH NOBLE NOBLY NOISE NOISY NOMAD NOOSE NORTH NOSEY NOTCH NOVEL NUDGE NURSE NUTTY NYMPH OASIS OBESE OCCUR OCEAN OCTAL OCTET ODDER ODDLY OFFAL OFFER OFTEN OLDER OLIVE OMEGA ONION ONSET OPERA OPINE OPIUM OPTIC ORBIT ORDER ORGAN OTHER OTTER OUGHT OUNCE OUTDO OUTER OUTGO OVARY OVATE OVERT OVINE OVOID OWING OWNER OXIDE OZONE PADDY PAGAN PAINT PALER PALSY PANEL PANIC PANSY PAPAL PAPER PARER PARKA PARRY PARSE PARTY PASTA PASTE PASTY PATCH PATIO PATSY PATTY PAUSE PAYEE PAYER PEACE PEACH PEARL PECAN PEDAL PENAL PENCE PENNE PENNY PERCH PERIL PERKY PESKY PESTO PETAL PETTY PHASE PHONE PHOTO PIANO PICKY PIECE PIETY PIGGY PILOT PINCH PINEY PINKY PINTO PIPER PIPES PIQUE PITCH PITHY PIVOT PIXEL PIZZA PLACE PLAID PLAIN PLAIT PLANE PLANK PLANT PLATE PLAZA PLEAD PLEAT PLIED PLIER PLUCK PLUMB PLUME PLUMP PLUSH POESY POINT POISE POKER POLAR POLKA POLYP POPPY PORCH POSER POSSE POUCH POUND POWER PRANK PRAWN PREEN PRESS PRICE PRICK PRIDE PRIED PRIME PRIMO PRINT PRIOR PRISM PRIVY PRIZE PROBE PRONE PRONG PROOF PROSE PROUD PROVE PROWL PROXY PRUDE PRUNE PSALM PUBIC PUDGY PUFFY PULSE PUNCH PUPIL PUPPY PUREE PURER PURGE PURSE PUSHY PUTTY PYGMY QUACK QUAFF QUAIL QUAKE QUALM QUARK QUART QUASH QUASI QUEEN QUEER QUELL QUERY QUEST QUEUE QUICK QUIET QUILL QUILT QUIRK QUITE QUOTA QUOTE RABBI RABID RACER RADAR RADII RADIO RAINY RAISE RAJAH RALLY RAMEN RANCH RANGE RAPID RARER RASPY RATIO RATTY RAVEN RAYON RAZOR REACH REACT READY REALM REARM REBAR REBEL REBUS REBUT RECAP RECUR REEDY REFER REFIT REGAL REHAB REIGN RELAX RELAY RELIC REMIT RENAL RENEW REPAY REPEL REPLY RESET RESIN RETRO REUSE REVEL REVUE RHINO RHYME RIDER RIDGE RIFLE RIGHT RIGID RIGOR RINSE RIPEN RIPER RISEN RISER RISKY RIVAL RIVER RIVET ROACH ROAST ROBIN ROBOT ROCKY RODEO ROGUE ROOMY ROOST ROTOR ROUGE ROUGH ROUND ROUSE ROUTE ROVER ROWDY ROYAL RUBLE RUDDY RUDER RUGBY RULER RUMBA RUMOR RUNNY RURAL RUSTY SADLY SAFER SAINT SALAD SALLY SALON SALSA SALTY SALVE SALVO SANDY SANER SAPPY SASSY SATIN SATYR SAUCE SAUCY SAUNA SAUTE SAVOR SAVVY SCALD SCALE SCALP SCALY SCAMP SCANT SCARE SCARF SCARY SCENE SCENT SCION SCOFF SCOLD SCONE SCOOP SCOPE SCORE SCORN SCOUR SCOUT SCOWL SCRAM SCRAP SCREE SCREW SCRUB SCRUM SCUBA SEDAN SEEDY SEGUE SEIZE SEMEN SENOR SENSE SEPIA SERIF SERUM SERVE SETUP SEVEN SEVER SEWER SHACK SHADE SHADY SHAFT SHAKE SHAKY SHALE SHALL SHAME SHANK SHAPE SHARD SHARE SHARK SHARP SHAVE SHAWL SHEAF SHEAR SHEEN SHEEP SHEER SHEET SHEIK SHELF SHELL SHIED SHIFT SHINE SHINY SHIRE SHIRK SHIRT SHOCK SHOED SHOOT SHORE SHORN SHORT SHOUT SHOVE SHOWN SHOWY SHREW SHRUB SHRUG SHUCK SHUNT SHUSH SHYLY SIEGE SIEVE SIGHT SIGMA SILKY SILLY SINCE SINEW SINGE SIREN SISSY SIXTH SIXTY SKATE SKIER SKIFF SKILL SKIMP SKIRT SKULK SKULL SKUNK SLACK SLAIN SLANG SLANT SLASH SLATE SLEEK SLEEP SLEET SLEPT SLICE SLICK SLIDE SLIME SLIMY SLING SLINK SLOOP SLOPE SLOSH SLOTH SLUMP SLUNG SLUNK SLURP SLUSH SLYLY SMACK SMALL SMART SMASH SMEAR SMELL SMELT SMILE SMIRK SMITE SMITH SMOCK SMOKE SMOKY SMOTE SNACK SNAIL SNAKE SNAKY SNARE SNARL SNEAK SNEER SNIDE SNIFF SNIPE SNOOP SNORE SNORT SNOUT SNOWY SNUCK SNUFF SOAPY SOBER SOGGY SOLAR SOLID SOLVE SONAR SONIC SOOTH SOOTY SORRY SOUND SOUTH SOWER SPACE SPADE SPANK SPARE SPARK SPASM SPAWN SPEAK SPEAR SPECK SPEED SPELL SPELT SPEND SPENT SPERM SPICE SPICY SPIED SPIEL SPIKE SPIKY SPILL SPILT SPINE SPINY SPIRE SPITE SPLAT SPLIT SPOIL SPOKE SPOOF SPOOK SPOOL SPOON SPORE SPORT SPOUT SPRAY SPREE SPRIG SPURT SQUAD SQUAT SQUIB SQUID STACK STAFF STAGE STAID STAIN STAIR STAKE STALE STALK STALL STAMP STAND STANK STARE STARK START STASH STATE STAVE STEAD STEAK STEAL STEAM STEED STEEL STEEP STEER STEIN STERN STICK STIFF STILL STILT STING STINK STINT STOCK STOIC STOKE STOLE STOMP STONE STONY STOOD STOOL STOOP STORE STORK STORM STORY STOUT STOVE STRAP STRAW STRAY STRIP STRUT STUCK STUDY STUFF STUMP STUNG STUNK STUNT STYLE SUAVE SUGAR SUING SUITE SULKY SULLY SUMAC SUNNY SUPER SURER SURGE SURLY SUSHI SWAMI SWAMP SWARM SWASH SWATH SWEAR SWEAT SWEEP SWEET SWELL SWEPT SWIFT SWILL SWINE SWING SWIRL SWISH SWOON SWOOP SWORD SWORE SWORN SYLPH SYNOD SYRUP TABBY TABLE TABOO TACIT TACKY TAFFY TAINT TAKEN TAKER TALLY TALON TAMER TANGO TANGY TAPER TAPIR TARDY TAROT TASTE TASTY TATTY TAUNT TAWNY TEACH TEARY TEASE TEDDY TEETH TEMPO TENET TENOR TENSE TENTH TEPEE TEPID TERRA TERSE TESTY THANK THEFT THEIR THEME THERE THESE THICK THIEF THIGH THING THINK THIRD THONG THORN THOSE THREE THREW THROB THROW THUMB THUMP THYME TIARA TIBIA TIDAL TIGER TIGHT TILDE TIMER TIMID TIPSY TITAN TITHE TITLE TOAST TODAY TODDY TOKEN TONAL TONGS TONIC TOOTH TOPAZ TOPIC TORCH TORSO TOTAL TOTEM TOUCH TOUGH TOWEL TOWER TOXIC TOXIN TRACE TRACK TRACT TRADE TRAIL TRAIN TRAIT TRAMP TRASH TRAWL TREAD TREAT TREND TRIAD TRIAL TRIBE TRICE TRICK TRIED TRIPE TRITE TROLL TROOP TROPE TROUT TROVE TRUCE TRUCK TRUER TRULY TRUMP TRUNK TRUSS TRUST TRUTH TRYST TUBAL TUBER TULIP TUMOR TUNIC TURBO TUTOR TWANG TWEAK TWEED TWEET TWICE TWINE TWIRL TWIST TYING UDDER ULCER ULTRA UMBRA UNCLE UNCUT UNDER UNDUE UNFED UNFIT UNIFY UNION UNITE UNITY UNLIT UNMET UNSET UNTIE UNTIL UNZIP UPEND UPPER UPSET URBAN URINE USAGE USHER USING USUAL USURP UTTER VAGUE VALET VALID VALOR VALUE VALVE VAPID VAPOR VAULT VAUNT VEGAN VENOM VENUE VERGE VERSE VERSO VERVE VICAR VIDEO VIGIL VIGOR VILLA VINYL VIOLA VIPER VIRAL VIRUS VISOR VISTA VITAL VIVID VIXEN VOCAL VODKA VOGUE VOICE VOILA VOMIT VOTER VOUCH VOWEL VYING WACKY WAFER WAGER WAGON WAIST WAIVE WALTZ WARTY WASTE WATCH WATER WAVER WAXEN WEARY WEAVE WEDGE WEEDY WEIGH WEIRD WELCH WELSH WENCH WHACK WHALE WHARF WHEAT WHEEL WHELP WHERE WHICH WHIFF WHILE WHINE WHINY WHIRL WHISK WHITE WHOLE WHOOP WHOSE WIDEN WIDER WIDOW WIDTH WIELD WIGHT WILLY WIMPY WINCE WINCH WINDY WIPER WIRED WISER WISPY WITCH WITTY WOKEN WOMAN WOMEN WOODY WOOER WOOZY WORDY WORLD WORRY WORSE WORST WORTH WOULD WOUND WOVEN WRACK WRATH WREAK WRECK WREST WRING WRIST WRITE WRONG WROTE WRUNG WRYLY YACHT YEARN YEAST YIELD YOUNG YOUTH ZEBRA ZESTY ZILCH ZONAL";

const VALID_DICTIONARY_WORDS = new Set([
  ...WORDLE_TIERS.easy,
  ...WORDLE_TIERS.medium,
  ...WORDLE_TIERS.hard,
  ...WORDLE_DICTIONARY_RAW.split(" ")
]);

const WORDLE_KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"]
];

let wordleTarget = "CHAIR", wordleRow = 0, wordleCol = 0, wordleGrid = [], wordleOver = false;
let wordleLocked = false;

function evaluateWordleGuess(guess, target) {
  const result = Array(5).fill("absent");
  const targetChars = target.split("");
  const guessChars = guess.split("");
  const counts = {};

  for (let i = 0; i < 5; i++) {
    counts[targetChars[i]] = (counts[targetChars[i]] || 0) + 1;
  }

  // Pass 1: exact matches
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = "correct";
      counts[guessChars[i]]--;
    }
  }

  // Pass 2: misplaced matches
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const c = guessChars[i];
    if (counts[c] && counts[c] > 0) {
      result[i] = "present";
      counts[c]--;
    }
  }

  return result;
}

function getWordleTargetByDifficulty() {
  const tier = hubState.difficulty || "medium";
  const pool = WORDLE_TIERS[tier] || WORDLE_TIERS.medium;
  return pool[Math.floor(Math.random() * pool.length)];
}

function initWordle() {
  resetIdleWatchdog();
  clearWinLine();
  stopTurnTimer();
  showTimerInactive();
  updateMoveCounter(false);
  boardWrap?.classList.remove("chess-mode", "poker-mode", "imposter-mode");
  boardWrap?.classList.add("wordle-mode");
  capturedLeft?.classList.add("hidden");
  capturedRight?.classList.add("hidden");
  tttBoardEl?.classList.add("hidden");
  chessBoardEl?.classList.add("hidden");
  pokerGameEl?.classList.add("hidden");
  imposterGameEl?.classList.add("hidden");
  wordleGameEl?.classList.remove("hidden");

  wordleTarget = getWordleTargetByDifficulty();
  wordleRow = 0;
  wordleCol = 0;
  wordleOver = false;
  wordleLocked = false;
  wordleGrid = Array.from({ length: 6 }, () => Array(5).fill(""));
  if (statusPill) statusPill.textContent = "Wordle (" + hubState.difficulty.toUpperCase() + ")";
  renderWordle();
}

function renderWordleKeyboard(keyStatuses) {
  if (!wordleKeyboardEl) return;
  wordleKeyboardEl.innerHTML = "";
  WORDLE_KEYBOARD_LAYOUT.forEach(row => {
    const rowEl = document.createElement("div");
    rowEl.className = "kb-row";
    row.forEach(key => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "kb-key" + (key === "ENTER" || key === "DEL" ? " wide" : "");
      btn.dataset.key = key;
      if (key === "DEL") {
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>';
      } else {
        btn.textContent = key;
      }
      if (keyStatuses[key]) {
        btn.classList.add(keyStatuses[key]);
      }
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        handleWordleKey(key);
      });
      rowEl.appendChild(btn);
    });
    wordleKeyboardEl.appendChild(rowEl);
  });
}

function updateVirtualKey(char, newStatus) {
  const btn = wordleKeyboardEl?.querySelector(`[data-key="${char}"]`);
  if (!btn) return;
  if (newStatus === "correct") {
    btn.classList.remove("present", "absent");
    btn.classList.add("correct");
  } else if (newStatus === "present" && !btn.classList.contains("correct")) {
    btn.classList.remove("absent");
    btn.classList.add("present");
  } else if (newStatus === "absent" && !btn.classList.contains("correct") && !btn.classList.contains("present")) {
    btn.classList.add("absent");
  }
}

function renderWordle() {
  if (!wordleBoardEl || !wordleKeyboardEl) return;
  wordleBoardEl.innerHTML = "";
  const keyStatuses = {};

  for (let r = 0; r < 6; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "wordle-row";
    rowEl.id = "wr-" + r;

    const isSubmitted = (r < wordleRow) || (r === wordleRow && wordleOver && wordleGrid[r].every(Boolean));
    const rowWord = wordleGrid[r].join("");
    const rowStatuses = (isSubmitted && rowWord.length === 5) ? evaluateWordleGuess(rowWord, wordleTarget) : null;

    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.className = "wordle-tile";
      tile.id = "wt-" + r + "-" + c;
      tile.textContent = wordleGrid[r][c];

      if (rowStatuses) {
        const st = rowStatuses[c];
        tile.classList.add(st);
        const char = wordleGrid[r][c];
        if (st === "correct") {
          keyStatuses[char] = "correct";
        } else if (st === "present" && keyStatuses[char] !== "correct") {
          keyStatuses[char] = "present";
        } else if (st === "absent" && !keyStatuses[char]) {
          keyStatuses[char] = "absent";
        }
      }
      rowEl.appendChild(tile);
    }
    wordleBoardEl.appendChild(rowEl);
  }

  renderWordleKeyboard(keyStatuses);
}

function handleWordleKey(k) {
  if (wordleOver || wordleLocked || hubState.game !== "wordle") return;
  resetIdleWatchdog();

  if (k === "DEL" || k === "BACKSPACE") {
    if (wordleCol > 0) {
      wordleCol--;
      wordleGrid[wordleRow][wordleCol] = "";
      const tile = document.getElementById("wt-" + wordleRow + "-" + wordleCol);
      if (tile) {
        tile.textContent = "";
        tile.classList.remove("pop");
      }
      persistLiveState();
    }
    return;
  }

  if (k === "ENTER") {
    if (wordleCol === 5) {
      checkWordleRow();
    } else {
      if (statusPill) statusPill.textContent = "Not enough letters";
      const rowEl = document.getElementById("wr-" + wordleRow);
      if (rowEl) {
        rowEl.classList.remove("shake");
        void rowEl.offsetWidth;
        rowEl.classList.add("shake");
      }
      setTimeout(() => {
        if (statusPill && !wordleOver) statusPill.textContent = "Wordle (" + hubState.difficulty.toUpperCase() + ")";
      }, 1200);
    }
    return;
  }

  if (/^[A-Z]$/.test(k) && wordleCol < 5) {
    wordleGrid[wordleRow][wordleCol] = k;
    const tile = document.getElementById("wt-" + wordleRow + "-" + wordleCol);
    if (tile) {
      tile.textContent = k;
      tile.classList.remove("pop");
      void tile.offsetWidth;
      tile.classList.add("pop");
    }
    wordleCol++;
    persistLiveState();
  }
}

/* ---------- Sequential 3D Flip Animation on Wordle Submit ---------- */
function checkWordleRow() {
  if (wordleLocked) return;
  const guess = wordleGrid[wordleRow].join("");
  if (!VALID_DICTIONARY_WORDS.has(guess)) {
    if (statusPill) statusPill.textContent = "Not in word list!";
    const rowEl = document.getElementById("wr-" + wordleRow);
    if (rowEl) {
      rowEl.classList.remove("shake");
      void rowEl.offsetWidth;
      rowEl.classList.add("shake");
    }
    setTimeout(() => {
      if (statusPill && !wordleOver) statusPill.textContent = "Wordle (" + hubState.difficulty.toUpperCase() + ")";
    }, 1200);
    return;
  }

  const clueStatuses = evaluateWordleGuess(guess, wordleTarget);
  const isWin = (guess === wordleTarget);
  const currentRow = wordleRow;
  wordleLocked = true;

  // Trigger 3D flip animation sequentially with 250ms stagger
  clueStatuses.forEach((status, col) => {
    const tile = document.getElementById("wt-" + currentRow + "-" + col);
    if (!tile) return;
    setTimeout(() => {
      tile.classList.add("flip");
      // Reveal clue color halfway through the 3D flip (at 90deg)
      setTimeout(() => {
        tile.classList.add(status);
        updateVirtualKey(guess[col], status);
      }, 250);
    }, col * 250);
  });

  const totalFlipTime = 5 * 250 + 260;
  setTimeout(() => {
    wordleRow++;
    wordleCol = 0;
    wordleLocked = false;

    if (isWin) {
      wordleOver = true;
      scoreA++;
      streak++;
      persistScores();
      renderScores();
      showWinScreen("Word Solved!");
      persistLiveState();
      return;
    }

    if (wordleRow === 6) {
      wordleOver = true;
      scoreB++;
      streak = 0;
      persistScores();
      renderScores();
      showWinScreen("The Word was: " + wordleTarget);
      persistLiveState();
      return;
    }

    persistLiveState();
  }, totalFlipTime);
}

/* ==========================================================================
   POKER ENGINE: HEADS-UP TEXAS HOLD'EM (VS AI & LOCAL 2P)
   ========================================================================== */
const POKER_SUITS = ["s", "h", "d", "c"];
const POKER_RANKS = [
  { val: 2, str: "2" }, { val: 3, str: "3" }, { val: 4, str: "4" }, { val: 5, str: "5" },
  { val: 6, str: "6" }, { val: 7, str: "7" }, { val: 8, str: "8" }, { val: 9, str: "9" },
  { val: 10, str: "10" }, { val: 11, str: "J" }, { val: 12, str: "Q" }, { val: 13, str: "K" },
  { val: 14, str: "A" }
];

let pokerDeck = [];
let pokerPlayerCards = [];
let pokerAiCards = [];
let pokerCommunity = [];
let pokerPlayerChips = 1000;
let pokerAiChips = 1000;
let pokerPot = 0;
let pokerPlayerBet = 0;
let pokerAiBet = 0;
let pokerCurrentBet = 0;
let pokerStage = "preflop";
let pokerDealer = "player";
let pokerTurn = "player";
let pokerOver = false;

function buildFreshDeck() {
  const deck = [];
  let id = 0;
  for (const suit of POKER_SUITS) {
    for (const rank of POKER_RANKS) {
      deck.push({
        id: id++,
        suit,
        val: rank.val,
        rankStr: rank.str
      });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function renderPokerCard(card, faceUp = true, highlight = false) {
  if (!faceUp || !card) {
    return `<div class="poker-card back"></div>`;
  }
  const isRed = card.suit === "h" || card.suit === "d";
  const colorClass = isRed ? "red" : "black";
  const hlClass = highlight ? " highlight" : "";
  const suitSymbol = card.suit === "s" ? "♠" : card.suit === "h" ? "♥" : card.suit === "d" ? "♦" : "♣";
  const rankStr = card.rankStr;

  return `
    <div class="poker-card ${colorClass}${hlClass}" data-card-id="${card.id}">
      <div class="card-corner">
        <span class="card-corner-rank">${rankStr}</span>
        <span class="card-corner-suit">${suitSymbol}</span>
      </div>
      <div class="card-center">${suitSymbol}</div>
      <div class="card-corner card-bottom">
        <span class="card-corner-rank">${rankStr}</span>
        <span class="card-corner-suit">${suitSymbol}</span>
      </div>
    </div>
  `;
}

/* ---------- Exact 7-Card Hand Evaluator (Best 5 of 7) ---------- */
const RANK_NAMES = {
  14: "Ace", 13: "King", 12: "Queen", 11: "Jack", 10: "Ten",
  9: "Nine", 8: "Eight", 7: "Seven", 6: "Six", 5: "Five",
  4: "Four", 3: "Three", 2: "Two"
};
const RANK_PLURALS = {
  14: "Aces", 13: "Kings", 12: "Queens", 11: "Jacks", 10: "Tens",
  9: "Nines", 8: "Eights", 7: "Sevens", 6: "Sixes", 5: "Fives",
  4: "Fours", 3: "Threes", 2: "Twos"
};

function evaluate5CardHand(cards) {
  const sorted = [...cards].sort((a, b) => b.val - a.val);
  const vals = sorted.map(c => c.val);
  const isFlush = sorted.every(c => c.suit === sorted[0].suit);

  let isStraight = false;
  let straightHigh = 0;
  if (
    vals[0] - vals[1] === 1 &&
    vals[1] - vals[2] === 1 &&
    vals[2] - vals[3] === 1 &&
    vals[3] - vals[4] === 1
  ) {
    isStraight = true;
    straightHigh = vals[0];
  } else if (vals[0] === 14 && vals[1] === 5 && vals[2] === 4 && vals[3] === 3 && vals[4] === 2) {
    isStraight = true;
    straightHigh = 5;
  }

  const counts = {};
  vals.forEach(v => counts[v] = (counts[v] || 0) + 1);
  const groups = Object.keys(counts).map(v => ({ val: Number(v), count: counts[v] }));
  groups.sort((a, b) => b.count - a.count || b.val - a.val);

  if (isStraight && isFlush) {
    if (straightHigh === 14) return { rank: 9, score: 9000000000 + straightHigh, name: "Royal Flush", cards: sorted };
    return { rank: 8, score: 8000000000 + straightHigh, name: `Straight Flush (${RANK_NAMES[straightHigh]} High)`, cards: sorted };
  }
  if (groups[0].count === 4) {
    const quad = groups[0].val;
    const kicker = groups[1].val;
    return { rank: 7, score: 7000000000 + quad * 100 + kicker, name: `Four of a Kind (${RANK_PLURALS[quad]})`, cards: sorted };
  }
  if (groups[0].count === 3 && groups[1].count === 2) {
    const trips = groups[0].val;
    const pair = groups[1].val;
    return { rank: 6, score: 6000000000 + trips * 100 + pair, name: `Full House (${RANK_PLURALS[trips]} full of ${RANK_PLURALS[pair]})`, cards: sorted };
  }
  if (isFlush) {
    let tieScore = vals.reduce((acc, v, i) => acc + v * Math.pow(15, 4 - i), 0);
    return { rank: 5, score: 5000000000 + tieScore, name: `Flush (${RANK_NAMES[vals[0]]} High)`, cards: sorted };
  }
  if (isStraight) {
    return { rank: 4, score: 4000000000 + straightHigh, name: `Straight (${RANK_NAMES[straightHigh]} High)`, cards: sorted };
  }
  if (groups[0].count === 3) {
    const trips = groups[0].val;
    const kickers = [groups[1].val, groups[2].val];
    return { rank: 3, score: 3000000000 + trips * 1000 + kickers[0] * 15 + kickers[1], name: `Three of a Kind (${RANK_PLURALS[trips]})`, cards: sorted };
  }
  if (groups[0].count === 2 && groups[1].count === 2) {
    const highPair = Math.max(groups[0].val, groups[1].val);
    const lowPair = Math.min(groups[0].val, groups[1].val);
    const kicker = groups[2].val;
    return { rank: 2, score: 2000000000 + highPair * 1000 + lowPair * 50 + kicker, name: `Two Pair (${RANK_PLURALS[highPair]} and ${RANK_PLURALS[lowPair]})`, cards: sorted };
  }
  if (groups[0].count === 2) {
    const pair = groups[0].val;
    const kickers = [groups[1].val, groups[2].val, groups[3].val];
    let tieScore = kickers.reduce((acc, v, i) => acc + v * Math.pow(15, 2 - i), 0);
    return { rank: 1, score: 1000000000 + pair * 10000 + tieScore, name: `One Pair of ${RANK_PLURALS[pair]}`, cards: sorted };
  }
  let tieScore = vals.reduce((acc, v, i) => acc + v * Math.pow(15, 4 - i), 0);
  return { rank: 0, score: tieScore, name: `High Card (${RANK_NAMES[vals[0]]})`, cards: sorted };
}

function evaluate7Cards(availableCards) {
  if (availableCards.length < 5) {
    if (availableCards.length === 2) {
      if (availableCards[0].val === availableCards[1].val) {
        return { rank: 1, name: `Pocket Pair of ${RANK_PLURALS[availableCards[0].val]}`, score: 1000, cards: availableCards };
      }
      const high = Math.max(availableCards[0].val, availableCards[1].val);
      return { rank: 0, name: `High Card (${RANK_NAMES[high]})`, score: high, cards: availableCards };
    }
    return { rank: 0, name: "Evaluating...", score: 0, cards: [] };
  }

  let bestHand = null;
  function combine(start, chosen) {
    if (chosen.length === 5) {
      const evaluation = evaluate5CardHand(chosen);
      if (!bestHand || evaluation.score > bestHand.score) {
        bestHand = evaluation;
      }
      return;
    }
    for (let i = start; i < availableCards.length; i++) {
      combine(i + 1, [...chosen, availableCards[i]]);
    }
  }
  combine(0, []);
  return bestHand;
}

/* ---------- Poker Board & UI Rendering ---------- */
function renderPokerUI(winningCardIds = []) {
  if (!pokerGameEl) return;

  if (pokerAiCardsEl) {
    const showAiCards = (pokerStage === "showdown" || pokerStage === "ended");
    pokerAiCardsEl.innerHTML = pokerAiCards.map(c => {
      const isWinner = winningCardIds.includes(c.id);
      return renderPokerCard(c, showAiCards, isWinner);
    }).join("");
  }

  if (pokerCommunityCardsEl) {
    const slots = [];
    for (let i = 0; i < 5; i++) {
      const c = pokerCommunity[i];
      if (c) {
        const isWinner = winningCardIds.includes(c.id);
        slots.push(renderPokerCard(c, true, isWinner));
      } else {
        slots.push(`<div class="poker-card back" style="opacity:0.35;"></div>`);
      }
    }
    pokerCommunityCardsEl.innerHTML = slots.join("");
  }

  if (pokerPlayerCardsEl) {
    pokerPlayerCardsEl.innerHTML = pokerPlayerCards.map(c => {
      const isWinner = winningCardIds.includes(c.id);
      return renderPokerCard(c, true, isWinner);
    }).join("");
  }

  if (pokerPlayerChipsEl) pokerPlayerChipsEl.textContent = `$${pokerPlayerChips}`;
  if (pokerAiChipsEl) pokerAiChipsEl.textContent = `$${pokerAiChips}`;
  if (pokerPotAmountEl) pokerPotAmountEl.textContent = `$${pokerPot}`;

  if (pokerPlayerBetBubbleEl) {
    if (pokerPlayerBet > 0) {
      pokerPlayerBetBubbleEl.textContent = `Bet: $${pokerPlayerBet}`;
      pokerPlayerBetBubbleEl.classList.remove("hidden");
    } else {
      pokerPlayerBetBubbleEl.classList.add("hidden");
    }
  }
  if (pokerAiBetBubbleEl) {
    if (pokerAiBet > 0) {
      pokerAiBetBubbleEl.textContent = `Bet: $${pokerAiBet}`;
      pokerAiBetBubbleEl.classList.remove("hidden");
    } else {
      pokerAiBetBubbleEl.classList.add("hidden");
    }
  }

  if (pokerHandEvalEl) {
    const allHeroCards = [...pokerPlayerCards, ...pokerCommunity];
    const heroEval = evaluate7Cards(allHeroCards);
    pokerHandEvalEl.textContent = heroEval.name;
  }

  if (pokerCallBtn) {
    const toCall = pokerCurrentBet - pokerPlayerBet;
    pokerCallBtn.textContent = toCall > 0 ? `Call $${toCall}` : "Check";
  }

  if (pokerBetSliderEl && pokerSliderValEl) {
    const minRaise = Math.min(pokerPlayerChips, Math.max(20, (pokerCurrentBet - pokerPlayerBet) + 20));
    pokerBetSliderEl.min = String(minRaise);
    pokerBetSliderEl.max = String(pokerPlayerChips);
    if (Number(pokerBetSliderEl.value) < minRaise) pokerBetSliderEl.value = String(minRaise);
    pokerSliderValEl.textContent = `$${pokerBetSliderEl.value}`;
    if (pokerRaiseBtn) {
      const isBet = pokerCurrentBet === 0;
      pokerRaiseBtn.textContent = `${isBet ? "Bet" : "Raise"} $${pokerBetSliderEl.value}`;
    }
  }

  if (pokerAiNameEl) {
    if (hubState.theme === "naruto") pokerAiNameEl.textContent = "Shinobi Opponent";
    else if (hubState.theme === "got") pokerAiNameEl.textContent = "Iron Bank Rival";
    else if (hubState.theme === "itachi") pokerAiNameEl.textContent = "Tsukuyomi Shadow";
    else pokerAiNameEl.textContent = "AI Opponent";
  }
}

/* ---------- Poker Life Cycle & Betting ---------- */
function initPoker(resetBankroll = true) {
  resetIdleWatchdog();
  clearWinLine();
  stopTurnTimer();
  showTimerInactive();
  updateMoveCounter(false);

  boardWrap?.classList.remove("chess-mode", "wordle-mode", "imposter-mode");
  boardWrap?.classList.add("poker-mode");
  capturedLeft?.classList.add("hidden");
  capturedRight?.classList.add("hidden");
  tttBoardEl?.classList.add("hidden");
  chessBoardEl?.classList.add("hidden");
  wordleGameEl?.classList.add("hidden");
  imposterGameEl?.classList.add("hidden");
  pokerGameEl?.classList.remove("hidden");

  if (statusPill) statusPill.textContent = "Texas Hold'em Poker";

  if (resetBankroll) {
    pokerPlayerChips = 1000;
    pokerAiChips = 1000;
  }
  startNewPokerHand();
}

function startNewPokerHand() {
  if (pokerPlayerChips <= 0) {
    showWinScreen("Busted! AI Took All Chips.");
    pokerPlayerChips = 1000; pokerAiChips = 1000;
  } else if (pokerAiChips <= 0) {
    showWinScreen("Tournament Victory! You Broke The Bank!");
    pokerPlayerChips = 1000; pokerAiChips = 1000;
  }

  pokerDeck = buildFreshDeck();
  pokerPlayerCards = [pokerDeck.pop(), pokerDeck.pop()];
  pokerAiCards = [pokerDeck.pop(), pokerDeck.pop()];
  pokerCommunity = [];
  pokerPot = 0;
  pokerPlayerBet = 0;
  pokerAiBet = 0;
  pokerStage = "preflop";
  pokerOver = false;

  pokerDealer = pokerDealer === "player" ? "ai" : "player";

  const sb = 10, bb = 20;
  if (pokerDealer === "player") {
    pokerPlayerBet = Math.min(sb, pokerPlayerChips);
    pokerAiBet = Math.min(bb, pokerAiChips);
  } else {
    pokerAiBet = Math.min(sb, pokerAiChips);
    pokerPlayerBet = Math.min(bb, pokerPlayerChips);
  }
  pokerPlayerChips -= pokerPlayerBet;
  pokerAiChips -= pokerAiBet;
  pokerPot = pokerPlayerBet + pokerAiBet;
  pokerCurrentBet = bb;

  pokerTurn = pokerDealer === "player" ? "player" : "ai";

  pokerBetControlsEl?.classList.remove("hidden");
  pokerFoldBtn?.classList.remove("hidden");
  pokerCallBtn?.classList.remove("hidden");
  pokerRaiseBtn?.classList.remove("hidden");
  pokerNextHandBtn?.classList.add("hidden");

  if (pokerStatusBannerEl) {
    pokerStatusBannerEl.textContent = `Pre-Flop: Blinds Posted ($10 / $20). ${pokerTurn === "player" ? "Your turn." : "AI is thinking..."}`;
  }

  renderPokerUI();

  if (pokerTurn === "ai") {
    setTimeout(aiPokerTurn, 600);
  }
}

function advancePokerStage() {
  pokerPlayerBet = 0;
  pokerAiBet = 0;
  pokerCurrentBet = 0;

  if (pokerStage === "preflop") {
    pokerStage = "flop";
    pokerCommunity.push(pokerDeck.pop(), pokerDeck.pop(), pokerDeck.pop());
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = "Flop dealt! Place your bets.";
  } else if (pokerStage === "flop") {
    pokerStage = "turn";
    pokerCommunity.push(pokerDeck.pop());
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = "Turn dealt! Action continues.";
  } else if (pokerStage === "turn") {
    pokerStage = "river";
    pokerCommunity.push(pokerDeck.pop());
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = "River dealt! Final betting round.";
  } else if (pokerStage === "river") {
    pokerShowdown();
    return;
  }

  pokerTurn = "player";
  renderPokerUI();
}

function pokerShowdown() {
  pokerStage = "showdown";
  pokerOver = true;

  const playerEval = evaluate7Cards([...pokerPlayerCards, ...pokerCommunity]);
  const aiEval = evaluate7Cards([...pokerAiCards, ...pokerCommunity]);

  let winMsg = "";
  let winningCards = [];

  if (playerEval.score > aiEval.score) {
    pokerPlayerChips += pokerPot;
    scoreA++;
    updateStreak(true);
    winMsg = `You Win $${pokerPot}! (${playerEval.name} beats ${aiEval.name})`;
    winningCards = playerEval.cards.map(c => c.id);
    triggerConfetti();
  } else if (aiEval.score > playerEval.score) {
    pokerAiChips += pokerPot;
    scoreB++;
    updateStreak(false);
    winMsg = `AI Wins $${pokerPot}. (${aiEval.name} beats ${playerEval.name})`;
    winningCards = aiEval.cards.map(c => c.id);
  } else {
    const half = Math.floor(pokerPot / 2);
    pokerPlayerChips += half;
    pokerAiChips += half;
    winMsg = `Split Pot ($${half} each)! (${playerEval.name})`;
    winningCards = playerEval.cards.map(c => c.id);
  }

  persistScores();
  renderScores();

  if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = winMsg;
  pokerPot = 0;

  pokerBetControlsEl?.classList.add("hidden");
  pokerFoldBtn?.classList.add("hidden");
  pokerCallBtn?.classList.add("hidden");
  pokerRaiseBtn?.classList.add("hidden");
  pokerNextHandBtn?.classList.remove("hidden");

  renderPokerUI(winningCards);
}

function aiPokerTurn() {
  if (pokerOver || pokerTurn !== "ai") return;

  const toCall = pokerCurrentBet - pokerAiBet;
  const allAiCards = [...pokerAiCards, ...pokerCommunity];
  const evalHand = evaluate7Cards(allAiCards);
  const diff = hubState.difficulty || "medium";

  let action = "call";
  let raiseAmount = Math.min(pokerAiChips, Math.max(20, toCall + 20));

  if (diff === "easy") {
    if (toCall > 80 && evalHand.rank === 0) action = "fold";
    else if (evalHand.rank >= 2 && Math.random() < 0.3) action = "raise";
    else action = "call";
  } else if (diff === "medium") {
    if (toCall > 120 && evalHand.rank === 0) action = "fold";
    else if (evalHand.rank >= 2 && Math.random() < 0.6) action = "raise";
    else if (evalHand.rank >= 1 && toCall <= 60) action = "call";
    else action = toCall === 0 ? "call" : (Math.random() < 0.4 ? "call" : "fold");
  } else {
    if (evalHand.rank >= 3) {
      action = "raise";
      raiseAmount = Math.min(pokerAiChips, toCall + Math.max(40, Math.floor(pokerPot * 0.6)));
    } else if (evalHand.rank >= 1) {
      action = Math.random() < 0.4 ? "raise" : "call";
      raiseAmount = Math.min(pokerAiChips, toCall + 30);
    } else {
      if (toCall === 0 && Math.random() < 0.25) {
        action = "raise";
        raiseAmount = Math.min(pokerAiChips, 40);
      } else if (toCall <= 30) {
        action = "call";
      } else {
        action = "fold";
      }
    }
  }

  if (action === "fold") {
    pokerOver = true;
    pokerPlayerChips += pokerPot;
    scoreA++;
    updateStreak(true);
    persistScores();
    renderScores();
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `AI Folds. You win $${pokerPot}!`;
    pokerPot = 0;
    pokerBetControlsEl?.classList.add("hidden");
    pokerFoldBtn?.classList.add("hidden");
    pokerCallBtn?.classList.add("hidden");
    pokerRaiseBtn?.classList.add("hidden");
    pokerNextHandBtn?.classList.remove("hidden");
    renderPokerUI();
    return;
  }

  if (action === "raise" && pokerAiChips > toCall) {
    const added = Math.min(pokerAiChips, toCall + raiseAmount);
    pokerAiChips -= added;
    pokerAiBet += added;
    pokerPot += added;
    pokerCurrentBet = pokerAiBet;
    pokerTurn = "player";
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `AI Raised to $${pokerCurrentBet}. Your action!`;
    renderPokerUI();
    return;
  }

  const callAmt = Math.min(pokerAiChips, toCall);
  pokerAiChips -= callAmt;
  pokerAiBet += callAmt;
  pokerPot += callAmt;
  renderPokerUI();

  if (pokerPlayerBet === pokerAiBet) {
    setTimeout(advancePokerStage, 400);
  } else {
    pokerTurn = "player";
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `AI Calls. Your turn.`;
  }
}

pokerFoldBtn?.addEventListener("click", () => {
  if (pokerOver || pokerTurn !== "player") return;
  pokerOver = true;
  pokerAiChips += pokerPot;
  scoreB++;
  updateStreak(false);
  persistScores();
  renderScores();
  if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `You Folded. AI takes $${pokerPot}.`;
  pokerPot = 0;
  pokerBetControlsEl?.classList.add("hidden");
  pokerFoldBtn?.classList.add("hidden");
  pokerCallBtn?.classList.add("hidden");
  pokerRaiseBtn?.classList.add("hidden");
  pokerNextHandBtn?.classList.remove("hidden");
  renderPokerUI();
});

pokerCallBtn?.addEventListener("click", () => {
  if (pokerOver || pokerTurn !== "player") return;
  const toCall = pokerCurrentBet - pokerPlayerBet;
  const callAmt = Math.min(pokerPlayerChips, toCall);
  pokerPlayerChips -= callAmt;
  pokerPlayerBet += callAmt;
  pokerPot += callAmt;
  renderPokerUI();

  if (pokerPlayerBet === pokerAiBet && pokerCurrentBet > 0 && pokerStage !== "preflop") {
    advancePokerStage();
  } else {
    pokerTurn = "ai";
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = "AI is thinking...";
    setTimeout(aiPokerTurn, 600);
  }
});

pokerRaiseBtn?.addEventListener("click", () => {
  if (pokerOver || pokerTurn !== "player") return;
  const raiseVal = Number(pokerBetSliderEl?.value || 40);
  const toCall = pokerCurrentBet - pokerPlayerBet;
  const totalCommit = Math.min(pokerPlayerChips, toCall + raiseVal);
  if (totalCommit <= 0) return;

  pokerPlayerChips -= totalCommit;
  pokerPlayerBet += totalCommit;
  pokerPot += totalCommit;
  pokerCurrentBet = pokerPlayerBet;
  renderPokerUI();

  pokerTurn = "ai";
  if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `You Raised to $${pokerCurrentBet}. AI thinking...`;
  setTimeout(aiPokerTurn, 650);
});

pokerBetSliderEl?.addEventListener("input", () => {
  if (pokerSliderValEl) pokerSliderValEl.textContent = `$${pokerBetSliderEl.value}`;
  if (pokerRaiseBtn) {
    const isBet = pokerCurrentBet === 0;
    pokerRaiseBtn.textContent = `${isBet ? "Bet" : "Raise"} $${pokerBetSliderEl.value}`;
  }
});

pokerQuickMinBtn?.addEventListener("click", () => {
  if (pokerBetSliderEl) {
    pokerBetSliderEl.value = pokerBetSliderEl.min;
    pokerBetSliderEl.dispatchEvent(new Event("input"));
  }
});

pokerQuickHalfBtn?.addEventListener("click", () => {
  if (pokerBetSliderEl) {
    const half = Math.max(Number(pokerBetSliderEl.min), Math.floor(pokerPot / 2));
    pokerBetSliderEl.value = String(Math.min(pokerPlayerChips, half));
    pokerBetSliderEl.dispatchEvent(new Event("input"));
  }
});

pokerQuickPotBtn?.addEventListener("click", () => {
  if (pokerBetSliderEl) {
    const potBet = Math.max(Number(pokerBetSliderEl.min), pokerPot || 40);
    pokerBetSliderEl.value = String(Math.min(pokerPlayerChips, potBet));
    pokerBetSliderEl.dispatchEvent(new Event("input"));
  }
});

pokerQuickAllInBtn?.addEventListener("click", () => {
  if (pokerBetSliderEl) {
    pokerBetSliderEl.value = String(pokerPlayerChips);
    pokerBetSliderEl.dispatchEvent(new Event("input"));
  }
});

pokerNextHandBtn?.addEventListener("click", () => {
  startNewPokerHand();
});

/* ==========================================================================
   THE IMPOSTER ENGINE: SINGLE-DEVICE PASS & PLAY PARTY GAME
   ========================================================================== */
const IMPOSTER_PACKS = {
  locations: {
    name: "World Locations",
    words: [
      "Airport", "Bank Vault", "Casino", "Circus Tent", "Hospital ER",
      "Hotel Resort", "Library", "Movie Theater", "Pirate Ship", "Police Station",
      "Restaurant Kitchen", "Space Station", "Submarine", "Supermarket", "Theme Park", "Train Station"
    ]
  },
  naruto: {
    name: "Naruto Shinobi World",
    words: [
      "Hidden Leaf Village", "Valley of the End", "Akatsuki Hideout", "Chunin Exam Arena", "Mount Myoboku",
      "Ichiraku Ramen", "Forest of Death", "Hokage Rock", "Sound Village", "Sand Village",
      "Uchiha Compound", "Iron Country", "Five Kage Summit", "Turtle Island"
    ]
  },
  got: {
    name: "Westeros Realm",
    words: [
      "Winterfell", "King's Landing", "The Wall", "Dragonstone", "Braavos",
      "Sunspear", "Iron Islands", "The Eyrie", "Harrenhal", "Highgarden",
      "Citadel of Oldtown", "Casterly Rock", "Flea Bottom", "Tower of Joy"
    ]
  },
  objects: {
    name: "Everyday Objects",
    words: [
      "Smartphone", "Bicycle", "Umbrella", "Acoustic Guitar", "Wristwatch",
      "Sunglasses", "DSLR Camera", "Laptop", "Backpack", "Telescope",
      "Espresso Machine", "Diamond Ring", "Skateboard", "Compass", "Headphones", "Drone"
    ]
  }
};

const IMPOSTER_PROMPTS = [
  "Ask the player to your left: What would you wear in this place?",
  "Ask any player: How expensive is it to be here?",
  "Ask the player across: How many people are usually around?",
  "Ask any player: Is this place noisy or quiet?",
  "Ask the player to your right: Have you ever been here in real life?",
  "Ask any player: What is the most dangerous thing about this item/place?",
  "Ask any player: What color best represents this word?"
];

let imposterPlayerCount = 3;
let imposterCategory = "locations";
let imposterCurrentPlayer = 0;
let imposterIndex = 0;
let imposterSecretWord = "";
let imposterTimerInterval = null;
let imposterTimeLeft = 180;

function initImposter() {
  resetIdleWatchdog();
  clearWinLine();
  stopTurnTimer();
  showTimerInactive();
  updateMoveCounter(false);

  boardWrap?.classList.remove("chess-mode", "wordle-mode", "poker-mode");
  boardWrap?.classList.add("imposter-mode");
  capturedLeft?.classList.add("hidden");
  capturedRight?.classList.add("hidden");
  tttBoardEl?.classList.add("hidden");
  chessBoardEl?.classList.add("hidden");
  wordleGameEl?.classList.add("hidden");
  pokerGameEl?.classList.add("hidden");
  imposterGameEl?.classList.remove("hidden");

  if (statusPill) statusPill.textContent = "The Imposter (Social Deduction)";

  showImposterScreen("setup");
}

function showImposterScreen(screenName) {
  imposterSetupScreenEl?.classList.add("hidden");
  imposterRevealScreenEl?.classList.add("hidden");
  imposterDiscussScreenEl?.classList.add("hidden");
  imposterVoteScreenEl?.classList.add("hidden");
  imposterGuessScreenEl?.classList.add("hidden");

  if (screenName === "setup") imposterSetupScreenEl?.classList.remove("hidden");
  if (screenName === "reveal") imposterRevealScreenEl?.classList.remove("hidden");
  if (screenName === "discuss") imposterDiscussScreenEl?.classList.remove("hidden");
  if (screenName === "vote") imposterVoteScreenEl?.classList.remove("hidden");
  if (screenName === "guess") imposterGuessScreenEl?.classList.remove("hidden");
}

imposterCountPillsEl?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-count]");
  if (!btn) return;
  imposterCountPillsEl.querySelectorAll(".seg-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  imposterPlayerCount = Number(btn.dataset.count);
});

imposterCategoryPillsEl?.addEventListener("click", (e) => {
  const card = e.target.closest(".imposter-cat-card");
  if (!card) return;
  imposterCategoryPillsEl.querySelectorAll(".imposter-cat-card").forEach(c => c.classList.remove("active"));
  card.classList.add("active");
  imposterCategory = card.dataset.cat;
});

imposterStartBtn?.addEventListener("click", () => {
  const pack = IMPOSTER_PACKS[imposterCategory] || IMPOSTER_PACKS.locations;
  imposterSecretWord = pack.words[Math.floor(Math.random() * pack.words.length)];
  imposterIndex = Math.floor(Math.random() * imposterPlayerCount);
  imposterCurrentPlayer = 0;

  showImposterRevealPlayer(0);
});

function showImposterRevealPlayer(playerIdx) {
  imposterCurrentPlayer = playerIdx;
  showImposterScreen("reveal");

  if (imposterPassHeaderEl) {
    imposterPassHeaderEl.textContent = `Pass Device to Player ${playerIdx + 1}`;
  }

  imposterCurtainHiddenEl?.classList.remove("hidden");
  imposterCurtainRevealedEl?.classList.add("hidden");
  imposterNextPlayerBtn?.classList.add("hidden");

  const isImposter = (playerIdx === imposterIndex);
  if (imposterRoleBadgeEl) {
    imposterRoleBadgeEl.textContent = isImposter ? "🚨 Imposter" : "Innocent";
    imposterRoleBadgeEl.className = `role-badge ${isImposter ? "imposter" : ""}`;
  }
  if (imposterWordDisplayEl) {
    imposterWordDisplayEl.textContent = isImposter ? "YOU ARE THE IMPOSTER" : imposterSecretWord;
  }
  if (imposterHintDisplayEl) {
    const pack = IMPOSTER_PACKS[imposterCategory];
    imposterHintDisplayEl.textContent = isImposter ? `Blend in! Category is ${pack.name}` : `Category: ${pack.name}`;
  }
}

function onCurtainHoldStart() {
  imposterCurtainHiddenEl?.classList.add("hidden");
  imposterCurtainRevealedEl?.classList.remove("hidden");
}
function onCurtainHoldEnd() {
  imposterCurtainHiddenEl?.classList.remove("hidden");
  imposterCurtainRevealedEl?.classList.add("hidden");
  imposterNextPlayerBtn?.classList.remove("hidden");
}

imposterCurtainCardEl?.addEventListener("mousedown", onCurtainHoldStart);
imposterCurtainCardEl?.addEventListener("mouseup", onCurtainHoldEnd);
imposterCurtainCardEl?.addEventListener("mouseleave", onCurtainHoldEnd);
imposterCurtainCardEl?.addEventListener("touchstart", (e) => { e.preventDefault(); onCurtainHoldStart(); });
imposterCurtainCardEl?.addEventListener("touchend", onCurtainHoldEnd);

imposterNextPlayerBtn?.addEventListener("click", () => {
  if (imposterCurrentPlayer + 1 < imposterPlayerCount) {
    showImposterRevealPlayer(imposterCurrentPlayer + 1);
  } else {
    startImposterDiscussion();
  }
});

function startImposterDiscussion() {
  showImposterScreen("discuss");
  imposterTimeLeft = 180;

  if (imposterDiscussRosterEl) {
    imposterDiscussRosterEl.innerHTML = Array.from({ length: imposterPlayerCount }, (_, i) => `
      <div class="imposter-player-pill">Player ${i + 1}</div>
    `).join("");
  }

  if (imposterPromptTextEl) {
    imposterPromptTextEl.textContent = IMPOSTER_PROMPTS[Math.floor(Math.random() * IMPOSTER_PROMPTS.length)];
  }

  if (imposterTimerInterval) clearInterval(imposterTimerInterval);
  imposterTimerInterval = setInterval(() => {
    imposterTimeLeft--;
    const mins = Math.floor(imposterTimeLeft / 60);
    const secs = imposterTimeLeft % 60;
    if (imposterDiscussTimerEl) imposterDiscussTimerEl.textContent = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

    if (imposterTimeLeft % 30 === 0 && imposterPromptTextEl) {
      imposterPromptTextEl.textContent = IMPOSTER_PROMPTS[Math.floor(Math.random() * IMPOSTER_PROMPTS.length)];
    }

    if (imposterTimeLeft <= 0) {
      clearInterval(imposterTimerInterval);
      startImposterVoting();
    }
  }, 1000);
}

imposterAccuseBtn?.addEventListener("click", () => {
  if (imposterTimerInterval) clearInterval(imposterTimerInterval);
  startImposterVoting();
});

function startImposterVoting() {
  showImposterScreen("vote");

  if (imposterVoteGridEl) {
    imposterVoteGridEl.innerHTML = Array.from({ length: imposterPlayerCount }, (_, i) => `
      <button class="imposter-vote-btn" data-player="${i}" type="button">
        Accuse Player ${i + 1}
      </button>
    `).join("");
  }
}

imposterVoteGridEl?.addEventListener("click", (e) => {
  const btn = e.target.closest(".imposter-vote-btn");
  if (!btn) return;
  const accusedIdx = Number(btn.dataset.player);

  if (accusedIdx === imposterIndex) {
    startImposterGuess();
  } else {
    showWinScreen(`Imposter Escapes! Player ${imposterIndex + 1} was the Imposter. (Word: ${imposterSecretWord})`);
    scoreB++;
    persistScores();
    renderScores();
    showImposterScreen("setup");
  }
});

function startImposterGuess() {
  showImposterScreen("guess");
  const pack = IMPOSTER_PACKS[imposterCategory] || IMPOSTER_PACKS.locations;
  const pool = [...pack.words].filter(w => w !== imposterSecretWord);
  pool.sort(() => Math.random() - 0.5);
  const candidates = [imposterSecretWord, ...pool.slice(0, 7)];
  candidates.sort(() => Math.random() - 0.5);

  if (imposterGuessGridEl) {
    imposterGuessGridEl.innerHTML = candidates.map(word => `
      <button class="imposter-guess-btn" data-word="${word}" type="button">
        ${word}
      </button>
    `).join("");
  }
}

imposterGuessGridEl?.addEventListener("click", (e) => {
  const btn = e.target.closest(".imposter-guess-btn");
  if (!btn) return;
  const guessedWord = btn.dataset.word;

  if (guessedWord === imposterSecretWord) {
    showWinScreen(`Imposter Guessed Correctly! (${imposterSecretWord}) Imposter Steals The Win!`);
    scoreB++;
  } else {
    showWinScreen(`Innocents Prevail! The Imposter Guessed Wrong. (Word: ${imposterSecretWord})`);
    scoreA++;
  }
  persistScores();
  renderScores();
  showImposterScreen("setup");
});

/* ---------- Live Game Persistence ---------- */
function persistLiveState() {
  const payload = {
    hubState: { ...hubState },
    mode: modeFromHub(),
    scores: { scoreA, scoreB, scoreD, streak },
    moveCount,
    ttt: {
      board: tttBoard, size: tttSize, winLen: tttWinLen, turn: tttTurn, over: tttOver, winning: tttWinningCells
    },
    chess: {
      board: chessBoard, turn: chessTurn, selected: chessSelected, over: chessOver,
      whiteCaptured, blackCaptured
    },
    wordle: {
      target: wordleTarget, row: wordleRow, col: wordleCol, grid: wordleGrid, over: wordleOver
    }
  };
  localStorage.setItem(LIVE_STATE_KEY, JSON.stringify(payload));
}

function restoreLiveStateIfAny() {
  const raw = localStorage.getItem(LIVE_STATE_KEY);
  if (!raw) return false;
  try {
    const s = JSON.parse(raw);
    if (!s || !s.mode) return false;

    if (s.hubState) Object.assign(hubState, s.hubState);
    modeSelect.value = s.mode;

    if (s.scores) {
      scoreA = s.scores.scoreA || 0;
      scoreB = s.scores.scoreB || 0;
      scoreD = s.scores.scoreD || 0;
      streak = s.scores.streak || 0;
      renderScores();
    }
    if (typeof s.moveCount === "number") {
      moveCount = s.moveCount;
    }

    if (s.mode === "wordle" && s.wordle) {
      wordleTarget = s.wordle.target || getWordleTargetByDifficulty();
      wordleRow = s.wordle.row || 0;
      wordleCol = s.wordle.col || 0;
      wordleGrid = s.wordle.grid || Array.from({ length: 6 }, () => Array(5).fill(""));
      wordleOver = !!s.wordle.over;
      wordleLocked = false;
      updateMoveCounter(false);
      renderWordle();
      if (statusPill) statusPill.textContent = `Wordle (${hubState.difficulty.toUpperCase()})`;
      return true;
    }

    if (s.mode.startsWith("ttt") && s.ttt) {
      tttBoard = Array.isArray(s.ttt.board) ? s.ttt.board : [];
      tttSize = s.ttt.size || (s.mode.startsWith("ttt5") ? 5 : 3);
      tttWinLen = s.ttt.winLen || (tttSize === 3 ? 3 : 4);
      tttTurn = s.ttt.turn || "X";
      tttOver = !!s.ttt.over;
      tttWinningCells = Array.isArray(s.ttt.winning) ? s.ttt.winning : [];
      updateMoveCounter(true);
      renderTTT();
      return true;
    }

    if (s.mode.startsWith("chess") && s.chess) {
      chessBoard = Array.isArray(s.chess.board) ? s.chess.board : [];
      chessTurn = s.chess.turn || "w";
      chessSelected = s.chess.selected || null;
      chessOver = !!s.chess.over;
      whiteCaptured = Array.isArray(s.chess.whiteCaptured) ? s.chess.whiteCaptured : [];
      blackCaptured = Array.isArray(s.chess.blackCaptured) ? s.chess.blackCaptured : [];

      const looksValid = chessBoard.length === 8 && Array.isArray(chessBoard[0]) && chessBoard[0].length === 8;
      if (!looksValid) return false;

      updateMoveCounter(true);
      renderCaptured();
      renderChess();
      return true;
    }

    if (s.mode && s.mode.startsWith("poker")) {
      initPoker(false);
      return true;
    }

    if (s.mode === "imposter") {
      initImposter();
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/* ---------- Global Keyboard Event Guard ---------- */
window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  const k = e.key.toUpperCase();

  // Keyboard Event Guard for Wordle Mode
  if (hubState.game === "wordle") {
    // Isolated keypresses: Enter, Backspace, or Letters
    if (k === "ENTER" || k === "BACKSPACE" || /^[A-Z]$/.test(k)) {
      e.preventDefault();
      handleWordleKey(k);
      return;
    }
    // Number row switches games
    if (k === "1") { hubState.game = "ttt3"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    if (k === "2") { hubState.game = "ttt5"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    if (k === "3") { hubState.game = "chess"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    if (k === "5") { hubState.game = "poker"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    if (k === "6") { hubState.game = "imposter"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    return;
  }

  // Global shortcuts for TTT, Chess, Wordle, Poker, Imposter
  if (k === "1") { hubState.game = "ttt3"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
  if (k === "2") { hubState.game = "ttt5"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
  if (k === "3") { hubState.game = "chess"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
  if (k === "4") { hubState.game = "wordle"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
  if (k === "5") { hubState.game = "poker"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
  if (k === "6") { hubState.game = "imposter"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }

  if (k === "R") { newGameBtn?.click(); return; }
  if (k === "Z") { undoBtn?.click(); return; }
});

/* ---------- Timer Expiration ---------- */
function onTimerExpired() {
  const mode = modeSelect.value;
  if (mode.startsWith("ttt")) {
    const e = getEmptyCells(tttBoard);
    if (!e.length || tttOver) return;
    onTTTClick(e[Math.floor(Math.random() * e.length)]);
    return;
  }
  if (mode.startsWith("chess") && !chessOver) {
    const moves = allMovesForColor(chessBoard, chessTurn);
    if (!moves.length) return;
    moveChess(chessBoard, moves[Math.floor(Math.random() * moves.length)], true);
    moveCount++;
    updateMoveCounter(true);
    chessTurn = chessTurn === "w" ? "b" : "w";
    renderChess();
    startTurnTimer();
    persistLiveState();
  }
}

/* ---------- Action Controls ---------- */
newGameBtn?.addEventListener("click", () => {
  resetIdleWatchdog();
  initBoard(true);
});

resetScoreBtn?.addEventListener("click", () => {
  resetIdleWatchdog();
  scoreA = 0; scoreB = 0; scoreD = 0; streak = 0;
  persistScores();
  renderScores();
  persistLiveState();
});

undoBtn?.addEventListener("click", () => {
  resetIdleWatchdog();
  if (hubState.game === "wordle") {
    handleWordleKey("DEL");
    return;
  }
  if (hubState.game === "poker" || hubState.game === "imposter") {
    return;
  }
  const mode = modeSelect.value;
  if (mode.startsWith("ttt")) {
    const s = tttSnapshots.pop();
    if (!s) return;
    tttBoard = [...s.board]; tttTurn = s.turn; tttOver = s.over; tttWinningCells = [...s.win];
    scoreA = s.scoreA; scoreB = s.scoreB; scoreD = s.scoreD; streak = s.streak;
    moveCount = s.moveCount || Math.max(0, moveCount - 1);
    hideWinScreen();
    renderScores();
    updateMoveCounter(true);
    renderTTT();
    startTurnTimer();
    persistLiveState();
    return;
  }
  const s = chessSnapshots.pop();
  if (!s) return;
  chessBoard = cloneBoard(s.board); chessTurn = s.turn; chessSelected = s.selected; chessOver = s.over;
  whiteCaptured = [...s.whiteCaptured]; blackCaptured = [...s.blackCaptured];
  scoreA = s.scoreA; scoreB = s.scoreB; scoreD = s.scoreD; streak = s.streak;
  moveCount = s.moveCount || Math.max(0, moveCount - 1);
  hideWinScreen();
  renderCaptured();
  renderScores();
  updateMoveCounter(true);
  renderChess();
  startTurnTimer();
  persistLiveState();
});

/* ---------- HUD Bar Events ---------- */
gameTypePills?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-game]");
  if (!btn) return;
  hubState.game = btn.dataset.game;
  modeSelect.value = modeFromHub();
  syncHud();
  persistHub();
  initBoard(true);
});

opponentPills?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-opponent]");
  if (!btn) return;
  hubState.opponent = btn.dataset.opponent;
  modeSelect.value = modeFromHub();
  syncHud();
  persistHub();
  initBoard(true);
});

difficultyPills?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-difficulty]");
  if (!btn) return;
  hubState.difficulty = btn.dataset.difficulty;
  if (difficultySelect) difficultySelect.value = hubState.difficulty;
  syncHud();
  persistHub();
  loadScores();
  if (hubState.game === "wordle") initWordle();
  persistLiveState();
});

timerPills?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-timer]");
  if (!btn) return;
  hubState.timer = btn.dataset.timer;
  syncHud();
  persistHub();
  startTurnTimer();
  persistLiveState();
});

/* ---------- Board Init ---------- */
function initBoard(forceFresh = false) {
  hideWinScreen();
  stopTurnTimer();
  clearWinLine();
  resetIdleWatchdog();

  if (!forceFresh) {
    const restored = restoreLiveStateIfAny();
    if (restored) {
      syncHud();
      if (hubState.game === "wordle") {
        tttBoardEl?.classList.add("hidden");
        chessBoardEl?.classList.add("hidden");
        wordleGameEl?.classList.remove("hidden");
      }
      startTurnTimer();
      persistHub();
      return;
    }
  }

  if (modeSelect) modeSelect.value = modeFromHub();
  if (hubState.game === "wordle") initWordle();
  else if (hubState.game === "poker") initPoker();
  else if (hubState.game === "imposter") initImposter();
  else if (hubState.game === "ttt3") initTTT(3);
  else if (hubState.game === "ttt5") initTTT(5);
  else initChess();

  startTurnTimer();
  persistHub();
  persistLiveState();
}

/* ---------- App Boot ---------- */
function boot() {
  loadHub();
  updateMiniWindowUI();

  if (!hubState.timer) hubState.timer = "off";

  if (modeSelect) modeSelect.value = modeFromHub();
  if (difficultySelect) difficultySelect.value = hubState.difficulty;
  if (themeSelect) themeSelect.value = hubState.theme;

  syncHud();
  setTheme(hubState.theme);
  loadScores();

  if (hubState.timer === "off") showTimerInactive();

  initBoard(false); // try restore live state first
  startIdleWatchdog();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}