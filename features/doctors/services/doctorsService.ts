import { api } from "@/lib/api";

import type {
  ApiPaginationMeta,
  DoctorCard,
  DoctorProfile,
  DoctorReview,
} from "../types";

export { type ApiPaginationMeta } from "../types";
export type { DoctorCard, DoctorProfile, DoctorReview } from "../types";

export const doctorsService = {
  list: async (params?: { page?: number; per_page?: number }) => {
    const response = await api.get<{ data: DoctorCard[]; meta: ApiPaginationMeta }>(
      "/doctors",
      { params },
    );
    return response.data;
  },

  profile: async (uuid: string): Promise<DoctorProfile> => {
    const response = await api.get(`/doctors/${uuid}`);
    return response.data.data;
  },

  ratings: async (uuid: string, params?: { page?: number; per_page?: number }) => {
    const response = await api.get(`/doctors/${uuid}/ratings`, { params });
    return response.data as {
      data: DoctorReview[];
      meta: ApiPaginationMeta;
    };
  },

  rate: async (uuid: string, payload: { rating: number; review?: string }) => {
    const response = await api.post(`/doctors/${uuid}/ratings`, payload);
    return response.data;
  },
};
