from __future__ import annotations

import base64
import os
from pathlib import Path

import cv2 as cv
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model

import SudokuMath
from utils import biggestContour, displayNumbers, drawGrid, getPrediction, imageArrangement, reorder, splitBoxes


os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["CUDA_VISIBLE_DEVICES"] = ""


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATHS = [BASE_DIR / "model_trained.h5", BASE_DIR.parent / "model_trained.h5"]
MODEL_PATH = next((path for path in MODEL_PATHS if path.exists()), None)

if MODEL_PATH is None:
    raise FileNotFoundError("Could not find model_trained.h5 in backend/ or project root.")

app = FastAPI(title="Sudoku Solver API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model(str(MODEL_PATH))


def _decode_image(contents: bytes) -> np.ndarray:
    image_array = np.frombuffer(contents, dtype=np.uint8)
    image = cv.imdecode(image_array, cv.IMREAD_COLOR)
    if image is None:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")
    return image


def _encode_png(image: np.ndarray) -> str:
    success, buffer = cv.imencode(".png", image)
    if not success:
        raise HTTPException(status_code=500, detail="Could not encode the solved image.")
    return "data:image/png;base64," + base64.b64encode(buffer).decode("utf-8")


def solve_sudoku_image(image: np.ndarray) -> dict:
    height = 450
    width = 450
    image_blank = np.zeros((height, width, 3), np.uint8)
    image = cv.resize(image, (height, width))

    image_gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    image_blur = cv.GaussianBlur(image_gray, (5, 5), 1)
    image_threshold = cv.adaptiveThreshold(image_blur, 255, 1, 1, 11, 2)

    image_contours = image.copy()
    image_big_contour = image.copy()

    contours, _ = cv.findContours(image_threshold, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    biggest, _ = biggestContour(contours)

    if biggest.size == 0:
        raise HTTPException(status_code=400, detail="Could not find the Sudoku border in the image.")

    biggest = reorder(biggest)
    cv.drawContours(image_big_contour, biggest, -1, (0, 0, 255), 10)

    pts1 = np.float32(biggest)
    pts2 = np.float32([[0, 0], [width, 0], [0, height], [width, height]])
    matrix = cv.getPerspectiveTransform(pts1, pts2)
    image_warp_colored = cv.warpPerspective(image, matrix, (width, height))
    image_warp_gray = cv.cvtColor(image_warp_colored, cv.COLOR_BGR2GRAY)

    boxes = splitBoxes(image_warp_gray)
    numbers = getPrediction(boxes, model)
    numbers_array = np.asarray(numbers, dtype=int)
    image_detected_digits = displayNumbers(image_blank.copy(), numbers_array.tolist(), color=(255, 255, 255))
    pos_array = np.where(numbers_array > 0, 0, 1)

    board = np.array_split(numbers_array, 9)
    solved = SudokuMath.solve(board)
    if solved is False:
        raise HTTPException(status_code=400, detail="The detected board has no valid solution.")

    flat_solution = [item for sublist in board for item in sublist]
    solved_numbers = (np.asarray(flat_solution, dtype=int) * pos_array).astype(int).tolist()
    image_solved_digits = displayNumbers(image_blank.copy(), solved_numbers, color=(0, 255, 0))

    pts2 = np.float32(biggest)
    pts1 = np.float32([[0, 0], [width, 0], [0, height], [width, height]])
    matrix = cv.getPerspectiveTransform(pts1, pts2)
    image_inv_warp_colored = cv.warpPerspective(image_solved_digits, matrix, (width, height))
    inv_perspective = cv.addWeighted(image_inv_warp_colored, 1, image, 0.5, 1)

    image_detected_digits = drawGrid(image_detected_digits)
    image_solved_digits = drawGrid(image_solved_digits)

    image_array = [
        [image, image_threshold, image_contours, image_big_contour],
        [image_warp_gray, image_detected_digits, image_solved_digits, inv_perspective],
    ]
    arranged_images = imageArrangement(image_array, 1)

    return {
        "digits": numbers_array.tolist(),
        "solved": solved_numbers,
        "solutionImage": _encode_png(inv_perspective),
        "debugImage": _encode_png(arranged_images),
    }


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/solve")
async def solve(image: UploadFile = File(...)) -> JSONResponse:
    contents = await image.read()
    if not contents:
        raise HTTPException(status_code=400, detail="No image data received.")

    decoded = _decode_image(contents)
    result = solve_sudoku_image(decoded)
    return JSONResponse(result)


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
