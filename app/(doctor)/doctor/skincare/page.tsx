import type { Metadata } from "next";

import { SkincarePageWithSuspense } from "@/features/doctor/skincare/components/SkincareClientContent";

export const metadata: Metadata = {
  title: "Kelola Skincare",
  description: "Kelola produk skincare - Dashboard Dokter",
};

export default function DoctorSkincarePage() {
  return <SkincarePageWithSuspense />;
}
