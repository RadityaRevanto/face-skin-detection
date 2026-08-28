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

export type SkincareConcernOption = {
  id: string;
  name: string;
};

export type SkincareTypeOption = {
  id: string;
  name: string;
};

export type SkincareFormProps = {
  mode?: "create" | "edit";
  concerns: SkincareConcernOption[];
  skinTypes: SkincareTypeOption[];
  defaultValues?: {
    id?: string;
    concernId?: string;
    skinTypeId?: string;
    name?: string;
    category?: string;
    keyIngredients?: string;
    usageInstruction?: string;
    warning?: string;
    isActive?: boolean;
    genderSuitability?: string;
  };
};

export type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export const categoryOptions = [
  "Cleanser",
  "Toner",
  "Serum",
  "Moisturizer",
  "Sunscreen",
  "Treatment",
  "Mask",
  "Exfoliator",
];

export type SkincareFormSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export type SkincareFormInputProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export type SkincareFormTextareaProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};
