// =============================================================
// Constants - Face Skincek System
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

// Routes — ALL STATIC (identitas item lewat query param, bukan dynamic segment)
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  REGISTER_DOCTOR: "/register/doctor",
  USER: {
    DASHBOARD: "/user/home",
    SCAN: "/user/scan",
    HISTORY: "/user/history",
    HISTORY_DETAIL: (id: string) => `/user/history/detail?id=${encodeURIComponent(id)}`,
    CONSULTATIONS: "/user/consultations",
    DOCTOR_PROFILE: (uuid: string) => `/user/consultations/detail?uuid=${encodeURIComponent(uuid)}`,
  },
  DOCTOR: {
    DASHBOARD: "/doctor/dashboard",
    CONSULTATIONS: "/doctor/consultations",
    SKINCARE: "/doctor/skincare",
    SKINCARE_CREATE: "/doctor/skincare/create",
    SKINCARE_EDIT: (id: string) => `/doctor/skincare/edit?id=${encodeURIComponent(id)}`,
    RECOMMENDATIONS: "/doctor/recommendations",
    RECOMMENDATIONS_CREATE: "/doctor/recommendations/create",
    RECOMMENDATIONS_EDIT: (id: string) => `/doctor/recommendations/edit?id=${encodeURIComponent(id)}`,
    SKIN_CONCERNS: "/doctor/skin-concerns",
    SKIN_CONCERNS_DETAIL: (id: string) => `/doctor/skin-concerns/detail?id=${encodeURIComponent(id)}`,
    SKIN_TYPES: "/doctor/skin-types",
    VERIFICATION_STATUS: "/doctor/verification-status",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    USER_DETAIL: (id: string) => `/admin/users/detail?id=${encodeURIComponent(id)}`,
    DOCTORS: "/admin/doctors",
    DOCTOR_DETAIL: (id: string) => `/admin/doctors/detail?id=${encodeURIComponent(id)}`,
    DOCTOR_VERIFICATIONS: "/admin/doctor-verifications",
    DOCTOR_VERIFICATION_DETAIL: (id: string) => `/admin/doctor-verifications/detail?id=${encodeURIComponent(id)}`,
    ACTIVITY_LOG: "/admin/activity-log",
  },
} as const;

// Storage Buckets
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

// Auth session — durasi cookie sesi login (Sanctum token via HttpOnly cookie).
// "sliding window" — selama pengguna aktif dalam 3 hari, sesi tetap berlanjut.
// Setelah 3 hari tanpa aktivitas, cookie kedaluwarsa dan pengguna harus login kembali.
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 3; // 259200
