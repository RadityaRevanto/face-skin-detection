"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type DoctorNotificationsPaginationProps = {
  currentPage: number;
  lastPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
};

export function DoctorNotificationsPagination({
  currentPage,
  lastPage,
  isLoading,
  onPageChange,
}: DoctorNotificationsPaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="p-4 bg-surface-alt/40 border-t border-border/50 flex items-center justify-between">
      <span className="font-caption text-caption text-ink-muted">
        Halaman {currentPage} dari {lastPage}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isLoading}
          className="h-9 px-3 rounded-xl bg-surface border border-border/60 text-ink font-caption text-caption font-semibold flex items-center gap-1 hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(lastPage, currentPage + 1))}
          disabled={currentPage === lastPage || isLoading}
          className="h-9 px-3 rounded-xl bg-surface border border-border/60 text-ink font-caption text-caption font-semibold flex items-center gap-1 hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <span>Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
