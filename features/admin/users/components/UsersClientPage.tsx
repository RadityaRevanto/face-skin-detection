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
import { UsersContent } from "./UsersContent";
import type { UserRow, UsersPageData } from "../lib/usersTypes";

const PAGE_SIZE = 10;

function formatDate(date: string | null | undefined) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

function formatGender(gender: string | null | undefined) {
  if (!gender) return "-";
  if (gender === "laki_laki") return "Laki-laki";
  if (gender === "perempuan") return "Perempuan";
  return gender;
}

function UsersPageInner() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: async () => {
      const response = await adminService.users({
        role: "user",
        page,
        per_page: PAGE_SIZE,
      });
      return response as unknown as {
        data: {
          uuid: string;
          id?: string;
          full_name: string;
          email: string;
          created_at: string;
          gender?: string;
          age?: number | string;
          role?: string;
          is_active?: boolean;
        }[];
        meta: { last_page: number; total: number };
      };
    },
    placeholderData: keepPreviousData,
  });

  const pageData: UsersPageData = useMemo(() => {
    const from = (page - 1) * PAGE_SIZE;

    const users = (data?.data ?? []).map((user, index) => ({
      id: user.uuid || (user.id ?? ""),
      no: from + index + 1,
      username: user.full_name ?? "User",
      email: user.email ?? "-",
      join: formatDate(user.created_at),
      gender: formatGender(user.gender),
      age: user.age ?? "-",
      role: user.role ?? "user",
      isActive: user.is_active ?? true,
    }));

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: data?.meta?.last_page ?? 1,
        totalItems: data?.meta?.total ?? 0,
        pageSize: PAGE_SIZE,
        basePath: "/admin/users",
        itemLabel: "user",
      },
    };
  }, [data, page]);

  const queryClient = useQueryClient();
  const [form, setForm] = useState<{ initial: UserFormInitial | null } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

  async function handleToggleActive(row: UserRow) {
    setBusyId(row.id);
    try {
      await adminService.toggleActive(row.id);
      customToast.success(row.isActive ? "User disuspend" : "User diaktifkan");
      invalidate();
    } catch (err: unknown) {
      customToast.error("Gagal", { description: getUserFriendlyErrorMessage(err) });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(row: UserRow) {
    if (!window.confirm(`Hapus user "${row.username}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setBusyId(row.id);
    try {
      await adminService.destroyUser(row.id);
      customToast.success("User dihapus");
      invalidate();
    } catch (err: unknown) {
      customToast.error("Gagal", { description: getUserFriendlyErrorMessage(err) });
    } finally {
      setBusyId(null);
    }
  }

  if (isError) {
    return <ErrorState message="Gagal memuat daftar user." onRetry={() => refetch()} />;
  }

  if (isLoading && !data) {
    return <TableRowsSkeleton rows={5} />;
  }

  return (
    <>
      <UsersContent
        {...pageData}
        onCreate={() => setForm({ initial: null })}
        onEdit={(row) =>
          setForm({
            initial: { uuid: row.id, full_name: row.username, email: row.email, role: row.role },
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

export function UsersClientPage() {
  return (
    <Suspense>
      <UsersPageInner />
    </Suspense>
  );
}
