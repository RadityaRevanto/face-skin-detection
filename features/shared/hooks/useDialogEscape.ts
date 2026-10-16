"use client";

import { useEffect } from "react";

/** Tutup dialog dengan Esc — dipakai semua modal custom (bukan shadcn Dialog). */
export function useDialogEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, onClose]);
}
