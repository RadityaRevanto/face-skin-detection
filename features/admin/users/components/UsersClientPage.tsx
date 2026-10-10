"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { adminService, type AdminUser, type CreateAdminUserPayload } from "@/features/admin/services/adminService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { TableRowsSkeleton } from "@/components/skeletons";
import { ErrorState } from "@/components/ui/error-state";
import { customToast } from "@/lib/custom-toast";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";
import { UsersContent } from "./UsersContent";
import { CreateUserModal } from "./CreateUserModal";
import { ChangeRoleModal } from "./ChangeRoleModal";
import { SuspendUserModal } from "./SuspendUserModal";
import { DeleteUserModal } from "./DeleteUserModal";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

function UsersPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const role = searchParams.get("role") ?? "";
  const status = searchParams.get("status") ?? "";
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [roleModalUser, setRoleModalUser] = useState<AdminUser | null>(null);
  const [suspendModalUser, setSuspendModalUser] = useState<AdminUser | null>(null);
  const [deleteModalUser, setDeleteModalUser] = useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: usersResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "users", page, debouncedSearch, role, status],
    queryFn: () =>
      adminService.users({
        page,
        per_page: PAGE_SIZE,
        search: debouncedSearch || undefined,
        role: role || undefined,
        status: status || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const { data: dashboardData } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.dashboard(),
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

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

  const executeAction = async (action: () => Promise<unknown>, successMsg: string) => {
    setIsSubmitting(true);
    try {
      await action();
      customToast.success(successMsg);
      invalidate();
    } catch (err) {
      customToast.error("Gagal", { description: getUserFriendlyErrorMessage(err) });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const list = usersResponse?.data ?? [];
    if (!list.length) return customToast.error("Tidak ada data untuk diekspor");
    const headers = "UUID,Nama,Email,Role,Status,Tanggal Daftar\n";
    const rows = list
      .map(
        (u) =>
          `"${u.uuid}","${u.full_name}","${u.email}","${u.role}","${
            u.is_active === false ? "Nonaktif" : "Aktif"
          }","${u.created_at ?? ""}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `users_${Date.now()}.csv`);
    link.click();
  };

  if (isError) return <ErrorState message="Gagal memuat daftar pengguna." onRetry={() => refetch()} />;
  if (isLoading && !usersResponse) return <TableRowsSkeleton rows={8} />;

  const meta = usersResponse?.meta;
  const stats = (dashboardData as { stats?: { total_users?: number; total_doctors?: number } })?.stats;

  return (
    <>
      <UsersContent
        users={usersResponse?.data ?? []}
        totalUsersCount={stats?.total_users ?? meta?.total ?? 0}
        totalDoctorsCount={stats?.total_doctors ?? 48}
        totalAdminsCount={6}
        totalSuspendedCount={14}
        pagination={{
          currentPage: page,
          totalPages: meta?.last_page ?? 1,
          totalItems: meta?.total ?? 0,
          pageSize: PAGE_SIZE,
          basePath: "/admin/users",
        }}
        onPageChange={(p) => updateParams({ page: String(p) })}
        search={searchInput}
        onSearchChange={(s) => {
          setSearchInput(s);
          updateParams({ search: s || null, page: "1" });
        }}
        role={role}
        onRoleChange={(r) => updateParams({ role: r || null, page: "1" })}
        status={status}
        onStatusChange={(st) => updateParams({ status: st || null, page: "1" })}
        hasActiveFilters={Boolean(searchInput || role || status)}
        onResetFilters={() => {
          setSearchInput("");
          updateParams({ search: null, role: null, status: null, page: "1" });
        }}
        onExportCSV={handleExportCSV}
        currentUserUuid={currentUser?.uuid}
        currentUserEmail={currentUser?.email}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenRoleModal={(u) => setRoleModalUser(u)}
        onOpenSuspendModal={(u) => setSuspendModalUser(u)}
        onOpenDeleteModal={(u) => setDeleteModalUser(u)}
        isLoading={isLoading}
      />

      <CreateUserModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(payload: CreateAdminUserPayload) =>
          executeAction(() => adminService.createUser(payload), "Pengguna baru berhasil ditambahkan")
        }
        isLoading={isSubmitting}
      />
      <ChangeRoleModal
        open={roleModalUser !== null}
        user={roleModalUser}
        onClose={() => setRoleModalUser(null)}
        onSubmit={(uuid, newRole) =>
          executeAction(() => adminService.assignRole(uuid, newRole), "Role berhasil diperbarui")
        }
        isLoading={isSubmitting}
      />
      <SuspendUserModal
        open={suspendModalUser !== null}
        user={suspendModalUser}
        onClose={() => setSuspendModalUser(null)}
        onSubmit={(uuid) =>
          executeAction(() => adminService.toggleActive(uuid), "Status akun berhasil diperbarui")
        }
        isLoading={isSubmitting}
      />
      <DeleteUserModal
        open={deleteModalUser !== null}
        user={deleteModalUser}
        onClose={() => setDeleteModalUser(null)}
        onSubmit={(uuid) =>
          executeAction(() => adminService.destroyUser(uuid), "Akun berhasil dihapus permanen")
        }
        isLoading={isSubmitting}
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
