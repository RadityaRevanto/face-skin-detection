import { z } from "zod";

export const ProductSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  category: z.string(),
  key_ingredients: z.string().nullable().optional(),
  usage_instruction: z.string().nullable().optional(),
  warning: z.string().nullable().optional(),
});

export const RecommendationSchema = z.object({
  uuid: z.string(),
  title: z.string(),
  recommendation_text: z.string(),
  priority_level: z.enum(["low", "medium", "high"]),
  is_active: z.boolean(),
  product: ProductSchema.nullable().optional(),
});

// We expect an array of RecommendationSchema from the API
export const RecommendationListSchema = z.array(RecommendationSchema);

export type BackendRecommendation = z.infer<typeof RecommendationSchema>;
export type BackendProduct = z.infer<typeof ProductSchema>;
