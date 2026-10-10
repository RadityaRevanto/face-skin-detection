import type { PagePagination } from "@/lib/types/pagination";

export type SkinConcernRow = {
  uuid: string;
  name: string;
  ml_label?: string | null;
  description?: string | null;
  default_severity_score?: number | string;
  is_active?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export type SkinConcernsPageData = {
  concerns: SkinConcernRow[];
  pagination: PagePagination;
};
