"use client";

import { Search, X, RotateCcw, ChevronDown } from "lucide-react";

type DoctorFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  verificationStatus: string;
  onVerificationStatusChange: (value: string) => void;
  accountStatus: string;
  onAccountStatusChange: (value: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  totalFilteredDoctors: number;
};

export function DoctorFilterBar({
  search,
  onSearchChange,
  verificationStatus,
  onVerificationStatusChange,
  accountStatus,
  onAccountStatusChange,
  hasActiveFilters,
  onResetFilters,
  totalFilteredDoctors,
}: DoctorFilterBarProps) {
  return (
    <div className="flex flex-col bg-surface rounded-2xl shadow-sm p-4 gap-4 border border-border/50">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama dokter, spesialisasi, atau nomor STR..."
            className="w-full h-11 pl-10 pr-9 rounded-xl bg-surface-alt text-body-default font-body-default text-ink placeholder:text-ink-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin transition-all border border-transparent focus:border-role-accent-admin"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[170px]">
            <select
              value={verificationStatus}
              onChange={(e) => onVerificationStatusChange(e.target.value)}
              className="w-full h-11 pl-3.5 pr-8 appearance-none rounded-xl bg-surface-alt text-caption font-caption font-medium text-ink focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin cursor-pointer transition-all border border-border/40"
            >
              <option value="">Semua Verifikasi</option>
              <option value="approved">Disetujui (Approved)</option>
              <option value="pending">Menunggu (Pending)</option>
              <option value="needs_revision">Perlu Revisi (Needs Revision)</option>
              <option value="rejected">Ditolak (Rejected)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-ink-subtle absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative min-w-[150px]">
            <select
              value={accountStatus}
              onChange={(e) => onAccountStatusChange(e.target.value)}
              className="w-full h-11 pl-3.5 pr-8 appearance-none rounded-xl bg-surface-alt text-caption font-caption font-medium text-ink focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-admin cursor-pointer transition-all border border-border/40"
            >
              <option value="">Semua Akun</option>
              <option value="active">Aktif</option>
              <option value="inactive">Ditangguhkan</option>
            </select>
            <ChevronDown className="w-4 h-4 text-ink-subtle absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="h-11 px-4 rounded-xl bg-surface-alt hover:bg-surface-container text-ink-muted hover:text-ink font-caption text-caption font-semibold flex items-center gap-1.5 transition-colors border border-border/40"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Feedback Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
        <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
          Status Data:
        </span>
        {verificationStatus && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-role-accent-admin font-caption text-caption font-medium">
            Verifikasi: {verificationStatus}
          </span>
        )}
        {accountStatus && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-low text-ink font-caption text-caption font-medium">
            Akun: {accountStatus === "active" ? "Aktif" : "Ditangguhkan"}
          </span>
        )}
        <span className="text-ink-subtle font-caption text-caption ml-auto">
          Menampilkan <strong className="text-ink">{totalFilteredDoctors}</strong> dokter terdaftar
        </span>
      </div>
    </div>
  );
}
