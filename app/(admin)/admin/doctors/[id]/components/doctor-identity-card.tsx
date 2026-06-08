import { Card } from "@/components/ui/card";

import type { DoctorDetail } from "../lib/doctor-detail-types";
import { getInitials } from "../lib/doctor-detail-utils";
import { InfoBox } from "./info-box";
import { StatusBadge } from "./status-badge";

type DoctorIdentityCardProps = {
  doctor: DoctorDetail;
};

export function DoctorIdentityCard({ doctor }: DoctorIdentityCardProps) {
  return (
    <Card className='overflow-hidden rounded-3xl border border-gray-100! bg-white! text-slate-950! shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:border-gray-100! dark:bg-white! dark:text-slate-950!'>
      <div className='border-b border-gray-100 px-6 py-4'>
        <h3 className='text-base font-semibold text-gray-900'>Profil Dokter</h3>
        <p className='mt-0.5 text-sm text-gray-400'>
          Data akun doctor yang terdaftar di sistem.
        </p>
      </div>

      <div className='space-y-5 p-6'>
        <div className='flex items-center gap-4'>
          <div className='flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 text-xl font-bold text-emerald-600 shadow-sm'>
            {doctor.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className='h-full w-full object-cover'
              />
            ) : (
              getInitials(doctor.name)
            )}
          </div>

          <div>
            <h4 className='text-lg font-bold text-gray-900'>{doctor.name}</h4>
            <p className='text-sm text-gray-500'>{doctor.email}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <InfoBox label='Role' value='Doctor' />
          <InfoBox
            label='Status Akun'
            value={doctor.isActive ? "Active" : "Inactive"}
          />
          <InfoBox label='Tanggal Bergabung' value={doctor.joinedAt} />
          <div className='rounded-xl bg-gray-50/80 p-3.5'>
            <p className='mb-1 text-xs text-gray-400'>Status Verifikasi</p>
            <StatusBadge
              status={doctor.latestVerification?.status ?? "Not Submitted"}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
