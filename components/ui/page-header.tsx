import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Header halaman standar (Command Center) — eyebrow identitas role + judul +
 * deskripsi + aksi kanan. Dipakai semua halaman list/detail/fitur supaya
 * hierarki visual konsisten lintas role.
 */
export function PageHeader({
  eyebrow,
  title,
  titleSuffix,
  description,
  action,
  backHref,
  backLabel,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  titleSuffix?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** Link kembali di atas judul (halaman detail/form). */
  backHref?: string;
  backLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--role-accent-strong)] transition-colors hover:text-[var(--role-accent)]"
          >
            <span aria-hidden="true">←</span>
            {backLabel ?? "Kembali"}
          </Link>
        ) : null}

        {eyebrow ? (
          <div className={cn("flex items-center gap-2", backHref && "mt-3")}>
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-[var(--role-accent)]"
            />
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--role-accent-strong)]">
              {eyebrow}
            </p>
          </div>
        ) : null}

        <div className={cn("flex flex-wrap items-center gap-2", (eyebrow || backHref) && "mt-1")}>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-950">
            {title}
          </h1>
          {titleSuffix}
        </div>

        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}