import { Card } from "@/components/ui/card";

import type { UserDetail } from "@/features/admin/users/lib/userDetailTypes";
import { getInitials } from "@/features/admin/users/lib/userDetailUtils";
import { InfoBox } from "./InfoBox";

type UserIdentityCardProps = {
  user: UserDetail;
};

export function UserIdentityCard({ user }: UserIdentityCardProps) {
  return (
    <Card className='overflow-hidden rounded-3xl border border-gray-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
      <div className='border-b border-gray-100 px-6 py-4'>
        <h3 className='text-base font-semibold text-gray-900'>Profil User</h3>
        <p className='mt-0.5 text-sm text-gray-400'>
          Data akun user yang terdaftar di sistem.
        </p>
      </div>

      <div className='space-y-5 p-6'>
        <div className='flex items-center gap-4'>
          <div className='flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 text-xl font-bold text-emerald-600 shadow-sm'>
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name}
                className='h-full w-full object-cover'
              />
            ) : (
              getInitials(user.name)
            )}
          </div>

          <div>
            <h4 className='text-lg font-bold text-gray-900'>{user.name}</h4>
            <p className='text-sm text-gray-500'>{user.email}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <InfoBox label='Nama' value={user.name} />
          <InfoBox label='Email' value={user.email} />
          <InfoBox label='Role' value='User' />
          <InfoBox
            label='Status Akun'
            value={user.isActive ? "Active" : "Inactive"}
          />
          <InfoBox label='Tanggal Bergabung' value={user.createdAt} />
        </div>
      </div>
    </Card>
  );
}
