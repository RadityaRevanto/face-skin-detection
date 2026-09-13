import type { UsersPageData, UserRow } from "@/features/admin/users/lib/usersTypes";
import { UsersTable } from "./UsersTable";

type UsersContentProps = UsersPageData & {
  onCreate: () => void;
  onEdit: (row: UserRow) => void;
  onToggleActive: (row: UserRow) => void;
  onDelete: (row: UserRow) => void;
  busyId: string | null;
};

export function UsersContent({
  users,
  pagination,
  onCreate,
  onEdit,
  onToggleActive,
  onDelete,
  busyId,
}: UsersContentProps) {
  return (
    <div className='w-full space-y-6'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-2xl font-bold tracking-tight text-slate-950'>
              Users
            </h1>
            <span className='inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600'>
              {pagination.totalItems} user
            </span>
          </div>
          <p className='mt-1 text-sm text-slate-500'>
            Daftar user biasa yang terdaftar di sistem Face Skincek.
          </p>
        </div>

        <button
          type='button'
          onClick={onCreate}
          className='inline-flex h-10 items-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-700'
        >
          Tambah User
        </button>
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
