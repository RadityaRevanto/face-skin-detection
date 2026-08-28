import { fetchApi } from "@/lib/api/server-client";
import type { PredictionResult } from "@/lib/api/scans-query";

import type { PredictionHistory, Recommendation } from "./pemeriksaanTypes";

interface RecommendationApi {
  uuid: string;
  concern_id: string;
  title: string;
  priority_level: string;
  recommendation_text: string;
  product?: {
    uuid: string;
    name: string;
    category: string;
  };
}

// Ambil scan terbaru user dari GET /scans dan petakan ke bentuk UI.
export async function getLatestPrediction(): Promise<PredictionHistory | null> {
  try {
    const response = await fetchApi<PredictionResult[]>("scans");
    const scans = response.data;
    const latest = Array.isArray(scans) ? scans[0] : null;

    if (!latest) {
      return null;
    }

    const history: PredictionHistory = {
      id: latest.uuid,
      scan_mode: latest.scan_mode,
      image_url: latest.image_url,
      predicted_class: latest.predicted_class,
      confidence: latest.confidence,
      probabilities: latest.probabilities,
      severity_score: latest.severity_score,
      severity_level: latest.severity_level,
      model_used: latest.model_used,
      created_at: latest.created_at,
      disclaimer: latest.disclaimer,
      notice: latest.notice,
      skin_concern: latest.skin_concern,
      other_concerns: latest.other_concerns,
    };

    return history;
  } catch (error) {
    console.error("Failed to fetch latest prediction from Laravel:", error);
    return null;
  }
}

export async function getRecommendationsByPredictedClass(
  predictedClass: string | null,
) {
  if (!predictedClass) {
    return [];
  }

  try {
    const encoded = encodeURIComponent(predictedClass);
    const response = await fetchApi<RecommendationApi[]>(`skin-recommendations?ml_label=${encoded}`);

    const recommendations = response.data || [];

    const sorted = recommendations.sort((a: RecommendationApi, b: RecommendationApi) => {
      const priorityWeight: Record<string, number> = { high: 1, medium: 2, low: 3 };
      const weightA = priorityWeight[a.priority_level] || 3;
      const weightB = priorityWeight[b.priority_level] || 3;
      return weightA - weightB;
    });

    return sorted.slice(0, 4) as unknown as Recommendation[];
  } catch (error) {
    console.error("Failed to fetch recommendations from Laravel:", error);
    return [];
  }
}
