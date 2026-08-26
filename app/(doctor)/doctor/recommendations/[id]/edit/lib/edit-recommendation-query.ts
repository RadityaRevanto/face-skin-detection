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
  id: string;
  uuid: string;
  name: string;
  description?: string;
  is_active?: boolean;
}

interface ProductApi {
  id: string;
  uuid: string;
  name: string;
  category: string;
  is_active?: boolean;
}

interface RecommendationApi {
  id: string;
  uuid: string;
  doctor_id: string;
  title: string;
  recommendation_text: string;
  priority_level: string;
  is_active?: boolean;
  concern?: ConcernApi;
  product?: ProductApi;
}

export async function getEditRecommendationPageData(
  id: string,
): Promise<EditRecommendationPageData> {
  const doctor = await requireDoctorProfile();

  let recommendation: RecommendationApi | null = null;
  let concerns: ConcernApi[] = [];
  let products: ProductApi[] = [];

  try {
    const [resRecommendation, productsRes, concernsRes] = await Promise.all([
      fetchApi<RecommendationApi>(`/recommendations/${id}`),
      fetchApi<ProductApi[]>("/doctor/products?per_page=100"),
      fetchApi<ConcernApi[]>("/skin-concerns?per_page=100"),
    ]);

    recommendation = (resRecommendation as any).data ?? resRecommendation;
    concerns = Array.isArray((concernsRes as any).data) ? (concernsRes as any).data : (concernsRes as any).data?.data ?? concernsRes ?? [];
    products = Array.isArray((productsRes as any).data) ? (productsRes as any).data : (productsRes as any).data?.data ?? productsRes ?? [];
  } catch (error: any) {
    console.error("Failed to fetch recommendation detail or dependencies:", error);
    if (error?.status === 404 || !recommendation) {
      notFound();
    }
  }

  if (!recommendation) {
    notFound();
  }

  // Ensure recommendation belongs to the current doctor
  if (recommendation.doctor_id !== doctor.id) {
    notFound();
  }

  return {
    recommendation: {
      id: recommendation.id,
      concernId: recommendation.concern?.id ?? "",
      productId: recommendation.product?.id ?? "",
      title: recommendation.title ?? "",
      recommendationText: recommendation.recommendation_text ?? "",
      priorityLevel: normalizePriorityLevel(recommendation.priority_level),
      isActive: recommendation.is_active ?? true,
    },
    concerns: concerns.map((concern: ConcernApi, i: number) => ({
      id: concern.id || concern.uuid || `concern-${i}`,
      name: concern.name ?? "-",
    })),
    products: products
      .filter((product: ProductApi) => product.is_active !== false)
      .map((product: ProductApi, i: number) => ({
        id: product.id || product.uuid || `product-${i}`,
        name: product.name ?? "-",
        category: product.category ?? "-",
      })),
  };
}
