"use client";

import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { adminService } from "@/features/admin/services/adminService";
import { TableRowsSkeleton } from "@/components/skeletons";
import { ErrorState } from "@/components/ui/error-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UserFormModal, type UserFormInitial } from "@/features/admin/components/UserFormModal";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { customToast } from "@/lib/custom-toast";
import { UsersContent } from "./UsersContent";
import type { UserRow, UsersPageData } from "../lib/usersTypes";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

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

  // Search dengan debounce — BE sudah mendukung ?search= (users index), tanpa API baru.
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [search, setSearch] = useState(searchInput);

  useEffect(() => {
    const id = window.setTimeout(() => setSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin", "users", page, search],
    queryFn: async () => {
      const response = await adminService.users({
        role: "user",
        page,
        per_page: PAGE_SIZE,
        ...(search ? { search } : {}),
      });
      return response as unknown as {
        data: {
          uuid: string;
          id?: string;
          full_name: string;
          email: string;
          avatar_url?: string | null;
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
      avatarUrl: user.avatar_url ?? null,
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
  const [pendingDelete, setPendingDelete] = useState<UserRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
    [queryClient],
  );

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

  async function confirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await adminService.destroyUser(pendingDelete.id);
      customToast.success("User dihapus");
      invalidate();
      setPendingDelete(null);
    } catch (err: unknown) {
      customToast.error("Gagal", { description: getUserFriendlyErrorMessage(err) });
    } finally {
      setIsDeleting(false);
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
        search={searchInput}
        onSearchChange={setSearchInput}
        isFetching={isFetching && !isLoading}
        hasActiveFilter={search.length > 0}
        onClearFilter={() => setSearchInput("")}
        onCreate={() => setForm({ initial: null })}
        onEdit={(row) =>
          setForm({
            initial: { uuid: row.id, full_name: row.username, email: row.email, role: row.role },
          })
        }
        onToggleActive={handleToggleActive}
        onDelete={(row) => setPendingDelete(row)}
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
      <ConfirmDialog
        open={pendingDelete !== null}
        title="Hapus user?"
        description={`User "${pendingDelete?.username ?? ""}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Hapus User"
        tone="danger"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
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