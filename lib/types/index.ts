// =============================================================
// Shared Types - Face Skin Detection System
// =============================================================

export type UserRole = "user" | "doctor" | "admin";

export type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "revision_required"
  | "suspended";

export type ScanMode = "upload_image" | "livecam_yolo";

export type PriorityLevel = "low" | "medium" | "high";

export type SeverityLevel = "Mild" | "Moderate" | "Severe";

// ---------------------------
// Database Models
// ---------------------------

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface DoctorVerification {
  id: string;
  doctor_id: string;
  str_number?: string;
  specialization: string;
  document_url: string;
  verification_status: VerificationStatus;
  rejection_reason?: string;
  revision_note?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SkinConcern {
  id: string;
  name: string;
  description?: string;
  default_severity_score?: number;
  created_at: string;
}

export interface SkincareProduct {
  id: string;
  doctor_id: string;
  name: string;
  category: string;
  key_ingredients?: string;
  usage_instruction: string;
  warning?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkinRecommendation {
  id: string;
  concern_id: string;
  product_id?: string;
  doctor_id: string;
  title: string;
  recommendation_text: string;
  priority_level: PriorityLevel;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PredictionHistory {
  id: string;
  user_id: string;
  scan_mode: ScanMode;
  image_url?: string;
  cropped_image_url?: string;
  predicted_class: string;
  confidence: number;
  probabilities?: Record<string, number>;
  severity_score?: number;
  severity_level?: SeverityLevel;
  model_used?: string;
  created_at: string;
}

// ---------------------------
// ML / Prediction Types
// ---------------------------

export interface PredictionResult {
  predicted_class: string;
  confidence: number;
  probabilities: Record<string, number>;
  model_used: string;
  severity_score: number;
  severity_level: SeverityLevel;
}

// ---------------------------
// API Response Types
// ---------------------------

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
