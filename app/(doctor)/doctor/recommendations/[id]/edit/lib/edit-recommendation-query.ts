import { notFound } from "next/navigation";

import { requireDoctorProfile } from "@/lib/doctor-auth";
import { createClient } from "@/lib/supabase/server";

import type { EditRecommendationPageData } from "./edit-recommendation-types";

function normalizePriorityLevel(
  value: string | null,
): "low" | "medium" | "high" {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return "medium";
}

export async function getEditRecommendationPageData(
  id: string,
): Promise<EditRecommendationPageData> {
  const doctor = await requireDoctorProfile();
  const supabase = await createClient();

  const { data: recommendation, error: recommendationError } = await supabase
    .from("skin_recommendations")
    .select(
      `
      id,
      concern_id,
      product_id,
      title,
      recommendation_text,
      priority_level,
      is_active,
      doctor_id
      `,
    )
    .eq("id", id)
    .eq("doctor_id", doctor.id)
    .maybeSingle();

  if (recommendationError) {
    console.error("Failed to fetch recommendation detail:", {
      message: recommendationError.message,
      details: recommendationError.details,
      hint: recommendationError.hint,
      code: recommendationError.code,
    });

    notFound();
  }

  if (!recommendation) {
    notFound();
  }

  const { data: concerns, error: concernsError } = await supabase
    .from("skin_concerns")
    .select("id, name")
    .order("name", { ascending: true });

  if (concernsError) {
    console.error("Failed to fetch skin concerns:", {
      message: concernsError.message,
      details: concernsError.details,
      hint: concernsError.hint,
      code: concernsError.code,
    });
  }

  const { data: products, error: productsError } = await supabase
    .from("skincare_products")
    .select("id, name, category")
    .eq("doctor_id", doctor.id)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (productsError) {
    console.error("Failed to fetch skincare products:", {
      message: productsError.message,
      details: productsError.details,
      hint: productsError.hint,
      code: productsError.code,
    });
  }

  return {
    recommendation: {
      id: recommendation.id,
      concernId: recommendation.concern_id ?? "",
      productId: recommendation.product_id ?? "",
      title: recommendation.title ?? "",
      recommendationText: recommendation.recommendation_text ?? "",
      priorityLevel: normalizePriorityLevel(recommendation.priority_level),
      isActive: recommendation.is_active ?? true,
    },
    concerns:
      concerns?.map((concern) => ({
        id: concern.id,
        name: concern.name ?? "-",
      })) ?? [],
    products:
      products?.map((product) => ({
        id: product.id,
        name: product.name ?? "-",
        category: product.category ?? "-",
      })) ?? [],
  };
}
