"use client";

import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
import { TableRowsSkeleton } from "@/components/skeletons";
import { ErrorState } from "@/components/ui/error-state";
import { UserFormModal, type UserFormInitial } from "@/features/admin/components/UserFormModal";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { customToast } from "@/lib/custom-toast";
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

  const { data, isLoading, isError, refetch } = useQuery({
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
        role: (profile?.role as string) ?? "doctor",
        isActive: profile?.is_active ?? true,
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

  const queryClient = useQueryClient();
  const [form, setForm] = useState<{ initial: UserFormInitial | null } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "doctors"] });

  async function handleToggleActive(row: DoctorRow) {
    setBusyId(row.id);
    try {
      await adminService.toggleActive(row.id);
      customToast.success(row.isActive ? "Dokter disuspend" : "Dokter diaktifkan");
      invalidate();
    } catch (err: unknown) {
      customToast.error("Gagal", { description: getUserFriendlyErrorMessage(err) });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(row: DoctorRow) {
    if (!window.confirm(`Hapus akun dokter "${row.name}"? Data verifikasinya ikut terhapus.`)) return;
    setBusyId(row.id);
    try {
      await adminService.destroyUser(row.id);
      customToast.success("Akun dokter dihapus");
      invalidate();
    } catch (err: unknown) {
      customToast.error("Gagal", { description: getUserFriendlyErrorMessage(err) });
    } finally {
      setBusyId(null);
    }
  }

  if (isError) {
    return <ErrorState message="Gagal memuat daftar dokter." onRetry={() => refetch()} />;
  }

  if (isLoading && !data) {
    return <TableRowsSkeleton rows={5} />;
  }

  return (
    <>
      <DoctorsContent
        {...pageData}
        onCreate={() => setForm({ initial: null })}
        onEdit={(row) =>
          setForm({
            initial: { uuid: row.id, full_name: row.name, email: row.email, role: row.role },
          })
        }
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
        busyId={busyId}
      />
      {form && (
        <UserFormModal
          open
          initial={form.initial}
          defaultRole="doctor"
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            invalidate();
          }}
        />
      )}
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
