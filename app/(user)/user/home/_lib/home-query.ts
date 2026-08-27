import { fetchApi } from "@/lib/api/server-client";
import type { PredictionResult } from "@/lib/api/scans-query";

import type {
  PredictionHistory,
  Recommendation,
  UserProfile,
} from "./home-types";

import { requireUserRole } from "@/lib/auth";

export async function getCurrentUserProfile() {
  const profile = await requireUserRole();
  return {
    id: profile.uuid || profile.id,
    full_name: profile.full_name,
    email: profile.email,
    role: profile.role,
    avatar_url: profile.avatar_url,
    is_active: profile.is_active !== false,
  } as UserProfile;
}

type RecommendationApi = {
  uuid: string;
  title: string;
  priority_level: "low" | "medium" | "high";
  recommendation_text: string;
};

export async function getUserPredictionHistories() {
  try {
    const response = await fetchApi<PredictionResult[]>(
      "scans?per_page=5&page=1&sort=-created_at"
    );
    const scans = response.data ?? [];

    return scans.map<PredictionHistory>((scan) => ({
      ...scan,
      id: scan.uuid,
      confidence: Number(scan.confidence),
    }));
  } catch (error) {
    console.error("Failed to fetch user prediction histories from Laravel:", error);
    return [];
  }
}

export async function getRecommendationsByPredictedClass(
  predictedClass: string | null
) {
  if (!predictedClass) {
    return [];
  }

  try {
    // Backend memfilter rekomendasi via parameter ml_label dan sudah
    // mengurutkan prioritas high → medium → low otomatis.
    const encoded = encodeURIComponent(predictedClass);
    const response = await fetchApi<RecommendationApi[]>(
      `skin-recommendations?ml_label=${encoded}&per_page=20&page=1`
    );

    const recommendations = response.data ?? [];

    return recommendations.slice(0, 5).map<Recommendation>((rec) => ({
      uuid: rec.uuid,
      title: rec.title,
      recommendation_text: rec.recommendation_text,
      priority_level: rec.priority_level,
    }));
  } catch (error) {
    console.error("Failed to fetch recommendations from Laravel:", error);
    return [];
  }
}
