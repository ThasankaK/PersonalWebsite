# Sudoku Solver Backend

A FastAPI server that reads Sudoku puzzles from images using OpenCV and a trained CNN, then solves them with backtracking.

## Setup

### 1. Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Ensure the model exists

The backend looks for `model_trained.h5` in either:
- `backend/model_trained.h5` (same folder as `main.py`)
- `model_trained.h5` (project root)

Make sure one of these paths has the trained CNN model.

### 3. Start the server

```bash
python main.py
```

The API will be available at `http://localhost:8000`.

## API Endpoints

### `GET /health`
Health check. Returns `{"status": "ok"}`.

### `POST /solve`
Solve a Sudoku puzzle from an image.

**Request:**
- Multipart form data with key `image` containing the image file.

**Response (success):**
```json
{
  "digits": [0, 5, 0, ..., 0],
  "solved": [3, 5, 7, ..., 9],
  "solutionImage": "data:image/png;base64,...",
  "debugImage": "data:image/png;base64,..."
}
```

- `digits`: The 81 numbers (flattened 9×9 grid) the model detected.
- `solved`: The same grid after solving (0 = empty).
- `solutionImage`: Base64-encoded PNG of the solved puzzle blended over the original.
- `debugImage`: Base64-encoded PNG of the full processing pipeline for debugging.

**Response (error):**
```json
{
  "detail": "Could not find the Sudoku border in the image."
}
```

## Usage from the Frontend

The [Sudoku.html](../Sudoku.html) page uploads to `/solve` and displays the result:

1. User selects an image → browser displays it on canvas.
2. User clicks "Solve" → `Sudoku.html` POSTs the image to `http://localhost:8000/solve`.
3. Backend processes, returns the solved image as base64.
4. Frontend renders it on the second canvas.

## CORS

The backend is configured to allow requests from any origin (`allow_origins=["*"]`), so it works whether the frontend is served locally via file:// or from GitHub Pages.

## Environment Variables

- `TF_ENABLE_ONEDNN_OPTS=0` – Disable oneDNN optimizations (avoids verbose logs).
- `TF_CPP_MIN_LOG_LEVEL=2` – Suppress TensorFlow INFO and WARNING logs.
- `CUDA_VISIBLE_DEVICES=""` – Force CPU mode (no GPU required).

These are set in `main.py` and can be overridden if you have a GPU.

## Deploying to Render

### Setup

1. **Push your repo to GitHub** (including `render.yaml` in the root).

2. **Create a Render account** at [render.com](https://render.com) and connect your GitHub repo.

3. **Create a new Web Service:**
   - Click "New +" → "Web Service".
   - Connect to your GitHub repository.
   - Set **Root Directory** to `backend` (or Render will auto-detect from `render.yaml`).
   - Render will automatically run `pip install -r requirements.txt && python main.py`.

4. **After deployment**, Render gives you a URL like `https://sudoku-api-xxxxx.onrender.com`.

5. **Update `Sudoku.html`:**
   - Open [Sudoku.html](../Sudoku.html) and find the line:
     ```javascript
     const API_BASE = "https://sudoku-api.onrender.com";
     ```
   - Replace the URL with your actual Render backend URL.
   - Commit and push. GitHub Pages will auto-update.

### Cold Starts

Render's free tier spins down after 15 minutes of inactivity. The first request takes ~10–30 seconds. After that, it's fast.

To keep it warm, use an uptime monitor (e.g., UptimeRobot) to ping `/health` every 5 minutes.

### Render-Specific Troubleshooting

**Deployment fails with "ModuleNotFoundError":**
- Check `requirements.txt` has all dependencies: `fastapi`, `uvicorn`, `opencv-python-headless`, `tensorflow`, etc.
- Render automatically runs `pip install -r requirements.txt`.

**Backend runs but frontend gets CORS error:**
- The backend has `allow_origins=["*"]`, so CORS should work.
- Check browser console for the full error.

**"Model not found" error on Render:**
- Ensure `model_trained.h5` is committed to your GitHub repo (in `backend/` or project root).
- Render clones the repo as part of deployment.

## Troubleshooting (Local)

**"Model not found"**: Ensure `model_trained.h5` is in `backend/` or the project root.

**"Could not find the Sudoku border"**: The image doesn't show a clear 9×9 grid. Try:
- Better lighting.
- A flatter angle.
- Ensure the full puzzle is in frame.

**"The detected board has no valid solution"**: One or more digits were misread. Try a clearer image.

**Port 8000 already in use**: Change the port in the `uvicorn.run()` call or kill the process using port 8000.
