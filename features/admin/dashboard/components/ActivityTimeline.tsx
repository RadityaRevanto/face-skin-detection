import Link from "next/link";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { ActivityLog } from "@/features/activity-log/types";

import { ActivityLogItem } from "@/features/activity-log/components/ActivityLogItem";

/**
 * ActivityTimeline (DESIGN.md §4.4) — pola Dasher "Activity Log".
 *
 * - Desktop: garis timeline vertikal dashed antar item (border-start);
 *   tanpa garis di mobile (lebih bersih).
 * - Mobile: stack penuh, avatar dipadatkan (36px) via prop item.
 * - Footer CTA "View Full Log" → /admin/activity-log.
 *
 * Reuse ActivityLogItem — data & format relatif waktu tidak berubah.
 */

type ActivityTimelineProps = {
  logs: ActivityLog[];
  /** Batas jumlah item yang dirender (dipotik saat render oleh pemanggil). */
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
};

export function ActivityTimeline({
  logs,
  viewAllHref = "/admin/activity-log",
  viewAllLabel = "View Full Log",
  className,
}: ActivityTimelineProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl border-slate-100 bg-white text-slate-950 shadow-sm",
        className,
      )}
    >
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
        <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
          Activity Terbaru
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Aktivitas admin & sistem terbaru.
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="px-4 py-8 text-center sm:px-6">
          <p className="text-sm font-semibold text-slate-600">
            Belum ada aktivitas
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Aktivitas sistem akan tampil di sini.
          </p>
        </div>
      ) : (
        <div className="px-4 py-2 sm:px-6">
          {logs.map((log) => (
            <ActivityLogItem key={log.id} log={log} hideTimelineLine />
          ))}
        </div>
      )}

      <div className="border-t border-slate-100 p-4 sm:p-6">
        <Link
          href={viewAllHref}
          className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          {viewAllLabel}
        </Link>
      </div>
    </Card>
  );
}
