// Tipe area history mengikuti kontrak kanonik backend (PredictionHistoryResource).
import type {
  OtherConcern,
  ScanMode,
  SeverityLevel,
  SkinConcernInfo,
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
};

export type SkincareProduct = {
  uuid: string;
  name: string;
  category: string;
  key_ingredients: string | null;
  usage_instruction: string | null;
  warning: string | null;
};

export type SkinRecommendation = {
  uuid: string;
  title: string;
  recommendation_text: string;
  priority_level: "low" | "medium" | "high";
  // Resource backend mengirim objek `product` tunggal (bukan array).
  product?: SkincareProduct | null;
  concern?: {
    uuid: string;
    name: string;
    ml_label: string;
  } | null;
};

export type { ScanMode, SeverityLevel };

export type ProblemDetail = {
  name: string;
  value: number;
  color: string;
};

export type ToneConfig = {
  badge: string;
  title: string;
  status: string;
  description: string;
};
