import type { Metadata } from "next";

import { DoctorVerificationContent } from "../components/doctor-verification-content";
import { getDoctorVerificationPageData } from "../lib/doctor-verifications-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pending Verifikasi Dokter | Face Skin Detection",
  description: "Daftar dokter yang menunggu proses verifikasi",
};

type AdminPendingDoctorVerificationsPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function AdminPendingDoctorVerificationsPage({
  searchParams,
}: AdminPendingDoctorVerificationsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page ?? 1);

  const pageData = await getDoctorVerificationPageData({
    page,
    pageType: "pending",
  });

  return <DoctorVerificationContent {...pageData} />;
}
