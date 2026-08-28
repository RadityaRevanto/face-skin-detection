import { fetchApi } from "@/lib/api/server-client";
import type { SkinRecommendation } from "@/src/features/history/types";

type ConcernApi = {
  uuid: string;
  name: string;
  ml_label: string;
};

// Cari nama concern berbahasa Indonesia dari label ML (mis. "Redness" → "Kemerahan").
export async function getConcernNameByMlLabel(
  mlLabel: string,
): Promise<string | null> {
  try {
    const res = await fetchApi<ConcernApi[]>("skin-concerns");
    const concerns = res.data ?? [];
    const target = mlLabel.toLowerCase();
    return (
      concerns.find((c) => c.ml_label?.toLowerCase() === target)?.name ?? null
    );
  } catch (error) {
    console.error("Failed to fetch skin concerns from Laravel:", error);
    return null;
  }
}

// Paginasi server-side via GET /v1/skin-recommendations.
// Backend memfilter dengan parameter `ml_label` dan mengurutkan prioritas
// high → medium → low otomatis (SkinRecommendationController@index).
export async function getPaginatedRecommendations(
  mlLabel: string,
  page: number,
  limit: number = 5
) {
  try {
    const res = await fetchApi<SkinRecommendation[]>(
      `skin-recommendations?ml_label=${encodeURIComponent(mlLabel)}&per_page=${limit}&page=${page}`
    );

    const data = res.data ?? [];
    const meta = (res.meta ?? {}) as {
      current_page?: number;
      last_page?: number;
    };

    const totalPages = meta.last_page ?? (data.length > 0 ? 1 : 0);
    let currentPage = meta.current_page ?? page;
    if (currentPage < 1) currentPage = 1;
    if (totalPages > 0 && currentPage > totalPages) currentPage = totalPages;

    return { data, totalPages, currentPage };
  } catch (error) {
    console.error("Failed to fetch paginated recommendations:", error);
    return { data: [] as SkinRecommendation[], totalPages: 0, currentPage: page };
  }
}
