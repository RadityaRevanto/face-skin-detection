"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MoreVertical } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * TableRowActions — pola aksi baris TERSATU untuk semua tabel admin/doctor.
 * - Aksi utama (view/approve): icon button langsung + tooltip.
 * - Aksi sekunder/destruktif (edit/suspend/hapus/reject): kebab "⋮" dalam dropdown.
 * - Tone semantik: success (approve), warning (suspend), danger (hapus/reject).
 * - Icon family: lucide-react saja (caller mengirim komponen icon-nya).
 */

export type RowActionTone = "neutral" | "success" | "warning" | "danger";

export type RowAction = {
  key: string;
  label: string;
  icon: ReactNode;
  /** Salah satu: `href` (navigasi Link) ATAU `onSelect` (aksi). */
  href?: string;
  onSelect?: () => void;
  tone?: RowActionTone;
  disabled?: boolean;
};

type TableRowActionsProps = {
  /** Aksi primer — tampil sebagai icon button langsung. */
  primary?: RowAction;
  /** Aksi sekunder/destruktif — berkumpul di dropdown kebab. */
  actions?: RowAction[];
  busy?: boolean;
  className?: string;
};

const ICON_TONE: Record<RowActionTone, string> = {
  neutral:
    "hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
  success:
    "hover:bg-[var(--success-bg)] hover:text-[var(--success-fg)]",
  warning:
    "hover:bg-[var(--warning-bg)] hover:text-[var(--warning-fg)]",
  danger:
    "hover:bg-[var(--destructive-bg)] hover:text-[var(--destructive-fg)]",
};

const ICON_BASE =
  "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-control)] text-[var(--ink-muted)] transition-colors duration-[var(--motion-fast)] disabled:cursor-not-allowed disabled:opacity-40";

function RowIconButton({
  action,
  busy,
}: {
  action: RowAction;
  busy?: boolean;
}) {
  const tone = ICON_TONE[action.tone ?? "neutral"];
  const isLink = Boolean(action.href) && !busy && !action.disabled;

  return (
    <span className="group/tip relative inline-flex">
      {isLink ? (
        <Link href={action.href!} aria-label={action.label} className={cn(ICON_BASE, tone)}>
          {action.icon}
        </Link>
      ) : (
        <button
          type="button"
          aria-label={action.label}
          disabled={busy || action.disabled}
          onClick={action.onSelect}
          className={cn(ICON_BASE, tone)}
        >
          {action.icon}
        </button>
      )}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--ink)] px-2 py-1 text-[11px] font-medium text-[var(--surface)] opacity-0 shadow-[var(--shadow-overlay)] transition-opacity duration-[var(--motion-fast)] group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        {action.label}
      </span>
    </span>
  );
}

export function TableRowActions({
  primary,
  actions = [],
  busy,
  className,
}: TableRowActionsProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const kebabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function closeAll() {
      setOpen(false);
    }
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", closeAll, true);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", closeAll, true);
    };
  }, [open]);

  const visibleActions = actions.filter(Boolean);

  function toggleMenu() {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = kebabRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPos({
        top: rect.bottom + 4,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    }
    setOpen(true);
  }

  return (
    <div
      ref={wrapRef}
      className={cn("flex items-center justify-end gap-0.5", className)}
    >
      {primary ? <RowIconButton action={primary} busy={busy} /> : null}

      {visibleActions.length > 0 ? (
        <div className="relative">
          <span className="group/tip relative inline-flex">
            <button
              ref={kebabRef}
              type="button"
              aria-label="Aksi lainnya"
              aria-haspopup="menu"
              aria-expanded={open}
              disabled={busy}
              onClick={toggleMenu}
              className={cn(
                "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[var(--radius-control)] text-[var(--ink-muted)] transition-colors duration-[var(--motion-fast)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40",
                open && "bg-[var(--surface-2)] text-[var(--ink)]",
              )}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {!open ? (
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--ink)] px-2 py-1 text-[11px] font-medium text-[var(--surface)] opacity-0 shadow-[var(--shadow-overlay)] transition-opacity duration-[var(--motion-fast)] group-hover/tip:opacity-100"
              >
                Aksi lainnya
              </span>
            ) : null}
          </span>

          {open && menuPos ? (
            <div
              role="menu"
              style={{ top: menuPos.top, right: menuPos.right }}
              className="fixed z-[90] w-44 overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-1 shadow-[var(--shadow-overlay)]"
            >
              {visibleActions.map((action) => {
                const content = (
                  <>
                    <span
                      className={cn(
                        "shrink-0",
                        action.tone === "danger" && "text-[var(--destructive-fg)]",
                      )}
                    >
                      {action.icon}
                    </span>
                    {action.label}
                  </>
                );
                const cls = cn(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  action.tone === "danger"
                    ? "text-[var(--destructive-fg)] hover:bg-[var(--destructive-bg)]"
                    : "text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
                );

                return action.href ? (
                  <Link
                    key={action.key}
                    href={action.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={cls}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={action.key}
                    type="button"
                    role="menuitem"
                    disabled={busy || action.disabled}
                    onClick={() => {
                      setOpen(false);
                      action.onSelect?.();
                    }}
                    className={cls}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}