"use client";

import { useQuery } from "@tanstack/react-query";

import { adminService } from "@/features/admin/services/adminService";
import { AdminDashboardSkeleton } from "@/components/skeletons";
import { ErrorState } from "@/components/ui/error-state";
import type { ActivityLog } from "@/features/activity-log/types";
import { AdminDashboardContent } from "./AdminDashboardContent";
import type { AdminDashboardData } from "../lib/adminDashboardTypes";

export function AdminDashboardClientContent() {
  const { data, isLoading, isError, refetch } = useQuery({
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

  if (isError) {
    return (
      <ErrorState message="Gagal memuat dashboard. Data tidak dapat ditampilkan." onRetry={() => refetch()} />
    );
  }

  if (isLoading && !data) {
    return <AdminDashboardSkeleton />;
  }

  if (!data) return null;

  return (
    <AdminDashboardContent
      {...(data as AdminDashboardData)}
      activityLogs={activityLogs ?? []}
      verificationCounts={
        verificationCounts ?? { pending: 0, approved: 0, rejected: 0 }
      }
    />
  );
}
