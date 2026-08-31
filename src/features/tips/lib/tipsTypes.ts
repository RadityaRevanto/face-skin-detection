import type { SkinConcernInfo } from "@/lib/api/scans-query";

// Prediksi terbaru dari PredictionHistoryResource (subset yang dipakai halaman tips).
export type PredictionHistory = {
  id: string;
  predicted_class: string;
  skin_concern?: SkinConcernInfo | null;
  created_at: string;
};

export type TipItem = {
  uuid: string;
  title: string;
  recommendation_text: string;
  priority_level: "low" | "medium" | "high";
};

export type TipsGroup = {
  concernId: string;
  concernName: string;
  concernDescription: string | null;
  tips: TipItem[];
};
