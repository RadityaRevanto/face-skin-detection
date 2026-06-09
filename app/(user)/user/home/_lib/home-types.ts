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

export type Recommendation = {
  id: string;
  title: string;
  recommendation_text: string;
  priority_level: "low" | "medium" | "high";
};

export type ToneConfig = {
  badge: string;
  title: string;
  label: string;
  description: string;
};
