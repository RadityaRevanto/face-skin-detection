import type { UsersPageData } from "../lib/users-types";
import { UsersTable } from "./users-table";

type UsersContentProps = UsersPageData;

export function UsersContent({ users, pagination }: UsersContentProps) {
  return (
    <div className='w-full space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-slate-950'>
          Users
        </h1>
        <p className='mt-1 text-sm text-slate-500'>
          Daftar user biasa yang terdaftar di sistem Face Skin Detection.
        </p>
      </div>

      <UsersTable users={users} pagination={pagination} />
    </div>
  );
}
