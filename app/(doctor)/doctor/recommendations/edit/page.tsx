import type { Metadata } from "next";

import { RecommendationEditClientPage } from "@/features/doctor/recommendations/components/RecommendationFormClientPage";

export const metadata: Metadata = {
  title: "Edit Rekomendasi",
  description: "Edit rule rekomendasi skincare - Dashboard Dokter",
};

// Static route — identitas rekomendasi via query param ?id=<uuid>
export default function EditRecommendationPage() {
  return <RecommendationEditClientPage />;
}
