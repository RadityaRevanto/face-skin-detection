# main.py — FastAPI ML Service
# Jalankan: uvicorn main:app --reload --port 8000
#
# Endpoint sesuai yang dipanggil:
#   POST /predict       ← dari app/api/predict/upload/route.ts
#   POST /predict-crop  ← dari app/api/predict/livecam/route.ts

import io
import pickle
import logging
from pathlib import Path
from contextlib import asynccontextmanager

import cv2
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from features import extract_features, preprocess_image

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

# ── Path model ──────────────────────────────────────────────────────────────
MODEL_DIR     = Path(__file__).parent / "models"
MODEL_PATH    = MODEL_DIR / "best_model.pkl"
ARTIFACT_PATH = MODEL_DIR / "artifacts_v4.pkl"
LE_PATH       = MODEL_DIR / "label_encoder.pkl"

# Severity per kelas — untuk field severity_score & severity_level di response
# (dipakai Raga saat insert ke tabel prediction_histories)
SEVERITY = {
    "inflammatory acne"                 : {"score": 0.85, "level": "high"},
    "non inflammatory acne black heads" : {"score": 0.50, "level": "medium"},
    "non inflammatory acne white heads" : {"score": 0.50, "level": "medium"},
    "Redness"                           : {"score": 0.60, "level": "medium"},
    "dark spots"                        : {"score": 0.40, "level": "low"},
    "pigmentation"                      : {"score": 0.40, "level": "low"},
    "pores"                             : {"score": 0.30, "level": "low"},
    "wrinkles"                          : {"score": 0.30, "level": "low"},
}

# ── Global objects ──────────────────────────────────────────────────────────
svm_model  = None
artifacts  = None
le         = None
yolo_model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global svm_model, artifacts, le, yolo_model

    log.info("Loading models...")

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model tidak ditemukan: {MODEL_PATH}\nPastikan sudah taruh .pkl di folder models/")

    with open(MODEL_PATH,    "rb") as f: svm_model = pickle.load(f)
    with open(ARTIFACT_PATH, "rb") as f: artifacts = pickle.load(f)
    with open(LE_PATH,       "rb") as f: le        = pickle.load(f)
    log.info(f"✅ SVM loaded | classes: {list(le.classes_)}")

    # YOLO untuk /predict (upload foto penuh, perlu crop wajah dulu)
    try:
        from ultralytics import YOLO
        yolo_model = YOLO("yolov8n.pt")
        log.info("✅ YOLO loaded")
    except Exception as e:
        log.warning(f"YOLO gagal load: {e} — /predict akan pakai gambar penuh tanpa crop")

    yield
    log.info("Server shutdown.")


app = FastAPI(title="Face Skin ML Service", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helper ──────────────────────────────────────────────────────────────────
def decode_upload(file_bytes: bytes) -> np.ndarray:
    """Bytes → numpy RGB float32 [0,1] array."""
    pil = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    return np.array(pil, dtype=np.float32) / 255.0


def run_inference(img_rgb_float: np.ndarray) -> dict:
    """
    Core inference pipeline.
    Input : float32 (H, W, 3) [0,1] — belum di-resize
    Output: dict sesuai PredictionResult type di Raga
    """
    # 1. Preprocess (resize 128×128)
    img = preprocess_image(img_rgb_float)

    # 2. Ekstrak fitur (1965 dim)
    feats = extract_features(img).reshape(1, -1)

    # 3. Pipeline preprocessing (HARUS urutan ini)
    feats = artifacts["scaler"].transform(feats)    # StandardScaler
    feats = artifacts["pca"].transform(feats)       # PCA (90% var → 317 dim)
    feats = artifacts["selector"].transform(feats)  # SelectKBest (top 50% → 158 dim)

    # 4. Prediksi
    pred_enc = svm_model.predict(feats)[0]
    label    = le.inverse_transform([pred_enc])[0]

    # 5. Probabilitas
    proba_dict = {}
    confidence = 1.0
    if hasattr(svm_model, "predict_proba"):
        proba      = svm_model.predict_proba(feats)[0]
        proba_dict = {cls: round(float(p), 4) for cls, p in zip(le.classes_, proba)}
        confidence = round(float(max(proba)), 4)

    sev = SEVERITY.get(label, {"score": 0.3, "level": "low"})

    # Response sesuai PredictionResult type Raga
    return {
        "predicted_class": label,
        "confidence"     : confidence,
        "probabilities"  : proba_dict,
        "severity_score" : sev["score"],
        "severity_level" : sev["level"],
        "model_used"     : "SVM_RBF_v4",
    }


def crop_face_yolo(img_bgr: np.ndarray) -> np.ndarray | None:
    """
    Deteksi + crop wajah terbesar dengan YOLO.
    Return: RGB float32 array, atau None kalau tidak ada wajah.
    """
    if yolo_model is None:
        return None

    results = yolo_model(img_bgr, classes=[0], conf=0.4, verbose=False)

    best_box  = None
    best_area = 0

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            area = (x2 - x1) * (y2 - y1)
            if area > best_area:
                best_area = area
                best_box  = (x1, y1, x2, y2)

    if best_box is None:
        return None

    x1, y1, x2, y2 = best_box
    h, w  = img_bgr.shape[:2]
    pad_x = int((x2 - x1) * 0.10)
    pad_y = int((y2 - y1) * 0.10)
    x1 = max(0, x1 - pad_x)
    y1 = max(0, y1 - pad_y)
    x2 = min(w, x2 + pad_x)
    y2 = min(h, y2 + pad_y)

    crop_bgr = img_bgr[y1:y2, x1:x2]
    crop_rgb = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2RGB)
    return crop_rgb.astype(np.float32) / 255.0


# ── Endpoints ───────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status"      : "ok",
        "model_loaded": svm_model is not None,
        "yolo_loaded" : yolo_model is not None,
        "classes"     : list(le.classes_) if le else [],
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Dipanggil dari: app/api/predict/upload/route.ts
    Menerima foto penuh → YOLO crop wajah → prediksi kondisi kulit.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar (jpg/png)")

    data        = await file.read()
    img_float   = decode_upload(data)

    # Coba crop wajah dengan YOLO
    img_uint8   = (img_float * 255).astype(np.uint8)
    img_bgr     = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2BGR)
    face_float  = crop_face_yolo(img_bgr)

    if face_float is not None:
        log.info("YOLO: wajah terdeteksi, pakai crop")
        result = run_inference(face_float)
    else:
        log.warning("YOLO: tidak ada wajah, pakai gambar penuh")
        result = run_inference(img_float)

    return result


@app.post("/predict-crop")
async def predict_crop(file: UploadFile = File(...)):
    """
    Dipanggil dari: app/api/predict/livecam/route.ts
    Menerima gambar yang sudah di-crop wajahnya oleh FE (livecam).
    Langsung prediksi tanpa YOLO.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar (jpg/png)")

    data      = await file.read()
    img_float = decode_upload(data)
    result    = run_inference(img_float)

    return result
