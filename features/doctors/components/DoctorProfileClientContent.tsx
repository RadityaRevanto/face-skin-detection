"use client";

import { useSearchParams } from "next/navigation";

import { useDoctorProfile, useDoctorReviews } from "../hooks/useDoctors";
import { DoctorProfileContent } from "./DoctorProfileContent";

type DoctorProfileClientContentProps = {
  doctorUuid: string | null | undefined;
};

export function DoctorProfileClientContent({
  doctorUuid,
}: DoctorProfileClientContentProps) {
  const searchParams = useSearchParams();
  const reviewsPage = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const {
    data: doctor,
    isLoading: isLoadingDoctor,
    isError: isDoctorError,
  } = useDoctorProfile(doctorUuid);

  const {
    data: reviewsResponse,
    isLoading: isLoadingReviews,
    isError: isReviewsError,
  } = useDoctorReviews(doctorUuid, reviewsPage);

  if (isLoadingDoctor) {
    return (
      <main className="w-full px-8 py-8 sm:px-10 lg:px-12">
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
          <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
        </div>
      </main>
    );
  }

  if (isDoctorError || !doctor) {
    return (
      <main className="w-full px-8 py-8 sm:px-10 lg:px-12">
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center text-sm text-rose-600">
          Dokter tidak ditemukan.
        </div>
      </main>
    );
  }

  const reviews = reviewsResponse?.data ?? [];
  const reviewsMeta = reviewsResponse?.meta;

  const reviewsPagination = {
    currentPage: reviewsPage,
    totalPages: reviewsMeta?.last_page ?? 1,
    totalItems: reviewsMeta?.total ?? 0,
    pageSize: reviewsMeta?.per_page ?? 5,
    basePath: doctorUuid ? `/user/consultations/detail?uuid=${encodeURIComponent(doctorUuid)}` : "",
    itemLabel: "review",
  };

  return (
    <main className="w-full px-8 py-8 sm:px-10 lg:px-12">
      <DoctorProfileContent
        doctor={doctor}
        reviews={reviews}
        reviewsPagination={reviewsPagination}
        isLoadingReviews={isLoadingReviews}
        isReviewsError={isReviewsError}
      />
    </main>
  );
}
