"use client";

import { Search, RotateCcw, Download, X, ChevronDown } from "lucide-react";

type UserFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCSV: () => void;
};

export function UserFilterBar({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  hasActiveFilters,
  onResetFilters,
  onExportCSV,
}: UserFilterBarProps) {
  return (
    <div className="p-4 bg-surface-alt flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-border">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama lengkap atau email akun..."
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-surface text-ink text-body-default placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-role-accent-admin/40 transition-all shadow-sm border border-border/60"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors"
              aria-label="Hapus kata kunci"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Select Role */}
        <div className="relative min-w-[150px]">
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full h-10 pl-3 pr-8 rounded-xl bg-surface text-ink text-caption font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-role-accent-admin/40 transition-all cursor-pointer shadow-sm border border-border/60"
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="user">User</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle w-4 h-4 pointer-events-none" />
        </div>

        {/* Select Status */}
        <div className="relative min-w-[150px]">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-10 pl-3 pr-8 rounded-xl bg-surface text-ink text-caption font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-role-accent-admin/40 transition-all cursor-pointer shadow-sm border border-border/60"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Ditangguhkan</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Reset Filter & Quick Action */}
      <div className="flex items-center gap-2 justify-end">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="h-10 px-3 rounded-xl bg-surface hover:bg-surface-container text-ink-muted text-caption font-medium flex items-center gap-1.5 shadow-sm transition-colors border border-border/60"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Filter</span>
          </button>
        )}
        <button
          type="button"
          onClick={onExportCSV}
          className="h-10 px-3 rounded-xl bg-surface hover:bg-surface-container text-ink-muted text-caption font-medium flex items-center gap-1.5 shadow-sm transition-colors border border-border/60"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor CSV</span>
        </button>
      </div>
    </div>
  );
}
