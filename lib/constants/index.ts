// =============================================================
// Constants - Face Skin Detection System
// =============================================================

export const SKIN_CLASSES = [
  "Redness",
  "Dark Spots",
  "Inflammatory Acne",
  "Non-Inflammatory Acne",
  "Pigmentation",
  "Pores",
  "Wrinkles",
] as const;

export type SkinClass = (typeof SKIN_CLASSES)[number];

// Severity score mapping per class
export const SEVERITY_SCORE_MAP: Record<SkinClass, number> = {
  Redness: 30,
  "Dark Spots": 40,
  "Non-Inflammatory Acne": 45,
  Pigmentation: 50,
  Wrinkles: 60,
  Pores: 35,
  "Inflammatory Acne": 80,
};

export const SEVERITY_LEVELS = {
  MILD: { label: "Mild", min: 0, max: 40 },
  MODERATE: { label: "Moderate", min: 41, max: 65 },
  SEVERE: { label: "Severe", min: 66, max: 100 },
} as const;

// Upload validation
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: 5,
  ACCEPTED_FORMATS: ["image/jpeg", "image/jpg", "image/png"],
  ACCEPTED_EXTENSIONS: [".jpg", ".jpeg", ".png"],
} as const;

// Doctor upload validation
export const DOCTOR_DOC_CONFIG = {
  MAX_FILE_SIZE_MB: 5,
  ACCEPTED_FORMATS: ["application/pdf", "image/jpeg", "image/png"],
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  REGISTER_DOCTOR: "/register/doctor",
  USER: {
    DASHBOARD: "/user/dashboard",
    SCAN: "/user/pemeriksaan",
    HISTORY: "/user/history",
  },
  DOCTOR: {
    DASHBOARD: "/doctor/dashboard",
    SKINCARE: "/doctor/skincare",
    RECOMMENDATIONS: "/doctor/recommendations",
    VERIFICATION_STATUS: "/doctor/verification-status",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    DOCTORS: "/admin/doctors",
    DOCTOR_VERIFICATIONS: "/admin/doctor-verifications",
  },
} as const;

// Supabase Storage Buckets
export const STORAGE_BUCKETS = {
  SKIN_IMAGES: "skin-images",
  DOCTOR_DOCUMENTS: "doctor-documents",
  AVATARS: "avatars",
} as const;

export const YOLO_CONFIG = {
  FACE_CONFIDENCE_THRESHOLD: 0.6,
  STABLE_FRAMES_REQUIRED: 5,
} as const;

export const DISCLAIMER =
  "Hasil deteksi aplikasi ini merupakan prediksi awal berbasis gambar dan tidak menggantikan diagnosis medis. Untuk kondisi kulit berat, nyeri, meradang, atau tidak membaik, konsultasikan langsung dengan dokter.";
