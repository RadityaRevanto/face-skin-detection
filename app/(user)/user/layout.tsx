import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { requireUserRole } from "@/lib/auth";

export default async function UserLayout({ children }: { children: ReactNode }) {
  const profile = await requireUserRole();

  return (
    <DashboardLayout
      role="user"
      profile={{
        full_name: profile.full_name || "Pengguna",
        avatar_url: profile.avatar_url || profile.google_avatar_url || null,
        uuid: profile.uuid,
        id: profile.uuid,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
