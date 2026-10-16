"use client";

import * as React from "react";

import { useDialogEscape } from "@/features/shared/hooks/useDialogEscape";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Tanpa pesan a11y tambahan — judul dipakai sebagai labelledby. */
};

const SIZE_STYLES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  useDialogEscape(open, onClose);

  // Focus trap + kembalikan focus ke tombol pemicu (jika ada) saat tutup.
  React.useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px]"
        onClick={onClose}
        onKeyDown={(e) => e.stopPropagation()}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative w-full rounded-t-[var(--radius-hero)] border border-slate-100 bg-white shadow-[var(--shadow-overlay)] outline-none sm:rounded-[var(--radius-card)]",
          "max-h-[90vh] overflow-y-auto",
          SIZE_STYLES[size],
          "animate-rise",
          className,
        )}
      >
        {(title || description) ? (
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {title ? (
                  <h2
                    id={titleId}
                    className="font-heading text-lg font-bold tracking-tight text-slate-900"
                  >
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p className="mt-1 text-sm text-slate-500">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : null}

        {children ? <div className="px-5 py-4 sm:px-6">{children}</div> : null}

        {footer ? (
          <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}