"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
import { DoctorVerificationContent } from "./DoctorVerificationContent";
import type {
  DoctorVerificationPageData,
  DoctorVerificationPageType,
} from "../lib/doctorVerificationTypes";

const PAGE_SIZE = 10;

function formatDate(date: string | null | undefined) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

function VerificationsPageInner({ pageType }: { pageType: DoctorVerificationPageType }) {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const { data: listData, isLoading } = useQuery({
    queryKey: ["admin", "verifications", pageType, page],
    queryFn: () =>
      adminService.verifications({
        status: pageType === "pending" ? "pending" : "rejected",
        page,
        per_page: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const { data: pendingCount } = useQuery({
    queryKey: ["admin", "pending-verifications-count"],
    queryFn: () => adminService.pendingVerificationCount(),
    staleTime: 30 * 1000,
  });

  const { data: rejectedCount } = useQuery({
    queryKey: ["admin", "verifications-count", "rejected"],
    queryFn: async () => {
      const response = await adminService.verifications({
        status: "rejected",
        per_page: 1,
        page: 1,
      });
      return response.meta?.total ?? 0;
    },
    staleTime: 30 * 1000,
  });

  const { data: approvedCount } = useQuery({
    queryKey: ["admin", "verifications-count", "approved"],
    queryFn: async () => {
      const response = await adminService.verifications({
        status: "approved",
        per_page: 1,
        page: 1,
      });
      return response.meta?.total ?? 0;
    },
    staleTime: 30 * 1000,
  });

  const pageData: DoctorVerificationPageData = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;

    const verificationRequests = (listData?.data ?? []).map((verification, index) => {
      const profile = verification.doctor;

      return {
        id: verification.uuid,
        no: from + index + 1,
        name: (profile?.full_name as string) ?? "Dokter",
        email: (profile?.email as string) ?? "-",
        identity: verification.str_number ?? "-",
        specialization: verification.specialization ?? "-",
        documents: verification.documents ?? [],
        status: (pageType === "pending" ? "Pending" : "Rejected") as "Pending" | "Rejected",
        submittedAt: formatDate(verification.created_at ?? null),
        reviewedAt: formatDate(verification.reviewed_at ?? null),
        rejectionReason: verification.rejection_reason ?? null,
      };
    });

    const basePath =
      pageType === "pending"
        ? "/admin/doctor-verifications/pending"
        : "/admin/doctor-verifications/rejected";

    return {
      pageType,
      verificationRequests,
      stats: {
        pendingCount: pendingCount ?? 0,
        rejectedCount: rejectedCount ?? 0,
        approvedCount: approvedCount ?? 0,
      },
      pagination: {
        currentPage: page,
        totalPages: listData?.meta?.last_page ?? 1,
        totalItems: listData?.meta?.total ?? 0,
        pageSize: PAGE_SIZE,
        basePath,
        itemLabel: "verifikasi",
      },
    };
  }, [listData, pendingCount, rejectedCount, approvedCount, pageType, page]);

  if (isLoading && !listData) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return <DoctorVerificationContent {...pageData} />;
}

export function VerificationsClientPage({
  pageType,
}: {
  pageType: DoctorVerificationPageType;
}) {
  return (
    <Suspense>
      <VerificationsPageInner pageType={pageType} />
    </Suspense>
  );
}
