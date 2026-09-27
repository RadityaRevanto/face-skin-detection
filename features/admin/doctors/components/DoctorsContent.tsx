import { UserPlus } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
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
    <div className="w-full space-y-5">
      <PageHeader
        eyebrow="Manajemen Dokter"
        title="Dokter Terverifikasi"
        titleSuffix={
          <span className="inline-flex items-center rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 text-xs font-bold text-[var(--ink-soft)] tabular-nums">
            {pagination.totalItems} dokter
          </span>
        }
        description="Dokter yang sudah lolos verifikasi dan dapat mengakses dashboard dokter."
        action={
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] bg-[var(--cta)] px-4 text-sm font-bold text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-[var(--cta-hover)]"
          >
            <UserPlus className="h-4 w-4" />
            Tambah Dokter
          </button>
        }
      />

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