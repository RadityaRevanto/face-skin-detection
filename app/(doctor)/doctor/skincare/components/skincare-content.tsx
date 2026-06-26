import Link from "next/link";

import { DoctorHeader } from "@/components/doctor/doctor-header";
import { DoctorSidebar } from "@/components/doctor/doctor-sidebar";
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
    <main className='min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!'>
      <div className='flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row'>
        <DoctorSidebar />

        <div className='min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!'>
          <DoctorHeader
            title='Kelola Skincare'
            description='Kelola produk skincare yang digunakan untuk rekomendasi pengguna.'
            searchPlaceholder='Cari produk skincare...'
          />

          <div className='py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8'>
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
          </div>
        </div>
      </div>
    </main>
  );
}
