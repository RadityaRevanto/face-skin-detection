// Tipe hasil scan mengikuti kontrak backend Laravel:
// POST /scans & POST /scans/livecam → PredictionHistoryResource.
import type {
  OtherConcern,
  PredictionResult,
  ScanMode,
  SeverityLevel,
  SkinConcernInfo,
} from "@/lib/api/scans-query";

// Hasil live dari /api/predict/* identik dengan resource backend,
// kecuali image_url boleh di-fallback ke preview lokal oleh panel.
export type LiveScanResult = PredictionResult;

export type SkincareProduct = {
  id: string;
  name: string;
  category: string;
  key_ingredients: string | null;
  usage_instruction: string | null;
  warning: string | null;
};

export type Recommendation = {
  id: string;
  title: string;
  recommendation_text: string;
  priority_level: "low" | "medium" | "high";
  skincare_products?: SkincareProduct[] | SkincareProduct | null;
};

export type SkinProblem = {
  name: string;
  value: number;
  color: string;
};

export type ToneConfig = {
  title: string;
  label: string;
  description: string;
  titleClassName: string;
  badgeClassName: string;
};

// Bentuk yang dipakai kartu UI. Field backend dipetakan langsung;
// `id` diisi dari `uuid` karena backend menyembunyikan PK internal.
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
  disclaimer?: string | null;
  notice?: string | null;
  skin_concern?: SkinConcernInfo | null;
  other_concerns?: OtherConcern[];
};

export type {
  OtherConcern,
  PredictionResult,
  ScanMode,
  SeverityLevel,
  SkinConcernInfo,
} from "@/lib/api/scans-query";
