"use client";

import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { adminService } from "../services/adminService";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export type AdminAppShellProps = {
  children: ReactNode;
};

export function AdminAppShell({ children }: AdminAppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const { data: pendingCount } = useQuery({
    queryKey: ["admin", "pending-verifications-count"],
    queryFn: () => adminService.pendingVerificationCount(),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  return (
    <div
      data-role="admin"
      className="admin-theme min-h-screen bg-background text-on-surface flex flex-col font-sans"
    >
      <AdminSidebar
        pendingCount={pendingCount ?? 0}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />
      <div className="pl-0 lg:pl-[264px] min-h-screen flex flex-col transition-all duration-300">
        <AdminTopbar onOpenMobileMenu={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 pt-16 w-full px-4 sm:px-6 lg:px-8 bg-background">
          <div className="flex flex-col w-full py-6 sm:py-8 min-h-[calc(100vh-4rem)]">{children}</div>
        </main>
      </div>
    </div>
  );
}
