import { redirect } from "next/navigation";

import { fetchApi } from "@/lib/api/server-client";

import type { PredictionHistory, TipItem, TipsGroup } from "./tips-types";

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

interface ConcernApi {
  id: string;
  name: string;
  description: string;
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

export async function getPersonalizedTips(predictedClass: string | null) {
  if (!predictedClass) {
    return [];
  }

  try {
    const encoded = encodeURIComponent(predictedClass);
    const response = await fetchApi<RecommendationApi[]>(`skin-recommendations?ml_label=${encoded}`);
    const recommendations = response.data || [];

    const priorityOrder: Record<string, number> = {
      high: 1,
      medium: 2,
      low: 3,
    };

    return recommendations.sort(
      (a: RecommendationApi, b: RecommendationApi) => priorityOrder[a.priority_level] - priorityOrder[b.priority_level],
    ) as unknown as TipItem[];
  } catch (error) {
    console.error("Failed to fetch personalized tips from Laravel:", error);
    return [];
  }
}

export async function getAllTipsGroups() {
  try {
    // Ambil daftar concerns
    const concernsRes = await fetchApi<ConcernApi[]>("skin-concerns");
    const concerns = concernsRes?.data || [];

    // Ambil semua recommendations
    const recsRes = await fetchApi<RecommendationApi[]>("skin-recommendations");
    const allRecs = recsRes?.data || [];

    const priorityOrder: Record<string, number> = {
      high: 1,
      medium: 2,
      low: 3,
    };

    const groups = concerns.map((concern: ConcernApi) => {
      // Filter recommendations yang cocok dengan concern_id
      const tips = allRecs
        .filter((rec: RecommendationApi) => rec.concern_id === concern.id)
        .sort((a: RecommendationApi, b: RecommendationApi) => priorityOrder[a.priority_level] - priorityOrder[b.priority_level])
        .slice(0, 4);

      return {
        concernId: concern.id,
        concernName: concern.name,
        concernDescription: concern.description,
        tips: tips as unknown as TipItem[],
      } satisfies TipsGroup;
    });

    return groups.filter((group: TipsGroup) => group.tips.length > 0);
  } catch (error) {
    console.error("Failed to fetch all tips groups from Laravel:", error);
    return [];
  }
}
