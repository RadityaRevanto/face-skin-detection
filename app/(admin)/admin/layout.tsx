import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getPendingVerificationCount } from "./doctor-verifications/lib/doctor-verifications-query";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const pendingCount = await getPendingVerificationCount();

  return (
    <DashboardLayout
      role="admin"
      headerExtra={{ pendingCount }}
    >
      {children}
    </DashboardLayout>
  );
}
