import { fetchApi } from "@/lib/api/server-client";
import type { PredictionResult } from "@/lib/api/scans-query";

import type {
  PredictionHistory,
  UserProfile,
} from "./homeTypes";

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
