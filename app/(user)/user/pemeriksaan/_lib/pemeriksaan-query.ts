import { redirect } from "next/navigation";

import { fetchApi } from "@/lib/api/server-client";

import type { PredictionHistory, Recommendation } from "./pemeriksaan-types";

import { requireUserRole } from "@/lib/auth";

export async function getCurrentUserId() {
  const profile = await requireUserRole();
  return profile.uuid || profile.id;
}

interface PredictionHistoryApi {
  id: string;
  uuid?: string;
  user_id: string;
  predicted_class: string;
  confidence: number;
  severity_level: "mild" | "moderate" | "severe";
  severity_score: number;
  probabilities: Record<string, number>;
  image_url: string;
  cropped_image_url?: string | null;
  created_at: string;
}

interface RecommendationApi {
  id: string;
  uuid?: string;
  concern_id: string;
  title: string;
  priority_level: string;
  recommendation_text: string;
  product?: {
    id: string;
    uuid?: string;
    name: string;
    category: string;
  };
}

export async function getLatestPrediction(userId: string) {
  try {
    const response = await fetchApi<PredictionHistoryApi[]>("scans");
    const scans = response.data || [];
    return (scans[0] as unknown as PredictionHistory) || null;
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
