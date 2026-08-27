import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";

import type { CreateRecommendationPageData } from "./create-recommendation-types";

interface ConcernApi {
  uuid: string;
  name: string;
  is_active?: boolean;
}

interface ProductApi {
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
      fetchApi<ConcernApi[]>("/skin-concerns?per_page=50&page=1"),
      fetchApi<ProductApi[]>("/doctor/products?per_page=50&page=1"),
    ]);

    concerns = resConcerns.data ?? [];
    products = resProducts.data ?? [];
  } catch (error) {
    console.error("Failed to fetch data for create recommendation form:", error);
  }

  return {
    concerns: concerns.map((concern: ConcernApi) => ({
      // Backend menerima uuid pada concern_id (UuidResolver).
      id: concern.uuid,
      name: concern.name ?? "-",
    })),
    products: products
      .filter((product: ProductApi) => product.is_active !== false)
      .map((product: ProductApi) => ({
        id: product.uuid,
        name: product.name ?? "-",
        category: product.category ?? "-",
      })),
  };
}
