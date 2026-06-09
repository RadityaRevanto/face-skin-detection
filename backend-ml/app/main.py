"""
FastAPI ML Service — Face Skin Detection
Endpoint: /predict, /predict-crop, /health, /model-info
"""

import io
import json
import joblib
import numpy as np
from pathlib import Path
from PIL import Image

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from skimage.feature import hog

# ── Load config & model ────────────────────────────────────────────────────
BASE_DIR    = Path(__file__).parent.parent
MODELS_DIR  = BASE_DIR / 'models'

with open(MODELS_DIR / 'feature_extractor_config.json') as f:
    CONFIG = json.load(f)

IMG_SIZE          = tuple(CONFIG['img_size'])
HOG_ORIENTATIONS  = CONFIG['hog_orientations']
HOG_PPC           = tuple(CONFIG['hog_pixels_per_cell'])
HOG_CPB           = tuple(CONFIG['hog_cells_per_block'])
COLOR_BINS        = CONFIG['color_hist_bins']

model   = joblib.load(MODELS_DIR / 'best_model.pkl')
le      = joblib.load(MODELS_DIR / 'label_encoder.pkl')
scaler  = joblib.load(MODELS_DIR / 'scaler.pkl')

with open(MODELS_DIR / 'model_comparison.json') as f:
    comparison = json.load(f)

MODEL_NAME = comparison.get('best_model', 'Unknown')

# ── Severity mapping ───────────────────────────────────────────────────────
SEVERITY_MAP = {
    'Normal'               : 10,
    'Pores'                : 35,
    'Pigmentation'         : 50,
    'Wrinkles'             : 60,
    'Non-Inflammatory Acne': 65,
    'Acne'                 : 70,
    'Dark Spots'           : 70,
    'Redness'              : 75,
    'Inflammatory Acne'    : 80,
}

def severity_level(score: int) -> str:
    if score <= 30:   return 'Mild'
    elif score <= 60: return 'Moderate'
    else:             return 'Severe'

# ── Feature extraction ─────────────────────────────────────────────────────
def preprocess(img_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB').resize(IMG_SIZE, Image.LANCZOS)
    return np.array(img, dtype=np.float32) / 255.0

def extract_features(img_arr: np.ndarray) -> np.ndarray:
    gray = np.mean(img_arr, axis=2)
    hog_feat = hog(gray, orientations=HOG_ORIENTATIONS,
                   pixels_per_cell=HOG_PPC, cells_per_block=HOG_CPB,
                   block_norm='L2-Hys', feature_vector=True)
    hists = []
    for ch in range(3):
        hist, _ = np.histogram(img_arr[:, :, ch], bins=COLOR_BINS, range=(0, 1))
        hist = hist.astype(np.float32)
        hist /= (hist.sum() + 1e-6)
        hists.append(hist)
    return np.concatenate([hog_feat, np.concatenate(hists)])

def predict_image(img_bytes: bytes) -> dict:
    img_arr   = preprocess(img_bytes)
    feat_raw  = extract_features(img_arr)
    feat_sc   = scaler.transform([feat_raw])
    pred_enc  = model.predict(feat_sc)[0]
    pred_cls  = le.inverse_transform([pred_enc])[0]
    probas    = model.predict_proba(feat_sc)[0]
    confidence = float(probas.max())
    sev_score  = SEVERITY_MAP.get(pred_cls, 50)
    return {
        'predicted_class': pred_cls,
        'confidence'     : round(confidence, 4),
        'probabilities'  : {cls: round(float(p), 4)
                            for cls, p in zip(le.classes_, probas)},
        'model_used'     : MODEL_NAME,
        'severity_score' : sev_score,
        'severity_level' : severity_level(sev_score),
    }

# ── FastAPI app ────────────────────────────────────────────────────────────
app = FastAPI(title='Face Skin Detection ML API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/health')
def health():
    return {'status': 'ok', 'model': MODEL_NAME}

@app.get('/model-info')
def model_info():
    return {
        'model_name' : MODEL_NAME,
        'classes'    : list(le.classes_),
        'feature_dim': CONFIG['feature_dim'],
        'img_size'   : IMG_SIZE,
        'comparison' : {k: v for k, v in comparison.items() if k != 'best_model'},
    }

@app.post('/predict')
async def predict_upload(file: UploadFile = File(...)):
    if file.content_type not in ('image/jpeg', 'image/png', 'image/jpg'):
        raise HTTPException(400, 'Format file harus JPG atau PNG')
    img_bytes = await file.read()
    try:
        return predict_image(img_bytes)
    except Exception as e:
        raise HTTPException(500, f'Error saat prediksi: {str(e)}')

@app.post('/predict-crop')
async def predict_crop(file: UploadFile = File(...)):
    """Endpoint khusus untuk crop wajah dari YOLOv8 livecam."""
    img_bytes = await file.read()
    try:
        return predict_image(img_bytes)
    except Exception as e:
        raise HTTPException(500, f'Error saat prediksi crop: {str(e)}')
