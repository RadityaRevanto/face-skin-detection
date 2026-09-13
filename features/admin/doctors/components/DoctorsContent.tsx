import type { DoctorsPageData, DoctorRow } from "@/features/admin/doctors/lib/doctorsTypes";
import { DoctorsTable } from "./DoctorsTable";

type DoctorsContentProps = DoctorsPageData & {
  onCreate: () => void;
  onEdit: (row: DoctorRow) => void;
  onToggleActive: (row: DoctorRow) => void;
  onDelete: (row: DoctorRow) => void;
  busyId: string | null;
};

export function DoctorsContent({
  doctors,
  pagination,
  onCreate,
  onEdit,
  onToggleActive,
  onDelete,
  busyId,
}: DoctorsContentProps) {
  return (
    <div className='w-full space-y-6'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
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

        <button
          type='button'
          onClick={onCreate}
          className='inline-flex h-10 items-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-700'
        >
          Tambah Dokter
        </button>
      </div>

      <DoctorsTable
        doctors={doctors}
        pagination={pagination}
        onEdit={onEdit}
        onToggleActive={onToggleActive}
        onDelete={onDelete}
        busyId={busyId}
      />
    </div>
  );
}
