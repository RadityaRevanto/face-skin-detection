import type { ActivityLog } from "../types";
import {
  ACTIVITY_EVENT_LABELS,
  ACTIVITY_EVENT_COLORS,
} from "../types";

type ActivityLogItemProps = {
  log: ActivityLog;
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

export function ActivityLogItem({ log }: ActivityLogItemProps) {
  const eventLabel =
    ACTIVITY_EVENT_LABELS[log.event] ?? log.event;
  const eventColor =
    ACTIVITY_EVENT_COLORS[log.event] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="flex gap-4 border-b border-slate-100 py-4 last:border-0">
      {/* Avatar */}
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
        {log.causer_name?.charAt(0)?.toUpperCase() ?? "?"}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">
            {log.causer_name ?? "System"}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${eventColor}`}>
            {eventLabel}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600">{log.description}</p>
        <p className="mt-1 text-xs text-slate-400">
          {formatRelativeTime(log.created_at)}
        </p>
      </div>
    </div>
  );
}
