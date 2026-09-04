import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { TableWidget } from "@/components/ui/table-widget";
import type { PagePagination } from "@/lib/types/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { UserRow } from "@/features/admin/users/lib/usersTypes";
import { UserActionIcon } from "./UserActionIcon";

type UsersTableProps = {
  users: UserRow[];
  pagination: PagePagination;
};

export function UsersTable({ users, pagination }: UsersTableProps) {
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
    <Table className="min-w-full divide-y divide-slate-100">
      <TableHeader className="bg-slate-50/80">
        <TableRow className="hover:bg-transparent">
          <TableHead className="hidden w-16 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:table-cell sm:px-6 lg:px-8">
            No
          </TableHead>

          <TableHead className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-6 lg:px-8">
            Username
          </TableHead>

          <TableHead className="hidden px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 md:table-cell sm:px-6 lg:px-8">
            Email
          </TableHead>

          <TableHead className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-6 lg:px-8">
            Profil
          </TableHead>

          <TableHead className="hidden px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500 lg:table-cell lg:px-8">
            Join
          </TableHead>

          <TableHead className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-6 lg:px-8">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="divide-y divide-slate-100 bg-white">
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="group border-slate-100 transition-colors hover:bg-emerald-50/30"
          >
            <TableCell className="hidden whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-500 sm:table-cell sm:px-6 lg:px-8">
              {user.no}
            </TableCell>

            <TableCell className="whitespace-nowrap px-4 py-4 sm:px-6 lg:px-8">
              <p className="text-sm font-medium text-slate-700 transition-colors group-hover:text-emerald-700">
                {user.username}
              </p>
              <p className="mt-0.5 text-xs text-slate-400 md:hidden">
                {user.email}
              </p>
            </TableCell>

            <TableCell className="hidden whitespace-nowrap px-4 py-4 text-sm text-slate-500 md:table-cell sm:px-6 lg:px-8">
              {user.email}
            </TableCell>

            <TableCell className="whitespace-nowrap px-4 py-4 sm:px-6 lg:px-8">
              <p className="text-sm font-medium text-slate-700">
                {user.gender === "-" ? "Belum diisi" : user.gender}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {user.age === "-" ? "-" : `${user.age} tahun`}
              </p>
            </TableCell>

            <TableCell className="hidden whitespace-nowrap px-4 py-4 lg:table-cell lg:px-8">
              <p className="text-sm font-medium text-slate-700">
                {user.join}
              </p>
              <p className="mt-1 text-xs font-normal text-slate-500">
                Registered user
              </p>
            </TableCell>

            <TableCell className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium sm:px-6 lg:px-8">
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin/users/detail?id=${encodeURIComponent(user.id)}`}
                  title="View"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl p-0 text-slate-400 transition-all duration-200 hover:bg-sky-50! hover:text-sky-700"
                >
                  <UserActionIcon type="view" />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Mobile card list (§4.2 §5.2) — username bold, meta gender/umur, email, View kanan-atas.
  const cardsNode = (
    <div className="divide-y divide-slate-100 bg-white">
      {users.map((user) => (
        <div key={user.id} className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm font-bold text-slate-900">
              {user.username}
            </p>
            <p className="text-xs text-slate-500">
              {user.gender === "-" ? "Belum diisi" : user.gender}
              {user.age !== "-" ? ` · ${user.age} tahun` : ""}
            </p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>

          <Link
            href={`/admin/users/detail?id=${encodeURIComponent(user.id)}`}
            title="View"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-sky-50! hover:text-sky-700"
          >
            <UserActionIcon type="view" />
          </Link>
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
            description="User terdaftar akan tampil di sini setelah mereka mendaftar."
          />
        ) : undefined
      }
      footer={paginationNode}
    />
  );
}
