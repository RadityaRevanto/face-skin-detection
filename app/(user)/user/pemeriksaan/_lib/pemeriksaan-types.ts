export type PredictionHistory = {
  id: string;
  scan_mode: "upload_image" | "livecam_yolo";
  image_url: string | null;
  cropped_image_url: string | null;
  predicted_class: string;
  confidence: number | string;
  probabilities: Record<string, number> | null;
  severity_score: number | null;
  severity_level: "mild" | "moderate" | "severe" | null;
  model_used: string | null;
  created_at: string;
};

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

export type LiveScanPrediction = {
  predicted_class: string;
  confidence: number;
  probabilities: Record<string, number>;
  severity_score: number;
  severity_level: string;
  model_used: string;
};

export type LiveScanResult = {
  prediction: LiveScanPrediction;
  recommendations: Recommendation[];
  scan_mode?: "upload_image" | "livecam_yolo";
  image_url?: string | null;
  cropped_image_url: string | null;
  history_id?: string;
};
