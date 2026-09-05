import { fetchEnvelope, fetchPaginated, mutate } from "@/lib/api/handlers";
import type { ApiEnvelope } from "@/lib/api/envelope";
import { paginationParams } from "@/lib/api/envelope";

export type SkinType = {
  uuid: string;
  name: string;
  description?: string | null;
  [key: string]: unknown;
};

export type SkinConcern = {
  uuid: string;
  name: string;
  description?: string | null;
  ml_label?: string | null;
  [key: string]: unknown;
};

export type SkinRecommendation = {
  uuid: string;
  title: string;
  recommendation_text: string;
  priority_level: "low" | "medium" | "high";
  concern?: { uuid: string; name: string; ml_label: string } | null;
  [key: string]: unknown;
};

export type SkincareProduct = {
  uuid: string;
  name: string;
  category?: string | null;
  gender?: string | null;
  key_ingredients?: string | null;
  usage_instruction?: string | null;
  warning?: string | null;
  skin_type?: string | null;
  doctor?: string | null;
  [key: string]: unknown;
};

const catalogService = {
  // ==== Skin concerns (public read, doctor write) ====
  skinConcerns: (params?: { page?: number; per_page?: number }) =>
    fetchPaginated<SkinConcern>(
      "/skin-concerns",
      paginationParams(params?.page ?? 1, params?.per_page),
    ),

  skinConcern: (uuid: string): Promise<SkinConcern> =>
    fetchEnvelope<SkinConcern>(`/skin-concerns/${uuid}`).then((r) => r.data),

  updateSkinConcern: (uuid: string, payload: Record<string, unknown>): Promise<ApiEnvelope<SkinConcern>> =>
    mutate("patch", `/skin-concerns/${uuid}`, payload),

  // ==== Skin types (public read, doctor write) ====
  skinTypes: (params?: { page?: number; per_page?: number }) =>
    fetchPaginated<SkinType>(
      "/skin-types",
      paginationParams(params?.page ?? 1, params?.per_page),
    ),

  skinType: (uuid: string): Promise<SkinType> =>
    fetchEnvelope<SkinType>(`/skin-types/${uuid}`).then((r) => r.data),

  createSkinType: (payload: Record<string, unknown>): Promise<ApiEnvelope<SkinType>> =>
    mutate("post", "/skin-types", payload),

  updateSkinType: (uuid: string, payload: Record<string, unknown>): Promise<ApiEnvelope<SkinType>> =>
    mutate("patch", `/skin-types/${uuid}`, payload),

  deleteSkinType: (uuid: string): Promise<ApiEnvelope<null>> =>
    mutate("delete", `/skin-types/${uuid}`),

  // ==== Skin recommendations (public read, doctor write) ====
  recommendations: (params?: {
    page?: number;
    per_page?: number;
    ml_label?: string;
  }) => {
    const clean = paginationParams(params?.page ?? 1, params?.per_page);
    return fetchPaginated<SkinRecommendation>("/skin-recommendations", {
      ...clean,
      ...(params?.ml_label ? { ml_label: params.ml_label } : {}),
    });
  },

  recommendation: (uuid: string): Promise<SkinRecommendation> =>
    fetchEnvelope<SkinRecommendation>(`/skin-recommendations/${uuid}`).then((r) => r.data),

  createRecommendation: (payload: Record<string, unknown>): Promise<ApiEnvelope<SkinRecommendation>> =>
    mutate("post", "/skin-recommendations", payload),

  updateRecommendation: (uuid: string, payload: Record<string, unknown>): Promise<ApiEnvelope<SkinRecommendation>> =>
    mutate("patch", `/skin-recommendations/${uuid}`, payload),

  deleteRecommendation: (uuid: string): Promise<ApiEnvelope<null>> =>
    mutate("delete", `/skin-recommendations/${uuid}`),

  // ==== Skincare products (public read, doctor write) ====
  products: (params?: { page?: number; per_page?: number }) =>
    fetchPaginated<SkincareProduct>(
      "/skincare-products",
      paginationParams(params?.page ?? 1, params?.per_page),
    ),

  product: (uuid: string): Promise<SkincareProduct> =>
    fetchEnvelope<SkincareProduct>(`/skincare-products/${uuid}`).then((r) => r.data),

  createProduct: (payload: Record<string, unknown>): Promise<ApiEnvelope<SkincareProduct>> =>
    mutate("post", "/skincare-products", payload),

  updateProduct: (uuid: string, payload: Record<string, unknown>): Promise<ApiEnvelope<SkincareProduct>> =>
    mutate("patch", `/skincare-products/${uuid}`, payload),

  deleteProduct: (uuid: string): Promise<ApiEnvelope<null>> =>
    mutate("delete", `/skincare-products/${uuid}`),
};

export { catalogService };
export default catalogService;
