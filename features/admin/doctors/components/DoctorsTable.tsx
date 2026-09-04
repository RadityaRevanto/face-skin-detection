import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { TableWidget } from "@/components/ui/table-widget";
import type { PagePagination } from "@/lib/types/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DoctorRow } from "@/features/admin/doctors/lib/doctorsTypes";
import { ActionIcon } from "./DoctorActionIcon";

type DoctorsTableProps = {
  doctors: DoctorRow[];
  pagination: PagePagination;
};

export function DoctorsTable({ doctors, pagination }: DoctorsTableProps) {
  const paginationNode = (
    <Pagination
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      totalItems={pagination.totalItems}
      pageSize={pagination.pageSize}
      itemLabel={pagination.itemLabel}
      basePath={pagination.basePath}
    />
  );

  const tableNode = (
    <Table className="min-w-full divide-y divide-slate-100">
      <TableHeader className="bg-slate-50/80">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-20 px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-8">
            No
          </TableHead>

          <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-8">
            Nama Lengkap
          </TableHead>

          <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-8">
            Email
          </TableHead>

          <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-8">
            Nomor STR / Identitas Dokter
          </TableHead>

          <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-8">
            Spesialisasi
          </TableHead>

          <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-8">
            Tanggal Verifikasi
          </TableHead>

          <TableHead className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-8">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="divide-y divide-slate-100 bg-white">
        {doctors.map((doctor) => (
          <TableRow
            key={doctor.id}
            className="group border-slate-100 transition-colors hover:bg-emerald-50/30"
          >
            <TableCell className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-500 sm:px-8">
              {doctor.no}
            </TableCell>

            <TableCell className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-700 transition-colors group-hover:text-emerald-700 sm:px-8">
              {doctor.name}
            </TableCell>

            <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-slate-500 sm:px-8">
              {doctor.email}
            </TableCell>

            <TableCell className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-700 sm:px-8">
              {doctor.identity}
            </TableCell>

            <TableCell className="whitespace-nowrap px-6 py-5 sm:px-8">
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="truncate">{doctor.specialization}</span>
              </span>
            </TableCell>

            <TableCell className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-700 sm:px-8">
              {doctor.verifiedAt}
              <div className="mt-1 text-xs font-normal text-slate-500">
                Verification approved
              </div>
            </TableCell>

            <TableCell className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium sm:px-8">
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin/doctors/detail?id=${encodeURIComponent(doctor.id)}`}
                  title="View"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl p-0 text-slate-400 transition-all duration-200 hover:bg-sky-50! hover:text-sky-700"
                >
                  <ActionIcon type="view" />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Mobile card list (§4.2 §5.4) — nama + badge spesialisasi, STR, tanggal verified, View.
  // No. urut & email dihilangkan di mobile (prioritas kolom §4.2).
  const cardsNode = (
    <div className="divide-y divide-slate-100 bg-white">
      {doctors.map((doctor) => (
        <div key={doctor.id} className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="min-w-0 truncate text-sm font-bold text-slate-900">
                {doctor.name}
              </p>
              <span className="inline-flex max-w-full items-center rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                <span className="truncate">{doctor.specialization}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-600">STR:</span>{" "}
              {doctor.identity}
            </p>
            <p className="text-xs text-slate-400">
              Verified: {doctor.verifiedAt}
            </p>
          </div>

          <Link
            href={`/admin/doctors/detail?id=${encodeURIComponent(doctor.id)}`}
            title="View"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-sky-50! hover:text-sky-700"
          >
            <ActionIcon type="view" />
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <TableWidget
      table={tableNode}
      cards={doctors.length > 0 ? cardsNode : undefined}
      empty={
        doctors.length === 0 ? (
          <EmptyState
            title="Belum ada data doctor yang sudah verified"
            description="Dokter yang lulus verifikasi akan tampil di sini."
          />
        ) : undefined
      }
      footer={paginationNode}
    />
  );
}
