import type { ReactNode } from "react";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { AdminShell } from "@/features/admin/components/AdminShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminShell>{children}</AdminShell>
    </ProtectedRoute>
  );
}
