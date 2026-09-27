"use client";

import Link from "next/link";
import {
  Crown,
  ScanLine,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { DonutChart } from "@/components/ui/charts/DonutChart";
import type { ActivityLog } from "@/features/activity-log/types";
import { formatIDR, toLineData, weekOverWeekDelta } from "../lib/adminDashboardFormat";

import type { AdminDashboardData } from "@/features/admin/dashboard/lib/adminDashboardTypes";
import { HeroStat } from "./HeroStat";
import { TrendChartsRow } from "./TrendChartsRow";
import { QueueList, type QueueListItem } from "./QueueList";
import { SummaryCard } from "./SummaryCard";
import { ActivityTimeline } from "./ActivityTimeline";

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
  charts,
  activityLogs = [],
  verificationCounts,
}: AdminDashboardContentProps) {
  const scans = toLineData(charts?.scans_last_14_days ?? []);
  const registrations = toLineData(charts?.registrations_last_14_days ?? []);
  const scansDelta = weekOverWeekDelta(charts?.scans_last_14_days ?? []);
  const regsDelta = weekOverWeekDelta(charts?.registrations_last_14_days ?? []);

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

  const donutCounts = verificationCounts ?? {
    pending: pending_actions.doctor_verifications,
    approved: 0,
    rejected: 0,
  };
  const donutTotal = donutCounts.pending + donutCounts.approved + donutCounts.rejected;
  const donutCenterValue =
    donutTotal > 0
      ? `${Math.round((donutCounts.approved / donutTotal) * 100)}%`
      : "0%";

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-[var(--role-accent)]"
            />
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--role-accent-strong)]">
              Command Center
            </p>
          </div>
          <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[var(--ink)]">
            Halo, Admin
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Ringkasan platform SkinCek hari ini.
          </p>
        </div>
        <p className="text-xs text-[var(--ink-muted)]">
          {stats.scans_today} scan hari ini · {stats.active_pro_subscriptions}{" "}
          langganan Pro aktif
        </p>
      </div>

      {/* Baris 1 — KPI: 1 hero (aksi utama admin) + 3 kartu kecil */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <HeroStat
          value={String(pending_actions.doctor_verifications)}
          href="/admin/doctor-verifications/pending"
        />
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-2">
          <StatCard
            label="User Baru (7 hari)"
            value={String(stats.new_users_this_week)}
            tone="blue"
            icon={<UserPlus className="h-5 w-5" />}
            delta={regsDelta !== null ? { value: regsDelta } : undefined}
            href="/admin/users"
          />
          <StatCard
            label="Total Scans"
            value={String(stats.total_scans)}
            tone="emerald"
            icon={<ScanLine className="h-5 w-5" />}
            delta={scansDelta !== null ? { value: scansDelta } : undefined}
          />
          <StatCard
            label="Dokter Aktif"
            value={String(stats.total_doctors)}
            tone="teal"
            icon={<Stethoscope className="h-5 w-5" />}
            href="/admin/doctors"
          />
          <StatCard
            label="Langganan Pro"
            value={String(stats.active_pro_subscriptions)}
            tone="violet"
            icon={<Crown className="h-5 w-5" />}
            helper={formatIDR(stats.monthly_revenue)}
          />
        </div>
      </section>

      {/* Baris 2 — chart tren 14 hari (data BE sebelumnya tak dirender) */}
      <TrendChartsRow scans={scans} registrations={registrations} />

      {/* Baris 3 — antrean review (2/3) + donut verifikasi (1/3) */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:gap-5">
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

        <Card className="p-4 sm:p-5">
          <h2 className="font-heading text-sm font-semibold text-[var(--ink)]">
            Progress Verifikasi
          </h2>
          <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
            {stats.total_users} user · {stats.total_doctors} dokter
          </p>
          <div className="mt-4 flex justify-center">
            <DonutChart
              centerValue={donutCenterValue}
              centerLabel="disetujui"
              segments={[
                { label: "Approved", value: donutCounts.approved, color: "#12a074" },
                { label: "Pending", value: donutCounts.pending, color: "#e0a223" },
                { label: "Rejected", value: donutCounts.rejected, color: "#c93651" },
              ]}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Approved", value: donutCounts.approved, cls: "text-[var(--success-fg)]" },
              { label: "Pending", value: donutCounts.pending, cls: "text-[var(--warning-fg)]" },
              { label: "Rejected", value: donutCounts.rejected, cls: "text-[var(--destructive-fg)]" },
            ].map((s) => (
              <div key={s.label} className="rounded-[var(--radius-control)] bg-[var(--surface-2)] px-2 py-2.5">
                <p className={`text-lg font-bold leading-none tabular-nums ${s.cls}`}>
                  {s.value}
                </p>
                <p className="mt-1 text-[11px] font-medium text-[var(--ink-muted)]">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Baris 4 — activity + ringkasan akun */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:gap-5">
        <div className="lg:col-span-2">
          <ActivityTimeline logs={activityLogs.slice(0, 5)} />
        </div>

        <SummaryCard
          title="Pendapatan Langganan"
          value={formatIDR(stats.monthly_revenue)}
          meta={[
            { label: "Pro Subscriptions aktif", value: String(stats.active_pro_subscriptions) },
            { label: "Total Scans", value: String(stats.total_scans) },
            { label: "Scans hari ini", value: String(stats.scans_today) },
          ]}
          primaryAction={{ label: "Kelola Verifikasi", href: "/admin/doctor-verifications/pending" }}
          secondaryAction={{ label: "Lihat Users", href: "/admin/users" }}
        />
      </section>

      <p className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
        <Users className="h-3.5 w-3.5" />
        Sumber angka: endpoint dashboard & activity-log —{" "}
        <Link href="/admin/activity-log" className="font-semibold text-[var(--role-accent-strong)] hover:underline">
          lihat log lengkap
        </Link>
      </p>
    </div>
  );
}