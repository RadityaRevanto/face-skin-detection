import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import type { PredictionHistory, Recommendation } from "./pemeriksaan-types";

export async function getCurrentUserId() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, is_active")
    .eq("id", user.id)
    .eq("role", "user")
    .single();

  if (profileError || !profile || !profile.is_active) {
    redirect("/login");
  }

  return user.id;
}

export async function getLatestPrediction(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prediction_histories")
    .select(
      `
      id,
      scan_mode,
      image_url,
      cropped_image_url,
      predicted_class,
      confidence,
      probabilities,
      severity_score,
      severity_level,
      model_used,
      created_at
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch latest prediction:", error);
    return null;
  }

  return data as PredictionHistory | null;
}

export async function getRecommendationsByPredictedClass(
  predictedClass: string | null,
) {
  if (!predictedClass) {
    return [];
  }

  const supabase = await createClient();

  const { data: concern, error: concernError } = await supabase
    .from("skin_concerns")
    .select("id, name")
    .ilike("name", predictedClass)
    .eq("is_active", true)
    .maybeSingle();

  if (concernError || !concern) {
    return [];
  }

  const { data, error } = await supabase
    .from("skin_recommendations")
    .select(
      `
      id,
      title,
      recommendation_text,
      priority_level
    `,
    )
    .eq("concern_id", concern.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }

  const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3,
  };

  return ((data ?? []) as Recommendation[]).sort(
    (a, b) => priorityOrder[a.priority_level] - priorityOrder[b.priority_level],
  );
}
