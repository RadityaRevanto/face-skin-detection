export interface SkinConcern {
  uuid: string;
  name: string;
  ml_label?: string;
  description?: string | null;
  default_severity_score?: number | string;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}
