// Tipe area history mengikuti kontrak kanonik backend (PredictionHistoryResource).
import type {
  OtherConcern,
  PredictionResult,
  ScanMode,
  SeverityLevel,
  SkincareRecommendation,
  SkinConcernInfo,
  TreatmentRecommendation,
} from "@/features/scan/services/scanService";
import type { PagePagination } from "@/lib/types/pagination";

export type HistorySortOrder = "newest" | "oldest";
export type HistoryScanModeFilter = "all" | "upload" | "livecam";

export type HistoryFilters = {
  scanMode: HistoryScanModeFilter;
  predictedClass: string;
  sort: HistorySortOrder;
};

export const DEFAULT_HISTORY_FILTERS: HistoryFilters = {
  scanMode: "all",
  predictedClass: "",
  sort: "newest",
};

export type HistoryPageData = {
  histories: PredictionHistory[];
  pagination: PagePagination;
  filters: HistoryFilters;
};

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
  disclaimer?: string;
  notice?: string | null;
};

export type { ScanMode, SeverityLevel };
export type { SkincareRecommendation, TreatmentRecommendation };

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
