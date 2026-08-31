import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/AppShell";
import { getPendingVerificationCount } from "@/src/features/admin/verifications/lib/doctorVerificationsQuery";
import { getAdminProfileData } from "@/src/features/admin/profile/lib/adminProfileQuery";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const [pendingCount, adminProfile] = await Promise.all([
    getPendingVerificationCount(),
    getAdminProfileData(),
  ]);

  return (
    <DashboardLayout
      role="admin"
      headerExtra={{ pendingCount }}
      profile={
        adminProfile
          ? {
              full_name: adminProfile.full_name || "Admin",
              avatar_url: adminProfile.avatar_url,
              uuid: adminProfile.uuid,
              id: adminProfile.uuid,
            }
          : undefined
      }
    >
      {children}
    </DashboardLayout>
  );
}
