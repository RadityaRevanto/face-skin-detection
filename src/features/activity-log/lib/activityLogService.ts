import type { ActivityLog, ActivityLogListResponse } from "../types";

export async function getActivityLog(
  page = 1,
  perPage = 20
): Promise<ActivityLogListResponse> {
  try {
    const res = await fetch(`/api/admin/activity-log?page=${page}&per_page=${perPage}`);

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
        per_page: meta.per_page ?? perPage,
        total: meta.total ?? 0,
      },
    };
  } catch (error) {
    console.error("Failed to fetch activity log:", error);
    return {
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 },
    };
  }
}
