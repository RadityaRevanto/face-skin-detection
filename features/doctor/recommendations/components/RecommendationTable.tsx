import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { TableWidget } from "@/components/ui/table-widget";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/lib/constants";
import type { PagePagination } from "@/lib/types/pagination";

import type { RecommendationRow } from "@/features/doctor/recommendations/lib/recommendationsTypes";
import { DeleteRecommendationButton } from "./DeleteRecommendationButton";
import { RecommendationActionIcon } from "./RecommendationActionIcon";

type RecommendationTableProps = {
  recommendations: RecommendationRow[];
  pagination: PagePagination;
};

const PRIORITY_BADGE: Record<string, string> = {
  "High Priority": "border-rose-100 bg-rose-50 text-rose-700",
  "Medium Priority": "border-amber-100 bg-amber-50 text-amber-700",
  "Low Priority": "border-sky-100 bg-sky-50 text-sky-700",
};

function PriorityBadge({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
        PRIORITY_BADGE[label] ?? "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {label}
    </span>
  );
}

export function RecommendationTable({
  recommendations,
  pagination,
}: RecommendationTableProps) {
  const renderActions = (rec: RecommendationRow) => (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={ROUTES.DOCTOR.RECOMMENDATIONS_EDIT(rec.id)}
        aria-label="Edit rekomendasi"
        title="Edit"
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] text-slate-400 transition-colors duration-[var(--motion-fast)] hover:bg-[var(--role-accent-soft)] hover:text-[var(--role-accent-strong)]"
      >
        <RecommendationActionIcon type="edit" />
      </Link>
      <DeleteRecommendationButton
        recommendationId={rec.id}
        recommendationTitle={rec.routineStep}
      />
    </div>
  );

  const tableNode = (
    <Table className="min-w-full divide-y divide-slate-100">
      <TableHeader className="bg-slate-50/80">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-14 px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            No
          </TableHead>
          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Skin Concern
          </TableHead>
          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Produk
          </TableHead>
          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Langkah Rutin
          </TableHead>
          <TableHead className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Catatan
          </TableHead>
          <TableHead className="px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="divide-y divide-slate-100 bg-white">
        {recommendations.map((rec) => (
          <TableRow
            key={rec.id}
            className="group border-slate-100 transition-colors hover:bg-[var(--role-accent-soft)]/40"
          >
            <TableCell className="px-4 py-3.5 text-sm font-medium text-slate-500 tabular-nums">
              {rec.no}
            </TableCell>

            <TableCell className="px-4 py-3.5">
              <div className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-[var(--role-accent-strong)]">
                {rec.concern}
              </div>
              <div className="mt-1">
                <PriorityBadge label={rec.severity} />
              </div>
            </TableCell>

            <TableCell className="px-4 py-3.5">
              <div className="text-sm font-medium text-slate-700">
                {rec.productName}
              </div>
              <div className="mt-0.5 text-xs text-slate-400">
                {rec.productBrand}
              </div>
            </TableCell>

            <TableCell className="px-4 py-3.5 text-sm text-slate-500">
              {rec.routineStep}
            </TableCell>

            <TableCell className="max-w-72 px-4 py-3.5 text-sm text-slate-500">
              <p className="line-clamp-2">{rec.doctorNote}</p>
            </TableCell>

            <TableCell className="px-4 py-3.5 text-right text-sm font-medium">
              {renderActions(rec)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const cardsNode = (
    <div className="divide-y divide-slate-100 bg-white">
      {recommendations.map((rec) => (
        <div key={rec.id} className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="min-w-0 truncate text-sm font-bold text-slate-900">
                {rec.concern}
              </p>
              <PriorityBadge label={rec.severity} />
            </div>
            <p className="truncate text-xs text-slate-500">
              {rec.productName} · {rec.routineStep}
            </p>
            <p className="line-clamp-2 text-xs text-slate-400">
              {rec.doctorNote}
            </p>
          </div>
          {renderActions(rec)}
        </div>
      ))}
    </div>
  );

  return (
    <TableWidget
      table={tableNode}
      cards={recommendations.length > 0 ? cardsNode : undefined}
      empty={
        recommendations.length === 0 ? (
          <EmptyState
            title="Belum ada rekomendasi"
            description="Buat aturan pertama agar hasil scan pasien otomatis mendapat saran."
            action={
              <Link
                href={ROUTES.DOCTOR.RECOMMENDATIONS_CREATE}
                className="inline-flex h-9 items-center rounded-[var(--radius-control)] bg-emerald-600 px-4 text-sm font-semibold text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-emerald-700"
              >
                Tambah Rekomendasi
              </Link>
            }
          />
        ) : undefined
      }
      footer={
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          itemLabel={pagination.itemLabel}
          basePath={pagination.basePath}
        />
      }
    />
  );
}