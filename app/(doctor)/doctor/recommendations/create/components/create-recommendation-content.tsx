import Link from "next/link";

import { RecommendationForm } from "@/app/(doctor)/doctor/recommendations/_components/recommendation-form";
import { ROUTES } from "@/lib/constants";

import type { CreateRecommendationPageData } from "../lib/create-recommendation-types";

type CreateRecommendationContentProps = CreateRecommendationPageData;

export function CreateRecommendationContent({
  concerns,
  products,
}: CreateRecommendationContentProps) {
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
          Tambah Rule Rekomendasi
        </h1>

        <p className='mt-1 text-sm text-slate-500'>
          Rule ini akan dipakai untuk mencocokkan hasil AI user dengan
          produk skincare yang sesuai.
        </p>
      </div>

      <RecommendationForm concerns={concerns} products={products} />
    </div>
  );
}
