#!/usr/bin/env node
// download-face-models.js
// Jalankan SEKALI: node download-face-models.js
// Script ini download model face-api.js ke folder public/models/

const https = require("https");
const fs    = require("fs");
const path  = require("path");

const BASE_URL  = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";
const OUT_DIR   = path.join(__dirname, "public", "models");

// File yang dibutuhkan untuk TinyFaceDetector + FaceLandmark68
const FILES = [
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
];

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`📁 Folder dibuat: ${OUT_DIR}`);
}

function download(filename) {
  return new Promise((resolve, reject) => {
    const url      = `${BASE_URL}/${filename}`;
    const destPath = path.join(OUT_DIR, filename);

    if (fs.existsSync(destPath)) {
      console.log(`⏭  Skip (sudah ada): ${filename}`);
      return resolve();
    }

    const file = fs.createWriteStream(destPath);
    console.log(`⬇️  Download: ${filename}`);

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} untuk ${filename}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`✅ Selesai : ${filename}`);
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

(async () => {
  console.log("🚀 Download model face-api.js...\n");
  for (const f of FILES) {
    await download(f);
  }
  console.log("\n✅ Semua model berhasil didownload ke public/models/");
  console.log("   Sekarang jalankan: npm install face-api.js");
})();
