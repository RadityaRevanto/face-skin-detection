import type { PagePagination } from "@/lib/types/pagination";

/** Meta pagination standar BE SkinCek. */
export type ApiPaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// Kontrak DoctorResource backend (GET /doctors, GET /doctors/{uuid}).
export type DoctorCard = {
  uuid: string;
  full_name: string;
  title: string | null;
  specialization: string | null;
  avatar: string | null;
  rating_avg: number | null;
  rating_count: number;
  is_ai_bot: boolean;
  sub_specialization?: string | null;
  experience_years?: number | null;
  alma_mater?: string | null;
  [key: string]: unknown;
};

export type DoctorProfile = DoctorCard & {
  str_number: string | null;
  practice_locations: string[] | null;
  professional_organizations: string[] | null;
};

export type DoctorReview = {
  uuid?: string;
  rating: number;
  review: string | null;
  user: { uuid: string; full_name: string | null; avatar_url?: string | null };
  created_at: string;
  [key: string]: unknown;
};

export type DoctorsPageData = {
  doctors: DoctorCard[];
  pagination: PagePagination;
};
