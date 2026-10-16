import { Mail } from "lucide-react";

import { Card } from "@/components/ui/card";
import { InfoBox } from "@/components/ui/info-box";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { UserAvatar } from "@/components/ui/user-avatar";

import type { DoctorDetail } from "@/features/admin/doctors/lib/doctorDetailTypes";

type DoctorIdentityCardProps = {
  doctor: DoctorDetail;
};

export function DoctorIdentityCard({ doctor }: DoctorIdentityCardProps) {
  return (
    <Card>
      <div className='border-b border-[var(--line)] px-6 py-4'>
        <h3 className='font-heading text-base font-semibold text-[var(--ink)]'>
          Profil Dokter
        </h3>
        <p className='mt-0.5 text-sm text-[var(--ink-muted)]'>
          Data akun doctor yang terdaftar di sistem.
        </p>
      </div>

      <div className='space-y-5 p-6'>
        <div className='flex items-center gap-4'>
          <UserAvatar
            name={doctor.name}
            src={doctor.avatarUrl}
            status={doctor.isActive ? "active" : "inactive"}
            className='!h-16 !w-16 !text-lg'
          />

          <div className='min-w-0'>
            <h4 className='truncate text-lg font-bold text-[var(--ink)]'>
              {doctor.name}
            </h4>
            <p className='flex min-w-0 items-center gap-1.5 text-sm text-[var(--ink-muted)]'>
              <Mail className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
              <span className='truncate'>{doctor.email}</span>
            </p>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          <StatusBadge status={doctor.role ?? "doctor"} variant="info" />
          <StatusBadge
            status={doctor.isActive ? "Active" : "Inactive"}
            variant={doctor.isActive ? "approved" : "rejected"}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <InfoBox label='Tanggal Bergabung' value={doctor.joinedAt} />
          <InfoBox
            label='Status Verifikasi'
            value={doctor.latestVerification?.status ?? "Belum Diajukan"}
          />
        </div>
      </div>
    </Card>
  );
}