import Link from "next/link";

import { RecommendationForm } from "@/app/(doctor)/doctor/recommendations/_components/recommendation-form";
import { DoctorHeader } from "@/components/doctor/doctor-header";
import { DoctorSidebar } from "@/components/doctor/doctor-sidebar";
import { ROUTES } from "@/lib/constants";

import type { CreateRecommendationPageData } from "../lib/create-recommendation-types";

type CreateRecommendationContentProps = CreateRecommendationPageData;

export function CreateRecommendationContent({
  concerns,
  products,
}: CreateRecommendationContentProps) {
  return (
    <main className='min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!'>
      <div className='flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row'>
        <DoctorSidebar />

        <div className='min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!'>
          <DoctorHeader
            title='Tambah Rekomendasi'
            description='Buat rule rekomendasi berdasarkan hasil analisis AI.'
            searchPlaceholder='Cari rekomendasi...'
          />

          <div className='py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8'>
            <div className='w-full space-y-6'>
              <div>
                <Link
                  href={ROUTES.DOCTOR.RECOMMENDATIONS}
                  className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800'
                >
                  <span aria-hidden='true'>←</span>
                  Kembali ke Data Rekomendasi
                </Link>

                <h1 className='mt-4 text-2xl font-bold tracking-tight text-slate-950'>
                  Tambah Rule Rekomendasi
                </h1>

                <p className='mt-1 text-sm text-slate-500'>
                  Rule ini akan dipakai untuk mencocokkan hasil AI user dengan
                  produk skincare yang sesuai.
                </p>
              </div>

              <RecommendationForm concerns={concerns} products={products} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
