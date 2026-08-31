export type RecommendationConcernOption = {
  id: string;
  name: string;
};

export type RecommendationProductOption = {
  id: string;
  name: string;
  category: string;
};

export type EditRecommendationDefaultValues = {
  id: string;
  concernId: string;
  productId: string;
  title: string;
  recommendationText: string;
  priorityLevel: "low" | "medium" | "high";
  isActive: boolean;
};

export type EditRecommendationPageData = {
  recommendation: EditRecommendationDefaultValues;
  concerns: RecommendationConcernOption[];
  products: RecommendationProductOption[];
};
