# GAP 

A responsive, fully offline browser arcade featuring **Tic-Tac-Toe (3×3 & 5×5)** and **Chess** against local players or minimax-powered AI[cite: 1, 3]. Built with solid tactile theme surfaces, instant turn switching, and zero external dependencies[cite: 1, 2].

## Features
- **Games**: 3×3 Tic-Tac-Toe, 5×5 Tic-Tac-Toe, and full piece movement Chess[cite: 1, 3].
- **AI Engine**: Minimax algorithm with depth scaling based on difficulty level (Easy, Medium, Hard)[cite: 3].
- **Turn Timers**: Optional blitz turn timer (15s, 30s, 45s, 60s), strictly defaulted to Off[cite: 1, 2, 3].
- **Tactile Theme Engine**: 
  - **Dark**: Solid matte slate background with metallic gold tactile controls.
  - **Light**: Crisp off-white background with vivid emerald controls.
  - **Itachi**: Pure obsidian background with fiery crimson accents.
- **Score Persistence**: Tracks local wins, losses, draws, and win streaks across game modes using `localStorage`[cite: 2, 3].
- **Move Tools**: Undo turns, reset match history, and instant board restart[cite: 1, 3].

## 100% Offline Guarantee
- Zero external CDNs[cite: 2].
- No remote web fonts (uses native system font stacks)[cite: 2].
- No third-party CSS or JS dependencies[cite: 2].
- Runs directly by opening `index.html` in any modern web browser[cite: 2].

## Project Structure
```text
├── index.html       # Semantic HUD, Arena stage, and Quick-Dock layout
├── style.css        # Theme variables, tactile 3D buttons, and responsive grid rules
├── script.js        # Game engines (TTT/Chess), minimax AI, and UI state handlers
└── README.md        # Documentation and deployment instructions