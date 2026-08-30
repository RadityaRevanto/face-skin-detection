// Tipe area home mengikuti kontrak kanonik backend (PredictionHistoryResource).
import type {
  OtherConcern,
  ScanMode,
  SeverityLevel,
  SkincareRecommendation,
  SkinConcernInfo,
  TreatmentRecommendation,
} from "@/lib/api/scans-query";

// `id` diisi dari `uuid` backend (PK internal disembunyikan).
export type PredictionHistory = {
  id: string;
  scan_mode: ScanMode;
  image_url: string | null;
  predicted_class: string;
  confidence: number | string;
  probabilities: Record<string, number> | null;
  severity_score: number | null; // 0–100
  severity_level: SeverityLevel | null;
  model_used: string | null;
  created_at: string;
  skin_concern?: SkinConcernInfo | null;
  other_concerns?: OtherConcern[];
  treatment_recommendations?: TreatmentRecommendation[];
  skincare_recommendations?: SkincareRecommendation[];
};

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: "user" | "doctor" | "admin";
  avatar_url: string | null;
  is_active: boolean;
};

export type Problem = {
  name: string;
  value: number;
  color: string;
};

export type ToneConfig = {
  badge: string;
  title: string;
  label: string;
  description: string;
};

export type { ScanMode, SeverityLevel };
