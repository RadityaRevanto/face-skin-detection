import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";

import type {
  RecommendationRow,
  RecommendationsPageData,
} from "./recommendationsTypes";

const PAGE_SIZE = 10;

type GetRecommendationsPageDataParams = {
  page?: number;
};

function formatPriority(value: string | null | undefined) {
  if (value === "high") return "High Priority";
  if (value === "medium") return "Medium Priority";
  if (value === "low") return "Low Priority";

  return "-";
}

async function countSkinConcerns() {
  try {
    const res = await fetchApi<unknown[]>("/skin-concerns?per_page=50&page=1");
    return res.meta?.total ?? res.data?.length ?? 0;
  } catch {
    return 0;
  }
}

interface RecommendationApi {
  uuid: string;
  title: string;
  recommendation_text: string;
  priority_level: string;
  concern?: { name: string };
  product?: { name: string; category: string };
}

export async function getRecommendationsPageData({
  page = 1,
}: GetRecommendationsPageDataParams = {}): Promise<RecommendationsPageData> {
  await requireDoctorProfile();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const from = (safePage - 1) * PAGE_SIZE;

  try {
    const res = await fetchApi<RecommendationApi[]>(
      `/doctor/recommendations?page=${safePage}&per_page=${PAGE_SIZE}`,
    );

    const recommendationRows = res.data ?? [];

    const recommendations: RecommendationRow[] = recommendationRows.map(
      (recommendation: RecommendationApi, index: number) => {
        return {
          id: recommendation.uuid,
          no: from + index + 1,
          concern: recommendation.concern?.name ?? "-",
          severity: formatPriority(recommendation.priority_level),
          skinType: "Semua tipe kulit",
          productName: recommendation.product?.name ?? "-",
          productBrand: recommendation.product?.category ?? "-",
          routineStep: recommendation.title ?? "-",
          doctorNote: recommendation.recommendation_text ?? "-",
        };
      },
    );

    const totalConcerns = await countSkinConcerns();

    const uniqueRoutineSteps = new Set(
      recommendationRows.map((item: RecommendationApi) => item.title).filter(Boolean),
    );

    return {
      recommendations,
      summary: {
        totalRecommendations: res.meta?.total ?? 0,
        totalConcerns,
        totalRoutineSteps: uniqueRoutineSteps.size,
      },
      pagination: {
        currentPage: safePage,
        totalPages: res.meta?.last_page ?? 1,
        totalItems: res.meta?.total ?? 0,
        pageSize: PAGE_SIZE,
      },
    };
  } catch (error) {
    console.error("Failed to fetch doctor recommendations:", error);

    return {
      recommendations: [],
      summary: {
        totalRecommendations: 0,
        totalConcerns: 0,
        totalRoutineSteps: 0,
      },
      pagination: {
        currentPage: safePage,
        totalPages: 1,
        totalItems: 0,
        pageSize: PAGE_SIZE,
      },
    };
  }
}
