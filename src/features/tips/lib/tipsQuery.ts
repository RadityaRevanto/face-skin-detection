import { fetchApi } from "@/lib/api/server-client";
import type { PredictionResult } from "@/lib/api/scans-query";

import type { PredictionHistory, TipItem, TipsGroup } from "./tipsTypes";

type RecommendationApi = {
  uuid: string;
  title: string;
  priority_level: "low" | "medium" | "high";
  recommendation_text: string;
  concern?: {
    uuid: string;
    name: string;
    ml_label: string;
  } | null;
};

type ConcernApi = {
  uuid: string;
  name: string;
  description: string | null;
};

export async function getLatestPrediction(): Promise<PredictionHistory | null> {
  try {
    const response = await fetchApi<PredictionResult[]>("scans?per_page=5&page=1&sort=-created_at");
    const scans = response.data ?? [];
    const latest = Array.isArray(scans) ? scans[0] : null;

    if (!latest) {
      return null;
    }

    return {
      id: latest.uuid,
      predicted_class: latest.predicted_class,
      skin_concern: latest.skin_concern ?? null,
      created_at: latest.created_at,
    };
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
    const response = await fetchApi<RecommendationApi[]>(
      `skin-recommendations?ml_label=${encoded}&per_page=20&page=1`
    );
    const recommendations = response.data ?? [];

    // Backend sudah mengurutkan prioritas high → medium → low.
    return recommendations.slice(0, 4).map<TipItem>((rec) => ({
      uuid: rec.uuid,
      title: rec.title,
      recommendation_text: rec.recommendation_text,
      priority_level: rec.priority_level,
    }));
  } catch (error) {
    console.error("Failed to fetch personalized tips from Laravel:", error);
    return [];
  }
}

export async function getAllTipsGroups() {
  try {
    // Ambil daftar concerns (uuid sebagai kunci join).
    const concernsRes = await fetchApi<ConcernApi[]>("skin-concerns");
    const concerns = concernsRes?.data ?? [];

    // Ambil semua rekomendasi aktif.
    const recsRes = await fetchApi<RecommendationApi[]>("skin-recommendations?per_page=50&page=1");
    const allRecs = recsRes?.data ?? [];

    const groups = concerns.map((concern: ConcernApi) => {
      // Join via objek `concern` pada resource (bukan `concern_id`
      // yang tidak dikirim backend). Cocokkan lewat uuid concern.
      const tips = allRecs
        .filter((rec) => rec.concern?.uuid === concern.uuid)
        .slice(0, 4);

      return {
        concernId: concern.uuid,
        concernName: concern.name,
        concernDescription: concern.description,
        tips: tips.map<TipItem>((rec) => ({
          uuid: rec.uuid,
          title: rec.title,
          recommendation_text: rec.recommendation_text,
          priority_level: rec.priority_level,
        })),
      } satisfies TipsGroup;
    });

    return groups.filter((group: TipsGroup) => group.tips.length > 0);
  } catch (error) {
    console.error("Failed to fetch all tips groups from Laravel:", error);
    return [];
  }
}
