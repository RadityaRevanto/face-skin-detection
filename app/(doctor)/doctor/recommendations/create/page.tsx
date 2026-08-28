import type { Metadata } from "next";

import { CreateRecommendationContent } from "@/src/features/doctor/recommendations/create/components/CreateRecommendationContent";
import { getCreateRecommendationPageData } from "@/src/features/doctor/recommendations/create/lib/createRecommendationQuery";


export const metadata: Metadata = {
  title: "Tambah Rekomendasi | Face Skin Detection",
  description: "Tambah rule rekomendasi skincare - Dashboard Dokter",
};

export default async function CreateRecommendationPage() {
  const pageData = await getCreateRecommendationPageData();

  return <CreateRecommendationContent {...pageData} />;
}
