import type { PagePagination } from "@/lib/types/pagination";

export type RecommendationRow = {
  id: string;
  no: number;
  concern: string;
  severity: string;
  skinType: string;
  productName: string;
  productBrand: string;
  routineStep: string;
  doctorNote: string;
};

export type RecommendationSummary = {
  totalRecommendations: number;
  totalConcerns: number;
  totalRoutineSteps: number;
};

export type RecommendationsPageData = {
  recommendations: RecommendationRow[];
  summary: RecommendationSummary;
  pagination: PagePagination;
};
