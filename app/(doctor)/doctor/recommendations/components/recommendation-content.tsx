import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

import type { RecommendationsPageData } from "../lib/recommendations-types";
import { RecommendationSummaryCards } from "./recommendation-summary-cards";
import { RecommendationTable } from "./recommendation-table";

type RecommendationContentProps = RecommendationsPageData;

export function RecommendationContent({
  recommendations,
  summary,
  pagination,
}: RecommendationContentProps) {
  return (
    <div className='w-full space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-950'>
            Rule Rekomendasi Skincare
          </h1>
          <p className='mt-1 text-sm text-slate-500'>
            Sistem mencocokkan hasil AI user dengan rule concern,
            severity, tipe kulit, dan step routine dari dokter.
          </p>
        </div>

        <Link href={ROUTES.DOCTOR.RECOMMENDATIONS_CREATE}>
          <Button
            type='button'
            variant='success'
            className='h-11 rounded-xl px-5 font-semibold'
          >
            Tambah Rekomendasi
          </Button>
        </Link>
      </div>

      <RecommendationSummaryCards summary={summary} />

      <RecommendationTable
        recommendations={recommendations}
        pagination={pagination}
      />
    </div>
  );
}
