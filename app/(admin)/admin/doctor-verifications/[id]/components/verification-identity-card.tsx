import { Card } from "@/components/ui/card";

import type { DoctorVerificationDetail } from "../lib/verification-detail-types";
import { getInitials } from "../lib/verification-detail-utils";
import { InfoBox } from "./info-box";

type VerificationIdentityCardProps = {
  doctor: DoctorVerificationDetail;
};

export function VerificationIdentityCard({
  doctor,
}: VerificationIdentityCardProps) {
  return (
    <Card className='overflow-hidden rounded-3xl border border-gray-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
      <div className='border-b border-gray-100 px-6 py-4'>
        <h3 className='text-base font-semibold text-gray-900'>
          Identitas Dokter
        </h3>
        <p className='mt-0.5 text-sm text-gray-400'>
          Nama, email, STR, dan informasi umum dokter.
        </p>
      </div>

      <div className='space-y-5 p-6'>
        <div className='flex items-center gap-4'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-xl font-bold text-emerald-600 shadow-sm'>
            {getInitials(doctor.name)}
          </div>

          <div>
            <h4 className='text-lg font-bold text-gray-900'>{doctor.name}</h4>
            <p className='text-sm text-gray-500'>{doctor.email}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <InfoBox label='Nomor STR / Identitas' value={doctor.identity} />
          <InfoBox label='Spesialisasi' value={doctor.specialization} />
        </div>

        <InfoBox label='Dokumen Verifikasi' value={doctor.document} />

        <InfoBox label='Tanggal Pengajuan' value={doctor.submittedAt} />
      </div>
    </Card>
  );
}
