"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { useDoctors } from "@/features/doctors/hooks/useDoctors";
import { DoctorsContent } from "@/features/doctors/components/DoctorsContent";

export default function ConsultationsPage() {
  return (
    <Suspense>
      <ConsultationsPageInner />
    </Suspense>
  );
}

function ConsultationsPageInner() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const { data, isLoading, isError } = useDoctors(page, 5);

  const doctors = data?.data ?? [];
  const meta = data?.meta;

  const pagination = {
    currentPage: page,
    totalPages: meta?.last_page ?? 1,
    totalItems: meta?.total ?? 0,
    pageSize: 5,
    basePath: "/user/consultations",
    itemLabel: "dokter",
  };

  if (isLoading) {
    return (
      <main className="w-full px-8 py-8 sm:px-10 lg:px-12">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="w-full px-8 py-8 sm:px-10 lg:px-12">
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center text-sm text-rose-600">
          Gagal memuat daftar dokter. Coba muat ulang halaman.
        </div>
      </main>
    );
  }

  return (
    <main className="w-full px-8 py-8 sm:px-10 lg:px-12">
      <DoctorsContent doctors={doctors} pagination={pagination} />
    </main>
  );
}
