"use client";

import { useQuery } from "@tanstack/react-query";

import { adminService } from "@/features/admin/services/adminService";
import { LoadingState } from "@/components/ui/loading-state";
import type { ActivityLog } from "@/features/activity-log/types";
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

  // Widget Activity Timeline (§5.1 poin 5) — method service existing.
  const { data: activityLogs } = useQuery({
    queryKey: ["admin", "activity-log", "dashboard"],
    queryFn: async () => {
      const response = await adminService.activityLog({ page: 1, per_page: 5 });
      return (response.data ?? []) as ActivityLog[];
    },
    staleTime: 60 * 1000,
  });

  // Komposisi status verifikasi untuk ProgressDonut (§4.6) — count via
  // adminService.verifications (service existing, tanpa perubahan kontrak).
  const { data: verificationCounts } = useQuery({
    queryKey: ["admin", "verification-counts"],
    queryFn: async () => {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        adminService.verifications({ status: "pending", per_page: 1, page: 1 }),
        adminService.verifications({ status: "approved", per_page: 1, page: 1 }),
        adminService.verifications({ status: "rejected", per_page: 1, page: 1 }),
      ]);

      return {
        pending: pendingRes.meta?.total ?? 0,
        approved: approvedRes.meta?.total ?? 0,
        rejected: rejectedRes.meta?.total ?? 0,
      };
    },
    staleTime: 60 * 1000,
  });

  if (isLoading && !data) {
    return <LoadingState variant="stat-grid" />;
  }

  return (
    <AdminDashboardContent
      {...((data ?? EMPTY_DASHBOARD) as AdminDashboardData)}
      activityLogs={activityLogs ?? []}
      verificationCounts={
        verificationCounts ?? { pending: 0, approved: 0, rejected: 0 }
      }
    />
  );
}
