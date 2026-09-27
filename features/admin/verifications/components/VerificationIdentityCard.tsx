import { Mail } from "lucide-react";

import { Card } from "@/components/ui/card";
import { InfoBox } from "@/components/ui/info-box";
import { UserAvatar } from "@/components/ui/user-avatar";

import type { DoctorVerificationDetail } from "@/features/admin/verifications/lib/verificationDetailTypes";

type VerificationIdentityCardProps = {
  doctor: DoctorVerificationDetail;
};

export function VerificationIdentityCard({
  doctor,
}: VerificationIdentityCardProps) {
  return (
    <Card>
      <div className='border-b border-[var(--line)] px-6 py-4'>
        <h3 className='font-heading text-base font-semibold text-[var(--ink)]'>
          Identitas Dokter
        </h3>
        <p className='mt-0.5 text-sm text-[var(--ink-muted)]'>
          Nama, STR, dan waktu pengajuan.
        </p>
      </div>

      <div className='space-y-5 p-6'>
        <div className='flex items-center gap-4'>
          <UserAvatar
            name={doctor.name}
            src={doctor.avatarUrl}
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

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='rounded-[var(--radius-control)] bg-[var(--surface-2)] p-3.5'>
            <p className='mb-1 text-xs text-[var(--ink-muted)]'>
              Nomor STR / Identitas
            </p>
            <p className='font-mono text-sm font-semibold text-[var(--ink)]'>
              {doctor.identity}
            </p>
          </div>
          <InfoBox label='Spesialisasi' value={doctor.specialization} />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <InfoBox label='Tanggal Pengajuan' value={doctor.submittedAt} />
          <InfoBox
            label='Terakhir Ditinjau'
            value={doctor.reviewedAt ?? "Belum ditinjau"}
          />
        </div>
      </div>
    </Card>
  );
}