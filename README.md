# GAP — Arcade Gaming Hub (Offline-First)

A high-performance, 100% offline browser arcade hub featuring **Tic-Tac-Toe (3×3 & 5×5)**, **Chess**, and an expanded **Wordle** engine.

## Features
- **Konohagakure Flame Vector Branding**: Glowing Leaf Village emblem integrated directly into the top command island and browser favicon.
- **Wordle with Player-Controlled Difficulty & Comprehensive Dictionary**:
  - Direct player control over Easy, Medium, and Hard tiers[cite: 3].
  - Common 5-letter words like `AISLE` and thousands more are strictly recognized by the offline dictionary.
  - Enlarged 64px–74px tile grid with 34px vertical separation, guaranteeing zero collision with the on-screen keyboard.
  - Opponent toggle is hidden in Wordle mode while keeping Difficulty controls fully functional[cite: 3].
- **Scaled-Up Layout**:
  - Top Command Island (84px) and Bottom Quick-Dock (76px) provide improved touch and click targets.
  - Tactile 48px buttons with vector icon illustrations for Undo, Reset, and New Game.
- **Theming & Vector Aesthetics**:
  - **Light**: Background automatically dims to a soft pastel tint matching the active reload color.
  - **Dark**: Solid pure black (`#000000`) canvas with vibrant neon buttons.
  - **Itachi**: Standalone SVG red moon with Sharingan blades, ninja silhouette, and custom Sharingan/Crow markers on Tic-Tac-Toe boards.
  - **Dynamic Reload Colors**: Automatically assigns a random neon palette (Emerald, Amber, Violet, Teal, or Lime) on reload.
- **Idle Move Watchdog**: An alert animation gently prompts the player if no move is made for over 60 seconds with the timer off[cite: 3].
- **100% Offline Guarantee**: No external CDNs, fonts, or tracking scripts.