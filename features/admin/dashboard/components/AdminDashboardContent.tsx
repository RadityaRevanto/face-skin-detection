import Link from "next/link";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { ActivityLog } from "@/features/activity-log/types";

import type { AdminDashboardData } from "@/features/admin/dashboard/lib/adminDashboardTypes";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { StatCard } from "./StatCard";
import { QueueList, type QueueListItem } from "./QueueList";
import { ProgressDonut } from "./ProgressDonut";
import { SummaryCard } from "./SummaryCard";
import { ActivityTimeline } from "./ActivityTimeline";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeZone: "Asia/Jakarta",
    }).format(new Date(dateStr));
  } catch {
    return "-";
  }
}

type VerificationCounts = {
  pending: number;
  approved: number;
  rejected: number;
};

type AdminDashboardContentProps = AdminDashboardData & {
  /** Widget Activity Timeline (§5.1 poin 5) — dari useQuery container. */
  activityLogs?: ActivityLog[];
  /** Komposisi status verifikasi untuk donut (§4.6). */
  verificationCounts?: VerificationCounts;
};

export function AdminDashboardContent({
  stats,
  pending_actions,
  recent_verifications,
  activityLogs = [],
  verificationCounts,
}: AdminDashboardContentProps) {
  // §5.1 mobile: akordeon "Lihat semua statistik" untuk 4 kartu sekunder.
  const [showAllStats, setShowAllStats] = useState(false);

  const primaryStats = [
    {
      label: "Total Users",
      value: String(stats.total_users),
      icon: "users",
      tone: "bg-emerald-50 text-emerald-600",
      href: "/admin/users",
    },
    {
      label: "Total Doctors",
      value: String(stats.total_doctors),
      icon: "stethoscope",
      tone: "bg-sky-50 text-sky-600",
      href: "/admin/doctors",
    },
    {
      label: "Verifikasi Pending",
      value: String(pending_actions.doctor_verifications),
      icon: "clock",
      tone: "bg-amber-50 text-amber-600",
      href: "/admin/doctor-verifications/pending",
    },
    {
      label: "Total Scans",
      value: String(stats.total_scans),
      icon: "scan",
      tone: "bg-violet-50 text-violet-600",
    },
  ];

  const secondaryStats = [
    {
      label: "Scans Hari Ini",
      value: String(stats.scans_today),
      icon: "scan",
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "User Baru (7 hari)",
      value: String(stats.new_users_this_week),
      icon: "user-plus",
      tone: "bg-sky-50 text-sky-600",
    },
    {
      label: "Pro Subscriptions",
      value: String(stats.active_pro_subscriptions),
      icon: "subscription",
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Revenue Bulanan",
      value: formatCurrency(stats.monthly_revenue),
      icon: "revenue",
      tone: "bg-rose-50 text-rose-600",
    },
  ];

  // QueueList "Perlu Review" (§4.5) — filter client-side render:
  // hanya item pending dari recent_verifications (keputusan approved).
  const queueItems: QueueListItem[] = recent_verifications
    .filter((v) => (v.verification_status ?? "pending") === "pending")
    .slice(0, 4)
    .map((v) => ({
      id: v.uuid,
      title: v.doctor?.full_name ?? "Dokter",
      meta: v.str_number ?? v.specialization ?? "Dokumen",
      status: "Pending",
      statusVariant: "pending" as const,
      href: `/admin/doctor-verifications/detail?id=${encodeURIComponent(v.uuid)}`,
    }));

  // Donut: pakai counts lengkap bila tersedia; fallback pending-only dari
  // pending_actions (menampilkan komposisi yang diketahui saja).
  const donutCounts =
    verificationCounts ?? {
      pending: pending_actions.doctor_verifications,
      approved: 0,
      rejected: 0,
    };
  const donutTotal = donutCounts.pending + donutCounts.approved + donutCounts.rejected;
  const donutCenterValue =
    donutTotal > 0
      ? `${Math.round((donutCounts.approved / donutTotal) * 100)}%`
      : "0%";
  const donutCenterLabel = "approved";

  return (
    <div className="w-full space-y-6">
      {/* §5.1 mobile poin 1: greeting ringkas */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Halo, Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan platform SkinCek hari ini.
          </p>
        </div>
      </div>

      {/* §5.1: mobile = 4 kartu prioritas + akordeon; lg+ = 8 kartu 4 kolom */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {primaryStats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      {/* Akordeon "Lihat semua statistik" (mobile/tablet) — grid 4 penuh di lg */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowAllStats((v) => !v)}
          aria-expanded={showAllStats}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
        >
          {showAllStats ? "Sembunyikan statistik" : "Lihat semua statistik"}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className={`h-4 w-4 text-slate-400 transition-transform ${showAllStats ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showAllStats ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {secondaryStats.map((item) => (
              <StatCard key={item.label} {...item} />
            ))}
          </div>
        ) : null}
      </div>

      {/* 4 kartu sekunder tampil permanen di lg+ (bagian baris-1 grid 8) */}
      <div className="hidden gap-3 sm:gap-4 lg:grid lg:grid-cols-4">
        {secondaryStats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      {/* Baris 2: QueueList (2/3) + Donut (1/3) — mobile stack, sm 2 kolom, lg 2/3-1/3 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QueueList
            title="Perlu Review"
            description="Verifikasi dokter menunggu keputusan."
            items={queueItems}
            viewAllHref="/admin/doctor-verifications/pending"
            emptyTitle="Tidak ada antrean review"
            emptyDescription="Semua verifikasi sudah diproses."
          />
        </div>

        <Card className="overflow-hidden rounded-2xl border-slate-100 bg-white p-4 text-slate-950 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
            Progress Verifikasi
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Komposisi status seluruh verifikasi dokter.
          </p>
          <div className="mt-5">
            <ProgressDonut
              centerValue={donutCenterValue}
              centerLabel={donutCenterLabel}
              pending={donutCounts.pending}
              approved={donutCounts.approved}
              rejected={donutCounts.rejected}
            />
          </div>
        </Card>
      </div>

      {/* Baris 3: Activity timeline (2/3) + Revenue summary (1/3) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityTimeline logs={activityLogs.slice(0, 5)} />
        </div>

        <SummaryCard
          title="Revenue Bulanan"
          value={formatCurrency(stats.monthly_revenue)}
          meta={[
            { label: "Pro Subscriptions aktif", value: String(stats.active_pro_subscriptions) },
            { label: "Total Scans", value: String(stats.total_scans) },
            { label: "Scans hari ini", value: String(stats.scans_today) },
          ]}
          primaryAction={{ label: "Kelola Verifikasi", href: "/admin/doctor-verifications/pending" }}
          secondaryAction={{ label: "Lihat Users", href: "/admin/users" }}
        />
      </div>
    </div>
  );
}
