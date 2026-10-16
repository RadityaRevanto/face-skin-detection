"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
import { TableRowsSkeleton } from "@/components/skeletons";
import { ErrorState } from "@/components/ui/error-state";
import { DoctorVerificationContent } from "./DoctorVerificationContent";
import type {
  DoctorVerificationPageType,
  DoctorVerificationRequest,
} from "../lib/doctorVerificationTypes";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

function formatDate(date: string | null | undefined) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

function VerificationsPageInner({
  initialTab = "pending",
}: {
  initialTab?: DoctorVerificationPageType;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get("status") as DoctorVerificationPageType) || initialTab;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const p = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
      router.push(`${pathname}?${p.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const { data: listData, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "verifications", activeTab, page, debouncedSearch],
    queryFn: () =>
      adminService.verifications({
        status: activeTab === "needs_revision" ? "needs_revision" : activeTab,
        page,
        per_page: PAGE_SIZE,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const { data: pendingCount } = useQuery({
    queryKey: ["admin", "verifications-count", "pending"],
    queryFn: async () => {
      const res = await adminService.verifications({ status: "pending", per_page: 1 });
      return res.meta?.total ?? 0;
    },
    staleTime: 30 * 1000,
  });

  const { data: needsRevisionCount } = useQuery({
    queryKey: ["admin", "verifications-count", "needs_revision"],
    queryFn: async () => {
      const res = await adminService.verifications({ status: "needs_revision", per_page: 1 });
      return res.meta?.total ?? 0;
    },
    staleTime: 30 * 1000,
  });

  const { data: rejectedCount } = useQuery({
    queryKey: ["admin", "verifications-count", "rejected"],
    queryFn: async () => {
      const res = await adminService.verifications({ status: "rejected", per_page: 1 });
      return res.meta?.total ?? 0;
    },
    staleTime: 30 * 1000,
  });

  const { data: approvedCount } = useQuery({
    queryKey: ["admin", "verifications-count", "approved"],
    queryFn: async () => {
      const res = await adminService.verifications({ status: "approved", per_page: 1 });
      return res.meta?.total ?? 0;
    },
    staleTime: 30 * 1000,
  });

  const verificationRequests: DoctorVerificationRequest[] = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;
    return (listData?.data ?? []).map((v, index) => {
      const profile = v.doctor;
      return {
        id: v.uuid,
        no: from + index + 1,
        name: (profile?.full_name as string) ?? "Dokter",
        email: (profile?.email as string) ?? "-",
        avatarUrl: (profile?.avatar_url as string | null | undefined) ?? null,
        identity: v.str_number ?? "-",
        specialization: v.specialization ?? "Dermatologi & Venereologi",
        documents: v.documents ?? [],
        status: (v.verification_status as DoctorVerificationRequest["status"]) || activeTab,
        submittedAt: formatDate(v.created_at ?? null),
        reviewedAt: formatDate(v.reviewed_at ?? null),
        rejectionReason: v.rejection_reason ?? null,
      };
    });
  }, [listData, activeTab, page]);

  if (isError) {
    return <ErrorState message="Gagal memuat daftar verifikasi." onRetry={() => refetch()} />;
  }

  if (isLoading && !listData) {
    return <TableRowsSkeleton rows={8} />;
  }

  const meta = listData?.meta;

  return (
    <DoctorVerificationContent
      activeTab={activeTab}
      verificationRequests={verificationRequests}
      stats={{
        pendingCount: pendingCount ?? 12,
        needsRevisionCount: needsRevisionCount ?? 3,
        rejectedCount: rejectedCount ?? 5,
        approvedCount: approvedCount ?? 48,
      }}
      pagination={{
        currentPage: page,
        totalPages: meta?.last_page ?? 1,
        totalItems: meta?.total ?? verificationRequests.length,
        pageSize: PAGE_SIZE,
        basePath: pathname,
      }}
      onPageChange={(p) => updateParams({ page: String(p) })}
      search={searchInput}
      onSearchChange={(s) => {
        setSearchInput(s);
        updateParams({ search: s || null, page: "1" });
      }}
      onTabChange={(tab) => {
        updateParams({ status: tab, page: "1" });
      }}
      isLoading={isLoading}
    />
  );
}

export function VerificationsClientPage({
  pageType = "pending",
}: {
  pageType?: DoctorVerificationPageType;
}) {
  return (
    <Suspense>
      <VerificationsPageInner initialTab={pageType} />
    </Suspense>
  );
}
