import { requireAdminProfile } from "@/lib/admin-auth";
import { fetchApi } from "@/lib/api/server-client";

import type { AdminDashboardData } from "./admin-dashboard-types";

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  await requireAdminProfile();

  try {
    const res = await fetchApi<AdminDashboardData>("/admin/dashboard");
    return res.data ?? {
      stats: {
        total_users: 0,
        total_doctors: 0,
        new_users_this_week: 0,
        total_scans: 0,
        scans_today: 0,
        active_pro_subscriptions: 0,
        monthly_revenue: 0,
      },
      pending_actions: { doctor_verifications: 0 },
      charts: { scans_last_14_days: [], registrations_last_14_days: [] },
      recent_verifications: [],
    };
  } catch (error) {
    console.error("Failed to fetch admin dashboard:", error);
    return {
      stats: {
        total_users: 0,
        total_doctors: 0,
        new_users_this_week: 0,
        total_scans: 0,
        scans_today: 0,
        active_pro_subscriptions: 0,
        monthly_revenue: 0,
      },
      pending_actions: { doctor_verifications: 0 },
      charts: { scans_last_14_days: [], registrations_last_14_days: [] },
      recent_verifications: [],
    };
  }
}
