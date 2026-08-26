import { fetchApi } from "../client";
import { RecommendationListSchema } from "../schemas/recommendation.schema";
import {
  mapRecommendationToFrontend,
  FrontendRecommendation,
} from "../mappers/recommendation.mapper";

export async function fetchRecommendationsByClass(
  mlLabel: string,
  limit?: number
): Promise<FrontendRecommendation[]> {
  if (!mlLabel) return [];

  try {
    const response = await fetchApi<unknown>("recommendations", {
      method: "GET",
      params: { ml_label: mlLabel },
      cache: "no-store",
    });

    // 1. Validate data using Zod (Security & Resilience)
    // This will strip out unknown properties and throw a ZodError if schema doesn't match
    const validatedData = RecommendationListSchema.parse(response.data || []);

    // 2. Map validated backend data to frontend-friendly structure
    let mapped = validatedData.map(mapRecommendationToFrontend);

    if (limit) {
      mapped = mapped.slice(0, limit);
    }

    return mapped;
  } catch (error) {
    console.error("fetchRecommendationsByClass error:", error);
    return [];
  }
}
