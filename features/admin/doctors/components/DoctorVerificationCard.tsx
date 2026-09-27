import { Card } from "@/components/ui/card";

import type { DoctorDetail } from "@/features/admin/doctors/lib/doctorDetailTypes";
import { InfoBox } from "@/components/ui/info-box";
import { StatusBadge } from "@/features/admin/components/StatusBadge";

type DoctorVerificationCardProps = {
  doctor: DoctorDetail;
};

export function DoctorVerificationCard({
  doctor,
}: DoctorVerificationCardProps) {
  const verification = doctor.latestVerification;

  return (
    <Card>
      <div className='border-b border-[var(--line)] px-6 py-4'>
        <h3 className='font-heading text-base font-semibold text-[var(--ink)]'>
          Data Verifikasi Terakhir
        </h3>
        <p className='mt-0.5 text-sm text-[var(--ink-muted)]'>
          Informasi pengajuan verifikasi terakhir dari doctor.
        </p>
      </div>

      {verification ? (
        <div className='space-y-5 p-6'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <InfoBox
              label='Nomor STR / Identitas'
              value={verification.identity}
            />
            <InfoBox label='Spesialisasi' value={verification.specialization} />
            <InfoBox
              label='Tanggal Pengajuan'
              value={verification.submittedAt}
            />
            <InfoBox label='Tanggal Review' value={verification.reviewedAt} />
          </div>

          <div className='rounded-[var(--radius-control)] bg-[var(--surface-2)] p-3.5'>
            <p className='mb-2 text-xs text-[var(--ink-muted)]'>Status Verifikasi</p>
            <StatusBadge status={verification.status} />
          </div>

          <div className='rounded-[var(--radius-control)] bg-[var(--surface-2)] p-3.5'>
            <p className='mb-1 text-xs text-[var(--ink-muted)]'>Dokumen Verifikasi</p>
            {verification.documents.length > 0 ? (
              <div className='space-y-1'>
                {verification.documents.map((doc) => (
                  <a
                    key={doc.uuid}
                    href={doc.url}
                    target='_blank'
                    rel='noreferrer'
                    className='block text-sm font-semibold text-[var(--role-accent-strong)] hover:text-[var(--role-accent)]'
                  >
                    {doc.file_name ?? "Dokumen"}
                  </a>
                ))}
              </div>
            ) : (
              <p className='text-sm font-semibold text-[var(--ink)]'>
                Tanpa dokumen
              </p>
            )}
          </div>

          {verification.rejectionReason ? (
            <div className='rounded-[var(--radius-control)] bg-[var(--destructive-bg)] p-3.5 text-[var(--destructive-fg)]'>
              <p className='mb-1 text-xs font-semibold text-[var(--destructive-fg)]'>
                Alasan Penolakan
              </p>
              <p className='text-sm font-semibold leading-6'>
                {verification.rejectionReason}
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className='p-6'>
          <div className='rounded-[var(--radius-control)] bg-[var(--surface-2)] p-3.5 text-sm font-semibold text-[var(--ink-muted)]'>
            Doctor ini belum mengajukan verifikasi.
          </div>
        </div>
      )}
    </Card>
  );
}
