# GAP — Floating Cyber Panel / Glass Island 

A fully offline arcade UI with **no external dependencies** and a cyber-glass aesthetic.

## ✅ Offline-Only Guarantee
- No CDN scripts
- No CDN styles
- No webfont imports
- Uses system font stack only:
  - `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Icons are rendered via inline SVG masks/data URIs in CSS

## UI Architecture
1. **Top Floating Command Island**
   - Brand: GAP
   - Game selector: 3x3 TTT / 5x5 TTT / Chess
   - Theme picker: Light / Dark / Itachi

2. **Center Stage Arena**
   - Turn badge shown when timer is Off
   - Radial countdown gauge shown only when timer is active
   - Board centered, fixed desktop-safe sizing
   - Chess captured strips above/below board

3. **Bottom Floating Quick-Dock**
   - Timer segments: Off / 15s / 30s / 45s / 60s
   - Actions: Reset Score / Undo / New Game
   - Score ticker inline

## Timer Bug Fix (Implemented)
- Timer initializes as `off` by default.
- Off is active on first load.
- Radial gauge is hidden/inactive at startup.
- Countdown only starts after selecting 15/30/45/60.
- URL/hash + local state persist `timer=off` by default.

## Themes
- **Dark**: cyan-magenta glow over deep dark
- **Light**: bright frosted glass palette
- **Itachi**: crimson/obsidian variant

## Run
Open `index.html` directly in your browser.  
No install/build/dev server required.