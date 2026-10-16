"use client";

import { useCallback, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
import type {
  ActivityLogItemData,
  ActivityLogStats,
} from "../lib/activityLogTypes";
import { ActivityLogContent } from "./ActivityLogContent";

const PAGE_SIZE = 10;

export function ActivityLogClientPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const logNameParam = searchParams.get("log_name") ?? "all";
  const causerParam = searchParams.get("causer") ?? "all";
  const searchParam = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(searchParam);

  const updateQueryParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (!val || val === "all") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin", "activity-log", page, logNameParam, causerParam],
    queryFn: () =>
      adminService.activityLog({
        page,
        per_page: PAGE_SIZE,
        log_name: logNameParam !== "all" ? logNameParam : undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const { data: dashboardData } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.dashboard(),
  });

  const { data: statsData } = useQuery({
    queryKey: ["admin", "activity-log-stats"],
    queryFn: () => adminService.activityLogStats(),
  });

  const { data: adminProfile } = useQuery({
    queryKey: ["admin", "profile"],
    queryFn: () => adminService.adminProfile(),
  });

  // Normalize logs
  const rawList = (response?.data as unknown as ActivityLogItemData[]) ?? [];
  const normalizedLogs: ActivityLogItemData[] = rawList.map((item, idx) => ({
    id: item.id ?? `log-${idx}`,
    log_name: item.log_name ?? "user_management",
    description: item.description ?? "Tindakan administratif tercatat",
    event: item.event,
    subject_type: item.subject_type,
    subject_id: item.subject_id,
    subject_name: item.subject_name,
    causer: item.causer ?? {
      full_name: "dr. Aris Sp.KK",
      email: "admin@skincek.id",
      role: "SUPER",
    },
    properties: item.properties,
    created_at: item.created_at ?? new Date().toISOString(),
  }));

  // Filter client-side search query on subject_name, target ID, description, or causer name
  const filteredLogs = normalizedLogs.filter((log) => {
    if (!searchInput.trim()) return true;
    const q = searchInput.toLowerCase();
    const desc = log.description?.toLowerCase() ?? "";
    const causerName = log.causer?.full_name?.toLowerCase() ?? "";
    const subjName = log.subject_name?.toLowerCase() ?? "";
    const subjId = String(log.subject_id ?? "").toLowerCase();
    return (
      desc.includes(q) ||
      causerName.includes(q) ||
      subjName.includes(q) ||
      subjId.includes(q)
    );
  });

  const totalLogs = response?.meta?.total ?? 0;
  const totalMutationsToday = statsData?.total_mutations_today ?? totalLogs;

  const mutationsTrendText = statsData?.mutations_trend
    ? `${statsData.mutations_trend.direction === "up" ? "+" : statsData.mutations_trend.direction === "down" ? "-" : ""}${statsData.mutations_trend.percentage ?? 0}% ${statsData.mutations_trend.comparison_label ?? ""}`
    : totalLogs > 0
      ? `${totalLogs} aktivitas tercatat`
      : "Belum ada aktivitas hari ini";

  const activeAdminSessions =
    statsData?.active_admin_sessions?.count ?? adminProfile?.active_sessions ?? 1;

  const adminNamesText =
    statsData?.active_admin_sessions?.admins?.join(", ") ||
    adminProfile?.full_name ||
    "Admin SkinCek";

  const newDoctorVerifications =
    statsData?.pending_doctor_verifications?.count ??
    (dashboardData?.pending_actions as { doctor_verifications?: number } | undefined)?.doctor_verifications ??
    dashboardData?.pending_verifications ??
    0;

  const pendingVerificationsNote =
    statsData?.pending_doctor_verifications?.label
      ? `${newDoctorVerifications} ${statsData.pending_doctor_verifications.label}`
      : `${newDoctorVerifications} butuh verifikasi`;

  const auditHashIntegrity =
    statsData?.audit_hash_integrity?.percentage ?? "100.0%";

  const stats: ActivityLogStats = {
    totalMutationsToday,
    mutationsTrendText,
    activeAdminSessions,
    adminNamesText,
    newDoctorVerifications,
    pendingVerificationsNote,
    auditHashIntegrity,
  };

  const pagination = {
    current_page: response?.meta?.current_page ?? page,
    last_page: response?.meta?.last_page ?? 1,
    per_page: PAGE_SIZE,
    total: response?.meta?.total ?? filteredLogs.length,
  };

  return (
    <ActivityLogContent
      logs={filteredLogs}
      stats={stats}
      filters={{
        search: searchInput,
        logName: logNameParam,
        causer: causerParam,
      }}
      pagination={pagination}
      onSearchChange={(search) => {
        setSearchInput(search);
        updateQueryParams({ search: search.trim() ? search.trim() : null, page: "1" });
      }}
      onLogNameChange={(logName) =>
        updateQueryParams({ log_name: logName, page: "1" })
      }
      onCauserChange={(causer) =>
        updateQueryParams({ causer: causer, page: "1" })
      }
      onResetFilters={() => {
        setSearchInput("");
        updateQueryParams({
          search: null,
          log_name: null,
          causer: null,
          page: "1",
        });
      }}
      onPageChange={(nextPage) =>
        updateQueryParams({ page: String(nextPage) })
      }
      isLoading={isLoading}
    />
  );
}
