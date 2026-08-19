import { redirect } from "next/navigation";

import { fetchApi } from "@/lib/api/server-client";

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

export async function getUserPredictionHistories(userId: string) {
  try {
    const response = await fetchApi<PredictionHistoryApi[]>("scans");
    const scans = response.data || [];
    
    return scans.slice(0, 5).map((scan: PredictionHistoryApi) => ({
      ...scan,
      id: scan.uuid || scan.id,
    })) as unknown as PredictionHistory[];
  } catch (error) {
    console.error("Failed to fetch user prediction histories from Laravel:", error);
    return [];
  }
}

export async function getRecommendationsByPredictedClass(
  predictedClass: string | null,
) {
  if (!predictedClass) {
    return [];
  }
  
  try {
    // Karena kita butuh search berdasarkan parameter concern atau predicted class,
    // kita asumsikan backend Laravel bisa menerima query `?concern=X` atau mengembalikan semua lalu kita filter.
    // Jika backend Laravel sudah difilter oleh ML label secara default, kita passing parameter `label=...`
    // Mari kita cek backend Laravel SkinRecommendationController nanti. 
    // Untuk saat ini, asumsikan GET /recommendations?label={predictedClass} (atau kita tarik semua dan filter)
    const encoded = encodeURIComponent(predictedClass);
    const response = await fetchApi<RecommendationApi[]>(`skin-recommendations?ml_label=${encoded}`);
    
    // Tapi tunggu, rute public /recommendations di backend Laravel mungkin tidak filter berdasarkan concern_label.
    // Kalau backend mengembalikan JSON: { data: [...] } di mana data berisi rekomendasi.
    
    const recommendations = response.data || [];

    const sorted = recommendations.sort((a: RecommendationApi, b: RecommendationApi) => {
      const priorityWeight: Record<string, number> = { high: 1, medium: 2, low: 3 };
      const weightA = priorityWeight[a.priority_level] || 3;
      const weightB = priorityWeight[b.priority_level] || 3;
      return weightA - weightB;
    });

    return sorted.slice(0, 5).map((rec: RecommendationApi) => ({
      ...rec,
      id: rec.uuid || rec.id,
    })) as unknown as Recommendation[];
  } catch (error) {
    console.error("Failed to fetch recommendations from Laravel:", error);
    return [];
  }
}
