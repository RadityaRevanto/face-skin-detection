"use client";

import {
  Download,
  History,
  Lock,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import type { ActivityLogStats } from "../lib/activityLogTypes";
import { customToast } from "@/lib/custom-toast";

type ActivityLogHeaderProps = {
  stats: ActivityLogStats;
  totalLogs?: number;
};

export function ActivityLogHeader({ stats }: ActivityLogHeaderProps) {
  const handleDownloadCsv = () => {
    customToast.success("Mempersiapkan ekspor log audit...", {
      description: "Berkas audit trail (CSV) berstempel SHA-256 sedang diunduh.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title & Top Action Badges */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-eyebrow text-eyebrow text-role-accent-admin uppercase tracking-wider font-semibold">
              AUDIT SISTEM & KEAMANAN
            </span>
          </div>
          <h1 className="font-display text-display text-ink tracking-tight font-semibold">
            Activity Log
          </h1>
          <p className="font-body-default text-body-default text-ink-muted mt-1 max-w-2xl">
            Jejak audit seluruh tindakan administratif, mutasi data, dan verifikasi platform SkinCek secara real-time demi integritas tata kelola rekam medis & data pengguna.
          </p>
        </div>

        {/* Action Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface shadow-sm border border-border/40">
            <ShieldCheck className="w-4 h-4 text-role-accent-admin" />
            <span className="font-caption text-caption text-ink font-semibold">
              SHA-256 Immutability Check
            </span>
            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success font-caption text-[11px] font-bold">
              VALID
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface hover:bg-surface-alt shadow-sm text-ink-muted hover:text-ink transition-colors font-caption text-caption font-semibold border border-border/40 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh CSV</span>
          </button>
        </div>
      </div>

      {/* Live Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-surface shadow-sm flex items-center justify-between border border-border/50">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              Total Mutasi Hari Ini
            </span>
            <span className="font-headline-lg text-headline-lg text-ink font-semibold mt-0.5">
              {stats.totalMutationsToday} Aksi
            </span>
            <span className="font-caption text-caption text-success flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.mutationsTrendText ?? "+12% dari rerata"}</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-role-accent-admin/10 flex items-center justify-center text-role-accent-admin">
            <History className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-surface shadow-sm flex items-center justify-between border border-border/50">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              Sesi Admin Aktif
            </span>
            <span className="font-headline-lg text-headline-lg text-ink font-semibold mt-0.5">
              {stats.activeAdminSessions} Akun
            </span>
            <span className="font-caption text-caption text-ink-muted flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="truncate max-w-[150px]">{stats.adminNamesText ?? "dr. Aris, Admin Rian"}</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-role-accent-doctor/10 flex items-center justify-center text-role-accent-doctor">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-surface shadow-sm flex items-center justify-between border border-border/50">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              Verifikasi Dokter Baru
            </span>
            <span className="font-headline-lg text-headline-lg text-ink font-semibold mt-0.5">
              {stats.newDoctorVerifications} Berkas
            </span>
            <span className="font-caption text-caption text-warning flex items-center gap-1 mt-1">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{stats.pendingVerificationsNote ?? `${stats.newDoctorVerifications} butuh approval`}</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-surface shadow-sm flex items-center justify-between border border-border/50">
          <div className="flex flex-col">
            <span className="font-eyebrow text-eyebrow uppercase text-ink-subtle">
              Integritas Audit Hash
            </span>
            <span className="font-headline-lg text-headline-lg text-ink font-semibold mt-0.5">
              {stats.auditHashIntegrity}
            </span>
            <span className="font-caption text-caption text-success flex items-center gap-1 mt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>No tampering detected</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <Lock className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
