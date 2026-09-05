"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/AppShell";
import { adminService } from "../services/adminService";

/**
 * Layout shell admin dengan badge jumlah verifikasi pending.
 * Fetch client-side via React Query (pengganti server fetch di layout lama).
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const { data: pendingCount } = useQuery({
    queryKey: ["admin", "pending-verifications-count"],
    queryFn: () => adminService.pendingVerificationCount(),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  return (
    <DashboardLayout role="admin" headerExtra={{ pendingCount: pendingCount ?? 0 }}>
      {children}
    </DashboardLayout>
  );
}
