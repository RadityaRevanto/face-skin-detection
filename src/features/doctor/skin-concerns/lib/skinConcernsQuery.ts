import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";
import { ROUTES } from "@/lib/constants";
import type { PagePagination } from "@/lib/types/pagination";

import type { SkinConcernRow, SkinConcernsPageData } from "./skinConcernsTypes";

const PAGE_SIZE = 10;

export async function getSkinConcernsPageData({
  page = 1,
}: {
  page?: number;
} = {}): Promise<SkinConcernsPageData> {
  await requireDoctorProfile();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;

  const pagination: PagePagination = {
    currentPage: safePage,
    totalPages: 1,
    totalItems: 0,
    pageSize: PAGE_SIZE,
    basePath: ROUTES.DOCTOR.SKIN_CONCERNS,
    itemLabel: "skin concern",
  };

  try {
    const res = await fetchApi<SkinConcernRow[]>(
      `/skin-concerns?page=${safePage}&per_page=${PAGE_SIZE}`,
    );

    return {
      concerns: res.data ?? [],
      pagination: {
        ...pagination,
        totalPages: res.meta?.last_page ?? 1,
        totalItems: res.meta?.total ?? 0,
      },
    };
  } catch (error) {
    console.error("Failed to fetch skin concerns:", error);
    return { concerns: [], pagination };
  }
}
