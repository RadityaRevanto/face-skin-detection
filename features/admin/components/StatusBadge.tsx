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
  approved: "border-[var(--success-fg)]/20 bg-[var(--success-bg)] text-[var(--success-fg)]",
  success: "border-[var(--success-fg)]/20 bg-[var(--success-bg)] text-[var(--success-fg)]",
  pending: "border-[var(--warning-fg)]/20 bg-[var(--warning-bg)] text-[var(--warning-fg)]",
  warning: "border-[var(--warning-fg)]/20 bg-[var(--warning-bg)] text-[var(--warning-fg)]",
  rejected: "border-[var(--destructive-fg)]/20 bg-[var(--destructive-bg)] text-[var(--destructive-fg)]",
  destructive: "border-[var(--destructive-fg)]/20 bg-[var(--destructive-bg)] text-[var(--destructive-fg)]",
  info: "border-[var(--info-fg)]/20 bg-[var(--info-bg)] text-[var(--info-fg)]",
  neutral: "border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--ink-soft)]",
};

const VARIANT_DOTS: Record<StatusBadgeVariant, string> = {
  approved: "bg-[var(--success-fg)]",
  success: "bg-[var(--success-fg)]",
  pending: "bg-[var(--warning-fg)]",
  warning: "bg-[var(--warning-fg)]",
  rejected: "bg-[var(--destructive-fg)]",
  destructive: "bg-[var(--destructive-fg)]",
  info: "bg-[var(--info-fg)]",
  neutral: "bg-[var(--ink-muted)]",
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
