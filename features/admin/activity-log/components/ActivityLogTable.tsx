"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { ActivityLogItemData } from "../lib/activityLogTypes";
import type { PagePagination } from "@/lib/types/pagination";
import { ActivityLogRow } from "./ActivityLogRow";
import { ActivityLogEmptyState } from "./ActivityLogEmptyState";

type ActivityLogTableProps = {
  logs: ActivityLogItemData[];
  pagination: PagePagination;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
};

export function ActivityLogTable({
  logs,
  pagination,
  onPageChange,
  onResetFilters,
  isLoading,
}: ActivityLogTableProps) {
  const { current_page, last_page, total, per_page } = pagination;
  const startItem = total === 0 ? 0 : (current_page - 1) * per_page + 1;
  const endItem = Math.min(current_page * per_page, total);

  return (
    <div className="flex flex-col bg-surface rounded-xl shadow-sm overflow-hidden border border-border/40 transition-all">
      {/* Scrollable Table View Container for Responsive Mobile Support */}
      <div className="overflow-x-auto w-full">
        <div className="min-w-[820px] flex flex-col">
          {/* Table Header Bar */}
          <div className="grid grid-cols-12 px-6 py-3.5 bg-surface-alt font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider items-center border-b border-border/40 font-semibold">
            <div className="col-span-3">Pelaku / Administrator</div>
            <div className="col-span-2">Jenis Log</div>
            <div className="col-span-3">Deskripsi Aksi</div>
            <div className="col-span-2">Target Subjek</div>
            <div className="col-span-2 text-right">Waktu (WIB)</div>
          </div>

          {/* Table Rows or Empty State */}
          {isLoading ? (
            <div className="p-12 text-center text-ink-subtle font-body-default">
              <div className="inline-block w-8 h-8 border-3 border-role-accent-admin/20 border-t-role-accent-admin rounded-full animate-spin mb-3" />
              <p>Memuat riwayat audit trail...</p>
            </div>
          ) : logs.length === 0 ? (
            <ActivityLogEmptyState onResetFilters={onResetFilters} />
          ) : (
            <div className="flex flex-col">
              {logs.map((log, index) => (
                <ActivityLogRow
                  key={log.id}
                  log={log}
                  defaultExpanded={index === 0 && current_page === 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Pagination Footer */}
      {logs.length > 0 && (
        <div className="px-6 py-4 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/30">
          <div className="flex items-center gap-2 font-caption text-caption text-ink-muted">
            <span>
              Menampilkan <strong className="text-ink font-semibold">{startItem}-{endItem}</strong> dari{" "}
              <strong className="text-ink font-semibold">{total}</strong> log aktivitas
            </span>
            <span className="hidden md:inline text-ink-subtle">•</span>
            <span className="hidden md:inline">
              Retention Policy: 365 Hari (UU PDP No. 27/2022)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Halaman pertama"
              disabled={current_page <= 1}
              onClick={() => onPageChange(1)}
              className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-xl bg-surface-alt hover:bg-surface-container-high text-ink disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={current_page <= 1}
              onClick={() => onPageChange(current_page - 1)}
              className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-xl bg-surface-alt hover:bg-surface-container-high text-ink disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] px-3 rounded-xl bg-role-accent-admin text-surface font-caption text-caption font-semibold flex items-center justify-center">
              {current_page}
            </span>
            {last_page > 1 && (
              <span className="font-caption text-caption text-ink-subtle px-1">
                dari {last_page}
              </span>
            )}

            <button
              type="button"
              aria-label="Halaman selanjutnya"
              disabled={current_page >= last_page}
              onClick={() => onPageChange(current_page + 1)}
              className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-xl hover:bg-surface-alt text-ink disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Halaman terakhir"
              disabled={current_page >= last_page}
              onClick={() => onPageChange(last_page)}
              className="min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] rounded-xl hover:bg-surface-alt text-ink disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
