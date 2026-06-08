import { Card } from "@/components/ui/card";

import type { DoctorVerificationDetail } from "../lib/verification-detail-types";
import { InfoBox } from "./info-box";

type VerificationContactCardProps = {
  doctor: DoctorVerificationDetail;
};

export function VerificationContactCard({
  doctor,
}: VerificationContactCardProps) {
  return (
    <Card className='overflow-hidden rounded-3xl border border-gray-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
      <div className='border-b border-gray-100 px-6 py-4'>
        <h3 className='text-base font-semibold text-gray-900'>
          Informasi Kontak
        </h3>
        <p className='mt-0.5 text-sm text-gray-400'>
          Kontak dan lokasi dokter yang mengajukan verifikasi.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 p-6 sm:grid-cols-2'>
        <InfoBox label='Email' value={doctor.email} />
        <InfoBox label='No. Telepon' value={doctor.phone} />
        <InfoBox
          label='Domisili'
          value={doctor.address}
          className='sm:col-span-2'
        />
      </div>
    </Card>
  );
}
