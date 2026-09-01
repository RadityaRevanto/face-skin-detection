import type { Metadata } from "next";

import { SkinConcernsClientPage } from "@/features/doctor/skin-concerns/components/SkinConcernsClientPage";

export const metadata: Metadata = {
  title: "Kelola Skin Concern",
  description: "Lihat data skin concern untuk rekomendasi skincare",
};

export default function DoctorSkinConcernsPage() {
  return <SkinConcernsClientPage />;
}
