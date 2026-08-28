export type SkincareRow = {
  id: string;
  no: number;
  name: string;
  category: string;
  keyIngredients: string;
  concern: string;
  skinType: string;
  updatedAt: string;
};

export type SkincareSummary = {
  totalProducts: number;
  totalCategories: number;
  totalConcerns: number;
};

export type SkincarePageData = {
  products: SkincareRow[];
  summary: SkincareSummary;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};
