"use client";

import { UserX, ChevronLeft, ChevronRight } from "lucide-react";
import type { AdminUser } from "@/features/admin/services/adminService";
import type { PagePagination } from "@/lib/types/pagination";
import { UserTableRow } from "./UserTableRow";

type UsersTableProps = {
  users: AdminUser[];
  currentUserUuid?: string;
  currentUserEmail?: string;
  pagination: PagePagination;
  onPageChange: (page: number) => void;
  onOpenRoleModal: (user: AdminUser) => void;
  onOpenSuspendModal: (user: AdminUser) => void;
  onOpenDeleteModal: (user: AdminUser) => void;
  isLoading?: boolean;
};

export function UsersTable({
  users,
  currentUserUuid,
  currentUserEmail,
  pagination,
  onPageChange,
  onOpenRoleModal,
  onOpenSuspendModal,
  onOpenDeleteModal,
  isLoading,
}: UsersTableProps) {
  const { currentPage, totalPages, totalItems, pageSize } = pagination;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {/* Sticky Light Gray Header matching index2.html */}
        <thead className="bg-surface-container sticky top-0 z-10 shadow-sm">
          <tr className="h-12 text-ink-muted font-caption text-caption uppercase tracking-wider">
            <th className="py-3 px-4 font-semibold">Pengguna</th>
            <th className="py-3 px-4 font-semibold">Email</th>
            <th className="py-3 px-4 font-semibold">Role</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Tanggal Daftar</th>
            <th className="py-3 px-4 text-right font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 font-body-default text-body-default">
          {users.map((user) => {
            const isCurrentUser = Boolean(
              (currentUserUuid && user.uuid === currentUserUuid) ||
                (currentUserEmail && user.email === currentUserEmail)
            );

            return (
              <UserTableRow
                key={user.uuid || user.id}
                user={user}
                isCurrentUser={isCurrentUser}
                onOpenRoleModal={onOpenRoleModal}
                onOpenSuspendModal={onOpenSuspendModal}
                onOpenDeleteModal={onOpenDeleteModal}
              />
            );
          })}
        </tbody>
      </table>

      {/* Empty State */}
      {!isLoading && users.length === 0 && (
        <div className="py-16 text-center bg-surface">
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mx-auto mb-3 text-ink-subtle">
            <UserX className="w-6 h-6" />
          </div>
          <h4 className="font-headline-sm text-headline-sm text-ink font-semibold">
            Tidak ada pengguna ditemukan
          </h4>
          <p className="font-body-default text-caption text-ink-muted mt-1 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau reset filter role dan status.
          </p>
        </div>
      )}

      {/* Pagination Footer matching index2.html */}
      <div className="p-4 bg-surface-alt border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 font-caption text-caption text-ink-muted">
          <span>Menampilkan</span>
          <strong className="text-ink font-semibold">{startItem}-{endItem}</strong>
          <span>dari</span>
          <strong className="text-ink font-semibold">{totalItems.toLocaleString("id-ID")}</strong>
          <span>pengguna</span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-xl flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface-container transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-xl flex items-center justify-center font-caption text-caption font-semibold transition-all shadow-sm cursor-pointer ${
                    isActive
                      ? "bg-role-accent-admin text-surface"
                      : "bg-surface hover:bg-surface-container text-ink border border-border/50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-xl flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface-container transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
