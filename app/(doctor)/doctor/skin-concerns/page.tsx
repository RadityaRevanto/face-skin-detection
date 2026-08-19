import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Skin Concern | Face Skin Detection",
  description: "Lihat data skin concern untuk rekomendasi skincare",
};

const PAGE_SIZE = 10;

type PageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

function DetailIcon() {
  return (
    <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z' />
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z' />
    </svg>
  );
}

interface SkinConcernApi {
  id: string;
  uuid: string;
  name: string;
  description?: string;
  default_severity_score?: number | string;
  is_active?: boolean;
}

export default async function DoctorSkinConcernsPage({ searchParams }: PageProps) {
  await requireDoctorProfile();

  const params = await searchParams;
  const pageNumber = Number(params?.page ?? "1");
  const currentPage = Number.isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;

  const from = (currentPage - 1) * PAGE_SIZE;

  let concerns: SkinConcernApi[] = [];
  let totalItems = 0;
  let totalPages = 1;

  try {
    const res = await fetchApi<SkinConcernApi[]>(`/skin-concerns?page=${currentPage}&per_page=${PAGE_SIZE}`);

    concerns = res.data ?? [];
    totalItems = res.meta?.total ?? 0;
    totalPages = res.meta?.last_page ?? 1;
  } catch (error) {
    console.error("Failed to fetch skin concerns:", error);
  }

  const summaryCards = [
    { label: "Total Concern", value: String(totalItems), helper: "Concern yang tersedia di sistem" },
    { label: "Sumber Data", value: "Master", helper: "Diambil dari tabel skin_concerns" },
    { label: "Akses Dokter", value: "Read Only", helper: "Dokter hanya dapat melihat detail" },
  ];

  return (
    <div className='w-full space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-950'>
            Data Skin Concern
          </h1>
          <p className='mt-1 text-sm text-slate-500'>
            Data ini berasal dari master skin concern dan digunakan sebagai acuan rekomendasi skincare.
          </p>
        </div>
      </div>

      <section className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {summaryCards.map((item) => (
          <Card key={item.label} className='rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
            <p className='text-sm font-semibold text-slate-500'>{item.label}</p>
            <p className='mt-3 text-3xl font-bold tracking-tight text-slate-950'>{item.value}</p>
            <p className='mt-1 text-xs text-slate-500'>{item.helper}</p>
          </Card>
        ))}
      </section>

      <Card className='overflow-hidden rounded-2xl border-slate-100! bg-white! text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
        <Table className='min-w-full divide-y divide-gray-100'>
          <TableHeader className='bg-gray-50/80'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-20 px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>No</TableHead>
              <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>Skin Concern</TableHead>
              <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>Default Severity</TableHead>
              <TableHead className='px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>Detail</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className='divide-y divide-gray-100 bg-white'>
            {concerns.map((concern, index) => (
              <TableRow key={concern.id} className='group border-gray-100 transition-colors hover:bg-emerald-50/30'>
                <TableCell className='whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-500 sm:px-8'>
                  {from + index + 1}
                </TableCell>
                <TableCell className='min-w-72 px-6 py-5 sm:px-8'>
                  <div className='text-sm font-semibold text-gray-800 transition-colors group-hover:text-emerald-700'>
                    {concern.name ?? "-"}
                  </div>
                  <div className='mt-1 text-xs text-gray-500'>
                    {concern.description ?? "Tidak ada deskripsi."}
                  </div>
                </TableCell>
                <TableCell className='whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-700 sm:px-8'>
                  {concern.default_severity_score ?? "-"}
                </TableCell>
                <TableCell className='whitespace-nowrap px-6 py-5 text-right text-sm font-medium sm:px-8'>
                  <Link href={`/doctor/skin-concerns/${concern.id}`}>
                    <Button type='button' variant='ghost' size='sm' title='Lihat Detail' className='h-10 w-10 rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-emerald-50! hover:text-emerald-700'>
                      <DetailIcon />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {concerns.length === 0 ? (
          <div className='border-t border-gray-100 bg-white px-6 py-8 text-sm font-semibold text-gray-500 sm:px-8'>
            Belum ada data skin concern.
          </div>
        ) : null}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
        />
      </Card>
    </div>
  );
}
