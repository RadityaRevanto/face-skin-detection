import type { Metadata } from "next";

import { DoctorsContent } from "@/src/features/doctors/components/DoctorsContent";
import { getDoctorsPageData } from "@/src/features/doctors/lib/doctorsQuery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Konsultasi Dokter",
  description: "Cari dan pilih dokter spesialis untuk konsultasi",
};

type ConsultationsPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function ConsultationsPage({
  searchParams,
}: ConsultationsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, Number(resolvedSearchParams?.page ?? "1") || 1);

  const pageData = await getDoctorsPageData({ page });

  return <DoctorsContent {...pageData} />;
}
