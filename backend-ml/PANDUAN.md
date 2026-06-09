# 🧠 Panduan Bagian Modeling — Face Skin Detection

Dokumen ini adalah panduan lengkap untuk menjalankan bagian **modeling** dari proyek ini.

---

## 📁 Struktur Folder yang Dibuat

Letakkan folder `backend-ml` ini sejajar dengan folder frontend (root proyek):

```
face-skin-detection/          ← root repo (sudah ada)
├── app/                      ← frontend Next.js (sudah ada)
├── backend-ml/               ← ✅ FOLDER INI (kamu buat)
│   ├── app/
│   │   └── main.py           ← FastAPI service
│   ├── models/               ← hasil training (auto-generated)
│   │   ├── best_model.pkl
│   │   ├── label_encoder.pkl
│   │   ├── scaler.pkl
│   │   ├── feature_extractor_config.json
│   │   └── model_comparison.json
│   ├── notebooks/
│   │   └── skin_detection_training_pipeline.ipynb
│   ├── data/
│   │   ├── raw/              ← ✅ TARUH DATASET DI SINI
│   │   └── processed/
│   └── requirements.txt
└── ...
```

---

## 📥 Langkah 1 — Download Dataset

1. Buka link dataset:
   ```
   https://www.kaggle.com/datasets/shijo96john/facial-skin-acne-pigmentation-pores-wrinkles
   ```

2. Klik tombol **Download** (perlu login Kaggle)

3. Extract file zip yang didownload

4. Salin **semua folder class** ke dalam:
   ```
   backend-ml/data/raw/
   ```

   Hasilnya seperti ini:
   ```
   data/raw/
   ├── Inflammatory Acne/
   │   ├── img001.jpg
   │   ├── img002.jpg
   │   └── ...
   ├── Non-Inflammatory Acne/
   ├── Pigmentation/
   ├── Pores/
   ├── Redness/
   ├── Wrinkles/
   └── Dark Spots/
   ```

   > ⚠️ Nama folder harus persis seperti yang ada di dataset (jangan diganti).

---

## 🐍 Langkah 2 — Setup Python Environment

Buka terminal, masuk ke folder `backend-ml`:

```bash
cd backend-ml
```

Buat virtual environment (opsional tapi disarankan):

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac / Linux
python3 -m venv venv
source venv/bin/activate
```

Install semua library:

```bash
pip install -r requirements.txt
```

---

## 📓 Langkah 3 — Jalankan Notebook Training

1. Jalankan Jupyter:
   ```bash
   jupyter notebook
   ```

2. Buka file:
   ```
   notebooks/skin_detection_training_pipeline.ipynb
   ```

3. Jalankan semua cell dari atas ke bawah (**Run All** atau `Shift+Enter` tiap cell)

4. Proses yang akan berjalan otomatis:
   - ✅ EDA (distribusi class, sample gambar, resolusi)
   - ✅ Preprocessing (resize 128×128, normalisasi)
   - ✅ Feature extraction (HOG + Color Histogram)
   - ✅ Training 3 model (Naive Bayes, SVM, Logistic Regression)
   - ✅ Evaluasi klasifikasi (Accuracy, Precision, Recall, F1-Score, Confusion Matrix)
   - ✅ Evaluasi regresi severity score (RMSE, MAE, R²)
   - ✅ Pilih model terbaik berdasarkan F1-macro
   - ✅ Simpan `best_model.pkl`, `label_encoder.pkl`, `scaler.pkl`

5. Setelah selesai, cek folder `models/` — harus ada:
   ```
   models/
   ├── best_model.pkl
   ├── label_encoder.pkl
   ├── scaler.pkl
   ├── feature_extractor_config.json
   ├── model_comparison.json
   └── (beberapa file .png grafik)
   ```

---

## 🚀 Langkah 4 — Jalankan FastAPI

Setelah training selesai dan file model tersedia:

```bash
cd backend-ml
uvicorn app.main:app --reload --port 8000
```

Test apakah berjalan:

```bash
curl http://localhost:8000/health
# Output: {"status":"ok","model":"SVM"}
```

Lihat dokumentasi API otomatis:
```
http://localhost:8000/docs
```

---

## 🔗 Langkah 5 — Hubungkan ke Frontend

Buka file `.env.local` di root frontend, tambahkan:

```env
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
```

---

## ⏱️ Estimasi Waktu

| Proses | Estimasi |
|---|---|
| Download dataset | 5–10 menit |
| Install library | 3–5 menit |
| Feature extraction | 5–30 menit (tergantung jumlah gambar) |
| Training SVM | 2–10 menit |
| Training NB & LR | < 1 menit |

---

## ❓ Troubleshooting

**Dataset tidak terbaca:**
- Pastikan folder class langsung ada di dalam `data/raw/` (bukan nested lagi)
- Cek nama folder tidak ada typo

**SVM terlalu lama:**
- Kurangi jumlah gambar per class (ambil max 500 per class)
- Atau gunakan kernel `linear` yang lebih cepat

**Error `ModuleNotFoundError`:**
- Pastikan sudah `pip install -r requirements.txt`
- Pastikan virtual environment sudah aktif

**Port 8000 sudah dipakai:**
```bash
uvicorn app.main:app --reload --port 8001
```
