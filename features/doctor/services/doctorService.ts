import { api } from "@/lib/api";

import type { DoctorVerification } from "./doctorVerificationService";
export type { DoctorVerification } from "./doctorVerificationService";

export type DoctorDashboardStats = {
  total_patients?: number | null;
  conversations_awaiting_reply?: number | null;
  my_products?: number | null;
  my_recommendations?: number | null;
  average_rating?: number | null;
  total_ratings?: number | null;
  [key: string]: unknown;
};

export type RecentConversation = {
  uuid: string;
  [key: string]: unknown;
};

export type DoctorDashboardData = {
  stats?: DoctorDashboardStats;
  recent_conversations?: RecentConversation[];
  [key: string]: unknown;
};

export const doctorService = {
  dashboard: async (): Promise<DoctorDashboardData> => {
    const response = await api.get("/doctor/dashboard");
    return response.data.data;
  },

  verification: async (): Promise<DoctorVerification | null> => {
    const response = await api.get("/doctor-verifications");
    return response.data.data ?? null;
  },

  submitVerification: async (formData: FormData) => {
    const response = await api.post("/doctor-verifications", formData);
    return response.data;
  },

  resubmitVerification: async (id: string, formData: FormData) => {
    const response = await api.post(`/doctor-verifications/${id}/resubmit`, formData);
    return response.data;
  },

  products: async (params?: { page?: number; per_page?: number }) => {
    const response = await api.get("/doctor/products", { params });
    return response.data;
  },

  recommendations: async (params?: { page?: number; per_page?: number }) => {
    const response = await api.get("/doctor/recommendations", { params });
    return response.data;
  },
};
