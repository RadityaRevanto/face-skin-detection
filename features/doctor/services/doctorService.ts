import { fetchEnvelope, fetchPaginated, mutate } from "@/lib/api/handlers";
import type { ApiEnvelope } from "@/lib/api/envelope";
import { paginationParams } from "@/lib/api/envelope";
import type {
  SkincareProduct,
  SkinRecommendation,
} from "@/features/skin-types/services/catalogService";

import type { DoctorVerification } from "./doctorVerificationService";
export type { DoctorVerification } from "./doctorVerificationService";

export type { SkincareProduct, SkinRecommendation };

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
  verification_status?: string;
  stats?: DoctorDashboardStats;
  recent_conversations?: RecentConversation[];
  [key: string]: unknown;
};

export const doctorService = {
  /** GET /doctor/dashboard — stats + recent conversations. */
  dashboard: (): Promise<DoctorDashboardData> =>
    fetchEnvelope<DoctorDashboardData>("/doctor/dashboard").then((r) => r.data),

  /** GET /doctor-verifications — status verifikasi sendiri (404 jika belum ada). */
  verification: (): Promise<DoctorVerification | null> =>
    fetchEnvelope<DoctorVerification | null>("/doctor-verifications").then(
      (r) => r.data ?? null,
    ),

  /** POST /doctor-verifications — multipart. */
  submitVerification: (formData: FormData): Promise<ApiEnvelope<DoctorVerification>> =>
    mutate("post", "/doctor-verifications", formData),

  /** POST /doctor-verifications/{uuid}/resubmit — multipart. */
  resubmitVerification: (uuid: string, formData: FormData): Promise<ApiEnvelope<DoctorVerification>> =>
    mutate("post", `/doctor-verifications/${uuid}/resubmit`, formData),

  /** GET /doctor/products — produk milik dokter login. */
  products: (params?: { page?: number; per_page?: number }) =>
    fetchPaginated<SkincareProduct>(
      "/doctor/products",
      paginationParams(params?.page ?? 1, params?.per_page),
    ),

  /** GET /doctor/recommendations — rekomendasi milik dokter login. */
  recommendations: (params?: { page?: number; per_page?: number }) =>
    fetchPaginated<SkinRecommendation>(
      "/doctor/recommendations",
      paginationParams(params?.page ?? 1, params?.per_page),
    ),
};
