import Link from "next/link";
import { ChevronRight } from "lucide-react";

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

export function SkinConcernsTable({
  concerns,
  pagination,
}: SkinConcernsTableProps) {
  return (
    <div className="bg-surface rounded-2xl shadow-xs border border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-border/40 hover:bg-slate-50">
              <TableHead className="py-3.5 px-6 font-caption text-caption text-ink-subtle uppercase tracking-wider font-semibold">
                Nama Concern
              </TableHead>
              <TableHead className="py-3.5 px-6 font-caption text-caption text-ink-subtle uppercase tracking-wider font-semibold">
                Label Model ML
              </TableHead>
              <TableHead className="py-3.5 px-6 font-caption text-caption text-ink-subtle uppercase tracking-wider font-semibold">
                Deskripsi Klinis
              </TableHead>
              <TableHead className="py-3.5 px-6 font-caption text-caption text-ink-subtle uppercase tracking-wider font-semibold">
                Status
              </TableHead>
              <TableHead className="py-3.5 px-6 font-caption text-caption text-ink-subtle uppercase tracking-wider font-semibold text-right">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-border/30">
            {concerns.map((concern) => {
              const isActive = concern.is_active !== false;

              return (
                <TableRow
                  key={concern.uuid}
                  className="hover:bg-surface-alt/60 transition-colors"
                >
                  {/* Nama Concern */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-role-accent-doctor shrink-0" />
                      <span className="font-headline-sm text-caption text-ink font-semibold">
                        {concern.name ?? "-"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Label Model ML */}
                  <TableCell className="px-6 py-4 font-mono">
                    <span className="bg-surface-container-low text-role-accent-doctor px-2.5 py-1 rounded-md font-caption text-caption font-semibold">
                      {concern.ml_label ?? (concern.name ? concern.name.toLowerCase().replace(/\s+/g, "_") : "-")}
                    </span>
                  </TableCell>

                  {/* Deskripsi Klinis */}
                  <TableCell className="px-6 py-4">
                    <p className="font-body-default text-body-default text-ink-muted line-clamp-1 max-w-md">
                      {concern.description || "Referensi kondisi patologis klinis kulit."}
                    </p>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-success px-2.5 py-1 rounded-full font-caption text-caption font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" />
                        Aktif Deteksi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-warning px-2.5 py-1 rounded-full font-caption text-caption font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                        Dalam Evaluasi
                      </span>
                    )}
                  </TableCell>

                  {/* Aksi */}
                  <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                    <Link
                      href={`/doctor/skin-concerns/detail?id=${encodeURIComponent(concern.uuid)}`}
                      className="inline-flex items-center gap-1 text-role-accent-doctor hover:underline font-headline-sm text-caption font-semibold transition-all cursor-pointer"
                    >
                      <span>Lihat Detail</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {concerns.length === 0 && (
        <div className="p-8">
          <EmptyState
            title="Tidak ada skin concern ditemukan"
            description="Tidak ada data masalah kulit yang cocok dengan kriteria pencarian Anda."
          />
        </div>
      )}

      {/* Pagination Footer */}
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
    </div>
  );
}
