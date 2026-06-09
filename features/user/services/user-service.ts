import { createClient } from "@/lib/supabase/server";

export async function getCurrentUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, avatar_url, is_active, created_at")
    .eq("id", user.id)
    .eq("role", "user")
    .single();

  if (error || !profile) {
    return null;
  }

  return profile;
}

export async function getUserPredictionHistories() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

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
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch prediction histories:", error);
    return [];
  }

  return data ?? [];
}

export async function getLatestUserPrediction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

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
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch latest prediction:", error);
    return null;
  }

  return data;
}

export async function getUserDashboardStats() {
  const histories = await getUserPredictionHistories();
  const latestPrediction = histories[0] ?? null;

  return {
    totalScan: histories.length,
    latestPrediction,
    recentHistories: histories.slice(0, 5),
  };
}
