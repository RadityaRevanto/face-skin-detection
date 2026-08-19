import { fetchRecommendationsByClass } from "@/lib/api/services/recommendation.service";

export async function getRecommendationsByPredictedClass(
  predictedClass: string,
) {
  return fetchRecommendationsByClass(predictedClass);
}
