"use client";

import { Calendar, ChevronDown, RotateCcw, Search, X } from "lucide-react";
import type { ActivityLogFilterState } from "../lib/activityLogTypes";

type ActivityLogFilterBarProps = {
  filters: ActivityLogFilterState;
  onSearchChange: (search: string) => void;
  onLogNameChange: (logName: string) => void;
  onCauserChange: (causer: string) => void;
  onResetFilters: () => void;
  totalFiltered?: number;
};

export function ActivityLogFilterBar({
  filters,
  onSearchChange,
  onLogNameChange,
  onCauserChange,
  onResetFilters,
}: ActivityLogFilterBarProps) {
  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.logName !== "all" ||
    filters.causer !== "all";

  return (
    <div className="p-4 rounded-xl bg-surface shadow-sm mb-4 border border-border/40">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari target ID, nama user, atau deskripsi..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-surface-alt font-body-default text-body-default text-ink placeholder:text-ink-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin/30 border border-border/40 transition-all"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Select: Jenis Log */}
          <div className="relative min-w-[200px]">
            <select
              value={filters.logName}
              onChange={(e) => onLogNameChange(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-surface-alt font-body-default text-body-default text-ink font-medium focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin/30 border border-border/40 cursor-pointer transition-all"
            >
              <option value="all">Semua Jenis Log</option>
              <option value="user_management">Manajemen User</option>
              <option value="doctor_verification">Verifikasi Dokter</option>
              <option value="authentication">Autentikasi Admin</option>
              <option value="system_config">Konfigurasi Sistem</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
          </div>

          {/* Select: Pelaku */}
          <div className="relative min-w-[200px]">
            <select
              value={filters.causer}
              onChange={(e) => onCauserChange(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-surface-alt font-body-default text-body-default text-ink font-medium focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin/30 border border-border/40 cursor-pointer transition-all"
            >
              <option value="all">Semua Pelaku</option>
              <option value="dr_aris">dr. Aris Sp.KK (Superadmin)</option>
              <option value="admin_rian">Admin Rian Sanjaya (OPS)</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
          </div>

          {/* Date Indicator Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-alt text-ink-muted font-caption text-caption font-semibold border border-border/40 select-none">
            <Calendar className="w-4 h-4 text-ink-subtle" />
            <span>10 Okt 2026</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-alt text-ink-muted hover:text-ink transition-all font-body-default text-body-default font-medium border border-border/40 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
