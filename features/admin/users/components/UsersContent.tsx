import { Search, UserPlus, X } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import type { UserRow, UsersPageData } from "@/features/admin/users/lib/usersTypes";
import { UsersTable } from "./UsersTable";

type UsersContentProps = UsersPageData & {
  search: string;
  onSearchChange: (value: string) => void;
  isFetching: boolean;
  hasActiveFilter: boolean;
  onClearFilter: () => void;
  onCreate: () => void;
  onEdit: (row: UserRow) => void;
  onToggleActive: (row: UserRow) => void;
  onDelete: (row: UserRow) => void;
  busyId: string | null;
};

export function UsersContent({
  users,
  pagination,
  search,
  onSearchChange,
  isFetching,
  hasActiveFilter,
  onClearFilter,
  onCreate,
  onEdit,
  onToggleActive,
  onDelete,
  busyId,
}: UsersContentProps) {
  return (
    <div className="w-full space-y-5">
      <PageHeader
        eyebrow="Manajemen Akun"
        title="Users"
        titleSuffix={
          <span className="inline-flex items-center rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 text-xs font-bold text-[var(--ink-soft)] tabular-nums">
            {pagination.totalItems} user
          </span>
        }
        description="Daftar user biasa yang terdaftar di sistem SkinCek."
        action={
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] bg-[var(--cta)] px-4 text-sm font-bold text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-[var(--cta-hover)]"
          >
            <UserPlus className="h-4 w-4" />
            Tambah User
          </button>
        }
      />

      {/* Toolbar pencarian */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama atau email…"
            aria-label="Cari user"
            className="h-10 w-full rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--surface)] pl-9 pr-9 text-sm text-[var(--ink)] shadow-sm transition-colors outline-none placeholder:text-[var(--ink-muted)] focus:border-[var(--role-accent)] focus:ring-2 focus:ring-[var(--role-accent-soft)]"
          />
          {isFetching ? (
            <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-[var(--line-strong)] border-t-[var(--role-accent)]" />
          ) : null}
        </div>

        {hasActiveFilter ? (
          <button
            type="button"
            onClick={onClearFilter}
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--ink-soft)] transition-colors hover:bg-[var(--surface-2)]"
          >
            <X className="h-3.5 w-3.5" />
            Reset
          </button>
        ) : null}
      </div>

      <UsersTable
        users={users}
        pagination={pagination}
        onEdit={onEdit}
        onToggleActive={onToggleActive}
        onDelete={onDelete}
        busyId={busyId}
      />
    </div>
  );
}