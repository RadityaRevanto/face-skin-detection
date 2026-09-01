import { api } from "@/lib/api";

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
  skinConcerns: async (params?: { page?: number; per_page?: number }) => {
    const response = await api.get("/skin-concerns", { params });
    return response.data as { data: SkinConcern[]; meta?: unknown };
  },

  skinConcern: async (uuid: string): Promise<SkinConcern> => {
    const response = await api.get(`/skin-concerns/${uuid}`);
    return response.data.data;
  },

  skinTypes: async (params?: { page?: number; per_page?: number }) => {
    const response = await api.get("/skin-types", { params });
    return response.data as { data: SkinType[]; meta?: unknown };
  },

  skinType: async (uuid: string): Promise<SkinType> => {
    const response = await api.get(`/skin-types/${uuid}`);
    return response.data.data;
  },

  createSkinType: async (payload: Record<string, unknown>) => {
    const response = await api.post("/skin-types", payload);
    return response.data;
  },

  updateSkinType: async (uuid: string, payload: Record<string, unknown>) => {
    const response = await api.patch(`/skin-types/${uuid}`, payload);
    return response.data;
  },

  deleteSkinType: async (uuid: string) => {
    const response = await api.delete(`/skin-types/${uuid}`);
    return response.data;
  },

  updateSkinConcern: async (uuid: string, payload: Record<string, unknown>) => {
    const response = await api.patch(`/skin-concerns/${uuid}`, payload);
    return response.data;
  },

  recommendations: async (params?: {
    page?: number;
    per_page?: number;
    ml_label?: string;
  }) => {
    const response = await api.get("/skin-recommendations", { params });
    return response.data as { data: SkinRecommendation[]; meta?: unknown };
  },

  recommendation: async (uuid: string): Promise<SkinRecommendation> => {
    const response = await api.get(`/skin-recommendations/${uuid}`);
    return response.data.data;
  },

  createRecommendation: async (payload: Record<string, unknown>) => {
    const response = await api.post("/skin-recommendations", payload);
    return response.data;
  },

  updateRecommendation: async (uuid: string, payload: Record<string, unknown>) => {
    const response = await api.patch(`/skin-recommendations/${uuid}`, payload);
    return response.data;
  },

  deleteRecommendation: async (uuid: string) => {
    const response = await api.delete(`/skin-recommendations/${uuid}`);
    return response.data;
  },

  products: async (params?: { page?: number; per_page?: number }) => {
    const response = await api.get("/skincare-products", { params });
    return response.data as { data: SkincareProduct[]; meta?: unknown };
  },

  product: async (uuid: string): Promise<SkincareProduct> => {
    const response = await api.get(`/skincare-products/${uuid}`);
    return response.data.data;
  },

  createProduct: async (payload: Record<string, unknown>) => {
    const response = await api.post("/skincare-products", payload);
    return response.data;
  },

  updateProduct: async (uuid: string, payload: Record<string, unknown>) => {
    const response = await api.patch(`/skincare-products/${uuid}`, payload);
    return response.data;
  },

  deleteProduct: async (uuid: string) => {
    const response = await api.delete(`/skincare-products/${uuid}`);
    return response.data;
  },
};

export { catalogService };
export default catalogService;
