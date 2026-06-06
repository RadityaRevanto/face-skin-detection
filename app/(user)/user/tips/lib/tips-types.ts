export type PredictionHistory = {
  id: string;
  predicted_class: string;
  confidence: number | string;
  severity_score: number | null;
  severity_level: "mild" | "moderate" | "severe" | null;
  created_at: string;
};

export type TipItem = {
  id: string;
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
