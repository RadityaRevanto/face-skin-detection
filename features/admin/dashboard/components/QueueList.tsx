import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * QueueList (DESIGN.md §4.5) — pola Dasher "My Task", diadaptasi jadi
 * antrean verifikasi dokter.
 *
 * - Item: ikon konteks 40px (shield emerald-50) + judul (nama dokter)
 *   + meta (STR/spesialisasi) + badge status kanan + tombol "Review →".
 * - Mobile: list scrollable max-h-80 overflow-y-auto.
 */

export type QueueListItem = {
  id: string;
  /** Judul item (nama dokter). */
  title: string;
  /** Meta sekunder (STR / spesialisasi). */
  meta?: string | null;
  /** Label badge status (dirender via StatusBadge variant). */
  status: string;
  /** Varian badge (§4.5 prioritas: High=destructive, Medium=warning, Low=info, Emergency=destructive-strong). */
  statusVariant?: "approved" | "pending" | "rejected" | "info" | "neutral";
  /** Link detail (halaman review). */
  href: string;
};

type QueueListProps = {
  title: string;
  description?: string;
  items: QueueListItem[];
  /** Label CTA footer. */
  viewAllHref?: string;
  viewAllLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5 text-emerald-600"
    >
      <path
        d="M12 21s7-3.5 7-10V5l-7-3-7 3v6c0 6.5 7 10 7 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function QueueList({
  title,
  description,
  items,
  viewAllHref,
  viewAllLabel = "View all",
  emptyTitle = "Tidak ada antrean",
  emptyDescription,
  className,
}: QueueListProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          ) : null}
        </div>

        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="shrink-0 text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
          >
            {viewAllLabel}
          </Link>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-8 text-center sm:px-6">
          <p className="text-sm font-semibold text-slate-600">{emptyTitle}</p>
          {emptyDescription ? (
            <p className="mt-1 text-xs text-slate-500">{emptyDescription}</p>
          ) : null}
        </div>
      ) : (
        <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-emerald-50/50 sm:px-6"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50">
                <ShieldIcon />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900">
                  {item.title}
                </span>
                {item.meta ? (
                  <span className="block truncate text-xs text-slate-500">
                    {item.meta}
                  </span>
                ) : null}
              </span>

              <span className="inline-flex h-8 shrink-0 items-center rounded-lg border border-emerald-200 px-3 text-xs font-bold text-emerald-700">
                Review →
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
