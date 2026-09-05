import type { Metadata } from "next";

import { SkincareEditPage } from "@/features/doctor/skincare/components/SkincareFormPageClient";

export const metadata: Metadata = {
  title: "Edit Skincare",
  description: "Edit produk skincare - Dashboard Dokter",
};

// Static route — identitas produk via query param ?id=<uuid>
export default function EditSkincarePage() {
  return <SkincareEditPage />;
}
