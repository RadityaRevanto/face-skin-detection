import type { PagePagination } from "@/lib/types/pagination";

export type SkinConcernRow = {
  uuid: string;
  name: string;
  description?: string;
  default_severity_score?: number | string;
  is_active?: boolean;
};

export type SkinConcernsPageData = {
  concerns: SkinConcernRow[];
  pagination: PagePagination;
};
