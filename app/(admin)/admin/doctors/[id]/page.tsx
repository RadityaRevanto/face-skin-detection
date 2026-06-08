import type { Metadata } from "next";

import { DoctorDetailContent } from "./components/doctor-detail-content";
import { getDoctorDetail } from "./lib/doctor-detail-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detail Dokter | Face Skin Detection",
  description: "Detail profil dokter",
};

type AdminDoctorDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminDoctorDetailPage({
  params,
}: AdminDoctorDetailPageProps) {
  const { id } = await params;

  const doctor = await getDoctorDetail(id);

  return <DoctorDetailContent doctor={doctor} />;
}
