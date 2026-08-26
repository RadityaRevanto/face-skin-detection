import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";

import type { CreateRecommendationPageData } from "./create-recommendation-types";

interface ConcernApi {
  id: string;
  uuid: string;
  name: string;
  is_active?: boolean;
}

interface ProductApi {
  id: string;
  uuid: string;
  name: string;
  category: string;
  is_active?: boolean;
}

export async function getCreateRecommendationPageData(): Promise<CreateRecommendationPageData> {
  await requireDoctorProfile();

  let concerns: ConcernApi[] = [];
  let products: ProductApi[] = [];

  try {
    const [resConcerns, resProducts] = await Promise.all([
      fetchApi<ConcernApi[]>("/skin-concerns?per_page=100"),
      fetchApi<ProductApi[]>("/doctor/products?per_page=100"),
    ]);

    concerns = Array.isArray(resConcerns.data) ? resConcerns.data : (resConcerns.data as any)?.data ?? [];
    products = Array.isArray(resProducts.data) ? resProducts.data : (resProducts.data as any)?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch data for create recommendation form:", error);
  }

  return {
    concerns: concerns.map((concern: ConcernApi, i: number) => ({
      id: concern.id || concern.uuid || `concern-${i}`,
      name: concern.name ?? "-",
    })),
    products: products
      .filter((product: ProductApi) => product.is_active !== false)
      .map((product: ProductApi, i: number) => ({
        id: product.id || product.uuid || `product-${i}`,
        name: product.name ?? "-",
        category: product.category ?? "-",
      })),
  };
}
