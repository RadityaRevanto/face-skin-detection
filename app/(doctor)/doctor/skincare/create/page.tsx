import type { Metadata } from "next";

import { SkincareCreatePage } from "@/features/doctor/skincare/components/SkincareFormPageClient";

export const metadata: Metadata = {
  title: "Tambah Skincare",
  description: "Tambah produk skincare baru - Dashboard Dokter",
};

export default function CreateSkincarePage() {
  return <SkincareCreatePage />;
}
