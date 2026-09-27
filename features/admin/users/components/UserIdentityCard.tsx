import { Mail } from "lucide-react";

import { Card } from "@/components/ui/card";
import { InfoBox } from "@/components/ui/info-box";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { UserAvatar } from "@/components/ui/user-avatar";

import type { UserDetail } from "@/features/admin/users/lib/userDetailTypes";

type UserIdentityCardProps = {
  user: UserDetail;
};

function formatGender(gender?: string | null): string {
  if (!gender) return "Belum diisi";
  if (gender === "laki_laki") return "Laki-laki";
  if (gender === "perempuan") return "Perempuan";
  return gender;
}

export function UserIdentityCard({ user }: UserIdentityCardProps) {
  return (
    <Card>
      <div className='border-b border-[var(--line)] px-6 py-4'>
        <h3 className='font-heading text-base font-semibold text-[var(--ink)]'>
          Profil User
        </h3>
        <p className='mt-0.5 text-sm text-[var(--ink-muted)]'>
          Data akun user yang terdaftar di sistem.
        </p>
      </div>

      <div className='space-y-5 p-6'>
        <div className='flex items-center gap-4'>
          <UserAvatar
            name={user.name}
            src={user.avatarUrl}
            status={user.isActive ? "active" : "inactive"}
            className='!h-16 !w-16 !text-lg'
          />

          <div className='min-w-0'>
            <h4 className='truncate text-lg font-bold text-[var(--ink)]'>
              {user.name}
            </h4>
            <p className='flex min-w-0 items-center gap-1.5 text-sm text-[var(--ink-muted)]'>
              <Mail className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
              <span className='truncate'>{user.email}</span>
            </p>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          <StatusBadge status="User" variant="info" />
          <StatusBadge
            status={user.isActive ? "Active" : "Inactive"}
            variant={user.isActive ? "approved" : "rejected"}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <InfoBox label='Gender' value={formatGender(user.gender)} />
          <InfoBox
            label='Umur'
            value={user.age != null ? `${user.age} tahun` : "-"}
          />
          <InfoBox label='Bergabung' value={user.createdAt} />
        </div>
      </div>
    </Card>
  );
}