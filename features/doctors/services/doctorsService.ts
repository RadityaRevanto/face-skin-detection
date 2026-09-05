import { fetchEnvelope, fetchPaginated, mutate } from "@/lib/api/handlers";
import type { ApiEnvelope } from "@/lib/api/envelope";
import { paginationParams } from "@/lib/api/envelope";

import type {
  DoctorCard,
  DoctorProfile,
  DoctorReview,
} from "../types";

export { type ApiPaginationMeta } from "../types";
export type { DoctorCard, DoctorProfile, DoctorReview } from "../types";

export type RatePayload = {
  rating: number;
  review?: string;
};

/**
 * MySQL AVG() (Laravel withAvg) mengembalikan string "4.5000" — normalisasi
 * ke number di service layer agar semua consumer aman memanggil .toFixed().
 */
function normalizeRating<T extends DoctorCard>(doctor: T): T {
  if (doctor?.rating_avg == null) return doctor;
  const rating = Number(doctor.rating_avg);
  return {
    ...doctor,
    rating_avg: Number.isFinite(rating) ? rating : null,
  };
}

export const doctorsService = {
  /** GET /doctors — list dokter approved, paginated (rating_avg dinormalisasi). */
  list: (params?: { page?: number; per_page?: number }) =>
    fetchPaginated<DoctorCard>(
      "/doctors",
      paginationParams(params?.page ?? 1, params?.per_page),
    ).then((page) => ({ ...page, data: page.data.map(normalizeRating) })),

  /** GET /doctors/{uuid} — DoctorResource dibungkus `data`; 404 jika belum approved. */
  profile: (uuid: string): Promise<DoctorProfile> =>
    fetchEnvelope<DoctorProfile>(`/doctors/${uuid}`).then((r) =>
      normalizeRating(r.data),
    ),

  /** GET /doctors/{uuid}/ratings — custom meta pagination. */
  ratings: (uuid: string, params?: { page?: number; per_page?: number }) =>
    fetchPaginated<DoctorReview>(
      `/doctors/${uuid}/ratings`,
      paginationParams(params?.page ?? 1, params?.per_page),
    ),

  /** POST /doctors/{uuid}/ratings — wajib pernah chat dengan dokter tsb. */
  rate: (uuid: string, payload: RatePayload): Promise<ApiEnvelope<{ rating: number; review: string | null }>> =>
    mutate("post", `/doctors/${uuid}/ratings`, payload),
};
