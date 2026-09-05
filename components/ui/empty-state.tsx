import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * EmptyState — standarisasi kondisi kosong (DESIGN.md §4.8).
 * Kartu ber-border dashed, ikon dalam lingkaran bg-slate-50,
 * judul + deskripsi + CTA opsional. Menggantikan teks polos.
 */

type EmptyStateProps = {
  /** Ikon custom (default: ikon inbox 48px slate-300). */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** CTA opsional (mis. tombol/link). */
  action?: ReactNode;
  className?: string;
};

function DefaultEmptyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-12 w-12 text-slate-300"
    >
      <path
        d="M3 10h18M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3m-14 0-1.6 8.3A2 2 0 0 0 5.4 21h13.2a2 2 0 0 0 2-2.7L19 10m-14 0h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center",
        className,
      )}
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-50">
        {icon ?? <DefaultEmptyIcon />}
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-600">{title}</p>
        {description ? (
          <p className="text-xs text-slate-500">{description}</p>
        ) : null}
      </div>

      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
