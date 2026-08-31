import type { Metadata } from "next";

import { SkinConcernsContent } from "@/src/features/doctor/skin-concerns/components/SkinConcernsContent";
import { getSkinConcernsPageData } from "@/src/features/doctor/skin-concerns/lib/skinConcernsQuery";

export const metadata: Metadata = {
  title: "Kelola Skin Concern",
  description: "Lihat data skin concern untuk rekomendasi skincare",
};

type PageProps = { searchParams?: Promise<{ page?: string }> };

export default async function DoctorSkinConcernsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page ?? "1") || 1);

  const pageData = await getSkinConcernsPageData({ page });

  return <SkinConcernsContent {...pageData} />;
}
