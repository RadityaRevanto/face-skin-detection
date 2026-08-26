import { notFound } from "next/navigation";

import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";

import type { EditRecommendationPageData } from "./edit-recommendation-types";

function normalizePriorityLevel(
  value: string | null,
): "low" | "medium" | "high" {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return "medium";
}

interface ConcernApi {
  uuid: string;
  name: string;
  is_active?: boolean;
}

interface ProductApi {
  uuid: string;
  name: string;
  category: string;
  is_active?: boolean;
}

interface RecommendationApi {
  uuid: string;
  title: string;
  recommendation_text: string;
  priority_level: string;
  is_active?: boolean;
  concern?: ConcernApi | null;
  product?: ProductApi | null;
}

export async function getEditRecommendationPageData(
  id: string,
): Promise<EditRecommendationPageData> {
  await requireDoctorProfile();

  let recommendation: RecommendationApi | null = null;
  let concerns: ConcernApi[] = [];
  let products: ProductApi[] = [];

  try {
    // Endpoint detail rekomendasi yang benar (binding by uuid).
    // Ownership divalidasi backend saat PATCH (403 jika bukan pemilik).
    const [resRecommendation, productsRes, concernsRes] = await Promise.all([
      fetchApi<RecommendationApi>(`/skin-recommendations/${id}`),
      fetchApi<ProductApi[]>("/doctor/products?per_page=50&page=1"),
      fetchApi<ConcernApi[]>("/skin-concerns?per_page=50&page=1"),
    ]);

    recommendation = resRecommendation.data ?? null;
    concerns = concernsRes.data ?? [];
    products = productsRes.data ?? [];
  } catch (error) {
    console.error("Failed to fetch recommendation detail or dependencies:", error);
    notFound();
  }

  if (!recommendation) {
    notFound();
  }

  return {
    recommendation: {
      id: recommendation.uuid,
      concernId: recommendation.concern?.uuid ?? "",
      productId: recommendation.product?.uuid ?? "",
      title: recommendation.title ?? "",
      recommendationText: recommendation.recommendation_text ?? "",
      priorityLevel: normalizePriorityLevel(recommendation.priority_level),
      isActive: recommendation.is_active ?? true,
    },
    concerns: concerns.map((concern: ConcernApi) => ({
      id: concern.uuid,
      name: concern.name ?? "-",
    })),
    products: products
      .filter((product: ProductApi) => product.is_active !== false)
      .map((product: ProductApi) => ({
        id: product.uuid,
        name: product.name ?? "-",
        category: product.category ?? "-",
      })),
  };
}
