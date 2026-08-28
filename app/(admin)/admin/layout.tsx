import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/AppShell";
import { getPendingVerificationCount } from "@/src/features/admin/verifications/lib/doctorVerificationsQuery";

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
