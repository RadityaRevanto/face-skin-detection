import { requireDoctorProfile } from "@/lib/doctor-auth";
import { createClient } from "@/lib/supabase/server";

import type { CreateRecommendationPageData } from "./create-recommendation-types";

export async function getCreateRecommendationPageData(): Promise<CreateRecommendationPageData> {
  const doctor = await requireDoctorProfile();
  const supabase = await createClient();

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
