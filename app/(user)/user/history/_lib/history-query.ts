import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import type { PredictionHistory, SkinRecommendation } from "./history-types";

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
    .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "user" ||
    !profile.is_active
  ) {
    redirect("/login");
  }

  return user.id;
}

export async function getPredictionHistories(userId: string) {
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch prediction histories:", error);
    return [];
  }

  return (data ?? []) as PredictionHistory[];
}

export async function getRecommendations(predictedClass: string | null) {
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
      priority_level,
      skincare_products (
        id,
        name,
        category,
        key_ingredients,
        usage_instruction,
        warning
      )
    `,
    )
    .eq("concern_id", concern.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }

  const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3,
  };

  return ((data ?? []) as unknown as SkinRecommendation[]).sort(
    (a, b) => priorityOrder[a.priority_level] - priorityOrder[b.priority_level],
  );
}
