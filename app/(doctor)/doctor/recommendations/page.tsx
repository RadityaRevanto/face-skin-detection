import type { Metadata } from "next";

import { RecommendationsClientPage } from "@/features/doctor/recommendations/components/RecommendationsClientPage";

export const metadata: Metadata = {
  title: "Kelola Rekomendasi",
  description: "Kelola rule rekomendasi skincare - Dashboard Dokter",
};

export default function DoctorRecommendationsPage() {
  return <RecommendationsClientPage />;
}
