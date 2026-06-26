# features.py
# Pipeline fitur IDENTIK dengan notebook training 
# Urutan: HOG → LBP → Color Moments → Color Histogram → Gabor → GLCM
# Total raw features: 1965 dim

import numpy as np
from PIL import Image
from skimage.feature import hog, local_binary_pattern, graycomatrix, graycoprops
from skimage.color import rgb2gray, rgb2lab
from skimage.filters import gabor_kernel
from scipy.ndimage import convolve
from scipy.stats import skew

IMG_SIZE = (128, 128)

_GLCM_RANGES = {
    'contrast'     : (0.0, 63.0),
    'dissimilarity': (0.0, 63.0),
    'homogeneity'  : (0.0, 1.0),
    'energy'       : (0.0, 1.0),
    'correlation'  : (-1.0, 1.0),
    'ASM'          : (0.0, 1.0),
}


def preprocess_image(img_rgb: np.ndarray) -> np.ndarray:
    """Resize ke 128×128 dan normalize ke [0,1]. Identik dengan load_and_preprocess di training."""
    arr = img_rgb if img_rgb.max() <= 1.0 else img_rgb.astype(np.float32) / 255.0
    pil = Image.fromarray((arr * 255).astype(np.uint8)).convert('RGB')
    pil = pil.resize(IMG_SIZE, Image.LANCZOS)
    return np.array(pil, dtype=np.float32) / 255.0


def extract_hog(img_gray: np.ndarray) -> np.ndarray:
    # 1764 dim
    return hog(img_gray, orientations=9, pixels_per_cell=(16, 16),
               cells_per_block=(2, 2), block_norm='L2-Hys', feature_vector=True)


def extract_lbp(img_gray: np.ndarray) -> np.ndarray:
    # Multi-radius LBP R=1,2,3
    # R=1: P=8,  bins=10
    # R=2: P=16, bins=18
    # R=3: P=24, bins=26
    # Total: 54 dim
    feats = []
    for R in [1, 2, 3]:
        P      = 8 * R
        lbp    = local_binary_pattern(img_gray, P=P, R=R, method='uniform')
        n      = P + 2
        counts, _ = np.histogram(lbp.ravel(), bins=n, range=(0, n))
        feats.append((counts / (counts.sum() + 1e-8)).astype(np.float32))
    return np.concatenate(feats)


def extract_color_moments(img_rgb: np.ndarray) -> np.ndarray:
    # Mean + Std + Skewness per channel RGB+HSV+LAB = 27 dim
    feats = []

    # RGB
    for ch in range(3):
        c = img_rgb[:, :, ch].ravel()
        s = float(skew(c))
        feats += [float(c.mean()), float(c.std()), float(np.clip((s + 3) / 6, 0, 1))]

    # HSV
    img_u8  = (img_rgb * 255).astype(np.uint8)
    img_hsv = np.array(Image.fromarray(img_u8).convert('HSV'),
                       dtype=np.float32) / 255.0
    for ch in range(3):
        c = img_hsv[:, :, ch].ravel()
        s = float(skew(c))
        feats += [float(c.mean()), float(c.std()), float(np.clip((s + 3) / 6, 0, 1))]

    # LAB
    img_lab = rgb2lab(img_rgb)
    ranges  = [(0, 100), (-128, 127), (-128, 127)]
    for ch, (lo, hi) in enumerate(ranges):
        c_raw = img_lab[:, :, ch].ravel()
        c     = np.clip((c_raw - lo) / (hi - lo + 1e-8), 0, 1)
        s     = float(skew(c_raw))
        feats += [float(c.mean()), float(c.std()), float(np.clip((s + 3) / 6, 0, 1))]

    return np.array(feats, dtype=np.float32)


def extract_color_histogram(img_rgb: np.ndarray) -> np.ndarray:
    # RGB + HSV, 8 bins, true probability (counts/sum) = 48 dim
    feats = []
    for ch in range(3):
        counts, _ = np.histogram(img_rgb[:, :, ch].ravel(), bins=8, range=(0.0, 1.0))
        feats.append((counts / (counts.sum() + 1e-8)).astype(np.float32))

    img_u8  = (img_rgb * 255).astype(np.uint8)
    img_hsv = np.array(Image.fromarray(img_u8).convert('HSV'),
                       dtype=np.float32) / 255.0
    for ch in range(3):
        counts, _ = np.histogram(img_hsv[:, :, ch].ravel(), bins=8, range=(0.0, 1.0))
        feats.append((counts / (counts.sum() + 1e-8)).astype(np.float32))

    return np.concatenate(feats)


def extract_gabor(img_gray: np.ndarray) -> np.ndarray:
    # 4 frekuensi × 6 orientasi × 2 stat = 48 dim
    feats = []
    for freq in [0.1, 0.2, 0.3, 0.4]:
        for i in range(6):
            theta  = i * np.pi / 6
            kernel = np.real(gabor_kernel(freq, theta=theta, sigma_x=1, sigma_y=1))
            filt   = np.clip(np.abs(convolve(img_gray, kernel, mode='wrap')), 0, 1)
            feats += [float(filt.mean()), float(filt.std())]
    return np.array(feats, dtype=np.float32)


def extract_glcm(img_gray: np.ndarray) -> np.ndarray:
    # 2 jarak × 6 properti × 2 stat = 24 dim
    img_q = (img_gray * 255).astype(np.uint8) // 4
    feats = []
    props = ['contrast', 'dissimilarity', 'homogeneity', 'energy', 'correlation', 'ASM']
    for dist in [1, 3]:
        glcm = graycomatrix(img_q, distances=[dist],
                            angles=[0, np.pi / 4, np.pi / 2, 3 * np.pi / 4],
                            levels=64, symmetric=True, normed=True)
        for prop in props:
            vals   = graycoprops(glcm, prop)[0]
            lo, hi = _GLCM_RANGES[prop]
            normed = np.clip((vals - lo) / (hi - lo + 1e-8), 0, 1)
            feats += [float(normed.mean()), float(normed.std())]
    return np.array(feats, dtype=np.float32)


def extract_features(img_rgb: np.ndarray) -> np.ndarray:
    """
    Pipeline lengkap — IDENTIK dengan extract_features() di notebook training.

    Urutan (JANGAN diubah, harus sama persis):
      HOG   : 1764 dim
      LBP   :   54 dim
      CM    :   27 dim
      CH    :   48 dim
      Gabor :   48 dim
      GLCM  :   24 dim
      TOTAL : 1965 dim

    Setelah ini: scaler → pca → selector → model.predict()
    """
    gray = rgb2gray(img_rgb).astype(np.float32)
    vec  = np.concatenate([
        extract_hog(gray),                # 1764
        extract_lbp(gray),                # 54
        extract_color_moments(img_rgb),   # 27
        extract_color_histogram(img_rgb), # 48
        extract_gabor(gray),              # 48
        extract_glcm(gray),               # 24
    ])
    return np.nan_to_num(vec, nan=0.0, posinf=1.0, neginf=0.0)
