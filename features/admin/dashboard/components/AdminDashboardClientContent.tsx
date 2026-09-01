"use client";

import { useQuery } from "@tanstack/react-query";

import { adminService } from "@/features/admin/services/adminService";
import { AdminDashboardContent } from "./AdminDashboardContent";
import type { AdminDashboardData } from "../lib/adminDashboardTypes";

const EMPTY_DASHBOARD: AdminDashboardData = {
  stats: {
    total_users: 0,
    total_doctors: 0,
    new_users_this_week: 0,
    total_scans: 0,
    scans_today: 0,
    active_pro_subscriptions: 0,
    monthly_revenue: 0,
  } as AdminDashboardData["stats"],
  pending_actions: { doctor_verifications: 0 },
  charts: { scans_last_14_days: [], registrations_last_14_days: [] },
  recent_verifications: [],
};

export function AdminDashboardClientContent() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.dashboard(),
  });

  if (isLoading && !data) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return <AdminDashboardContent {...(data as AdminDashboardData)} />;
}
