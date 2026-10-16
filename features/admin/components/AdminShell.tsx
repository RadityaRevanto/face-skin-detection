"use client";

import type { ReactNode } from "react";
import { AdminAppShell } from "./AdminAppShell";

/**
 * Layout shell admin khusus Stitch Admin Console.
 * Terpisah dari AppShell role doctor/user agar bebas regresi.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  return <AdminAppShell>{children}</AdminAppShell>;
}

