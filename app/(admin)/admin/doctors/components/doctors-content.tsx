import type { DoctorsPageData } from "../lib/doctors-types";
import { DoctorsTable } from "./doctors-table";

type DoctorsContentProps = DoctorsPageData;

export function DoctorsContent({ doctors, pagination }: DoctorsContentProps) {
  return (
    <div className='w-full space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-slate-950'>
          Verified Doctors
        </h1>
        <p className='mt-1 text-sm text-slate-500'>
          Kelola daftar dokter yang sudah lolos verifikasi dan dapat mengakses
          dashboard dokter.
        </p>
      </div>

      <DoctorsTable doctors={doctors} pagination={pagination} />
    </div>
  );
}
