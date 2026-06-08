export const severityOptions = ["Mild", "Moderate", "Severe"] as const;

export const skinTypeOptions = [
  "All Skin",
  "Dry",
  "Oily",
  "Combination",
  "Sensitive",
  "Normal",
] as const;

export const productCategoryOptions = [
  "Cleanser",
  "Toner",
  "Serum",
  "Moisturizer",
  "Sunscreen",
  "Treatment",
] as const;

export const routineStepOptions = [
  "Pagi - Cleanser",
  "Pagi - Serum",
  "Pagi - Moisturizer",
  "Pagi - Sunscreen",
  "Malam - Cleanser",
  "Malam - Treatment",
  "Malam - Moisturizer",
] as const;

export type SkincareProduct = {
  id: string;
  no: number;
  name: string;
  brand: string;
  category: string;
  concern: string;
  skinType: string;
  description: string;
  updatedAt: string;
};

export type SkinConcern = {
  id: string;
  no: number;
  name: string;
  description: string;
  detectedClass: string;
  recommendationCount: number;
  updatedAt: string;
};

export type SkincareRecommendation = {
  id: string;
  no: number;
  concern: string;
  severity: string;
  skinType: string;
  routineStep: string;
  productName: string;
  productBrand: string;
  doctorNote: string;
  updatedAt: string;
};

export const skinConcerns: SkinConcern[] = [
  {
    id: "inflammatory-acne",
    no: 1,
    name: "Inflammatory Acne",
    description: "Jerawat meradang, kemerahan, dan terasa nyeri.",
    detectedClass: "Inflammatory Acne",
    recommendationCount: 8,
    updatedAt: "18 May 2025",
  },
  {
    id: "dark-spots",
    no: 2,
    name: "Dark Spots",
    description: "Noda hitam atau bekas hiperpigmentasi pada wajah.",
    detectedClass: "Dark Spots",
    recommendationCount: 6,
    updatedAt: "17 May 2025",
  },
  {
    id: "redness",
    no: 3,
    name: "Redness",
    description: "Kemerahan pada kulit yang membutuhkan produk menenangkan.",
    detectedClass: "Redness",
    recommendationCount: 5,
    updatedAt: "15 May 2025",
  },
  {
    id: "pores",
    no: 4,
    name: "Pores",
    description: "Tampilan pori terlihat besar atau mudah tersumbat.",
    detectedClass: "Pores",
    recommendationCount: 4,
    updatedAt: "14 May 2025",
  },
  {
    id: "wrinkles",
    no: 5,
    name: "Wrinkles",
    description: "Garis halus atau tanda penuaan pada kulit.",
    detectedClass: "Wrinkles",
    recommendationCount: 3,
    updatedAt: "13 May 2025",
  },
];

export const skincareProducts: SkincareProduct[] = [
  {
    id: "gentle-hydrating-cleanser",
    no: 1,
    name: "Gentle Hydrating Cleanser",
    brand: "DermaCare",
    category: "Cleanser",
    concern: "Redness",
    skinType: "Sensitive",
    description: "Cleanser lembut untuk kulit sensitif dan kemerahan.",
    updatedAt: "18 May 2025",
  },
  {
    id: "niacinamide-serum",
    no: 2,
    name: "Niacinamide 5% Serum",
    brand: "GlowLab",
    category: "Serum",
    concern: "Pores",
    skinType: "Oily",
    description: "Serum untuk membantu tampilan pori dan produksi minyak.",
    updatedAt: "17 May 2025",
  },
  {
    id: "ceramide-barrier-cream",
    no: 3,
    name: "Ceramide Barrier Cream",
    brand: "SkinWell",
    category: "Moisturizer",
    concern: "Inflammatory Acne",
    skinType: "Dry",
    description: "Moisturizer untuk menjaga skin barrier saat kulit meradang.",
    updatedAt: "15 May 2025",
  },
  {
    id: "daily-uv-shield",
    no: 4,
    name: "Daily UV Shield SPF 50",
    brand: "SunPure",
    category: "Sunscreen",
    concern: "Dark Spots",
    skinType: "All Skin",
    description: "Sunscreen harian untuk membantu mencegah noda makin gelap.",
    updatedAt: "14 May 2025",
  },
  {
    id: "retinol-renewal-night-cream",
    no: 5,
    name: "Retinol Renewal Night Cream",
    brand: "AgeLess",
    category: "Treatment",
    concern: "Wrinkles",
    skinType: "Normal",
    description: "Treatment malam untuk garis halus dengan penggunaan bertahap.",
    updatedAt: "13 May 2025",
  },
];

export const skincareRecommendations: SkincareRecommendation[] = [
  {
    id: "acne-oily-moderate-cleanser",
    no: 1,
    concern: "Inflammatory Acne",
    severity: "Moderate",
    skinType: "Oily",
    routineStep: "Pagi - Cleanser",
    productName: "Gentle Hydrating Cleanser",
    productBrand: "DermaCare",
    doctorNote: "Gunakan cleanser lembut, hindari scrub saat jerawat meradang.",
    updatedAt: "18 May 2025",
  },
  {
    id: "acne-oily-moderate-serum",
    no: 2,
    concern: "Inflammatory Acne",
    severity: "Moderate",
    skinType: "Oily",
    routineStep: "Malam - Treatment",
    productName: "Niacinamide 5% Serum",
    productBrand: "GlowLab",
    doctorNote: "Pakai tipis pada malam hari dan hentikan jika iritasi.",
    updatedAt: "17 May 2025",
  },
  {
    id: "dark-spots-all-sunscreen",
    no: 3,
    concern: "Dark Spots",
    severity: "Mild",
    skinType: "All Skin",
    routineStep: "Pagi - Sunscreen",
    productName: "Daily UV Shield SPF 50",
    productBrand: "SunPure",
    doctorNote: "Sunscreen wajib dipakai ulang saat banyak aktivitas luar.",
    updatedAt: "15 May 2025",
  },
  {
    id: "redness-sensitive-cleanser",
    no: 4,
    concern: "Redness",
    severity: "Mild",
    skinType: "Sensitive",
    routineStep: "Pagi - Cleanser",
    productName: "Gentle Hydrating Cleanser",
    productBrand: "DermaCare",
    doctorNote: "Pilih produk tanpa fragrance dan gunakan air suam-suam kuku.",
    updatedAt: "14 May 2025",
  },
];

export function getSkincareProduct(id: string) {
  return skincareProducts.find((product) => product.id === id);
}

export function getSkincareRecommendation(id: string) {
  return skincareRecommendations.find((recommendation) => recommendation.id === id);
}
