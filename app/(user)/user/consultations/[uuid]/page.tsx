import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DoctorProfileContent } from "@/src/features/doctors/components/DoctorProfileContent";
import {
  getDoctorProfile,
  getDoctorReviewsPageData,
} from "@/src/features/doctors/lib/doctorsQuery";

type DoctorProfilePageProps = {
  params: Promise<{ uuid: string }>;
  searchParams?: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: DoctorProfilePageProps) {
  const { uuid } = await params;
  const doctor = await getDoctorProfile(uuid);

  if (!doctor) return { title: "Dokter Tidak Ditemukan" };
  return {
    title: doctor.title ? `${doctor.full_name}, ${doctor.title}` : doctor.full_name,
    description: doctor.specialization ?? "Profil dokter",
  };
}

export default async function DoctorProfilePage({
  params,
  searchParams,
}: DoctorProfilePageProps) {
  const [{ uuid }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const page = Math.max(1, Number(resolvedSearchParams?.page ?? "1") || 1);

  const [doctor, reviewsData] = await Promise.all([
    getDoctorProfile(uuid),
    getDoctorReviewsPageData(uuid, { page }),
  ]);

  if (!doctor) {
    notFound();
  }

  return (
    <DoctorProfileContent
      doctor={doctor}
      reviews={reviewsData.reviews}
      reviewsPagination={reviewsData.pagination}
    />
  );
}
