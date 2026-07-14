import Link from "next/link";

import type { DoctorDetail } from "../lib/doctor-detail-types";
import { DoctorIdentityCard } from "./doctor-identity-card";
import { DoctorVerificationCard } from "./doctor-verification-card";

type DoctorDetailContentProps = {
  doctor: DoctorDetail;
};

export function DoctorDetailContent({ doctor }: DoctorDetailContentProps) {
  return (
    <div className='w-full space-y-6'>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
        <div>
          <Link
            href='/admin/doctors'
            className='text-sm font-semibold text-emerald-700 hover:text-emerald-800'
          >
            Back to doctor list
          </Link>

          <h1 className='mt-3 text-2xl font-bold tracking-tight text-slate-950'>
            Detail Profil Dokter
          </h1>

          <p className='mt-1 text-sm text-slate-500'>
            Halaman ini hanya menampilkan data profile doctor dan status
            verifikasi terakhir.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <DoctorIdentityCard doctor={doctor} />
        <DoctorVerificationCard doctor={doctor} />
      </div>
    </div>
  );
}
