import type { Metadata } from "next";

import { DoctorsContent } from "@/src/features/admin/doctors/components/DoctorsContent";
import { getDoctorsPageData } from "@/src/features/admin/doctors/lib/doctorsQuery";


export const metadata: Metadata = {
  title: "Manajemen Dokter",
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
