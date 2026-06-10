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
import { ROUTES } from "@/lib/constants";

import type { RecommendationRow } from "../lib/recommendations-types";
import { DeleteRecommendationButton } from "./delete-recommendation-button";
import { RecommendationActionIcon } from "./recommendation-action-icon";

type RecommendationTableProps = {
  recommendations: RecommendationRow[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};

export function RecommendationTable({
  recommendations,
  pagination,
}: RecommendationTableProps) {
  return (
    <Card className='overflow-hidden rounded-2xl border-slate-100! bg-white! text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
      <Table className='min-w-full divide-y divide-gray-100'>
        <TableHeader className='bg-gray-50/80'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='w-20 px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              No
            </TableHead>

            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Rule Match AI
            </TableHead>

            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Produk
            </TableHead>

            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Routine
            </TableHead>

            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Catatan
            </TableHead>

            <TableHead className='px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className='divide-y divide-gray-100 bg-white'>
          {recommendations.map((recommendation) => (
            <TableRow
              key={recommendation.id}
              className='group border-gray-100 transition-colors hover:bg-emerald-50/30'
            >
              <TableCell className='whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-500 sm:px-8'>
                {recommendation.no}
              </TableCell>

              <TableCell className='min-w-64 px-6 py-5 sm:px-8'>
                <div className='text-sm font-semibold text-gray-800 transition-colors group-hover:text-emerald-700'>
                  {recommendation.concern}
                </div>
                <div className='mt-1 text-xs text-gray-500'>
                  {recommendation.severity} · {recommendation.skinType}
                </div>
              </TableCell>

              <TableCell className='min-w-56 px-6 py-5 sm:px-8'>
                <div className='text-sm font-medium text-gray-700'>
                  {recommendation.productName}
                </div>
                <div className='mt-1 text-xs text-gray-500'>
                  {recommendation.productBrand}
                </div>
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 text-sm text-gray-500 sm:px-8'>
                {recommendation.routineStep}
              </TableCell>

              <TableCell className='min-w-72 px-6 py-5 text-sm text-gray-500 sm:px-8'>
                {recommendation.doctorNote}
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 text-right text-sm font-medium sm:px-8'>
                <div className='flex items-center justify-end gap-2'>
                  <Link
                    href={ROUTES.DOCTOR.RECOMMENDATIONS_EDIT(recommendation.id)}
                  >
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      title='Edit'
                      className='h-10 w-10 rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-emerald-50! hover:text-emerald-700'
                    >
                      <RecommendationActionIcon type='edit' />
                    </Button>
                  </Link>

                  <DeleteRecommendationButton
                    recommendationId={recommendation.id}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {recommendations.length === 0 ? (
        <div className='border-t border-gray-100 bg-white px-6 py-8 text-sm font-semibold text-gray-500 sm:px-8'>
          Belum ada data rekomendasi.
        </div>
      ) : null}

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
      />
    </Card>
  );
}
