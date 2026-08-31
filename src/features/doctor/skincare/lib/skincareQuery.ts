import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";
import { ROUTES } from "@/lib/constants";

import type { SkincarePageData, SkincareRow } from "./skincareTypes";

const PAGE_SIZE = 10;

type GetSkincarePageDataParams = {
  page?: number;
  search?: string;
};

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

async function countSkinConcerns() {
  // per_page harus termasuk whitelist backend [5,10,20,50]; meta.total
  // tersedia karena endpoint skin-concerns kini dipaginasi.
  try {
    const res = await fetchApi<unknown[]>("/skin-concerns?per_page=50&page=1");
    return res.meta?.total ?? res.data?.length ?? 0;
  } catch {
    return 0;
  }
}

interface ProductApi {
  uuid: string;
  name: string;
  category: string;
  key_ingredients?: string;
  created_at?: string;
  concern?: { name: string };
  skin_type?: { name: string };
}

export async function getSkincarePageData({
  page = 1,
  search = "",
}: GetSkincarePageDataParams = {}): Promise<SkincarePageData> {
  await requireDoctorProfile();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const from = (safePage - 1) * PAGE_SIZE;
  const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";

  try {
    const res = await fetchApi<ProductApi[]>(
      `/doctor/products?page=${safePage}&per_page=${PAGE_SIZE}${searchQuery}`,
    );

    const productRows = res.data ?? [];

    const products: SkincareRow[] = productRows.map((product: ProductApi, index: number) => {
      return {
        id: product.uuid,
        no: from + index + 1,
        name: product.name ?? "-",
        category: product.category ?? "-",
        keyIngredients: product.key_ingredients ?? "-",
        concern: product.concern?.name ?? "-",
        skinType: product.skin_type?.name ?? "-",
        updatedAt: formatDate(product.created_at),
      };
    });

    const uniqueCategories = new Set(
      productRows.map((product: ProductApi) => product.category).filter(Boolean),
    );

    const totalConcerns = await countSkinConcerns();

    return {
      products,
      summary: {
        totalProducts: res.meta?.total ?? 0,
        totalCategories: uniqueCategories.size,
        totalConcerns,
      },
      pagination: {
        currentPage: safePage,
        totalPages: res.meta?.last_page ?? 1,
        totalItems: res.meta?.total ?? 0,
        pageSize: PAGE_SIZE,
        basePath: ROUTES.DOCTOR.SKINCARE,
        itemLabel: "produk",
      },
    };
  } catch (error) {
    console.error("Failed to fetch skincare products:", error);

    return {
      products: [],
      summary: {
        totalProducts: 0,
        totalCategories: 0,
        totalConcerns: 0,
      },
      pagination: {
        currentPage: safePage,
        totalPages: 1,
        totalItems: 0,
        pageSize: PAGE_SIZE,
        basePath: ROUTES.DOCTOR.SKINCARE,
        itemLabel: "produk",
      },
    };
  }
}
