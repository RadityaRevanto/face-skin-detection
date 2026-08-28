import type {
  SkincareProduct,
  SkincareProductListResponse,
} from "../types";

type GetSkincareProductsParams = {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
};

export async function getSkincareProducts(
  params: GetSkincareProductsParams = {}
): Promise<SkincareProductListResponse> {
  const { page = 1, per_page = 12, search, category } = params;

  const searchParams = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
  });

  if (search) searchParams.set("search", search);
  if (category) searchParams.set("category", category);

  try {
    const res = await fetch(`/api/skincare-products?${searchParams.toString()}`);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();

    const meta = (data.meta ?? {}) as {
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
    };

    return {
      data: data.data ?? [],
      meta: {
        current_page: meta.current_page ?? page,
        last_page: meta.last_page ?? 1,
        per_page: meta.per_page ?? per_page,
        total: meta.total ?? 0,
      },
    };
  } catch (error) {
    console.error("Failed to fetch skincare products:", error);
    return {
      data: [],
      meta: { current_page: 1, last_page: 1, per_page, total: 0 },
    };
  }
}

export async function getSkincareProduct(
  uuid: string
): Promise<SkincareProduct | null> {
  try {
    const res = await fetch(`/api/skincare-products/${uuid}`);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.data ?? null;
  } catch (error) {
    console.error("Failed to fetch skincare product:", error);
    return null;
  }
}
