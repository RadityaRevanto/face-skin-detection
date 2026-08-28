import { fetchApi } from "@/lib/api/server-client";
import type { PredictionResult } from "@/lib/api/scans-query";

import type { PredictionHistory, SkinRecommendation } from "../types";

type RecommendationApi = {
  uuid: string;
  title: string;
  priority_level: "low" | "medium" | "high";
  recommendation_text: string;
  product?: {
    uuid: string;
    name: string;
    category: string;
    key_ingredients?: string;
    usage_instruction?: string;
    warning?: string;
  } | null;
  concern?: {
    uuid: string;
    name: string;
    ml_label: string;
  } | null;
};

const HISTORY_PAGE_SIZE = 50;

export async function getPredictionHistories() {
  try {
    const response = await fetchApi<PredictionResult[]>(
      `scans?per_page=${HISTORY_PAGE_SIZE}&page=1&sort=-created_at`
    );
    const scans = response.data ?? [];

    return scans.map<PredictionHistory>((scan) => ({
      ...scan,
      id: scan.uuid,
      confidence: Number(scan.confidence),
    }));
  } catch (error) {
    console.error("Failed to fetch prediction histories from Laravel:", error);
    return [];
  }
}

export async function getRecommendations(predictedClass: string | null) {
  if (!predictedClass) {
    return { recommendations: [] as SkinRecommendation[], mlLabel: null as string | null, hasMore: false };
  }

  try {
    const encoded = encodeURIComponent(predictedClass);
    const response = await fetchApi<RecommendationApi[]>(
      `skin-recommendations?ml_label=${encoded}&per_page=20&page=1`
    );
    const recommendations = response.data ?? [];

    const itemsToDisplay = recommendations.slice(0, 5);

    return {
      recommendations: itemsToDisplay.map<SkinRecommendation>((rec) => ({
        uuid: rec.uuid,
        title: rec.title,
        recommendation_text: rec.recommendation_text,
        priority_level: rec.priority_level,
        product: rec.product
          ? {
              uuid: rec.product.uuid,
              name: rec.product.name,
              category: rec.product.category,
              key_ingredients: rec.product.key_ingredients ?? null,
              usage_instruction: rec.product.usage_instruction ?? null,
              warning: rec.product.warning ?? null,
            }
          : null,
        concern: rec.concern ?? null,
      })),
      mlLabel: predictedClass,
      hasMore: recommendations.length > itemsToDisplay.length,
    };
  } catch (error) {
    console.error("Failed to fetch recommendations from Laravel:", error);
    return { recommendations: [] as SkinRecommendation[], mlLabel: null as string | null, hasMore: false };
  }
}
