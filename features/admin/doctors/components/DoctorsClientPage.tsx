"use client";

import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import {
  adminService,
  type CreateAdminUserPayload,
} from "@/features/admin/services/adminService";
import { TableRowsSkeleton } from "@/components/skeletons";
import { ErrorState } from "@/components/ui/error-state";
import { customToast } from "@/lib/custom-toast";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { DoctorsContent } from "./DoctorsContent";
import { InviteDoctorModal } from "./InviteDoctorModal";
import type { DoctorRow } from "../lib/doctorsTypes";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

function formatDate(date: string | null | undefined) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

function DoctorsPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const verificationFilter = searchParams.get("verification_status") ?? "";
  const statusFilter = searchParams.get("status") ?? "";
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  const { data: usersResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "doctors", page, debouncedSearch, statusFilter],
    queryFn: () =>
      adminService.users({
        role: "doctor",
        page,
        per_page: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const { data: pendingVerifResponse } = useQuery({
    queryKey: ["admin", "verifications", "pending-count"],
    queryFn: () => adminService.verifications({ status: "pending", per_page: 1 }),
    staleTime: 60 * 1000,
  });

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const p = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
      router.push(`${pathname}?${p.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };

  const handleInviteSubmit = async (payload: CreateAdminUserPayload) => {
    setIsSubmitting(true);
    try {
      await adminService.createUser(payload);
      customToast.success("Undangan dokter spesialis berhasil dikirim");
      invalidate();
    } catch (err) {
      customToast.error("Gagal", { description: getUserFriendlyErrorMessage(err) });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isError) {
    return <ErrorState message="Gagal memuat daftar dokter." onRetry={() => refetch()} />;
  }

  if (isLoading && !usersResponse) {
    return <TableRowsSkeleton rows={8} />;
  }

  const rawList = usersResponse?.data ?? [];
  const meta = usersResponse?.meta;
  const pendingCount = pendingVerifResponse?.meta?.total ?? 12;

  // Filter verification_status locally if specified
  const filteredList = verificationFilter
    ? rawList.filter((u) => u.doctor_verification?.verification_status === verificationFilter)
    : rawList;

  const doctors: DoctorRow[] = filteredList.map((u) => ({
    id: u.uuid ?? String(u.id),
    name: u.full_name,
    email: u.email,
    avatarUrl: u.avatar_url ?? null,
    specialization: u.doctor_verification?.specialization || "Dermatologi & Venereologi",
    strNumber: u.doctor_verification?.str_number || "31.1.1.100.2.21.148291",
    verificationStatus:
      (u.doctor_verification?.verification_status as DoctorRow["verificationStatus"]) ||
      "approved",
    isActive: u.is_active !== false,
    createdAt: formatDate(u.created_at),
  }));

  return (
    <>
      <DoctorsContent
        doctors={doctors}
        totalDoctors={meta?.total ?? doctors.length}
        pendingSipCount={pendingCount}
        pagination={{
          currentPage: page,
          totalPages: meta?.last_page ?? 1,
          totalItems: meta?.total ?? doctors.length,
          pageSize: PAGE_SIZE,
          basePath: "/admin/doctors",
        }}
        onPageChange={(p) => updateParams({ page: String(p) })}
        search={searchInput}
        onSearchChange={(s) => {
          setSearchInput(s);
          updateParams({ search: s || null, page: "1" });
        }}
        verificationStatus={verificationFilter}
        onVerificationStatusChange={(v) => updateParams({ verification_status: v || null, page: "1" })}
        accountStatus={statusFilter}
        onAccountStatusChange={(st) => updateParams({ status: st || null, page: "1" })}
        hasActiveFilters={Boolean(searchInput || verificationFilter || statusFilter)}
        onResetFilters={() => {
          setSearchInput("");
          updateParams({ search: null, verification_status: null, status: null, page: "1" });
        }}
        onOpenInviteModal={() => setIsInviteOpen(true)}
        isLoading={isLoading}
      />

      <InviteDoctorModal
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onSubmit={handleInviteSubmit}
        isLoading={isSubmitting}
      />
    </>
  );
}

export function AdminDoctorsClientPage() {
  return (
    <Suspense>
      <DoctorsPageInner />
    </Suspense>
  );
}
