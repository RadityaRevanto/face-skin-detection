import { redirect } from "next/navigation";

import { fetchApi } from "@/lib/api/server-client";

import type { PredictionHistory, SkinRecommendation } from "./history-types";

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
    key_ingredients?: string;
    usage_instruction?: string;
    warning?: string;
  };
}

export async function getPredictionHistories(userId: string) {
  try {
    const response = await fetchApi<PredictionHistoryApi[]>("scans");
    const scans = response.data || [];
    return scans.map((scan: PredictionHistoryApi) => ({
      ...scan,
      id: scan.uuid || scan.id,
    })) as unknown as PredictionHistory[];
  } catch (error) {
    console.error("Failed to fetch prediction histories from Laravel:", error);
    return [];
  }
}

export async function getRecommendations(predictedClass: string | null) {
  if (!predictedClass) {
    return { recommendations: [], concernId: null, hasMore: false };
  }
  
  try {
    const encoded = encodeURIComponent(predictedClass);
    const response = await fetchApi<RecommendationApi[]>(`skin-recommendations?ml_label=${encoded}`);
    const recommendations = response.data || [];

    const hasMore = recommendations && recommendations.length > 5;
    const itemsToDisplay = recommendations ? recommendations.slice(0, 5) : [];

    const sorted = itemsToDisplay.sort((a: RecommendationApi, b: RecommendationApi) => {
      const priorityWeight: Record<string, number> = { high: 1, medium: 2, low: 3 };
      const weightA = priorityWeight[a.priority_level] || 3;
      const weightB = priorityWeight[b.priority_level] || 3;
      return weightA - weightB;
    });

    return {
      recommendations: sorted.map((rec: RecommendationApi) => ({
        ...rec,
        id: rec.uuid || rec.id,
      })) as unknown as SkinRecommendation[],
      concernId: recommendations[0]?.concern_id || "laravel-concern",
      hasMore,
    };
  } catch (error) {
    console.error("Failed to fetch recommendations from Laravel:", error);
    return { recommendations: [], concernId: null, hasMore: false };
  }
}
