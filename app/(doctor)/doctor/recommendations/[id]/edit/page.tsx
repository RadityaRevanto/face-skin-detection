import type { Metadata } from "next";
import Link from "next/link";

import { RecommendationForm } from "@/app/(doctor)/doctor/recommendations/_components/recommendation-form";
import { ROUTES } from "@/lib/constants";

import { getEditRecommendationPageData } from "./lib/edit-recommendation-query";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Rekomendasi | Face Skin Detection",
  description: "Edit rule rekomendasi skincare - Dashboard Dokter",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditRecommendationPage({ params }: PageProps) {
  const { id } = await params;

  const pageData = await getEditRecommendationPageData(id);

  return (
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
          Edit Rule Rekomendasi
        </h1>

        <p className='mt-1 text-sm text-slate-500'>
          Perubahan rule akan memengaruhi rekomendasi yang ditampilkan
          saat user mendapat hasil AI yang cocok.
        </p>
      </div>

      <RecommendationForm
        mode='edit'
        concerns={pageData.concerns}
        products={pageData.products}
        defaultValues={pageData.recommendation}
      />
    </div>
  );
}
