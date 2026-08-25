# Personal Website & Projects

[tkandage.com](https://tkandage.com/)

## AI Sudoku Solver

An end-to-end pipeline for reading and solving Sudoku puzzles from images.

### Architecture

- **Frontend**: [Sudoku.html](Sudoku.html) – Upload a Sudoku image via the browser.
- **Backend**: [backend/main.py](backend/main.py) – FastAPI server that:
  1. Uses OpenCV to detect the grid and extract cells.
  2. Runs a trained CNN to read each digit.
  3. Solves the board via backtracking.
  4. Returns the solved puzzle as a base64 image.

### Quick Start

#### Local Development

1. **Start the backend API:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```
   The API is now on `http://localhost:8000`.

2. **Open the frontend:**
   - Open [Sudoku.html](Sudoku.html) in a browser (file:// or via a local server).
   - The page will auto-detect the backend at `http://localhost:8000`.

3. **Upload a Sudoku image, click "Solve", and see the result.**

#### Deployment

The frontend is deployed on GitHub Pages. To solve puzzles in production, point it to a deployed backend instance by updating the `API_BASE` in [Sudoku.html](Sudoku.html#L14).

### Project Structure

```
PersonalWebsite/
├── index.html              # Main portfolio page with link to Sudoku solver
├── Sudoku.html             # Sudoku solver frontend
├── backend/
│   ├── main.py             # FastAPI app with /solve endpoint
│   ├── utils.py            # OpenCV helpers (grid detection, digit extraction)
│   ├── SudokuMath.py        # Backtracking solver
│   ├── requirements.txt     # Python dependencies
│   ├── model_trained.h5     # Trained CNN model
│   └── README.md            # Backend setup guide
└── README.md               # This file
```

For detailed backend setup, see [backend/README.md](backend/README.md).