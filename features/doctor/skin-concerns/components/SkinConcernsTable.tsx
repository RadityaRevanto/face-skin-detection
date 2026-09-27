import Link from "next/link";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { PagePagination } from "@/lib/types/pagination";
import type { SkinConcernRow } from "../lib/skinConcernsTypes";

type SkinConcernsTableProps = {
  concerns: SkinConcernRow[];
  pagination: PagePagination;
};

export function SkinConcernsTable({ concerns, pagination }: SkinConcernsTableProps) {
  const from = (pagination.currentPage - 1) * pagination.pageSize;

  return (
    <Card>
      <Table className="min-w-full divide-y divide-slate-100">
        <TableHeader className="bg-slate-50/80">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-16 px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:px-8">No</TableHead>
            <TableHead className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:px-8">Skin Concern</TableHead>
            <TableHead className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:px-8">Default Severity</TableHead>
            <TableHead className="px-6 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:px-8">Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100 bg-white">
          {concerns.map((concern, index) => (
            <TableRow
              key={concern.uuid}
              className="group border-slate-100 transition-colors hover:bg-[var(--role-accent-soft)]/40"
            >
              <TableCell className="whitespace-nowrap px-6 py-3.5 text-sm font-medium text-slate-500 tabular-nums sm:px-8">{from + index + 1}</TableCell>
              <TableCell className="min-w-72 px-6 py-3.5 sm:px-8">
                <div className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-[var(--role-accent-strong)]">{concern.name ?? "-"}</div>
                <div className="mt-0.5 line-clamp-1 text-xs text-slate-400">{concern.description ?? "Tidak ada deskripsi."}</div>
              </TableCell>
              <TableCell className="whitespace-nowrap px-6 py-3.5 text-sm font-medium text-slate-700 tabular-nums sm:px-8">{concern.default_severity_score ?? "-"}</TableCell>
              <TableCell className="whitespace-nowrap px-6 py-3.5 text-right text-sm font-medium sm:px-8">
                <Link href={`/doctor/skin-concerns/detail?id=${encodeURIComponent(concern.uuid)}`}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    title="Lihat Detail"
                    aria-label="Lihat detail"
                    className="h-9 w-9 rounded-[var(--radius-control)] p-0 text-slate-400 transition-colors hover:bg-[var(--role-accent-soft)] hover:text-[var(--role-accent-strong)]"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {concerns.length === 0 ? (
        <div className="border-t border-slate-100 px-6 py-8">
          <EmptyState
            title="Data master skin concern kosong"
            description="Hubungi admin untuk mengisi data skin concern."
          />
        </div>
      ) : null}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        itemLabel={pagination.itemLabel}
        basePath={pagination.basePath}
      />
    </Card>
  );
}