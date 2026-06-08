import type { Metadata } from "next";

import { DoctorVerificationContent } from "./components/doctor-verification-content";
import { getDoctorVerificationPageData } from "./lib/doctor-verifications-query";

export const metadata: Metadata = {
  title: "Verifikasi Dokter | Face Skin Detection",
  description: "Review dan verifikasi dokumen dokter",
};

type AdminDoctorVerificationsPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function AdminDoctorVerificationsPage({
  searchParams,
}: AdminDoctorVerificationsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);

  const pageData = await getDoctorVerificationPageData({ page });

  return <DoctorVerificationContent {...pageData} />;
}
