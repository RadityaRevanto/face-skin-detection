import Link from "next/link";

import type { UserDetail } from "../lib/user-detail-types";
import { UserIdentityCard } from "./user-identity-card";

type UserDetailContentProps = {
  user: UserDetail;
};

export function UserDetailContent({ user }: UserDetailContentProps) {
  return (
    <div className='w-full space-y-6'>
      <div>
        <Link
          href='/admin/users'
          className='text-sm font-semibold text-emerald-700 hover:text-emerald-800'
        >
          Back to user list
        </Link>

        <h1 className='mt-3 text-2xl font-bold tracking-tight text-slate-950'>
          Detail User
        </h1>

        <p className='mt-1 text-sm text-slate-500'>
          Halaman ini menampilkan detail profil user yang terdaftar.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <UserIdentityCard user={user} />
      </div>
    </div>
  );
}
