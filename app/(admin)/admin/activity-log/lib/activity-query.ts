import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";

export type ActivityLog = {
  id: number;
  log_name: string;
  description: string;
  subject_type: string | null;
  event: string;
  subject_id: number | null;
  causer_type: string | null;
  causer_id: number | null;
  properties: Record<string, any>;
  batch_uuid: string | null;
  created_at: string;
  updated_at: string;
  causer?: {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
  };
};

export type ActivityLogPageData = {
  data: ActivityLog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};

export async function getActivityLogPageData(page = 1, perPage = 20): Promise<ActivityLogPageData> {
  await requireAdminProfile();

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;

  try {
    const res = await fetchApi<ActivityLog[]>(
      `/admin/activity-log?page=${safePage}&per_page=${perPage}`
    );

    return {
      data: res.data || [],
      pagination: {
        currentPage: safePage,
        totalPages: res.meta?.last_page ?? 1,
        totalItems: res.meta?.total ?? 0,
        pageSize: perPage,
      },
    };
  } catch (error) {
    console.error("Failed to fetch activity log:", error);

    return {
      data: [],
      pagination: {
        currentPage: safePage,
        totalPages: 1,
        totalItems: 0,
        pageSize: perPage,
      },
    };
  }
}
