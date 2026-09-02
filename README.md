# Game Hub: Tic-Tac-Toe + Chess

A browser-based game hub with:

- **Tic-Tac-Toe (2 Players)**
- **Tic-Tac-Toe vs Computer**
- **Chess (2 Players)**
- **Chess vs Computer**

---

## Features

### General
- Mode switcher between Tic-Tac-Toe and Chess
- Reset button for current mode
- Status text for turn/win/draw/game-over
- Clean single-page UI

### Tic-Tac-Toe
- Human vs Human
- Human vs AI
- AI uses minimax-style best-move logic with difficulty personality:
  - **Easy:** frequent random mistakes
  - **Medium:** mostly strong, occasional imperfect move
  - **Hard:** strongest deterministic choice

### Chess
- Human vs Human
- Human vs AI (AI plays Black)
- Captured pieces panel with clear labels:
  - **White captured**
  - **Black captured**
- Pawn promotion to queen
- AI thinking indicator (`AI thinking...`)
- Difficulty-based pacing delay:
  - **Easy:** fast
  - **Medium:** moderate
  - **Hard:** slower (more “thoughtful” feel)

### Chess AI
- Minimax with alpha-beta pruning
- Material-based board evaluation
- Move ordering preference (captures prioritized)
- Difficulty-based search depth:
  - **Easy:** depth 1
  - **Medium:** depth 2
  - **Hard:** depth 3

---

## Project Structure

- `index.html` – UI layout and controls
- `style.css` – app styling and board visuals
- `script.js` – game logic (TTT + Chess + AI)

---

## Run Locally

1. Clone repo:
   ```bash
   git clone https://github.com/lokeshreddy79/tictactoe.git
   cd tictactoe
   ```

2. Open `index.html` in your browser  
   (or use VS Code Live Server).

---

## Commit & Push (after edits)

```bash
git add .
git commit -m "Update README and game features"
git push origin main
```

---

## Notes

- This Chess implementation uses **pseudo-legal moves** (lightweight ruleset) and is designed for smooth browser gameplay.
- Advanced tournament rules (castling, en-passant, full check legality engine, repetition, 50-move rule) are not fully implemented in this version.

---

## Author

Maintained in: `GAP`