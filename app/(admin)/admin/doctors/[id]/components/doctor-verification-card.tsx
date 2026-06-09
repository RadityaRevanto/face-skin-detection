import { Card } from "@/components/ui/card";

import type { DoctorDetail } from "../lib/doctor-detail-types";
import { InfoBox } from "./info-box";
import { StatusBadge } from "./status-badge";

type DoctorVerificationCardProps = {
  doctor: DoctorDetail;
};

export function DoctorVerificationCard({
  doctor,
}: DoctorVerificationCardProps) {
  const verification = doctor.latestVerification;

  return (
    <Card className='overflow-hidden rounded-3xl border border-gray-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
      <div className='border-b border-gray-100 px-6 py-4'>
        <h3 className='text-base font-semibold text-gray-900'>
          Data Verifikasi Terakhir
        </h3>
        <p className='mt-0.5 text-sm text-gray-400'>
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

          <div className='rounded-xl bg-gray-50/80 p-3.5'>
            <p className='mb-2 text-xs text-gray-400'>Status Verifikasi</p>
            <StatusBadge status={verification.status} />
          </div>

          <div className='rounded-xl bg-gray-50/80 p-3.5'>
            <p className='mb-1 text-xs text-gray-400'>Dokumen Verifikasi</p>
            {verification.documentUrl ? (
              <a
                href={verification.documentUrl}
                target='_blank'
                rel='noreferrer'
                className='text-sm font-semibold text-emerald-700 hover:text-emerald-800'
              >
                {verification.document}
              </a>
            ) : (
              <p className='text-sm font-semibold text-gray-900'>
                {verification.document}
              </p>
            )}
          </div>

          {verification.rejectionReason ? (
            <div className='rounded-xl bg-rose-50 p-3.5 text-rose-700'>
              <p className='mb-1 text-xs font-semibold text-rose-500'>
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
          <div className='rounded-xl bg-gray-50/80 p-3.5 text-sm font-semibold text-gray-500'>
            Doctor ini belum mengajukan verifikasi.
          </div>
        </div>
      )}
    </Card>
  );
}
