import type { Metadata } from "next";

import { AdminDashboardContent } from "@/src/features/admin/dashboard/components/AdminDashboardContent";
import { getAdminDashboardData } from "@/src/features/admin/dashboard/lib/adminDashboardQuery";


export const metadata: Metadata = {
  title: "Dashboard Admin | Face Skin Detection",
  description: "Dashboard administrasi sistem",
};

export default async function AdminDashboardPage() {
  const dashboardData = await getAdminDashboardData();

  return <AdminDashboardContent {...dashboardData} />;
}
