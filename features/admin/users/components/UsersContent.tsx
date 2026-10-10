"use client";

import { UserPlus } from "lucide-react";
import type { AdminUser } from "@/features/admin/services/adminService";
import type { PagePagination } from "@/lib/types/pagination";
import { UserStatStrip } from "./UserStatStrip";
import { UserFilterBar } from "./UserFilterBar";
import { UsersTable } from "./UsersTable";

type UsersContentProps = {
  users: AdminUser[];
  totalUsersCount: number;
  totalDoctorsCount: number;
  totalAdminsCount: number;
  totalSuspendedCount: number;
  pagination: PagePagination;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCSV: () => void;
  currentUserUuid?: string;
  currentUserEmail?: string;
  onOpenCreateModal: () => void;
  onOpenRoleModal: (user: AdminUser) => void;
  onOpenSuspendModal: (user: AdminUser) => void;
  onOpenDeleteModal: (user: AdminUser) => void;
  isLoading?: boolean;
};

export function UsersContent({
  users,
  totalUsersCount,
  totalDoctorsCount,
  totalAdminsCount,
  totalSuspendedCount,
  pagination,
  onPageChange,
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  hasActiveFilters,
  onResetFilters,
  onExportCSV,
  currentUserUuid,
  currentUserEmail,
  onOpenCreateModal,
  onOpenRoleModal,
  onOpenSuspendModal,
  onOpenDeleteModal,
  isLoading,
}: UsersContentProps) {
  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Header Section with Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-eyebrow text-eyebrow text-role-accent-admin font-semibold tracking-widest uppercase">
              MANAJEMEN PENGGUNA
            </span>
            
          </div>
          <h1 className="font-display text-display text-ink font-semibold tracking-tight">
            Manajemen User
          </h1>
          <p className="font-body-default text-body-default text-ink-muted max-w-2xl">
            Kelola hak akses, peran akun, status keaktifan, dan kredensial pengguna platform SkinCek.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="h-10 px-5 rounded-xl bg-role-accent-admin text-surface font-headline-sm text-caption font-semibold flex items-center gap-2 hover:bg-secondary-container shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah User</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Highlights (4 Cards) */}
      <UserStatStrip
        totalUsers={totalUsersCount}
        totalDoctors={totalDoctorsCount}
        totalAdmins={totalAdminsCount}
        totalSuspended={totalSuspendedCount}
      />

      {/* 3. Main Card Container: FilterBar & DataTable */}
      <div className="bg-surface rounded-2xl shadow-sm overflow-hidden border border-border/50">
        <UserFilterBar
          search={search}
          onSearchChange={onSearchChange}
          role={role}
          onRoleChange={onRoleChange}
          status={status}
          onStatusChange={onStatusChange}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={onResetFilters}
          onExportCSV={onExportCSV}
        />
        <UsersTable
          users={users}
          currentUserUuid={currentUserUuid}
          currentUserEmail={currentUserEmail}
          pagination={pagination}
          onPageChange={onPageChange}
          onOpenRoleModal={onOpenRoleModal}
          onOpenSuspendModal={onOpenSuspendModal}
          onOpenDeleteModal={onOpenDeleteModal}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
