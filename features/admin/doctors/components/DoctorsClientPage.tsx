"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
import { LoadingState } from "@/components/ui/loading-state";
import { DoctorsContent } from "./DoctorsContent";
import type { DoctorsPageData, DoctorRow } from "../lib/doctorsTypes";

const PAGE_SIZE = 10;

function formatDate(date: string | null | undefined) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

function DoctorsPageInner() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "doctors", page],
    queryFn: () => adminService.verifications({ status: "approved", page, per_page: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  const pageData: DoctorsPageData = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;

    const doctors: DoctorRow[] = (data?.data ?? []).map((verification, index) => {
      const profile = verification.doctor;

      return {
        id: profile?.uuid ?? verification.uuid,
        verificationId: verification.uuid,
        no: from + index + 1,
        name: (profile?.full_name as string) ?? "Dokter",
        email: (profile?.email as string) ?? "-",
        identity: verification.str_number ?? "-",
        specialization: verification.specialization ?? "-",
        documents: verification.documents ?? [],
        verifiedAt: formatDate(verification.reviewed_at ?? verification.created_at),
        status: "Approved",
        rawStatus: "approved",
        isActive: true,
      };
    });

    return {
      doctors,
      pagination: {
        currentPage: page,
        totalPages: data?.meta?.last_page ?? 1,
        totalItems: data?.meta?.total ?? 0,
        pageSize: PAGE_SIZE,
        basePath: "/admin/doctors",
        itemLabel: "dokter",
      },
    };
  }, [data, page]);

  if (isLoading && !data) {
    return <LoadingState variant="rows" />;
  }

  return <DoctorsContent {...pageData} />;
}

export function AdminDoctorsClientPage() {
  return (
    <Suspense>
      <DoctorsPageInner />
    </Suspense>
  );
}
