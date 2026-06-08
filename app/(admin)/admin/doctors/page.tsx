import type { Metadata } from "next";

import { DoctorsContent } from "./components/doctors-content";
import { getDoctorsPageData } from "./lib/doctors-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manajemen Dokter | Face Skin Detection",
  description: "Kelola daftar dokter terdaftar",
};

type AdminDoctorsPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function AdminDoctorsPage({
  searchParams,
}: AdminDoctorsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);

  const pageData = await getDoctorsPageData({ page });

  return <DoctorsContent {...pageData} />;
}
