"use client";

import { useState } from "react";
import { Cloud, RefreshCw, Download } from "lucide-react";

import type { AdminDashboardData } from "../lib/adminDashboardTypes";
import { AdminPriorityAlertBanner } from "./AdminPriorityAlertBanner";
import { AdminDashboardStatGrid } from "./AdminDashboardStatGrid";
import { AdminDashboardCharts } from "./AdminDashboardCharts";
import { AdminRecentUsersTable } from "./AdminRecentUsersTable";

type AdminDashboardContentProps = AdminDashboardData & {
  onRefresh?: () => void;
};

export function AdminDashboardContent({
  stats,
  pending_actions,
  charts,
  onRefresh,
}: AdminDashboardContentProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const currentDateStr = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top Header Section with Clinical Metadata & Refresh Timestamp */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-1.5">
            <span className="font-eyebrow text-eyebrow text-role-accent-admin tracking-widest uppercase">
              DASHBOARD
            </span>
          <h1 className="font-display text-display text-ink tracking-tight font-semibold">
            Ringkasan Platform
          </h1>
          <p className="font-body-default text-body-default text-ink-muted max-w-2xl">
            Pemantauan komprehensif performa ekosistem AI SkinCek, antrean verifikasi medis, dan metrik operasional.
          </p>
        </div>

        {/* Quick Tool Action Bar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface shadow-sm text-ink-muted font-caption text-caption border border-border">
            <Cloud className="w-4 h-4 text-success" />
            <span>
              Data mutakhir: <strong className="text-ink font-semibold">{currentDateStr} WIB</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-alt shadow-sm text-ink font-caption text-caption transition-all duration-200 border border-border disabled:opacity-60"
          >
            <RefreshCw
              className={`w-4 h-4 text-ink-muted transition-transform duration-500 ${
                isRefreshing ? "animate-spin text-role-accent-admin" : "group-hover:rotate-180"
              }`}
            />
            <span>{isRefreshing ? "Memuat..." : "Perbarui Data"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-role-accent-admin hover:bg-role-accent-admin/90 text-white font-caption text-caption shadow-sm transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Laporan</span>
          </button>
        </div>
      </div>

      {/* Priority Banner: Medical Verification Gatekeeper */}
      <AdminPriorityAlertBanner
        pendingCount={pending_actions?.doctor_verifications ?? 0}
      />

      {/* Section 1: Stat Cards Grid (7 Metric Tiles) */}
      <AdminDashboardStatGrid stats={stats} />

      {/* Section 2: Clinical Telemetry & Two Side-by-Side Charts */}
      <AdminDashboardCharts charts={charts} />

      {/* Section 3: Interactive View Selector & Recent Users Table */}
      <AdminRecentUsersTable />
    </div>
  );
}
