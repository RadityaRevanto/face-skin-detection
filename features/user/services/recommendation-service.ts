import { createClient } from "@/lib/supabase/server";

export async function getRecommendationsByPredictedClass(
  predictedClass: string,
) {
  const supabase = await createClient();

  const { data: concern, error: concernError } = await supabase
    .from("skin_concerns")
    .select("id, name, description, default_severity_score")
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
      is_active,
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
    .order("priority_level", { ascending: false });

  if (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }

  return data ?? [];
}
