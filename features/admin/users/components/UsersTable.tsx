import { Eye, Pencil, Power, PowerOff, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { TableWidget } from "@/components/ui/table-widget";
import { TableRowActions } from "@/components/ui/table-row-actions";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PagePagination } from "@/lib/types/pagination";

import type { UserRow } from "@/features/admin/users/lib/usersTypes";

type UsersTableProps = {
  users: UserRow[];
  pagination: PagePagination;
  onEdit: (row: UserRow) => void;
  onToggleActive: (row: UserRow) => void;
  onDelete: (row: UserRow) => void;
  busyId: string | null;
};

function buildActions(
  user: UserRow,
  handlers: Pick<UsersTableProps, "onEdit" | "onToggleActive" | "onDelete">,
) {
  return {
    primary: {
      key: "view",
      label: "Lihat detail",
      icon: <Eye className="h-4 w-4" />,
      href: `/admin/users/detail?id=${encodeURIComponent(user.id)}`,
    },
    actions: [
      {
        key: "edit",
        label: "Edit user",
        icon: <Pencil className="h-4 w-4" />,
        onSelect: () => handlers.onEdit(user),
      },
      {
        key: "toggle",
        label: user.isActive ? "Suspend" : "Aktifkan",
        tone: (user.isActive ? "warning" : "success") as "warning" | "success",
        icon: user.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />,
        onSelect: () => handlers.onToggleActive(user),
      },
      {
        key: "delete",
        label: "Hapus",
        tone: "danger" as const,
        icon: <Trash2 className="h-4 w-4" />,
        onSelect: () => handlers.onDelete(user),
      },
    ],
  };
}

export function UsersTable({
  users,
  pagination,
  onEdit,
  onToggleActive,
  onDelete,
  busyId,
}: UsersTableProps) {
  const handlers = { onEdit, onToggleActive, onDelete };

  const paginationNode = (
    <Pagination
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      totalItems={pagination.totalItems}
      pageSize={pagination.pageSize}
      itemLabel={pagination.itemLabel}
      basePath={pagination.basePath}
    />
  );

  const tableNode = (
    <Table className="min-w-full divide-y divide-[var(--line)]">
      <TableHeader className="bg-[var(--surface-2)]/70">
        <TableRow className="hover:bg-transparent">
          <TableHead className="hidden w-16 px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] sm:table-cell sm:px-6 lg:px-8">
            No
          </TableHead>

          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] sm:px-6 lg:px-8">
            User
          </TableHead>

          <TableHead className="hidden px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] md:table-cell sm:px-6 lg:px-8">
            Profil
          </TableHead>

          <TableHead className="hidden px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] lg:table-cell lg:px-8">
            Bergabung
          </TableHead>

          <TableHead className="px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] sm:px-6 lg:px-8">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="divide-y divide-[var(--line)] bg-[var(--surface)]">
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="group transition-colors hover:bg-[var(--role-accent-soft)]/50"
          >
            <TableCell className="hidden whitespace-nowrap px-4 py-3 text-sm font-medium text-[var(--ink-muted)] tabular-nums sm:table-cell sm:px-6 lg:px-8">
              {user.no}
            </TableCell>

            <TableCell className="px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={user.username}
                  src={user.avatarUrl}
                  status={user.isActive ? "active" : "inactive"}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--role-accent-strong)]">
                    {user.username}
                  </p>
                  <p className="truncate text-xs text-[var(--ink-muted)]">
                    {user.email}
                    {!user.isActive ? (
                      <span className="font-semibold text-[var(--warning-fg)]"> · Nonaktif</span>
                    ) : null}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="hidden whitespace-nowrap px-4 py-3 sm:px-6 md:table-cell lg:px-8">
              <p className="text-sm font-medium text-[var(--ink-soft)]">
                {user.gender === "-" ? "Belum diisi" : user.gender}
              </p>
              <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                {user.age === "-" ? "-" : `${user.age} tahun`}
              </p>
            </TableCell>

            <TableCell className="hidden whitespace-nowrap px-4 py-3 lg:table-cell lg:px-8">
              <p className="text-sm font-medium text-[var(--ink-soft)] tabular-nums">
                {user.join}
              </p>
              <p className="mt-0.5 text-xs text-[var(--ink-muted)]">Pengguna terdaftar</p>
            </TableCell>

            <TableCell className="whitespace-nowrap px-4 py-3 text-right sm:px-6 lg:px-8">
              <TableRowActions
                {...buildActions(user, handlers)}
                busy={busyId === user.id}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const cardsNode = (
    <div className="divide-y divide-[var(--line)] bg-[var(--surface)]">
      {users.map((user) => (
        <div key={user.id} className="flex items-start gap-3 p-4">
          <UserAvatar
            name={user.username}
            src={user.avatarUrl}
            status={user.isActive ? "active" : "inactive"}
          />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm font-bold text-[var(--ink)]">
              {user.username}
            </p>
            <p className="truncate text-xs text-[var(--ink-muted)]">
              {user.email}
              {!user.isActive ? (
                <span className="font-semibold text-[var(--warning-fg)]"> · Nonaktif</span>
              ) : null}
            </p>
            <p className="text-xs text-[var(--ink-muted)]">
              {user.gender === "-" ? "Belum diisi" : user.gender}
              {user.age !== "-" ? ` · ${user.age} tahun` : ""} · {user.join}
            </p>
          </div>

          <TableRowActions
            {...buildActions(user, handlers)}
            busy={busyId === user.id}
          />
        </div>
      ))}
    </div>
  );

  return (
    <TableWidget
      table={tableNode}
      cards={users.length > 0 ? cardsNode : undefined}
      empty={
        users.length === 0 ? (
          <EmptyState
            title="Belum ada data user"
            description="User terdaftar akan tampil di sini setelah mereka mendaftar, atau ubah kata kunci pencarian."
          />
        ) : undefined
      }
      footer={paginationNode}
    />
  );
}