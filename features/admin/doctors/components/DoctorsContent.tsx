import type { DoctorsPageData } from "@/features/admin/doctors/lib/doctorsTypes";
import { DoctorsTable } from "./DoctorsTable";

type DoctorsContentProps = DoctorsPageData;

export function DoctorsContent({ doctors, pagination }: DoctorsContentProps) {
  return (
    <div className='w-full space-y-6'>
      <div>
        <div className='flex flex-wrap items-center gap-2'>
          <h1 className='text-2xl font-bold tracking-tight text-slate-950'>
            Verified Doctors
          </h1>
          <span className='inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600'>
            {pagination.totalItems} dokter
          </span>
        </div>
        <p className='mt-1 text-sm text-slate-500'>
          Kelola daftar dokter yang sudah lolos verifikasi dan dapat mengakses
          dashboard dokter.
        </p>
      </div>

      <DoctorsTable doctors={doctors} pagination={pagination} />
    </div>
  );
}
