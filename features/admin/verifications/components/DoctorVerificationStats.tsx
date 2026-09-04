import { ProgressDonut } from "@/features/admin/dashboard/components/ProgressDonut";

import type { DoctorVerificationStats as DoctorVerificationStatsType } from "@/features/admin/verifications/lib/doctorVerificationTypes";

type DoctorVerificationStatsProps = {
  stats: DoctorVerificationStatsType;
};

/**
 * Ringkasan komposisi verifikasi (§5.6) — donut mini menggantikan
 * 3 stat card datar. Data & label angka identik dengan versi lama.
 */
export function DoctorVerificationStats({
  stats,
}: DoctorVerificationStatsProps) {
  const total = stats.pendingCount + stats.approvedCount + stats.rejectedCount;
  const approvedPct =
    total > 0 ? Math.round((stats.approvedCount / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 text-slate-950 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressDonut
            centerValue={`${approvedPct}%`}
            centerLabel="approved"
            pending={stats.pendingCount}
            approved={stats.approvedCount}
            rejected={stats.rejectedCount}
          />
        </div>
      </div>
    </div>
  );
}
