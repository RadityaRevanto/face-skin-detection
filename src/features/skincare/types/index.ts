export type SkincareProduct = {
  uuid: string;
  name: string;
  category: string;
  key_ingredients: string | null;
  usage_instruction: string | null;
  warning: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SkincareProductListResponse = {
  data: SkincareProduct[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type SkincareCategory =
  | "cleanser"
  | "toner"
  | "serum"
  | "moisturizer"
  | "sunscreen"
  | "exfoliant"
  | "mask"
  | "treatment"
  | "other";

export const SKINCARE_CATEGORY_LABELS: Record<SkincareCategory, string> = {
  cleanser: "Cleanser",
  toner: "Toner",
  serum: "Serum",
  moisturizer: "Moisturizer",
  sunscreen: "Sunscreen",
  exfoliant: "Exfoliant",
  mask: "Mask",
  treatment: "Treatment",
  other: "Other",
};

export const SKINCARE_CATEGORY_COLORS: Record<SkincareCategory, string> = {
  cleanser: "bg-blue-100 text-blue-700",
  toner: "bg-purple-100 text-purple-700",
  serum: "bg-amber-100 text-amber-700",
  moisturizer: "bg-emerald-100 text-emerald-700",
  sunscreen: "bg-orange-100 text-orange-700",
  exfoliant: "bg-rose-100 text-rose-700",
  mask: "bg-indigo-100 text-indigo-700",
  treatment: "bg-cyan-100 text-cyan-700",
  other: "bg-slate-100 text-slate-700",
};
