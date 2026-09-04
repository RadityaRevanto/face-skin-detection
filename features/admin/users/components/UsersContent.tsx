import type { UsersPageData } from "@/features/admin/users/lib/usersTypes";
import { UsersTable } from "./UsersTable";

type UsersContentProps = UsersPageData;

export function UsersContent({ users, pagination }: UsersContentProps) {
  return (
    <div className='w-full space-y-6'>
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

      <UsersTable users={users} pagination={pagination} />
    </div>
  );
}
