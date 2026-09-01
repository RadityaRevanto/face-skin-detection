import { api } from "@/lib/api";

import type { ActivityLogListResponse } from "../types";

export async function getActivityLog(
  page = 1,
  perPage = 20
): Promise<ActivityLogListResponse> {
  try {
    const response = await api.get<ActivityLogListResponse>(
      "/admin/activity-log",
      { params: { page, per_page: perPage } },
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch activity log:", error);
    return {
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: perPage, total: 0 },
    };
  }
}
