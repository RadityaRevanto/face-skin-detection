export type RecommendationConcernOption = {
  id: string;
  name: string;
};

export type RecommendationProductOption = {
  id: string;
  name: string;
  category: string;
};

export type CreateRecommendationPageData = {
  concerns: RecommendationConcernOption[];
  products: RecommendationProductOption[];
};
