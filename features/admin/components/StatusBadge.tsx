import { cn } from "@/lib/utils";

/**
 * StatusBadge — satu komponen status lintas halaman admin (DESIGN.md §4.3).
 *
 * Varian (token §2.1/§2.2):
 * - approved/success → emerald  (disetujui, aktif, online)
 * - pending/warning  → amber    (menunggu review, perlu revisi)
 * - rejected/destructive → rose (ditolak, nonaktif)
 * - info             → sky      (netral/info)
 * - neutral          → slate    (default)
 *
 * Bentuk: pill rounded-full px-2.5 py-0.5 text-xs font-semibold + dot 6px.
 * Sama di mobile & desktop. Pencocokan status case-insensitive — aman untuk
 * input mentah backend (lowercase) maupun hasil mapVerificationStatus (kapital).
 */

export type StatusBadgeVariant =
  | "approved"
  | "success"
  | "pending"
  | "warning"
  | "rejected"
  | "destructive"
  | "info"
  | "neutral";

const VARIANT_STYLES: Record<StatusBadgeVariant, string> = {
  approved: "border-emerald-100 bg-emerald-50 text-emerald-700",
  success: "border-emerald-100 bg-emerald-50 text-emerald-700",
  pending: "border-amber-100 bg-amber-50 text-amber-700",
  warning: "border-amber-100 bg-amber-50 text-amber-700",
  rejected: "border-rose-100 bg-rose-50 text-rose-700",
  destructive: "border-rose-100 bg-rose-50 text-rose-700",
  info: "border-sky-100 bg-sky-50 text-sky-700",
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
};

const VARIANT_DOTS: Record<StatusBadgeVariant, string> = {
  approved: "bg-emerald-500",
  success: "bg-emerald-500",
  pending: "bg-amber-500",
  warning: "bg-amber-500",
  rejected: "bg-rose-500",
  destructive: "bg-rose-500",
  info: "bg-sky-500",
  neutral: "bg-slate-500",
};

/** Pemetaan status → varian (§4.3). Keputusan identik pra/pasca konsolidasi. */
function resolveVariant(status: string): StatusBadgeVariant {
  const s = status.toLowerCase();

  if (s === "approved" || s === "active" || s === "online") return "approved";
  if (s === "pending" || s === "needs_revision" || s === "revision_required")
    return "pending";
  if (s === "rejected" || s === "inactive" || s === "suspended")
    return "rejected";
  if (s === "info") return "info";

  return "neutral";
}

type StatusBadgeProps = {
  status: string;
  /** Override varian otomatis (mis. badge event log). */
  variant?: StatusBadgeVariant;
  /** Sembunyikan dot 6px. */
  hideDot?: boolean;
  className?: string;
};

export function StatusBadge({
  status,
  variant,
  hideDot,
  className,
}: StatusBadgeProps) {
  const resolved = variant ?? resolveVariant(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm",
        VARIANT_STYLES[resolved],
        className,
      )}
    >
      {hideDot ? null : (
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", VARIANT_DOTS[resolved])}
        />
      )}
      {status}
    </span>
  );
}
