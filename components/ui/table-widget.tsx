import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * TableWidget (DESIGN.md §4.2) — pola Dasher "Active Projects".
 *
 * Shell presentational slot-based: konten tabel & card list dirender
 * oleh halaman (logic data tidak berpindah ke widget ini).
 * - Desktop (md+): tabel asli via slot `table` (hidden md:block + overflow-x-auto).
 * - Mobile (<md): card list via slot `cards` (md:hidden) — bukan scroll horizontal
 *   (keputusan eksplisit §4.2).
 * - Header: judul + deskripsi + count chip opsional + link "Lihat semua" kanan.
 * - Footer: slot `footer` (Pagination).
 */

type TableWidgetProps = {
  title?: string;
  description?: string;
  /** Chip jumlah (mis. "24 user") di samping judul. */
  countChip?: ReactNode;
  /** Link "Lihat semua" kanan header. */
  viewAllHref?: string;
  viewAllLabel?: string;
  /** Slot tabel desktop — dirender dalam Card + overflow wrapper. */
  table: ReactNode;
  /** Slot card list mobile. */
  cards?: ReactNode;
  /** Footer (Pagination). */
  footer?: ReactNode;
  /** Konten saat list kosong (EmptyState). */
  empty?: ReactNode;
  /** Pakai bila slot cards/empty perlu dirender dalam Card mobile. */
  className?: string;
};

export function TableWidget({
  title,
  description,
  countChip,
  viewAllHref,
  viewAllLabel = "Lihat semua",
  table,
  cards,
  footer,
  empty,
  className,
}: TableWidgetProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden",
        className,
      )}
    >
      {title ? (
        <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-[var(--ink)] sm:text-base">
                {title}
              </h2>
              {countChip ? (
                <span className="inline-flex items-center rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-xs font-bold text-[var(--ink-soft)]">
                  {countChip}
                </span>
              ) : null}
            </div>
            {description ? (
              <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{description}</p>
            ) : null}
          </div>

          {viewAllHref ? (
            <a
              href={viewAllHref}
              className="shrink-0 text-xs font-semibold text-[var(--role-accent-strong)] transition-colors hover:text-[var(--role-accent)]"
            >
              {viewAllLabel}
            </a>
          ) : null}
        </div>
      ) : null}

      {/* Desktop table (md+) */}
      <div className="hidden overflow-x-auto md:block">{table}</div>

      {/* Mobile card list (<md) */}
      {cards ? <div className="md:hidden">{cards}</div> : null}

      {/* Empty state di luar slot (halaman yang mengirim list kosong) */}
      {empty ? (
        <div className="px-4 py-8 sm:px-6 lg:px-8">{empty}</div>
      ) : null}

      {footer ? <div className="border-t border-[var(--line)]">{footer}</div> : null}
    </Card>
  );
}
