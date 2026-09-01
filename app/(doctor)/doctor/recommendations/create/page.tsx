import type { Metadata } from "next";

import { RecommendationCreateClientPage } from "@/features/doctor/recommendations/components/RecommendationFormClientPage";

export const metadata: Metadata = {
  title: "Tambah Rekomendasi",
  description: "Tambah rule rekomendasi skincare baru - Dashboard Dokter",
};

export default function CreateRecommendationPage() {
  return <RecommendationCreateClientPage />;
}
