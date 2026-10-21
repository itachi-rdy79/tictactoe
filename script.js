var ludoActiveTimers = [];
var ludoRollInterval = null;
var snakeState = {
  gridSize: 20,
  tileSize: 40, // 20 * 40 = 800
  snake: [],
  dir: { x: 1, y: 0 },
  nextDir: { x: 1, y: 0 },
  dirQueue: [],
  food: null,
  obstacles: [],
  score: 0,
  highScore: 0,
  startHighScore: 0,
  mode: "classic",
  speed: "normal",
  skin: "emerald",
  timeLeft: 60,
  applesEaten: 0,
  goldenEaten: 0,
  diamondsEaten: 0,
  gameInterval: null,
  timerInterval: null,
  animFrameId: null,
  isRunning: false,
  isPaused: false,
  isGameOver: false,
  sound: true,
  particles: []
};
const modeSelect = document.getElementById("modeSelect");
const difficultySelect = document.getElementById("difficultySelect");
const themeSelect = document.getElementById("themeSelect");

const gameTypePills = document.getElementById("gameTypePills");
const tttModeGroup = document.getElementById("tttModeGroup");
const tttModePills = document.getElementById("tttModePills");
const opponentPills = document.getElementById("opponentPills");
const difficultyPills = document.getElementById("difficultyPills");
const difficultyGroup = document.getElementById("difficultyGroup");
const timerPills = document.getElementById("timerPills");
const opponentGroup = document.getElementById("opponentGroup");

const newGameBtn = document.getElementById("newGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const undoBtn = document.getElementById("undoBtn");
const chessHintsBtn = document.getElementById("chessHintsBtn");

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

// Sequence DOM
const sequenceGameEl = document.getElementById("sequenceGame");
const seqP1ScorePill = document.getElementById("seqP1ScorePill");
const seqP2ScorePill = document.getElementById("seqP2ScorePill");
const seqP1Label = document.getElementById("seqP1Label");
const seqP2Label = document.getElementById("seqP2Label");
const seqP1SeqEl = document.getElementById("seqP1Sequences");
const seqP2SeqEl = document.getElementById("seqP2Sequences");
const seqDeckPill = document.getElementById("seqDeckPill");
const seqDeckCount = document.getElementById("seqDeckCount");
const seqLastDiscard = document.getElementById("seqLastDiscard");
const seqPromptBanner = document.getElementById("seqPromptBanner");
const sequenceBoardEl = document.getElementById("sequenceBoard");
const seqPrivacyModeBtn = document.getElementById("seqPrivacyModeBtn");
const seqPrivacyModeText = document.getElementById("seqPrivacyModeText");

// Left Shelf (Player 1)
const seqP1HandShelf = document.getElementById("seqP1HandShelf");
const seqP1ShelfTitle = document.getElementById("seqP1ShelfTitle");
const seqP1ShelfTip = document.getElementById("seqP1ShelfTip");
const seqP1PrivacyBtn = document.getElementById("seqP1PrivacyBtn");
const seqP1Curtain = document.getElementById("seqP1Curtain");
const seqP1RevealBtn = document.getElementById("seqP1RevealBtn");
const seqP1HandCardsEl = document.getElementById("seqP1HandCards");

// Right Shelf (Player 2 / AI)
const seqP2HandShelf = document.getElementById("seqP2HandShelf");
const seqP2ShelfTitle = document.getElementById("seqP2ShelfTitle");
const seqP2ShelfTip = document.getElementById("seqP2ShelfTip");
const seqP2PrivacyBtn = document.getElementById("seqP2PrivacyBtn");
const seqP2Curtain = document.getElementById("seqP2Curtain");
const seqP2RevealBtn = document.getElementById("seqP2RevealBtn");
const seqP2HandCardsEl = document.getElementById("seqP2HandCards");

// Sequence Draw Actions DOM (Pick a Card / Skip)
const seqP1DrawActions = document.getElementById("seqP1DrawActions");
const seqP1PickCardBtn = document.getElementById("seqP1PickCardBtn");
const seqP1SkipDrawBtn = document.getElementById("seqP1SkipDrawBtn");

const seqP2DrawActions = document.getElementById("seqP2DrawActions");
const seqP2PickCardBtn = document.getElementById("seqP2PickCardBtn");
const seqP2SkipDrawBtn = document.getElementById("seqP2SkipDrawBtn");

// Legacy aliases for backward compatibility
const sequenceHandShelf = seqP1HandShelf;
const seqShelfTitle = seqP1ShelfTitle;
const seqShelfTip = seqP1ShelfTip;
const sequenceHandCardsEl = seqP1HandCardsEl;

// Pattu DOM (Tollywood Movie Guesser - Exact Original UI)
const pattuGameEl = document.getElementById("pattuGame");
const pattuStatsBtn = document.getElementById("pattuStatsBtn");
const pattuTimeTravelBtn = document.getElementById("pattuTimeTravelBtn");
const pattuHelpBtn = document.getElementById("pattuHelpBtn");
const pattuImgEl = document.getElementById("pattuImg");
const pattuFallbackCardEl = document.getElementById("pattuFallbackCard");
const pattuFallbackTagEl = document.getElementById("pattuFallbackTag");
const pattuFallbackClueEl = document.getElementById("pattuFallbackClue");
const pattuFallbackSubEl = document.getElementById("pattuFallbackSub");
const pattuFramePillsEl = document.getElementById("pattuFramePills");
const pattuSkipBtn = document.getElementById("pattuSkipBtn");
const pattuSearchWrap = document.getElementById("pattuSearchWrap");
const pattuInputEl = document.getElementById("pattuInput");
const pattuClearBtn = document.getElementById("pattuClearBtn");
const pattuDropdownEl = document.getElementById("pattuDropdown");
const pattuSubmitBtn = document.getElementById("pattuSubmitBtn");
const pattuRemainingTextEl = document.getElementById("pattuRemainingText");
const pattuRemainingCountEl = document.getElementById("pattuRemainingCount");
const pattuHistoryEl = document.getElementById("pattuHistory");
const pattuResultBannerEl = document.getElementById("pattuResultBanner");
const pattuResultTitleEl = document.getElementById("pattuResultTitle");
const pattuResultMovieEl = document.getElementById("pattuResultMovie");
const pattuResultSubEl = document.getElementById("pattuResultSub");
const pattuShareBtn = document.getElementById("pattuShareBtn");
const pattuNextBtn = document.getElementById("pattuNextBtn");

// Pattu Modals
const pattuInstructionsModal = document.getElementById("pattuInstructionsModal");
const closePattuHelpBtn = document.getElementById("closePattuHelpBtn");
const pattuTimeTravelModal = document.getElementById("pattuTimeTravelModal");
const pattuDateInput = document.getElementById("pattuDateInput");
const pattuTtCurrentDayText = document.getElementById("pattuTtCurrentDayText");
const pattuTtTargetDay = document.getElementById("pattuTtTargetDay");
const pattuTtFormattedDate = document.getElementById("pattuTtFormattedDate");
const pattuToggleDayNumBtn = document.getElementById("pattuToggleDayNumBtn");
const pattuTtManualWrap = document.getElementById("pattuTtManualWrap");
const pattuDayInput = document.getElementById("pattuDayInput");
const pattuMaxDayText = document.getElementById("pattuMaxDayText");
const submitPattuTimeTravelBtn = document.getElementById("submitPattuTimeTravelBtn");
const closePattuTimeTravelBtn = document.getElementById("closePattuTimeTravelBtn");
const pattuStatsCustomModal = document.getElementById("pattuStatsCustomModal");
const pattuStatPlayedEl = document.getElementById("pattuStatPlayed");
const pattuStatWinPctEl = document.getElementById("pattuStatWinPct");
const pattuStatStreakEl = document.getElementById("pattuStatStreak");
const pattuStatMaxStreakEl = document.getElementById("pattuStatMaxStreak");
const pattuDistChartEl = document.getElementById("pattuDistChart");
const closePattuStatsModalBtn = document.getElementById("closePattuStatsModalBtn");

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
const winIcon = document.getElementById("winIcon");
const winSubtitle = document.getElementById("winSubtitle");
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

/* ---------- Wide Range of W3Schools Hex Color Palettes (Light & Dark Theme) ---------- */
const DYNAMIC_PALETTES = [
  {
    id: "crimson",
    name: "Crimson (#DC143C)",
    brand: "#DC143C",
    flame: "#B22222",
    glow: "rgba(220, 20, 60, 0.5)",
    darkBg: "radial-gradient(circle at 18% 22%, rgba(220, 20, 60, 0.45) 0%, transparent 45%), radial-gradient(circle at 82% 78%, rgba(178, 34, 34, 0.4) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.18) 0%, transparent 60%), #140205",
    lightBg: "radial-gradient(circle at 18% 22%, #fecdd3 0%, transparent 50%), radial-gradient(circle at 82% 78%, #ffe4e6 0%, transparent 50%), #fff1f2"
  },
  {
    id: "coral",
    name: "Coral (#FF7F50)",
    brand: "#FF7F50",
    flame: "#FF4500",
    glow: "rgba(255, 127, 80, 0.5)",
    darkBg: "radial-gradient(circle at 20% 25%, rgba(255, 127, 80, 0.45) 0%, transparent 45%), radial-gradient(circle at 80% 75%, rgba(255, 69, 0, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(255, 99, 71, 0.2) 0%, transparent 60%), #140702",
    lightBg: "radial-gradient(circle at 20% 25%, #fed7aa 0%, transparent 50%), radial-gradient(circle at 80% 75%, #ffedd5 0%, transparent 50%), #fff7ed"
  },
  {
    id: "darkorange",
    name: "Dark Orange (#FF8C00)",
    brand: "#FF8C00",
    flame: "#EA580C",
    glow: "rgba(255, 140, 0, 0.5)",
    darkBg: "radial-gradient(circle at 18% 26%, rgba(255, 140, 0, 0.45) 0%, transparent 45%), radial-gradient(circle at 82% 74%, rgba(234, 88, 12, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.22) 0%, transparent 60%), #140801",
    lightBg: "radial-gradient(circle at 18% 26%, #fed7aa 0%, transparent 50%), radial-gradient(circle at 82% 74%, #ffedd5 0%, transparent 50%), #fff7ed"
  },
  {
    id: "gold",
    name: "Gold (#FFD700)",
    brand: "#FFD700",
    flame: "#DAA520",
    glow: "rgba(255, 215, 0, 0.5)",
    darkBg: "radial-gradient(circle at 22% 20%, rgba(255, 215, 0, 0.42) 0%, transparent 45%), radial-gradient(circle at 78% 80%, rgba(218, 165, 32, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.22) 0%, transparent 60%), #140f02",
    lightBg: "radial-gradient(circle at 22% 20%, #fef08a 0%, transparent 50%), radial-gradient(circle at 78% 80%, #fde68a 0%, transparent 50%), #fefce8"
  },
  {
    id: "yellow",
    name: "Yellow (#FFFF00)",
    brand: "#FACC15",
    flame: "#EAB308",
    glow: "rgba(250, 204, 21, 0.5)",
    darkBg: "radial-gradient(circle at 20% 22%, rgba(250, 204, 21, 0.42) 0%, transparent 45%), radial-gradient(circle at 80% 78%, rgba(234, 179, 8, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(253, 224, 71, 0.2) 0%, transparent 60%), #141102",
    lightBg: "radial-gradient(circle at 20% 22%, #fef08a 0%, transparent 50%), radial-gradient(circle at 80% 78%, #fef9c3 0%, transparent 50%), #fefce8"
  },
  {
    id: "chartreuse",
    name: "Chartreuse (#7FFF00)",
    brand: "#84CC16",
    flame: "#65A30D",
    glow: "rgba(132, 204, 22, 0.5)",
    darkBg: "radial-gradient(circle at 20% 20%, rgba(132, 204, 22, 0.42) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(101, 163, 13, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(163, 230, 53, 0.2) 0%, transparent 60%), #0c1402",
    lightBg: "radial-gradient(circle at 20% 20%, #d9f99d 0%, transparent 50%), radial-gradient(circle at 80% 80%, #ecfccb 0%, transparent 50%), #f7fee7"
  },
  {
    id: "lime",
    name: "Lime Green (#32CD32)",
    brand: "#32CD32",
    flame: "#22C55E",
    glow: "rgba(50, 205, 50, 0.5)",
    darkBg: "radial-gradient(circle at 20% 20%, rgba(50, 205, 50, 0.42) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.2) 0%, transparent 60%), #021406",
    lightBg: "radial-gradient(circle at 20% 20%, #bbf7d0 0%, transparent 50%), radial-gradient(circle at 80% 80%, #dcfce7 0%, transparent 50%), #f0fdf4"
  },
  {
    id: "emerald",
    name: "Forest Emerald (#228B22)",
    brand: "#10B981",
    flame: "#059669",
    glow: "rgba(16, 185, 129, 0.5)",
    darkBg: "radial-gradient(circle at 20% 24%, rgba(5, 150, 105, 0.45) 0%, transparent 45%), radial-gradient(circle at 80% 76%, rgba(34, 139, 34, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(46, 139, 87, 0.22) 0%, transparent 60%), #02120b",
    lightBg: "radial-gradient(circle at 20% 24%, #a7f3d0 0%, transparent 50%), radial-gradient(circle at 80% 76%, #6ee7b7 0%, transparent 50%), #ecfdf5"
  },
  {
    id: "springgreen",
    name: "Spring Green (#00FF7F)",
    brand: "#00FF7F",
    flame: "#00FA9A",
    glow: "rgba(0, 255, 127, 0.5)",
    darkBg: "radial-gradient(circle at 22% 22%, rgba(0, 255, 127, 0.4) 0%, transparent 45%), radial-gradient(circle at 78% 78%, rgba(0, 250, 154, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(52, 211, 153, 0.2) 0%, transparent 60%), #02140e",
    lightBg: "radial-gradient(circle at 22% 22%, #a7f3d0 0%, transparent 50%), radial-gradient(circle at 78% 78%, #bbf7d0 0%, transparent 50%), #ecfdf5"
  },
  {
    id: "seagreen",
    name: "Sea Green (#2E8B57)",
    brand: "#20B2AA",
    flame: "#2E8B57",
    glow: "rgba(32, 178, 170, 0.5)",
    darkBg: "radial-gradient(circle at 20% 24%, rgba(46, 139, 87, 0.45) 0%, transparent 45%), radial-gradient(circle at 80% 76%, rgba(32, 178, 170, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(13, 148, 136, 0.22) 0%, transparent 60%), #01140e",
    lightBg: "radial-gradient(circle at 20% 24%, #99f6e4 0%, transparent 50%), radial-gradient(circle at 80% 76%, #a7f3d0 0%, transparent 50%), #f0fdfa"
  },
  {
    id: "teal",
    name: "Teal (#008080)",
    brand: "#14B8A6",
    flame: "#0D9488",
    glow: "rgba(20, 184, 166, 0.5)",
    darkBg: "radial-gradient(circle at 18% 22%, rgba(13, 148, 136, 0.45) 0%, transparent 45%), radial-gradient(circle at 82% 78%, rgba(0, 128, 128, 0.4) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(0, 139, 139, 0.22) 0%, transparent 60%), #011413",
    lightBg: "radial-gradient(circle at 18% 22%, #99f6e4 0%, transparent 50%), radial-gradient(circle at 82% 78%, #ccfbf1 0%, transparent 50%), #f0fdfa"
  },
  {
    id: "cyan",
    name: "Cyan Aqua (#00FFFF)",
    brand: "#00FFFF",
    flame: "#00CED1",
    glow: "rgba(0, 255, 255, 0.55)",
    darkBg: "radial-gradient(circle at 20% 20%, rgba(0, 206, 209, 0.48) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.4) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.25) 0%, transparent 60%), #011417",
    lightBg: "radial-gradient(circle at 20% 20%, #a5f3fc 0%, transparent 50%), radial-gradient(circle at 80% 80%, #cffafe 0%, transparent 50%), #ecfeff"
  },
  {
    id: "turquoise",
    name: "Turquoise (#40E0D0)",
    brand: "#40E0D0",
    flame: "#20B2AA",
    glow: "rgba(64, 224, 208, 0.5)",
    darkBg: "radial-gradient(circle at 22% 24%, rgba(64, 224, 208, 0.45) 0%, transparent 45%), radial-gradient(circle at 78% 76%, rgba(32, 178, 170, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(45, 212, 191, 0.22) 0%, transparent 60%), #021414",
    lightBg: "radial-gradient(circle at 22% 24%, #99f6e4 0%, transparent 50%), radial-gradient(circle at 78% 76%, #a5f3fc 0%, transparent 50%), #f0fdfa"
  },
  {
    id: "deepskyblue",
    name: "Deep Sky Blue (#00BFFF)",
    brand: "#00BFFF",
    flame: "#0284C7",
    glow: "rgba(0, 191, 255, 0.5)",
    darkBg: "radial-gradient(circle at 18% 22%, rgba(2, 132, 199, 0.48) 0%, transparent 45%), radial-gradient(circle at 82% 78%, rgba(0, 191, 255, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.24) 0%, transparent 60%), #030f1a",
    lightBg: "radial-gradient(circle at 18% 22%, #bae6fd 0%, transparent 50%), radial-gradient(circle at 82% 78%, #e0f2fe 0%, transparent 50%), #f0f9ff"
  },
  {
    id: "dodgerblue",
    name: "Dodger Blue (#1E90FF)",
    brand: "#1E90FF",
    flame: "#2563EB",
    glow: "rgba(30, 144, 255, 0.5)",
    darkBg: "radial-gradient(circle at 20% 20%, rgba(30, 144, 255, 0.46) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(70, 130, 180, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.24) 0%, transparent 60%), #040e1e",
    lightBg: "radial-gradient(circle at 20% 20%, #bfdbfe 0%, transparent 50%), radial-gradient(circle at 80% 80%, #dbeafe 0%, transparent 50%), #eff6ff"
  },
  {
    id: "royalblue",
    name: "Royal Blue (#4169E1)",
    brand: "#4169E1",
    flame: "#1D4ED8",
    glow: "rgba(65, 105, 225, 0.5)",
    darkBg: "radial-gradient(circle at 20% 25%, rgba(65, 105, 225, 0.46) 0%, transparent 45%), radial-gradient(circle at 80% 75%, rgba(0, 0, 205, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(29, 78, 216, 0.24) 0%, transparent 60%), #050a20",
    lightBg: "radial-gradient(circle at 20% 25%, #c7d2fe 0%, transparent 50%), radial-gradient(circle at 80% 75%, #e0e7ff 0%, transparent 50%), #eef2ff"
  },
  {
    id: "navy",
    name: "Midnight Navy (#000080)",
    brand: "#60A5FA",
    flame: "#1E40AF",
    glow: "rgba(96, 165, 250, 0.45)",
    darkBg: "radial-gradient(circle at 18% 22%, rgba(25, 25, 112, 0.55) 0%, transparent 45%), radial-gradient(circle at 82% 78%, rgba(0, 0, 128, 0.45) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.28) 0%, transparent 60%), #020617",
    lightBg: "radial-gradient(circle at 18% 22%, #cbd5e1 0%, transparent 50%), radial-gradient(circle at 82% 78%, #e2e8f0 0%, transparent 50%), #f8fafc"
  },
  {
    id: "slateblue",
    name: "Slate Blue (#6A5ACD)",
    brand: "#7B68EE",
    flame: "#6A5ACD",
    glow: "rgba(123, 104, 238, 0.5)",
    darkBg: "radial-gradient(circle at 22% 22%, rgba(123, 104, 238, 0.45) 0%, transparent 45%), radial-gradient(circle at 78% 78%, rgba(106, 90, 205, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.22) 0%, transparent 60%), #0d0920",
    lightBg: "radial-gradient(circle at 22% 22%, #ddd6fe 0%, transparent 50%), radial-gradient(circle at 78% 78%, #ede9fe 0%, transparent 50%), #f5f3ff"
  },
  {
    id: "indigo",
    name: "Electric Indigo (#4B0082)",
    brand: "#818CF8",
    flame: "#4F46E5",
    glow: "rgba(129, 140, 248, 0.5)",
    darkBg: "radial-gradient(circle at 20% 24%, rgba(75, 0, 130, 0.55) 0%, transparent 45%), radial-gradient(circle at 80% 76%, rgba(72, 61, 139, 0.45) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.25) 0%, transparent 60%), #09031d",
    lightBg: "radial-gradient(circle at 20% 24%, #c7d2fe 0%, transparent 50%), radial-gradient(circle at 80% 76%, #e0e7ff 0%, transparent 50%), #eef2ff"
  },
  {
    id: "purple",
    name: "Purple Amethyst (#800080)",
    brand: "#C084FC",
    flame: "#9333EA",
    glow: "rgba(192, 132, 252, 0.5)",
    darkBg: "radial-gradient(circle at 22% 20%, rgba(147, 51, 234, 0.46) 0%, transparent 45%), radial-gradient(circle at 78% 80%, rgba(128, 0, 128, 0.42) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(139, 0, 139, 0.24) 0%, transparent 60%), #12031c",
    lightBg: "radial-gradient(circle at 22% 20%, #e9d5ff 0%, transparent 50%), radial-gradient(circle at 78% 80%, #f3e8ff 0%, transparent 50%), #faf5ff"
  },
  {
    id: "orchid",
    name: "Medium Orchid (#BA55D3)",
    brand: "#BA55D3",
    flame: "#9932CC",
    glow: "rgba(186, 85, 211, 0.5)",
    darkBg: "radial-gradient(circle at 20% 24%, rgba(186, 85, 211, 0.45) 0%, transparent 45%), radial-gradient(circle at 80% 76%, rgba(153, 50, 204, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.22) 0%, transparent 60%), #14041d",
    lightBg: "radial-gradient(circle at 20% 24%, #f5d0fe 0%, transparent 50%), radial-gradient(circle at 80% 76%, #fae8ff 0%, transparent 50%), #fdf4ff"
  },
  {
    id: "magenta",
    name: "Magenta Fuchsia (#FF00FF)",
    brand: "#FF00FF",
    flame: "#D946EF",
    glow: "rgba(255, 0, 255, 0.55)",
    darkBg: "radial-gradient(circle at 20% 22%, rgba(255, 0, 255, 0.45) 0%, transparent 45%), radial-gradient(circle at 80% 78%, rgba(217, 70, 239, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(192, 38, 211, 0.24) 0%, transparent 60%), #190119",
    lightBg: "radial-gradient(circle at 20% 22%, #f5d0fe 0%, transparent 50%), radial-gradient(circle at 80% 78%, #fae8ff 0%, transparent 50%), #fdf4ff"
  },
  {
    id: "deeppink",
    name: "Deep Pink (#FF1493)",
    brand: "#FF1493",
    flame: "#BE185D",
    glow: "rgba(255, 20, 147, 0.5)",
    darkBg: "radial-gradient(circle at 18% 24%, rgba(255, 20, 147, 0.45) 0%, transparent 45%), radial-gradient(circle at 82% 76%, rgba(219, 112, 147, 0.38) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(190, 24, 93, 0.22) 0%, transparent 60%), #1a0210",
    lightBg: "radial-gradient(circle at 18% 24%, #fbcfe8 0%, transparent 50%), radial-gradient(circle at 82% 76%, #fecdd3 0%, transparent 50%), #fff1f2"
  },
  {
    id: "silver",
    name: "Silver Slate (#C0C0C0)",
    brand: "#94A3B8",
    flame: "#475569",
    glow: "rgba(148, 163, 184, 0.45)",
    darkBg: "radial-gradient(circle at 20% 20%, rgba(148, 163, 184, 0.35) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(112, 128, 144, 0.32) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(71, 85, 105, 0.22) 0%, transparent 60%), #090d16",
    lightBg: "radial-gradient(circle at 20% 20%, #e2e8f0 0%, transparent 50%), radial-gradient(circle at 80% 80%, #cbd5e1 0%, transparent 50%), #f8fafc"
  }
];

let currentPaletteIdx = 0;
try {
  const urlParams = new URLSearchParams(window.location.search);
  const colorParam = urlParams.get("color");
  if (colorParam) {
    const pIdx = DYNAMIC_PALETTES.findIndex(p => p.id === colorParam.toLowerCase() || p.brand.toLowerCase() === colorParam.toLowerCase());
    if (pIdx !== -1) currentPaletteIdx = pIdx;
    else currentPaletteIdx = Math.floor(Math.random() * DYNAMIC_PALETTES.length);
  } else {
    const local = localStorage.getItem("gap_palette_idx");
    if (local !== null && !isNaN(Number(local))) currentPaletteIdx = Number(local) % DYNAMIC_PALETTES.length;
    else currentPaletteIdx = Math.floor(Math.random() * DYNAMIC_PALETTES.length);
  }
} catch {
  currentPaletteIdx = Math.floor(Math.random() * DYNAMIC_PALETTES.length);
}

function applyRandomPalette(target = null) {
  if (typeof target === "number") {
    currentPaletteIdx = ((target % DYNAMIC_PALETTES.length) + DYNAMIC_PALETTES.length) % DYNAMIC_PALETTES.length;
  } else if (typeof target === "string") {
    const foundIdx = DYNAMIC_PALETTES.findIndex(p => p.id === target.toLowerCase() || p.brand.toLowerCase() === target.toLowerCase());
    if (foundIdx !== -1) currentPaletteIdx = foundIdx;
    else currentPaletteIdx = (currentPaletteIdx + 1) % DYNAMIC_PALETTES.length;
  } else {
    currentPaletteIdx = (currentPaletteIdx + 1) % DYNAMIC_PALETTES.length;
  }

  const chosen = DYNAMIC_PALETTES[currentPaletteIdx];
  const root = document.documentElement;
  root.style.setProperty("--dyn-brand", chosen.brand);
  root.style.setProperty("--dyn-flame", chosen.flame);
  root.style.setProperty("--dyn-glow", chosen.glow);
  root.style.setProperty("--dyn-bg-dark", chosen.darkBg);
  root.style.setProperty("--dyn-bg-light", chosen.lightBg);
  root.style.setProperty("--brand", chosen.brand);
  root.style.setProperty("--accent", chosen.brand);
  root.style.setProperty("--accent-secondary", chosen.flame);
  root.style.setProperty("--accent-glow", chosen.glow);
  root.style.setProperty("--btn-active-border", chosen.brand);

  // Directly transform every GAP logo text element immediately
  document.querySelectorAll(".logo-text, #gapLogoText").forEach(el => {
    el.style.background = "linear-gradient(135deg, " + chosen.brand + " 0%, " + chosen.flame + " 50%, #ffffff 100%)";
    el.style.webkitBackgroundClip = "text";
    el.style.webkitTextFillColor = "transparent";
    el.style.filter = "drop-shadow(0 0 16px " + chosen.glow + ")";
  });

  // Pulse floating pill with the newly selected palette glow
  const pill = document.getElementById("floatingPill");
  if (pill) {
    pill.style.borderColor = chosen.brand;
    pill.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.45), 0 0 20px " + chosen.glow;
    setTimeout(() => {
      if (pill) {
        pill.style.borderColor = "";
        pill.style.boxShadow = "";
      }
    }, 600);
  }

  const brandEls = document.querySelectorAll(".brand, .dock-brand, #arcadeDock .dock-brand, #gapBrand, .nav-brand");
  brandEls.forEach(el => {
    el.title = `GAP • Palette: ${chosen.name} (Click to refresh colors)`;
  });

  const gapText = document.getElementById("gapLogoText") || document.querySelector(".nav-brand .logo-text");
  if (gapText) {
    gapText.style.background = `linear-gradient(135deg, ${chosen.brand} 0%, ${chosen.flame} 50%, #ffffff 100%)`;
    gapText.style.webkitBackgroundClip = "text";
    gapText.style.webkitTextFillColor = "transparent";
    gapText.style.filter = `drop-shadow(0 0 16px ${chosen.glow})`;
  }

  const gapOrb = document.getElementById("gapOrb") || document.querySelector(".nav-sea-orb");
  if (gapOrb) {
    gapOrb.style.background = `radial-gradient(circle at 35% 35%, #ffffff 0%, ${chosen.brand} 45%, ${chosen.flame} 100%)`;
    gapOrb.style.boxShadow = `0 0 14px ${chosen.glow}, 0 0 22px ${chosen.brand}`;
  }

  // Immediately update body background so double-clicking immediately transforms the page colors!
  const currentTheme = (typeof document !== "undefined" && document.body && document.body.getAttribute) ? (document.body.getAttribute("data-theme") || "dark") : "dark";
  if (currentTheme === "dark") {
    document.body.style.setProperty("background", chosen.darkBg, "important");
    document.body.style.setProperty("--bg", chosen.darkBg);
  } else if (currentTheme === "light" || currentTheme === "white") {
    document.body.style.setProperty("background", chosen.lightBg, "important");
    document.body.style.setProperty("--bg", chosen.lightBg);
  }
  document.body.style.backgroundAttachment = "fixed";

  try {
    localStorage.setItem("gap_palette_idx", currentPaletteIdx);
  } catch {}
}
applyRandomPalette(currentPaletteIdx);

document.addEventListener("DOMContentLoaded", () => {
  const brandEls = document.querySelectorAll(".dock-brand, #arcadeDock .dock-brand");
  brandEls.forEach(el => {
    el.style.cursor = "pointer";
    const chosen = DYNAMIC_PALETTES[currentPaletteIdx];
    el.title = `GAP • Palette: ${chosen.name} (Click to refresh colors)`;
    el.addEventListener("click", () => {
      applyRandomPalette();
      el.classList.add("brand-click-pulse");
      setTimeout(() => el.classList.remove("brand-click-pulse"), 400);
    });
  });
});


/* ---------- Custom SVGs for Thematic Markers & Crests ---------- */
const SHARINGAN_SVG = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#ff0033"/><circle cx="50" cy="50" r="38" fill="none" stroke="#000" stroke-width="4"/><circle cx="50" cy="50" r="10" fill="#000"/><circle cx="50" cy="24" r="7" fill="#000"/><path d="M50 24 Q57 32 50 37" stroke="#000" stroke-width="3" fill="none"/><circle cx="27" cy="63" r="7" fill="#000"/><path d="M27 63 Q23 72 30 75" stroke="#000" stroke-width="3" fill="none"/><circle cx="73" cy="63" r="7" fill="#000"/><path d="M73 63 Q77 72 70 75" stroke="#000" stroke-width="3" fill="none"/></svg>`;
const CROW_SVG = `<svg viewBox="0 0 100 100"><path d="M15 50 C25 25, 60 20, 85 40 C75 45, 65 48, 55 46 C68 55, 75 65, 80 80 C60 70, 40 75, 20 62 C30 62, 40 58, 45 52 C30 52, 20 54, 15 50 Z" fill="currentColor"/><circle cx="70" cy="38" r="3" fill="#ff0033"/></svg>`;

const KONOHA_LEAF_SVG = `<svg viewBox="0 0 100 100"><path d="M 86 26 L 76 33 C 65 26 44 26 31 43 L 18 68 L 62 68 C 76 68 83 55 80 43 C 77 31 63 25 49 28 C 35 32 30 46 34 58 C 39 68 53 71 64 67 C 72 62 74 51 68 44 C 62 37 51 40 47 48 C 45 54 49 60 55 58 C 59 56 60 52 58 49" fill="none" stroke="#f97316" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const AKATSUKI_CLOUD_SVG = `<svg viewBox="0 0 100 100"><path d="M30 65 A18 18 0 0 1 25 35 A22 22 0 0 1 65 26 A26 26 0 0 1 85 52 A20 20 0 0 1 70 70 Z" fill="#e11d48" stroke="#ffffff" stroke-width="4"/><path d="M40 50 A10 10 0 0 1 60 48" stroke="#ffffff" stroke-width="3" fill="none"/></svg>`;
var ludoState = {
  mode: "ai",
  playerCount: 4,
  players: ["red", "green", "yellow", "blue"],
  humanPlayer: "red",
  currentTurn: 0,
  diceValue: 1,
  consecutiveSixes: 0,
  canRoll: true,
  mustMove: false,
  isRolling: false,
  gameOver: false,
  rankings: [],
  tokens: {
    red: [-1, -1, -1, -1],
    green: [-1, -1, -1, -1],
    yellow: [-1, -1, -1, -1],
    blue: [-1, -1, -1, -1]
  }
};

// 52 Perimeter track coordinates [col, row] in 15x15 grid
const LUDO_TRACK = [
  [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
  [6, 5], [6, 4], [6, 3], [6, 2], [6, 1], [6, 0],
  [7, 0], [8, 0],
  [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
  [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6],
  [14, 7], [14, 8],
  [13, 8], [12, 8], [11, 8], [10, 8], [9, 8],
  [8, 9], [8, 10], [8, 11], [8, 12], [8, 13], [8, 14],
  [7, 14], [6, 14],
  [6, 13], [6, 12], [6, 11], [6, 10], [6, 9],
  [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  [0, 7], [0, 6]
];

// 5-cell Home straight paths leading into center triangle
const LUDO_HOME_PATHS = {
  red:    [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  green:  [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  yellow: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
  blue:   [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]]
};

// Yard Pocket coordinates [pixel_x, pixel_y] inside 600x600 board
const LUDO_YARD_POCKETS = {
  red:    [[76, 76], [164, 76], [76, 164], [164, 164]],
  green:  [[436, 76], [524, 76], [436, 164], [524, 164]],
  blue:   [[76, 436], [164, 436], [76, 524], [164, 524]],
  yellow: [[436, 436], [524, 436], [436, 524], [524, 524]]
};

// Starting track indices
const LUDO_START_OFFSETS = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

// Safe squares on 52-track (4 starts + 4 stars)
const LUDO_SAFE_TRACK_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

// Authentic Colors matching the classic board
const LUDO_COLORS = {
  red:    { name: "Red", hex: "#D32F2F", border: "#B71C1C", light: "#FFCDD2", grad1: "#EF5350", grad2: "#C62828" },
  green:  { name: "Green", hex: "#2E7D32", border: "#1B5E20", light: "#C8E6C9", grad1: "#66BB6A", grad2: "#2E7D32" },
  yellow: { name: "Yellow", hex: "#FBC02D", border: "#F57F17", light: "#FFF9C4", grad1: "#FFEE58", grad2: "#F9A825" },
  blue:   { name: "Blue", hex: "#1565C0", border: "#0D47A1", light: "#BBDEFB", grad1: "#42A5F5", grad2: "#1565C0" }
};




const hubState = {
  game: "ttt3",
  opponent: "ai",
  difficulty: "medium",
  timer: "off",
  theme: "dark"
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
  if (hubState.game === "snake") return "snake";
  if (hubState.game === "wordle") return "wordle";
  if (hubState.game === "pattu") return "pattu";
  if (hubState.game === "sequence") return hubState.opponent === "ai" ? "sequence-ai" : "sequence-2p";
  if (hubState.game === "poker") return hubState.opponent === "ai" ? "poker-ai" : "poker-2p";
  if (hubState.game === "ttt3") return hubState.opponent === "ai" ? "ttt3-ai" : "ttt3-2p";
  if (hubState.game === "ttt5") return hubState.opponent === "ai" ? "ttt5-ai" : "ttt5-2p";
  return hubState.opponent === "ai" ? "chess-ai" : "chess-2p";
}

function hubFromMode(mode) {
  if (mode === "snake") {
    hubState.game = "snake";
    hubState.opponent = "local";
    return;
  }
  if (mode === "wordle") {
    hubState.game = "wordle";
    hubState.opponent = "local";
    return;
  }
  if (mode === "pattu") {
    hubState.game = "pattu";
    hubState.opponent = "local";
    return;
  }
  if (mode.startsWith("sequence")) {
    hubState.game = "sequence";
    hubState.opponent = mode.endsWith("-ai") ? "ai" : "local";
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
  const opponentVal = (hubState.game === "wordle" || hubState.game === "snake") ? "local" : hubState.opponent;
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
    if (["ttt3", "ttt5", "chess", "sequence", "wordle", "poker", "pattu", "ludo", "snake"].includes(path)) hubState.game = path;

    const q = new URLSearchParams(query);
    const vs = q.get("vs");
    const diff = q.get("diff");
    const timer = q.get("timer");
    const theme = q.get("theme");

    if (["ai", "local"].includes(vs)) hubState.opponent = vs;
    if (["easy", "medium", "hard"].includes(diff)) hubState.difficulty = diff;
    if (["off", "15", "30", "45", "60", "90"].includes(timer)) hubState.timer = timer;
    if (theme === "light" || theme === "white" || theme === "arctic") hubState.theme = "light";
    else hubState.theme = "dark";
    const color = q.get("color");
    if (color) applyRandomPalette(color);
  }

  // normalize
  if (!["off", "15", "30", "45", "60", "90"].includes(hubState.timer)) hubState.timer = "off";
  if (hubState.theme !== "light") hubState.theme = "dark";
  if (!["easy", "medium", "hard"].includes(hubState.difficulty)) hubState.difficulty = "medium";
  if (!["ai", "local"].includes(hubState.opponent)) hubState.opponent = "ai";
  if (!["ttt3", "ttt5", "chess", "sequence", "wordle", "poker", "pattu", "ludo", "snake"].includes(hubState.game)) hubState.game = "ttt3";

  if (hubState.game === "wordle" || hubState.game === "pattu" || hubState.game === "snake") hubState.opponent = "local";
}

function syncHud() {
  const isTTT = hubState.game.startsWith("ttt");
  const isChess = hubState.game === "chess";
  const isSequence = hubState.game === "sequence";
  const isWordle = hubState.game === "wordle";
  const isPattu = hubState.game === "pattu";
  const isPoker = hubState.game === "poker";
  const isSolo = isWordle || isPattu;
  if (isSolo) hubState.opponent = "local";

  const activeGamePill = isTTT ? "ttt" : hubState.game;
  setActive(gameTypePills, "game", activeGamePill);
  setActive(opponentPills, "opponent", hubState.opponent);
  setActive(difficultyPills, "difficulty", hubState.difficulty);
  setActive(timerPills, "timer", hubState.timer);

  if (difficultySelect && hubState.difficulty) difficultySelect.value = hubState.difficulty;
  if (modeSelect) modeSelect.value = modeFromHub();

  // Keep active game header badge in perfect sync with current game
  const activeBadge = document.getElementById("activeGameBadge");
  if (activeBadge) activeBadge.textContent = getGameDisplayName(hubState.game);

  // Dynamic PC Guesser Controls in Top Match Bar
  const pattuMatchGroup = document.getElementById("pattuMatchGroup");
  const pattuHudDayText = document.getElementById("pattuHudDayText");
  if (pattuMatchGroup) {
    if (isPattu) {
      pattuMatchGroup.style.display = "flex";
      pattuMatchGroup.classList.remove("hidden");
      if (pattuHudDayText) {
        const dNum = (typeof pattuCurrentDay === "number" && pattuCurrentDay > 0) ? pattuCurrentDay : getPattuDayCount();
        pattuHudDayText.textContent = `Day #${dNum}`;
      }
    } else {
      pattuMatchGroup.style.setProperty("display", "none", "important");
      pattuMatchGroup.classList.add("hidden");
    }
  }

  if (tttModeGroup) {
    if (isTTT) {
      tttModeGroup.style.display = "flex";
      setActive(tttModePills, "grid", hubState.game === "ttt5" ? "5" : "3");
    } else {
      tttModeGroup.style.setProperty("display", "none", "important");
    }
  }

  // Match Bar Optimization: Show Opponent selector for games supporting 2P vs AI (TTT, Chess, Sequence & Poker)
  const isLudo = (hubState.game === "ludo");
  const isSnake = (hubState.game === "snake");
  const supportsOpponent = isTTT || isChess || isSequence || isPoker;
  if (opponentGroup) {
    if (supportsOpponent && !isLudo && !isSnake) {
      opponentGroup.style.display = "flex";
      opponentGroup.classList.remove("hidden");
    } else {
      opponentGroup.style.setProperty("display", "none", "important");
      opponentGroup.classList.add("hidden");
    }
  }

  const ludoMatchGroup = document.getElementById("ludoMatchGroup");
  if (ludoMatchGroup) {
    if (isLudo) {
      ludoMatchGroup.style.display = "flex";
      ludoMatchGroup.classList.remove("hidden");
      setActive(document.getElementById("ludoModePills"), "ludomode", (typeof ludoState !== "undefined" && ludoState.mode) || "ai");
      setActive(document.getElementById("ludoPlayersPills"), "players", String((typeof ludoState !== "undefined" && ludoState.playerCount) || 4));
    } else {
      ludoMatchGroup.style.setProperty("display", "none", "important");
      ludoMatchGroup.classList.add("hidden");
    }
  }

  // Snake Match Group in Top Match Bar
  const snakeMatchGroup = document.getElementById("snakeMatchGroup");
  if (snakeMatchGroup) {
    if (isSnake) {
      snakeMatchGroup.style.display = "flex";
      snakeMatchGroup.classList.remove("hidden");
      if (typeof syncSnakeMatchBarUI === "function") syncSnakeMatchBarUI();
    } else {
      snakeMatchGroup.style.setProperty("display", "none", "important");
      snakeMatchGroup.classList.add("hidden");
    }
  }



  // Difficulty selector for AI-supporting games: TTT, Chess, Sequence, Poker & Ludo King (when vs AI is active)
  const supportsAi = isTTT || isChess || isSequence || isPoker || isLudo;
  if (difficultyGroup) {
    if (supportsAi && !isSnake) {
      const isAiActive = isLudo ? (ludoState.mode === "ai") : (hubState.opponent === "ai");
      if (isAiActive) {
        difficultyGroup.style.display = "flex";
        difficultyGroup.classList.remove("disabled", "hidden");
        difficultyGroup.style.removeProperty("display");
      } else {
        difficultyGroup.style.setProperty("display", "none", "important");
        difficultyGroup.classList.add("hidden");
      }
    } else {
      difficultyGroup.style.setProperty("display", "none", "important");
      difficultyGroup.classList.add("hidden");
    }
  }

  // Wordle Match Group in Top Match Dropdown
  const wordleMatchGroup = document.getElementById("wordleMatchGroup");
  if (wordleMatchGroup) {
    if (isWordle) {
      wordleMatchGroup.style.display = "flex";
      wordleMatchGroup.classList.remove("hidden");
    } else {
      wordleMatchGroup.style.setProperty("display", "none", "important");
      wordleMatchGroup.classList.add("hidden");
    }
  }
}



/* ---------- Exclusive Single-Game Matrix Display Guard ---------- */
function showOnlyActiveGame(gameKey) {
  const isTTT = (gameKey === "ttt3" || gameKey === "ttt5");
  const isChess = (gameKey === "chess");
  const isWordle = (gameKey === "wordle");
  const isPoker = (gameKey === "poker");
  const isPattu = (gameKey === "pattu");
  const isSequence = (gameKey === "sequence");
  const isPalace = (gameKey === "palace");
  const isSnake = (gameKey === "snake");

  // 1. TTT Board
  if (tttBoardEl) {
    if (isTTT) {
      tttBoardEl.classList.remove("hidden");
      tttBoardEl.style.removeProperty("display");
    } else {
      tttBoardEl.classList.add("hidden");
      tttBoardEl.style.setProperty("display", "none", "important");
    }
  }

  // 2. Chess Board
  if (chessBoardEl) {
    if (isChess) {
      chessBoardEl.classList.remove("hidden");
      chessBoardEl.style.removeProperty("display");
    } else {
      chessBoardEl.classList.add("hidden");
      chessBoardEl.style.setProperty("display", "none", "important");
    }
  }

  // 3. Wordle Arena
  if (wordleGameEl) {
    if (isWordle) {
      wordleGameEl.classList.remove("hidden");
      wordleGameEl.style.removeProperty("display");
    } else {
      wordleGameEl.classList.add("hidden");
      wordleGameEl.style.setProperty("display", "none", "important");
    }
  }

  // 4. Poker Arena
  if (pokerGameEl) {
    if (isPoker) {
      pokerGameEl.classList.remove("hidden");
      pokerGameEl.style.removeProperty("display");
    } else {
      pokerGameEl.classList.add("hidden");
      pokerGameEl.style.setProperty("display", "none", "important");
    }

  }

  // 5. Pattu Arena
  if (pattuGameEl) {
    if (isPattu) {
      pattuGameEl.classList.remove("hidden");
      pattuGameEl.style.removeProperty("display");
    } else {
      pattuGameEl.classList.add("hidden");
      pattuGameEl.style.setProperty("display", "none", "important");
    }
  }

  // 6. Sequence Arena
  if (sequenceGameEl) {
    if (isSequence) {
      sequenceGameEl.classList.remove("hidden");
      sequenceGameEl.style.removeProperty("display");
    } else {
      sequenceGameEl.classList.add("hidden");
      sequenceGameEl.style.setProperty("display", "none", "important");
    }
  }

  // 7. Ludo Arena
  const isLudo = (gameKey === "ludo");
  const ludoGameEl = document.getElementById("ludoGame");
  if (ludoGameEl) {
    if (isLudo) {
      ludoGameEl.classList.remove("hidden");
      ludoGameEl.style.removeProperty("display");
      const svg = document.getElementById("ludoBoardSvg");
      if (svg && (!svg.innerHTML || svg.innerHTML.trim() === "")) {
        renderLudoBoard();
      }
    } else {
      ludoGameEl.classList.add("hidden");
      ludoGameEl.style.setProperty("display", "none", "important");
    }
  }

  // 8. Snake Arena
  const snakeGameEl = document.getElementById("snakeGame");
  if (snakeGameEl) {
    if (isSnake) {
      snakeGameEl.classList.remove("hidden");
      snakeGameEl.style.removeProperty("display");
    } else {
      snakeGameEl.classList.add("hidden");
      snakeGameEl.style.setProperty("display", "none", "important");
      if (typeof stopSnake === "function") stopSnake();
    }
  }

  // 9. Intelligent Game-Specific Bottom Dock Visibility Guard:
  // ONLY show bottom quickDock (Timer/Actions/Scores) for Tic-Tac-Toe & Chess!
  const quickDockEl = document.getElementById("quickDock");
  const needsQuickDock = (isTTT || isChess);
  if (quickDockEl) {
    if (needsQuickDock) {
      quickDockEl.classList.remove("hidden");
      quickDockEl.style.removeProperty("display");
    } else {
      quickDockEl.classList.add("hidden");
      quickDockEl.style.setProperty("display", "none", "important");
    }
  }

  // Hide TTT HUD turn status pill & adjust arena when playing Pattu, Sequence, Ludo, Snake, Chess, Wordle, or Poker
  const statusWrapEl = document.querySelector(".status-wrap");
  const arenaEl = document.querySelector(".arena");
  if (isPalace || isSequence || isLudo || isSnake || isChess || isWordle || isPoker) {
    arenaEl?.classList.remove("pattu-arena-mode");
    statusWrapEl?.classList.add("hidden");
    statusWrapEl?.style.setProperty("display", "none", "important");
    statusPill?.classList.add("hidden");
    statusPill?.style.setProperty("display", "none", "important");
    moveCounterPill?.classList.add("hidden");
    moveCounterPill?.style.setProperty("display", "none", "important");
  } else if (isPattu) {
    arenaEl?.classList.add("pattu-arena-mode");
    statusWrapEl?.classList.add("hidden");
    statusWrapEl?.style.setProperty("display", "none", "important");
    statusPill?.classList.add("hidden");
    statusPill?.style.setProperty("display", "none", "important");
    moveCounterPill?.classList.add("hidden");
    moveCounterPill?.style.setProperty("display", "none", "important");
    updatePattuConnectionBadge();
  } else {
    arenaEl?.classList.remove("pattu-arena-mode");
    statusWrapEl?.classList.remove("hidden");
    statusWrapEl?.style.removeProperty("display");
    if (!isWordle && !isPoker && hubState.timer === "off") {
      statusPill?.classList.remove("hidden");
      statusPill?.style.removeProperty("display");
    } else {
      statusPill?.classList.add("hidden");
      statusPill?.style.setProperty("display", "none", "important");
    }
  }

  // Chess Move Hints Button in bottom dashboard
  if (chessHintsBtn) {
    if (isChess) {
      chessHintsBtn.classList.remove("hidden");
      chessHintsBtn.classList.toggle("active", chessShowMoveHints);
      chessHintsBtn.setAttribute("aria-pressed", chessShowMoveHints ? "true" : "false");
    } else {
      chessHintsBtn.classList.add("hidden");
    }
  }

  // Board wrap shell classes
  boardWrap?.classList.remove("chess-mode", "wordle-mode", "poker-mode", "pattu-mode", "sequence-mode", "ludo-mode", "snake-mode");
  if (isChess) boardWrap?.classList.add("chess-mode");
  else if (isWordle) boardWrap?.classList.add("wordle-mode");
  else if (isPoker) boardWrap?.classList.add("poker-mode");
  else if (isPattu) boardWrap?.classList.add("pattu-mode");
  else if (isSequence) boardWrap?.classList.add("sequence-mode");
  else if (isLudo) boardWrap?.classList.add("ludo-mode");
  else if (isSnake) boardWrap?.classList.add("snake-mode");

  // Sidebars (Chess captured only)
  const isMini = isMiniWindow();
  const showSidebars = isChess && !isMini;
  if (capturedLeft) {
    if (showSidebars) {
      capturedLeft.classList.remove("hidden");
      capturedLeft.style.removeProperty("display");
    } else {
      capturedLeft.classList.add("hidden");
      capturedLeft.style.setProperty("display", "none", "important");
    }
  }
  if (capturedRight) {
    if (showSidebars) {
      capturedRight.classList.remove("hidden");
      capturedRight.style.removeProperty("display");
    } else {
      capturedRight.classList.add("hidden");
      capturedRight.style.setProperty("display", "none", "important");
    }
  }

  // Sequence Flanking Edge Shelves (P1 on extreme left, P2/AI on extreme right)
  const showSeqShelves = isSequence;
  if (seqP1HandShelf) {
    if (showSeqShelves) {
      seqP1HandShelf.classList.remove("hidden");
      seqP1HandShelf.style.removeProperty("display");
    } else {
      seqP1HandShelf.classList.add("hidden");
      seqP1HandShelf.style.setProperty("display", "none", "important");
    }
  }
  if (seqP2HandShelf) {
    if (showSeqShelves) {
      seqP2HandShelf.classList.remove("hidden");
      seqP2HandShelf.style.removeProperty("display");
    } else {
      seqP2HandShelf.classList.add("hidden");
      seqP2HandShelf.style.setProperty("display", "none", "important");
    }
  }
}

/* ---------- Appearance Mode (Light & Dark Only) ---------- */
function themeMeta(theme) {
  if (theme === "light" || theme === "white") {
    return {
      name: "Light Mode",
      text: "Light Mode",
      hint: "Bright Glass",
      icon: `<svg class="theme-icon sun-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4.2" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.8"/><line x1="12" y1="2" x2="12" y2="4.2" stroke="#f59e0b" stroke-width="2.2"/><line x1="12" y1="19.8" x2="12" y2="22" stroke="#f59e0b" stroke-width="2.2"/><line x1="4.93" y1="4.93" x2="6.48" y2="6.48" stroke="#f59e0b" stroke-width="2.2"/><line x1="17.52" y1="17.52" x2="19.07" y2="19.07" stroke="#f59e0b" stroke-width="2.2"/><line x1="2" y1="12" x2="4.2" y2="12" stroke="#f59e0b" stroke-width="2.2"/><line x1="19.8" y1="12" x2="22" y2="12" stroke="#f59e0b" stroke-width="2.2"/><line x1="4.93" y1="19.07" x2="6.48" y2="17.52" stroke="#f59e0b" stroke-width="2.2"/><line x1="17.52" y1="6.48" x2="19.07" y2="4.93" stroke="#f59e0b" stroke-width="2.2"/></svg>`
    };
  }
  return {
    name: "Dark Mode",
    text: "Dark Mode",
    hint: "Deep Sea Glass",
    icon: `<svg class="theme-icon moon-icon" viewBox="0 0 24 24" width="16" height="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="0.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
  };
}

function setTheme(theme) {
  if (theme === "light" || theme === "white" || theme === "arctic") theme = "light";
  else theme = "dark";

  hubState.theme = theme;
  if (themeSelect) themeSelect.value = theme;
  document.body.setAttribute("data-theme", theme);
  const m = themeMeta(theme);
  if (themeCurrentIcon) themeCurrentIcon.innerHTML = m.icon;
  if (themeCurrentText) themeCurrentText.textContent = m.text;

  // Sync Sea-Glass Switcher inside GAP pill
  const glassToggle = document.getElementById("themeGlassToggle");
  if (glassToggle) {
    glassToggle.querySelectorAll(".sea-glass-btn").forEach(b => {
      const isActive = (b.dataset.theme === theme);
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-checked", isActive ? "true" : "false");
    });
  }

  const modalPills = document.getElementById("modalThemePills");
  if (modalPills) {
    modalPills.querySelectorAll(".seg-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.theme === theme);
    });
  }

  // Update body background according to current theme and active GAP palette
  const chosen = (typeof DYNAMIC_PALETTES !== "undefined" && DYNAMIC_PALETTES[currentPaletteIdx]) ? DYNAMIC_PALETTES[currentPaletteIdx] : null;
  if (chosen) {
    if (theme === "dark") {
      document.body.style.setProperty("background", chosen.darkBg, "important");
      document.body.style.setProperty("--bg", chosen.darkBg);
    } else {
      document.body.style.setProperty("background", chosen.lightBg, "important");
      document.body.style.setProperty("--bg", chosen.lightBg);
    }
    document.body.style.backgroundAttachment = "fixed";
  }

  persistHub();

  if (hubState.game.startsWith("ttt")) renderTTT();
  if (hubState.game === "chess") {
    renderCaptured();
    renderChess();
  }
  if (hubState.game === "poker") renderPokerUI();
  if (hubState.game === "sequence") renderSequenceUI();
}

// Sea-Glass Theme Switcher capsule in GAP pill (Sun Left / Moon Right)
const themeGlassToggleEl = document.getElementById("themeGlassToggle");
themeGlassToggleEl?.addEventListener("click", (e) => {
  e.stopPropagation();
  const btn = e.target.closest(".sea-glass-btn");
  if (btn && btn.dataset.theme) {
    setTheme(btn.dataset.theme);
    return;
  }
  // Clicking the capsule track toggles between Light and Dark
  setTheme(hubState.theme === "light" ? "dark" : "light");
});

// Chevron button in GAP pill toggles expanded drawer
const pillChevronBtnEl = document.getElementById("pillChevronBtn");
pillChevronBtnEl?.addEventListener("click", (e) => {
  e.stopPropagation();
  const pill = document.getElementById("floatingPill");
  pill?.classList.toggle("expanded");
  pillChevronBtnEl.setAttribute("aria-expanded", pill?.classList.contains("expanded") ? "true" : "false");
});

// Robust outside-click closing listener
document.addEventListener("click", (e) => {
  if (themePicker && !themePicker.contains(e.target)) {
    themePicker.classList.remove("open");
    themeTrigger?.setAttribute("aria-expanded", "false");
  }
});

// Close theme dropdown on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && themePicker?.classList.contains("open")) {
    themePicker.classList.remove("open");
    themeTrigger?.setAttribute("aria-expanded", "false");
  }
});

/* ---------- Mini-Window (Pop-Out / Floating Mode) ---------- */
function isMiniWindow() {
  const params = new URLSearchParams(window.location.search);
  return window.name === "GAP_MiniWindow" || params.get("mini") === "1" || window.innerWidth <= 520;
}

function updateMiniWindowUI() {
  const isMini = isMiniWindow();
  document.body.classList.toggle("mini-window", isMini);
  showOnlyActiveGame(hubState.game);

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
    { label: "Sequence (AI)", key: "scores_sequence-ai_medium" },
    { label: "Chess (AI)", key: "scores_chess-ai_medium" },
    { label: "Wordle", key: "scores_wordle_medium" },
    { label: "Poker (AI)", key: "scores_poker-ai_medium" },
    { label: "PC (Tollywood)", key: "gap_pattu_stats" },
    { label: "Ludo King", key: "scores_ludo-ai_medium" },
    { label: "Snake Arena", key: "gap_snake_high_score" }
  ];

  if (!statsGridContent || !statsModal) return;
  statsGridContent.innerHTML = modes.map(m => {
    if (m.key === "gap_snake_high_score") {
      const hs = localStorage.getItem("gap_snake_high_score") || "0";
      return `
        <div class="stat-card">
          <span>${m.label}</span>
          <span>High Score: <b>${hs}</b> pts</span>
        </div>
      `;
    }
    const data = JSON.parse(localStorage.getItem(m.key) || '{"scoreA":0,"scoreB":0,"scoreD":0,"streak":0}');
    const wins = data.scoreA || data.gamesWon || 0;
    const losses = data.scoreB || (data.gamesPlayed ? data.gamesPlayed - wins : 0);
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

/* ---------- Endgame Visual Effects (Zero Audio, Pure Visual) ---------- */
let activeEndgameAnim = null;

function stopActiveEndgameAnim() {
  if (activeEndgameAnim) {
    cancelAnimationFrame(activeEndgameAnim);
    activeEndgameAnim = null;
  }
  if (confettiCanvas) {
    const ctx = confettiCanvas.getContext("2d");
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

/* 1. Victory Celebration: Bursting Confetti */
function triggerConfetti() {
  if (!confettiCanvas) return;
  stopActiveEndgameAnim();
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
    activeEndgameAnim = requestAnimationFrame(loop);
  }
  activeEndgameAnim = requestAnimationFrame(loop);
  setTimeout(() => stopActiveEndgameAnim(), 3500);
}

/* 2. Draw & Stalemate Experience: Equilibrium Shockwaves & Floating Crystal Frost */
function triggerDrawAnimation() {
  if (!confettiCanvas) return;
  stopActiveEndgameAnim();

  const ctx = confettiCanvas.getContext("2d");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const cx = confettiCanvas.width / 2;
  const cy = confettiCanvas.height / 2;

  // Concentric frosted glass shockwave rings
  const maxRadius = Math.min(cx, cy) * 1.35;
  const rings = [
    { r: 8, maxR: maxRadius, speed: 4.2, color: "34, 211, 238", width: 4.5 },
    { r: 4, maxR: maxRadius * 0.9, speed: 3.4, color: "251, 191, 36", width: 4.0 },
    { r: 1, maxR: maxRadius * 1.15, speed: 5.0, color: "255, 255, 255", width: 2.5 }
  ];

  // Dual clashing streams meeting in equilibrium (Force A: Cyan, Force B: Amber)
  const isLight = document.body.dataset.theme === "light";
  const colA = isLight ? "2, 132, 199" : "34, 211, 238";
  const colB = isLight ? "217, 119, 6" : "251, 191, 36";

  const clashingParticles = [];
  // Left stream (Force A)
  for (let i = 0; i < 48; i++) {
    const angle = (Math.random() - 0.5) * 1.1;
    const speed = Math.random() * 8 + 6;
    clashingParticles.push({
      x: cx - Math.random() * (cx * 0.9),
      y: cy + (Math.random() - 0.5) * 160,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * (Math.random() - 0.5) * 3.5,
      size: Math.random() * 4 + 2.5,
      color: colA,
      mode: "converge",
      life: 1
    });
  }

  // Right stream (Force B)
  for (let i = 0; i < 48; i++) {
    const angle = Math.PI + (Math.random() - 0.5) * 1.1;
    const speed = Math.random() * 8 + 6;
    clashingParticles.push({
      x: cx + Math.random() * (cx * 0.9),
      y: cy + (Math.random() - 0.5) * 160,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * (Math.random() - 0.5) * 3.5,
      size: Math.random() * 4 + 2.5,
      color: colB,
      mode: "converge",
      life: 1
    });
  }

  // Floating ambient crystalline frost spores
  const frostSparks = [];
  for (let i = 0; i < 55; i++) {
    const ang = Math.random() * Math.PI * 2;
    const dist = Math.random() * 100 + 20;
    frostSparks.push({
      x: cx + Math.cos(ang) * dist,
      y: cy + Math.sin(ang) * dist,
      vx: (Math.random() - 0.5) * 2.2,
      vy: -(Math.random() * 2.2 + 0.8),
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 5,
      size: Math.random() * 5 + 2.2,
      alpha: Math.random() * 0.85 + 0.25,
      color: Math.random() > 0.5 ? colA : colB
    });
  }

  let startTime = performance.now();

  function loop(now) {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    // 1. Draw expanding shockwave rings
    rings.forEach(ring => {
      ring.r += ring.speed;
      const progress = ring.r / ring.maxR;
      const alpha = Math.max(0, 1 - progress);
      if (alpha > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ring.color}, ${alpha * 0.85})`;
        ctx.lineWidth = ring.width * (1 - progress * 0.4);
        ctx.shadowColor = `rgba(${ring.color}, 0.85)`;
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.restore();
      }
    });

    // 2. Draw converging & clashing standoff particles
    clashingParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      const dist = Math.hypot(p.x - cx, p.y - cy);

      if (dist < 42 && p.mode === "converge") {
        p.mode = "orbit";
        p.vx = (Math.random() - 0.5) * 4.5;
        p.vy = -(Math.random() * 3.5 + 2.0);
      }

      if (p.mode === "orbit") {
        p.vy -= 0.04;
        p.life -= 0.011;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${Math.max(0, p.life)})`;
      ctx.shadowColor = `rgba(${p.color}, 0.9)`;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    });

    // 3. Draw shimmering diamond frost crystals
    frostSparks.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.vRot;
      s.alpha = Math.max(0, s.alpha - 0.0035);

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate((s.rot * Math.PI) / 180);
      ctx.fillStyle = `rgba(${s.color}, ${s.alpha})`;
      ctx.shadowColor = `rgba(${s.color}, 0.75)`;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, -s.size);
      ctx.lineTo(s.size * 0.65, 0);
      ctx.lineTo(0, s.size);
      ctx.lineTo(-s.size * 0.65, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    if (elapsed < 4200) {
      activeEndgameAnim = requestAnimationFrame(loop);
    } else {
      stopActiveEndgameAnim();
    }
  }

  activeEndgameAnim = requestAnimationFrame(loop);
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

/* ---------- Win & Draw Modals ---------- */
function showWinScreen(msg, subtitle = "Outstanding Victory!") {
  resetIdleWatchdog();
  stopActiveEndgameAnim();
  winOverlay?.classList.remove("draw-mode");
  winOverlay?.classList.remove("hidden");
  if (winMessage) winMessage.textContent = msg.toUpperCase();
  if (winIcon) {
    winIcon.textContent = "🏆";
    winIcon.classList.remove("hidden");
  }
  if (winSubtitle) {
    winSubtitle.textContent = subtitle.toUpperCase();
    winSubtitle.classList.remove("hidden");
  }
  if (winRestartBtn) winRestartBtn.textContent = "Play Again";
  triggerConfetti();
}

function showDrawScreen(msg, subtitle = "Equilibrium • Perfect Standoff") {
  resetIdleWatchdog();
  stopActiveEndgameAnim();
  winOverlay?.classList.add("draw-mode");
  winOverlay?.classList.remove("hidden");
  if (winMessage) winMessage.textContent = msg.toUpperCase();

  const theme = hubState.theme;
  let icon = "⚖️";
  if (theme === "violet") {
    icon = "⚡";
    subtitle = "Stalemate • Neon Overdrive";
  } else if (theme === "gold") {
    icon = "✨";
    subtitle = "Golden Harmony • Drawn Game";
  } else if (theme === "arctic") {
    icon = "❄️";
    subtitle = "Glass Impasse • Frozen Match";
  } else {
    icon = "⚖️";
    subtitle = "Balanced Clash • Drawn Contest";
  }

  if (winIcon) {
    winIcon.textContent = icon;
    winIcon.classList.remove("hidden");
  }
  if (winSubtitle) {
    winSubtitle.textContent = subtitle.toUpperCase();
    winSubtitle.classList.remove("hidden");
  }
  if (winRestartBtn) winRestartBtn.textContent = "Rematch";
  triggerDrawAnimation();
}

function showDefeatScreen(msg, subtitle = "Game Over") {
  resetIdleWatchdog();
  stopActiveEndgameAnim();
  winOverlay?.classList.remove("draw-mode");
  winOverlay?.classList.remove("hidden");
  if (winMessage) winMessage.textContent = msg.toUpperCase();
  if (winIcon) {
    winIcon.textContent = "💀";
    winIcon.classList.remove("hidden");
  }
  if (winSubtitle) {
    winSubtitle.textContent = subtitle.toUpperCase();
    winSubtitle.classList.remove("hidden");
  }
  if (winRestartBtn) winRestartBtn.textContent = "Try Again";
}

function hideWinScreen() {
  stopActiveEndgameAnim();
  winOverlay?.classList.add("hidden");
  winOverlay?.classList.remove("draw-mode");
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
  showOnlyActiveGame("ttt" + tttSize);

  if (!tttBoardEl) return;
  tttBoardEl.classList.toggle("grid-5x5", tttSize === 5);
  tttBoardEl.innerHTML = "";
  tttBoardEl.style.gridTemplateColumns = `repeat(${tttSize}, 1fr)`;
  tttBoardEl.style.gridTemplateRows = `repeat(${tttSize}, 1fr)`;

  function getIcon(mark) {
    if (mark === "X") {
      return `<svg class="ttt-mark-svg mark-x" viewBox="0 0 24 24" width="62%" height="62%" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    }
    if (mark === "O") {
      return `<svg class="ttt-mark-svg mark-o" viewBox="0 0 24 24" width="62%" height="62%" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="8"/></svg>`;
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
    statusPill.textContent = r.winner === "draw" ? "Draw" : r.winner ? `${r.winner} Wins` : `${tttTurn}'s Turn`;
  }
}

/* ---------- 3x3 Tic-Tac-Toe Minimax & Advanced Tactical Engine ---------- */
const TTT3_POS_WEIGHTS = [
  35, 10, 35,
  10, 55, 10,
  35, 10, 35
];

function countThreats(board, size, winLen, piece) {
  const lines = getTTTLines(size, winLen);
  let threats = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let pCount = 0, emptyCount = 0;
    for (let k = 0; k < line.length; k++) {
      const v = board[line[k]];
      if (v === piece) pCount++;
      else if (!v) emptyCount++;
    }
    if (pCount === winLen - 1 && emptyCount === 1) {
      threats++;
    }
  }
  return threats;
}

function minimaxTTT3(board, depth, alpha, beta, maxing) {
  const r = getTTTResult(board, 3, 3);
  if (r.winner === "O") return 1000 + depth;
  if (r.winner === "X") return -1000 - depth;
  if (r.winner === "draw" || depth === 0) return 0;

  const empties = getEmptyCells(board);
  if (maxing) {
    let maxEval = -Infinity;
    for (let i = 0; i < empties.length; i++) {
      const idx = empties[i];
      board[idx] = "O";
      const ev = minimaxTTT3(board, depth - 1, alpha, beta, false);
      board[idx] = null;
      if (ev > maxEval) maxEval = ev;
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < empties.length; i++) {
      const idx = empties[i];
      board[idx] = "X";
      const ev = minimaxTTT3(board, depth - 1, alpha, beta, true);
      board[idx] = null;
      if (ev < minEval) minEval = ev;
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getBestTTT3Moves(board, depth = 9) {
  const empties = getEmptyCells(board);
  if (!empties.length) return [];

  // 1. Immediate Win for O
  const winMove = findTTTImmediateThreat(board, 3, 3, "O");
  if (winMove != null) return [winMove];

  // 2. Immediate Block for X
  const blockMove = findTTTImmediateThreat(board, 3, 3, "X");
  if (blockMove != null) return [blockMove];

  // 3. Minimax + Tactical Scoring for every legal move
  const scoredMoves = [];
  for (let i = 0; i < empties.length; i++) {
    const idx = empties[i];
    board[idx] = "O";
    const score = minimaxTTT3(board, depth - 1, -Infinity, Infinity, false);

    // Positional weight: Center (55), Corners (35), Edges (10)
    let tactical = TTT3_POS_WEIGHTS[idx] || 0;

    // Fork creation bonus (creating >= 2 winning threats)
    const oThreats = countThreats(board, 3, 3, "O");
    if (oThreats >= 2) tactical += 100;
    else if (oThreats === 1) tactical += 25;

    // Fork block bonus (if X played here, would X have created a fork?)
    board[idx] = "X";
    const xThreats = countThreats(board, 3, 3, "X");
    if (xThreats >= 2) tactical += 80;
    board[idx] = null;

    scoredMoves.push({ move: idx, score, tactical });
  }

  // Filter moves with the absolute maximum minimax score (never play a losing move)
  const maxScore = Math.max(...scoredMoves.map(m => m.score));
  const optimalMoves = scoredMoves.filter(m => m.score === maxScore);

  // Among optimal moves, select highest tactical tier
  const maxTactical = Math.max(...optimalMoves.map(m => m.tactical));
  const bestCandidates = optimalMoves.filter(m => m.tactical >= maxTactical - 5);

  return bestCandidates.map(c => c.move);
}

/* ---------- 5x5 Tic-Tac-Toe Tactical Heuristic & AI ---------- */
const TTT5_CENTER_WEIGHTS = [
  1, 2, 3, 2, 1,
  2, 4, 6, 4, 2,
  3, 6, 9, 6, 3,
  2, 4, 6, 4, 2,
  1, 2, 3, 2, 1
];

// Precompute 12 full 5-cell lines across 5x5 grid for open-3 detection
const TTT5_FULL_LINES = (function() {
  const lines = [];
  // 5 Rows
  for (let r = 0; r < 5; r++) {
    lines.push([r * 5, r * 5 + 1, r * 5 + 2, r * 5 + 3, r * 5 + 4]);
  }
  // 5 Columns
  for (let c = 0; c < 5; c++) {
    lines.push([c, 5 + c, 10 + c, 15 + c, 20 + c]);
  }
  // 2 Main Diagonals
  lines.push([0, 6, 12, 18, 24]);
  lines.push([4, 8, 12, 16, 20]);
  return lines;
})();

function findTTT5OpenThree(board, piece) {
  for (let i = 0; i < TTT5_FULL_LINES.length; i++) {
    const l = TTT5_FULL_LINES[i];
    // Pattern: . P P P .
    if (!board[l[0]] && board[l[1]] === piece && board[l[2]] === piece && board[l[3]] === piece && !board[l[4]]) {
      return [l[0], l[4]];
    }
  }
  return null;
}

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
    if (o === 3) score += 2500;
    else if (o === 2) score += 180;
    else if (o === 1) score += 15;
    if (x === 3) score -= 3500;
    else if (x === 2) score -= 240;
    else if (x === 1) score -= 20;
  }

  // Open-ended 3-in-a-row detection in full 5 lines
  for (let i = 0; i < TTT5_FULL_LINES.length; i++) {
    const l = TTT5_FULL_LINES[i];
    if (!board[l[0]] && !board[l[4]]) {
      const mid = [board[l[1]], board[l[2]], board[l[3]]];
      if (mid.every(v => v === "O")) score += 25000;
      else if (mid.every(v => v === "X")) score -= 30000;
    }
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
  if (res.winner === "O") return 100000 + depth;
  if (res.winner === "X") return -100000 - depth;
  if (res.winner === "draw" || depth === 0) return evalTTT5(board);

  const candidates = getTTT5Candidates(board);
  if (maxing) {
    let maxEval = -Infinity;
    for (let i = 0; i < candidates.length; i++) {
      const idx = candidates[i];
      board[idx] = "O";
      const ev = minimaxTTT5(board, depth - 1, alpha, beta, false);
      board[idx] = null;
      if (ev > maxEval) maxEval = ev;
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < candidates.length; i++) {
      const idx = candidates[i];
      board[idx] = "X";
      const ev = minimaxTTT5(board, depth - 1, alpha, beta, true);
      board[idx] = null;
      if (ev < minEval) minEval = ev;
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getBestTTT5Moves(board, depth = 3) {
  // 1. Immediate Win for O
  const winMove = findTTTImmediateThreat(board, 5, 4, "O");
  if (winMove != null) return [winMove];

  // 2. Immediate Block for X
  const blockMove = findTTTImmediateThreat(board, 5, 4, "X");
  if (blockMove != null) return [blockMove];

  // 3. Block Open 3 for X (. X X X .)
  const open3Block = findTTT5OpenThree(board, "X");
  if (open3Block) return open3Block;

  // 4. Create Open 3 for O (. O O O .)
  const open3Win = findTTT5OpenThree(board, "O");
  if (open3Win) return open3Win;

  const candidates = getTTT5Candidates(board);
  const scored = [];
  for (let i = 0; i < candidates.length; i++) {
    const idx = candidates[i];
    board[idx] = "O";
    const score = minimaxTTT5(board, depth - 1, -Infinity, Infinity, false);
    board[idx] = null;
    scored.push({ move: idx, score: score + (TTT5_CENTER_WEIGHTS[idx] || 0) * 5 });
  }

  const maxScore = Math.max(...scored.map(s => s.score));
  const topCandidates = scored.filter(s => s.score >= maxScore - 40);
  return topCandidates.map(c => c.move);
}

function aiTTTMove() {
  if (tttOver) return;
  const empties = getEmptyCells(tttBoard);
  if (!empties.length) return;

  saveTTTSnapshot();
  const diff = hubState.difficulty || difficultySelect?.value || "medium";
  let move = empties[Math.floor(Math.random() * empties.length)];

  if (tttSize === 3) {
    if (diff === "easy") {
      const winMove = findTTTImmediateThreat(tttBoard, 3, 3, "O");
      const blockMove = findTTTImmediateThreat(tttBoard, 3, 3, "X");
      if (winMove != null && Math.random() < 0.7) {
        move = winMove;
      } else if (blockMove != null && Math.random() < 0.5) {
        move = blockMove;
      } else {
        const moves = getBestTTT3Moves(tttBoard, 2);
        if (moves.length) move = moves[Math.floor(Math.random() * moves.length)];
      }
    } else if (diff === "medium") {
      // Medium: Always wins, always blocks, depth 5 tactical search with strategic weights
      const moves = getBestTTT3Moves(tttBoard, 5);
      if (moves.length) move = moves[Math.floor(Math.random() * moves.length)];
    } else {
      // Hard: Mathematically unbeatable depth 9 minimax with fork defense/creation & dynamic variety
      const moves = getBestTTT3Moves(tttBoard, 9);
      if (moves.length) move = moves[Math.floor(Math.random() * moves.length)];
    }
  } else {
    // 5x5 Tic-Tac-Toe
    if (diff === "easy") {
      const winMove = findTTTImmediateThreat(tttBoard, 5, 4, "O");
      const blockMove = findTTTImmediateThreat(tttBoard, 5, 4, "X");
      if (winMove != null && Math.random() < 0.7) {
        move = winMove;
      } else if (blockMove != null && Math.random() < 0.5) {
        move = blockMove;
      } else {
        const moves = getBestTTT5Moves(tttBoard, 1);
        if (moves.length) move = moves[Math.floor(Math.random() * moves.length)];
      }
    } else if (diff === "medium") {
      const moves = getBestTTT5Moves(tttBoard, 2);
      if (moves.length) move = moves[Math.floor(Math.random() * moves.length)];
    } else {
      // Hard: Depth 3-4 tactical minimax with open-3, fork awareness, center control & dynamic tie-breaking
      const moves = getBestTTT5Moves(tttBoard, 3);
      if (moves.length) move = moves[Math.floor(Math.random() * moves.length)];
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
  if (winner === "X") {
    scoreA++; updateStreak(aiMode);
    showWinScreen(aiMode ? "Victory! You Win" : "Victory! X Wins");
  } else if (winner === "O") {
    scoreB++; updateStreak(false);
    showWinScreen(aiMode ? "Game Over — AI Wins" : "Victory! O Wins");
  } else {
    scoreD++;
    showDrawScreen("Stalemate — Match Draw");
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
    const curDiff = hubState.difficulty || difficultySelect?.value || "medium";
    setTimeout(aiTTTMove, curDiff === "easy" ? 220 : curDiff === "medium" ? 380 : 520);
  }
}

/* ---------- Chess Engine & Custom UI ---------- */
const CHESS_U = { wp: "ΓÖƒ", wr: "ΓÖ£", wn: "ΓÖ₧", wb: "ΓÖ¥", wq: "ΓÖ¢", wk: "ΓÖÜ", bp: "ΓÖƒ", br: "ΓÖ£", bn: "ΓÖ₧", bb: "ΓÖ¥", bq: "ΓÖ¢", bk: "ΓÖÜ" };
const PIECE_VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
let chessBoard = [], chessTurn = "w", chessSelected = null, chessOver = false, whiteCaptured = [], blackCaptured = [], chessSnapshots = [];
let chessShowMoveHints = false;
let chessEnPassant = null;
let chessHalfmoveClock = 0;
let chessPositionHistory = {};

function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function cloneBoard(b) { return b.map(row => row.map(cell => cell ? { ...cell } : null)); }

function saveChessSnapshot() {
  chessSnapshots.push({
    board: cloneBoard(chessBoard), turn: chessTurn, selected: chessSelected ? { ...chessSelected } : null,
    over: chessOver, whiteCaptured: [...whiteCaptured], blackCaptured: [...blackCaptured],
    enPassant: chessEnPassant ? { ...chessEnPassant } : null,
    halfmoveClock: chessHalfmoveClock,
    positionHistory: { ...chessPositionHistory },
    scoreA, scoreB, scoreD, streak, moveCount
  });
}

function initChess() {
  chessBoard = Array.from({ length: 8 }, () => Array(8).fill(null));
  const back = ["r", "n", "b", "q", "k", "b", "n", "r"];
  for (let c = 0; c < 8; c++) {
    chessBoard[0][c] = { color: "b", type: back[c], hasMoved: false };
    chessBoard[1][c] = { color: "b", type: "p", hasMoved: false };
    chessBoard[6][c] = { color: "w", type: "p", hasMoved: false };
    chessBoard[7][c] = { color: "w", type: back[c], hasMoved: false };
  }
  chessTurn = "w"; chessSelected = null; chessOver = false; whiteCaptured = []; blackCaptured = []; chessSnapshots = [];
  chessEnPassant = null;
  chessHalfmoveClock = 0;
  chessPositionHistory = {};
  const initKey = getChessPositionKey(chessBoard, "w", null);
  chessPositionHistory[initKey] = 1;
  moveCount = 0;
  updateMoveCounter(true);
  renderCaptured();
  renderChess();
  startTurnTimer();
}

/* ---------- Liquid Glass Vector Chess Pieces ---------- */
function getPieceSvgHtml(color, type) {
  const isWhite = color === "w";
  const pieceClass = isWhite ? "glass-piece-white" : "glass-piece-black";
  
  const paths = {
    p: `<path d="M22.5 9c-2.2 0-4 1.8-4 4 0 .9.3 1.7.8 2.4-1.9 1.1-3.3 3.2-3.3 5.6 0 2 1 3.8 2.4 5-3.4 1.1-7.4 5.6-7.4 13.5h24c0-7.9-4-12.4-7.4-13.5 1.5-1.2 2.4-3 2.4-5 0-2.4-1.3-4.5-3.3-5.6.5-.7.8-1.5.8-2.4 0-2.2-1.8-4-4-4z"/>`,
    r: `<path d="M9 39h27v-3.5H9V39zm3-5.5h21l-1.8-6.5H13.8L12 33.5zM14 25h17v-8H14v8zM11 15h23V9h-3.5v2.5h-4V9h-3v2.5h-4V9H11v6z"/>`,
    n: `<path d="M 22,10 C 32.5,11 38.5,18 38,39 L 14,39 C 14,31 19,29 20,24 C 20,24 18,24 16,25.5 C 13.5,27 12.5,29.5 10.5,29 C 9.5,28 11.5,26.5 10,26.5 C 9,26.5 8,27.5 7,26 C 6,24.5 10,17 11.5,14 C 11.5,14 13.5,12 14,10 C 13,7.5 16.5,5.5 20,6 C 20,6 20.8,7.2 21,8.5 C 21.2,9.8 22,10 22,10 Z"/><circle cx="13.5" cy="16" r="1.5" class="piece-detail-fill"/><path d="M 24,14 C 23.2,16 23.2,18 24.5,20" class="piece-detail"/><path d="M 28,18 C 27.2,20.5 28,23 30,24.5" class="piece-detail"/><path d="M 9.5,25 C 9.5,25 10.5,23.5 12,24" class="piece-detail"/>`,
    b: `<path d="M22.5 7.5c-1.1 0-2 .9-2 2 0 .4.1.8.3 1.1-2.2 1.4-4.8 4.9-4.8 9.4 0 3.8 2 6.5 4 8.5v7.5h5V28.5c2-2 4-4.7 4-8.5 0-4.5-2.6-8-4.8-9.4.2-.3.3-.7.3-1.1 0-1.1-.9-2-2-2zM11 39.5h23v-3.5H11v3.5z"/><path d="M22.5 14v7m-3.5-3.5h7" class="piece-detail" stroke-linecap="round"/>`,
    q: `<path d="M9 39.5h27v-3.5H9v3.5zm3-5.5h21l-2.2-12.5-5 8-3.3-14.5-3.3 14.5-5-8L12 34z"/><circle cx="9" cy="16" r="2"/><circle cx="15.5" cy="12.5" r="2"/><circle cx="22.5" cy="10.5" r="2"/><circle cx="29.5" cy="12.5" r="2"/><circle cx="36" cy="16" r="2"/>`,
    k: `<path d="M 9,39.5 H 36 V 36 H 9 Z M 12,36 L 13.8,31 H 31.2 L 33,36 Z M 14.5,31 C 15.5,26 17.5,23.5 18.5,21.5 H 13 C 11.5,15.5 14,11 18,11.5 C 20.5,11.8 21.8,13.5 22.5,14.5 C 23.2,13.5 24.5,11.8 27,11.5 C 31,11 33.5,15.5 32,21.5 H 26.5 C 27.5,23.5 29.5,26 30.5,31 Z"/><circle cx="16" cy="10.5" r="1.8"/><circle cx="29" cy="10.5" r="1.8"/><circle cx="22.5" cy="6.2" r="2.5"/><polygon points="22.5,2 24.5,4.6 22.5,7.2 20.5,4.6"/>`
  };

  const path = paths[type] || paths.p;
  return `<svg viewBox="0 0 45 45" class="glass-piece-svg ${pieceClass}" aria-label="${isWhite ? 'White' : 'Black'} ${type}">${path}</svg>`;
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
        const pieceSvg = getPieceSvgHtml(pieceColor, type);
        const pieceClass = pieceColor === "w" ? "white-piece" : "black-piece";
        const count = counts[type];
        return `
          <div class="captured-piece-chip" title="${count} piece(s) captured">
            <span class="chip-icon ${pieceClass}">${pieceSvg}</span>
            <span class="chip-badge">├ù${count}</span>
          </div>
        `;
      })
      .join("");
  }

  // Dynamic theme-based tray headers
  const whiteH = document.getElementById("whiteCapturedHeader");
  const blackH = document.getElementById("blackCapturedHeader");
  if (whiteH && blackH) {
    whiteH.textContent = "White Captured";
    blackH.textContent = "Black Captured";
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
  const add = (nr, nc) => {
    if (!inBounds(nr, nc)) return;
    const t = board[nr][nc];
    if (!t || t.color !== p.color) out.push({ r: nr, c: nc });
  };

  if (p.type === "p") {
    const dir = p.color === "w" ? -1 : 1;
    const start = p.color === "w" ? 6 : 1;
    if (inBounds(r + dir, c) && !board[r + dir][c]) {
      out.push({ r: r + dir, c });
      if (r === start && !board[r + 2 * dir][c]) {
        out.push({ r: r + 2 * dir, c, isDoublePawn: true });
      }
    }
    for (const dc of [-1, 1]) {
      const nr = r + dir, nc = c + dc;
      if (inBounds(nr, nc)) {
        if (board[nr][nc] && board[nr][nc].color !== p.color) {
          out.push({ r: nr, c: nc });
        } else if (!board[nr][nc] && chessEnPassant && chessEnPassant.r === nr && chessEnPassant.c === nc) {
          out.push({ r: nr, c: nc, isEnPassant: true, capR: chessEnPassant.pawnR, capC: chessEnPassant.pawnC });
        }
      }
    }
  } else if (p.type === "n") {
    const jumps = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    for (let i = 0; i < jumps.length; i++) add(r + jumps[i][0], c + jumps[i][1]);
  } else if (p.type === "k") {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr || dc) add(r + dr, c + dc);
      }
    }
    // Castling rights: King has not moved and is not in check
    if (!p.hasMoved) {
      const oppColor = p.color === "w" ? "b" : "w";
      const baseRow = p.color === "w" ? 7 : 0;
      if (r === baseRow && c === 4 && !isSquareAttacked(board, baseRow, 4, oppColor)) {
        // Kingside (O-O): f and g squares empty and not attacked; Rook at h has not moved
        const rookK = board[baseRow][7];
        if (rookK && rookK.type === "r" && rookK.color === p.color && !rookK.hasMoved) {
          if (!board[baseRow][5] && !board[baseRow][6]) {
            if (!isSquareAttacked(board, baseRow, 5, oppColor) && !isSquareAttacked(board, baseRow, 6, oppColor)) {
              out.push({ r: baseRow, c: 6, isCastle: "k", rookFr: baseRow, rookFc: 7, rookTr: baseRow, rookTc: 5 });
            }
          }
        }
        // Queenside (O-O-O): b, c, d empty; c and d not attacked; Rook at a has not moved
        const rookQ = board[baseRow][0];
        if (rookQ && rookQ.type === "r" && rookQ.color === p.color && !rookQ.hasMoved) {
          if (!board[baseRow][1] && !board[baseRow][2] && !board[baseRow][3]) {
            if (!isSquareAttacked(board, baseRow, 2, oppColor) && !isSquareAttacked(board, baseRow, 3, oppColor)) {
              out.push({ r: baseRow, c: 2, isCastle: "q", rookFr: baseRow, rookFc: 0, rookTr: baseRow, rookTc: 3 });
            }
          }
        }
      }
    }
  } else {
    const dirs = [];
    if (p.type === "b" || p.type === "q") dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    if (p.type === "r" || p.type === "q") dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);
    for (let d = 0; d < dirs.length; d++) {
      const dr = dirs[d][0], dc = dirs[d][1];
      let nr = r + dr, nc = c + dc;
      while (inBounds(nr, nc)) {
        if (!board[nr][nc]) {
          out.push({ r: nr, c: nc });
        } else {
          if (board[nr][nc].color !== p.color) out.push({ r: nr, c: nc });
          break;
        }
        nr += dr; nc += dc;
      }
    }
  }
  return out;
}

// Fast square attack detector for king safety and check detection
function isSquareAttacked(board, r, c, attackingColor) {
  // Pawns
  const pDir = attackingColor === "w" ? 1 : -1;
  for (const dc of [-1, 1]) {
    const pr = r + pDir, pc = c + dc;
    if (inBounds(pr, pc)) {
      const p = board[pr][pc];
      if (p && p.color === attackingColor && p.type === "p") return true;
    }
  }

  // Knights
  const jumps = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  for (let i = 0; i < jumps.length; i++) {
    const nr = r + jumps[i][0], nc = c + jumps[i][1];
    if (inBounds(nr, nc)) {
      const p = board[nr][nc];
      if (p && p.color === attackingColor && p.type === "n") return true;
    }
  }

  // King
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nr = r + dr, nc = c + dc;
      if (inBounds(nr, nc)) {
        const p = board[nr][nc];
        if (p && p.color === attackingColor && p.type === "k") return true;
      }
    }
  }

  // Orthogonal (Rook / Queen)
  const orthDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (let d = 0; d < orthDirs.length; d++) {
    let nr = r + orthDirs[d][0], nc = c + orthDirs[d][1];
    while (inBounds(nr, nc)) {
      const p = board[nr][nc];
      if (p) {
        if (p.color === attackingColor && (p.type === "r" || p.type === "q")) return true;
        break;
      }
      nr += orthDirs[d][0]; nc += orthDirs[d][1];
    }
  }

  // Diagonal (Bishop / Queen)
  const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  for (let d = 0; d < diagDirs.length; d++) {
    let nr = r + diagDirs[d][0], nc = c + diagDirs[d][1];
    while (inBounds(nr, nc)) {
      const p = board[nr][nc];
      if (p) {
        if (p.color === attackingColor && (p.type === "b" || p.type === "q")) return true;
        break;
      }
      nr += diagDirs[d][0]; nc += diagDirs[d][1];
    }
  }

  return false;
}

function findChessKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === "k" && p.color === color) return { r, c };
    }
  }
  return null;
}

function isKingInCheck(board, color) {
  const kPos = findChessKing(board, color);
  if (!kPos) return true;
  const oppColor = color === "w" ? "b" : "w";
  return isSquareAttacked(board, kPos.r, kPos.c, oppColor);
}

// Generate legal moves for a specific selected piece (guarantees King safety)
function getLegalMovesForPiece(board, r, c) {
  const p = board[r][c];
  if (!p) return [];
  const pms = getPseudoMoves(board, r, c);
  const legal = [];
  for (let i = 0; i < pms.length; i++) {
    const m = pms[i];
    const b2 = cloneBoard(board);
    moveChess(b2, { fr: r, fc: c, tr: m.r, tc: m.c, ...m }, false);
    if (!isKingInCheck(b2, p.color)) {
      legal.push(m);
    }
  }
  return legal;
}

// Generate all legal moves for a color, with intelligent MVV-LVA move ordering
function getLegalMovesForColor(board, color, capturesOnly = false) {
  const legal = [];
  const oppColor = color === "w" ? "b" : "w";

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.color !== color) continue;

      const pms = getPseudoMoves(board, r, c);
      for (let i = 0; i < pms.length; i++) {
        const m = pms[i];
        const target = board[m.r][m.c];
        if (capturesOnly && !target) continue;

        const b2 = cloneBoard(board);
        moveChess(b2, { fr: r, fc: c, tr: m.r, tc: m.c, ...m }, false);

        if (!isKingInCheck(b2, color)) {
          let score = 0;
          if (target) {
            // MVV-LVA: Most Valuable Victim - Least Valuable Attacker
            score = 10000 + (PIECE_VAL[target.type] || 0) * 10 - (PIECE_VAL[p.type] || 0);
          }
          if (p.type === "p" && (m.r === 0 || m.r === 7)) score += 8000;
          if (m.isCastle) score += 2500;
          if (isKingInCheck(b2, oppColor)) score += 1500;
          if ((m.r === 3 || m.r === 4) && (m.c === 3 || m.c === 4)) score += 200;

          legal.push({ fr: r, fc: c, tr: m.r, tc: m.c, ...m, score });
        }
      }
    }
  }

  legal.sort((a, b) => b.score - a.score);
  return legal;
}

function allMovesForColor(board, color) {
  return getLegalMovesForColor(board, color, false);
}

function renderChess() {
  resetIdleWatchdog();
  showOnlyActiveGame("chess");
  clearWinLine();

  if (!chessBoardEl || !Array.isArray(chessBoard) || !chessBoard.length) return;
  chessBoardEl.innerHTML = "";

  // Precompute genuine legal moves for selected piece only if move hints are enabled
  const legalMoveSet = new Set();
  const captureMoveSet = new Set();
  if (chessShowMoveHints && chessSelected && inBounds(chessSelected.r, chessSelected.c)) {
    const legalMoves = getLegalMovesForPiece(chessBoard, chessSelected.r, chessSelected.c);
    legalMoves.forEach(m => {
      const key = m.r + "," + m.c;
      legalMoveSet.add(key);
      const targetPiece = chessBoard[m.r][m.c];
      if (targetPiece && targetPiece.color !== chessTurn) {
        captureMoveSet.add(key);
      }
    });
  }

  const whiteInCheck = isKingInCheck(chessBoard, "w");
  const blackInCheck = isKingInCheck(chessBoard, "b");

  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "chess-cell " + (((r + c) % 2 === 0) ? "light" : "dark");
    cell.dataset.row = r;
    cell.dataset.col = c;
    const colName = String.fromCharCode(97 + c);
    const rowName = (8 - r).toString();
    const squareName = colName + rowName;

    const isSelected = !!(chessSelected && chessSelected.r === r && chessSelected.c === c);
    if (isSelected) cell.classList.add("selected");

    const cellKey = r + "," + c;
    if (chessShowMoveHints && legalMoveSet.has(cellKey)) {
      if (captureMoveSet.has(cellKey)) {
        cell.classList.add("capture-target");
      } else {
        cell.classList.add("valid-target");
      }
    }

    const p = chessBoard[r][c];
    if (p) {
      cell.innerHTML = getPieceSvgHtml(p.color, p.type);
      cell.classList.add(p.color === "w" ? "white-piece" : "black-piece");
      cell.setAttribute("aria-label", (p.color === 'w' ? 'White' : 'Black') + " " + p.type.toUpperCase() + " at " + squareName);

      // Check Indicator: highlight king when in check
      if (p.type === "k" && ((p.color === "w" && whiteInCheck) || (p.color === "b" && blackInCheck))) {
        cell.classList.add("in-check");
      }
    } else {
      cell.setAttribute("aria-label", "Square " + squareName);
    }

    cell.addEventListener("pointerdown", (e) => e.stopPropagation());
    cell.addEventListener("click", (e) => {
      e.stopPropagation();
      onChessClick(r, c);
    });
    chessBoardEl.appendChild(cell);
  }

  if (hubState.timer === "off" && statusPill) {
    const activeInCheck = (chessTurn === "w" && whiteInCheck) || (chessTurn === "b" && blackInCheck);
    if (chessOver) {
      statusPill.textContent = "Game Over";
    } else if (activeInCheck) {
      statusPill.textContent = "ΓÜá∩╕Å " + (chessTurn === "w" ? "White" : "Black") + " in Check!";
    } else {
      statusPill.textContent = (chessTurn === "w" ? "White" : "Black") + "'s Turn";
    }
  }
}

function moveChess(board, mv, real = false) {
  const piece = board[mv.fr][mv.fc];
  const target = board[mv.tr][mv.tc];
  const isPawn = piece && piece.type === "p";
  let isCap = Boolean(target);

  // En Passant capture execution
  if (mv.isEnPassant && mv.capR !== undefined && mv.capC !== undefined) {
    const epTarget = board[mv.capR][mv.capC];
    if (epTarget && real) {
      if (epTarget.color === "w") whiteCaptured.push(epTarget);
      else blackCaptured.push(epTarget);
      renderCaptured();
    }
    board[mv.capR][mv.capC] = null;
    isCap = true;
  } else if (target && real) {
    if (target.color === "w") whiteCaptured.push(target);
    else blackCaptured.push(target);
    renderCaptured();
  }

  // Castling Rook move execution
  if (mv.isCastle && mv.rookFr !== undefined && mv.rookFc !== undefined) {
    const rook = board[mv.rookFr][mv.rookFc];
    board[mv.rookTr][mv.rookTc] = rook;
    board[mv.rookFr][mv.rookFc] = null;
    if (rook) rook.hasMoved = true;
  }

  board[mv.tr][mv.tc] = piece;
  board[mv.fr][mv.fc] = null;

  if (piece) {
    piece.hasMoved = true;
    if (piece.type === "p" && (mv.tr === 0 || mv.tr === 7)) {
      piece.type = "q";
    }
  }

  if (real) {
    // Update En Passant double-step target
    if (mv.isDoublePawn) {
      const epRow = (mv.fr + mv.tr) / 2;
      chessEnPassant = { r: epRow, c: mv.fc, pawnR: mv.tr, pawnC: mv.tc };
    } else {
      chessEnPassant = null;
    }

    // Fifty-Move rule clock
    if (isPawn || isCap) {
      chessHalfmoveClock = 0;
    } else {
      chessHalfmoveClock++;
    }

    // Threefold repetition board hashing
    const posKey = getChessPositionKey(board, chessTurn === "w" ? "b" : "w", chessEnPassant);
    chessPositionHistory[posKey] = (chessPositionHistory[posKey] || 0) + 1;
  }
}

/* ---------- Chess Positional Tables (PST) & Move Ordering ---------- */
const PST_W = {
  p: [
    [  0,  0,  0,  0,  0,  0,  0,  0],
    [ 50, 50, 50, 50, 50, 50, 50, 50],
    [ 10, 10, 20, 30, 30, 20, 10, 10],
    [  5,  5, 10, 27, 27, 10,  5,  5],
    [  0,  0,  0, 25, 25,  0,  0,  0],
    [  5, -5,-10,  0,  0,-10, -5,  5],
    [  5, 10, 10,-20,-20, 10, 10,  5],
    [  0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 20, 25, 25, 20,  0,-30],
    [-30,  5, 20, 25, 25, 20,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-10, 10, 10, 15, 15, 10, 10,-10],
    [-10,  0, 15, 20, 20, 15,  0,-10],
    [-10,  5, 15, 20, 20, 15,  5,-10],
    [-10,  0, 10, 15, 15, 10,  0,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [  0,  0,  0,  5,  5,  0,  0,  0],
    [ 25, 25, 25, 25, 25, 25, 25, 25],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [  5, 10, 10, 10, 10, 10, 10,  5],
    [  0,  0,  0,  5,  5,  0,  0,  0]
  ],
  q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [  0,  0,  5, 10, 10,  5,  0, -5],
    [ -5,  0,  5, 10, 10,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
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
  return moves;
}

// Full evaluation function (Positive = Black advantage, Negative = White advantage)
function evalChess(board) {
  let score = 0;
  let whiteMaterial = 0, blackMaterial = 0;
  let whiteBishops = 0, blackBishops = 0;
  let hasWhiteKing = false, hasBlackKing = false;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const base = PIECE_VAL[p.type] || 0;
      const pst = PST_W[p.type] ? (p.color === "w" ? PST_W[p.type][r][c] : PST_W[p.type][7 - r][c]) : 0;
      const total = base + pst;
      if (p.color === "b") {
        score += total;
        blackMaterial += base;
        if (p.type === "b") blackBishops++;
        if (p.type === "k") hasBlackKing = true;
      } else {
        score -= total;
        whiteMaterial += base;
        if (p.type === "b") whiteBishops++;
        if (p.type === "k") hasWhiteKing = true;
      }
    }
  }

  if (!hasBlackKing) return -50000;
  if (!hasWhiteKing) return 50000;

  // Bishop pair bonuses
  if (blackBishops >= 2) score += 35;
  if (whiteBishops >= 2) score -= 35;

  // King check bonuses
  if (isKingInCheck(board, "w")) score += 40;
  if (isKingInCheck(board, "b")) score -= 40;

  return score;
}

// Quiescence Search: resolves all tactical captures up to 4 plies deep to eliminate horizon effect
function quiescenceChess(board, alpha, beta, maxing, qdepth = 0) {
  const standPat = evalChess(board);
  if (qdepth >= 4) return standPat;

  if (maxing) {
    if (standPat >= beta) return beta;
    if (standPat > alpha) alpha = standPat;

    const captures = getLegalMovesForColor(board, "b", true);
    for (let i = 0; i < captures.length; i++) {
      const mv = captures[i];
      const b2 = cloneBoard(board);
      moveChess(b2, mv, false);
      const score = quiescenceChess(b2, alpha, beta, false, qdepth + 1);
      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  } else {
    if (standPat <= alpha) return alpha;
    if (standPat < beta) beta = standPat;

    const captures = getLegalMovesForColor(board, "w", true);
    for (let i = 0; i < captures.length; i++) {
      const mv = captures[i];
      const b2 = cloneBoard(board);
      moveChess(b2, mv, false);
      const score = quiescenceChess(b2, alpha, beta, true, qdepth + 1);
      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
    return beta;
  }
}

// Full Minimax with Alpha-Beta Pruning, Quiescence Search, and Checkmate Evaluation
function minimaxChess(board, depth, alpha, beta, maxing) {
  if (depth === 0) {
    return { score: quiescenceChess(board, alpha, beta, maxing, 0), move: null };
  }

  const color = maxing ? "b" : "w";
  const legalMoves = getLegalMovesForColor(board, color, false);

  if (legalMoves.length === 0) {
    if (isKingInCheck(board, color)) {
      // Checkmate! Heavily reward earliest checkmates
      return { score: maxing ? (-40000 - depth) : (40000 + depth), move: null };
    }
    // Stalemate
    return { score: 0, move: null };
  }

  let bestMove = legalMoves[0];

  if (maxing) {
    let bestScore = -Infinity;
    for (let i = 0; i < legalMoves.length; i++) {
      const mv = legalMoves[i];
      const b2 = cloneBoard(board);
      moveChess(b2, mv, false);

      const r = minimaxChess(b2, depth - 1, alpha, beta, false);
      if (r.score > bestScore) {
        bestScore = r.score;
        bestMove = mv;
      }
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break; // Alpha-beta cutoff
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < legalMoves.length; i++) {
      const mv = legalMoves[i];
      const b2 = cloneBoard(board);
      moveChess(b2, mv, false);

      const r = minimaxChess(b2, depth - 1, alpha, beta, true);
      if (r.score < bestScore) {
        bestScore = r.score;
        bestMove = mv;
      }
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break; // Alpha-beta cutoff
    }
    return { score: bestScore, move: bestMove };
  }
}

// Calibrated AI Move Selector based on selected Difficulty
function chooseChessAiMove(board, difficulty) {
  const legalMoves = getLegalMovesForColor(board, "b", false);
  if (!legalMoves.length) return null;

  if (difficulty === "easy") {
    // Easy: Depth 2, 25% chance of picking a sound 2nd or 3rd best move for natural casual play
    const res = minimaxChess(board, 2, -Infinity, Infinity, true);
    if (Math.random() < 0.25 && legalMoves.length > 2) {
      return legalMoves[Math.floor(Math.random() * Math.min(3, legalMoves.length))];
    }
    return res.move || legalMoves[0];
  } else if (difficulty === "medium") {
    // Medium: Solid club level - Depth 3 + Quiescence search
    const res = minimaxChess(board, 3, -Infinity, Infinity, true);
    return res.move || legalMoves[0];
  } else {
    // Hard: Strong tournament level - Depth 4 + Quiescence search
    const res = minimaxChess(board, 4, -Infinity, Infinity, true);
    return res.move || legalMoves[0];
  }
}

function getChessPositionKey(board, turn, ep) {
  let str = turn + "|";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) str += `${p.color}${p.type}${p.hasMoved ? "1" : "0"}`;
      else str += ".";
    }
  }
  if (ep) str += `|${ep.r},${ep.c}`;
  return str;
}

function checkChessDrawCondition(board, nextColor) {
  // 1. Fifty-Move Rule (100 half-moves without pawn move or capture)
  if (chessHalfmoveClock >= 100) {
    return "50-Move Rule";
  }

  // 2. Threefold Repetition (exact board position occurs 3 times)
  const currentKey = getChessPositionKey(board, nextColor, chessEnPassant);
  if ((chessPositionHistory[currentKey] || 0) >= 3) {
    return "Threefold Repetition";
  }

  // 3. Insufficient Material (FIDE)
  let whitePieces = [], blackPieces = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) {
        if (p.color === "w") whitePieces.push({ ...p, r, c });
        else blackPieces.push({ ...p, r, c });
      }
    }
  }

  const whiteNonKings = whitePieces.filter(p => p.type !== "k");
  const blackNonKings = blackPieces.filter(p => p.type !== "k");

  // King vs King
  if (whiteNonKings.length === 0 && blackNonKings.length === 0) {
    return "Insufficient Material";
  }
  // King + Bishop vs King OR King + Knight vs King
  if ((whiteNonKings.length === 1 && (whiteNonKings[0].type === "b" || whiteNonKings[0].type === "n") && blackNonKings.length === 0) ||
      (blackNonKings.length === 1 && (blackNonKings[0].type === "b" || blackNonKings[0].type === "n") && whiteNonKings.length === 0)) {
    return "Insufficient Material";
  }
  // King + Bishop vs King + Bishop on the same color square
  if (whiteNonKings.length === 1 && whiteNonKings[0].type === "b" &&
      blackNonKings.length === 1 && blackNonKings[0].type === "b") {
    const wSquareColor = (whiteNonKings[0].r + whiteNonKings[0].c) % 2;
    const bSquareColor = (blackNonKings[0].r + blackNonKings[0].c) % 2;
    if (wSquareColor === bSquareColor) {
      return "Insufficient Material";
    }
  }

  return null;
}

function handleChessDraw(reason) {
  chessOver = true;
  scoreD++;
  stopTurnTimer();
  persistScores();
  renderScores();
  renderChess();
  persistLiveState();
  let drawTxt = reason + " (Draw)";
  showDrawScreen(drawTxt);
}

function onChessClick(r, c) {
  const aiMode = (hubState.opponent === "ai") || (modeSelect && modeSelect.value === "chess-ai");
  if (chessOver) return;
  if (aiMode && chessTurn === "b") return;

  resetIdleWatchdog();
  const p = chessBoard[r][c];

  // Deselect if player clicks the currently selected piece again
  if (chessSelected && chessSelected.r === r && chessSelected.c === c) {
    chessSelected = null;
    renderChess();
    return;
  }

  if (!chessSelected) {
    if (p && p.color === chessTurn) chessSelected = { r, c };
    renderChess();
    return;
  }

  // Strictly enforce genuine legal chess moves that protect the King
  const legalMoves = getLegalMovesForPiece(chessBoard, chessSelected.r, chessSelected.c);
  const legal = legalMoves.find(m => m.r === r && m.c === c);
  if (!legal) {
    chessSelected = (p && p.color === chessTurn) ? { r, c } : null;
    renderChess();
    return;
  }

  saveChessSnapshot();
  moveChess(chessBoard, { fr: chessSelected.r, fc: chessSelected.c, tr: r, tc: c, ...legal }, true);
  moveCount++;
  updateMoveCounter(true);

  const nextColor = chessTurn === "w" ? "b" : "w";

  // Checkmate / Stalemate detection after Human move
  const afterLegalMoves = getLegalMovesForColor(chessBoard, nextColor);
  if (afterLegalMoves.length === 0) {
    if (isKingInCheck(chessBoard, nextColor)) {
      // Checkmate! White wins!
      chessOver = true;
      scoreA++;
      updateStreak(modeSelect.value === "chess-ai");
      let winTxt = "Checkmate! White Wins";
      showWinScreen(winTxt);
      persistScores(); renderScores(); renderChess(); stopTurnTimer(); persistLiveState();
      return;
    } else {
      handleChessDraw("Stalemate");
      return;
    }
  }

  const humanDraw = checkChessDrawCondition(chessBoard, nextColor);
  if (humanDraw) {
    handleChessDraw(humanDraw);
    return;
  }

  chessSelected = null;
  chessTurn = nextColor;
  renderChess();
  startTurnTimer();
  persistLiveState();

  // AI Turn Execution
  if (aiMode && chessTurn === "b" && !chessOver) {
    if (hubState.timer === "off" && statusPill) statusPill.textContent = "AI Thinking...";
    setTimeout(() => {
      saveChessSnapshot();
      const diff = hubState.difficulty || difficultySelect?.value || "medium";
      const mv = chooseChessAiMove(chessBoard, diff);

      if (mv) {
        moveChess(chessBoard, mv, true);
        moveCount++;
        updateMoveCounter(true);

        // Checkmate / Stalemate detection after AI move
        const afterAiLegalMoves = getLegalMovesForColor(chessBoard, "w");
        if (afterAiLegalMoves.length === 0) {
          if (isKingInCheck(chessBoard, "w")) {
            // Checkmate! Black AI wins!
            chessOver = true;
            scoreB++;
            updateStreak(false);
            let winTxt = "Checkmate! Black Wins";
            showWinScreen(winTxt);
            persistScores(); renderScores(); renderChess(); stopTurnTimer(); persistLiveState();
            return;
          } else {
            handleChessDraw("Stalemate");
            return;
          }
        }

        const aiDraw = checkChessDrawCondition(chessBoard, "w");
        if (aiDraw) {
          handleChessDraw(aiDraw);
          return;
        }

        chessTurn = "w";
      }
      renderChess();
      startTurnTimer();
      persistLiveState();
    }, 380);
  }
}


/* ==========================================================================
   AUTHENTIC WORDLE ENGINE (Josh Wardle Powerlanguage Fidelity)
   ========================================================================== */

// Official Josh Wardle Wordle Epoch: June 19, 2021
const WORDLE_EPOCH = new Date(2021, 5, 19, 0, 0, 0, 0);

// Fallback lists if data/wordle-words.js is delayed
// Full 2,315 curated official Wordle target answers embedded directly to guarantee 100% offline availability
const WORDLE_BASE_ANSWERS = ["ABACK","ABASE","ABATE","ABBEY","ABBOT","ABHOR","ABIDE","ABLED","ABODE","ABORT","ABOUT","ABOVE","ABUSE","ABYSS","ACORN","ACRID","ACTOR","ACUTE","ADAGE","ADAPT","ADEPT","ADMIN","ADMIT","ADOBE","ADOPT","ADORE","ADORN","ADULT","AFFIX","AFIRE","AFOOT","AFOUL","AFTER","AGAIN","AGAPE","AGATE","AGENT","AGILE","AGING","AGLOW","AGONY","AGORA","AGREE","AHEAD","AIDER","AISLE","ALARM","ALBUM","ALERT","ALGAE","ALIBI","ALIEN","ALIGN","ALIKE","ALIVE","ALLAY","ALLEY","ALLOT","ALLOW","ALLOY","ALOFT","ALONE","ALONG","ALOOF","ALOUD","ALPHA","ALTAR","ALTER","AMASS","AMAZE","AMBER","AMBLE","AMEND","AMISS","AMITY","AMONG","AMPLE","AMPLY","AMUSE","ANGEL","ANGER","ANGLE","ANGRY","ANGST","ANIME","ANKLE","ANNEX","ANNOY","ANNUL","ANODE","ANTIC","ANVIL","AORTA","APART","APHID","APING","APNEA","APPLE","APPLY","APRON","APTLY","ARBOR","ARDOR","ARENA","ARGUE","ARISE","ARMOR","AROMA","AROSE","ARRAY","ARROW","ARSON","ARTSY","ASCOT","ASHEN","ASIDE","ASKEW","ASSAY","ASSET","ATOLL","ATONE","ATTIC","AUDIO","AUDIT","AUGUR","AUNTY","AVAIL","AVERT","AVIAN","AVOID","AWAIT","AWAKE","AWARD","AWARE","AWASH","AWFUL","AWOKE","AXIAL","AXIOM","AXION","AZURE","BACON","BADGE","BADLY","BAGEL","BAGGY","BAKER","BALER","BALMY","BANAL","BANJO","BARGE","BARON","BASAL","BASIC","BASIL","BASIN","BASIS","BASTE","BATCH","BATHE","BATON","BATTY","BAWDY","BAYOU","BEACH","BEADY","BEARD","BEAST","BEECH","BEEFY","BEFIT","BEGAN","BEGAT","BEGET","BEGIN","BEGUN","BEING","BELCH","BELIE","BELLE","BELLY","BELOW","BENCH","BERET","BERRY","BERTH","BESET","BETEL","BEVEL","BEZEL","BIBLE","BICEP","BIDDY","BIGOT","BILGE","BILLY","BINGE","BINGO","BIOME","BIRCH","BIRTH","BISON","BITTY","BLACK","BLADE","BLAME","BLAND","BLANK","BLARE","BLAST","BLAZE","BLEAK","BLEAT","BLEED","BLEEP","BLEND","BLESS","BLIMP","BLIND","BLINK","BLISS","BLITZ","BLOAT","BLOCK","BLOKE","BLOND","BLOOD","BLOOM","BLOWN","BLUER","BLUFF","BLUNT","BLURB","BLURT","BLUSH","BOARD","BOAST","BOBBY","BONEY","BONGO","BONUS","BOOBY","BOOST","BOOTH","BOOTY","BOOZE","BOOZY","BORAX","BORNE","BOSOM","BOSSY","BOTCH","BOUGH","BOULE","BOUND","BOWEL","BOXER","BRACE","BRAID","BRAIN","BRAKE","BRAND","BRASH","BRASS","BRAVE","BRAVO","BRAWL","BRAWN","BREAD","BREAK","BREED","BRIAR","BRIBE","BRICK","BRIDE","BRIEF","BRINE","BRING","BRINK","BRINY","BRISK","BROAD","BROIL","BROKE","BROOD","BROOK","BROOM","BROTH","BROWN","BRUNT","BRUSH","BRUTE","BUDDY","BUDGE","BUGGY","BUGLE","BUILD","BUILT","BULGE","BULKY","BULLY","BUNCH","BUNNY","BURLY","BURNT","BURST","BUSED","BUSHY","BUTCH","BUTTE","BUXOM","BUYER","BYLAW","CABAL","CABBY","CABIN","CABLE","CACAO","CACHE","CACTI","CADDY","CADET","CAGEY","CAIRN","CAMEL","CAMEO","CANAL","CANDY","CANNY","CANOE","CANON","CAPER","CAPUT","CARAT","CARGO","CAROL","CARRY","CARVE","CASTE","CATCH","CATER","CATTY","CAULK","CAUSE","CAVIL","CEASE","CEDAR","CELLO","CHAFE","CHAFF","CHAIN","CHAIR","CHALK","CHAMP","CHANT","CHAOS","CHARD","CHARM","CHART","CHASE","CHASM","CHEAP","CHEAT","CHECK","CHEEK","CHEER","CHESS","CHEST","CHICK","CHIDE","CHIEF","CHILD","CHILI","CHILL","CHIME","CHINA","CHIRP","CHOCK","CHOIR","CHOKE","CHORD","CHORE","CHOSE","CHUCK","CHUMP","CHUNK","CHURN","CHUTE","CIDER","CIGAR","CINCH","CIRCA","CIVIC","CIVIL","CLACK","CLAIM","CLAMP","CLANG","CLANK","CLASH","CLASP","CLASS","CLEAN","CLEAR","CLEAT","CLEFT","CLERK","CLICK","CLIFF","CLIMB","CLING","CLINK","CLOAK","CLOCK","CLONE","CLOSE","CLOTH","CLOUD","CLOUT","CLOVE","CLOWN","CLUCK","CLUED","CLUMP","CLUNG","COACH","COAST","COBRA","COCOA","COLON","COLOR","COMET","COMFY","COMIC","COMMA","CONCH","CONDO","CONIC","COPSE","CORAL","CORER","CORNY","COUCH","COUGH","COULD","COUNT","COUPE","COURT","COVEN","COVER","COVET","COVEY","COWER","COYLY","CRACK","CRAFT","CRAMP","CRANE","CRANK","CRASH","CRASS","CRATE","CRAVE","CRAWL","CRAZE","CRAZY","CREAK","CREAM","CREDO","CREED","CREEK","CREEP","CREME","CREPE","CREPT","CRESS","CREST","CRICK","CRIED","CRIER","CRIME","CRIMP","CRISP","CROAK","CROCK","CRONE","CRONY","CROOK","CROSS","CROUP","CROWD","CROWN","CRUDE","CRUEL","CRUMB","CRUMP","CRUSH","CRUST","CRYPT","CUBIC","CUMIN","CURIO","CURLY","CURRY","CURSE","CURVE","CURVY","CUTIE","CYBER","CYCLE","CYNIC","DADDY","DAILY","DAIRY","DAISY","DALLY","DANCE","DANDY","DATUM","DAUNT","DEALT","DEATH","DEBAR","DEBIT","DEBUG","DEBUT","DECAL","DECAY","DECOR","DECOY","DECRY","DEFER","DEIGN","DEITY","DELAY","DELTA","DELVE","DEMON","DEMUR","DENIM","DENSE","DEPOT","DEPTH","DERBY","DETER","DETOX","DEUCE","DEVIL","DIARY","DICEY","DIGIT","DILLY","DIMLY","DINER","DINGO","DINGY","DIODE","DIRGE","DIRTY","DISCO","DITCH","DITTO","DITTY","DIVER","DIZZY","DODGE","DODGY","DOGMA","DOING","DOLLY","DONOR","DONUT","DOPEY","DOUBT","DOUGH","DOWDY","DOWEL","DOWNY","DOWRY","DOZEN","DRAFT","DRAIN","DRAKE","DRAMA","DRANK","DRAPE","DRAWL","DRAWN","DREAD","DREAM","DRESS","DRIED","DRIER","DRIFT","DRILL","DRINK","DRIVE","DROIT","DROLL","DRONE","DROOL","DROOP","DROSS","DROVE","DROWN","DRUID","DRUNK","DRYER","DRYLY","DUCHY","DULLY","DUMMY","DUMPY","DUNCE","DUSKY","DUSTY","DUTCH","DUVET","DWARF","DWELL","DWELT","DYING","EAGER","EAGLE","EARLY","EARTH","EASEL","EATEN","EATER","EBONY","ECLAT","EDICT","EDIFY","EERIE","EGRET","EIGHT","EJECT","EKING","ELATE","ELBOW","ELDER","ELECT","ELEGY","ELFIN","ELIDE","ELITE","ELOPE","ELUDE","EMAIL","EMBED","EMBER","EMCEE","EMPTY","ENACT","ENDOW","ENEMA","ENEMY","ENJOY","ENNUI","ENSUE","ENTER","ENTRY","ENVOY","EPOCH","EPOXY","EQUAL","EQUIP","ERASE","ERECT","ERODE","ERROR","ERUPT","ESSAY","ESTER","ETHER","ETHIC","ETHOS","ETUDE","EVADE","EVENT","EVERY","EVICT","EVOKE","EXACT","EXALT","EXCEL","EXERT","EXILE","EXIST","EXPEL","EXTOL","EXTRA","EXULT","EYING","FABLE","FACET","FAINT","FAIRY","FAITH","FALSE","FANCY","FANNY","FARCE","FATAL","FATTY","FAULT","FAUNA","FAVOR","FEAST","FECAL","FEIGN","FELLA","FELON","FEMME","FEMUR","FENCE","FERAL","FERRY","FETAL","FETCH","FETID","FETUS","FEVER","FEWER","FIBER","FIBRE","FICUS","FIELD","FIEND","FIERY","FIFTH","FIFTY","FIGHT","FILER","FILET","FILLY","FILMY","FILTH","FINAL","FINCH","FINER","FIRST","FISHY","FIXER","FIZZY","FJORD","FLACK","FLAIL","FLAIR","FLAKE","FLAKY","FLAME","FLANK","FLARE","FLASH","FLASK","FLECK","FLEET","FLESH","FLICK","FLIER","FLING","FLINT","FLIRT","FLOAT","FLOCK","FLOOD","FLOOR","FLORA","FLOSS","FLOUR","FLOUT","FLOWN","FLUFF","FLUID","FLUKE","FLUME","FLUNG","FLUNK","FLUSH","FLUTE","FLYER","FOAMY","FOCAL","FOCUS","FOGGY","FOIST","FOLIO","FOLLY","FORAY","FORCE","FORGE","FORGO","FORTE","FORTH","FORTY","FORUM","FOUND","FOYER","FRAIL","FRAME","FRANK","FRAUD","FREAK","FREED","FREER","FRESH","FRIAR","FRIED","FRILL","FRISK","FRITZ","FROCK","FROND","FRONT","FROST","FROTH","FROWN","FROZE","FRUIT","FUDGE","FUGUE","FULLY","FUNGI","FUNKY","FUNNY","FUROR","FURRY","FUSSY","FUZZY","GAFFE","GAILY","GAMER","GAMMA","GAMUT","GASSY","GAUDY","GAUGE","GAUNT","GAUZE","GAVEL","GAWKY","GAYER","GAYLY","GAZER","GECKO","GEEKY","GEESE","GENIE","GENRE","GHOST","GHOUL","GIANT","GIDDY","GIPSY","GIRLY","GIRTH","GIVEN","GIVER","GLADE","GLAND","GLARE","GLASS","GLAZE","GLEAM","GLEAN","GLIDE","GLINT","GLOAT","GLOBE","GLOOM","GLORY","GLOSS","GLOVE","GLYPH","GNASH","GNOME","GODLY","GOING","GOLEM","GOLLY","GONAD","GONER","GOODY","GOOEY","GOOFY","GOOSE","GORGE","GOUGE","GOURD","GRACE","GRADE","GRAFT","GRAIL","GRAIN","GRAND","GRANT","GRAPE","GRAPH","GRASP","GRASS","GRATE","GRAVE","GRAVY","GRAZE","GREAT","GREED","GREEN","GREET","GRIEF","GRILL","GRIME","GRIMY","GRIND","GRIPE","GROAN","GROIN","GROOM","GROPE","GROSS","GROUP","GROUT","GROVE","GROWL","GROWN","GRUEL","GRUFF","GRUNT","GUARD","GUAVA","GUESS","GUEST","GUIDE","GUILD","GUILE","GUILT","GUISE","GULCH","GULLY","GUMBO","GUMMY","GUPPY","GUSTO","GUSTY","GYPSY","HABIT","HAIRY","HALVE","HANDY","HAPPY","HARDY","HAREM","HARPY","HARRY","HARSH","HASTE","HASTY","HATCH","HATER","HAUNT","HAUTE","HAVEN","HAVOC","HAZEL","HEADY","HEARD","HEART","HEATH","HEAVE","HEAVY","HEDGE","HEFTY","HEIST","HELIX","HELLO","HENCE","HERON","HILLY","HINGE","HIPPO","HIPPY","HITCH","HOARD","HOBBY","HOIST","HOLLY","HOMER","HONEY","HONOR","HORDE","HORNY","HORSE","HOTEL","HOTLY","HOUND","HOUSE","HOVEL","HOVER","HOWDY","HUMAN","HUMID","HUMOR","HUMPH","HUMUS","HUNCH","HUNKY","HURRY","HUSKY","HUSSY","HUTCH","HYDRO","HYENA","HYMEN","HYPER","ICILY","ICING","IDEAL","IDIOM","IDIOT","IDLER","IDYLL","IGLOO","ILIAC","IMAGE","IMBUE","IMPEL","IMPLY","INANE","INBOX","INCUR","INDEX","INEPT","INERT","INFER","INGOT","INLAY","INLET","INNER","INPUT","INTER","INTRO","IONIC","IRATE","IRONY","ISLET","ISSUE","ITCHY","IVORY","JAUNT","JAZZY","JELLY","JERKY","JETTY","JEWEL","JIFFY","JOINT","JOIST","JOKER","JOLLY","JOUST","JUDGE","JUICE","JUICY","JUMBO","JUMPY","JUNTA","JUNTO","JUROR","KAPPA","KARMA","KAYAK","KEBAB","KHAKI","KINKY","KIOSK","KITTY","KNACK","KNAVE","KNEAD","KNEED","KNEEL","KNELT","KNIFE","KNOCK","KNOLL","KNOWN","KOALA","KRILL","LABEL","LABOR","LADEN","LADLE","LAGER","LANCE","LANKY","LAPEL","LAPSE","LARGE","LARVA","LASSO","LATCH","LATER","LATHE","LATTE","LAUGH","LAYER","LEACH","LEAFY","LEAKY","LEANT","LEAPT","LEARN","LEASE","LEASH","LEAST","LEAVE","LEDGE","LEECH","LEERY","LEFTY","LEGAL","LEGGY","LEMON","LEMUR","LEPER","LEVEL","LEVER","LIBEL","LIEGE","LIGHT","LIKEN","LILAC","LIMBO","LIMIT","LINEN","LINER","LINGO","LIPID","LITHE","LIVER","LIVID","LLAMA","LOAMY","LOATH","LOBBY","LOCAL","LOCUS","LODGE","LOFTY","LOGIC","LOGIN","LOOPY","LOOSE","LORRY","LOSER","LOUSE","LOUSY","LOVER","LOWER","LOWLY","LOYAL","LUCID","LUCKY","LUMEN","LUMPY","LUNAR","LUNCH","LUNGE","LUPUS","LURCH","LURID","LUSTY","LYING","LYMPH","LYNCH","LYRIC","MACAW","MACHO","MACRO","MADAM","MADLY","MAFIA","MAGIC","MAGMA","MAIZE","MAJOR","MAKER","MAMBO","MAMMA","MAMMY","MANGA","MANGE","MANGO","MANGY","MANIA","MANIC","MANLY","MANOR","MAPLE","MARCH","MARRY","MARSH","MASON","MASSE","MATCH","MATEY","MAUVE","MAXIM","MAYBE","MAYOR","MEALY","MEANT","MEATY","MECCA","MEDAL","MEDIA","MEDIC","MELEE","MELON","MERCY","MERGE","MERIT","MERRY","METAL","METER","METRO","MICRO","MIDGE","MIDST","MIGHT","MILKY","MIMIC","MINCE","MINER","MINIM","MINOR","MINTY","MINUS","MIRTH","MISER","MISSY","MOCHA","MODAL","MODEL","MODEM","MOGUL","MOIST","MOLAR","MOLDY","MONEY","MONTH","MOODY","MOOSE","MORAL","MORON","MORPH","MOSSY","MOTEL","MOTIF","MOTOR","MOTTO","MOULT","MOUND","MOUNT","MOURN","MOUSE","MOUTH","MOVER","MOVIE","MOWER","MUCKY","MUCUS","MUDDY","MULCH","MUMMY","MUNCH","MURAL","MURKY","MUSHY","MUSIC","MUSKY","MUSTY","MYRRH","NADIR","NAIVE","NANNY","NASAL","NASTY","NATAL","NAVAL","NAVEL","NEEDY","NEIGH","NERDY","NERVE","NEVER","NEWER","NEWLY","NICER","NICHE","NIECE","NIGHT","NINJA","NINNY","NINTH","NOBLE","NOBLY","NOISE","NOISY","NOMAD","NOOSE","NORTH","NOSEY","NOTCH","NOVEL","NUDGE","NURSE","NUTTY","NYLON","NYMPH","OAKEN","OBESE","OCCUR","OCEAN","OCTAL","OCTET","ODDER","ODDLY","OFFAL","OFFER","OFTEN","OLDEN","OLDER","OLIVE","OMBRE","OMEGA","ONION","ONSET","OPERA","OPINE","OPIUM","OPTIC","ORBIT","ORDER","ORGAN","OTHER","OTTER","OUGHT","OUNCE","OUTDO","OUTER","OUTGO","OVARY","OVATE","OVERT","OVINE","OVOID","OWING","OWNER","OXIDE","OZONE","PADDY","PAGAN","PAINT","PALER","PALSY","PANEL","PANIC","PANSY","PAPAL","PAPER","PARER","PARKA","PARRY","PARSE","PARTY","PASTA","PASTE","PASTY","PATCH","PATIO","PATSY","PATTY","PAUSE","PAYEE","PAYER","PEACE","PEACH","PEARL","PECAN","PEDAL","PENAL","PENCE","PENNE","PENNY","PERCH","PERIL","PERKY","PESKY","PESTO","PETAL","PETTY","PHASE","PHONE","PHONY","PHOTO","PIANO","PICKY","PIECE","PIETY","PIGGY","PILOT","PINCH","PINEY","PINKY","PINTO","PIPER","PIQUE","PITCH","PITHY","PIVOT","PIXEL","PIXIE","PIZZA","PLACE","PLAID","PLAIN","PLAIT","PLANE","PLANK","PLANT","PLATE","PLAZA","PLEAD","PLEAT","PLIED","PLIER","PLUCK","PLUMB","PLUME","PLUMP","PLUNK","PLUSH","POESY","POINT","POISE","POKER","POLAR","POLKA","POLYP","POOCH","POPPY","PORCH","POSER","POSIT","POSSE","POUCH","POUND","POUTY","POWER","PRANK","PRAWN","PREEN","PRESS","PRICE","PRICK","PRIDE","PRIED","PRIME","PRIMO","PRINT","PRIOR","PRISM","PRIVY","PRIZE","PROBE","PRONE","PRONG","PROOF","PROSE","PROUD","PROVE","PROWL","PROXY","PRUDE","PRUNE","PSALM","PUBIC","PUDGY","PUFFY","PULPY","PULSE","PUNCH","PUPAL","PUPIL","PUPPY","PUREE","PURER","PURGE","PURSE","PUSHY","PUTTY","PYGMY","QUACK","QUAIL","QUAKE","QUALM","QUARK","QUART","QUASH","QUASI","QUEEN","QUEER","QUELL","QUERY","QUEST","QUEUE","QUICK","QUIET","QUILL","QUILT","QUIRK","QUITE","QUOTA","QUOTE","QUOTH","RABBI","RABID","RACER","RADAR","RADII","RADIO","RAINY","RAISE","RAJAH","RALLY","RALPH","RAMEN","RANCH","RANDY","RANGE","RAPID","RARER","RASPY","RATIO","RATTY","RAVEN","RAYON","RAZOR","REACH","REACT","READY","REALM","REARM","REBAR","REBEL","REBUS","REBUT","RECAP","RECUR","RECUT","REEDY","REFER","REFIT","REGAL","REHAB","REIGN","RELAX","RELAY","RELIC","REMIT","RENAL","RENEW","REPAY","REPEL","REPLY","RERUN","RESET","RESIN","RETCH","RETRO","RETRY","REUSE","REVEL","REVUE","RHINO","RHYME","RIDER","RIDGE","RIFLE","RIGHT","RIGID","RIGOR","RINSE","RIPEN","RIPER","RISEN","RISER","RISKY","RIVAL","RIVER","RIVET","ROACH","ROAST","ROBIN","ROBOT","ROCKY","RODEO","ROGER","ROGUE","ROOMY","ROOST","ROTOR","ROUGE","ROUGH","ROUND","ROUSE","ROUTE","ROVER","ROWDY","ROWER","ROYAL","RUDDY","RUDER","RUGBY","RULER","RUMBA","RUMOR","RUPEE","RURAL","RUSTY","SADLY","SAFER","SAINT","SALAD","SALLY","SALON","SALSA","SALTY","SALVE","SALVO","SANDY","SANER","SAPPY","SASSY","SATIN","SATYR","SAUCE","SAUCY","SAUNA","SAUTE","SAVOR","SAVOY","SAVVY","SCALD","SCALE","SCALP","SCALY","SCAMP","SCANT","SCARE","SCARF","SCARY","SCENE","SCENT","SCION","SCOFF","SCOLD","SCONE","SCOOP","SCOPE","SCORE","SCORN","SCOUR","SCOUT","SCOWL","SCRAM","SCRAP","SCREE","SCREW","SCRUB","SCRUM","SCUBA","SEDAN","SEEDY","SEGUE","SEIZE","SEMEN","SENSE","SEPIA","SERIF","SERUM","SERVE","SETUP","SEVEN","SEVER","SEWER","SHACK","SHADE","SHADY","SHAFT","SHAKE","SHAKY","SHALE","SHALL","SHALT","SHAME","SHANK","SHAPE","SHARD","SHARE","SHARK","SHARP","SHAVE","SHAWL","SHEAR","SHEEN","SHEEP","SHEER","SHEET","SHEIK","SHELF","SHELL","SHIED","SHIFT","SHINE","SHINY","SHIRE","SHIRK","SHIRT","SHOAL","SHOCK","SHONE","SHOOK","SHOOT","SHORE","SHORN","SHORT","SHOUT","SHOVE","SHOWN","SHOWY","SHREW","SHRUB","SHRUG","SHUCK","SHUNT","SHUSH","SHYLY","SIEGE","SIEVE","SIGHT","SIGMA","SILKY","SILLY","SINCE","SINEW","SINGE","SIREN","SISSY","SIXTH","SIXTY","SKATE","SKIER","SKIFF","SKILL","SKIMP","SKIRT","SKULK","SKULL","SKUNK","SLACK","SLAIN","SLANG","SLANT","SLASH","SLATE","SLAVE","SLEEK","SLEEP","SLEET","SLEPT","SLICE","SLICK","SLIDE","SLIME","SLIMY","SLING","SLINK","SLOOP","SLOPE","SLOSH","SLOTH","SLUMP","SLUNG","SLUNK","SLURP","SLUSH","SLYLY","SMACK","SMALL","SMART","SMASH","SMEAR","SMELL","SMELT","SMILE","SMIRK","SMITE","SMITH","SMOCK","SMOKE","SMOKY","SMOTE","SNACK","SNAIL","SNAKE","SNAKY","SNARE","SNARL","SNEAK","SNEER","SNIDE","SNIFF","SNIPE","SNOOP","SNORE","SNORT","SNOUT","SNOWY","SNUCK","SNUFF","SOAPY","SOBER","SOGGY","SOLAR","SOLID","SOLVE","SONAR","SONIC","SOOTH","SOOTY","SORRY","SOUND","SOUTH","SOWER","SPACE","SPADE","SPANK","SPARE","SPARK","SPASM","SPAWN","SPEAK","SPEAR","SPECK","SPEED","SPELL","SPELT","SPEND","SPENT","SPERM","SPICE","SPICY","SPIED","SPIEL","SPIKE","SPIKY","SPILL","SPILT","SPINE","SPINY","SPIRE","SPITE","SPLAT","SPLIT","SPOIL","SPOKE","SPOOF","SPOOK","SPOOL","SPOON","SPORE","SPORT","SPOUT","SPRAY","SPREE","SPRIG","SPUNK","SPURN","SPURT","SQUAD","SQUAT","SQUIB","STACK","STAFF","STAGE","STAID","STAIN","STAIR","STAKE","STALE","STALK","STALL","STAMP","STAND","STANK","STARE","STARK","START","STASH","STATE","STAVE","STEAD","STEAK","STEAL","STEAM","STEED","STEEL","STEEP","STEER","STEIN","STERN","STICK","STIFF","STILL","STILT","STING","STINK","STINT","STOCK","STOIC","STOKE","STOLE","STOMP","STONE","STONY","STOOD","STOOL","STOOP","STORE","STORK","STORM","STORY","STOUT","STOVE","STRAP","STRAW","STRAY","STRIP","STRUT","STUCK","STUDY","STUFF","STUMP","STUNG","STUNK","STUNT","STYLE","SUAVE","SUGAR","SUING","SUITE","SULKY","SULLY","SUMAC","SUNNY","SUPER","SURER","SURGE","SURLY","SUSHI","SWAMI","SWAMP","SWARM","SWASH","SWATH","SWEAR","SWEAT","SWEEP","SWEET","SWELL","SWEPT","SWIFT","SWILL","SWINE","SWING","SWIRL","SWISH","SWOON","SWOOP","SWORD","SWORE","SWORN","SWUNG","SYNOD","SYRUP","TABBY","TABLE","TABOO","TACIT","TACKY","TAFFY","TAINT","TAKEN","TAKER","TALLY","TALON","TAMER","TANGO","TANGY","TAPER","TAPIR","TARDY","TAROT","TASTE","TASTY","TATTY","TAUNT","TAWNY","TEACH","TEARY","TEASE","TEDDY","TEETH","TEMPO","TENET","TENOR","TENSE","TENTH","TEPEE","TEPID","TERRA","TERSE","TESTY","THANK","THEFT","THEIR","THEME","THERE","THESE","THETA","THICK","THIEF","THIGH","THING","THINK","THIRD","THONG","THORN","THOSE","THREE","THREW","THROB","THROW","THRUM","THUMB","THUMP","THYME","TIARA","TIBIA","TIDAL","TIGER","TIGHT","TILDE","TIMER","TIMID","TIPSY","TITAN","TITHE","TITLE","TOAST","TODAY","TODDY","TOKEN","TONAL","TONGA","TONIC","TOOTH","TOPAZ","TOPIC","TORCH","TORSO","TORUS","TOTAL","TOTEM","TOUCH","TOUGH","TOWEL","TOWER","TOXIC","TOXIN","TRACE","TRACK","TRACT","TRADE","TRAIL","TRAIN","TRAIT","TRAMP","TRASH","TRAWL","TREAD","TREAT","TREND","TRIAD","TRIAL","TRIBE","TRICE","TRICK","TRIED","TRIPE","TRITE","TROLL","TROOP","TROPE","TROUT","TROVE","TRUCE","TRUCK","TRUER","TRULY","TRUMP","TRUNK","TRUSS","TRUST","TRUTH","TRYST","TUBAL","TUBER","TULIP","TULLE","TUMOR","TUNIC","TURBO","TUTOR","TWANG","TWEAK","TWEED","TWEET","TWICE","TWINE","TWIRL","TWIST","TWIXT","TYING","UDDER","ULCER","ULTRA","UMBRA","UNCLE","UNCUT","UNDER","UNDID","UNDUE","UNFED","UNFIT","UNIFY","UNION","UNITE","UNITY","UNLIT","UNMET","UNSET","UNTIE","UNTIL","UNWED","UNZIP","UPPER","UPSET","URBAN","URINE","USAGE","USHER","USING","USUAL","USURP","UTILE","UTTER","VAGUE","VALET","VALID","VALOR","VALUE","VALVE","VAPID","VAPOR","VAULT","VAUNT","VEGAN","VENOM","VENUE","VERGE","VERSE","VERSO","VERVE","VICAR","VIDEO","VIGIL","VIGOR","VILLA","VINYL","VIOLA","VIPER","VIRAL","VIRUS","VISIT","VISOR","VISTA","VITAL","VIVID","VIXEN","VOCAL","VODKA","VOGUE","VOICE","VOILA","VOMIT","VOTER","VOUCH","VOWEL","VYING","WACKY","WAFER","WAGER","WAGON","WAIST","WAIVE","WALTZ","WARTY","WASTE","WATCH","WATER","WAVER","WAXEN","WEARY","WEAVE","WEDGE","WEEDY","WEIGH","WEIRD","WELCH","WELSH","WENCH","WHACK","WHALE","WHARF","WHEAT","WHEEL","WHELP","WHERE","WHICH","WHIFF","WHILE","WHINE","WHINY","WHIRL","WHISK","WHITE","WHOLE","WHOOP","WHOSE","WIDEN","WIDER","WIDOW","WIDTH","WIELD","WIGHT","WILLY","WIMPY","WINCE","WINCH","WINDY","WISER","WISPY","WITCH","WITTY","WOKEN","WOMAN","WOMEN","WOODY","WOOER","WOOLY","WOOZY","WORDY","WORLD","WORRY","WORSE","WORST","WORTH","WOULD","WOUND","WOVEN","WRACK","WRATH","WREAK","WRECK","WREST","WRING","WRIST","WRITE","WRONG","WROTE","WRUNG","WRYLY","YACHT","YEARN","YEAST","YIELD","YOUNG","YOUTH","ZEBRA","ZESTY","ZONAL"];
const WORDLE_BASE_SET = new Set(WORDLE_BASE_ANSWERS);

function getWordleAnswerList() {
  if (typeof OFFICIAL_WORDLE_ANSWERS !== "undefined" && Array.isArray(OFFICIAL_WORDLE_ANSWERS) && OFFICIAL_WORDLE_ANSWERS.length > 0) {
    return OFFICIAL_WORDLE_ANSWERS;
  }
  if (typeof window !== "undefined" && Array.isArray(window.OFFICIAL_WORDLE_ANSWERS) && window.OFFICIAL_WORDLE_ANSWERS.length > 0) {
    return window.OFFICIAL_WORDLE_ANSWERS;
  }
  return WORDLE_BASE_ANSWERS;
}

function isValidWordleWord(word) {
  const upper = (word || "").toUpperCase().trim();
  if (upper.length !== 5) return false;
  if (typeof OFFICIAL_WORDLE_VALID_SET !== "undefined" && OFFICIAL_WORDLE_VALID_SET.has(upper)) {
    return true;
  }
  if (typeof window !== "undefined" && window.OFFICIAL_WORDLE_VALID_SET && window.OFFICIAL_WORDLE_VALID_SET.has(upper)) {
    return true;
  }
  if (WORDLE_BASE_SET.has(upper)) {
    return true;
  }
  const answers = getWordleAnswerList();
  if (answers.includes(upper)) return true;
  if (typeof OFFICIAL_WORDLE_ALLOWED !== "undefined" && OFFICIAL_WORDLE_ALLOWED.includes(upper)) {
    return true;
  }
  if (typeof window !== "undefined" && Array.isArray(window.OFFICIAL_WORDLE_ALLOWED) && window.OFFICIAL_WORDLE_ALLOWED.includes(upper)) {
    return true;
  }
  return false;
}

// Calculate Official Wordle Day Number from June 19, 2021
function getWordleDayNumber(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffTime = d.getTime() - WORDLE_EPOCH.getTime();
  const dayNum = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, dayNum);
}

// Get the authentic Daily target word
function getDailyWordleTarget(dayNum) {
  const answers = getWordleAnswerList();
  const index = dayNum % answers.length;
  return answers[index].toUpperCase();
}

// Calculate Wordle Hour Number from June 19, 2021 (for Hourly Mode)
function getWordleHourNumber(date = new Date()) {
  const diffTime = date.getTime() - WORDLE_EPOCH.getTime();
  const hourNum = Math.floor(diffTime / (1000 * 60 * 60));
  return Math.max(0, hourNum);
}

// Get the authentic Hourly target word (seeded deterministically by hour number)
function getHourlyWordleTarget(hourNum) {
  const answers = getWordleAnswerList();
  const hash = ((hourNum * 1664525 + 1013904223) >>> 0) % answers.length;
  return answers[hash].toUpperCase();
}

// Get a random practice target word
function getRandomWordleTarget() {
  const answers = getWordleAnswerList();
  return answers[Math.floor(Math.random() * answers.length)].toUpperCase();
}

// Wordle State Variables
let wordleMode = localStorage.getItem("wordle_mode_pref") || "daily"; // 'daily' | 'hourly' | 'unlimited'
let wordleHardMode = localStorage.getItem("wordle_hard_mode") === "true";
let wordleDayNumber = getWordleDayNumber();
let wordleTarget = "";
let wordleRow = 0;
let wordleCol = 0;
let wordleGrid = Array.from({ length: 6 }, () => Array(5).fill(""));
let wordleOver = false;
let wordleWon = false;
let wordleLocked = false;
let wordleKeyStatuses = {}; // letter -> 'correct' | 'present' | 'absent'
let wordleCountdownInterval = null;

// Vocabulary Knowledge Dictionary (High-frequency built-in definitions + live fallback)
const WORDLE_VOCAB_CACHE = {
  "CABIN": { pos: "noun", def: "A small wooden shelter or house in a wild or remote area; a private room on a ship." },
  "CRANE": { pos: "noun / verb", def: "A tall, long-legged wading bird; a machine for lifting heavy weights; to stretch out one's neck." },
  "SLATE": { pos: "noun / verb", def: "A fine-grained grey, green, or bluish metamorphic rock; to schedule or plan an event." },
  "AUDIO": { pos: "noun / adj", def: "Sound, especially when recorded, transmitted, or reproduced." },
  "LIGHT": { pos: "noun / adj", def: "The natural agent that stimulates sight and makes things visible; having little weight." },
  "SHINE": { pos: "verb / noun", def: "To give out or reflect a bright light; brightness produced by light." },
  "EARTH": { pos: "noun", def: "The planet on which we live; the world; soil or ground." },
  "WATER": { pos: "noun / verb", def: "A colourless, transparent, odourless liquid that forms the seas, lakes, rivers, and rain." },
  "SMART": { pos: "adj / verb", def: "Having or showing a quick-witted intelligence; clean, neat, and well-dressed." },
  "PLANT": { pos: "noun / verb", def: "A living organism of the kind exemplified by trees, shrubs, herbs, grasses, and ferns." },
  "HOUSE": { pos: "noun / verb", def: "A building for human habitation, especially one that is lived in by a family or small group." },
  "SWEET": { pos: "adj / noun", def: "Having the pleasant taste characteristic of sugar or honey; delightful." },
  "HEART": { pos: "noun", def: "A hollow muscular organ that pumps the blood through the circulatory system by rhythmic contraction." },
  "DREAM": { pos: "noun / verb", def: "A series of thoughts, images, and sensations occurring in a person's mind during sleep." },
  "PEACE": { pos: "noun", def: "Freedom from disturbance; tranquility; a state of mutual harmony between people or nations." }
};

// Asynchronous Dictionary Fetcher
async function fetchWordDefinition(word) {
  const w = (word || "").toUpperCase().trim();
  if (!w) return null;
  if (WORDLE_VOCAB_CACHE[w]) return { word: w, ...WORDLE_VOCAB_CACHE[w] };

  try {
    const res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(w.toLowerCase()));
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        let bestDef = "";
        let bestPos = "Word";
        let bestExample = "";

        if (Array.isArray(entry.meanings)) {
          for (const m of entry.meanings) {
            const p = m.partOfSpeech ? (m.partOfSpeech.charAt(0).toUpperCase() + m.partOfSpeech.slice(1)) : "Word";
            if (Array.isArray(m.definitions)) {
              for (const d of m.definitions) {
                if (d.definition && !bestDef) {
                  bestDef = d.definition;
                  bestPos = p;
                }
                if (d.example && !bestExample) {
                  bestExample = d.example;
                }
                if (bestDef && bestExample) break;
              }
            }
            if (bestDef && bestExample) break;
          }
        }

        const phonetic = entry.phonetic || (entry.phonetics && entry.phonetics.find(p => p.text)?.text) || "";
        const result = {
          word: w,
          pos: bestPos || "Word",
          def: bestDef || "Meaning unavailable.",
          example: bestExample || "",
          phonetic
        };
        WORDLE_VOCAB_CACHE[w] = result;
        return result;
      }
    }
  } catch (err) {}

  return {
    word: w,
    pos: "",
    def: "Meaning unavailable offline.",
    example: "",
    offline: true
  };
}

// Display Actual Meaning in End-of-Game Stats Modal (Wins & Losses)
async function showWordleEndOfGameDefinition(targetWord) {
  const box = document.getElementById("wordleDefinitionBox");
  const wordEl = document.getElementById("wDefWord");
  const posEl = document.getElementById("wDefPos");
  const meaningEl = document.getElementById("wDefMeaning");
  const exampleBox = document.getElementById("wDefExampleBox");
  const exampleEl = document.getElementById("wDefExample");
  if (!box || !wordEl || !meaningEl) return;

  wordEl.textContent = targetWord;
  if (posEl) posEl.textContent = "";
  meaningEl.textContent = "Loading vocabulary meaning...";
  if (exampleBox) exampleBox.classList.add("hidden");
  box.classList.remove("hidden");

  const data = await fetchWordDefinition(targetWord);
  if (data) {
    wordEl.textContent = data.word + (data.phonetic ? ` ${data.phonetic}` : "");
    if (posEl) {
      if (data.pos) {
        posEl.textContent = `— ${data.pos}`;
        posEl.style.display = "inline";
      } else {
        posEl.style.display = "none";
      }
    }
    meaningEl.textContent = data.def || "Meaning unavailable offline.";

    if (exampleBox && exampleEl) {
      if (data.example) {
        exampleEl.textContent = `"${data.example}"`;
        exampleBox.classList.remove("hidden");
      } else {
        exampleBox.classList.add("hidden");
      }
    }
  }
}

// Wordle Hard Mode Concept Clue Logic (1 hint per puzzle)
function getWordleHintStorageKey() {
  const pfx = (wordleMode === "hourly") ? `wordle_hint_hr_${getWordleHourNumber()}` :
              (wordleMode === "daily") ? `wordle_hint_day_${wordleDayNumber}` :
              `wordle_hint_unl_${wordleTarget}`;
  return pfx;
}

async function showWordleHardModeHint() {
  if (!wordleHardMode) return;
  if (wordleOver) {
    showWordleToast("Puzzle is already completed!", 2000);
    return;
  }

  const hintCard = document.getElementById("wordleHintCard");
  const hintText = document.getElementById("wordleHintText");
  if (!hintCard || !hintText) return;

  const storageKey = getWordleHintStorageKey();
  let cachedHint = null;
  try {
    cachedHint = localStorage.getItem(storageKey);
  } catch (e) {}

  if (cachedHint) {
    hintText.textContent = cachedHint;
    hintCard.classList.remove("hidden");
    return;
  }

  hintText.textContent = "Retrieving conceptual clue...";
  hintCard.classList.remove("hidden");

  const data = await fetchWordDefinition(wordleTarget);
  if (!data || data.offline || !data.def || data.def === "Meaning unavailable offline.") {
    hintText.textContent = "Hint unavailable offline.";
    return;
  }

  // Create concept hint masking the word itself and related stems so answer is NEVER revealed
  let clue = data.def;
  const maskRegex = new RegExp("\\b" + wordleTarget + "(s|ed|ing|er|ly)?\\b", "gi");
  clue = clue.replace(maskRegex, "[this word]");

  let formattedHint = clue;
  const lower = formattedHint.toLowerCase();
  if (!lower.startsWith("describes") && !lower.startsWith("refers") && !lower.startsWith("to ")) {
    const pos = (data.pos || "").toLowerCase();
    if (pos.includes("noun")) {
      formattedHint = "Refers to: " + formattedHint;
    } else if (pos.includes("verb")) {
      formattedHint = "To: " + formattedHint.charAt(0).toLowerCase() + formattedHint.slice(1);
    } else if (pos.includes("adjective")) {
      formattedHint = "Describes: " + formattedHint.charAt(0).toLowerCase() + formattedHint.slice(1);
    }
  }

  try {
    localStorage.setItem(storageKey, formattedHint);
  } catch (e) {}

  hintText.textContent = formattedHint;
}

function closeWordleHint() {
  const hintCard = document.getElementById("wordleHintCard");
  if (hintCard) hintCard.classList.add("hidden");
}

// Display Definition in Interactive Popup Modal (board double-tap / click)
async function openWordDefinitionModal(word) {
  const modal = document.getElementById("wordleDefinitionModal");
  const wordEl = document.getElementById("popDefWord");
  const posEl = document.getElementById("popDefPos");
  const meaningEl = document.getElementById("popDefMeaning");
  const exampleEl = document.getElementById("popDefExample");
  if (!modal || !wordEl || !meaningEl) return;

  wordEl.textContent = word.toUpperCase();
  posEl.textContent = "looking up...";
  meaningEl.textContent = "Fetching definition from dictionary...";
  if (exampleEl) exampleEl.classList.add("hidden");
  modal.classList.remove("hidden");

  const data = await fetchWordDefinition(word);
  if (data) {
    wordEl.textContent = data.word + (data.phonetic ? ` ${data.phonetic}` : "");
    posEl.textContent = data.pos || "word";
    meaningEl.textContent = data.def || "Valid 5-letter word.";
    if (exampleEl && data.example) {
      exampleEl.textContent = `"${data.example}"`;
      exampleEl.classList.remove("hidden");
    }
  }
}

function closeWordDefinitionModal() {
  const modal = document.getElementById("wordleDefinitionModal");
  if (modal) modal.classList.add("hidden");
}

// Stats Storage Schema
function getWordleStats() {
  try {
    const raw = localStorage.getItem("wordle_stats_v2");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
    lastPlayedDay: -1
  };
}

function saveWordleStats(stats) {
  try {
    localStorage.setItem("wordle_stats_v2", JSON.stringify(stats));
  } catch (e) {}
}

function recordWordleResult(won, guessCount) {
  const stats = getWordleStats();
  if (wordleMode === "daily") {
    if (stats.lastPlayedDay === wordleDayNumber) return;
    stats.lastPlayedDay = wordleDayNumber;
  }
  stats.played++;
  if (won) {
    stats.wins++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.maxStreak) stats.maxStreak = stats.currentStreak;
    const g = Math.min(6, Math.max(1, guessCount));
    stats.guesses[g] = (stats.guesses[g] || 0) + 1;
  } else {
    stats.currentStreak = 0;
    stats.guesses.fail = (stats.guesses.fail || 0) + 1;
  }
  saveWordleStats(stats);
}

// Floating Toast Notification Helper
function showWordleToast(message, duration = 1600) {
  const container = document.getElementById("wordleToastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "wordle-toast";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

// Two-pass Clue Evaluation: Green first, then Yellow
function evaluateWordleGuess(guess, target) {
  const result = Array(5).fill("absent");
  const targetChars = target.split("");
  const guessChars = guess.split("");
  const remaining = {};

  for (let i = 0; i < 5; i++) {
    const t = targetChars[i];
    remaining[t] = (remaining[t] || 0) + 1;
  }

  // Pass 1: Exact matches (green / correct)
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = "correct";
      remaining[guessChars[i]]--;
    }
  }

  // Pass 2: Misplaced matches (yellow / present)
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    const g = guessChars[i];
    if (remaining[g] && remaining[g] > 0) {
      result[i] = "present";
      remaining[g]--;
    }
  }

  return result;
}

// Hard Mode Validation — Accumulates all revealed clues across all prior attempts
function validateHardMode(guess) {
  if (!wordleHardMode || wordleRow === 0) return { valid: true };

  const ordinals = ["1st", "2nd", "3rd", "4th", "5th"];

  // 1. Must reuse all confirmed green letters in their exact positions
  const confirmedPositions = {};
  for (let r = 0; r < wordleRow; r++) {
    const rowWord = wordleGrid[r].join("");
    const clues = evaluateWordleGuess(rowWord, wordleTarget);
    for (let i = 0; i < 5; i++) {
      if (clues[i] === "correct") {
        confirmedPositions[i] = rowWord[i];
      }
    }
  }

  for (const posStr in confirmedPositions) {
    const pos = parseInt(posStr, 10);
    const requiredChar = confirmedPositions[pos];
    if (guess[pos] !== requiredChar) {
      return {
        valid: false,
        msg: `${ordinals[pos]} letter must be ${requiredChar}`
      };
    }
  }

  // 2. Must contain all revealed yellow letters (and accounts for multiple occurrences)
  const requiredLetterCounts = {};
  for (let r = 0; r < wordleRow; r++) {
    const rowWord = wordleGrid[r].join("");
    const clues = evaluateWordleGuess(rowWord, wordleTarget);
    const rowCounts = {};
    for (let i = 0; i < 5; i++) {
      if (clues[i] === "correct" || clues[i] === "present") {
        const char = rowWord[i];
        rowCounts[char] = (rowCounts[char] || 0) + 1;
      }
    }
    for (const char in rowCounts) {
      requiredLetterCounts[char] = Math.max(requiredLetterCounts[char] || 0, rowCounts[char]);
    }
  }

  const guessCounts = {};
  for (let i = 0; i < 5; i++) {
    guessCounts[guess[i]] = (guessCounts[guess[i]] || 0) + 1;
  }

  for (const char in requiredLetterCounts) {
    const minNeeded = requiredLetterCounts[char];
    const actual = guessCounts[char] || 0;
    if (actual < minNeeded) {
      return {
        valid: false,
        msg: `Guess must contain ${char}`
      };
    }
  }

  return { valid: true };
}

// Keyboard Layout & Virtual Key Management
const WORDLE_KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"]
];

function renderWordleKeyboard() {
  const keyboardEl = document.getElementById("wordleKeyboard");
  if (!keyboardEl) return;
  keyboardEl.innerHTML = "";

  WORDLE_KEYBOARD_LAYOUT.forEach(row => {
    const rowEl = document.createElement("div");
    rowEl.className = "kb-row";

    row.forEach(key => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "kb-key" + (key === "ENTER" || key === "DEL" ? " wide" : "");
      btn.dataset.key = key;

      if (key === "DEL") {
        btn.setAttribute("aria-label", "Backspace");
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>';
      } else {
        btn.textContent = key;
      }

      if (wordleKeyStatuses[key]) {
        btn.classList.add(wordleKeyStatuses[key]);
      }

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        handleWordleKey(key);
      });
      rowEl.appendChild(btn);
    });

    keyboardEl.appendChild(rowEl);
  });
}

function updateVirtualKey(char, newStatus) {
  const keyboardEl = document.getElementById("wordleKeyboard");
  const btn = keyboardEl?.querySelector(`[data-key="${char}"]`);
  if (!btn) return;

  const current = wordleKeyStatuses[char];
  if (newStatus === "correct") {
    wordleKeyStatuses[char] = "correct";
    btn.classList.remove("present", "absent");
    btn.classList.add("correct");
  } else if (newStatus === "present" && current !== "correct") {
    wordleKeyStatuses[char] = "present";
    btn.classList.remove("absent");
    btn.classList.add("present");
  } else if (newStatus === "absent" && current !== "correct" && current !== "present") {
    wordleKeyStatuses[char] = "absent";
    btn.classList.add("absent");
  }
}

// Render the 6x5 Grid
function renderWordleGrid() {
  const boardEl = document.getElementById("wordleBoard");
  if (!boardEl) return;
  boardEl.innerHTML = "";

  for (let r = 0; r < 6; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "wordle-row";
    rowEl.id = "wr-" + r;

    const isSubmitted = (r < wordleRow) || (r === wordleRow && wordleOver && wordleGrid[r].every(Boolean));
    const rowWord = wordleGrid[r].join("");
    const rowStatuses = (isSubmitted && rowWord.length === 5) ? evaluateWordleGuess(rowWord, wordleTarget) : null;

    if (isSubmitted && rowWord.length === 5) {
      rowEl.classList.add("has-submitted-word");
      rowEl.title = `Double-click or right-click to view definition of "${rowWord}"`;
      rowEl.addEventListener("dblclick", () => {
        openWordDefinitionModal(rowWord);
      });
      rowEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        openWordDefinitionModal(rowWord);
      });
    }

    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.className = "wordle-tile";
      tile.id = "wt-" + r + "-" + c;
      const letter = wordleGrid[r][c] || "";
      tile.textContent = letter;

      if (letter) {
        tile.classList.add("has-letter");
      }

      if (rowStatuses) {
        const st = rowStatuses[c];
        tile.classList.add(st);
      }

      rowEl.appendChild(tile);
    }
    boardEl.appendChild(rowEl);
  }
}

// Master Render Function
function renderWordle() {
  renderWordleGrid();
  renderWordleKeyboard();
  updateWordleControls();
}

// Render Top Sub-Header & Controls
function updateWordleControls() {
  const modeLabel = document.getElementById("wordleModeLabel");
  const numberLabel = document.getElementById("wordleNumberLabel");
  const hardBtn = document.getElementById("wordleHardModeBtn");
  const newWordBtn = document.getElementById("wordleNewWordBtn");

  if (modeLabel && numberLabel) {
    if (wordleMode === "daily") {
      modeLabel.textContent = "Daily";
      numberLabel.textContent = "#" + wordleDayNumber;
    } else if (wordleMode === "hourly") {
      modeLabel.textContent = "Hourly";
      numberLabel.textContent = "#" + getWordleHourNumber();
    } else {
      modeLabel.textContent = "Unlimited";
      numberLabel.textContent = "∞";
    }
  }

  if (hardBtn) {
    hardBtn.classList.toggle("active", wordleHardMode);
    hardBtn.title = wordleHardMode ? "Hard Mode (Strict hints ON)" : "Normal Mode (Click to enable Hard Mode)";
  }

  const hintBtn = document.getElementById("wordleHintBtn");
  const hintCard = document.getElementById("wordleHintCard");
  if (hintBtn) {
    if (wordleHardMode && !wordleOver) {
      hintBtn.classList.remove("hidden");
    } else {
      hintBtn.classList.add("hidden");
      if (hintCard) hintCard.classList.add("hidden");
    }
  }

  if (newWordBtn) {
    if (wordleMode === "unlimited" || wordleOver) {
      newWordBtn.classList.remove("hidden");
    } else {
      newWordBtn.classList.add("hidden");
    }
  }
}

// Game State Persistence (Daily & Hourly)
function getDailyStorageKey(dayNum) {
  return "wordle_daily_game_" + dayNum;
}

function getHourlyStorageKey(hourNum) {
  return "wordle_hourly_game_" + hourNum;
}

function saveWordleGameState() {
  if (wordleMode === "unlimited") return;
  const isHourly = (wordleMode === "hourly");
  const num = isHourly ? getWordleHourNumber() : wordleDayNumber;
  const key = isHourly ? getHourlyStorageKey(num) : getDailyStorageKey(num);
  const state = {
    mode: wordleMode,
    num: num,
    target: wordleTarget,
    grid: wordleGrid,
    row: wordleRow,
    col: wordleCol,
    over: wordleOver,
    won: wordleWon,
    hardMode: wordleHardMode,
    keyStatuses: wordleKeyStatuses
  };
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {}
}

function loadWordleGameState(mode, num) {
  try {
    const key = (mode === "hourly") ? getHourlyStorageKey(num) : getDailyStorageKey(num);
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

// Initialize Wordle Game
function initWordle(forceNew = false) {
  resetIdleWatchdog();
  clearWinLine();
  stopTurnTimer();
  showTimerInactive();
  updateMoveCounter(false);
  showOnlyActiveGame("wordle");

  wordleDayNumber = getWordleDayNumber();
  const curHour = getWordleHourNumber();
  wordleLocked = false;

  if ((wordleMode === "daily" || wordleMode === "hourly") && !forceNew) {
    const savedNum = (wordleMode === "hourly") ? curHour : wordleDayNumber;
    const saved = loadWordleGameState(wordleMode, savedNum);
    if (saved && saved.target) {
      wordleTarget = saved.target;
      wordleGrid = saved.grid || Array.from({ length: 6 }, () => Array(5).fill(""));
      wordleRow = saved.row || 0;
      wordleCol = saved.col || 0;
      wordleOver = !!saved.over;
      wordleWon = !!saved.won;
      wordleKeyStatuses = saved.keyStatuses || {};

      renderWordleGrid();
      renderWordleKeyboard();
      updateWordleControls();

      if (wordleOver) {
        showWordleEndOfGameDefinition(wordleTarget);
        setTimeout(() => {
          openWordleStatsModal();
        }, 500);
      }
      return;
    }

    wordleTarget = (wordleMode === "hourly") ? getHourlyWordleTarget(curHour) : getDailyWordleTarget(wordleDayNumber);
  } else {
    wordleTarget = getRandomWordleTarget();
  }

  wordleRow = 0;
  wordleCol = 0;
  wordleOver = false;
  wordleWon = false;
  wordleKeyStatuses = {};
  wordleGrid = Array.from({ length: 6 }, () => Array(5).fill(""));

  renderWordleGrid();
  renderWordleKeyboard();
  updateWordleControls();

  if (statusPill) statusPill.textContent = "Wordle";
}

// Input Handling
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
        tile.classList.remove("has-letter", "pop");
      }
      saveWordleGameState();
      persistLiveState();
    }
    return;
  }

  if (k === "ENTER") {
    if (wordleCol === 5) {
      checkWordleRow();
    } else {
      showWordleToast("Not enough letters");
      const rowEl = document.getElementById("wr-" + wordleRow);
      if (rowEl) {
        rowEl.classList.remove("shake");
        void rowEl.offsetWidth;
        rowEl.classList.add("shake");
      }
    }
    return;
  }

  if (/^[A-Z]$/.test(k) && wordleCol < 5) {
    wordleGrid[wordleRow][wordleCol] = k;
    const tile = document.getElementById("wt-" + wordleRow + "-" + wordleCol);
    if (tile) {
      tile.textContent = k;
      tile.classList.add("has-letter");
      tile.classList.remove("pop");
      void tile.offsetWidth;
      tile.classList.add("pop");
    }
    wordleCol++;
    saveWordleGameState();
    persistLiveState();
  }
}

// Sequential 3D Flip & Row Evaluation
function checkWordleRow() {
  if (wordleLocked) return;
  const guess = wordleGrid[wordleRow].join("");

  if (!isValidWordleWord(guess)) {
    showWordleToast("Not in word list");
    const rowEl = document.getElementById("wr-" + wordleRow);
    if (rowEl) {
      rowEl.classList.remove("shake");
      void rowEl.offsetWidth;
      rowEl.classList.add("shake");
    }
    return;
  }

  const hardCheck = validateHardMode(guess);
  if (!hardCheck.valid) {
    showWordleToast(hardCheck.msg);
    const rowEl = document.getElementById("wr-" + wordleRow);
    if (rowEl) {
      rowEl.classList.remove("shake");
      void rowEl.offsetWidth;
      rowEl.classList.add("shake");
    }
    return;
  }

  const clueStatuses = evaluateWordleGuess(guess, wordleTarget);
  const isWin = (guess === wordleTarget);
  const currentRow = wordleRow;
  wordleLocked = true;

  clueStatuses.forEach((status, col) => {
    const tile = document.getElementById("wt-" + currentRow + "-" + col);
    if (!tile) return;
    setTimeout(() => {
      tile.classList.add("flip");
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
      wordleWon = true;
      scoreA++;
      streak++;
      persistScores();
      renderScores();

      const winningRowEl = document.getElementById("wr-" + currentRow);
      if (winningRowEl) {
        Array.from(winningRowEl.children).forEach(t => t.classList.add("dance"));
      }

      const praises = ["Genius", "Magnificent", "Impressive", "Splendid", "Great", "Phew!"];
      const praise = praises[currentRow] || "Genius";
      setTimeout(() => {
        showWordleToast(praise, 2200);
      }, 300);

      recordWordleResult(true, currentRow + 1);
      saveWordleGameState();
      updateWordleControls();
      persistLiveState();
      showWordleEndOfGameDefinition(wordleTarget);

      setTimeout(() => {
        openWordleStatsModal();
      }, 2000);
      return;
    }

    if (wordleRow === 6) {
      wordleOver = true;
      wordleWon = false;
      scoreB++;
      streak = 0;
      persistScores();
      renderScores();

      showWordleToast(wordleTarget, 4000);

      recordWordleResult(false, 6);
      saveWordleGameState();
      updateWordleControls();
      persistLiveState();
      showWordleEndOfGameDefinition(wordleTarget);

      setTimeout(() => {
        openWordleStatsModal();
      }, 2500);
      return;
    }

    saveWordleGameState();
    persistLiveState();
  }, totalFlipTime);
}

// Statistics Modal Rendering
function renderWordleStats() {
  const stats = getWordleStats();
  const playedEl = document.getElementById("wStatPlayed");
  const winRateEl = document.getElementById("wStatWinRate");
  const streakEl = document.getElementById("wStatStreak");
  const maxStreakEl = document.getElementById("wStatMaxStreak");
  const chartEl = document.getElementById("wDistChart");

  if (playedEl) playedEl.textContent = stats.played;
  if (winRateEl) {
    const rate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
    winRateEl.textContent = rate + "%";
  }
  if (streakEl) streakEl.textContent = stats.currentStreak;
  if (maxStreakEl) maxStreakEl.textContent = stats.maxStreak;

  if (chartEl) {
    chartEl.innerHTML = "";
    const maxVal = Math.max(1, ...Object.values(stats.guesses));

    for (let i = 1; i <= 6; i++) {
      const count = stats.guesses[i] || 0;
      const pct = Math.max(7, Math.round((count / maxVal) * 100));
      const isCurrentWinningRow = (wordleWon && wordleRow === i);

      const row = document.createElement("div");
      row.className = "dist-row";
      row.innerHTML = `
        <span class="dist-num">${i}</span>
        <div class="dist-bar-wrap">
          <div class="dist-bar ${isCurrentWinningRow ? 'highlight' : ''}" style="width: ${pct}%">
            ${count}
          </div>
        </div>
      `;
      chartEl.appendChild(row);
    }
  }

  const modalNextBtn = document.getElementById("wordleModalNextWordBtn");
  const shareBtn = document.getElementById("wordleShareBtn");
  const countdownBox = document.getElementById("wNextCountdownBox");

  if (wordleMode === "daily" || wordleMode === "hourly") {
    countdownBox?.classList.remove("hidden");
    modalNextBtn?.classList.add("hidden");
    startWordleMidnightCountdown();
  } else {
    countdownBox?.classList.add("hidden");
    modalNextBtn?.classList.remove("hidden");
  }

  if (shareBtn) {
    shareBtn.style.display = wordleOver ? "flex" : "none";
  }
}

function openWordleStatsModal() {
  renderWordleStats();
  if (wordleOver && wordleTarget) {
    showWordleEndOfGameDefinition(wordleTarget);
  }
  const modal = document.getElementById("wordleStatsModal");
  if (modal) modal.classList.remove("hidden");
}

function closeWordleStatsModal() {
  const modal = document.getElementById("wordleStatsModal");
  if (modal) modal.classList.add("hidden");
  if (wordleCountdownInterval) {
    clearInterval(wordleCountdownInterval);
    wordleCountdownInterval = null;
  }
}

// Midnight / Next Hour Countdown Timer
function startWordleMidnightCountdown() {
  if (wordleCountdownInterval) clearInterval(wordleCountdownInterval);

  function update() {
    const timerEl = document.getElementById("wNextTimer");
    const labelEl = document.getElementById("wNextCountdownLabel");
    if (!timerEl) return;
    const now = new Date();
    let targetTime;

    if (wordleMode === "hourly") {
      if (labelEl) labelEl.textContent = "NEXT HOURLY WORDLE";
      targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    } else {
      if (labelEl) labelEl.textContent = "NEXT DAILY WORDLE";
      targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    }

    const diff = Math.max(0, targetTime.getTime() - now.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const pad = (n) => String(n).padStart(2, "0");
    timerEl.textContent = `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

    if (diff === 0 && (wordleMode === "hourly" || wordleMode === "daily")) {
      initWordle(false);
    }
  }

  update();
  wordleCountdownInterval = setInterval(update, 1000);
}

// Viral Emoji Share Generator
function generateWordleShareText() {
  const modeStr = (wordleMode === "daily") ? `Daily #${wordleDayNumber}` :
                  (wordleMode === "hourly") ? `Hourly #${getWordleHourNumber()}` : `Unlimited`;
  const title = `Wordle (${modeStr})`;
  const score = wordleWon ? `${wordleRow}/6` : `X/6`;
  const hardStar = wordleHardMode ? `*` : ``;

  const emojiMap = {
    correct: "🟩",
    present: "🟨",
    absent: "⬛"
  };

  const rows = [];
  const limit = Math.min(wordleRow, 6);
  for (let r = 0; r < limit; r++) {
    const word = wordleGrid[r].join("");
    if (word.length === 5) {
      const clues = evaluateWordleGuess(word, wordleTarget);
      rows.push(clues.map(c => emojiMap[c] || "⬛").join(""));
    }
  }

  return `${title} ${score}${hardStar}\n\n${rows.join("\n")}`;
}

function shareWordleResult() {
  const text = generateWordleShareText();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showWordleToast("Copied results to clipboard", 2000);
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }

  function fallbackCopy(str) {
    const area = document.createElement("textarea");
    area.value = str;
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      showWordleToast("Copied results to clipboard", 2000);
    } catch (e) {
      showWordleToast("Could not copy results", 1800);
    }
    document.body.removeChild(area);
  }
}

// Help Modal
function openWordleHelpModal() {
  const modal = document.getElementById("wordleHelpModal");
  if (modal) modal.classList.remove("hidden");
}

function closeWordleHelpModal() {
  const modal = document.getElementById("wordleHelpModal");
  if (modal) modal.classList.add("hidden");
}

// Attach UI Event Listeners for Wordle
function initWordleUIEvents() {
  document.getElementById("wordleHelpBtn")?.addEventListener("click", openWordleHelpModal);
  document.getElementById("closeWordleHelpBtn")?.addEventListener("click", closeWordleHelpModal);
  document.getElementById("wordleHelpModal")?.addEventListener("click", (e) => {
    if (e.target.id === "wordleHelpModal") closeWordleHelpModal();
  });

  document.getElementById("closeWordleDefBtn")?.addEventListener("click", closeWordDefinitionModal);
  document.getElementById("wordleDefinitionModal")?.addEventListener("click", (e) => {
    if (e.target.id === "wordleDefinitionModal") closeWordDefinitionModal();
  });

  document.getElementById("wordleStatsBtn")?.addEventListener("click", openWordleStatsModal);
  document.getElementById("closeWordleStatsBtn")?.addEventListener("click", closeWordleStatsModal);
  document.getElementById("wordleStatsModal")?.addEventListener("click", (e) => {
    if (e.target.id === "wordleStatsModal") closeWordleStatsModal();
  });

  document.getElementById("wordleModePill")?.addEventListener("click", () => {
    if (wordleMode === "daily") wordleMode = "hourly";
    else if (wordleMode === "hourly") wordleMode = "unlimited";
    else wordleMode = "daily";
    localStorage.setItem("wordle_mode_pref", wordleMode);
    initWordle(false);
    showWordleToast(`Wordle mode: ${wordleMode.toUpperCase()}`, 1200);
  });

  document.getElementById("wordleHardModeBtn")?.addEventListener("click", () => {
    // If turning on during an in-progress game, check if existing rows comply
    if (!wordleHardMode && wordleRow > 0) {
      showWordleToast("Hard mode can only be enabled at the start of a round", 2200);
      return;
    }
    wordleHardMode = !wordleHardMode;
    localStorage.setItem("wordle_hard_mode", String(wordleHardMode));
    updateWordleControls();
    showWordleToast(wordleHardMode ? "Hard mode enabled" : "Hard mode disabled", 1400);
  });

  document.getElementById("wordleNewWordBtn")?.addEventListener("click", () => {
    initWordle(true);
  });

  document.getElementById("wordleModalNextWordBtn")?.addEventListener("click", () => {
    closeWordleStatsModal();
    initWordle(true);
  });

  document.getElementById("wordleHintBtn")?.addEventListener("click", () => {
    showWordleHardModeHint();
  });

  document.getElementById("closeWordleHintBtn")?.addEventListener("click", () => {
    closeWordleHint();
  });

  document.getElementById("wordleShareBtn")?.addEventListener("click", shareWordleResult);
}

// Auto-run UI event attachment on script load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWordleUIEvents);
} else {
  initWordleUIEvents();
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
  cards = (cards || []).filter(c => c && typeof c.val === "number");
  if (cards.length < 5) return { rank: 0, score: 0, name: "Evaluating...", cards: [] };
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

  const isLocal = (hubState.opponent === "local");
  const isP2Turn = isLocal && (pokerTurn === "ai");
  const activeChips = isP2Turn ? pokerAiChips : pokerPlayerChips;
  const activeBet = isP2Turn ? pokerAiBet : pokerPlayerBet;
  const toCall = Math.max(0, pokerCurrentBet - activeBet);

  if (pokerCallBtn) {
    pokerCallBtn.textContent = toCall > 0 ? `Call $${toCall}` : "Check";
  }

  if (pokerBetSliderEl && pokerSliderValEl) {
    const minRaise = Math.min(activeChips, Math.max(20, toCall + 20));
    pokerBetSliderEl.min = String(minRaise);
    pokerBetSliderEl.max = String(activeChips);
    if (Number(pokerBetSliderEl.value) < minRaise) pokerBetSliderEl.value = String(minRaise);
    pokerSliderValEl.textContent = `$${pokerBetSliderEl.value}`;
    if (pokerRaiseBtn) {
      const isBet = pokerCurrentBet === 0;
      pokerRaiseBtn.textContent = `${isBet ? "Bet" : "Raise"} $${pokerBetSliderEl.value}`;
    }
  }

  if (pokerAiNameEl) {
    pokerAiNameEl.textContent = isLocal ? "Player 2" : "AI Opponent";
  }
}

/* ---------- Poker Life Cycle & Betting ---------- */
function initPoker(resetBankroll = true) {
  resetIdleWatchdog();
  clearWinLine();
  stopTurnTimer();
  showTimerInactive();
  updateMoveCounter(false);
  showOnlyActiveGame("poker");

  if (statusPill) statusPill.textContent = "Texas Hold'em Poker";

  if (resetBankroll) {
    pokerPlayerChips = 1000;
    pokerAiChips = 1000;
  }
  startNewPokerHand();
}

function startNewPokerHand() {
  if (pokerPlayerChips <= 0) {
    showDefeatScreen("Busted! AI Took All Chips.", "Tournament Over");
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

  const isLocal = (hubState.opponent === "local");
  if (pokerTurn === "ai" && !isLocal) {
    setTimeout(aiPokerTurn, 600);
  }
}

function runAllInShowdown() {
  pokerBetControlsEl?.classList.add("hidden");
  if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = "ALL IN! Dealing remaining community cards...";
  function stepCommunity() {
    if (pokerOver) return;
    if (!pokerDeck || pokerDeck.length < 5) pokerDeck = buildFreshDeck();
    if (pokerCommunity.length < 5) {
      if (pokerCommunity.length === 0) {
        pokerCommunity.push(pokerDeck.pop(), pokerDeck.pop(), pokerDeck.pop());
      } else {
        pokerCommunity.push(pokerDeck.pop());
      }
      renderPokerUI();
      setTimeout(stepCommunity, 500);
    } else {
      setTimeout(pokerShowdown, 500);
    }
  }
  setTimeout(stepCommunity, 400);
}

function advancePokerStage() {
  if (!pokerDeck || pokerDeck.length < 5) pokerDeck = buildFreshDeck();
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

  pokerTurn = pokerDealer === "player" ? "ai" : "player";
  renderPokerUI();

  const isLocal = (hubState.opponent === "local");
  if (pokerTurn === "ai") {
    if (isLocal) {
      if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `${pokerStage.toUpperCase()} dealt! Player 2's turn.`;
    } else {
      setTimeout(aiPokerTurn, 600);
    }
  } else {
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `${pokerStage.toUpperCase()} dealt! ${isLocal ? "Player 1's" : "Your"} turn.`;
  }
}

function pokerShowdown() {
  pokerStage = "showdown";
  pokerOver = true;

  // Uncalled excess bet refund if any (all-in side pot protection)
  if (pokerPlayerBet > pokerAiBet) {
    const refund = pokerPlayerBet - pokerAiBet;
    pokerPlayerChips += refund;
    pokerPot -= refund;
    pokerPlayerBet = pokerAiBet;
  } else if (pokerAiBet > pokerPlayerBet) {
    const refund = pokerAiBet - pokerPlayerBet;
    pokerAiChips += refund;
    pokerPot -= refund;
    pokerAiBet = pokerPlayerBet;
  }

  const isLocal = (hubState.opponent === "local");
  const playerEval = evaluate7Cards([...pokerPlayerCards, ...pokerCommunity]);
  const aiEval = evaluate7Cards([...pokerAiCards, ...pokerCommunity]);

  let winMsg = "";
  let winningCards = [];

  if (playerEval.score > aiEval.score) {
    pokerPlayerChips += pokerPot;
    scoreA++;
    updateStreak(true);
    winMsg = `${isLocal ? "Player 1" : "You"} Win $${pokerPot}! (${playerEval.name} beats ${aiEval.name})`;
    winningCards = playerEval.cards.map(c => c.id);
    triggerConfetti();
  } else if (aiEval.score > playerEval.score) {
    pokerAiChips += pokerPot;
    scoreB++;
    updateStreak(false);
    winMsg = `${isLocal ? "Player 2" : "AI"} Wins $${pokerPot}. (${aiEval.name} beats ${playerEval.name})`;
    winningCards = aiEval.cards.map(c => c.id);
  } else {
    const half = Math.floor(pokerPot / 2);
    pokerPlayerChips += half;
    pokerAiChips += half;
    scoreD++;
    winMsg = `Split Pot ($${half} each)! (${playerEval.name})`;
    winningCards = playerEval.cards.map(c => c.id);
    triggerDrawAnimation();
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
  if (pokerOver) return;
  const isLocal = (hubState.opponent === "local");
  if (!isLocal && pokerTurn !== "player") return;

  pokerOver = true;
  if (pokerTurn === "player") {
    pokerAiChips += pokerPot;
    scoreB++;
    updateStreak(false);
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `${isLocal ? "Player 1" : "You"} Folded. ${isLocal ? "Player 2" : "AI"} takes $${pokerPot}.`;
  } else {
    pokerPlayerChips += pokerPot;
    scoreA++;
    updateStreak(true);
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `Player 2 Folded. Player 1 takes $${pokerPot}!`;
  }
  persistScores();
  renderScores();
  pokerPot = 0;
  pokerBetControlsEl?.classList.add("hidden");
  pokerFoldBtn?.classList.add("hidden");
  pokerCallBtn?.classList.add("hidden");
  pokerRaiseBtn?.classList.add("hidden");
  pokerNextHandBtn?.classList.remove("hidden");
  renderPokerUI();
});

pokerCallBtn?.addEventListener("click", () => {
  if (pokerOver) return;
  const isLocal = (hubState.opponent === "local");
  if (!isLocal && pokerTurn !== "player") return;

  const isP2 = isLocal && (pokerTurn === "ai");
  const activeChips = isP2 ? pokerAiChips : pokerPlayerChips;
  const activeBet = isP2 ? pokerAiBet : pokerPlayerBet;
  const toCall = Math.max(0, pokerCurrentBet - activeBet);
  const callAmt = Math.min(activeChips, toCall);

  if (isP2) {
    pokerAiChips -= callAmt;
    pokerAiBet += callAmt;
  } else {
    pokerPlayerChips -= callAmt;
    pokerPlayerBet += callAmt;
  }
  pokerPot += callAmt;
  renderPokerUI();

  if (pokerPlayerChips === 0 || pokerAiChips === 0) {
    runAllInShowdown();
    return;
  }

  if (pokerPlayerBet === pokerAiBet) {
    if (pokerCurrentBet > 0 || pokerStage !== "preflop" || pokerDealer === (isP2 ? "ai" : "player")) {
      advancePokerStage();
      return;
    }
  }

  if (pokerTurn === "player") {
    pokerTurn = "ai";
    if (isLocal) {
      if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = "Player 1 Called. Player 2's turn.";
      renderPokerUI();
    } else {
      if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = "AI is thinking...";
      setTimeout(aiPokerTurn, 600);
    }
  } else {
    pokerTurn = "player";
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = "Player 2 Called. Player 1's turn.";
    renderPokerUI();
  }
});

pokerRaiseBtn?.addEventListener("click", () => {
  if (pokerOver) return;
  const isLocal = (hubState.opponent === "local");
  if (!isLocal && pokerTurn !== "player") return;

  const isP2 = isLocal && (pokerTurn === "ai");
  const activeChips = isP2 ? pokerAiChips : pokerPlayerChips;
  const activeBet = isP2 ? pokerAiBet : pokerPlayerBet;
  const toCall = Math.max(0, pokerCurrentBet - activeBet);
  const raiseVal = Number(pokerBetSliderEl?.value || 40);
  const totalCommit = Math.min(activeChips, toCall + raiseVal);
  if (totalCommit <= 0) return;

  if (isP2) {
    pokerAiChips -= totalCommit;
    pokerAiBet += totalCommit;
    pokerCurrentBet = pokerAiBet;
  } else {
    pokerPlayerChips -= totalCommit;
    pokerPlayerBet += totalCommit;
    pokerCurrentBet = pokerPlayerBet;
  }
  pokerPot += totalCommit;
  renderPokerUI();

  if (pokerPlayerChips === 0 || pokerAiChips === 0) {
    const oppChips = isP2 ? pokerPlayerChips : pokerAiChips;
    const oppBet = isP2 ? pokerPlayerBet : pokerAiBet;
    if (oppChips === 0 || oppBet === pokerCurrentBet) {
      runAllInShowdown();
      return;
    }
  }

  if (pokerTurn === "player") {
    pokerTurn = "ai";
    if (isLocal) {
      if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `Player 1 Raised to $${pokerCurrentBet}. Player 2's turn.`;
      renderPokerUI();
    } else {
      if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `You Raised to $${pokerCurrentBet}. AI thinking...`;
      setTimeout(aiPokerTurn, 650);
    }
  } else {
    pokerTurn = "player";
    if (pokerStatusBannerEl) pokerStatusBannerEl.textContent = `Player 2 Raised to $${pokerCurrentBet}. Player 1's turn.`;
    renderPokerUI();
  }
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
    const isP2 = (hubState.opponent === "local" && pokerTurn === "ai");
    const activeChips = isP2 ? pokerAiChips : pokerPlayerChips;
    const half = Math.max(Number(pokerBetSliderEl.min), Math.floor(pokerPot / 2));
    pokerBetSliderEl.value = String(Math.min(activeChips, half));
    pokerBetSliderEl.dispatchEvent(new Event("input"));
  }
});

pokerQuickPotBtn?.addEventListener("click", () => {
  if (pokerBetSliderEl) {
    const isP2 = (hubState.opponent === "local" && pokerTurn === "ai");
    const activeChips = isP2 ? pokerAiChips : pokerPlayerChips;
    const potBet = Math.max(Number(pokerBetSliderEl.min), pokerPot || 40);
    pokerBetSliderEl.value = String(Math.min(activeChips, potBet));
    pokerBetSliderEl.dispatchEvent(new Event("input"));
  }
});

pokerQuickAllInBtn?.addEventListener("click", () => {
  if (pokerBetSliderEl) {
    const isP2 = (hubState.opponent === "local" && pokerTurn === "ai");
    const activeChips = isP2 ? pokerAiChips : pokerPlayerChips;
    pokerBetSliderEl.value = String(activeChips);
    pokerBetSliderEl.dispatchEvent(new Event("input"));
  }
});

pokerNextHandBtn?.addEventListener("click", () => {
  startNewPokerHand();
});

/* ==========================================================================
   Sequence (Classic 10x10 Board & Card Game) Engine
   ========================================================================== */

const SEQUENCE_BOARD_LAYOUT = [
  ["CORNER", "2S",  "3S",  "4S",  "5S",  "6S",  "7S",  "8S",  "9S",  "CORNER"],
  ["6C",     "5C",  "4C",  "3C",  "2C",  "AH",  "KH",  "QH",  "10H", "10S"],
  ["7C",     "AS",  "2D",  "3D",  "4D",  "5D",  "6D",  "7D",  "9H",  "QS"],
  ["8C",     "KS",  "6C",  "5C",  "4C",  "3C",  "2C",  "8D",  "8H",  "KS"],
  ["9C",     "QS",  "7C",  "6H",  "5H",  "4H",  "AH",  "9D",  "7H",  "AS"],
  ["10C",    "10S", "8C",  "7H",  "2H",  "3H",  "KH",  "10D", "6H",  "2D"],
  ["QC",     "9S",  "9C",  "8H",  "9H",  "10H", "QH",  "QD",  "5H",  "3D"],
  ["KC",     "8S",  "10C", "QC",  "KC",  "AC",  "AD",  "KD",  "4H",  "4D"],
  ["AC",     "7S",  "6S",  "5S",  "4S",  "3S",  "2S",  "2H",  "3H",  "5D"],
  ["CORNER", "AD",  "KD",  "QD",  "10D", "9D",  "8D",  "7D",  "6D",  "CORNER"]
];

let seqBoard = Array(10).fill(null).map(() => Array(10).fill(null));
let seqLocked = Array(10).fill(false).map(() => Array(10).fill(false));
let seqDeck = [];
let seqDiscards = [];
let seqHands = { p1: [], p2: [] };
let seqTurn = "p1"; // "p1" (You/Blue), "p2" (AI or Local 2/Green)
let seqSelectedCardIdx = null;
let seqP1Sequences = 0;
let seqP2Sequences = 0;
let seqOver = false;
let seqWinner = null;
let seqSnapshots = [];
let seqAiThinking = false;
let seqPrivacyMode = true; // Anti-peeking privacy shield enabled for local 2P
let seqP1HandRevealed = true; // Whether Player 1's hand is revealed
let seqP2HandRevealed = false; // Whether Player 2's hand is revealed
let seqAwaitingDraw = null; // null | "p1" | "p2" (player currently in Draw Phase)

// Helper: Corners
function isSeqCorner(r, c) {
  return (r === 0 || r === 9) && (c === 0 || c === 9);
}

// Helper: Card parsing
function getCardSuit(card) {
  if (!card || card === "CORNER") return "";
  return card.slice(-1);
}

function getCardRank(card) {
  if (!card || card === "CORNER") return "";
  return card.slice(0, -1);
}

function getCardSuitColor(card) {
  const suit = getCardSuit(card);
  return (suit === "H" || suit === "D") ? "suit-red" : "suit-black";
}

function getCardSuitSymbol(card) {
  const suit = getCardSuit(card);
  if (suit === "S") return "♠";
  if (suit === "C") return "♣";
  if (suit === "H") return "♥";
  if (suit === "D") return "♦";
  return "";
}

// Two-Eyed Jacks: Clubs and Diamonds (Wild - place anywhere empty)
function isTwoEyedJack(card) {
  return card === "JC" || card === "JD";
}

// One-Eyed Jacks: Spades and Hearts (Anti-Wild - remove opponent chip if not locked)
function isOneEyedJack(card) {
  return card === "JS" || card === "JH";
}

// Dead card check: standard card whose both board spaces are occupied
function isDeadCard(card, board = seqBoard) {
  if (!card || isTwoEyedJack(card) || isOneEyedJack(card)) return false;
  let occupiedCount = 0;
  let totalSpots = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      if (SEQUENCE_BOARD_LAYOUT[r][c] === card) {
        totalSpots++;
        if (board[r][c] !== null) occupiedCount++;
      }
    }
  }
  return totalSpots > 0 && occupiedCount === totalSpots;
}

// Deck builder: 2 standard 52-card decks (104 cards)
function createSequenceShoe() {
  const suits = ["S", "C", "H", "D"];
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const shoe = [];
  for (let d = 0; d < 2; d++) {
    for (const s of suits) {
      for (const r of ranks) {
        shoe.push(r + s);
      }
    }
  }
  // Shuffle (Fisher-Yates)
  for (let i = shoe.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shoe[i], shoe[j]] = [shoe[j], shoe[i]];
  }
  return shoe;
}

// Draw card from deck (replenishes with shuffled discards if empty)
function drawSequenceCard() {
  if (seqDeck.length === 0) {
    if (seqDiscards.length === 0) return null;
    seqDeck = [...seqDiscards];
    seqDiscards = [];
    for (let i = seqDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [seqDeck[i], seqDeck[j]] = [seqDeck[j], seqDeck[i]];
    }
  }
  return seqDeck.pop() || null;
}

// Save snapshot for undo
function saveSequenceSnapshot() {
  seqSnapshots.push({
    board: seqBoard.map(row => [...row]),
    locked: seqLocked.map(row => [...row]),
    deck: [...seqDeck],
    discards: [...seqDiscards],
    hands: {
      p1: [...seqHands.p1],
      p2: [...seqHands.p2]
    },
    turn: seqTurn,
    p1Sequences: seqP1Sequences,
    p2Sequences: seqP2Sequences,
    over: seqOver,
    winner: seqWinner,
    p1HandRevealed: seqP1HandRevealed,
    p2HandRevealed: seqP2HandRevealed,
    privacyMode: seqPrivacyMode,
    awaitingDraw: seqAwaitingDraw,
    moveCount,
    scoreA, scoreB, scoreD, streak
  });
}

// Undo move
function undoSequenceMove() {
  if (seqAiThinking || seqSnapshots.length === 0) return;

  const isAiMode = modeSelect.value === "sequence-ai";
  // In vs AI mode, undo 2 steps (AI move + human move) if possible so user is back on their turn
  let stepsToUndo = (isAiMode && seqSnapshots.length >= 2) ? 2 : 1;

  let snap = null;
  while (stepsToUndo > 0 && seqSnapshots.length > 0) {
    snap = seqSnapshots.pop();
    stepsToUndo--;
  }
  if (!snap) return;

  seqBoard = snap.board.map(row => [...row]);
  seqLocked = snap.locked.map(row => [...row]);
  seqDeck = [...snap.deck];
  seqDiscards = [...snap.discards];
  seqHands = {
    p1: [...snap.hands.p1],
    p2: [...snap.hands.p2]
  };
  seqTurn = snap.turn;
  seqP1Sequences = snap.p1Sequences;
  seqP2Sequences = snap.p2Sequences;
  seqOver = snap.over;
  seqWinner = snap.winner;
  seqP1HandRevealed = snap.p1HandRevealed ?? true;
  seqP2HandRevealed = snap.p2HandRevealed ?? false;
  seqPrivacyMode = snap.privacyMode ?? true;
  seqAwaitingDraw = snap.awaitingDraw ?? null;
  moveCount = snap.moveCount || 0;
  scoreA = snap.scoreA;
  scoreB = snap.scoreB;
  scoreD = snap.scoreD;
  streak = snap.streak;
  seqSelectedCardIdx = null;

  hideWinScreen();
  renderScores();
  updateMoveCounter(true);
  renderSequenceUI();
  persistLiveState();
}

// Find valid target coordinates on board for a card
function getValidTargetsForCard(card, player = seqTurn, board = seqBoard, locked = seqLocked) {
  if (!card) return [];
  const targets = [];
  const opponent = player === "p1" ? "p2" : "p1";

  if (isTwoEyedJack(card)) {
    // Wild: Any empty, non-corner cell
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (!isSeqCorner(r, c) && board[r][c] === null) {
          targets.push({ r, c, type: "place" });
        }
      }
    }
  } else if (isOneEyedJack(card)) {
    // Removal: Any non-locked opponent chip
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (!isSeqCorner(r, c) && board[r][c] === opponent && !locked[r][c]) {
          targets.push({ r, c, type: "remove" });
        }
      }
    }
  } else {
    // Standard card: Matches layout space and currently unoccupied
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (!isSeqCorner(r, c) && SEQUENCE_BOARD_LAYOUT[r][c] === card && board[r][c] === null) {
          targets.push({ r, c, type: "place" });
        }
      }
    }
  }
  return targets;
}

// Recalculate sequences and locks
function recalculateSequences(board = seqBoard, updateGlobals = (board === seqBoard)) {
  const dirs = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down-right
    [1, -1]   // diagonal down-left
  ];

  function findForPlayer(player) {
    const candidates = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        for (const [dr, dc] of dirs) {
          const line = [];
          let valid = true;
          for (let step = 0; step < 5; step++) {
            const nr = r + dr * step;
            const nc = c + dc * step;
            if (nr < 0 || nr >= 10 || nc < 0 || nc >= 10) {
              valid = false;
              break;
            }
            if (isSeqCorner(nr, nc) || board[nr][nc] === player) {
              line.push([nr, nc]);
            } else {
              valid = false;
              break;
            }
          }
          if (valid && line.length === 5) {
            candidates.push(line);
          }
        }
      }
    }

    // Two sequences can share at most 1 common chip
    const accepted = [];
    for (const line of candidates) {
      let canAdd = true;
      for (const existing of accepted) {
        let sharedNonCorners = 0;
        for (const [er, ec] of existing) {
          if (line.some(([lr, lc]) => lr === er && lc === ec && !isSeqCorner(er, ec))) {
            sharedNonCorners++;
          }
        }
        if (sharedNonCorners > 1) {
          canAdd = false;
          break;
        }
      }
      if (canAdd) accepted.push(line);
    }
    return accepted;
  }

  const p1Seqs = findForPlayer("p1");
  const p2Seqs = findForPlayer("p2");

  if (updateGlobals) {
    seqP1Sequences = p1Seqs.length;
    seqP2Sequences = p2Seqs.length;

    // Reset locks and lock all chips in accepted sequences
    seqLocked = Array(10).fill(false).map(() => Array(10).fill(false));
    [...p1Seqs, ...p2Seqs].forEach(seq => {
      seq.forEach(([r, c]) => {
        if (!isSeqCorner(r, c)) seqLocked[r][c] = true;
      });
    });
  }

  return { p1Seqs, p2Seqs, p1Count: p1Seqs.length, p2Count: p2Seqs.length };
}

// Initialize Sequence Match
function initSequence() {
  seqBoard = Array(10).fill(null).map(() => Array(10).fill(null));
  seqLocked = Array(10).fill(false).map(() => Array(10).fill(false));
  seqDeck = createSequenceShoe();
  seqDiscards = [];
  seqHands = { p1: [], p2: [] };
  seqTurn = "p1";
  seqSelectedCardIdx = null;
  seqP1Sequences = 0;
  seqP2Sequences = 0;
  seqOver = false;
  seqWinner = null;
  seqSnapshots = [];
  seqAiThinking = false;
  seqP1HandRevealed = true;
  seqP2HandRevealed = false;
  seqAwaitingDraw = null;
  moveCount = 0;

  // Deal 6 cards to each player
  for (let i = 0; i < 6; i++) {
    seqHands.p1.push(drawSequenceCard());
    seqHands.p2.push(drawSequenceCard());
  }

  updateMoveCounter(true);
  showOnlyActiveGame("sequence");
  renderSequenceUI();
  startTurnTimer();
}

// Render Complete Sequence UI
function renderSequenceUI() {
  if (hubState.game !== "sequence") return;
  renderSequenceHUD();
  renderSequenceBoard();
  renderSequenceHand();
}

// Render Top HUD Status Bar
function renderSequenceHUD() {
  const isAiMode = modeSelect.value === "sequence-ai";
  if (seqP1Label) seqP1Label.textContent = isAiMode ? "You (Blue)" : "P1 (Blue)";
  if (seqP2Label) seqP2Label.textContent = isAiMode ? `AI (${hubState.difficulty.toUpperCase()})` : "P2 (Green)";

  if (seqP1SeqEl) seqP1SeqEl.textContent = `${seqP1Sequences} / 2`;
  if (seqP2SeqEl) seqP2SeqEl.textContent = `${seqP2Sequences} / 2`;

  if (seqP1ScorePill) seqP1ScorePill.classList.toggle("active-turn", seqTurn === "p1" && !seqOver);
  if (seqP2ScorePill) seqP2ScorePill.classList.toggle("active-turn", seqTurn === "p2" && !seqOver);

  if (seqDeckCount) seqDeckCount.textContent = `${seqDeck.length} cards`;
  if (seqDeckPill) {
    seqDeckPill.classList.toggle("draw-ready", !!seqAwaitingDraw && !seqOver);
  }
  if (seqLastDiscard) {
    if (seqDiscards.length > 0) {
      const top = seqDiscards[seqDiscards.length - 1];
      const rank = getCardRank(top);
      const sym = getCardSuitSymbol(top);
      const col = getCardSuitColor(top);
      seqLastDiscard.innerHTML = `<span class="${col}">${rank}${sym}</span>`;
    } else {
      seqLastDiscard.textContent = "—";
    }
  }

  // Banner prompt text
  if (seqPromptBanner) {
    if (seqOver) {
      seqPromptBanner.textContent = seqWinner === "p1" ? "Victory! 2 sequences completed." : "Game Over! 2 sequences completed.";
    } else if (seqAwaitingDraw) {
      const isHuman = seqAwaitingDraw === "p1" || !isAiMode;
      if (isHuman) {
        const who = seqAwaitingDraw === "p1" ? (isAiMode ? "You" : "Player 1") : "Player 2";
        seqPromptBanner.textContent = `🎴 ${who}: Click 'Pick a Card' (+1) to draw your new card, or End Turn to forfeit it!`;
      } else {
        seqPromptBanner.textContent = "AI is picking a replacement card...";
      }
    } else if (seqAiThinking) {
      seqPromptBanner.textContent = "AI is evaluating optimal plays...";
    } else if (seqSelectedCardIdx !== null) {
      const activeHand = seqHands[seqTurn];
      const selectedCard = activeHand[seqSelectedCardIdx];
      if (isTwoEyedJack(selectedCard)) {
        seqPromptBanner.textContent = "Wild Two-Eyed Jack: Place a chip on ANY empty board space!";
      } else if (isOneEyedJack(selectedCard)) {
        seqPromptBanner.textContent = "One-Eyed Jack: Click an opponent's chip to remove it!";
      } else {
        const rank = getCardRank(selectedCard);
        const sym = getCardSuitSymbol(selectedCard);
        seqPromptBanner.textContent = `Card ${rank}${sym} selected: Click a highlighted spot to place your chip`;
      }
    } else {
      const isCurtained = (seqTurn === "p1" && seqPrivacyMode && !seqP1HandRevealed) || (seqTurn === "p2" && !isAiMode && seqPrivacyMode && !seqP2HandRevealed);
      if (isCurtained) {
        const who = seqTurn === "p1" ? "Player 1" : "Player 2";
        seqPromptBanner.textContent = `${who}: Tap 'Reveal Hand' on your rack to view cards`;
      } else {
        const turnName = seqTurn === "p1" ? (isAiMode ? "Your turn" : "Player 1's turn") : (isAiMode ? "AI turn" : "Player 2's turn");
        seqPromptBanner.textContent = `${turnName}: Select a card from your rack to play`;
      }
    }
  }
}

// Render 10x10 Board Grid
function renderSequenceBoard() {
  if (!sequenceBoardEl) return;
  sequenceBoardEl.innerHTML = "";

  const activeHand = seqHands[seqTurn] || [];
  const selectedCard = seqSelectedCardIdx !== null ? activeHand[seqSelectedCardIdx] : null;
  const validTargets = selectedCard ? getValidTargetsForCard(selectedCard, seqTurn) : [];

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const cellEl = document.createElement("div");
      cellEl.className = "seq-cell";
      cellEl.dataset.r = String(r);
      cellEl.dataset.c = String(c);

      if (isSeqCorner(r, c)) {
        cellEl.classList.add("corner");
        cellEl.innerHTML = `<span class="seq-corner-icon">★</span>`;
      } else {
        const cardCode = SEQUENCE_BOARD_LAYOUT[r][c];
        const rank = getCardRank(cardCode);
        const sym = getCardSuitSymbol(cardCode);
        const colClass = getCardSuitColor(cardCode);

        cellEl.innerHTML = `
          <div class="seq-rank ${colClass}">${rank}</div>
          <div class="seq-suit ${colClass}">${sym}</div>
        `;

        // Chip display
        const occupant = seqBoard[r][c];
        if (occupant) {
          const chipEl = document.createElement("div");
          chipEl.className = `seq-chip ${occupant === "p1" ? "chip-p1" : "chip-p2"}`;
          if (seqLocked[r][c]) {
            chipEl.classList.add("locked");
            chipEl.innerHTML = `<span class="seq-chip-crown">👑</span>`;
          }
          cellEl.appendChild(chipEl);
        }

        // Highlight matching targets for currently selected card
        if (!seqOver && !seqAiThinking && selectedCard) {
          const matchingTarget = validTargets.find(t => t.r === r && t.c === c);
          if (matchingTarget) {
            if (matchingTarget.type === "remove") {
              cellEl.classList.add("target-remove");
            } else {
              cellEl.classList.add("target-valid");
            }
          }
        }
      }

      cellEl.addEventListener("click", () => onSeqCellClick(r, c));
      sequenceBoardEl.appendChild(cellEl);
    }
  }
}

// Render Single Player Shelf (Flanking Extreme Edge Rack)
function renderSinglePlayerShelf({
  playerKey,
  cardsContainer,
  shelfEl,
  titleEl,
  tipEl,
  curtainEl,
  privacyBtnEl,
  drawActionsEl,
  isAi,
  isRevealed,
  isTurn
}) {
  if (!cardsContainer || !shelfEl) return;
  cardsContainer.innerHTML = "";

  const isAiMode = modeSelect.value === "sequence-ai";
  const hand = seqHands[playerKey] || [];

  // Update Title
  if (titleEl) {
    if (playerKey === "p1") {
      titleEl.textContent = isAiMode ? "You (Blue)" : "P1 (Blue)";
    } else {
      titleEl.textContent = isAiMode ? `AI (${hubState.difficulty.toUpperCase()})` : "P2 (Green)";
    }
  }

  // Active / Inactive Turn CSS
  shelfEl.classList.toggle("active-turn", isTurn && !seqOver);
  shelfEl.classList.toggle("inactive-turn", !isTurn && !seqOver);

  // Draw phase actions visibility (Pick a Card / Skip)
  const isAwaitingThisPlayer = (seqAwaitingDraw === playerKey && !seqOver);
  if (drawActionsEl) {
    // Show draw action buttons for human players during draw phase
    drawActionsEl.classList.toggle("hidden", !(isAwaitingThisPlayer && (!isAi || playerKey === "p1")));
  }

  // Determine if cards should be shown face-up
  // 1. AI hand is ALWAYS face-down
  // 2. Inactive player is ALWAYS face-down (Opponent Fog of War)
  // 3. Active player: face-up only if isRevealed is true
  const showFaceUp = !isAi && isTurn && isRevealed;

  // Curtain visibility (Anti-Peeking Cover)
  const shouldShowCurtain = isTurn && !isAi && seqPrivacyMode && !isRevealed && !seqOver;
  if (curtainEl) {
    curtainEl.classList.toggle("hidden", !shouldShowCurtain);
  }

  // Privacy Hide Button in shelf header
  if (privacyBtnEl) {
    privacyBtnEl.classList.toggle("hidden", !(isTurn && !isAi && isRevealed && !seqOver));
  }

  // Shelf Tip / Status Text
  if (tipEl) {
    if (seqOver) {
      tipEl.textContent = `${hand.length} cards`;
    } else if (isAwaitingThisPlayer) {
      tipEl.textContent = "🎴 Pick a Card (+1) or forfeit slot";
    } else if (isAi) {
      tipEl.textContent = `${hand.length} cards (face-down)`;
    } else if (!isTurn) {
      tipEl.textContent = `${hand.length} cards (hidden)`;
    } else if (shouldShowCurtain) {
      tipEl.textContent = "Cards protected • Tap to reveal";
    } else {
      tipEl.textContent = seqSelectedCardIdx !== null ? "Tap board spot to play" : "Tap card to highlight moves";
    }
  }

  // Render Cards (2-column Rack)
  hand.forEach((card, idx) => {
    const cardEl = document.createElement("div");
    cardEl.className = "seq-hand-card";

    if (showFaceUp) {
      // Face-up interactive card
      if (idx === seqSelectedCardIdx) cardEl.classList.add("selected");

      const rank = getCardRank(card);
      const sym = getCardSuitSymbol(card);
      const colClass = getCardSuitColor(card);
      cardEl.classList.add(colClass);

      let badgeHtml = "";
      if (isTwoEyedJack(card)) {
        badgeHtml = `<div class="seq-card-badge badge-wild">WILD</div>`;
      } else if (isOneEyedJack(card)) {
        badgeHtml = `<div class="seq-card-badge badge-remove">REMOVE</div>`;
      } else if (isDeadCard(card)) {
        badgeHtml = `<div class="seq-card-badge badge-dead" title="Both board spots occupied! Click to swap.">SWAP</div>`;
      }

      cardEl.innerHTML = `
        <div class="seq-hand-corner">
          <span class="hc-rank">${rank}</span>
          <span class="hc-suit">${sym}</span>
        </div>
        <div class="seq-hand-center-emblem">${sym}</div>
        ${badgeHtml}
      `;

      cardEl.addEventListener("click", (e) => {
        e.stopPropagation();
        if (seqOver || seqAiThinking || seqAwaitingDraw !== null) return;
        if (isDeadCard(card)) {
          onSeqDeadCardSwap(idx);
        } else {
          onSeqCardSelect(idx);
        }
      });
    } else {
      // Face-down card (Opponent Fog of War / AI / Privacy Curtain)
      cardEl.classList.add("face-down");
      if (isAi) cardEl.classList.add("ai-card");

      const emblem = isAi ? "🤖" : (playerKey === "p1" ? "👑" : "🛡️");
      const brand = isAi ? "AI CORE" : "GAP";

      cardEl.innerHTML = `
        <div class="seq-card-back-pattern">
          <div class="seq-card-back-emblem">${emblem}</div>
          <div class="seq-card-back-brand">${brand}</div>
        </div>
      `;

      // If it's this human player's active turn and cards are concealed, clicking a card reveals hand
      if (isTurn && !isAi && !seqOver && seqAwaitingDraw === null) {
        cardEl.style.cursor = "pointer";
        cardEl.title = "Click to reveal your hand";
        cardEl.addEventListener("click", (e) => {
          e.stopPropagation();
          if (playerKey === "p1") seqP1HandRevealed = true;
          else seqP2HandRevealed = true;
          renderSequenceHUD();
          renderSequenceHand();
        });
      }
    }

    cardsContainer.appendChild(cardEl);
  });
}

// Render Both Player Hand Shelves (Left & Right Flanking Racks)
function renderSequenceHand() {
  const isAiMode = modeSelect.value === "sequence-ai";

  // 1. Left Shelf: Player 1 (Blue)
  renderSinglePlayerShelf({
    playerKey: "p1",
    cardsContainer: seqP1HandCardsEl,
    shelfEl: seqP1HandShelf,
    titleEl: seqP1ShelfTitle,
    tipEl: seqP1ShelfTip,
    curtainEl: seqP1Curtain,
    privacyBtnEl: seqP1PrivacyBtn,
    drawActionsEl: seqP1DrawActions,
    isAi: false,
    isRevealed: seqP1HandRevealed,
    isTurn: seqTurn === "p1"
  });

  // 2. Right Shelf: Player 2 / AI (Green)
  renderSinglePlayerShelf({
    playerKey: "p2",
    cardsContainer: seqP2HandCardsEl,
    shelfEl: seqP2HandShelf,
    titleEl: seqP2ShelfTitle,
    tipEl: seqP2ShelfTip,
    curtainEl: seqP2Curtain,
    privacyBtnEl: seqP2PrivacyBtn,
    drawActionsEl: seqP2DrawActions,
    isAi: isAiMode,
    isRevealed: seqP2HandRevealed,
    isTurn: seqTurn === "p2"
  });

  // 3. Update Privacy Mode Toggle Button in HUD
  if (seqPrivacyModeBtn && seqPrivacyModeText) {
    seqPrivacyModeBtn.classList.toggle("privacy-off", !seqPrivacyMode);
    seqPrivacyModeText.textContent = seqPrivacyMode ? "Shield: ON" : "Shield: OFF";
    seqPrivacyModeBtn.title = seqPrivacyMode
      ? "Anti-peeking privacy shield is ON (hands concealed until revealed)"
      : "Anti-peeking privacy shield is OFF (hands open automatically on turn)";
  }
}

// Hand Card Selection Handler
function onSeqCardSelect(idx) {
  if (seqOver || seqAiThinking || seqAwaitingDraw !== null) return;
  const isAiMode = modeSelect.value === "sequence-ai";
  if (isAiMode && seqTurn === "p2") return;

  if (seqSelectedCardIdx === idx) {
    seqSelectedCardIdx = null; // Toggle deselect
  } else {
    seqSelectedCardIdx = idx;
  }
  renderSequenceHUD();
  renderSequenceBoard();
  renderSequenceHand();
}

// Dead Card Swap Handler
function onSeqDeadCardSwap(idx) {
  if (seqOver || seqAiThinking || seqAwaitingDraw !== null) return;
  const isAiMode = modeSelect.value === "sequence-ai";
  if (isAiMode && seqTurn === "p2") return;

  const currentHand = seqHands[seqTurn];
  const deadCard = currentHand[idx];
  if (!isDeadCard(deadCard)) return;

  saveSequenceSnapshot();

  // Discard dead card
  seqDiscards.push(deadCard);
  // Draw new card
  const newCard = drawSequenceCard();
  currentHand[idx] = newCard;
  seqSelectedCardIdx = null;

  renderSequenceUI();
  if (seqPromptBanner) {
    seqPromptBanner.textContent = `Dead card swapped for a new draw! Pick a card to play.`;
  }
  persistLiveState();
}

// Cell Click Handler
function onSeqCellClick(r, c) {
  if (seqOver || seqAiThinking) return;
  if (seqAwaitingDraw !== null) {
    if (seqPromptBanner) seqPromptBanner.textContent = "Please pick a card (+1) or skip to finish your turn!";
    return;
  }
  const isAiMode = modeSelect.value === "sequence-ai";
  if (isAiMode && seqTurn === "p2") return;
  if (seqSelectedCardIdx === null) {
    if (seqPromptBanner) seqPromptBanner.textContent = "Select a card from your hand first!";
    return;
  }

  const activeHand = seqHands[seqTurn];
  const selectedCard = activeHand[seqSelectedCardIdx];
  const validTargets = getValidTargetsForCard(selectedCard, seqTurn);
  const target = validTargets.find(t => t.r === r && t.c === c);

  if (!target) return; // Invalid cell clicked

  executeSequenceMove(seqSelectedCardIdx, r, c);
}

// Execute Move (place/remove chip, remove used card from hand, enter draw phase)
function executeSequenceMove(cardIdx, r, c) {
  saveSequenceSnapshot();

  const activeHand = seqHands[seqTurn];
  // Remove the chosen card from the player's hand list
  const playedCard = activeHand.splice(cardIdx, 1)[0];

  if (isOneEyedJack(playedCard)) {
    // Remove opponent chip
    seqBoard[r][c] = null;
  } else {
    // Place friendly chip
    seqBoard[r][c] = seqTurn;
  }

  // Discard played card
  seqDiscards.push(playedCard);
  seqSelectedCardIdx = null;

  moveCount++;
  updateMoveCounter(true);

  // Recalculate sequences
  recalculateSequences();

  // Check victory (2 sequences needed)
  if (seqP1Sequences >= 2) {
    seqOver = true;
    seqWinner = "p1";
    scoreA++;
    updateStreak(true);
    persistScores();
    renderScores();
    renderSequenceUI();
    showWinScreen("YOU COMPLETED 2 SEQUENCES!", "Sequence Grand Master Victory!");
    persistLiveState();
    return;
  }

  if (seqP2Sequences >= 2) {
    seqOver = true;
    seqWinner = "p2";
    scoreB++;
    updateStreak(false);
    persistScores();
    renderScores();
    renderSequenceUI();
    const isAiMode = modeSelect.value === "sequence-ai";
    if (isAiMode) {
      showDefeatScreen("AI COMPLETED 2 SEQUENCES!", "Better luck in the next game!");
    } else {
      showWinScreen("PLAYER 2 (GREEN) WINS!", "2 Sequences Completed!");
    }
    persistLiveState();
    return;
  }

  // Enter Draw Phase: Player must click 'Pick a Card' (+1) or skip (loss of card slot)
  seqAwaitingDraw = seqTurn;
  renderSequenceUI();
  persistLiveState();

  // If AI just made its move, AI picks a card after 550ms
  const isAiMode = modeSelect.value === "sequence-ai";
  if (isAiMode && seqTurn === "p2") {
    setTimeout(() => {
      pickSequenceCard("p2");
    }, 550);
  }
}

// Pick a Card from Shoe (Interactive Draw Phase)
function pickSequenceCard(playerKey) {
  if (seqAwaitingDraw !== playerKey || seqOver) return;
  const newCard = drawSequenceCard();
  if (newCard) {
    seqHands[playerKey].push(newCard);
  }
  seqAwaitingDraw = null;
  advanceSequenceTurn(true, playerKey);
}

// Skip Draw (Forfeit Card - Permanently lose card slot on player's side)
function skipSequenceCardDraw(playerKey) {
  if (seqAwaitingDraw !== playerKey || seqOver) return;
  seqAwaitingDraw = null;
  advanceSequenceTurn(false, playerKey);
}

// Advance Turn after Draw / Skip
function advanceSequenceTurn(didDraw, previousPlayer) {
  const isAiMode = modeSelect.value === "sequence-ai";
  seqTurn = (seqTurn === "p1") ? "p2" : "p1";
  if (seqTurn === "p1") {
    seqP2HandRevealed = false;
    seqP1HandRevealed = !seqPrivacyMode;
  } else {
    seqP1HandRevealed = false;
    seqP2HandRevealed = isAiMode ? false : !seqPrivacyMode;
  }
  renderSequenceUI();

  if (!didDraw && seqPromptBanner) {
    const who = previousPlayer === "p1" ? (isAiMode ? "You" : "Player 1") : (isAiMode ? "AI" : "Player 2");
    seqPromptBanner.textContent = `⚠️ ${who} did not pick a card and lost 1 card slot!`;
  }
  persistLiveState();

  // AI Turn Trigger
  if (!seqOver && isAiMode && seqTurn === "p2") {
    seqAiThinking = true;
    renderSequenceHUD();
    setTimeout(() => {
      executeSequenceAiTurn();
    }, 650);
  }
}

// Sequence AI Heuristic Engine
function executeSequenceAiTurn() {
  seqAiThinking = false;
  if (seqOver || seqTurn !== "p2") return;

  const aiHand = seqHands.p2;

  // 1. Check for any dead cards and auto-swap them
  for (let i = 0; i < aiHand.length; i++) {
    if (isDeadCard(aiHand[i])) {
      seqDiscards.push(aiHand[i]);
      aiHand[i] = drawSequenceCard();
      renderSequenceHUD();
      break; // Swapped 1 dead card, continue evaluation
    }
  }

  // 2. Gather all possible moves across all cards in AI's hand
  const candidateMoves = [];
  aiHand.forEach((card, cardIdx) => {
    if (!card) return;
    const targets = getValidTargetsForCard(card, "p2");
    targets.forEach(t => {
      candidateMoves.push({
        cardIdx,
        card,
        r: t.r,
        c: t.c,
        type: t.type,
        score: evaluateSequenceMove(card, t.r, t.c, t.type)
      });
    });
  });

  if (candidateMoves.length === 0) {
    // No legal moves; discard first non-wild card if possible and draw fresh
    if (aiHand.length > 0) {
      seqDiscards.push(aiHand[0]);
      aiHand[0] = drawSequenceCard();
    }
    seqTurn = "p1";
    renderSequenceUI();
    persistLiveState();
    return;
  }

  // Difficulty adjustment
  const diff = hubState.difficulty || "medium";
  let chosenMove = null;

  if (diff === "easy") {
    // Easy: Pick random move
    chosenMove = candidateMoves[Math.floor(Math.random() * candidateMoves.length)];
  } else {
    // Medium and Hard: Sort by heuristic score descending
    candidateMoves.sort((a, b) => b.score - a.score);
    if (diff === "medium") {
      // Medium: 80% best move, 20% second/third best
      const topPool = candidateMoves.slice(0, Math.min(3, candidateMoves.length));
      chosenMove = Math.random() < 0.8 ? topPool[0] : topPool[Math.floor(Math.random() * topPool.length)];
    } else {
      // Hard: Always optimal best move
      chosenMove = candidateMoves[0];
    }
  }

  if (chosenMove) {
    executeSequenceMove(chosenMove.cardIdx, chosenMove.r, chosenMove.c);
  }
}

// Evaluate Move Heuristic Score
function evaluateSequenceMove(card, r, c, type) {
  // Simulate board
  const simBoard = seqBoard.map(row => [...row]);

  if (type === "remove") {
    // One-Eyed Jack removal of opponent chip
    simBoard[r][c] = null;
    // Removing opponent chip that breaks their long lines is highly scored
    let threatBroken = 0;
    const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
    dirs.forEach(([dr, dc]) => {
      let p1Count = 0;
      for (let s = -4; s <= 4; s++) {
        const nr = r + dr * s;
        const nc = c + dc * s;
        if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
          if (seqBoard[nr][nc] === "p1") p1Count++;
        }
      }
      if (p1Count >= 4) threatBroken += 8000;
      else if (p1Count >= 3) threatBroken += 2000;
      else if (p1Count >= 2) threatBroken += 400;
    });
    return 1500 + threatBroken;
  }

  // Place chip
  simBoard[r][c] = "p2";

  // Check if this move completes a sequence without corrupting live game state
  const baseP2 = seqP2Sequences;
  const baseP1 = seqP1Sequences;
  const { p2Count: simP2Count } = recalculateSequences(simBoard, false);
  if (simP2Count >= 2) return 500000; // Immediate match victory!
  if (simP2Count > baseP2) return 50000; // Completes sequence!

  // Check if opponent would have completed a sequence on this spot if they had it
  const oppSimBoard = seqBoard.map(row => [...row]);
  oppSimBoard[r][c] = "p1";
  const { p1Count: oppCount } = recalculateSequences(oppSimBoard, false);
  if (oppCount > baseP1) return 25000; // Crucial block!

  let score = 0;
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];

  dirs.forEach(([dr, dc]) => {
    // Inspect 5-cell windows passing through (r, c)
    for (let offset = 0; offset < 5; offset++) {
      let aiCount = 0;
      let oppCount = 0;
      let cornerCount = 0;
      let valid = true;

      for (let step = 0; step < 5; step++) {
        const nr = r + dr * (step - offset);
        const nc = c + dc * (step - offset);
        if (nr < 0 || nr >= 10 || nc < 0 || nc >= 10) {
          valid = false;
          break;
        }
        if (isSeqCorner(nr, nc)) cornerCount++;
        else if (simBoard[nr][nc] === "p2") aiCount++;
        else if (simBoard[nr][nc] === "p1") oppCount++;
      }

      if (valid) {
        if (oppCount === 0) {
          // Open friendly window
          const friendlyTotal = aiCount + cornerCount;
          if (friendlyTotal === 4) score += 3000;
          else if (friendlyTotal === 3) score += 600;
          else if (friendlyTotal === 2) score += 120;
          else score += 25;
        } else if (aiCount === 1 && oppCount >= 3) {
          // Blocked opponent window
          score += oppCount * 150;
        }
      }
    }
  });

  // Corner proximity bonus
  if ((r <= 1 || r >= 8) && (c <= 1 || c >= 8)) score += 60;
  // Center board bonus
  const distFromCenter = Math.abs(4.5 - r) + Math.abs(4.5 - c);
  score += Math.max(0, 30 - distFromCenter * 3);

  // Wild Two-Eyed Jack conservation: only use if score is high
  if (isTwoEyedJack(card) && score < 1000) {
    score -= 800; // Hold wildcard for crucial moment
  }

  return score;
}

// Sequence Anti-Peeking Privacy Event Handlers
seqPrivacyModeBtn?.addEventListener("click", () => {
  seqPrivacyMode = !seqPrivacyMode;
  if (!seqPrivacyMode) {
    if (seqTurn === "p1") seqP1HandRevealed = true;
    else if (modeSelect.value !== "sequence-ai") seqP2HandRevealed = true;
  }
  renderSequenceHUD();
  renderSequenceHand();
});

seqP1RevealBtn?.addEventListener("click", () => {
  seqP1HandRevealed = true;
  renderSequenceHUD();
  renderSequenceHand();
});

seqP1PrivacyBtn?.addEventListener("click", () => {
  seqP1HandRevealed = false;
  seqSelectedCardIdx = null;
  renderSequenceHUD();
  renderSequenceHand();
  renderSequenceBoard();
});

seqP2RevealBtn?.addEventListener("click", () => {
  seqP2HandRevealed = true;
  renderSequenceHUD();
  renderSequenceHand();
});

seqP2PrivacyBtn?.addEventListener("click", () => {
  seqP2HandRevealed = false;
  seqSelectedCardIdx = null;
  renderSequenceHUD();
  renderSequenceHand();
  renderSequenceBoard();
});

// Sequence Draw Actions Event Listeners (Pick a Card / Skip)
seqP1PickCardBtn?.addEventListener("click", () => pickSequenceCard("p1"));
seqP1SkipDrawBtn?.addEventListener("click", () => skipSequenceCardDraw("p1"));

seqP2PickCardBtn?.addEventListener("click", () => pickSequenceCard("p2"));
seqP2SkipDrawBtn?.addEventListener("click", () => skipSequenceCardDraw("p2"));

seqDeckPill?.addEventListener("click", () => {
  if (seqAwaitingDraw && !seqOver) {
    pickSequenceCard(seqAwaitingDraw);
  }
});

/* ==========================================================================
   Pattukunte Pattucheera (Tollywood Movie Guesser) Engine
   ========================================================================== */

// Curated offline puzzle library for classic & blockbuster Tollywood films
const PATTU_OFFLINE_PUZZLES = [
  {
    movie: "Khushi",
    year: 2001,
    director: "S. J. Suryah",
    hero: "Pawan Kalyan",
    heroine: "Bhumika Chawla",
    clues: [
      "Opening: Two children born on the exact same day in different parts of India, connected by destiny.",
      "College in Calcutta: Ego clashes, youthful pride, and the legendary umbrella moment.",
      "Iconic scene: The famous midriff look altercation on temple steps with Mani Sharma BGM.",
      "Chartbusters: 'Ammaye Sannaga', 'Cheliya Cheliya', and Pawan Kalyan's martial arts stunts.",
      "Climax: Siddu and Madhumati reunite at their friends' wedding after a heartfelt airport chase."
    ]
  },
  {
    movie: "RRR",
    year: 2022,
    director: "S. S. Rajamouli",
    hero: "NTR Jr & Ram Charan",
    heroine: "Alia Bhatt",
    clues: [
      "Epic opening: A fearless warrior fighting a tiger in the deep forests of Adilabad.",
      "Pre-interval: Animal stampede truck crash with blazing torches at the Governor's palace.",
      "Oscar Winning Song: The earth-shattering 'Naatu Naatu' dance-off against British officers.",
      "Dosti: Fire & Water brotherhood forged under a railway bridge rescuing a trapped boy.",
      "Climax: Alluri Sitarama Raju wielding bow and fiery arrows atop Komaram Bheem's shoulders."
    ]
  },
  {
    movie: "Pokiri",
    year: 2006,
    director: "Puri Jagannadh",
    hero: "Mahesh Babu",
    heroine: "Ileana D'Cruz",
    clues: [
      "Dialogue: 'Evadu kodithe dimma thirigi mind block aypothadho, aade Pandu gaadu!'",
      "Setting: Hyderabad underworld gang wars between Ali Bhai and Narayana.",
      "Heroine meets hero in an elevator scene; aerobics instructor love track.",
      "Chartbuster Songs: 'Gala Gala Paruthunna', 'Dole Dole', and 'Devuda'.",
      "Massive Twist: Pandu is revealed to be IPS Officer Krishna Manohar undercover!"
    ]
  },
  {
    movie: "Athadu",
    year: 2005,
    director: "Trivikram Srinivas",
    hero: "Mahesh Babu",
    heroine: "Trisha",
    clues: [
      "Plot: A professional sniper hired for a mock assassination gets framed when the politician is actually shot.",
      "Village backdrop: Pardhu enters an eccentric joint family in Basarlapudi claiming to be their grandson.",
      "Subtle Romance: Puri (Trisha) constantly annoying the silent and disciplined Nandu.",
      "Iconic dialogues and KV Guhan's bullet-time rain fight sequence at the old church.",
      "Climax: Sadhu (Sonu Sood) faces Nandu in the snowy glass factory; 'Nijam cheppakapovadam abaddham'."
    ]
  },
  {
    movie: "Magadheera",
    year: 2009,
    director: "S. S. Rajamouli",
    hero: "Ram Charan",
    heroine: "Kajal Aggarwal",
    clues: [
      "Theme: 400-year-old reincarnation love story connecting 1609 AD to modern day Hyderabad.",
      "Setting: The kingdom of Udaigarh protected by royal warriors.",
      "Legendary Battle: 1 vs 100 soldiers fight at the Bhairavakona cliff edge.",
      "Memorable track: 'Bangaru Kodipetta' remix and 'Panchadara Bomma'.",
      "Climax: Harsha remembers his past life as Kala Bhairava and defeats Ranadev Billa atop the cliff."
    ]
  },
  {
    movie: "Baahubali: The Beginning",
    year: 2015,
    director: "S. S. Rajamouli",
    hero: "Prabhas",
    heroine: "Anushka Shetty & Tamannaah",
    clues: [
      "Opening: Queen Sivagami drowning in the river holding a baby above water with one arm.",
      "Shivudu lifting a gigantic Shivalinga and placing it under the roaring waterfall.",
      "Kattappa's fierce loyalty to the royal throne of Mahishmati.",
      "War against Kalakeya: Trishula vyuhas, burning cloths launched with catapults, and Kilikili language.",
      "The Ultimate Cliffhanger: Kattappa kneels and admits he killed Amarendra Baahubali."
    ]
  },
  {
    movie: "Ala Vaikunthapurramuloo",
    year: 2020,
    director: "Trivikram Srinivas",
    hero: "Allu Arjun",
    heroine: "Pooja Hegde",
    clues: [
      "Baby swap at birth by a jealous clerk Valmiki in a hospital ward.",
      "Boardroom dance sequence featuring evergreen South Indian hits.",
      "Global musical sensation songs composed by Thaman S: 'Butta Bomma' and 'Samajavaragamana'.",
      "Hero's stylish yellow blazer, rolling up pants, and cigarette tucking signature mannerisms.",
      "Climax: Bantu confronts Appala Naidu at port container yard without his real parents ever knowing the swap."
    ]
  },
  {
    movie: "Jersey",
    year: 2019,
    director: "Gowtam Tinnanuri",
    hero: "Nani",
    heroine: "Shraddha Srinath",
    clues: [
      "Emotional core: A former Ranji cricketer in his late 30s strives to buy an Indian team jersey for his son.",
      "Setting: Hyderabad 1996; financial hardships, domestic tension, and raw love.",
      "Railway station scream: Arjun vents tears of joy when selected for the state team.",
      "Soul-stirring score by Anirudh Ravichander; 'Padhe Padhe' and 'Spirit of Jersey'.",
      "Heartbreaking reveal: Arjun had an underlying cardiac condition but chose pride over fear."
    ]
  },
  {
    movie: "Pushpa: The Rise",
    year: 2021,
    director: "Sukumar",
    hero: "Allu Arjun",
    heroine: "Rashmika Mandanna",
    clues: [
      "Setting: Red Sanders smuggling in the dense Seshachalam forests of Rayalaseema.",
      "Signature gesture: Rubbing hand under chin and saying 'Thaggedhe Le!'",
      "Songs: 'Oo Antava Mava', 'Srivalli' tilted walk, and 'Saami Saami'.",
      "Rise of a coolie into the supreme kingpin outsmarting the Konda Reddy brothers.",
      "Climax: Pushparaj burns his shirt in front of SP Bhanwar Singh Shekhawat (Fahadh Faasil)."
    ]
  },
  {
    movie: "DJ Tillu",
    year: 2022,
    director: "Vimal Krishna",
    hero: "Siddu Jonnalagadda",
    heroine: "Neha Shetty",
    clues: [
      "Hero: A flamboyant local DJ from Hyderabad in loud floral shirts and golden rings.",
      "Catchphrase: 'Radhikaaa!' and quirky dialogues that became instant social media pop culture.",
      "Plot: Entangled in an accidental murder mystery on his first night with his dream girl.",
      "Songs: The infectious wedding anthem 'Tillu Anna DJ Pedithe'.",
      "Hospital and police interrogation scenes packed with non-stop Hyderabadi comedy."
    ]
  },
  {
    movie: "Eega",
    year: 2012,
    director: "S. S. Rajamouli",
    hero: "Nani & Sudeep",
    heroine: "Samantha",
    clues: [
      "Unique premise: A murdered lover reincarnates as a housefly seeking revenge on the villain.",
      "Villain: Wealthy playboy Sudeep driven to pure madness by a persistent, buzzing insect.",
      "Micro-workout scenes: The fly lifting toothpicks and training to be a lethal weapon.",
      "Creative attacks: Tampering with brakes, writing in tea dust, and short-circuiting heavy machinery.",
      "Climax: Fly sacrifices itself through needle-and-matchstick fire explosion to incinerate Sudeep."
    ]
  },
  {
    movie: "Kalki 2898 AD",
    year: 2024,
    director: "Nag Ashwin",
    hero: "Prabhas, Amitabh Bachchan, Kamal Haasan",
    heroine: "Deepika Padukone",
    clues: [
      "Setting: Dystopian Kasi in year 2898 AD and the mysterious floating city 'The Complex'.",
      "Immortal guardian: Ashwatthama guarding the womb of the prophesied tenth avatar.",
      "Bounty hunter Bhairava and his AI companion vehicle Bujji.",
      "Mythological Mahabharata prologue during the Kurukshetra war with Sanjaya and Lord Krishna.",
      "Climax: Bhairava picks up the divine bow Vijaya and unleashes the spirit of Karna!"
    ]
  },
  {
    movie: "Hi Nanna",
    year: 2023,
    director: "Shauryuv",
    hero: "Nani",
    heroine: "Mrunal Thakur",
    clues: [
      "Story: A fashion photographer father Viraj raising his six-year-old daughter Mahi with cystic fibrosis.",
      "Plot device: Father narrates the mother's story as a fairytale without revealing the real truth.",
      "Yashna forms an instant maternal bond with Mahi in Mumbai and Coonoor.",
      "Emotional music by Hesham Abdul Wahab: 'Samayama' and 'Ammaadi'.",
      "Twist: Yashna is actually Mahi's biological mother Varsha who lost her memory in an accident."
    ]
  },
  {
    movie: "Arjun Reddy",
    year: 2017,
    director: "Sandeep Reddy Vanga",
    hero: "Vijay Deverakonda",
    heroine: "Shalini Pandey",
    clues: [
      "Character: A brilliant house surgeon with extreme anger management issues and boundless passion.",
      "College in Mangalore: St. Mary's medical college and football field confrontations.",
      "Iconic pet dog 'Preethi', sunglasses, unkempt beard, and Enfield Royal ride.",
      "Music by Radhan: 'Emitemitemo' and 'Madhuram'.",
      "Climax: Years later in a park, Arjun meets Preethi again and learns the truth about her child."
    ]
  },
  {
    movie: "Geetha Govindam",
    year: 2018,
    director: "Parasuram",
    hero: "Vijay Deverakonda",
    heroine: "Rashmika Mandanna",
    clues: [
      "Inciting incident: An innocent misunderstanding and accidental selfie on an overnight RTC bus.",
      "Hero: Vijay Govind, a traditional and polite college lecturer who dreams of an ideal family.",
      "Complication: Geetha happens to be the bride's sister at his cousin's upcoming wedding.",
      "Mega Chartbuster: 'Inkem Inkem Inkem Kaavaale' sung by Sid Sriram.",
      "Climax: Geetha realizes Vijay's pure golden character when he defends her honor before relatives."
    ]
  },
  {
    movie: "Bommarillu",
    year: 2006,
    director: "Bhaskar",
    hero: "Siddharth",
    heroine: "Genelia D'Souza",
    clues: [
      "Theme: Overbearing paternal love and hyper-controlling father-son relationship.",
      "Prakash Raj as Aravind: 'Nee manchike chepthunnanu Siddu'.",
      "Genelia's bubbly character Hasini: 'Haaa... Siiiii... Niiii!'.",
      "Classic track: 'Apudo Ipudo Epudo' and 'Oye Oye'.",
      "Climax monologue: Siddu breaks down in the rain asking his father for freedom to make his own mistakes."
    ]
  },
  {
    movie: "Manam",
    year: 2014,
    director: "Vikram Kumar",
    hero: "ANR, Nagarjuna, Naga Chaitanya",
    heroine: "Samantha & Shriya Saran",
    clues: [
      "Legendary landmark: Three generations of the Akkineni family acting together.",
      "Concept: Reincarnation where parents are reborn as younger people and meet their child as an older man.",
      "Nageswara Rao played by ANR in his glorious final screen appearance.",
      "Anoop Rubens' melodious title song 'Manam' and 'Kani Penchina'.",
      "Climax: Preventing the clock tower car accident at 10:20 AM and bringing both couples together."
    ]
  },
  {
    movie: "Sita Ramam",
    year: 2022,
    director: "Hanu Raghavapudi",
    hero: "Dulquer Salmaan",
    heroine: "Mrunal Thakur & Rashmika Mandanna",
    clues: [
      "Setting: 1965 Kashmir border; Lieutenant Ram, an orphaned army officer receiving letters from across India.",
      "Mystery woman: Sita Mahalakshmi who secretly happens to be Princess Noor Jahan of Hyderabad.",
      "Afreen travels across Pakistan and India in 1985 to deliver a 20-year-old undelivered letter.",
      "Vishal Chandrashekhar's timeless soundtrack: 'Inthandham' and 'Kaanunna Kalyanam'.",
      "Tragic & beautiful climax: Ram's final letter is delivered, clearing his name of treason."
    ]
  },
  {
    movie: "Devara: Part 1",
    year: 2024,
    director: "Koratala Siva",
    hero: "NTR Jr",
    heroine: "Janhvi Kapoor",
    clues: [
      "Coastal setting: The Red Sea shores and four clans involved in dangerous high-seas smuggling.",
      "Fear theme: 'Bhayam ane daaniki roopam untundhi, adhe Devara!'",
      "Music by Anirudh: The thunderous 'Fear Song', 'Chuttamalle', and 'Daavudi'.",
      "Double role: Father Devara and his seemingly timid son Vara.",
      "Interval & Climax: Blood-soaked sea battle on boats and the shocking revelation on the cliff."
    ]
  }
];

// Fallback embedded Tollywood movies list (over 120 popular movies bundled offline)
let PATTU_MOVIES = [
  "1 - Nenokkadine", "100% Love", "13 B", "35 Chinna Katha Kaadu", "7/g Brundhavan Colony", "7th sense",
  "A Aa", "Aa Naluguru", "Aa Okkati Adakku", "Aadavari Matalaku Ardhalu Verule", "Aadi", "Aagadu", "Aalasyam Amrutam",
  "Agent Sai Srinivasa Athreya", "Akhanda", "Ala Vaikunthapurramuloo", "Amma Nanna O Tamila Ammayi", "Anand", "Ante Sundaraniki",
  "Anukokunda Oka Roju", "Aparichithudu", "Arjun Reddy", "Arya", "Arya 2", "Ashta Chamma", "Athadu", "Atharintiki Daaredi",
  "Awaara", "Baahubali: The Beginning", "Baahubali 2: The Conclusion", "Badri", "Balagam", "Balu", "Bangarraju", "Bendu Theesta",
  "Bhagavanth Kesari", "Bharat Ane Nenu", "Bheeshma", "Bheemla Nayak", "Bimbisara", "Businessman", "Bommarillu", "Brochevarevarura",
  "C/o Kancharapalem", "Chakram", "Chandramukhi", "Chatrapathi", "Cheli", "Chirutha", "Cinema Bandi", "Colour Photo", "Dasara",
  "Devara: Part 1", "Dhamaka", "Dhruva", "DJ Tillu", "Dookudu", "Drushyam", "Drushyam 2", "Eagle", "Eega", "Evaru", "F2: Fun and Frustration",
  "F3: Fun and Frustration", "Gaami", "Gabbar Singh", "Gamyam", "Geetha Govindam", "Ghajini", "Githanjali", "Godavari", "Goodachari",
  "Gopala Gopala", "Guntur Kaaram", "Hanu-Man", "Happy Days", "Hi Nanna", "Hit: The First Case", "Hit: The Second Case", "Ishq", "Jagadam",
  "Janatha Garage", "Jersey", "Julayi", "Kalki 2898 AD", "Kantara", "Karthikeya", "Karthikeya 2", "Keedaa Cola", "Khaleja", "Khushi",
  "Konda Polam", "Krack", "Kshanam", "Leader", "Love Story", "MAD", "Magadheera", "Mahanati", "Major", "Manam", "Mangalavaaram",
  "Maryada Ramanna", "Maska", "Mathu Vadalara", "Mathu Vadalara 2", "Middle Class Melodies", "Mirchi", "Mr. Perfect", "Naa Autograph",
  "Nani", "Nenunnanu", "Ninne Pelladata", "Nuvve Kavali", "Nuvve Nuvve", "Nuvvostanante Nenoddantana", "Okkadu", "Oopiri",
  "Panjaa", "Pelli Choopulu", "Pokiri", "Prasthanam", "Pushpa: The Rise", "Pushpa 2: The Rule", "Race Gurram", "Radhe Shyam",
  "Rangasthalam", "Ready", "Robo", "RRR", "Salaar: Part 1 – Ceasefire", "Samajavaragamana", "Sarileru Neekevvaru", "Sarkaru Vaari Paata",
  "Sathamanam Bhavati", "Seethamma Vakitlo Sirimalle Chettu", "Shiva", "Shyam Singha Roy", "Simhadri", "Sir", "Sita Ramam", "Srimanthudu",
  "Subhash Chandra Bose", "Surya s/o Krishnan", "Tagore", "Temper", "Thammudu", "Tholi Prema", "Tillu Square", "Uppena", "Vakeel Saab",
  "Varsham", "Vedam", "Veta", "Virupaksha", "Waltair Veerayya", "Yamadonga", "Ye Maaya Chesave"
];

const PATTU_BUNDLED_DAYS = [
  { day: 1610, movie: "Shivamani" },
  { day: 1609, movie: "Dil" },
  { day: 1608, movie: "Jayam Manadera" },
  { day: 1607, movie: "Shivaji" },
  { day: 1606, movie: "Raja Raja Chora" },
  { day: 1605, movie: "Robo" },
  { day: 1604, movie: "Aakali Rajyam" },
  { day: 1603, movie: "Ninnu Kori" },
  { day: 1602, movie: "Indra" },
  { day: 1601, movie: "Jaanu" },
  { day: 1600, movie: "Premam" },
  { day: 1599, movie: "Parugu" },
  { day: 1598, movie: "Maska" },
  { day: 1597, movie: "Chal Mohan Ranga" },
  { day: 1587, movie: "Dear Comrade" },
  { day: 1582, movie: "Ye Maaya Chesave" },
  { day: 1577, movie: "Sarrainodu" },
  { day: 1574, movie: "Manam" },
  { day: 1571, movie: "Jersey" }
];

const PATTU_S3_BASE = "https://pattukunte-pattucheera-movies.s3.amazonaws.com";

// Async loader to pull official movies list from S3 & local fallback
(function loadExtendedTollywoodDatabase() {
  fetch(`${PATTU_S3_BASE}/movies.json`)
    .then(r => r.json())
    .then(movies => {
      if (Array.isArray(movies) && movies.length > 0) {
        const merged = new Set([...PATTU_MOVIES, ...movies]);
        PATTU_MOVIES = Array.from(merged).sort((a, b) => a.localeCompare(b));
      }
    })
    .catch(() => {
      // Offline fallback to local data/tollywood-movies.json
      fetch("data/tollywood-movies.json")
        .then(r => r.json())
        .then(data => {
          if (data && Array.isArray(data.movies) && data.movies.length > 0) {
            const merged = new Set([...PATTU_MOVIES, ...data.movies]);
            PATTU_MOVIES = Array.from(merged).sort((a, b) => a.localeCompare(b));
          }
        })
        .catch(() => {});
    });
})();

// Pattu Game State
let pattuCurrentPuzzle = PATTU_OFFLINE_PUZZLES[0];
let pattuCurrentDay = 1;
let pattuAttempt = 1;
let pattuActiveFrame = 1;
let pattuGuesses = [];
let pattuOver = false;
let pattuWon = false;
let pattuStreak = 0;
let pattuSelectedDropIndex = -1;

function getPattuDayCount() {
  const origin = new Date("2022-05-22T18:30:00.000Z");
  const now = new Date();
  const diffSec = (now.getTime() - origin.getTime()) / 1000;
  return Math.max(0, Math.floor(diffSec / 86400));
}

const PATTU_ORIGIN_MS = new Date("2022-05-22T18:30:00.000Z").getTime();

function pattuDayToDateStr(dayNum) {
  const targetMs = PATTU_ORIGIN_MS + dayNum * 86400000;
  const istDate = new Date(targetMs + (5.5 * 3600 * 1000));
  const y = istDate.getUTCFullYear();
  const m = String(istDate.getUTCMonth() + 1).padStart(2, "0");
  const d = String(istDate.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function pattuDateStrToDay(dateStr) {
  if (!dateStr) return 0;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return 0;
  const [y, m, d] = parts;
  const targetUtcMs = Date.UTC(y, m - 1, d) - (5.5 * 3600 * 1000);
  const diffMs = targetUtcMs - PATTU_ORIGIN_MS;
  const dayNum = Math.round(diffMs / 86400000);
  return Math.max(0, dayNum);
}

function formatPattuDisplayDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return dateStr;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parts[1] - 1]} ${parts[2]}, ${parts[0]}`;
}

function normalizePattuTitle(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

function loadPattuStats() {
  try {
    const saved = JSON.parse(localStorage.getItem("gap_pattu_stats") || "{}");
    pattuStreak = saved.currentStreak || saved.streak || 0;
    return saved;
  } catch {
    pattuStreak = 0;
    return {};
  }
}

function savePattuStats(won, attemptNumber) {
  try {
    const saved = JSON.parse(localStorage.getItem("gap_pattu_stats") || "{}");
    saved.gamesPlayed = (saved.gamesPlayed || 0) + 1;
    if (won) {
      saved.gamesWon = (saved.gamesWon || 0) + 1;
      pattuStreak++;
      saved.currentStreak = pattuStreak;
      saved.maxStreak = Math.max(saved.maxStreak || 0, pattuStreak);
      const dist = saved.guessDistribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
      if (attemptNumber >= 1 && attemptNumber <= 5) {
        dist[String(attemptNumber)] = (dist[String(attemptNumber)] || 0) + 1;
      }
      saved.guessDistribution = dist;
    } else {
      pattuStreak = 0;
      saved.currentStreak = 0;
    }
    localStorage.setItem("gap_pattu_stats", JSON.stringify(saved));
  } catch {}
}

function initPattu(targetDay = null) {
  showOnlyActiveGame("pattu");
  loadPattuStats();
  const todayDay = getPattuDayCount();
  pattuCurrentDay = (typeof targetDay === "number" && targetDay >= 0) ? targetDay : todayDay;

  // Pre-seed with bundled offline movie for this day
  const bundled = PATTU_BUNDLED_DAYS.find(b => b.day === pattuCurrentDay) ||
    PATTU_BUNDLED_DAYS[Math.abs(pattuCurrentDay) % PATTU_BUNDLED_DAYS.length];
  pattuCurrentPuzzle = {
    movie: bundled ? bundled.movie : "Shivamani",
    movieFromS3: true
  };

  const applyMeta = (meta) => {
    if (meta && meta.movie) {
      pattuCurrentPuzzle.movie = meta.movie;
      pattuCurrentPuzzle.contributor = meta.contributor || "";
      pattuCurrentPuzzle.twitterId = meta.twitterId || "";
      pattuCurrentPuzzle.movieFromS3 = true;
      if (!PATTU_MOVIES.includes(meta.movie)) {
        PATTU_MOVIES.push(meta.movie);
        PATTU_MOVIES.sort((a, b) => a.localeCompare(b));
      }
      renderPattuUI();
    }
  };

  // 1. Load local offline package metadata (instant over local host / LAN)
  fetch(`data/stills/${pattuCurrentDay}/meta-data.json`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(applyMeta)
    .catch(() => {
      fetch("data/daily/meta-data.json")
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(applyMeta)
        .catch(() => {});
    });

  // 2. Fetch latest upstream metadata if online
  if (navigator.onLine) {
    fetch(`${PATTU_S3_BASE}/${pattuCurrentDay}/meta-data.json`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(applyMeta)
      .catch(() => {});
  }

  // Preload all 5 movie stills for this day right away
  preloadPattuPuzzle(pattuCurrentDay);

  pattuAttempt = 1;
  pattuActiveFrame = 1;
  pattuGuesses = [];
  pattuOver = false;
  pattuWon = false;
  pattuSelectedDropIndex = -1;

  if (pattuInputEl) pattuInputEl.value = "";
  pattuDropdownEl?.classList.add("hidden");
  pattuClearBtn?.classList.add("hidden");
  pattuResultBannerEl?.classList.add("hidden");
  pattuSearchWrap?.classList.remove("hidden");

  renderPattuUI();
  renderPattuFrame(1);
}

function renderPattuUI() {
  const hudDayText = document.getElementById("pattuHudDayText");
  if (hudDayText) hudDayText.textContent = `Day #${pattuCurrentDay}`;

  // 1. Frame Number Buttons: 1, 2, 3, 4, 5 (Numbers only, no "Step", no "Active" label)
  if (pattuFramePillsEl) {
    let tabsHtml = "";
    for (let i = 1; i <= 5; i++) {
      const isActive = (i === pattuActiveFrame);
      const guess = pattuGuesses[i - 1];
      let tabClass = "pattu-num-tab";
      let tabContent = `${i}`;
      let tabTitle = `Frame ${i}`;

      if (guess) {
        if (guess.status === "skipped" || guess.status === "wrong") {
          tabClass += " wrong";
          tabContent = "❌";
          tabTitle = `Frame ${i}: Skipped / Wrong`;
        } else if (guess.status === "correct") {
          tabClass += " correct";
          tabContent = "✅";
          tabTitle = `Frame ${i}: Correct!`;
        }
      }

      if (isActive) {
        tabClass += " active";
      }

      tabsHtml += `<button class="${tabClass}" data-frame="${i}" type="button" title="${tabTitle}">${tabContent}</button>`;
    }
    pattuFramePillsEl.innerHTML = tabsHtml;
  }

  // 2. Skip Button
  const skipWrap = pattuSkipBtn?.closest(".pattu-skip-wrap");
  if (skipWrap) {
    if (pattuOver) skipWrap.classList.add("hidden");
    else skipWrap.classList.remove("hidden");
  }

  // 3. Search Row
  if (pattuSearchWrap) {
    if (pattuOver) pattuSearchWrap.classList.add("hidden");
    else pattuSearchWrap.classList.remove("hidden");
  }

  // 4. Guesses Remaining Counter (hidden on game over so result banner fits without scrolling)
  if (pattuRemainingTextEl) {
    if (!pattuOver) {
      const remaining = 6 - pattuAttempt;
      const countColor = remaining >= 4 ? "#22c55e" : (remaining === 3 ? "#f59e0b" : "#ef4444");
      pattuRemainingTextEl.innerHTML = `You got <span class="rem-count" style="color:${countColor}">${remaining}</span> guesses remaining out of <b style="color:#22c55e">5</b>.`;
      pattuRemainingTextEl.classList.remove("hidden");
    } else {
      pattuRemainingTextEl.classList.add("hidden");
    }
  }

  // 5. Guess History: Skipped steps are indicated directly by ❌ on the frame tabs;
  // only show named movie guesses during gameplay if any, and hide completely on game over
  if (pattuHistoryEl) {
    const namedGuesses = pattuGuesses.filter(g => g.status !== "skipped");
    if (!pattuOver && namedGuesses.length > 0) {
      let histHtml = "";
      namedGuesses.forEach(g => {
        if (g.status === "correct") {
          histHtml += `
            <div class="pattu-hist-card correct">
              <span class="pattu-hist-icon">✅</span>
              <span class="pattu-hist-text">${g.text}</span>
            </div>`;
        } else if (g.status === "wrong") {
          histHtml += `
            <div class="pattu-hist-card wrong">
              <span class="pattu-hist-icon">❌</span>
              <span class="pattu-hist-text">${g.text}</span>
            </div>`;
        }
      });
      pattuHistoryEl.innerHTML = histHtml;
      pattuHistoryEl.classList.remove("hidden");
    } else {
      pattuHistoryEl.innerHTML = "";
      pattuHistoryEl.classList.add("hidden");
    }
  }

  // 6. Result Banner / Modal Card (positioned directly below frame tabs)
  if (pattuOver) {
    if (pattuResultBannerEl) {
      pattuResultBannerEl.classList.remove("hidden");
      if (pattuWon) {
        pattuResultBannerEl.classList.remove("lost");
        pattuResultBannerEl.classList.add("won");
        if (pattuResultTitleEl) {
          pattuResultTitleEl.textContent = "🎉 Splendid! You Guessed It!";
          pattuResultTitleEl.style.color = "#22c55e";
        }
      } else {
        pattuResultBannerEl.classList.remove("won");
        pattuResultBannerEl.classList.add("lost");
        if (pattuResultTitleEl) {
          pattuResultTitleEl.textContent = "💔 The Answer Was:";
          pattuResultTitleEl.style.color = "#ef4444";
        }
      }
      if (pattuResultMovieEl) {
        pattuResultMovieEl.textContent = pattuCurrentPuzzle.movie;
      }
      if (pattuResultSubEl) {
        pattuResultSubEl.textContent = `Day #${pattuCurrentDay}${pattuCurrentPuzzle.contributor ? " • Contributed by @" + pattuCurrentPuzzle.contributor : ""}`;
      }
    }
  } else {
    pattuResultBannerEl?.classList.add("hidden");
  }
}

function updatePattuConnectionBadge() {
  const dot = document.getElementById("pattuBadgeDot");
  if (!dot) return;
  if (navigator.onLine) {
    dot.className = "pattu-badge-dot online";
    dot.title = "Live Cloud Stills (Online)";
  } else {
    dot.className = "pattu-badge-dot offline";
    dot.title = "Offline Host Mode (15 Local Tollywood Stills Active)";
  }
}

window.addEventListener("online", () => {
  updatePattuConnectionBadge();
  if (hubState.game === "pattu") renderPattuFrame(pattuActiveFrame);
});
window.addEventListener("offline", () => {
  updatePattuConnectionBadge();
});

const PATTU_PRELOAD_CACHE = new Map();

function getPattuCandidateUrls(day, frameNum) {
  const urls = [];
  // 1. Direct local still for this exact day (from our offline package)
  urls.push(`data/stills/${day}/${frameNum}.jpg`);

  // 2. Direct online S3 & fast CDN proxies for this exact day
  urls.push(`${PATTU_S3_BASE}/${day}/${frameNum}.jpg`);
  urls.push(`https://wsrv.nl/?url=pattukunte-pattucheera-movies.s3.amazonaws.com/${day}/${frameNum}.jpg`);
  urls.push(`https://images.weserv.nl/?url=pattukunte-pattucheera-movies.s3.amazonaws.com/${day}/${frameNum}.jpg`);

  // 3. Local daily folder (if viewing today's day)
  if (day === getPattuDayCount()) {
    urls.push(`data/daily/${frameNum}.jpg`);
  }

  // 4. Offline fallback to nearest bundled day if day is unavailable
  const fallbackEntry = PATTU_BUNDLED_DAYS.find(b => b.day === day) ||
    PATTU_BUNDLED_DAYS[Math.abs(day) % PATTU_BUNDLED_DAYS.length];
  if (fallbackEntry && fallbackEntry.day !== day) {
    urls.push(`data/stills/${fallbackEntry.day}/${frameNum}.jpg`);
  }
  return urls;
}

function preloadPattuPuzzle(day) {
  for (let f = 1; f <= 5; f++) {
    const key = `${day}_${f}`;
    if (PATTU_PRELOAD_CACHE.has(key)) continue;
    const candidates = getPattuCandidateUrls(day, f);
    let idx = 0;
    const preImg = new Image();
    const tryNext = () => {
      if (idx < candidates.length) {
        preImg.src = candidates[idx++];
      }
    };
    preImg.onload = () => {
      PATTU_PRELOAD_CACHE.set(key, preImg.src);
    };
    preImg.onerror = () => {
      tryNext();
    };
    tryNext();
  }
}

function renderPattuFrame(frameNum) {
  pattuActiveFrame = frameNum;

  // Highlight active number tab
  pattuFramePillsEl?.querySelectorAll(".pattu-num-tab, .pattu-frame-tab, .pc-step-card").forEach(tab => {
    const f = Number(tab.dataset.frame);
    const isThis = (f === frameNum);
    tab.classList.toggle("active", isThis);
    tab.classList.toggle("viewing-active", isThis);
  });

  if (!pattuImgEl) return;

  const showClueFallback = () => {
    if (pattuImgEl) pattuImgEl.style.display = "none";
    if (pattuFallbackCardEl) {
      pattuFallbackCardEl.classList.remove("hidden");
      if (pattuFallbackTagEl) pattuFallbackTagEl.textContent = `FRAME ${frameNum} OF 5`;
      const clues = (pattuCurrentPuzzle && pattuCurrentPuzzle.clues) || [];
      const hasMatchingClues = pattuCurrentPuzzle && clues.length > 0 && !pattuCurrentPuzzle.movieFromS3;
      if (pattuFallbackClueEl) {
        pattuFallbackClueEl.textContent = (hasMatchingClues && clues[frameNum - 1])
          ? clues[frameNum - 1]
          : `Tollywood Scene Frame #${frameNum}`;
      }
      if (pattuFallbackSubEl) {
        pattuFallbackSubEl.textContent = (hasMatchingClues && pattuCurrentPuzzle.hero)
          ? `Starring: ${pattuCurrentPuzzle.hero} • Dir: ${pattuCurrentPuzzle.director || "Tollywood"}`
          : (pattuCurrentPuzzle.contributor
              ? `Contributed by @${pattuCurrentPuzzle.contributor}`
              : `Tollywood Cinema Archives (Day #${pattuCurrentDay})`);
      }
    }
  };

  pattuImgEl.style.display = "block";
  pattuFallbackCardEl?.classList.add("hidden");

  const key = `${pattuCurrentDay}_${frameNum}`;
  const candidateUrls = getPattuCandidateUrls(pattuCurrentDay, frameNum);

  // If already in preload cache, display immediately
  if (PATTU_PRELOAD_CACHE.has(key)) {
    const cachedUrl = PATTU_PRELOAD_CACHE.get(key);
    pattuImgEl.onload = () => {
      pattuImgEl.style.display = "block";
      pattuFallbackCardEl?.classList.add("hidden");
    };
    pattuImgEl.onerror = () => {
      PATTU_PRELOAD_CACHE.delete(key);
      tryCandidates(0);
    };
    pattuImgEl.src = cachedUrl;
    if (pattuImgEl.complete && pattuImgEl.naturalWidth > 0) {
      pattuImgEl.style.display = "block";
      pattuFallbackCardEl?.classList.add("hidden");
    }
    return;
  }

  function tryCandidates(idx) {
    if (idx >= candidateUrls.length) {
      showClueFallback();
      return;
    }
    const currentUrl = candidateUrls[idx];
    let resolved = false;
    pattuImgEl.onload = () => {
      if (resolved) return;
      resolved = true;
      pattuImgEl.style.display = "block";
      pattuFallbackCardEl?.classList.add("hidden");
      PATTU_PRELOAD_CACHE.set(key, currentUrl);
    };
    pattuImgEl.onerror = () => {
      if (resolved) return;
      resolved = true;
      tryCandidates(idx + 1);
    };
    pattuImgEl.src = currentUrl;
  }

  tryCandidates(0);
}

// Autocomplete filter
function filterPattuSuggestions(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PATTU_MOVIES
    .filter(m => m.toLowerCase().includes(q))
    .slice(0, 8);
}

function renderPattuDropdown(matches) {
  if (!pattuDropdownEl) return;
  if (!matches.length) {
    pattuDropdownEl.innerHTML = `<div class="pattu-drop-item" style="opacity:0.6; cursor:default;">No Telugu movie found matching "${pattuInputEl?.value || ""}"</div>`;
    pattuDropdownEl.classList.remove("hidden");
    pattuSelectedDropIndex = -1;
    return;
  }

  pattuDropdownEl.innerHTML = matches.map((m, idx) => `
    <div class="pattu-drop-item" data-index="${idx}" data-movie="${m}">${m}</div>
  `).join("");
  pattuDropdownEl.classList.remove("hidden");
  pattuSelectedDropIndex = -1;
}

function submitPattuGuess(guessedName) {
  if (pattuOver) return;
  const name = guessedName ? guessedName.trim() : (pattuInputEl?.value || "").trim();
  if (!name) {
    pattuInputEl?.focus();
    return;
  }

  const normGuess = normalizePattuTitle(name);
  const normTarget = normalizePattuTitle(pattuCurrentPuzzle.movie);

  const isCorrect = (normGuess === normTarget);

  if (isCorrect) {
    pattuWon = true;
    pattuOver = true;
    pattuGuesses.push({ status: "correct", text: pattuCurrentPuzzle.movie });
    savePattuStats(true, pattuAttempt);
    triggerConfetti();
    renderPattuUI();
    renderPattuFrame(pattuActiveFrame);
    persistLiveState();
  } else {
    pattuGuesses.push({ status: "wrong", text: name });
    pattuAttempt++;
    if (pattuAttempt > 5) {
      pattuOver = true;
      pattuWon = false;
      savePattuStats(false, 5);
      renderPattuUI();
      renderPattuFrame(pattuActiveFrame);
      persistLiveState();
    } else {
      pattuActiveFrame = pattuAttempt;
      renderPattuUI();
      renderPattuFrame(pattuAttempt);
      persistLiveState();
    }
  }

  if (pattuInputEl) pattuInputEl.value = "";
  pattuDropdownEl?.classList.add("hidden");
  pattuClearBtn?.classList.add("hidden");
}

function skipPattuAttempt() {
  if (pattuOver) return;
  pattuGuesses.push({ status: "skipped", text: "Skipped" });
  pattuAttempt++;

  if (pattuAttempt > 5) {
    pattuOver = true;
    pattuWon = false;
    savePattuStats(false, 5);
    renderPattuUI();
    renderPattuFrame(pattuActiveFrame);
    persistLiveState();
  } else {
    pattuActiveFrame = pattuAttempt;
    renderPattuUI();
    renderPattuFrame(pattuAttempt);
    persistLiveState();
  }

  if (pattuInputEl) pattuInputEl.value = "";
  pattuDropdownEl?.classList.add("hidden");
  pattuClearBtn?.classList.add("hidden");
}

// Modal helper: Stats
function renderPattuStatsModal() {
  const saved = loadPattuStats();
  const played = saved.gamesPlayed || 0;
  const won = saved.gamesWon || 0;
  const winPct = played > 0 ? Math.round((won / played) * 100) : 0;
  const curStreak = saved.currentStreak || 0;
  const maxStreak = saved.maxStreak || 0;
  const dist = saved.guessDistribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

  if (pattuStatPlayedEl) pattuStatPlayedEl.textContent = String(played);
  if (pattuStatWinPctEl) pattuStatWinPctEl.textContent = `${winPct}%`;
  if (pattuStatStreakEl) pattuStatStreakEl.textContent = String(curStreak);
  if (pattuStatMaxStreakEl) pattuStatMaxStreakEl.textContent = String(maxStreak);

  if (pattuDistChartEl) {
    let maxCount = 1;
    for (let k = 1; k <= 5; k++) {
      if (dist[k] > maxCount) maxCount = dist[k];
    }
    let chartHtml = "";
    for (let k = 1; k <= 5; k++) {
      const count = dist[k] || 0;
      const pct = Math.max(8, Math.round((count / maxCount) * 100));
      chartHtml += `
        <div class="pattu-dist-row">
          <span style="width:14px; text-align:center; font-weight:700;">${k}</span>
          <div style="flex:1;">
            <div class="pattu-dist-bar ${count > 0 ? 'highlight' : ''}" style="width:${pct}%;">${count}</div>
          </div>
        </div>`;
    }
    pattuDistChartEl.innerHTML = chartHtml;
  }

  pattuStatsCustomModal?.classList.remove("hidden");
}

// Pattu DOM Event Listeners
pattuInputEl?.addEventListener("focus", () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
});

pattuInputEl?.addEventListener("input", (e) => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  const val = e.target.value;
  pattuClearBtn?.classList.toggle("hidden", !val);
  if (!val.trim()) {
    pattuDropdownEl?.classList.add("hidden");
    return;
  }
  const matches = filterPattuSuggestions(val);
  renderPattuDropdown(matches);
});

pattuInputEl?.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    const items = pattuDropdownEl?.querySelectorAll(".pattu-drop-item[data-movie]");
    if (!items || !items.length) return;
    pattuSelectedDropIndex = (pattuSelectedDropIndex + 1) % items.length;
    items.forEach((it, idx) => it.classList.toggle("selected", idx === pattuSelectedDropIndex));
    const targetItem = items[pattuSelectedDropIndex];
    if (targetItem) {
      if (targetItem.dataset.movie && pattuInputEl) {
        pattuInputEl.value = targetItem.dataset.movie;
        pattuClearBtn?.classList.remove("hidden");
      }
      if (pattuDropdownEl) {
        targetItem.scrollIntoView?.({ block: "nearest", inline: "nearest" });
        window.scrollTo(0, 0);
      }
    }
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    const items = pattuDropdownEl?.querySelectorAll(".pattu-drop-item[data-movie]");
    if (!items || !items.length) return;
    pattuSelectedDropIndex = (pattuSelectedDropIndex - 1 + items.length) % items.length;
    items.forEach((it, idx) => it.classList.toggle("selected", idx === pattuSelectedDropIndex));
    const targetItem = items[pattuSelectedDropIndex];
    if (targetItem) {
      if (targetItem.dataset.movie && pattuInputEl) {
        pattuInputEl.value = targetItem.dataset.movie;
        pattuClearBtn?.classList.remove("hidden");
      }
      if (pattuDropdownEl) {
        targetItem.scrollIntoView?.({ block: "nearest", inline: "nearest" });
        window.scrollTo(0, 0);
      }
    }
  } else if (e.key === "Enter") {
    e.preventDefault();
    const items = pattuDropdownEl?.querySelectorAll(".pattu-drop-item[data-movie]");
    if (items && pattuSelectedDropIndex >= 0 && items[pattuSelectedDropIndex]) {
      const selectedMovie = items[pattuSelectedDropIndex].dataset.movie;
      if (pattuInputEl) pattuInputEl.value = selectedMovie;
      pattuDropdownEl?.classList.add("hidden");
      pattuSelectedDropIndex = -1;
      submitPattuGuess(selectedMovie);
    } else {
      pattuDropdownEl?.classList.add("hidden");
      submitPattuGuess();
    }
  } else if (e.key === "Escape") {
    pattuDropdownEl?.classList.add("hidden");
  }
});

function selectPattuSuggestion(movie) {
  if (!movie) return;
  if (pattuInputEl) {
    pattuInputEl.value = movie;
  }
  pattuClearBtn?.classList.remove("hidden");
  pattuDropdownEl?.classList.add("hidden");
  pattuSelectedDropIndex = -1;
  pattuInputEl?.focus();
}

pattuDropdownEl?.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
});

pattuDropdownEl?.addEventListener("mousedown", (e) => {
  e.stopPropagation();
});

pattuDropdownEl?.addEventListener("click", (e) => {
  const item = e.target.closest(".pattu-drop-item[data-movie]");
  if (!item) return;
  const movie = item.dataset.movie;
  selectPattuSuggestion(movie);
});

// Dropdown chevron click to expand suggestions
document.querySelector(".pattu-dropdown-chevron")?.parentElement?.addEventListener("click", () => {
  if (pattuDropdownEl?.classList.contains("hidden")) {
    const matches = filterPattuSuggestions(pattuInputEl?.value || "");
    renderPattuDropdown(matches.length ? matches : PATTU_MOVIES.slice(0, 8));
    pattuInputEl?.focus();
  } else {
    pattuDropdownEl?.classList.add("hidden");
  }
});

pattuClearBtn?.addEventListener("click", () => {
  if (pattuInputEl) pattuInputEl.value = "";
  pattuClearBtn?.classList.add("hidden");
  pattuDropdownEl?.classList.add("hidden");
  pattuInputEl?.focus();
});

pattuSubmitBtn?.addEventListener("click", () => submitPattuGuess());
pattuSkipBtn?.addEventListener("click", () => skipPattuAttempt());
// Frame navigation buttons delegation
pattuFramePillsEl?.addEventListener("click", (e) => {
  const tab = e.target.closest(".pattu-num-tab, .pc-step-card, .pattu-frame-tab");
  if (!tab) return;
  const f = Number(tab.dataset.frame);
  if (f < 1 || f > 5) return;

  if (pattuOver || f <= pattuAttempt) {
    // Review previously revealed/skipped frame or browsing after game end
    renderPattuFrame(f);
  } else {
    // Jumping forward to a future unreached frame (e.g. from 1 to 2):
    // Automatically count prior frame(s) as skipped!
    while (pattuAttempt < f && !pattuOver) {
      skipPattuAttempt();
    }
    renderPattuFrame(f);
  }
});

// Right Edge Time Travel Button trigger
document.getElementById("pcTimeTravelEdgeBtn")?.addEventListener("click", () => {
  pattuTimeTravelBtn?.click();
});

// Instructions Modal
pattuHelpBtn?.addEventListener("click", () => {
  pattuInstructionsModal?.classList.remove("hidden");
});
closePattuHelpBtn?.addEventListener("click", () => {
  pattuInstructionsModal?.classList.add("hidden");
});

// Time Travel Modal (Interactive Calendar Date Picker)
pattuTimeTravelBtn?.addEventListener("click", () => {
  const todayDay = getPattuDayCount();
  const minDate = "2022-05-23";
  const maxDate = pattuDayToDateStr(todayDay);

  if (pattuTtCurrentDayText) pattuTtCurrentDayText.textContent = `#${pattuCurrentDay}`;
  if (pattuMaxDayText) pattuMaxDayText.textContent = String(todayDay);

  // Default to currently viewed day (clamped between 0 and today)
  const defaultSelectedDay = Math.min(todayDay, Math.max(0, pattuCurrentDay));
  const defaultDateStr = pattuDayToDateStr(defaultSelectedDay);

  if (pattuDateInput) {
    pattuDateInput.min = minDate;
    pattuDateInput.max = maxDate;
    pattuDateInput.value = defaultDateStr;
  }
  if (pattuDayInput) {
    pattuDayInput.min = "0";
    pattuDayInput.max = String(todayDay);
    pattuDayInput.value = String(defaultSelectedDay);
  }

  if (pattuTtTargetDay) pattuTtTargetDay.textContent = `Day #${defaultSelectedDay}`;
  if (pattuTtFormattedDate) pattuTtFormattedDate.textContent = formatPattuDisplayDate(defaultDateStr);
  pattuTtManualWrap?.classList.add("hidden");
  pattuTimeTravelModal?.classList.remove("hidden");
});

function handlePattuDateSelection() {
  const maxDay = getPattuDayCount();
  const day = pattuDateStrToDay(pattuDateInput.value);
  const clampedDay = Math.min(maxDay, Math.max(0, day));
  if (pattuDayInput) pattuDayInput.value = String(clampedDay);
  if (pattuTtTargetDay) pattuTtTargetDay.textContent = `Day #${clampedDay}`;
  if (pattuTtFormattedDate) pattuTtFormattedDate.textContent = formatPattuDisplayDate(pattuDateInput.value);
}

pattuDateInput?.addEventListener("click", () => {
  try { pattuDateInput.showPicker(); } catch {}
});
pattuDateInput?.addEventListener("input", handlePattuDateSelection);
pattuDateInput?.addEventListener("change", handlePattuDateSelection);

function handlePattuDayNumberInput() {
  const maxDay = getPattuDayCount();
  let day = parseInt(pattuDayInput.value, 10);
  if (isNaN(day) || day < 0) day = 0;
  if (day > maxDay) day = maxDay;
  const dateStr = pattuDayToDateStr(day);
  if (pattuDateInput) pattuDateInput.value = dateStr;
  if (pattuTtTargetDay) pattuTtTargetDay.textContent = `Day #${day}`;
  if (pattuTtFormattedDate) pattuTtFormattedDate.textContent = formatPattuDisplayDate(dateStr);
}

pattuDayInput?.addEventListener("input", handlePattuDayNumberInput);
pattuDayInput?.addEventListener("change", handlePattuDayNumberInput);

pattuToggleDayNumBtn?.addEventListener("click", () => {
  pattuTtManualWrap?.classList.toggle("hidden");
  if (!pattuTtManualWrap?.classList.contains("hidden")) {
    pattuDayInput?.focus();
  }
});

closePattuTimeTravelBtn?.addEventListener("click", () => {
  pattuTimeTravelModal?.classList.add("hidden");
});

submitPattuTimeTravelBtn?.addEventListener("click", () => {
  const maxDay = getPattuDayCount();
  const isManual = pattuTtManualWrap && !pattuTtManualWrap.classList.contains("hidden");
  let val = isManual ? parseInt(pattuDayInput?.value, 10) : pattuDateStrToDay(pattuDateInput?.value);
  if (isNaN(val) || val < 0) {
    val = parseInt(pattuDayInput?.value, 10);
  }
  if (isNaN(val) || val < 0) {
    val = pattuDateStrToDay(pattuDateInput?.value);
  }
  if (isNaN(val) || val < 0) val = 0;
  if (val > maxDay) val = maxDay;

  pattuTimeTravelModal?.classList.add("hidden");
  initPattu(val);
});

// Stats Modal
pattuStatsBtn?.addEventListener("click", renderPattuStatsModal);
closePattuStatsModalBtn?.addEventListener("click", () => {
  pattuStatsCustomModal?.classList.add("hidden");
});

// Share Button
pattuShareBtn?.addEventListener("click", () => {
  let shareResult = `Pattukunte Pattucheera Day #${pattuCurrentDay} ${pattuWon ? pattuGuesses.length : "X"}/5\n`;
  pattuGuesses.forEach(g => {
    if (g.status === "correct") shareResult += "🟩";
    else shareResult += "🟥";
  });
  shareResult += "\nPlay on GAP Gaming Hub!";

  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareResult).then(() => {
      const origText = pattuShareBtn.textContent;
      pattuShareBtn.textContent = "Copied! ✓";
      setTimeout(() => { pattuShareBtn.textContent = origText; }, 2000);
    });
  }
});

// Next Movie Button (loads another past day puzzle)
pattuNextBtn?.addEventListener("click", () => {
  const maxDay = getPattuDayCount();
  const randomDay = Math.floor(Math.random() * (maxDay + 1));
  initPattu(randomDay);
});

document.addEventListener("click", (e) => {
  if (!pattuInputEl?.contains(e.target) && !pattuDropdownEl?.contains(e.target) && !e.target.closest(".pattu-input-addon")) {
    pattuDropdownEl?.classList.add("hidden");
  }
  // Click outside to close modals
  if (e.target === pattuInstructionsModal) pattuInstructionsModal.classList.add("hidden");
  if (e.target === pattuTimeTravelModal) pattuTimeTravelModal.classList.add("hidden");
  if (e.target === pattuStatsCustomModal) pattuStatsCustomModal.classList.add("hidden");
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
    },
    sequence: {
      board: seqBoard,
      locked: seqLocked,
      deck: seqDeck,
      discards: seqDiscards,
      hands: seqHands,
      turn: seqTurn,
      p1Sequences: seqP1Sequences,
      p2Sequences: seqP2Sequences,
      over: seqOver,
      winner: seqWinner
    },
    pattu: {
      puzzle: pattuCurrentPuzzle,
      day: pattuCurrentDay,
      attempt: pattuAttempt,
      activeFrame: pattuActiveFrame,
      guesses: pattuGuesses,
      over: pattuOver,
      won: pattuWon
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

    // Guard: Only restore live state if the saved mode matches the current requested game!
    const currentMode = hubState.game || "ttt3";
    const currentNorm = currentMode.startsWith("ttt") ? "ttt" : currentMode;
    const savedNorm = s.mode.startsWith("ttt") ? "ttt" : s.mode;
    if (currentNorm !== savedNorm) {
      return false;
    }

    if (s.hubState) {
      const prevGame = hubState.game;
      Object.assign(hubState, s.hubState);
      if (prevGame) hubState.game = prevGame;
    }
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

    if (s.mode && s.mode.startsWith("sequence") && s.sequence) {
      seqBoard = Array.isArray(s.sequence.board) ? s.sequence.board : Array(10).fill(null).map(() => Array(10).fill(null));
      seqLocked = Array.isArray(s.sequence.locked) ? s.sequence.locked : Array(10).fill(false).map(() => Array(10).fill(false));
      seqDeck = Array.isArray(s.sequence.deck) ? s.sequence.deck : [];
      seqDiscards = Array.isArray(s.sequence.discards) ? s.sequence.discards : [];
      seqHands = s.sequence.hands || { p1: [], p2: [] };
      seqTurn = s.sequence.turn || "p1";
      seqP1Sequences = s.sequence.p1Sequences || 0;
      seqP2Sequences = s.sequence.p2Sequences || 0;
      seqOver = !!s.sequence.over;
      seqWinner = s.sequence.winner || null;
      seqSelectedCardIdx = null;
      seqSnapshots = [];
      updateMoveCounter(true);
      showOnlyActiveGame("sequence");
      renderSequenceUI();
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
      if (!looksValid || chessOver) return false;

      updateMoveCounter(true);
      renderCaptured();
      renderChess();
      return true;
    }

    if (s.mode && s.mode.startsWith("poker")) {
      initPoker(false);
      return true;
    }

    if (s.mode === "pattu") {
      const todayDay = getPattuDayCount();
      if (s.pattu && s.pattu.day === todayDay && !s.pattu.over) {
        pattuCurrentDay = s.pattu.day;
        pattuCurrentPuzzle = s.pattu.puzzle || PATTU_OFFLINE_PUZZLES[0];
        pattuAttempt = s.pattu.attempt || 1;
        pattuActiveFrame = s.pattu.activeFrame || 1;
        pattuGuesses = Array.isArray(s.pattu.guesses) ? s.pattu.guesses : [];
        pattuOver = !!s.pattu.over;
        pattuWon = !!s.pattu.won;
        preloadPattuPuzzle(pattuCurrentDay);
        showOnlyActiveGame("pattu");
        renderPattuUI();
        renderPattuFrame(pattuActiveFrame);
      } else {
        initPattu();
      }
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
    if (k === "2") { hubState.game = "sequence"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    if (k === "3") { hubState.game = "chess"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    if (k === "5") { hubState.game = "poker"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    if (k === "6") { hubState.game = "pattu"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
    return;
  }

  // Global shortcuts for TTT, Chess, Wordle, Poker, Pattu, Sequence
  if (k === "1") { hubState.game = "ttt3"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
  if (k === "2") { hubState.game = "sequence"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
  if (k === "3") { hubState.game = "chess"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
  if (k === "4") { hubState.game = "wordle"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
  if (k === "5") { hubState.game = "poker"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }
  if (k === "6") { hubState.game = "pattu"; modeSelect.value = modeFromHub(); syncHud(); persistHub(); initBoard(true); return; }

  if (k === "R") { newGameBtn?.click(); return; }
  if (k === "Z") { undoBtn?.click(); return; }
});

/* ---------- Timer Expiration ---------- */
function onTimerExpired() {
  const mode = modeSelect.value;
  if (mode.startsWith("sequence") && !seqOver) {
    if (seqAwaitingDraw) {
      skipSequenceCardDraw(seqAwaitingDraw);
    }
    return;
  }
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
  if (hubState.game === "poker" || hubState.game === "pattu") {
    return;
  }
  if (hubState.game === "sequence") {
    undoSequenceMove();
    return;
  }
  const mode = modeSelect.value;
  const isChessGame = (hubState.game === "chess") || mode.startsWith("chess");
  if (!isChessGame && mode.startsWith("ttt")) {
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
  if (chessAiTimer) {
    clearTimeout(chessAiTimer);
    chessAiTimer = null;
  }
  const s = chessSnapshots.pop();
  if (!s) return;
  chessBoard = cloneBoard(s.board); chessTurn = s.turn; chessSelected = s.selected; chessOver = s.over;
  whiteCaptured = [...s.whiteCaptured]; blackCaptured = [...s.blackCaptured];
  if (s.enPassant !== undefined) chessEnPassant = s.enPassant;
  if (s.halfmoveClock !== undefined) chessHalfmoveClock = s.halfmoveClock;
  if (s.positionHistory !== undefined) chessPositionHistory = { ...s.positionHistory };
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

chessHintsBtn?.addEventListener("click", () => {
  resetIdleWatchdog();
  chessShowMoveHints = !chessShowMoveHints;
  chessHintsBtn.classList.toggle("active", chessShowMoveHints);
  chessHintsBtn.setAttribute("aria-pressed", chessShowMoveHints ? "true" : "false");
  renderChess();
});



/* ---------- HUD Bar Events ---------- */
gameTypePills?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-game]");
  if (!btn) return;
  const targetGame = btn.dataset.game;
  if (targetGame === "palace") {
    window.location.href = "palace-escape/";
    return;
  }
  if (targetGame === "passiton" || targetGame === "pass-it-on") {
    window.location.href = "pass-it-on/";
    return;
  }
  if (targetGame === "ttt") {
    hubState.game = hubState.lastTttMode || "ttt3";
  } else {
    hubState.game = targetGame;
  }
  if (hubState.game.startsWith("ttt")) hubState.lastTttMode = hubState.game;
  modeSelect.value = modeFromHub();
  syncHud();
  persistHub();
  initBoard(true);
  showGameView(hubState.game);
  location.hash = "#/" + hubState.game;
});

tttModePills?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-grid]");
  if (!btn) return;
  const grid = btn.dataset.grid;
  const targetGame = grid === "5" ? "ttt5" : "ttt3";
  hubState.game = targetGame;
  hubState.lastTttMode = targetGame;
  modeSelect.value = modeFromHub();
  syncHud();
  persistHub();
  initBoard(true);
  showGameView(targetGame);
  location.hash = "#/" + targetGame;
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
  if (hubState.game === "ludo") {
    ludoState.difficulty = hubState.difficulty;
    updateLudoTurnUI(`Difficulty: ${hubState.difficulty.toUpperCase()}`);
  } else if (hubState.game === "wordle") initWordle();
  if (hubState.game === "sequence") renderSequenceHUD();
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

  if (!forceFresh && hubState.game !== "ludo" && hubState.game !== "snake") {
    const restored = restoreLiveStateIfAny();
    if (restored) {
      syncHud();
      showOnlyActiveGame(hubState.game);
      startTurnTimer();
      persistHub();
      return;
    }
  }

  if (modeSelect) modeSelect.value = modeFromHub();
  if (hubState.game === "wordle") initWordle();
  else if (hubState.game === "sequence") initSequence();
  else if (hubState.game === "poker") initPoker();
  else if (hubState.game === "pattu") initPattu();
  else if (hubState.game === "ludo") initLudo(forceFresh);
  else if (hubState.game === "snake") initSnake(forceFresh);
  else if (hubState.game === "ttt3") initTTT(3);
  else if (hubState.game === "ttt5") initTTT(5);
  else initChess();

  showOnlyActiveGame(hubState.game);
  startTurnTimer();
  persistHub();
  persistLiveState();
}

/* ---------- Horizontal Stage Dragger for 2-Player Side-by-Side Play ---------- */
function initStageDragger() {
  const stage = document.getElementById("arenaStage");
  if (!stage) return;

  let isPointerDown = false;
  let dragActive = false;
  let startX = 0;
  let startY = 0;
  let currentStageX = 0;
  let currentStageY = 0;
  let initialStageX = 0;
  let initialStageY = 0;
  const DRAG_THRESHOLD = 5;

  // Restore saved 2D offset (X and Y) if any
  try {
    const savedX = parseFloat(sessionStorage.getItem("gap_stage_x"));
    const savedY = parseFloat(sessionStorage.getItem("gap_stage_y"));
    if (!isNaN(savedX)) currentStageX = savedX;
    if (!isNaN(savedY)) currentStageY = savedY;
    if (currentStageX !== 0 || currentStageY !== 0) {
      stage.style.transform = `translate(${currentStageX}px, ${currentStageY}px)`;
    }
  } catch {}

  function getMaxDragX() {
    if (document.body.classList.contains("mini-window")) {
      return 80;
    }
    // Allow dragging freely across the screen without artificial blocks
    return Math.max(220, (window.innerWidth - 180) / 2);
  }

  function getMaxDragY() {
    if (document.body.classList.contains("mini-window")) {
      return 60;
    }
    // Allow dragging upwards and downwards comfortably
    return Math.max(160, (window.innerHeight - 220) / 2);
  }

  function applyRubberBand(val, maxVal) {
    if (Math.abs(val) <= maxVal) return val;
    const over = Math.abs(val) - maxVal;
    return Math.sign(val) * (maxVal + over * 0.25);
  }

  stage.addEventListener("pointerdown", (e) => {
    // Ignore drag start on buttons, links, inputs, game board cells, interactive modals, or cards
    if (e.target.closest("button, input, textarea, select, a, .chess-cell, .chess-board, .ttt-cell, .ttt-board, .seq-cell, .sequence-board, .seq-hand-card, .sequence-hand-shelf, .win-overlay, #pattuResultBanner, .poker-action-btn, #pattuDropdown, .pattu-drop-item, .pc-search-pill-wrap, .pc-modern-dropdown, .pattu-orig-dropdown, .pattu-num-btn, .pattu-orig-btn, .poker-bet-slider, .ludo-arena, #ludoGame, .ludo-board-wrap, #ludoBoardSvg, .ludo-token, .ludo-yard-group, .ludo-dice-box, .ludo-dice, .ludo-control-bar")) {
      return;
    }

    isPointerDown = true;
    dragActive = false;
    startX = e.clientX;
    startY = e.clientY;
    initialStageX = currentStageX;
    initialStageY = currentStageY;
    try { stage.setPointerCapture(e.pointerId); } catch {}
  });

  stage.addEventListener("pointermove", (e) => {
    if (!isPointerDown) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!dragActive && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
      dragActive = true;
      document.body.classList.add("stage-dragging");
    }

    if (dragActive) {
      const maxDragX = getMaxDragX();
      const maxDragY = getMaxDragY();

      let targetX = applyRubberBand(initialStageX + dx, maxDragX);
      let targetY = applyRubberBand(initialStageY + dy, maxDragY);

      stage.style.transform = `translate(${targetX}px, ${targetY}px)`;
    }
  });

  const endDrag = (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    try { stage.releasePointerCapture(e.pointerId); } catch {}

    if (dragActive) {
      const maxDragX = getMaxDragX();
      const maxDragY = getMaxDragY();
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      currentStageX = Math.max(-maxDragX, Math.min(maxDragX, initialStageX + dx));
      currentStageY = Math.max(-maxDragY, Math.min(maxDragY, initialStageY + dy));

      stage.style.transition = "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)";
      stage.style.transform = `translate(${currentStageX}px, ${currentStageY}px)`;
      setTimeout(() => { stage.style.transition = ""; }, 280);

      try {
        sessionStorage.setItem("gap_stage_x", currentStageX);
        sessionStorage.setItem("gap_stage_y", currentStageY);
      } catch {}

      // Suppress synthetic click after dragging
      const preventNextClick = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      window.addEventListener("click", preventNextClick, { capture: true, once: true });
      setTimeout(() => { window.removeEventListener("click", preventNextClick, { capture: true }); }, 120);

      dragActive = false;
      document.body.classList.remove("stage-dragging");
    }
  };

  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  // Double click anywhere on board frame or status bar snaps back to center (0, 0)
  stage.addEventListener("dblclick", (e) => {
    if (e.target.closest("button, input, textarea, a, .seg-btn, .pattu-num-btn")) return;
    currentStageX = 0;
    currentStageY = 0;
    try {
      sessionStorage.removeItem("gap_stage_x");
      sessionStorage.removeItem("gap_stage_y");
    } catch {}
    stage.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
    stage.style.transform = "translate(0px, 0px)";
    setTimeout(() => { stage.style.transition = ""; }, 350);
  });

  window.addEventListener("resize", () => {
    const maxDragX = getMaxDragX();
    const maxDragY = getMaxDragY();
    let clamped = false;
    if (Math.abs(currentStageX) > maxDragX) {
      currentStageX = Math.sign(currentStageX) * maxDragX;
      clamped = true;
    }
    if (Math.abs(currentStageY) > maxDragY) {
      currentStageY = Math.sign(currentStageY) * maxDragY;
      clamped = true;
    }
    if (clamped) {
      stage.style.transform = `translate(${currentStageX}px, ${currentStageY}px)`;
    }
  });
}

/* ---------- App Boot ---------- */


  // Dynamic PC Guesser Top HUD Button Bindings
  const pattuHudTtBtn = document.getElementById("pattuHudTtBtn");
  const pattuHudStatsBtn = document.getElementById("pattuHudStatsBtn");
  const pattuHudHelpBtn = document.getElementById("pattuHudHelpBtn");

  pattuHudTtBtn?.addEventListener("click", () => {
    const ttModal = document.getElementById("pattuTimeTravelModal");
    if (ttModal) {
      ttModal.classList.remove("hidden");
      ttModal.style.removeProperty("display");
    }
  });

  pattuHudStatsBtn?.addEventListener("click", () => {
    const statsModal = document.getElementById("pattuStatsCustomModal");
    if (statsModal) {
      renderPattuStatsChart();
      statsModal.classList.remove("hidden");
      statsModal.style.removeProperty("display");
    }
  });

  pattuHudHelpBtn?.addEventListener("click", () => {
    const helpModal = document.getElementById("pattuInstructionsModal");
    if (helpModal) {
      helpModal.classList.remove("hidden");
      helpModal.style.removeProperty("display");
    }
  });

function boot() {
  initLudoEvents();
  initSnakeEvents();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

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
  initStageDragger();
  startIdleWatchdog();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}




/* ==========================================================================
   GAP Games — Scenic Glassmorphism Navigation & Landing Card Interactions
   ========================================================================== */

function getGameDisplayName(gameKey) {
  if (gameKey === "ttt3" || gameKey === "ttt5" || gameKey === "ttt") return "Tic-Tac-Toe";
  if (gameKey === "snake") return "Snake Arena";
  if (gameKey === "ludo") return "Ludo King";
  if (gameKey === "chess") return "Chess";
  if (gameKey === "sequence") return "Sequence";
  if (gameKey === "wordle") return "Wordle";
  if (gameKey === "poker") return "Poker (Hold'em)";
  if (gameKey === "pattu") return "PC Guesser";
  if (gameKey === "palace") return "Palace Escape";
  return "Classic Game";
}

function showLandingView() {
  stopLudo();
  if (typeof stopSnake === "function") stopSnake();
  const landing = document.getElementById("landingView");
  const gameView = document.getElementById("gameView");
  const playBtn = document.getElementById("navPlayBtn");
  if (landing) {
    landing.classList.remove("hidden");
    landing.style.removeProperty("display");
  }
  if (gameView) {
    gameView.classList.add("hidden");
    gameView.style.setProperty("display", "none", "important");
  }
  if (playBtn) playBtn.classList.add("active");
  try {
    sessionStorage.setItem("gap_view_mode", "landing");
  } catch {}
}

function showGameView(gameKey) {
  if (gameKey !== "ludo") stopLudo();
  if (gameKey !== "snake" && typeof stopSnake === "function") stopSnake();
  // Trigger dynamic expanding growth animation on the top match bar
  const matchBar = document.getElementById("gameMatchBar");
  if (matchBar) {
    matchBar.classList.remove("growing");
    void matchBar.offsetWidth; // force browser reflow
    matchBar.classList.add("growing");
  }
  const landing = document.getElementById("landingView");
  const gameView = document.getElementById("gameView");
  const playBtn = document.getElementById("navPlayBtn");
  const badge = document.getElementById("activeGameBadge");
  if (landing) {
    landing.classList.add("hidden");
    landing.style.setProperty("display", "none", "important");
  }
  if (gameView) {
    gameView.classList.remove("hidden");
    gameView.style.removeProperty("display");
  }
  if (playBtn) playBtn.classList.remove("active");
  const targetKey = gameKey || hubState.game;
  if (gameView) gameView.setAttribute("data-active-game", targetKey);
  if (badge) badge.textContent = getGameDisplayName(targetKey);
  try {
    sessionStorage.setItem("gap_view_mode", "game");
  } catch {}
  if (typeof window.setGameNavDropdownOpen === "function") {
    window.setGameNavDropdownOpen(false);
  }
}

function launchGameFromCard(targetGame) {
  if (!targetGame) return;
  if (targetGame === "palace") {
    window.location.href = "palace-escape/";
    return;
  }
  if (targetGame === "passiton" || targetGame === "pass-it-on") {
    window.location.href = "pass-it-on/";
    return;
  }
  if (targetGame === "ttt" || targetGame === "ttt3") {
    targetGame = hubState.lastTttMode || "ttt3";
  }
  hubState.game = targetGame;
  if (targetGame.startsWith("ttt")) hubState.lastTttMode = targetGame;
  if (modeSelect) modeSelect.value = modeFromHub();
  syncHud();
  persistHub();

  // Instant view transition so UI immediately displays active game arena
  showGameView(targetGame);

  try {
    initBoard(true);
  } catch (err) {
    console.error("[GAP] Error during initBoard for " + targetGame + ":", err);
  }
  showOnlyActiveGame(targetGame);

  const targetHash = "#/" + targetGame;
  try {
    if (history.replaceState) {
      history.replaceState(null, "", targetHash);
    } else if (location.protocol !== "file:") {
      location.hash = targetHash;
    }
  } catch (_) {}
}
window.launchGameFromCard = launchGameFromCard;

function initScenicLandingAndNav() {
  const cardGrid = document.getElementById("gamesCardGrid");
  const backBtn = document.getElementById("backToHubBtn");
  const navPlayBtn = document.getElementById("navPlayBtn");
  const navStatsBtn = document.getElementById("navStatsBtn");
  const navLeaderboardBtn = document.getElementById("navLeaderboardBtn");
  const navSettingsBtn = document.getElementById("navSettingsBtn");
  const navAvatarBtn = document.getElementById("navAvatarBtn");
  const brand = document.getElementById("gapBrand");
  const settingsModal = document.getElementById("settingsModal");
  const closeSettingsBtn = document.getElementById("closeSettingsBtn");
  const closeSettingsXBtn = document.getElementById("closeSettingsXBtn");

  // Hash routing handler with support for direct links and back/forward navigation
  function handleRoute() {
    const rawHash = location.hash || "";
    const hasGameHash = rawHash.startsWith("#/") && rawHash.length > 2 && rawHash !== "#/" && rawHash !== "#/hub";

    if (hasGameHash) {
      const routeGame = rawHash.slice(2).split("?")[0].trim();
      if (routeGame === "palace") {
        window.location.href = "palace-escape/";
        return;
      }
      if (routeGame === "passiton" || routeGame === "pass-it-on") {
        window.location.href = "pass-it-on/";
        return;
      }
      const validGames = ["ttt3", "ttt5", "ttt", "chess", "sequence", "wordle", "poker", "pattu", "ludo", "snake"];
      if (validGames.includes(routeGame)) {
        const actualGame = routeGame === "ttt" ? (hubState.lastTttMode || "ttt3") : routeGame;
        hubState.game = actualGame;
        if (actualGame.startsWith("ttt")) hubState.lastTttMode = actualGame;
        if (modeSelect) modeSelect.value = modeFromHub();
        syncHud();
        showGameView(actualGame);
        try {
          initBoard(false);
        } catch (err) {
          console.error("[GAP] Error during handleRoute initBoard:", err);
          initBoard(true);
        }
        showOnlyActiveGame(actualGame);
        return;
      }
      showGameView(hubState.game);
    } else {
      showLandingView();
    }
  }

  handleRoute();
  window.addEventListener("hashchange", handleRoute);

  function returnToHub() {
    stopLudo();
    if (typeof stopSnake === "function") stopSnake();
    showLandingView();
    try {
      if (history.replaceState) {
        history.replaceState(null, "", "#/");
      } else if (location.protocol !== "file:") {
        location.hash = "#/";
      }
    } catch (_) {}
  }

  // 1. Game Selection Cards: Grid click listener
  cardGrid?.addEventListener("click", (e) => {
    const card = e.target.closest("[data-game]");
    if (!card) return;
    e.preventDefault();
    e.stopPropagation();
    launchGameFromCard(card.dataset.game);
  });

  // Global Delegated Click Listener for maximum resilience
  document.addEventListener("click", (e) => {
    // Check if Back to Hub was clicked
    if (e.target.closest("#backToHubBtn, .back-to-hub-btn")) {
      e.preventDefault();
      returnToHub();
      return;
    }

    const card = e.target.closest("[data-game]");
    if (!card) return;
    const landing = document.getElementById("landingView");
    if (card.closest("#gamesCardGrid") || (landing && !landing.classList.contains("hidden"))) {
      e.preventDefault();
      launchGameFromCard(card.dataset.game);
    }
  });

  // Accessible keyboard navigation (Enter & Space) for game selection cards
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const card = document.activeElement?.closest("[data-game]");
      if (card && card.closest("#gamesCardGrid")) {
        e.preventDefault();
        launchGameFromCard(card.dataset.game);
      }
    }
  });

  // 2. Return to All Games Button
  backBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    returnToHub();
  });

  // 3. Header Play Button
  navPlayBtn?.addEventListener("click", () => {
    const landing = document.getElementById("landingView");
    if (landing && landing.classList.contains("hidden")) {
      showLandingView();
      location.hash = "#/";
    } else {
      const selectSec = document.getElementById("gameSelectSection");
      selectSec?.scrollIntoView({ behavior: "smooth" });
    }
  });

  // 4. Floating Dynamic Island Pill Logic
  const floatingPill = document.getElementById("floatingPill") || document.querySelector(".floating-pill, .scenic-nav-content");
  let pillClickTimer = null;

  const expandPill = () => {
    if (floatingPill && !floatingPill.classList.contains("expanded")) {
      floatingPill.classList.add("expanded");
    }
  };

  const collapsePill = () => {
    if (floatingPill && floatingPill.classList.contains("expanded")) {
      floatingPill.classList.remove("expanded");
    }
    document.getElementById("themePicker")?.classList.remove("open");
  };

  // Single click & Double click / tap on GAP Pill or Trigger:
  let lastBrandTapTime = 0;

  function triggerGapColorCycle() {
    applyRandomPalette();
    const brandEl = document.getElementById("gapBrand");
    if (brandEl) {
      brandEl.classList.add("brand-click-pulse");
      setTimeout(() => brandEl.classList.remove("brand-click-pulse"), 400);
    }
    collapsePill();
  }

  // Handle click on brand with fast double-click / double-tap detection
  brand?.addEventListener("click", (e) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastBrandTapTime < 380) {
      // Double tap / double click detected! Cycle color palette!
      lastBrandTapTime = 0;
      triggerGapColorCycle();
      return;
    }
    lastBrandTapTime = now;

    // Single click: toggle open / close
    const isExpanded = floatingPill?.classList.contains("expanded");
    if (!isExpanded) {
      expandPill();
    } else {
      collapsePill();
    }
  });

  floatingPill?.addEventListener("click", (e) => {
    if (!floatingPill.classList.contains("expanded")) {
      e.stopPropagation();
      const now = Date.now();
      if (now - lastBrandTapTime < 380) {
        lastBrandTapTime = 0;
        triggerGapColorCycle();
        return;
      }
      lastBrandTapTime = now;
      expandPill();
      return;
    }
    if (e.target === floatingPill || e.target.closest("#gapBrand")) {
      e.stopPropagation();
      collapsePill();
    }
  });

  // Explicit dblclick listener as direct event fallback
  brand?.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    lastBrandTapTime = 0;
    triggerGapColorCycle();
  });

  document.getElementById("gapLogoText")?.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    lastBrandTapTime = 0;
    triggerGapColorCycle();
  });

  floatingPill?.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    lastBrandTapTime = 0;
    triggerGapColorCycle();
  });

  // Clicking anywhere outside the floating pill automatically collapses it
  document.addEventListener("click", (e) => {
    if (floatingPill && !floatingPill.contains(e.target)) {
      collapsePill();
    }
  });

  // Keep clicks inside the actions drawer interactive without collapsing, but close theme dropdown if clicked outside of it
  document.getElementById("pillActions")?.addEventListener("click", (e) => {
    if (themePicker && !themePicker.contains(e.target)) {
      themePicker.classList.remove("open");
      themeTrigger?.setAttribute("aria-expanded", "false");
    }
    e.stopPropagation();
  });

  // 5. Header Stats, Avatar, & Leaderboard
  const triggerStats = () => {
    scoreTickerBtn?.click();
  };
  navStatsBtn?.addEventListener("click", triggerStats);
  navAvatarBtn?.addEventListener("click", triggerStats);
  navLeaderboardBtn?.addEventListener("click", triggerStats);

  // 6. Header Settings Modal
  const openSettings = () => {
    if (!settingsModal) return;
    setActive(document.getElementById("modalOpponentPills"), "opponent", hubState.opponent);
    setActive(document.getElementById("modalDifficultyPills"), "difficulty", hubState.difficulty);
    setActive(document.getElementById("modalTimerPills"), "timer", hubState.timer);
    setActive(document.getElementById("modalThemePills"), "theme", hubState.theme);
    settingsModal.classList.remove("hidden");
  };
  navSettingsBtn?.addEventListener("click", openSettings);

  const closeSettings = () => {
    settingsModal?.classList.add("hidden");
  };
  closeSettingsBtn?.addEventListener("click", closeSettings);
  closeSettingsXBtn?.addEventListener("click", closeSettings);
  settingsModal?.addEventListener("click", (e) => {
    if (e.target === settingsModal) closeSettings();
  });

  // Settings Modal Pill Controls
  document.getElementById("modalOpponentPills")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-opponent]");
    if (!btn) return;
    hubState.opponent = btn.dataset.opponent;
    if (modeSelect) modeSelect.value = modeFromHub();
    syncHud();
    persistHub();
    setActive(document.getElementById("modalOpponentPills"), "opponent", hubState.opponent);
    initBoard(true);
  });

  document.getElementById("modalDifficultyPills")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-difficulty]");
    if (!btn) return;
    hubState.difficulty = btn.dataset.difficulty;
    if (difficultySelect) difficultySelect.value = hubState.difficulty;
    syncHud();
    persistHub();
    setActive(document.getElementById("modalDifficultyPills"), "difficulty", hubState.difficulty);
    loadScores();
    if (hubState.game === "wordle") initWordle();
    if (hubState.game === "sequence") renderSequenceHUD();
  });

  document.getElementById("modalTimerPills")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-timer]");
    if (!btn) return;
    hubState.timer = btn.dataset.timer;
    syncHud();
    persistHub();
    setActive(document.getElementById("modalTimerPills"), "timer", hubState.timer);
    startTurnTimer();
  });

  document.getElementById("modalThemePills")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme]");
    if (!btn) return;
    setTheme(btn.dataset.theme);
    setActive(document.getElementById("modalThemePills"), "theme", hubState.theme);
  });

  // 7. Hero Feature Indicators
  document.getElementById("featBadgeGames")?.addEventListener("click", () => {
    document.getElementById("gameSelectSection")?.scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("featBadgeOpponent")?.addEventListener("click", () => {
    hubState.opponent = (hubState.opponent === "ai" ? "local" : "ai");
    if (modeSelect) modeSelect.value = modeFromHub();
    syncHud();
    persistHub();
    initBoard(true);
    const txt = document.getElementById("featOpponentText");
    if (txt) {
      txt.textContent = hubState.opponent === "ai" ? "vs AI Active" : "Local 2P Active";
      setTimeout(() => { txt.textContent = "Play Local or AI"; }, 1800);
    }
  });

  document.getElementById("featBadgeStats")?.addEventListener("click", triggerStats);

  document.getElementById("featBadgeThemes")?.addEventListener("click", () => {
    setTheme(hubState.theme === "light" ? "dark" : "light");
  });
}

// Ensure initScenicLandingAndNav runs on boot
initScenicLandingAndNav();



// Universal Sea-Glass Navigation Pill & Vertical Dropdown Handler
(function() {
  const bar = document.getElementById('gameMatchBar');
  const toggleBtn = document.getElementById('matchBarToggleBtn');
  const activeBadge = document.getElementById('activeGameBadge');

  function setDropdownOpen(open) {
    if (!bar) return;
    bar.classList.toggle('dropdown-open', open);
    bar.classList.toggle('collapsed', !open);
    if (toggleBtn) {
      toggleBtn.title = open ? "Close Settings Dropdown" : "Open Settings Dropdown";
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  }

  // Always start with collapsed/compact navigation pill across all games
  setDropdownOpen(false);

  // Chevron toggle button click
  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = bar?.classList.contains('dropdown-open');
    setDropdownOpen(!isOpen);
  });

  // Clicking active game badge also toggles dropdown
  activeBadge?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = bar?.classList.contains('dropdown-open');
    setDropdownOpen(!isOpen);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!bar) return;
    if (bar.classList.contains('dropdown-open') && !bar.contains(e.target)) {
      setDropdownOpen(false);
    }
  });

  // Close dropdown when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bar && bar.classList.contains('dropdown-open')) {
      setDropdownOpen(false);
    }
  });

  // Wordle dropdown guide button hook
  document.getElementById('wordleDropdownHelpBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    const wordleHelpModal = document.getElementById('wordleHelpModal');
    if (wordleHelpModal) wordleHelpModal.classList.remove('hidden');
  });

  window.setGameNavDropdownOpen = setDropdownOpen;
})();

// Collapsible Quick-Dock Logic
(function() {
  const dock = document.getElementById('quickDock');
  const toggleBtn = document.getElementById('quickDockToggleBtn');
  const miniPill = document.getElementById('dockMiniPill');

  function updateDockState(collapsed) {
    if (!dock) return;
    dock.classList.toggle('collapsed', collapsed);
    try {
      localStorage.setItem('gap_dock_collapsed', collapsed ? 'true' : 'false');
    } catch(e) {}
  }

  try {
    const saved = localStorage.getItem('gap_dock_collapsed');
    if (saved === 'true') {
      dock?.classList.add('collapsed');
    }
    const savedPos = localStorage.getItem('gap_dock_position') || 'right';
    setDockPosition(savedPos);
  } catch(e) {}

  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isCollapsed = dock?.classList.contains('collapsed');
    updateDockState(!isCollapsed);
  });

  miniPill?.addEventListener('click', () => {
    updateDockState(false);
  });
})();


/* ==========================================================================
   LUDO KING ENGINE — REAL LUDO KING ALGORITHM (OFFLINE, LOCAL & AI)
   ========================================================================== */

var ludoState = ludoState || {
  mode: "ai",           // "local" (Pass & Play) or "ai" (1 Human vs AI Bots)
  playerCount: 4,       // 2, 3, or 4
  difficulty: "medium", // "easy", "medium", "hard"
  players: ["red", "green", "yellow", "blue"],
  humanPlayer: "red",
  currentTurn: 0,
  diceValue: 1,
  consecutiveSixes: 0,
  turnsSinceSix: { red: 0, green: 0, yellow: 0, blue: 0 },
  canRoll: true,
  mustMove: false,
  isRolling: false,
  gameOver: false,
  rankings: [],
  statusMessage: "Tap ROLL to roll the dice",
  tokens: {
    red: [-1, -1, -1, -1],
    green: [-1, -1, -1, -1],
    yellow: [-1, -1, -1, -1],
    blue: [-1, -1, -1, -1]
  }
};

/* --- 100% Offline Procedural Web Audio Sound Synthesizers --- */
var ludoAudioCtx = null;
function getLudoAudioCtx() {
  if (!ludoAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) ludoAudioCtx = new AudioCtx();
  }
  if (ludoAudioCtx && ludoAudioCtx.state === "suspended") {
    ludoAudioCtx.resume();
  }
  return ludoAudioCtx;
}

function playLudoDiceSound() {
  if (hubState.game !== "ludo" || (document.getElementById("landingView") && !document.getElementById("landingView").classList.contains("hidden"))) return;
  try {
    const ctx = getLudoAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180 + Math.random() * 90, now + i * 0.05);
      gain.gain.setValueAtTime(0.22, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.05);
    }
  } catch {}
}

function playLudoStepSound() {
  if (hubState.game !== "ludo" || (document.getElementById("landingView") && !document.getElementById("landingView").classList.contains("hidden"))) return;
  try {
    const ctx = getLudoAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.09);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {}
}

function playLudoCaptureSound() {
  try {
    const ctx = getLudoAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.28);
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.29);
  } catch {}
}

function playLudoWinSound() {
  try {
    const ctx = getLudoAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.28, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.36);
    });
  } catch {}
}

/* --- Initialization & Game Mode Setup --- */
/* --- Dynamic Ludo Controls & Mode Syncer --- */
function updateLudoControlsUI() {
  const ludoMatchGroup = document.getElementById("ludoMatchGroup");
  const isLudo = (hubState.game === "ludo");
  if (!ludoMatchGroup) return;

  if (isLudo) {
    ludoMatchGroup.style.display = "flex";
    ludoMatchGroup.classList.remove("hidden");

    const mode = (typeof ludoState !== "undefined" && ludoState.mode) || "ai";
    const count = (typeof ludoState !== "undefined" && ludoState.playerCount) || 4;

    setActive(document.getElementById("ludoModePills"), "ludomode", mode);
    setActive(document.getElementById("ludoPlayersPills"), "players", String(count));

    const label = document.getElementById("ludoPlayersLabel");
    const pills = document.getElementById("ludoPlayersPills");
    if (pills) {
      const btn2 = pills.querySelector('[data-players="2"]');
      const btn3 = pills.querySelector('[data-players="3"]');
      const btn4 = pills.querySelector('[data-players="4"]');

      if (mode === "ai") {
        if (label) label.textContent = "Bots:";
        if (btn2) { btn2.textContent = "1 Bot"; btn2.title = "2 Players: You (Red) vs 1 Bot (Yellow)"; }
        if (btn3) { btn3.textContent = "2 Bots"; btn3.title = "3 Players: You (Red) vs 2 Bots (Green, Yellow)"; }
        if (btn4) { btn4.textContent = "3 Bots"; btn4.title = "4 Players: You (Red) vs 3 Bots (Green, Yellow, Blue)"; }
      } else {
        if (label) label.textContent = "Players:";
        if (btn2) { btn2.textContent = "2P"; btn2.title = "Local Pass & Play: 2 Players (Red vs Yellow)"; }
        if (btn3) { btn3.textContent = "3P"; btn3.title = "Local Pass & Play: 3 Players (Red, Green, Yellow)"; }
        if (btn4) { btn4.textContent = "4P"; btn4.title = "Local Pass & Play: 4 Players (All 4 Colors)"; }
      }
    }

    if (difficultyGroup) {
      if (mode === "ai") {
        difficultyGroup.style.display = "flex";
        difficultyGroup.classList.remove("disabled", "hidden");
        difficultyGroup.style.removeProperty("display");
      } else {
        difficultyGroup.style.setProperty("display", "none", "important");
        difficultyGroup.classList.add("hidden");
      }
    }
  } else {
    ludoMatchGroup.style.setProperty("display", "none", "important");
    ludoMatchGroup.classList.add("hidden");
  }
}

/* --- Initialization & Game Mode Setup --- */
function initLudo(forceFresh = false) {
  const count = ludoState.playerCount || 4;
  if (count === 2) {
    // 2 Players: Red vs Yellow on opposite sides
    ludoState.players = ["red", "yellow"];
  } else if (count === 3) {
    ludoState.players = ["red", "green", "yellow"];
  } else {
    ludoState.players = ["red", "green", "yellow", "blue"];
  }

  ludoState.difficulty = hubState.difficulty || "medium";
  ludoState.currentTurn = 0;
  ludoState.diceValue = 6; // Default to 6 so dots are visible immediately on load
  ludoState.consecutiveSixes = 0;
  ludoState.turnsSinceSix = { red: 0, green: 0, yellow: 0, blue: 0 };
  ludoState.canRoll = true;
  ludoState.mustMove = false;
  ludoState.isRolling = false;
  ludoState.gameOver = false;
  ludoState.rankings = [];
  ludoState.statusMessage = "Tap ROLL to roll the dice";

  ludoState.tokens = {
    red: [-1, -1, -1, -1],
    green: [-1, -1, -1, -1],
    yellow: [-1, -1, -1, -1],
    blue: [-1, -1, -1, -1]
  };

  const overlay = document.getElementById("ludoWinnerOverlay");
  if (overlay) overlay.classList.add("hidden");

  const diceEl = document.getElementById("ludoDice");
  if (diceEl) {
    diceEl.setAttribute("data-val", "6");
    diceEl.setAttribute("data-face", "6");
  }
  const rollBtn = document.getElementById("ludoRollBtn") || document.getElementById("ludoDiceBadge");
  if (rollBtn) rollBtn.textContent = "ROLL";

  updateLudoControlsUI();
  renderLudoBoard();
  updateLudoTurnUI();

  // If first turn is an AI bot (e.g. if human is not red), trigger bot
  checkAndTriggerLudoBot();
}

/* --- Helper to generate 5-pointed Star SVG element --- */
function makeStarSvg(cx, cy, r, fill, stroke) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const radius = (i % 2 === 0) ? r : r * 0.44;
    const angle = (i * Math.PI / 5) - (Math.PI / 2);
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return `<polygon points="${points.join(' ')}" fill="${fill}" stroke="${stroke || fill}" stroke-width="1.2"/>`;
}

/* --- Render Authentic Classic Ludo Board (SVG) --- */
function renderLudoBoard() {
  const svg = document.getElementById("ludoBoardSvg");
  if (!svg) return;

  const CELL = 40; // 15 cells * 40px = 600px

  let svgHtml = `
    <defs>
      <!-- Token Gradients -->
      ${Object.entries(LUDO_COLORS).map(([c, data]) => `
        <radialGradient id="ludoTokenGrad_${c}" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="${data.grad1}"/>
          <stop offset="70%" stop-color="${data.hex}"/>
          <stop offset="100%" stop-color="${data.border}"/>
        </radialGradient>
      `).join('')}
    </defs>

    <!-- Board Background -->
    <rect width="600" height="600" fill="#ffffff" rx="28" stroke="#1e293b" stroke-width="3"/>
  `;

  // Draw 4 Corner Yards (6x6 cells = 240x240px each)
  const drawCornerYard = (colorKey, x, y) => {
    const colData = LUDO_COLORS[colorKey];
    const isPlaying = ludoState.players.includes(colorKey);
    const opacity = isPlaying ? "1" : "0.35";

    let yardSvg = `<g class="ludo-yard-group ${colorKey}" data-color="${colorKey}" opacity="${opacity}" style="cursor: ${isPlaying ? 'pointer' : 'default'}">`;
    // Outer colored frame
    yardSvg += `<rect x="${x}" y="${y}" width="240" height="240" fill="${colData.hex}" rx="24"/>`;
    // Inner white container
    yardSvg += `<rect x="${x + 32}" y="${y + 32}" width="176" height="176" fill="#ffffff" rx="16" stroke="${colData.hex}" stroke-width="8"/>`;
    
    // 4 Colored circular seats inside white box
    const pockets = LUDO_YARD_POCKETS[colorKey];
    pockets.forEach((pt, pIdx) => {
      yardSvg += `<circle cx="${pt[0]}" cy="${pt[1]}" r="26" fill="${colData.hex}" stroke="${colData.border}" stroke-width="3"/>`;
      yardSvg += `<circle cx="${pt[0]}" cy="${pt[1]}" r="16" fill="${colData.light}" opacity="0.65"/>`;
    });

    yardSvg += `</g>`;
    return yardSvg;
  };

  // Top-Left: Red, Top-Right: Green, Bottom-Left: Blue, Bottom-Right: Yellow
  svgHtml += drawCornerYard("red", 0, 0);
  svgHtml += drawCornerYard("green", 360, 0);
  svgHtml += drawCornerYard("blue", 0, 360);
  svgHtml += drawCornerYard("yellow", 360, 360);

  // Draw 52 Perimeter Track Cells
  LUDO_TRACK.forEach((pos, idx) => {
    const cx = pos[0] * CELL;
    const cy = pos[1] * CELL;
    let fill = "#ffffff";
    let stroke = "#222222";

    // Start tiles are filled with their player color
    if (idx === 0) fill = LUDO_COLORS.red.hex;
    else if (idx === 13) fill = LUDO_COLORS.green.hex;
    else if (idx === 26) fill = LUDO_COLORS.yellow.hex;
    else if (idx === 39) fill = LUDO_COLORS.blue.hex;

    svgHtml += `<rect x="${cx}" y="${cy}" width="${CELL}" height="${CELL}" fill="${fill}" stroke="${stroke}" stroke-width="1.3"/>`;

    // Draw the 4 colored stars matching the authentic board
    if (idx === 8) {
      svgHtml += makeStarSvg(cx + 20, cy + 20, 14, LUDO_COLORS.green.hex, LUDO_COLORS.green.border);
    } else if (idx === 21) {
      svgHtml += makeStarSvg(cx + 20, cy + 20, 14, LUDO_COLORS.yellow.hex, LUDO_COLORS.yellow.border);
    } else if (idx === 34) {
      svgHtml += makeStarSvg(cx + 20, cy + 20, 14, LUDO_COLORS.blue.hex, LUDO_COLORS.blue.border);
    } else if (idx === 47) {
      svgHtml += makeStarSvg(cx + 20, cy + 20, 14, LUDO_COLORS.red.hex, LUDO_COLORS.red.border);
    }
  });

  // Draw 4 Home Straights (5 squares each leading to center)
  const drawHomeRun = (cells, colData) => {
    let out = "";
    cells.forEach(pos => {
      const cx = pos[0] * CELL;
      const cy = pos[1] * CELL;
      out += `<rect x="${cx}" y="${cy}" width="${CELL}" height="${CELL}" fill="${colData.hex}" stroke="#222222" stroke-width="1.3"/>`;
    });
    return out;
  };

  svgHtml += drawHomeRun(LUDO_HOME_PATHS.red, LUDO_COLORS.red);
  svgHtml += drawHomeRun(LUDO_HOME_PATHS.green, LUDO_COLORS.green);
  svgHtml += drawHomeRun(LUDO_HOME_PATHS.yellow, LUDO_COLORS.yellow);
  svgHtml += drawHomeRun(LUDO_HOME_PATHS.blue, LUDO_COLORS.blue);

  // Center Winning Goal (240..360, 240..360: 3x3 cells)
  svgHtml += `
    <g id="ludoCenterTriangles">
      <!-- Left Red Triangle -->
      <polygon points="240,240 240,360 300,300" fill="${LUDO_COLORS.red.hex}" stroke="#222222" stroke-width="1.5"/>
      <!-- Top Green Triangle -->
      <polygon points="240,240 360,240 300,300" fill="${LUDO_COLORS.green.hex}" stroke="#222222" stroke-width="1.5"/>
      <!-- Right Yellow Triangle -->
      <polygon points="360,240 360,360 300,300" fill="${LUDO_COLORS.yellow.hex}" stroke="#222222" stroke-width="1.5"/>
      <!-- Bottom Blue Triangle -->
      <polygon points="240,360 360,360 300,300" fill="${LUDO_COLORS.blue.hex}" stroke="#222222" stroke-width="1.5"/>
      <!-- Center Crown Medallion -->
      <circle cx="300" cy="300" r="16" fill="#1e293b" stroke="#fbbf24" stroke-width="2.5"/>
      <text x="300" y="305" font-size="14" text-anchor="middle" fill="#fbbf24">👑</text>
    </g>
  `;

  // Draw Tokens with dynamic movable state & collision offsets
  svgHtml += renderLudoTokens(CELL);

  svg.innerHTML = svgHtml;
}

/* --- Render Tokens with Collision Offsets & Selection --- */
function renderLudoTokens(CELL) {
  let tokensHtml = "";

  const activeColor = ludoState.players[ludoState.currentTurn];
  const legalMoves = ludoState.mustMove ? getLegalLudoTokens(activeColor, ludoState.diceValue) : [];

  // Group tokens by key to calculate smart offsets when sharing the same space
  const posMap = {};

  ludoState.players.forEach(color => {
    ludoState.tokens[color].forEach((pos, tokenIdx) => {
      let coords = null;
      if (pos === -1) {
        // In Yard Pocket
        const pt = LUDO_YARD_POCKETS[color][tokenIdx];
        coords = { x: pt[0], y: pt[1], key: "yard_" + color + "_" + tokenIdx };
      } else if (pos >= 0 && pos <= 50) {
        // On 52-square track
        const trackIdx = (LUDO_START_OFFSETS[color] + pos) % 52;
        const gridPos = LUDO_TRACK[trackIdx];
        coords = { x: (gridPos[0] + 0.5) * CELL, y: (gridPos[1] + 0.5) * CELL, key: gridPos[0] + "," + gridPos[1] };
      } else if (pos >= 51 && pos <= 55) {
        // In Home Straight
        const straightIdx = pos - 51;
        const gridPos = LUDO_HOME_PATHS[color][straightIdx];
        coords = { x: (gridPos[0] + 0.5) * CELL, y: (gridPos[1] + 0.5) * CELL, key: "h_" + color + "_" + straightIdx };
      } else if (pos === 56) {
        // Reached Center Goal
        const goalOffsets = {
          red:    { x: 265, y: 300 },
          green:  { x: 300, y: 265 },
          yellow: { x: 335, y: 300 },
          blue:   { x: 300, y: 335 }
        };
        coords = { x: goalOffsets[color].x, y: goalOffsets[color].y, key: "goal_" + color };
      }

      if (coords) {
        if (!posMap[coords.key]) posMap[coords.key] = [];
        posMap[coords.key].push({ color, tokenIdx, coords });
      }
    });
  });

  // Render tokens with non-overlapping, distinct hit targets when multiple tokens share a space
  Object.values(posMap).forEach(group => {
    const count = group.length;
    group.forEach((item, i) => {
      let ox = 0;
      let oy = 0;
      let tokenRadius = 15;
      let hitRadius = 17;

      if (count === 2) {
        // 2 tokens on same space: clean left & right separation with smaller radius so both fit comfortably
        ox = (i === 0) ? -10 : 10;
        tokenRadius = 12;
        hitRadius = 14;
      } else if (count >= 3) {
        // 3 or 4 tokens: 4 distinct quadrants so each is individually clickable
        const quadOffsets = [[-10, -10], [10, -10], [-10, 10], [10, 10]];
        ox = quadOffsets[i % 4][0];
        oy = quadOffsets[i % 4][1];
        tokenRadius = 9.5;
        hitRadius = 11.5;
      }

      const tx = item.coords.x + ox;
      const ty = item.coords.y + oy;
      const isMovable = (item.color === activeColor && legalMoves.includes(item.tokenIdx));
      const colData = LUDO_COLORS[item.color];

      tokensHtml += '<g class="ludo-token ' + item.color + '-token ' + (isMovable ? 'can-move' : '') + '" ' +
        'data-color="' + item.color + '" ' +
        'data-token="' + item.tokenIdx + '" ' +
        'style="cursor: ' + (isMovable ? 'pointer' : 'default') + '">' +
        (isMovable ? '<circle cx="' + tx + '" cy="' + ty + '" r="' + (tokenRadius + 5) + '" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="3,2" class="ludo-pulse-ring"/>' : '') +
        '<!-- Non-overlapping click hit target for mouse cursor & touch -->' +
        '<circle cx="' + tx + '" cy="' + ty + '" r="' + hitRadius + '" fill="transparent" pointer-events="all" style="cursor: ' + (isMovable ? 'pointer' : 'default') + '"/>' +
        '<circle cx="' + tx + '" cy="' + ty + '" r="' + tokenRadius + '" fill="url(#ludoTokenGrad_' + item.color + ')" stroke="#111111" stroke-width="1.8" filter="drop-shadow(0 3px 5px rgba(0,0,0,0.5))" pointer-events="all"/>' +
        '<!-- Inner Specular & Pawn Ring -->' +
        '<circle cx="' + tx + '" cy="' + ty + '" r="' + Math.max(4, tokenRadius * 0.45) + '" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="1.1"/>' +
        '<ellipse cx="' + (tx - tokenRadius * 0.25) + '" cy="' + (ty - tokenRadius * 0.25) + '" rx="' + Math.max(2, tokenRadius * 0.25) + '" ry="' + Math.max(1.2, tokenRadius * 0.15) + '" fill="rgba(255,255,255,0.7)"/>' +
        '</g>';
    });
  });

  return tokensHtml;
}

/* --- Legal Moves Computation --- */
function getLegalLudoTokens(color, roll) {
  const legal = [];
  const tokens = ludoState.tokens[color];

  tokens.forEach((pos, idx) => {
    if (pos === -1) {
      // Token in yard requires a 6 to enter start tile
      if (roll === 6) legal.push(idx);
    } else if (pos >= 0 && pos < 56) {
      // Must not overshoot center home (pos 56)
      if (pos + roll <= 56) legal.push(idx);
    }
  });

  return legal;
}

/* --- Real Ludo King Dice Rolling Mechanism --- */
/* --- Real Ludo King Dice Rolling Mechanism --- */
/* --- Ludo King Timer and Audio Stop Controls --- */
// ludo timers hoisted to top

function setLudoTimeout(fn, delay) {
  if (hubState.game !== "ludo" || (document.getElementById("landingView") && !document.getElementById("landingView").classList.contains("hidden"))) {
    return null;
  }
  const id = setTimeout(() => {
    const idx = ludoActiveTimers.indexOf(id);
    if (idx !== -1) ludoActiveTimers.splice(idx, 1);
    if (hubState.game !== "ludo" || (document.getElementById("landingView") && !document.getElementById("landingView").classList.contains("hidden"))) {
      return;
    }
    fn();
  }, delay);
  ludoActiveTimers.push(id);
  return id;
}

function stopLudo() {
  if (typeof ludoRollInterval !== "undefined" && ludoRollInterval) {
    clearInterval(ludoRollInterval);
    ludoRollInterval = null;
  }
  if (typeof ludoActiveTimers !== "undefined" && Array.isArray(ludoActiveTimers)) {
    ludoActiveTimers.forEach(id => clearTimeout(id));
    ludoActiveTimers = [];
  }
  if (typeof ludoState !== "undefined" && ludoState) {
    ludoState.isRolling = false;
  }
  if (typeof ludoAudioCtx !== "undefined" && ludoAudioCtx && ludoAudioCtx.state === "running") {
    try { ludoAudioCtx.suspend(); } catch {}
  }
}

function rollLudoDice() {
  if (hubState.game !== "ludo" || (document.getElementById("landingView") && !document.getElementById("landingView").classList.contains("hidden"))) return;
  if (!ludoState.canRoll || ludoState.isRolling || ludoState.gameOver) return;

  ludoState.canRoll = false;
  ludoState.isRolling = true;
  playLudoDiceSound();

  const diceEl = document.getElementById("ludoDice");
  const diceBox = document.getElementById("ludoDiceBox");
  const rollBtn = document.getElementById("ludoRollBtn") || document.getElementById("ludoDiceBadge");

  if (diceBox) diceBox.classList.remove("ready-to-roll");
  if (rollBtn) rollBtn.textContent = "ROLLING...";

  if (diceEl) {
    diceEl.classList.remove("rolling");
    void diceEl.offsetWidth;
    diceEl.classList.add("rolling");
  }

  // Animate rapid dice face turnover with authentic spinning dots
  let rolls = 0;
  if (ludoRollInterval) clearInterval(ludoRollInterval);
  ludoRollInterval = setInterval(() => {
    const tempVal = Math.floor(Math.random() * 6) + 1;
    if (diceEl) {
      diceEl.setAttribute("data-val", tempVal);
      diceEl.setAttribute("data-face", tempVal);
    }
    rolls++;
    if (rolls > 8) {
      clearInterval(ludoRollInterval); ludoRollInterval = null;
      finalizeLudoDiceRoll();
    }
  }, 45);
}

function finalizeLudoDiceRoll() {
  ludoState.isRolling = false;
  const diceEl = document.getElementById("ludoDice");
  const rollBtn = document.getElementById("ludoRollBtn") || document.getElementById("ludoDiceBadge");
  if (diceEl) diceEl.classList.remove("rolling");

  const activeColor = ludoState.players[ludoState.currentTurn];
  const diff = ludoState.difficulty || hubState.difficulty || "medium";

  // Real Ludo King RNG Algorithm with Sympathy Logic:
  let val = Math.floor(Math.random() * 6) + 1;

  // On Easy or Medium, if all pieces are locked in base for 3+ turns, grant a gentle sympathy boost
  const allInBase = ludoState.tokens[activeColor].every(p => p === -1);
  if ((diff === "easy" || diff === "medium") && allInBase && (ludoState.turnsSinceSix[activeColor] || 0) >= 3) {
    if (Math.random() < 0.6) {
      val = 6;
    }
  }

  ludoState.diceValue = val;
  if (diceEl) {
    diceEl.setAttribute("data-val", val);
    diceEl.setAttribute("data-face", val);
  }
  if (rollBtn) rollBtn.textContent = `ROLLED ${val}`;

  // Consecutive sixes check
  if (val === 6) {
    ludoState.consecutiveSixes++;
    ludoState.turnsSinceSix[activeColor] = 0;
    if (ludoState.consecutiveSixes === 3) {
      ludoState.consecutiveSixes = 0;
      updateLudoTurnText(false, "Three 6s! Turn forfeited.");
      setLudoTimeout(() => {
        advanceLudoTurn();
      }, 950);
      return;
    }
  } else {
    ludoState.consecutiveSixes = 0;
    ludoState.turnsSinceSix[activeColor] = (ludoState.turnsSinceSix[activeColor] || 0) + 1;
  }

  const legalMoves = getLegalLudoTokens(activeColor, val);

  if (legalMoves.length === 0) {
    // No legal moves
    ludoState.mustMove = false;
    renderLudoBoard();
    if (allInBase) {
      updateLudoTurnText(false, `Rolled ${val} • Need 6 to enter base • Passing turn...`);
    } else {
      updateLudoTurnText(false, `Rolled ${val} • No legal moves • Passing turn...`);
    }
    setLudoTimeout(() => {
      advanceLudoTurn();
    }, 950);
  } else {
    ludoState.mustMove = true;
    renderLudoBoard();

    const isHuman = (ludoState.mode === "local" || activeColor === ludoState.humanPlayer);

    if (isHuman) {
      const allMovableAreInYard = legalMoves.every(t => ludoState.tokens[activeColor][t] === -1);
      if (allMovableAreInYard) {
        updateLudoTurnText(false, "🎉 Rolled a 6! Tap token in base to enter track!");
      } else if (legalMoves.length === 1) {
        updateLudoTurnText(false, `Moving piece (${val} steps)...`);
        // Auto-move after brief delay so player sees result without getting stuck
        setLudoTimeout(() => {
          if (ludoState.mustMove && ludoState.players[ludoState.currentTurn] === activeColor) {
            moveLudoToken(activeColor, legalMoves[0]);
          }
        }, 380);
      } else {
        updateLudoTurnText(false, `✨ Rolled ${val} • Tap glowing piece to move!`);
      }
    } else {
      // AI Bot Turn: calculates move with real Ludo King algorithm
      updateLudoTurnText(false, `${LUDO_COLORS[activeColor].name} Bot rolled ${val}...`);
      setLudoTimeout(() => {
        const bestToken = chooseBestLudoBotMove(activeColor, val, legalMoves);
        moveLudoToken(activeColor, bestToken);
      }, 700);
    }
  }
}

/* --- Click Handler for Tokens and Yard --- */
function handleLudoTokenClick(color, tokenIdx) {
  const activeColor = ludoState.players[ludoState.currentTurn];
  const isHuman = (ludoState.mode === "local" || activeColor === ludoState.humanPlayer);
  if (!isHuman) return;

  if (!ludoState.mustMove) {
    if (ludoState.canRoll && !ludoState.isRolling) {
      // User tapped token before rolling! Give immediate friendly guidance and bounce dice
      updateLudoTurnText(false, "👉 Please roll the dice first! 🎲");
      const diceBox = document.getElementById("ludoDiceBox");
      if (diceBox) {
        diceBox.classList.add("ready-to-roll");
        diceBox.animate([
          { transform: "scale(1)" },
          { transform: "scale(1.15)" },
          { transform: "scale(1)" }
        ], { duration: 240, iterations: 2 });
      }
    }
    return;
  }

  if (ludoState.mustMove) {
    const legal = getLegalLudoTokens(activeColor, ludoState.diceValue);
    if (color === activeColor && legal.includes(tokenIdx)) {
      moveLudoToken(color, tokenIdx);
      return;
    }
    // If multiple tokens are stacked or player clicked their piece on this space
    const targetPos = (ludoState.tokens[color] && ludoState.tokens[color][tokenIdx] !== undefined) ? ludoState.tokens[color][tokenIdx] : null;
    if (targetPos !== null) {
      // Find active player's legal token on the same position
      const legalOnSamePos = legal.find(idx => ludoState.tokens[activeColor][idx] === targetPos);
      if (legalOnSamePos !== undefined) {
        moveLudoToken(activeColor, legalOnSamePos);
        return;
      }
    }
    // If only one legal move exists, moving it ensures user never gets stuck
    if (legal.length === 1) {
      moveLudoToken(activeColor, legal[0]);
    }
  }
}
window.handleLudoTokenClick = handleLudoTokenClick;

/* --- Move Token & Handle Captures / Bonus Rolls --- */
function moveLudoToken(color, tokenIdx) {
  const activeColor = ludoState.players[ludoState.currentTurn];
  if (color !== activeColor || !ludoState.mustMove) return;

  const currentPos = ludoState.tokens[color][tokenIdx];
  const roll = ludoState.diceValue;

  let newPos = currentPos;
  let isUnlock = false;

  if (currentPos === -1) {
    if (roll === 6) {
      newPos = 0; // Enter starting square
      isUnlock = true;
    } else {
      return;
    }
  } else {
    newPos = currentPos + roll;
    if (newPos > 56) return;
  }

  playLudoStepSound();
  ludoState.tokens[color][tokenIdx] = newPos;
  ludoState.mustMove = false;

  // Check captures if landing on 52-square track (pos 0..50)
  let captured = false;
  if (newPos >= 0 && newPos <= 50) {
    const landingTrackIdx = (LUDO_START_OFFSETS[color] + newPos) % 52;
    const isSafe = LUDO_SAFE_TRACK_INDICES.includes(landingTrackIdx);

    if (!isSafe) {
      ludoState.players.forEach(otherColor => {
        if (otherColor !== color) {
          ludoState.tokens[otherColor].forEach((otherPos, oIdx) => {
            if (otherPos >= 0 && otherPos <= 50) {
              const otherTrackIdx = (LUDO_START_OFFSETS[otherColor] + otherPos) % 52;
              if (otherTrackIdx === landingTrackIdx) {
                // CAPTURE! Send opponent piece back to yard!
                ludoState.tokens[otherColor][oIdx] = -1;
                captured = true;
                playLudoCaptureSound();
              }
            }
          });
        }
      });
    }
  }

  // Check if player won
  const hasWon = checkLudoPlayerWin(color);
  if (hasWon) return;

  renderLudoBoard();

  // Rules: Rolling a 6, capturing an opponent, or scoring home grants a BONUS ROLL!
  const earnedBonus = (roll === 6 || captured || newPos === 56);

  if (earnedBonus) {
    ludoState.canRoll = true;
    let bonusReason = "Bonus Roll!";
    if (captured) bonusReason = "⚔️ Captured piece! Roll again!";
    else if (newPos === 56) bonusReason = "👑 Reached Home! Roll again!";
    else if (roll === 6) bonusReason = "🎉 Rolled a 6! Roll again!";

    updateLudoTurnText(true, bonusReason);

    const diceBox = document.getElementById("ludoDiceBox");
    const rollBtn = document.getElementById("ludoRollBtn") || document.getElementById("ludoDiceBadge");
    const isHuman = (ludoState.mode === "local" || activeColor === ludoState.humanPlayer);
    if (isHuman) {
      if (diceBox) {
        diceBox.classList.add("ready-to-roll");
        diceBox.classList.remove("disabled");
      }
      if (rollBtn) rollBtn.textContent = "ROLL";
      checkAndTriggerLudoBot();
    } else {
      // AI Bot bonus roll: crisp 900ms pause so move is seen, then rolls again briskly
      updateLudoTurnText(true, "Bonus Roll!");
      setLudoTimeout(() => {
        checkAndTriggerLudoBot();
      }, 900);
    }
  } else {
    const isHuman = (ludoState.mode === "local" || activeColor === ludoState.humanPlayer);
    if (isHuman) {
      advanceLudoTurn();
    } else {
      // AI Bot turn finished: crisp 900ms pause to observe where token landed
      updateLudoTurnText(false, `Moved ${roll}!`);
      setLudoTimeout(() => {
        advanceLudoTurn();
      }, 900);
    }
  }
}

/* --- Advance Turn --- */
function advanceLudoTurn(msg) {
  if (ludoState.gameOver) return;

  ludoState.currentTurn = (ludoState.currentTurn + 1) % ludoState.players.length;
  ludoState.consecutiveSixes = 0;
  ludoState.canRoll = true;
  ludoState.mustMove = false;

  updateLudoTurnUI(msg);
  renderLudoBoard();

  checkAndTriggerLudoBot();
}

/* --- Turn Indicator UI Update --- */
function updateLudoTurnUI(extraMsg) {
  const activeColor = ludoState.players[ludoState.currentTurn];
  const dot = document.getElementById("ludoTurnDot");
  const diceBox = document.getElementById("ludoDiceBox");
  const rollBtn = document.getElementById("ludoRollBtn") || document.getElementById("ludoDiceBadge");

  if (dot) {
    dot.className = `ludo-turn-dot ${activeColor}-dot`;
    dot.style.backgroundColor = LUDO_COLORS[activeColor].hex;
  }

  const isHuman = (ludoState.mode === "local" || activeColor === ludoState.humanPlayer);
  if (diceBox) {
    if (isHuman && ludoState.canRoll && !ludoState.isRolling) {
      diceBox.classList.add("ready-to-roll");
      diceBox.classList.remove("disabled");
      if (rollBtn) rollBtn.textContent = "ROLL";
    } else {
      diceBox.classList.remove("ready-to-roll");
      if (!isHuman) diceBox.classList.add("disabled");
    }
  }

  updateLudoTurnText(false, extraMsg);
}

function updateLudoTurnText(isBonus = false, extraMsg = null) {
  const activeColor = ludoState.players[ludoState.currentTurn];
  const text = document.getElementById("ludoTurnText");
  if (!text) return;

  const isHuman = (ludoState.mode === "local" || activeColor === ludoState.humanPlayer);
  const colorName = LUDO_COLORS[activeColor].name;

  let label = "";
  if (extraMsg) {
    label = extraMsg;
  } else if (isBonus) {
    label = "Bonus Roll!";
  } else if (isHuman) {
    label = ludoState.canRoll ? "Your Turn • Roll" : "Your Turn";
  } else {
    label = `${colorName} Bot`;
  }

  text.textContent = label;
}

/* --- Real Ludo King AI Algorithm (Easy, Medium, Hard) --- */
function chooseBestLudoBotMove(color, roll, legalMoves) {
  const diff = ludoState.difficulty || hubState.difficulty || "medium";

  // 1. EASY MODE: Casual Novice
  if (diff === "easy") {
    // 40% chance pure random choice
    if (Math.random() < 0.4) {
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }
  }

  // 2. MEDIUM & HARD: Real Ludo King Matrix
  let bestToken = legalMoves[0];
  let highestScore = -9999;

  legalMoves.forEach(tIdx => {
    const curPos = ludoState.tokens[color][tIdx];
    let score = 0;

    // A. Unlocking from base on a 6
    if (curPos === -1 && roll === 6) {
      const tokensOnBoard = ludoState.tokens[color].filter(p => p >= 0 && p < 56).length;
      if (tokensOnBoard === 0) score += 300; // MUST unlock if 0 pieces on board
      else if (tokensOnBoard <= 2) score += (diff === "hard" ? 95 : 75);
      else score += (diff === "hard" ? 55 : 35);
    } else {
      const nextPos = curPos + roll;

      // B. Scoring into the Home Goal (Winning square pos 56)
      if (nextPos === 56) {
        score += 350; // Guaranteed win progress + bonus roll!
      }
      // C. Entering protected Home Corridor (pos 51-55)
      else if (nextPos >= 51 && curPos < 51) {
        score += (diff === "hard" ? 140 : 90);
      } else {
        const nextTrackIdx = (LUDO_START_OFFSETS[color] + nextPos) % 52;
        const curTrackIdx = (LUDO_START_OFFSETS[color] + curPos) % 52;
        const isNextSafe = LUDO_SAFE_TRACK_INDICES.includes(nextTrackIdx);
        const isCurSafe = LUDO_SAFE_TRACK_INDICES.includes(curTrackIdx);

        // D. CAPTURE CHECK (Signature Ludo King heuristic)
        let canCapture = false;
        if (!isNextSafe) {
          ludoState.players.forEach(otherColor => {
            if (otherColor !== color) {
              ludoState.tokens[otherColor].forEach(oPos => {
                if (oPos >= 0 && oPos <= 50) {
                  const oTrackIdx = (LUDO_START_OFFSETS[otherColor] + oPos) % 52;
                  if (oTrackIdx === nextTrackIdx) {
                    canCapture = true;
                  }
                }
              });
            }
          });
        }

        if (canCapture) {
          // Captures destroy enemy progress & grant extra roll!
          score += (diff === "hard" ? 280 : 160);
        }

        // E. Landing on Safe Stars (indices 8, 21, 34, 47)
        if (isNextSafe && !isCurSafe) {
          score += (diff === "hard" ? 90 : 55);
        }

        // F. DANGER RADAR & AMBUSH (HARD MODE EXCLUSIVE)
        if (diff === "hard") {
          // Check if current position has an enemy 1-6 squares behind us
          if (!isCurSafe && curPos >= 0 && curPos <= 50) {
            let inDanger = false;
            ludoState.players.forEach(otherColor => {
              if (otherColor !== color) {
                ludoState.tokens[otherColor].forEach(oPos => {
                  if (oPos >= 0 && oPos <= 50) {
                    const oTrackIdx = (LUDO_START_OFFSETS[otherColor] + oPos) % 52;
                    const distBehind = (curTrackIdx - oTrackIdx + 52) % 52;
                    if (distBehind >= 1 && distBehind <= 6) {
                      inDanger = true;
                    }
                  }
                });
              }
            });
            if (inDanger) {
              score += 120; // RUN AWAY TO ESCAPE CAPTURE!
            }
          }

          // Check if moving lands into enemy attack range (1-6 squares ahead of an enemy)
          if (!isNextSafe) {
            ludoState.players.forEach(otherColor => {
              if (otherColor !== color) {
                ludoState.tokens[otherColor].forEach(oPos => {
                  if (oPos >= 0 && oPos <= 50) {
                    const oTrackIdx = (LUDO_START_OFFSETS[otherColor] + oPos) % 52;
                    const enemyDistBehind = (nextTrackIdx - oTrackIdx + 52) % 52;
                    if (enemyDistBehind >= 1 && enemyDistBehind <= 6) {
                      score -= 70; // Penalize walking into enemy ambush!
                    }
                  }
                });
              }
            });
          }
        }

        // G. Progress reward: favors advancing pieces closest to goal
        score += (nextPos * 1.2);
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestToken = tIdx;
    }
  });

  return bestToken;
}

function checkAndTriggerLudoBot() {
  if (ludoState.gameOver) return;
  const currColor = ludoState.players[ludoState.currentTurn];
  const isHuman = (ludoState.mode === "local" || currColor === ludoState.humanPlayer);

  if (!isHuman && ludoState.canRoll) {
    setLudoTimeout(rollLudoDice, 650);
  }
}

/* --- Win / Game Over Detection --- */
function checkLudoPlayerWin(color) {
  const allHome = ludoState.tokens[color].every(p => p === 56);
  if (allHome && !ludoState.rankings.includes(color)) {
    ludoState.rankings.push(color);
    ludoState.gameOver = true;

    playLudoWinSound();

    const overlay = document.getElementById("ludoWinnerOverlay");
    const title = document.getElementById("ludoWinTitle");
    const desc = document.getElementById("ludoWinDesc");

    if (title) title.textContent = `${LUDO_COLORS[color].name} Wins!`;
    if (desc) {
      if (ludoState.mode === "ai") {
        desc.textContent = (color === ludoState.humanPlayer) ? "Victory! You conquered the Ludo King board!" : `${LUDO_COLORS[color].name} Bot claimed 1st Place!`;
      } else {
        desc.textContent = `Player ${LUDO_COLORS[color].name} finished in 1st Place!`;
      }
    }

    if (overlay) {
      overlay.classList.remove("hidden");
      overlay.style.removeProperty("display");
    }

    return true;
  }
  return false;
}

/* --- Event Listeners for Ludo Controls --- */
function initLudoEvents() {
  const diceBox = document.getElementById("ludoDiceBox");
  const diceEl = document.getElementById("ludoDice");
  const rollBtn = document.getElementById("ludoRollBtn") || document.getElementById("ludoDiceBadge");
  const resetBtn = document.getElementById("ludoResetBtn");
  const rulesBtn = document.getElementById("ludoRulesBtn");
  const closeRulesBtn = document.getElementById("closeLudoRulesBtn");
  const playAgainBtn = document.getElementById("ludoPlayAgainBtn");
  const modePills = document.getElementById("ludoModePills");
  const playersPills = document.getElementById("ludoPlayersPills");
  const boardSvg = document.getElementById("ludoBoardSvg");

  const doRoll = () => {
    const currColor = ludoState.players[ludoState.currentTurn];
    const isHuman = (ludoState.mode === "local" || currColor === ludoState.humanPlayer);
    if (isHuman && ludoState.canRoll) {
      rollLudoDice();
    }
  };

  // Click on dice itself or dice box rolls immediately
  diceEl?.addEventListener("click", (e) => {
    e.stopPropagation();
    doRoll();
  });
  diceEl?.addEventListener("pointerdown", (e) => e.stopPropagation());
  diceEl?.addEventListener("mousedown", (e) => e.stopPropagation());

  diceBox?.addEventListener("click", (e) => {
    e.stopPropagation();
    doRoll();
  });
  diceBox?.addEventListener("pointerdown", (e) => e.stopPropagation());
  diceBox?.addEventListener("mousedown", (e) => e.stopPropagation());

  rollBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    doRoll();
  });

  // Stop pointerdown and mousedown on boardSvg so stage drag capture never intercepts mouse clicks
  boardSvg?.addEventListener("pointerdown", (e) => e.stopPropagation());
  boardSvg?.addEventListener("mousedown", (e) => e.stopPropagation());

  resetBtn?.addEventListener("click", () => { initLudo(true); });
  playAgainBtn?.addEventListener("click", () => { initLudo(true); });

  rulesBtn?.addEventListener("click", () => {
    const modal = document.getElementById("ludoRulesModal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.style.removeProperty("display");
    }
  });

  closeRulesBtn?.addEventListener("click", () => {
    const modal = document.getElementById("ludoRulesModal");
    if (modal) modal.classList.add("hidden");
  });

  // Direct Click Delegation on Ludo Board SVG:
  // Allows clicking anywhere on tokens or player's yard base to unlock/move
  boardSvg?.addEventListener("click", (e) => {
    const activeColor = ludoState.players[ludoState.currentTurn];
    const isHuman = (ludoState.mode === "local" || activeColor === ludoState.humanPlayer);
    if (!isHuman || !ludoState.mustMove) return;

    // 1. Check if clicked a specific token
    const tokenEl = e.target.closest(".ludo-token");
    if (tokenEl) {
      const color = tokenEl.dataset.color;
      const tIdx = parseInt(tokenEl.dataset.token, 10);
      handleLudoTokenClick(color, tIdx);
      return;
    }

    // 2. Check if clicked active player's Yard Base on a 6 to unlock!
    if (ludoState.diceValue === 6) {
      const yardEl = e.target.closest(".ludo-yard-group");
      if (yardEl && yardEl.dataset.color === activeColor) {
        const legal = getLegalLudoTokens(activeColor, 6);
        const yardToken = legal.find(idx => ludoState.tokens[activeColor][idx] === -1);
        if (yardToken !== undefined) {
          moveLudoToken(activeColor, yardToken);
        }
      }
    }
  });

  // Spacebar to roll dice
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && hubState.game === "ludo") {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;
      e.preventDefault();
      doRoll();
    }
  });

  // Top Match Bar Mode (vs AI vs Local Pass & Play)
  modePills?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-ludomode]");
    if (!btn) return;
    ludoState.mode = btn.dataset.ludomode;
    syncHud();
    initLudo(true);
  });

  // Top Match Bar Players Count (2P, 3P, 4P)
  playersPills?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-players]");
    if (!btn) return;
    ludoState.playerCount = parseInt(btn.dataset.players, 10) || 4;
    syncHud();
    initLudo(true);
  });
}

/* =========================================================================
   SNAKE ARENA ENGINE — MODERN SEA GLASS EDITION
   ========================================================================= */

const SNAKE_SKINS = {
  emerald: {
    name: "Emerald",
    short: "Emerald",
    dot: "#10b981",
    head: "#34d399",
    bodyGrad: ["#34d399", "#10b981", "#059669"],
    glow: "rgba(52, 211, 153, 0.8)",
    eye: "#022c22"
  },
  cyan: {
    name: "Cyber Cyan",
    short: "Cyan",
    dot: "#06b6d4",
    head: "#67e8f9",
    bodyGrad: ["#67e8f9", "#06b6d4", "#0891b2"],
    glow: "rgba(6, 182, 212, 0.8)",
    eye: "#083344"
  },
  gold: {
    name: "Solar Gold",
    short: "Gold",
    dot: "#f59e0b",
    head: "#fde047",
    bodyGrad: ["#fde047", "#f59e0b", "#d97706"],
    glow: "rgba(245, 158, 11, 0.8)",
    eye: "#451a03"
  },
  crimson: {
    name: "Crimson Viper",
    short: "Crimson",
    dot: "#ef4444",
    head: "#fca5a5",
    bodyGrad: ["#fca5a5", "#ef4444", "#b91c1c"],
    glow: "rgba(239, 68, 68, 0.8)",
    eye: "#450a0a"
  },
  amethyst: {
    name: "Amethyst Glow",
    short: "Amethyst",
    dot: "#a855f7",
    head: "#d8b4fe",
    bodyGrad: ["#d8b4fe", "#a855f7", "#7e22ce"],
    glow: "rgba(168, 85, 247, 0.8)",
    eye: "#3b0764"
  },
  opal: {
    name: "Opal Mirage",
    short: "Opal",
    dot: "#e2e8f0",
    head: "#ffffff",
    bodyGrad: ["#ffffff", "#e2e8f0", "#94a3b8"],
    glow: "rgba(226, 232, 240, 0.8)",
    eye: "#0f172a"
  }
};

const SNAKE_SPEEDS = {
  casual: 130,
  normal: 95,
  fast: 68,
  insane: 46
};

// Web Audio API Synthesizer (100% Client-side & Offline)
let snakeAudioCtx = null;
function getSnakeAudio() {
  if (!snakeAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) snakeAudioCtx = new AudioCtx();
  }
  if (snakeAudioCtx && snakeAudioCtx.state === "suspended") {
    snakeAudioCtx.resume().catch(() => {});
  }
  return snakeAudioCtx;
}

function playSnakeSound(type) {
  try {
    if (!snakeState || !snakeState.sound) return;
    if (typeof navigator !== "undefined" && navigator.webdriver) return;
    const ctx = getSnakeAudio();
    if (!ctx) return;

    const now = ctx.currentTime;
    if (type === "eat") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.12);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === "bonus") {
      [784, 1046].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.25, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.16);
      });
    } else if (type === "diamond") {
      [880, 1174, 1480].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.22, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.18);
      });
    } else if (type === "turn") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.03);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === "crash") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.28);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "highscore") {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.28, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.22);
      });
    }
  } catch (err) {}
}

function loadSnakeSettings() {
  try {
    const savedSkin = localStorage.getItem("gap_snake_skin");
    if (savedSkin && SNAKE_SKINS[savedSkin]) snakeState.skin = savedSkin;

    const savedSpeed = localStorage.getItem("gap_snake_speed");
    if (savedSpeed && SNAKE_SPEEDS[savedSpeed]) snakeState.speed = savedSpeed;

    const savedMode = localStorage.getItem("gap_snake_mode");
    if (savedMode && ["classic", "nowalls", "obstacles", "timed"].includes(savedMode)) snakeState.mode = savedMode;

    const savedSound = localStorage.getItem("gap_snake_sound");
    if (savedSound !== null) snakeState.sound = (savedSound === "true");
  } catch {}

  loadSnakeHighScore();
}

function loadSnakeHighScore() {
  try {
    const val = localStorage.getItem("gap_snake_high_" + snakeState.mode);
    snakeState.highScore = val ? parseInt(val, 10) || 0 : 0;
  } catch {
    snakeState.highScore = 0;
  }
  const el = document.getElementById("snakeHighScoreVal");
  if (el) el.textContent = snakeState.highScore;
}

function saveSnakeHighScore() {
  try {
    localStorage.setItem("gap_snake_high_" + snakeState.mode, String(snakeState.highScore));
  } catch {}
}

function syncSnakeMatchBarUI() {
  const modePills = document.getElementById("snakeModePills");
  const speedPills = document.getElementById("snakeSpeedPills");
  const skinLabel = document.getElementById("snakeSkinLabel");
  const skinDot = document.getElementById("snakeSkinPreviewDot");

  setActive(modePills, "snakemode", snakeState.mode);
  setActive(speedPills, "snakespeed", snakeState.speed);

  const skinObj = SNAKE_SKINS[snakeState.skin] || SNAKE_SKINS.emerald;
  if (skinLabel) skinLabel.textContent = skinObj.short || skinObj.name;
  if (skinDot) {
    skinDot.style.backgroundColor = skinObj.dot;
    skinDot.style.boxShadow = `0 0 10px ${skinObj.dot}`;
  }

  // Update canvas glowing accent
  const canvasContainer = document.getElementById("snakeCanvasContainer");
  if (canvasContainer) {
    canvasContainer.style.setProperty("--snake-glow", skinObj.glow);
    canvasContainer.style.setProperty("--snake-accent", skinObj.dot);
  }

  // Toggle Timed HUD chip
  const timerItem = document.getElementById("snakeTimerItem");
  const isTimed = (snakeState.mode === "timed");
  if (timerItem) {
    timerItem.classList.toggle("hidden", !isTimed);
    timerItem.style.display = isTimed ? "flex" : "none";
  }

  const muteIcon = document.getElementById("snakeMuteIcon");
  if (muteIcon) muteIcon.textContent = snakeState.sound ? "🔊" : "🔇";
}

function buildSnakeObstacles() {
  if (snakeState.mode !== "obstacles") {
    snakeState.obstacles = [];
    return;
  }

  const obs = [];
  // 4 Symmetric Corner L-shaped crystals
  obs.push({ x: 3, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 4 });
  obs.push({ x: 16, y: 3 }, { x: 15, y: 3 }, { x: 16, y: 4 });
  obs.push({ x: 3, y: 16 }, { x: 4, y: 16 }, { x: 3, y: 15 });
  obs.push({ x: 16, y: 16 }, { x: 15, y: 16 }, { x: 16, y: 15 });

  // Center vertical guard pillars
  obs.push({ x: 9, y: 7 }, { x: 9, y: 8 }, { x: 10, y: 11 }, { x: 10, y: 12 });

  snakeState.obstacles = obs;
}

function spawnSnakeFood() {
  const gs = snakeState.gridSize;
  const occupied = new Set();

  snakeState.snake.forEach(seg => occupied.add(`${seg.x},${seg.y}`));
  snakeState.obstacles.forEach(ob => occupied.add(`${ob.x},${ob.y}`));

  const freeCells = [];
  for (let x = 0; x < gs; x++) {
    for (let y = 0; y < gs; y++) {
      if (!occupied.has(`${x},${y}`)) freeCells.push({ x, y });
    }
  }

  if (!freeCells.length) return;

  const chosen = freeCells[Math.floor(Math.random() * freeCells.length)];
  const rand = Math.random();
  let type = "normal";
  if (rand < 0.08) {
    type = "diamond"; // 8% chance of Prismatic Diamond (+50)
  } else if (rand < 0.26) {
    type = "golden"; // 18% chance of Golden Apple (+30)
  }

  snakeState.food = {
    x: chosen.x,
    y: chosen.y,
    type
  };
}

function spawnSnakeEatParticles(x, y, foodType) {
  const ts = snakeState.tileSize;
  const cx = x * ts + ts / 2;
  const cy = y * ts + ts / 2;
  let color = (document.body.dataset.theme === "light" ? "#ef4444" : "#f87171");
  if (foodType === "golden") color = "#fbbf24";
  else if (foodType === "diamond") color = "#22d3ee";

  const count = foodType === "diamond" ? 22 : (foodType === "golden" ? 18 : 14);

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = Math.random() * 4.5 + 2;
    snakeState.particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: (foodType === "diamond" && i % 2 === 0) ? "#f472b6" : color,
      alpha: 1,
      radius: Math.random() * 3 + 2.5
    });
  }
}

function initSnake(forceFresh = false) {
  loadSnakeSettings();
  if (snakeState) snakeState.startHighScore = snakeState.highScore || 0;
  stopSnake();

  // Reset core state
  snakeState.snake = [
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 }
  ];
  snakeState.dir = { x: 1, y: 0 };
  snakeState.nextDir = { x: 1, y: 0 };
  snakeState.dirQueue = [];
  snakeState.score = 0;
  snakeState.timeLeft = 60;
  snakeState.applesEaten = 0;
  snakeState.goldenEaten = 0;
  snakeState.diamondsEaten = 0;
  snakeState.isRunning = false;
  snakeState.isPaused = false;
  snakeState.isGameOver = false;
  snakeState.particles = [];

  // Adjust canvas buffer to crisp 800x800 resolution
  const canvas = document.getElementById("snakeCanvas");
  if (canvas) {
    canvas.width = 800;
    canvas.height = 800;
    snakeState.tileSize = canvas.width / snakeState.gridSize; // 800 / 20 = 40
  }

  buildSnakeObstacles();
  spawnSnakeFood();
  syncSnakeMatchBarUI();
  updateSnakeHUD();

  // Show start overlay initially if fresh
  const startOverlay = document.getElementById("snakeStartOverlay");
  const pauseOverlay = document.getElementById("snakePauseOverlay");
  const gameOverOverlay = document.getElementById("snakeGameOverOverlay");
  if (startOverlay) startOverlay.classList.remove("hidden");
  if (pauseOverlay) pauseOverlay.classList.add("hidden");
  if (gameOverOverlay) gameOverOverlay.classList.add("hidden");

  // Render initial preview frame
  renderSnakeFrame();
}

function startSnakeGame() {
  getSnakeAudio();
  const startOverlay = document.getElementById("snakeStartOverlay");
  const pauseOverlay = document.getElementById("snakePauseOverlay");
  const gameOverOverlay = document.getElementById("snakeGameOverOverlay");
  if (startOverlay) startOverlay.classList.add("hidden");
  if (pauseOverlay) pauseOverlay.classList.add("hidden");
  if (gameOverOverlay) gameOverOverlay.classList.add("hidden");

  snakeState.isRunning = true;
  snakeState.isPaused = false;
  snakeState.isGameOver = false;

  clearInterval(snakeState.gameInterval);
  clearInterval(snakeState.timerInterval);

  const speedMs = SNAKE_SPEEDS[snakeState.speed] || 95;
  snakeState.gameInterval = setInterval(tickSnakeGame, speedMs);

  if (snakeState.mode === "timed") {
    snakeState.timerInterval = setInterval(() => {
      if (snakeState.isRunning && !snakeState.isPaused) {
        snakeState.timeLeft--;
        const timeEl = document.getElementById("snakeTimeVal");
        if (timeEl) timeEl.textContent = `${snakeState.timeLeft}s`;

        if (snakeState.timeLeft <= 0) {
          endSnakeGame("Time is up!");
        }
      }
    }, 1000);
  }

  // Continuous animation loop for particles & food glow pulse
  startSnakeAnimLoop();
}

function pauseSnakeGame() {
  if (!snakeState.isRunning || snakeState.isGameOver) return;
  snakeState.isPaused = true;
  clearInterval(snakeState.gameInterval);

  const pauseOverlay = document.getElementById("snakePauseOverlay");
  if (pauseOverlay) pauseOverlay.classList.remove("hidden");

  const pauseText = document.getElementById("snakePauseText");
  const pauseIcon = document.getElementById("snakePauseIcon");
  if (pauseText) pauseText.textContent = "Resume";
  if (pauseIcon) pauseIcon.textContent = "▶️";
}

function resumeSnakeGame() {
  if (!snakeState.isRunning || snakeState.isGameOver) return;
  getSnakeAudio();
  snakeState.isPaused = false;

  const pauseOverlay = document.getElementById("snakePauseOverlay");
  if (pauseOverlay) pauseOverlay.classList.add("hidden");

  const pauseText = document.getElementById("snakePauseText");
  const pauseIcon = document.getElementById("snakePauseIcon");
  if (pauseText) pauseText.textContent = "Pause";
  if (pauseIcon) pauseIcon.textContent = "⏸️";

  clearInterval(snakeState.gameInterval);
  const speedMs = SNAKE_SPEEDS[snakeState.speed] || 95;
  snakeState.gameInterval = setInterval(tickSnakeGame, speedMs);
}

function toggleSnakePause() {
  if (!snakeState.isRunning) {
    startSnakeGame();
    return;
  }
  if (snakeState.isPaused) {
    resumeSnakeGame();
  } else {
    pauseSnakeGame();
  }
}

function stopSnake() {
  if (!snakeState) return;
  snakeState.isRunning = false;
  snakeState.isPaused = false;
  if (snakeState.gameInterval) {
    clearInterval(snakeState.gameInterval);
    snakeState.gameInterval = null;
  }
  if (snakeState.timerInterval) {
    clearInterval(snakeState.timerInterval);
    snakeState.timerInterval = null;
  }
  if (snakeState.animFrameId) {
    cancelAnimationFrame(snakeState.animFrameId);
    snakeState.animFrameId = null;
  }
}

function endSnakeGame(cause = "You crashed into a wall!") {
  if (!snakeState) return;
  stopSnake();
  snakeState.isGameOver = true;
  playSnakeSound("crash");

  const isNewHigh = (snakeState.score > (snakeState.startHighScore || 0) && snakeState.score > 0);
  if (isNewHigh) {
    snakeState.highScore = snakeState.score;
    snakeState.startHighScore = snakeState.score;
    saveSnakeHighScore();
    setTimeout(() => playSnakeSound("highscore"), 280);
  }

  updateSnakeHUD();

  const gameOverOverlay = document.getElementById("snakeGameOverOverlay");
  const causeEl = document.getElementById("snakeGameOverCause");
  const finalScoreEl = document.getElementById("snakeFinalScore");
  const finalHighEl = document.getElementById("snakeFinalHighScore");
  const bestModeLabel = document.getElementById("snakeBestModeLabel");
  const newHighBadge = document.getElementById("snakeNewHighScoreBadge");

  if (causeEl) causeEl.textContent = cause;
  if (finalScoreEl) finalScoreEl.textContent = snakeState.score;
  if (finalHighEl) finalHighEl.textContent = snakeState.highScore;
  if (bestModeLabel) {
    const modeNames = { classic: "Classic", nowalls: "No Walls", obstacles: "Obstacles", timed: "Timed" };
    bestModeLabel.textContent = modeNames[snakeState.mode] || "Classic";
  }
  if (newHighBadge) {
    newHighBadge.classList.toggle("hidden", !isNewHigh);
  }

  if (gameOverOverlay) gameOverOverlay.classList.remove("hidden");
}

function tickSnakeGame() {
  if (!snakeState.isRunning || snakeState.isPaused || snakeState.isGameOver) return;

  // Process next buffered direction
  if (snakeState.dirQueue && snakeState.dirQueue.length > 0) {
    snakeState.dir = snakeState.dirQueue.shift();
  } else if (snakeState.nextDir) {
    snakeState.dir = { ...snakeState.nextDir };
  }

  const head = snakeState.snake[0];
  let nextHead = {
    x: head.x + snakeState.dir.x,
    y: head.y + snakeState.dir.y
  };

  const gs = snakeState.gridSize;

  // Mode collision handling
  if (snakeState.mode === "nowalls") {
    // Screen wrapping portal
    nextHead.x = (nextHead.x + gs) % gs;
    nextHead.y = (nextHead.y + gs) % gs;
  } else {
    // Fatal walls
    if (nextHead.x < 0 || nextHead.x >= gs || nextHead.y < 0 || nextHead.y >= gs) {
      endSnakeGame("You crashed into a wall!");
      return;
    }
  }

  // Obstacle collision check
  if (snakeState.mode === "obstacles") {
    const hitObstacle = snakeState.obstacles.some(ob => ob.x === nextHead.x && ob.y === nextHead.y);
    if (hitObstacle) {
      endSnakeGame("You shattered against a Sea Glass Crystal!");
      return;
    }
  }

  // Self collision check (ignore tail if tail will move away and not eating food)
  const isEating = (snakeState.food && nextHead.x === snakeState.food.x && nextHead.y === snakeState.food.y);
  const segmentsToCheck = isEating ? snakeState.snake : snakeState.snake.slice(0, -1);
  const hitSelf = segmentsToCheck.some(seg => seg.x === nextHead.x && seg.y === nextHead.y);
  if (hitSelf) {
    endSnakeGame("You tangled into yourself!");
    return;
  }

  // Move snake
  snakeState.snake.unshift(nextHead);

  if (isEating) {
    const foodType = snakeState.food.type;
    let points = 10;
    let timeBonus = 4;
    let soundType = "eat";
    let extraGrowth = 0;

    if (foodType === "diamond") {
      points = 50;
      timeBonus = 12;
      soundType = "diamond";
      snakeState.diamondsEaten = (snakeState.diamondsEaten || 0) + 1;
    } else if (foodType === "golden") {
      points = 30;
      timeBonus = 8;
      soundType = "bonus";
      extraGrowth = 1;
      snakeState.goldenEaten = (snakeState.goldenEaten || 0) + 1;
    } else {
      snakeState.applesEaten = (snakeState.applesEaten || 0) + 1;
    }

    snakeState.score += points;

    if (snakeState.mode === "timed") {
      snakeState.timeLeft += timeBonus;
      const timeEl = document.getElementById("snakeTimeVal");
      if (timeEl) timeEl.textContent = `${snakeState.timeLeft}s`;
    }

    if (snakeState.score > snakeState.highScore) {
      snakeState.highScore = snakeState.score;
      saveSnakeHighScore();
    }

    playSnakeSound(soundType);
    spawnSnakeEatParticles(snakeState.food.x, snakeState.food.y, foodType);

    if (extraGrowth > 0) {
      const tail = snakeState.snake[snakeState.snake.length - 1];
      snakeState.snake.push({ ...tail });
    }

    spawnSnakeFood();
    updateSnakeHUD();
  } else {
    snakeState.snake.pop();
  }

  renderSnakeFrame();
}

function updateSnakeHUD() {
  const scoreEl = document.getElementById("snakeScoreVal");
  const highEl = document.getElementById("snakeHighScoreVal");
  const lenEl = document.getElementById("snakeLengthVal");
  const timeEl = document.getElementById("snakeTimeVal");

  // Top Bar HUD
  if (scoreEl) scoreEl.textContent = snakeState.score;
  if (highEl) highEl.textContent = snakeState.highScore;
  if (lenEl) lenEl.textContent = snakeState.snake ? snakeState.snake.length : 0;
  if (timeEl) timeEl.textContent = `${snakeState.timeLeft}s`;

  // Canvas floating badges
  const cScoreBadge = document.getElementById("snakeCanvasScoreBadge");
  const cModeBadge = document.getElementById("snakeCanvasModeBadge");
  if (cScoreBadge) cScoreBadge.textContent = `${snakeState.score} pts`;
  if (cModeBadge) {
    const modeNames = { classic: "Classic Mode", nowalls: "No Walls Mode", obstacles: "Obstacles Mode", timed: "Timed Blitz" };
    cModeBadge.textContent = modeNames[snakeState.mode] || "Classic Mode";
  }
}

function startSnakeAnimLoop() {
  if (snakeState.animFrameId) cancelAnimationFrame(snakeState.animFrameId);

  const loop = () => {
    if (snakeState.isRunning || snakeState.particles.length > 0) {
      renderSnakeFrame();
      snakeState.animFrameId = requestAnimationFrame(loop);
    }
  };
  snakeState.animFrameId = requestAnimationFrame(loop);
}

function renderSnakeFrame() {
  const canvas = document.getElementById("snakeCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const gs = snakeState.gridSize;
  const ts = snakeState.tileSize;

  const isLight = document.body.dataset.theme === "light";

  // 1. Clear background
  ctx.clearRect(0, 0, width, height);

  // Background subtle gradient
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.72);
  if (isLight) {
    bgGrad.addColorStop(0, "#ecfdf5");
    bgGrad.addColorStop(1, "#d1fae5");
  } else {
    bgGrad.addColorStop(0, "#08201a");
    bgGrad.addColorStop(1, "#030a08");
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Frosted Grid lines
  ctx.lineWidth = 1;
  ctx.strokeStyle = isLight ? "rgba(16, 185, 129, 0.08)" : "rgba(255, 255, 255, 0.035)";
  for (let i = 0; i <= gs; i++) {
    ctx.beginPath();
    ctx.moveTo(i * ts, 0);
    ctx.lineTo(i * ts, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * ts);
    ctx.lineTo(width, i * ts);
    ctx.stroke();
  }

  // 3. Render Obstacles (Sea Glass Crystal Pillars)
  if (snakeState.mode === "obstacles" && snakeState.obstacles.length) {
    snakeState.obstacles.forEach(ob => {
      const ox = ob.x * ts + 2;
      const oy = ob.y * ts + 2;
      const oSize = ts - 4;

      ctx.save();
      ctx.fillStyle = isLight ? "rgba(14, 116, 144, 0.22)" : "rgba(6, 182, 212, 0.16)";
      ctx.strokeStyle = isLight ? "#0891b2" : "#22d3ee";
      ctx.lineWidth = 1.8;
      ctx.shadowColor = isLight ? "rgba(8, 145, 178, 0.3)" : "rgba(34, 211, 238, 0.4)";
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.roundRect(ox, oy, oSize, oSize, 6);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ox + 4, oy + oSize - 6);
      ctx.lineTo(ox + 4, oy + 4);
      ctx.lineTo(ox + oSize - 6, oy + 4);
      ctx.stroke();
      ctx.restore();
    });
  }

  // 4. Render Food (Apple / Golden Fruit / Diamond Gem)
  if (snakeState.food) {
    const fx = snakeState.food.x * ts + ts / 2;
    const fy = snakeState.food.y * ts + ts / 2;
    const foodType = snakeState.food.type;
    const pulse = Math.sin(Date.now() / 180) * 1.5;
    const radius = (ts / 2 - 4) + pulse;

    ctx.save();

    if (foodType === "diamond") {
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#22d3ee";

      // Prismatic Diamond crystal geometry
      const dGrad = ctx.createRadialGradient(fx - 2, fy - 2, 2, fx, fy, radius);
      dGrad.addColorStop(0, "#ecfeff");
      dGrad.addColorStop(0.5, "#06b6d4");
      dGrad.addColorStop(1, "#0891b2");
      ctx.fillStyle = dGrad;

      ctx.beginPath();
      ctx.moveTo(fx, fy - radius - 1);
      ctx.lineTo(fx + radius * 0.85, fy);
      ctx.lineTo(fx, fy + radius + 1);
      ctx.lineTo(fx - radius * 0.85, fy);
      ctx.closePath();
      ctx.fill();

      // Specular crystal facets
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.beginPath();
      ctx.moveTo(fx, fy - radius - 1);
      ctx.lineTo(fx + radius * 0.35, fy - radius * 0.2);
      ctx.lineTo(fx, fy);
      ctx.lineTo(fx - radius * 0.35, fy - radius * 0.2);
      ctx.closePath();
      ctx.fill();

    } else {
      const isGolden = (foodType === "golden");
      ctx.shadowBlur = isGolden ? 16 : 12;
      ctx.shadowColor = isGolden ? "#fbbf24" : "#ef4444";

      const fruitGrad = ctx.createRadialGradient(fx - 2, fy - 2, 2, fx, fy, radius);
      if (isGolden) {
        fruitGrad.addColorStop(0, "#fef08a");
        fruitGrad.addColorStop(0.6, "#f59e0b");
        fruitGrad.addColorStop(1, "#b45309");
      } else {
        fruitGrad.addColorStop(0, "#fca5a5");
        fruitGrad.addColorStop(0.55, "#ef4444");
        fruitGrad.addColorStop(1, "#991b1b");
      }

      ctx.fillStyle = fruitGrad;
      ctx.beginPath();
      ctx.arc(fx, fy, Math.max(4, radius), 0, Math.PI * 2);
      ctx.fill();

      // Leaf / stem
      ctx.shadowBlur = 0;
      ctx.strokeStyle = isGolden ? "#fde047" : "#22c55e";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(fx, fy - radius + 1);
      ctx.quadraticCurveTo(fx + 4, fy - radius - 5, fx + 6, fy - radius - 3);
      ctx.stroke();

      // Specular glass shine dot
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.beginPath();
      ctx.arc(fx - radius * 0.35, fy - radius * 0.35, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // 5. Render Glowing Snake
  const skin = SNAKE_SKINS[snakeState.skin] || SNAKE_SKINS.emerald;
  const snakeLen = snakeState.snake.length;

  for (let i = snakeLen - 1; i >= 0; i--) {
    const seg = snakeState.snake[i];
    const sx = seg.x * ts + 2;
    const sy = seg.y * ts + 2;
    const sSize = ts - 4;
    const isHead = (i === 0);

    ctx.save();
    ctx.shadowColor = skin.glow;
    ctx.shadowBlur = isHead ? 14 : 8;

    // Body segment gradient interpolation
    ctx.fillStyle = isHead ? skin.head : skin.bodyGrad[1];

    ctx.beginPath();
    ctx.roundRect(sx, sy, sSize, sSize, isHead ? 10 : 8);
    ctx.fill();

    // Segment inner highlight border for authentic Sea Glass look
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Head eyes with direction tracking
    if (isHead) {
      const dx = snakeState.dir.x;
      const dy = snakeState.dir.y;
      const eyeR = 2.5;

      let e1x = sx + sSize * 0.35;
      let e1y = sy + sSize * 0.35;
      let e2x = sx + sSize * 0.65;
      let e2y = sy + sSize * 0.35;

      if (dx === 1) { // Right
        e1x = sx + sSize * 0.65; e1y = sy + sSize * 0.28;
        e2x = sx + sSize * 0.65; e2y = sy + sSize * 0.72;
      } else if (dx === -1) { // Left
        e1x = sx + sSize * 0.35; e1y = sy + sSize * 0.28;
        e2x = sx + sSize * 0.35; e2y = sy + sSize * 0.72;
      } else if (dy === 1) { // Down
        e1x = sx + sSize * 0.28; e1y = sy + sSize * 0.65;
        e2x = sx + sSize * 0.72; e2y = sy + sSize * 0.65;
      } else if (dy === -1) { // Up
        e1x = sx + sSize * 0.28; e1y = sy + sSize * 0.35;
        e2x = sx + sSize * 0.72; e2y = sy + sSize * 0.35;
      }

      // Eye whites
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(e1x, e1y, eyeR, 0, Math.PI * 2);
      ctx.arc(e2x, e2y, eyeR, 0, Math.PI * 2);
      ctx.fill();

      // Pupils looking in dir
      ctx.fillStyle = skin.eye;
      const px = dx * 1;
      const py = dy * 1;
      ctx.beginPath();
      ctx.arc(e1x + px, e1y + py, 1.3, 0, Math.PI * 2);
      ctx.arc(e2x + px, e2y + py, 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Cute animated tongue flick!
      const tongueCycle = Date.now() % 2800;
      if (tongueCycle < 280 && snakeState.isRunning && !snakeState.isPaused) {
        const tLen = 6 + (tongueCycle < 140 ? tongueCycle / 14 : (280 - tongueCycle) / 14);
        const startX = sx + sSize / 2 + dx * (sSize / 2);
        const startY = sy + sSize / 2 + dy * (sSize / 2);
        const endX = startX + dx * tLen;
        const endY = startY + dy * tLen;

        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        if (dx !== 0) {
          ctx.lineTo(endX + dx * 2.5, endY - 2.5);
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX + dx * 2.5, endY + 2.5);
        } else {
          ctx.lineTo(endX - 2.5, endY + dy * 2.5);
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX + 2.5, endY + dy * 2.5);
        }
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // 6. Render Particles
  for (let i = snakeState.particles.length - 1; i >= 0; i--) {
    const p = snakeState.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.038;

    if (p.alpha <= 0) {
      snakeState.particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function handleSnakeSteer(dx, dy) {
  if (hubState.game !== "snake") return;

  if (snakeState.isPaused) {
    resumeSnakeGame();
  }

  if (!snakeState.isRunning && !snakeState.isGameOver) {
    startSnakeGame();
  }

  if (!snakeState.dirQueue) snakeState.dirQueue = [];

  const lastQueued = snakeState.dirQueue.length > 0
    ? snakeState.dirQueue[snakeState.dirQueue.length - 1]
    : snakeState.dir;

  // Prevent immediate 180-degree self-reversal
  if (dx !== 0 && lastQueued.x !== 0) return;
  if (dy !== 0 && lastQueued.y !== 0) return;

  if (snakeState.dirQueue.length < 2) {
    snakeState.dirQueue.push({ x: dx, y: dy });
    playSnakeSound("turn");
  }
}

function cycleSnakeSkin() {
  const skinKeys = Object.keys(SNAKE_SKINS);
  const curIdx = skinKeys.indexOf(snakeState.skin);
  const nextIdx = (curIdx + 1) % skinKeys.length;
  setSnakeSkin(skinKeys[nextIdx]);
}

function setSnakeSkin(skinKey) {
  if (!SNAKE_SKINS[skinKey]) return;
  snakeState.skin = skinKey;
  try {
    localStorage.setItem("gap_snake_skin", snakeState.skin);
  } catch {}
  syncSnakeMatchBarUI();
  renderSnakeFrame();
}

function initSnakeEvents() {
  const canvas = document.getElementById("snakeCanvas");
  const startBtn = document.getElementById("snakeStartBtn");
  const pauseBtn = document.getElementById("snakePauseBtn");
  const resumeBtn = document.getElementById("snakeResumeBtn");
  const resetBtn = document.getElementById("snakeResetBtn");
  const restartFromPauseBtn = document.getElementById("snakeRestartFromPauseBtn");
  const playAgainBtn = document.getElementById("snakePlayAgainBtn");
  const muteBtn = document.getElementById("snakeMuteBtn");
  const modePills = document.getElementById("snakeModePills");
  const speedPills = document.getElementById("snakeSpeedPills");
  const skinCycleBtn = document.getElementById("snakeSkinCycleBtn");

  startBtn?.addEventListener("click", () => startSnakeGame());
  resumeBtn?.addEventListener("click", () => resumeSnakeGame());
  pauseBtn?.addEventListener("click", () => toggleSnakePause());
  resetBtn?.addEventListener("click", () => initSnake(true));
  restartFromPauseBtn?.addEventListener("click", () => initSnake(true));
  playAgainBtn?.addEventListener("click", () => {
    initSnake(true);
    startSnakeGame();
  });

  muteBtn?.addEventListener("click", () => {
    snakeState.sound = !snakeState.sound;
    try {
      localStorage.setItem("gap_snake_sound", String(snakeState.sound));
    } catch {}
    const muteIcon = document.getElementById("snakeMuteIcon");
    if (muteIcon) muteIcon.textContent = snakeState.sound ? "🔊" : "🔇";
  });

  // Top Match Bar Mode Selection
  function onSelectMode(modeKey) {
    if (!["classic", "nowalls", "obstacles", "timed"].includes(modeKey)) return;
    snakeState.mode = modeKey;
    try {
      localStorage.setItem("gap_snake_mode", snakeState.mode);
    } catch {}
    loadSnakeHighScore();
    initSnake(true);
  }

  modePills?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-snakemode]");
    if (btn) onSelectMode(btn.dataset.snakemode);
  });

  // Top Match Bar Speed Selection
  function onSelectSpeed(speedKey) {
    if (!SNAKE_SPEEDS[speedKey]) return;
    snakeState.speed = speedKey;
    try {
      localStorage.setItem("gap_snake_speed", snakeState.speed);
    } catch {}
    syncSnakeMatchBarUI();
    if (snakeState.isRunning && !snakeState.isPaused) {
      clearInterval(snakeState.gameInterval);
      snakeState.gameInterval = setInterval(tickSnakeGame, SNAKE_SPEEDS[snakeState.speed] || 95);
    }
  }

  speedPills?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-snakespeed]");
    if (btn) onSelectSpeed(btn.dataset.snakespeed);
  });

  // Skin Selector Cycle
  skinCycleBtn?.addEventListener("click", cycleSnakeSkin);

  // Keyboard Controls: Arrow Keys & WASD & Spacebar & R
  window.addEventListener("keydown", (e) => {
    if (hubState.game !== "snake") return;

    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;

    const key = e.key.toLowerCase();
    if (key === "arrowup" || key === "w") {
      e.preventDefault();
      handleSnakeSteer(0, -1);
    } else if (key === "arrowdown" || key === "s") {
      e.preventDefault();
      handleSnakeSteer(0, 1);
    } else if (key === "arrowleft" || key === "a") {
      e.preventDefault();
      handleSnakeSteer(-1, 0);
    } else if (key === "arrowright" || key === "d") {
      e.preventDefault();
      handleSnakeSteer(1, 0);
    } else if (e.code === "Space") {
      e.preventDefault();
      toggleSnakePause();
    } else if (key === "r") {
      e.preventDefault();
      initSnake(true);
      startSnakeGame();
    }
  });

  // Mobile Swipe Detection on Canvas
  let touchStartX = 0;
  let touchStartY = 0;
  canvas?.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas?.addEventListener("touchmove", (e) => {
    if (hubState.game === "snake") {
      e.preventDefault();
    }
  }, { passive: false });

  canvas?.addEventListener("touchend", (e) => {
    if (!touchStartX && !touchStartY) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.hypot(dx, dy) > 24) {
      if (Math.abs(dx) > Math.abs(dy)) {
        handleSnakeSteer(dx > 0 ? 1 : -1, 0);
      } else {
        handleSnakeSteer(0, dy > 0 ? 1 : -1);
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   GAP Diagnostic & Test Engine Bridges (For Automated Verification)
   ========================================================================== */
window.hubState = hubState;
window.recalculateSequences = recalculateSequences;
window.validateHardMode = validateHardMode;
window.getLegalMovesForColor = getLegalMovesForColor;
window.checkChessDrawCondition = checkChessDrawCondition;
window.pokerShowdown = pokerShowdown;
window.runAllInShowdown = runAllInShowdown;
window.snakeState = snakeState;
window.endSnakeGame = endSnakeGame;
window.setChessHalfmoveClock = (v) => { chessHalfmoveClock = v; };
window.getChessHalfmoveClock = () => chessHalfmoveClock;
window.setChessEnPassant = (v) => { chessEnPassant = v; };
window.getChessEnPassant = () => chessEnPassant;
window.setWordleHardMode = (v) => { wordleHardMode = v; };
window.setWordleRow = (v) => { wordleRow = v; };
window.setWordleTarget = (v) => { wordleTarget = v; };
window.getWordleGrid = () => wordleGrid;
window.setWordleGrid = (v) => { wordleGrid = v; };
window.getPokerState = () => ({
  pokerPlayerChips,
  pokerAiChips,
  pokerPot,
  pokerTurn,
  pokerAiBet,
  pokerPlayerBet,
  pokerStage,
  pokerCommunity,
  pokerPlayerCards,
  pokerAiCards,
  pokerOver
});
window.setPokerState = (s) => {
  if (s.playerChips !== undefined) pokerPlayerChips = s.playerChips;
  if (s.aiChips !== undefined) pokerAiChips = s.aiChips;
  if (s.pot !== undefined) pokerPot = s.pot;
  if (s.stage !== undefined) pokerStage = s.stage;
  if (s.playerBet !== undefined) pokerPlayerBet = s.playerBet;
  if (s.aiBet !== undefined) pokerAiBet = s.aiBet;
  if (s.currentBet !== undefined) pokerCurrentBet = s.currentBet;
  if (s.turn !== undefined) pokerTurn = s.turn;
  if (s.community !== undefined) pokerCommunity = s.community;
  if (s.playerCards !== undefined) pokerPlayerCards = s.playerCards;
  if (s.aiCards !== undefined) pokerAiCards = s.aiCards;
  if (s.over !== undefined) pokerOver = s.over;
};
