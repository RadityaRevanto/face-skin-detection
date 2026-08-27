import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { requireDoctorProfile } from "@/lib/doctor-auth";

type DoctorLayoutProps = {
  children: ReactNode;
};

export default async function DoctorLayout({ children }: DoctorLayoutProps) {
  const profile = await requireDoctorProfile();

  return (
    <DashboardLayout
      role="doctor"
      profile={{
        full_name: profile.full_name || "Dokter",
        avatar_url: profile.avatar_url || profile.google_avatar_url || null,
        uuid: profile.uuid,
        id: profile.id,
      }}
    >
      {children}
    </DashboardLayout>
  );
}
