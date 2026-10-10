import type { ReactNode } from "react";

import { DoctorAppShell } from "@/features/doctor/components/DoctorAppShell";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { DoctorGate } from "@/features/auth/components/DoctorGate";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorGate>
        <DoctorAppShell>{children}</DoctorAppShell>
      </DoctorGate>
    </ProtectedRoute>
  );
}
