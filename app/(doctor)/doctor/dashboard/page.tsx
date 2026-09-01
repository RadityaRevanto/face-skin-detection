import type { Metadata } from "next";

import { DoctorDashboardContent } from "@/features/doctor/dashboard/components/DoctorDashboardContent";

export const metadata: Metadata = {
  title: "Dashboard Dokter",
  description: "Dashboard dokter - kelola skincare dan rekomendasi",
};

export default function DoctorDashboardPage() {
  return <DoctorDashboardContent />;
}
