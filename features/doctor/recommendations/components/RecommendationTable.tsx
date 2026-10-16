"use client";

import Link from "next/link";
import { FlaskConical, ShieldAlert, Pencil, Layers } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Pagination } from "@/components/ui/pagination";
import type { PagePagination } from "@/lib/types/pagination";

import type { RecommendationRow } from "../lib/recommendationsTypes";
import { DeleteRecommendationButton } from "./DeleteRecommendationButton";

type RecommendationTableProps = {
  recommendations: RecommendationRow[];
  pagination: PagePagination;
};

function PriorityPill({ priority }: { priority: string }) {
  const isHigh = priority.toLowerCase().includes("high");
  const isMed = priority.toLowerCase().includes("medium");

  const colorClass = isHigh
    ? "bg-error-container/30 text-error border-error/20"
    : isMed
      ? "bg-amber-500/10 text-warning border-amber-500/20"
      : "bg-info/10 text-info border-info/20";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-caption text-caption font-semibold border ${colorClass}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isHigh ? "bg-error" : isMed ? "bg-warning" : "bg-info"
        }`}
      />
      {priority}
    </span>
  );
}

export function RecommendationTable({
  recommendations,
  pagination,
}: RecommendationTableProps) {
  return (
    <section className="bg-surface rounded-2xl shadow-xs border border-border/50 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-ink-muted font-eyebrow text-eyebrow uppercase tracking-wider h-12">
              <th className="py-3.5 px-space-md">Target Concern</th>
              <th className="py-3.5 px-space-md">Prioritas</th>
              <th className="py-3.5 px-space-md">Produk Rekomendasi</th>
              <th className="py-3.5 px-space-md">Judul Langkah</th>
              <th className="py-3.5 px-space-md">Catatan Dokter</th>
              <th className="py-3.5 px-space-md text-center">Status</th>
              <th className="py-3.5 px-space-md text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 font-body-default text-body-default text-ink">
            {recommendations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-space-lg py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-ink-subtle">
                      <Layers className="w-6 h-6" />
                    </div>
                    <p className="font-headline-sm text-headline-sm text-ink font-semibold">
                      Belum Ada Aturan Rekomendasi
                    </p>
                    <p className="font-body-default text-caption text-ink-muted max-w-sm">
                      Buat aturan inferensi pertama untuk memetakan hasil deteksi AI ke formula skincare klinik Anda.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              recommendations.map((rec) => (
                <tr
                  key={rec.id}
                  className="h-14 hover:bg-surface-alt transition-colors group"
                >
                  {/* Target Concern */}
                  <td className="py-3.5 px-space-md whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-surface-container-low text-role-accent-doctor flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <span className="font-headline-sm text-headline-sm text-ink font-semibold">
                        {rec.concern}
                      </span>
                    </div>
                  </td>

                  {/* Prioritas */}
                  <td className="py-3.5 px-space-md whitespace-nowrap">
                    <PriorityPill priority={rec.severity} />
                  </td>

                  {/* Produk Rekomendasi */}
                  <td className="py-3.5 px-space-md min-w-[200px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-surface-alt border border-border/40 shrink-0 flex items-center justify-center text-role-accent-doctor">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-headline-sm text-body-default text-ink truncate font-medium">
                          {rec.productName}
                        </span>
                        <span className="font-caption text-[11px] text-role-accent-doctor font-medium capitalize">
                          {rec.productBrand}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Judul Langkah */}
                  <td className="py-3.5 px-space-md min-w-[180px]">
                    <span className="font-headline-sm text-body-default text-ink font-medium">
                      {rec.routineStep}
                    </span>
                  </td>

                  {/* Catatan Dokter */}
                  <td className="py-3.5 px-space-md max-w-[260px]">
                    <p className="text-ink-muted line-clamp-2 text-caption font-caption leading-relaxed">
                      {rec.doctorNote}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-space-md text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-success/10 text-success font-caption text-caption font-semibold">
                      Aktif
                    </span>
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 px-space-md text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={ROUTES.DOCTOR.RECOMMENDATIONS_EDIT(rec.id)}
                        className="p-1.5 rounded-lg text-ink-subtle hover:text-role-accent-doctor hover:bg-surface-container-low transition-colors"
                        title="Ubah Aturan"
                        aria-label="Ubah Aturan"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteRecommendationButton
                        recommendationId={rec.id}
                        recommendationTitle={rec.routineStep}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination.totalPages > 1 && (
        <div className="border-t border-border/40 bg-surface">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            itemLabel={pagination.itemLabel}
            basePath={pagination.basePath}
          />
        </div>
      )}
    </section>
  );
}
