"use client";

import type { ActivityLog } from "../types";
import { ACTIVITY_EVENT_LABELS } from "../types";
import { StatusBadge, type StatusBadgeVariant } from "@/features/admin/components/StatusBadge";

type ActivityLogItemProps = {
  log: ActivityLog;
  /** Sembunyikan garis timeline dashed (mobile default tanpa garis, §4.4). */
  hideTimelineLine?: boolean;
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Pemetaan event → varian StatusBadge (konsolidasi §4.3, keputusan approved):
 * created/verified/approved → success; updated/login → info;
 * deleted/rejected → destructive; logout → neutral.
 * Hasil keputusan identik dengan ACTIVITY_EVENT_COLORS lama (label & warna status).
 */
function resolveEventVariant(event: string): StatusBadgeVariant {
  if (event === "created" || event === "verified" || event === "approved") return "success";
  if (event === "updated" || event === "login") return "info";
  if (event === "deleted" || event === "rejected") return "destructive";
  return "neutral";
}

export function ActivityLogItem({ log, hideTimelineLine }: ActivityLogItemProps) {
  const eventLabel = ACTIVITY_EVENT_LABELS[log.event] ?? log.event;

  return (
    <div
      className={[
        "flex gap-3 border-b border-slate-100 py-4 last:border-0 sm:gap-4",
        // §4.4: garis timeline dashed antar item hanya di desktop.
        hideTimelineLine ? "" : "md:border-l md:border-dashed md:border-slate-200 md:pl-4 md:-ml-5",
      ].join(" ")}
    >
      {/* Avatar — 36px mobile, 40px sm+ (§4.4) */}
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 sm:h-10 sm:w-10">
        {log.causer_name?.charAt(0)?.toUpperCase() ?? "?"}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">
            {log.causer_name ?? "System"}
          </span>
          <StatusBadge
            status={eventLabel}
            variant={resolveEventVariant(log.event)}
            hideDot
            className="!px-2 !py-0.5 !text-[10px] !shadow-none"
          />
        </div>
        <p className="mt-1 text-sm text-slate-600">{log.description}</p>
        <p className="mt-1 text-xs text-slate-400">
          {formatRelativeTime(log.created_at)}
        </p>
      </div>
    </div>
  );
}
