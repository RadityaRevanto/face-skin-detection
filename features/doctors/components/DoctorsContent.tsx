import { Pagination } from "@/components/ui/pagination";

import type { DoctorsPageData } from "../types";
import { DoctorList } from "./DoctorList";

type DoctorsContentProps = DoctorsPageData;

export function DoctorsContent({ doctors, pagination }: DoctorsContentProps) {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Konsultasi Dokter
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pilih dokter spesialis untuk memulai konsultasi, atau ngobrol dengan
          asisten AI Aura Skin.
        </p>
      </div>

      <DoctorList doctors={doctors} />

      {pagination.totalItems > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          itemLabel={pagination.itemLabel}
          basePath={pagination.basePath}
        />
      )}
    </div>
  );
}
