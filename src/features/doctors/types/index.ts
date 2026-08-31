import type { PagePagination } from "@/lib/types/pagination";

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
};

export type DoctorProfile = DoctorCard & {
  sub_specialization: string | null;
  str_number: string | null;
  experience_years: number | null;
  alma_mater: string | null;
  practice_locations: string[] | null;
  professional_organizations: string[] | null;
};

export type DoctorReview = {
  rating: number;
  review: string | null;
  user: { uuid: string; full_name: string | null };
  created_at: string;
};

export type DoctorsPageData = {
  doctors: DoctorCard[];
  pagination: PagePagination;
};
