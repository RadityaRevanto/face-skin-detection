"use client";

import { CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { PagePagination } from "@/lib/types/pagination";
import type {
  DoctorVerificationPageType,
  DoctorVerificationRequest,
} from "../lib/doctorVerificationTypes";
import { VerificationTableRow } from "./VerificationTableRow";

type DoctorVerificationTableProps = {
  activeTab: DoctorVerificationPageType;
  verificationRequests: DoctorVerificationRequest[];
  pagination: PagePagination;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

export function DoctorVerificationTable({
  activeTab,
  verificationRequests,
  pagination,
  onPageChange,
  isLoading,
}: DoctorVerificationTableProps) {
  const { currentPage, totalPages, totalItems, pageSize } = pagination;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (verificationRequests.length === 0 && !isLoading) {
    return (
      <div className="bg-surface rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center border border-border/50">
        <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <span className="font-eyebrow text-eyebrow text-success uppercase tracking-wider font-semibold">
          ANTREAN SELESAI
        </span>
        <h3 className="font-headline-md text-headline-md text-ink font-semibold mt-1">
          Semua antrean verifikasi telah ditinjau!
        </h3>
        <p className="font-body-default text-body-default text-ink-muted max-w-md mt-2">
          Tidak ada berkas pada kategori ini saat ini. Notifikasi akan dikirimkan otomatis ketika ada dokter baru yang mengajukan izin praktik klinis.
        </p>
      </div>
    );
  }

  const dynamicColHeader =
    activeTab === "pending"
      ? "Tanggal Pengajuan"
      : activeTab === "needs_revision"
        ? "Catatan Revisi"
        : "Alasan Penolakan";

  return (
    <div className="bg-surface rounded-2xl shadow-sm overflow-hidden flex flex-col border border-border/50">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-alt text-ink-subtle font-caption text-caption uppercase tracking-wider border-b border-border/60">
              <th className="py-3.5 pl-6 pr-4 font-semibold">Pemohon</th>
              <th className="py-3.5 px-4 font-semibold">Email</th>
              <th className="py-3.5 px-4 font-semibold">Nomor STR</th>
              <th className="py-3.5 px-4 font-semibold">Spesialisasi</th>
              <th className="py-3.5 px-4 font-semibold">{dynamicColHeader}</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 pr-6 pl-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y-0 text-ink font-body-default text-body-default">
            {verificationRequests.map((req) => (
              <VerificationTableRow
                key={req.id}
                request={req}
                activeTab={activeTab}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-surface-alt border-t border-border/50">
        <div className="flex items-center gap-2 font-caption text-caption text-ink-muted">
          <span>Menampilkan</span>
          <span className="font-semibold text-ink">{startItem} - {endItem}</span>
          <span>dari</span>
          <span className="font-semibold text-ink">{totalItems}</span>
          <span>pemohon</span>
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
