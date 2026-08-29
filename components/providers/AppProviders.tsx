import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";

/**
 * Composition root untuk context providers scope global shell
 * (theme, auth, role, dll). Saat ini pass-through — semua provider
 * global baru wajib ditambahkan di sini, bukan di app/layout.tsx.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster closeButton />
    </>
  );
}
