import { fetchApi } from "@/lib/api/server-client";
import type { PagePagination } from "@/lib/types/pagination";

import type { DoctorCard, DoctorProfile, DoctorReview } from "../types";

const DOCTORS_PAGE_SIZE = 5;

/**
 * Daftar dokter approved + AI bot pinned atas (orderByRaw backend).
 * Server-side fetch untuk halaman list /user/consultations.
 */
export async function getDoctorsPageData({
  page = 1,
}: {
  page?: number;
} = {}): Promise<{ doctors: DoctorCard[]; pagination: PagePagination }> {
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;

  const pagination: PagePagination = {
    currentPage: safePage,
    totalPages: 1,
    totalItems: 0,
    pageSize: DOCTORS_PAGE_SIZE,
    basePath: "/user/consultations",
    itemLabel: "dokter",
  };

  try {
    const res = await fetchApi<DoctorCard[]>(
      `/doctors?page=${safePage}&per_page=${DOCTORS_PAGE_SIZE}`,
    );

    return {
      doctors: res.data ?? [],
      pagination: {
        ...pagination,
        totalPages: res.meta?.last_page ?? 1,
        totalItems: res.meta?.total ?? 0,
      },
    };
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    return { doctors: [], pagination };
  }
}

/** Detail profil dokter untuk halaman "stalking". Null → 404. */
export async function getDoctorProfile(
  uuid: string,
): Promise<DoctorProfile | null> {
  try {
    const res = await fetchApi<DoctorProfile>(`/doctors/${uuid}`);
    return res.data ?? null;
  } catch (error) {
    console.error("Failed to fetch doctor profile:", error);
    return null;
  }
}

export type DoctorReviewsPageData = {
  reviews: DoctorReview[];
  ratingAvg: number | null;
  ratingCount: number;
  pagination: PagePagination;
};

/** Review dokter — meta custom (current/last/per_page/total). */
export async function getDoctorReviewsPageData(
  uuid: string,
  { page = 1 }: { page?: number } = {},
): Promise<DoctorReviewsPageData> {
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;

  try {
    const res = await fetchApi<DoctorReview[]>(
      `/doctors/${uuid}/ratings?page=${safePage}&per_page=5`,
    );

    return {
      reviews: res.data ?? [],
      ratingAvg: null,
      ratingCount: res.meta?.total ?? 0,
      pagination: {
        currentPage: safePage,
        totalPages: res.meta?.last_page ?? 1,
        totalItems: res.meta?.total ?? 0,
        pageSize: res.meta?.per_page ?? 5,
        basePath: `/user/consultations/${uuid}`,
        itemLabel: "review",
      },
    };
  } catch (error) {
    console.error("Failed to fetch doctor reviews:", error);
    return {
      reviews: [],
      ratingAvg: null,
      ratingCount: 0,
      pagination: {
        currentPage: safePage,
        totalPages: 1,
        totalItems: 0,
        pageSize: 5,
        basePath: `/user/consultations/${uuid}`,
        itemLabel: "review",
      },
    };
  }
}
