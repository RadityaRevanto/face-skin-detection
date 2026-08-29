import type { ReactNode } from "react";

/**
 * Composition root untuk context providers scope global shell
 * (theme, auth, role, dll). Saat ini pass-through — semua provider
 * global baru wajib ditambahkan di sini, bukan di app/layout.tsx.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
