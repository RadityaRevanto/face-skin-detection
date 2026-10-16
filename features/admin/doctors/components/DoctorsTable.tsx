"use client";

import {
  SearchX,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { PagePagination } from "@/lib/types/pagination";
import type { DoctorRow } from "../lib/doctorsTypes";
import { DoctorTableRow } from "./DoctorTableRow";

type DoctorsTableProps = {
  doctors: DoctorRow[];
  pagination: PagePagination;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
};

export function DoctorsTable({
  doctors,
  pagination,
  onPageChange,
  onResetFilters,
  isLoading,
}: DoctorsTableProps) {
  const { currentPage, totalPages, totalItems, pageSize } = pagination;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="bg-surface rounded-2xl shadow-sm overflow-hidden flex flex-col border border-border/50">
      {doctors.length === 0 && !isLoading ? (
        /* Empty State matching index4.html */
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-surface-container-high/60 animate-ping opacity-30" />
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center shadow-inner text-ink-subtle">
              <SearchX className="w-8 h-8 text-ink-subtle" />
            </div>
          </div>
          <h3 className="font-headline-md text-headline-md font-semibold text-ink mb-1">
            Tidak ada dokter ditemukan dengan filter ini
          </h3>
          <p className="font-body-default text-body-default text-ink-muted max-w-md mx-auto mb-6">
            Kombinasi kata kunci, status verifikasi SIP, atau status akun tidak cocok dengan data tenaga medis aktif di registri. Coba ubah kata kunci atau bersihkan filter.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onResetFilters}
              className="h-10 px-5 rounded-xl bg-role-accent-admin text-surface font-caption text-caption font-semibold flex items-center gap-2 shadow-sm hover:bg-secondary-container transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        </div>
      ) : (
        /* Table View matching index4.html */
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt text-ink-subtle uppercase font-eyebrow text-eyebrow tracking-wider border-b border-border/60">
                <th className="py-3.5 pl-6 pr-4 font-semibold">Dokter</th>
                <th className="py-3.5 px-4 font-semibold">Spesialisasi</th>
                <th className="py-3.5 px-4 font-semibold">Nomor STR</th>
                <th className="py-3.5 px-4 font-semibold">Status Verifikasi</th>
                <th className="py-3.5 px-4 font-semibold">Status Akun</th>
                <th className="py-3.5 px-4 font-semibold">Tanggal Terdaftar</th>
                <th className="py-3.5 pr-6 pl-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-0 text-body-default font-body-default text-ink">
              {doctors.map((doctor) => (
                <DoctorTableRow key={doctor.id} doctor={doctor} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer matching index4.html */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-surface-alt border-t border-border/50">
        <div className="flex items-center gap-3 text-caption font-caption text-ink-muted">
          <span>Menampilkan {startItem} - {endItem} dari {totalItems} entri</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Halaman pertama"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-xl bg-surface shadow-sm text-ink-subtle hover:text-ink disabled:opacity-40 flex items-center justify-center transition-colors border border-border/40 cursor-pointer"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Halaman sebelumnya"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-xl bg-surface shadow-sm text-ink-subtle hover:text-ink disabled:opacity-40 flex items-center justify-center transition-colors border border-border/40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] px-3 rounded-xl bg-role-accent-admin text-surface font-caption text-caption font-bold shadow-sm flex items-center justify-center">
            {currentPage}
          </span>

          <button
            type="button"
            aria-label="Halaman selanjutnya"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-xl bg-surface shadow-sm text-ink hover:bg-surface-container flex items-center justify-center transition-colors border border-border/40 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Halaman terakhir"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(totalPages)}
            className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-xl bg-surface shadow-sm text-ink hover:bg-surface-container flex items-center justify-center transition-colors border border-border/40 disabled:opacity-40 cursor-pointer"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
