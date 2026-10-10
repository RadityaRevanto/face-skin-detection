"use client";

import { FilterX, Search, X } from "lucide-react";

type ActivityLogEmptyStateProps = {
  onResetFilters: () => void;
};

export function ActivityLogEmptyState({
  onResetFilters,
}: ActivityLogEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-surface">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-3xl bg-surface-alt flex items-center justify-center text-ink-subtle shadow-inner">
          <Search className="w-10 h-10 text-ink-subtle" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-danger/10 text-danger flex items-center justify-center ring-4 ring-surface shadow-sm">
          <X className="w-4 h-4" />
        </div>
      </div>

      <span className="font-eyebrow text-eyebrow text-role-accent-admin uppercase tracking-wider mb-1 font-semibold">
        HASIL PENELUSURAN KOSONG
      </span>
      <h3 className="font-headline-md text-headline-md text-ink font-semibold">
        Tidak Ada Jejak Audit Ditemukan
      </h3>
      <p className="font-body-default text-body-default text-ink-muted max-w-md mt-1 mb-6">
        Tidak ditemukan log aktivitas yang sesuai dengan kriteria filter yang Anda tentukan. Coba ganti kata kunci pencarian, ubah jenis aksi log, atau pilih rentang tanggal yang berbeda.
      </p>

      <button
        type="button"
        onClick={onResetFilters}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-role-accent-admin text-surface hover:bg-role-accent-admin/90 font-body-default text-body-default font-semibold shadow-sm transition-all cursor-pointer"
      >
        <FilterX className="w-4 h-4" />
        <span>Bersihkan Semua Filter</span>
      </button>
    </div>
  );
}
