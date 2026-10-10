"use client";

import { UserPlus } from "lucide-react";
import type { PagePagination } from "@/lib/types/pagination";
import type { DoctorRow } from "../lib/doctorsTypes";
import { DoctorStatStrip } from "./DoctorStatStrip";
import { DoctorFilterBar } from "./DoctorFilterBar";
import { DoctorsTable } from "./DoctorsTable";

type DoctorsContentProps = {
  doctors: DoctorRow[];
  totalDoctors: number;
  pendingSipCount: number;
  pagination: PagePagination;
  onPageChange: (page: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  verificationStatus: string;
  onVerificationStatusChange: (value: string) => void;
  accountStatus: string;
  onAccountStatusChange: (value: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onOpenInviteModal: () => void;
  isLoading?: boolean;
};

export function DoctorsContent({
  doctors,
  totalDoctors,
  pendingSipCount,
  pagination,
  onPageChange,
  search,
  onSearchChange,
  verificationStatus,
  onVerificationStatusChange,
  accountStatus,
  onAccountStatusChange,
  hasActiveFilters,
  onResetFilters,
  onOpenInviteModal,
  isLoading,
}: DoctorsContentProps) {
  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Header Section with Action matching /admin/users */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-eyebrow text-eyebrow text-role-accent-admin font-semibold tracking-widest uppercase">
              DIREKTORI TENAGA MEDIS
            </span>
           
          </div>
          <h1 className="font-display text-display text-ink font-semibold tracking-tight">
            Manajemen Dokter
          </h1>
          <p className="font-body-default text-body-default text-ink-muted max-w-2xl">
            Kelola dokter spesialis dermatologi, nomor STR, status verifikasi SIP, dan keaktifan akun klinis.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenInviteModal}
            className="h-10 px-5 rounded-xl bg-role-accent-admin text-surface font-headline-sm text-caption font-semibold flex items-center gap-2 hover:bg-secondary-container shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Undang Spesialis</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Highlights (4 Cards) */}
      <DoctorStatStrip
        verifiedCount={totalDoctors}
        pendingCount={pendingSipCount}
      />

      {/* 3. Filter & View Controller Panel */}
      <DoctorFilterBar
        search={search}
        onSearchChange={onSearchChange}
        verificationStatus={verificationStatus}
        onVerificationStatusChange={onVerificationStatusChange}
        accountStatus={accountStatus}
        onAccountStatusChange={onAccountStatusChange}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        totalFilteredDoctors={pagination.totalItems}
      />

      {/* 4. Table Container Card */}
      <DoctorsTable
        doctors={doctors}
        pagination={pagination}
        onPageChange={onPageChange}
        onResetFilters={onResetFilters}
        isLoading={isLoading}
      />
    </div>
  );
}
