import type { Metadata } from "next";

import { AdminDashboardClientContent } from "@/features/admin/dashboard/components/AdminDashboardClientContent";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  description: "Dashboard administrasi sistem",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClientContent />;
}
