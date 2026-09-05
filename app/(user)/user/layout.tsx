import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/AppShell";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <DashboardLayout role="user">{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
