# GAP — Glass UI Arcade (Offline-First)

Fully offline arcade UI with **Floating Glass HUD + Arena + Bottom Dock** and zero external dependencies.

## Offline Guarantee
- No Google Fonts
- No CDN CSS/JS
- No external icon libraries
- Uses native system font stack only
- Works by opening `index.html` directly

## Themes
### Dark (Black + Gold)
- Background: `#08080a` + warm amber orb glows
- Glass: `rgba(18, 18, 20, 0.7)`
- Active buttons: gold metallic highlight

### Light (White + Emerald)
- Background: `#f8fafc` + emerald/jade orb glows
- Glass: `rgba(255, 255, 255, 0.75)`
- Active buttons: vivid green emphasis

### Itachi
- Crimson/ruby glows
- Obsidian glass
- Red active borders and accents

## UX Requirements Implemented
- Scaled controls (44–48px button height)
- Top HUD: Brand + Game, Opponent, Difficulty, Theme
- Bottom dock: Timer + Reset Score + Undo + New Game + scoreboard
- Center arena board with zero desktop vertical scroll
- Board sizing: `width: min(72vmin, 540px); aspect-ratio: 1/1`

## Timer Logic (Fixed)
- Default: `timer = "off"`
- Off is active on first load
- Radial countdown hidden while timer is Off
- Countdown starts only if 15/30/45/60 selected

## Run
Open `index.html` in a browser.