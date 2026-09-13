import type { SkinConcernsPageData } from "../lib/skinConcernsTypes";
import { SkinConcernsTable } from "./SkinConcernsTable";

type SkinConcernsContentProps = SkinConcernsPageData;

export function SkinConcernsContent({
  concerns,
  pagination,
}: SkinConcernsContentProps) {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Data Skin Concern</h1>
          <p className="mt-1 text-sm text-slate-500">
            {pagination.totalItems} concern dari data master — acuan rekomendasi
            skincare, hanya dapat dilihat (read-only).
          </p>
        </div>
      </div>
      <SkinConcernsTable concerns={concerns} pagination={pagination} />
    </div>
  );
}
