import { BackendRecommendation } from "../schemas/recommendation.schema";

// Type that our frontend components expect
export type FrontendRecommendation = {
  id: string;
  title: string;
  recommendation_text: string;
  priority_level: string;
  is_active?: boolean;
  skincare_products?: {
    id: string;
    name: string;
    category: string;
    key_ingredients: string | null;
    usage_instruction: string | null;
    warning: string | null;
  } | null;
};

export function mapRecommendationToFrontend(
  backendData: BackendRecommendation
): FrontendRecommendation {
  return {
    id: backendData.uuid,
    title: backendData.title,
    recommendation_text: backendData.recommendation_text,
    priority_level: backendData.priority_level,
    is_active: backendData.is_active,
    skincare_products: backendData.product
      ? {
          id: backendData.product.uuid,
          name: backendData.product.name,
          category: backendData.product.category,
          key_ingredients: backendData.product.key_ingredients || null,
          usage_instruction: backendData.product.usage_instruction || null,
          warning: backendData.product.warning || null,
        }
      : null,
  };
}
