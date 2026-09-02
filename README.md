# GAP — Arcade Gaming Hub (Offline-First)

A high-performance, 100% offline browser arcade hub featuring **Tic-Tac-Toe (3×3 & 5×5)**, **Chess**, and an expanded **Wordle** engine.

## Features
- **Wordle with Player-Controlled Difficulty & Dictionary Validation**:
  - Direct player control over Easy, Medium, and Hard tiers (no forced automatic upgrades).
  - Guesses are validated against an offline dictionary; invalid submissions trigger a row-shake animation and prompt.
  - Dedicated 24px vertical separation ensures the 6th row and virtual keyboard do not collide.
  - Single-player setup cleanly hides the opponent toggle while preserving difficulty options.
- **Theming & Vector Aesthetics**:
  - **Light**: Background automatically dims to a soft pastel tint matching the active reload color.
  - **Dark**: Solid pure black (`#000000`) canvas with vibrant neon buttons.
  - **Itachi**: Standalone SVG red moon with Sharingan blades and ninja silhouette; uses custom Sharingan and Crow markers on Tic-Tac-Toe boards.
  - **Dynamic Reload Colors**: Automatically assigns a random neon palette (Emerald, Amber, Violet, Teal, or Lime) on reload.
- **Idle Move Watchdog**: An alert animation gently prompts the player if no move is made for over 60 seconds with the timer off.
- **100% Offline Guarantee**: No external CDNs, fonts, or tracking scripts.