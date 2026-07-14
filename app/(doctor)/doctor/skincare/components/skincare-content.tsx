import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

import type { SkincarePageData } from "../lib/skincare-types";
import { SkincareSummaryCards } from "./skincare-summary-cards";
import { SkincareTable } from "./skincare-table";

type SkincareContentProps = SkincarePageData;

export function SkincareContent({
  products,
  summary,
  pagination,
}: SkincareContentProps) {
  return (
    <div className='w-full space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-950'>
            Data Skincare
          </h1>

          <p className='mt-1 text-sm text-slate-500'>
            Tambah, tinjau, dan kelola produk skincare berdasarkan
            kategori, skin concern, dan tipe kulit.
          </p>
        </div>

        <Link href={ROUTES.DOCTOR.SKINCARE_CREATE}>
          <Button
            type='button'
            variant='success'
            className='h-11 rounded-xl px-5 font-semibold'
          >
            Tambah Skincare
          </Button>
        </Link>
      </div>

      <SkincareSummaryCards summary={summary} />

      <SkincareTable products={products} pagination={pagination} />
    </div>
  );
}
