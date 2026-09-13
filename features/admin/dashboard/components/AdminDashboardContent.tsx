import { Card } from "@/components/ui/card";
import type { ActivityLog } from "@/features/activity-log/types";

import type { AdminDashboardData } from "@/features/admin/dashboard/lib/adminDashboardTypes";
import { StatCard } from "@/components/ui/stat-card";
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
  const primaryStats = [
    {
      label: "Verifikasi Pending",
      value: String(pending_actions.doctor_verifications),
      href: "/admin/doctor-verifications/pending",
    },
    {
      label: "User Baru (7 hari)",
      value: String(stats.new_users_this_week),
      href: "/admin/users",
    },
    {
      label: "Revenue Bulanan",
      value: formatCurrency(stats.monthly_revenue),
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
  const donutCenterLabel = "disetujui";

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

      {/* Statistik utama — keputusan harian admin. Sisanya cuma angka konteks, cukup satu baris teks. */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {primaryStats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      <p className="text-sm text-slate-500">
        Total: {stats.total_users} user · {stats.total_doctors} dokter ·{" "}
        {stats.scans_today} scan hari ini ({stats.total_scans} total) ·{" "}
        {stats.active_pro_subscriptions} langganan Pro aktif.
      </p>

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
