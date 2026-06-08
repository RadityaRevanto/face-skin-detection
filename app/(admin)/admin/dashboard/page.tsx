import type { Metadata } from "next";

import { AdminDashboardContent } from "./components/admin-dashboard-content";
import { getAdminDashboardData } from "./lib/admin-dashboard-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Admin | Face Skin Detection",
  description: "Dashboard administrasi sistem",
};

export default async function AdminDashboardPage() {
  const dashboardData = await getAdminDashboardData();

  return <AdminDashboardContent {...dashboardData} />;
}
