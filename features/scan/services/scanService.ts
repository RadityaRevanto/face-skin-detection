import { api } from "@/lib/api";

export type ScanMode = "upload" | "livecam";
export type SeverityLevel = "low" | "medium" | "high";

export type SkinConcernInfo = {
  name: string | null;
  description: string | null;
};

export type OtherConcern = {
  ml_label: string;
  name: string | null;
  description: string | null;
  confidence: number;
};

export type TreatmentRecommendation = {
  uuid: string;
  title: string;
  recommendation_text: string;
  priority_level: "low" | "medium" | "high";
};

export type SkincareRecommendation = {
  uuid: string;
  name: string;
  category: string | null;
  gender: string | null;
  key_ingredients: string | null;
  usage_instruction: string | null;
  warning: string | null;
  skin_type: string | null;
  doctor: string | null;
};

/** Tipe kanonik — identik dengan App\Http\Resources\PredictionHistoryResource (BE-SkinCek). */
export type PredictionResult = {
  uuid: string;
  scan_mode: ScanMode;
  predicted_class: string;
  confidence: number;
  probabilities: Record<string, number> | null;
  severity_score: number;
  severity_level: SeverityLevel;
  model_used: string;
  image_url: string | null;
  disclaimer: string;
  skin_concern: SkinConcernInfo | null;
  other_concerns: OtherConcern[];
  treatment_recommendations: TreatmentRecommendation[];
  skincare_recommendations: SkincareRecommendation[];
  notice: string | null;
  created_at: string;
};

export type ScansResponse = {
  data: PredictionResult[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

/** Hasil scan live (upload/livecam) sebelum dinormalisasi ke PredictionHistory UI. */
export type LiveScanResult = PredictionResult;

export type ScanListParams = {
  page?: number;
  per_page?: number;
  sort?: string;
  "filter[scan_mode]"?: string;
  "filter[predicted_class]"?: string;
};

function cleanParams(params?: ScanListParams): Record<string, unknown> {
  if (!params) return {};
  const clean: Record<string, unknown> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      clean[key] = value;
    }
  });
  return clean;
}

export const scanService = {
  list: async (params?: ScanListParams): Promise<ScansResponse> => {
    const response = await api.get<ScansResponse>("/scans", {
      params: cleanParams(params),
    });
    return response.data;
  },

  /** GET /scans/{uuid} — JsonResource dibungkus `data` oleh Laravel. */
  detail: async (uuid: string): Promise<PredictionResult> => {
    const response = await api.get<{ data: PredictionResult }>(`/scans/${uuid}`);
    return response.data.data;
  },

  /** POST /scans (multipart, status 201) — JsonResource dibungkus `data`. */
  upload: async (image: File): Promise<PredictionResult> => {
    const formData = new FormData();
    formData.append("image", image);
    const response = await api.post<{ data: PredictionResult }>("/scans", formData, {
      timeout: 60000,
    });
    return response.data.data;
  },

  /** POST /scans/livecam (multipart, status 201) — JsonResource dibungkus `data`. */
  livecam: async (image: Blob, fileName = "livecam.jpg"): Promise<PredictionResult> => {
    const formData = new FormData();
    formData.append("image", image, fileName);
    const response = await api.post<{ data: PredictionResult }>("/scans/livecam", formData, {
      timeout: 60000,
    });
    return response.data.data;
  },

  /** POST /scans/{uuid}/feedback — BE return envelope successResponse. */
  feedback: async (uuid: string, isAccurate: boolean) => {
    const response = await api.post(`/scans/${uuid}/feedback`, {
      is_accurate: isAccurate,
    });
    return response.data;
  },
};
