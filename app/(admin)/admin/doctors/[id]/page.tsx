import type { Metadata } from "next";

import { DoctorDetailContent } from "@/src/features/admin/doctors/[id]/components/DoctorDetailContent";
import { getDoctorDetail } from "@/src/features/admin/doctors/[id]/lib/doctorDetailQuery";


export const metadata: Metadata = {
  title: "Detail Dokter",
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
