import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/AppShell";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { DoctorGate } from "@/features/auth/components/DoctorGate";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorGate>
        <DashboardLayout role="doctor">{children}</DashboardLayout>
      </DoctorGate>
    </ProtectedRoute>
  );
}
