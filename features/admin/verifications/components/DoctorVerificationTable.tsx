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

import type {
  DoctorVerificationPageType,
  DoctorVerificationRequest,
} from "@/features/admin/verifications/lib/doctorVerificationTypes";
import { DocumentIcon, ViewIcon } from "./DoctorVerificationIcons";
import { StatusBadge } from "@/features/admin/components/StatusBadge";

type DoctorVerificationTableProps = {
  pageType: DoctorVerificationPageType;
  verificationRequests: DoctorVerificationRequest[];
  pagination: PagePagination;
};

export function DoctorVerificationTable({
  pageType,
  verificationRequests,
  pagination,
}: DoctorVerificationTableProps) {
  const isRejectedPage = pageType === "rejected";

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
            Dokumen
          </TableHead>

          <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-8">
            Status
          </TableHead>

          {isRejectedPage ? (
            <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-8">
              Alasan Penolakan
            </TableHead>
          ) : null}

          <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-8">
            {isRejectedPage ? "Ditolak" : "Diajukan"}
          </TableHead>

          <TableHead className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-8">
            Aksi
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="divide-y divide-slate-100 bg-white">
        {verificationRequests.map((doctor) => (
          <TableRow
            key={doctor.id}
            className="group border-slate-100 transition-colors hover:bg-emerald-50/30"
          >
            <TableCell className="px-6 py-5 text-sm font-medium text-slate-500 sm:px-8">
              {doctor.no}
            </TableCell>

            <TableCell className="px-6 py-5 text-sm font-medium text-slate-700 transition-colors group-hover:text-emerald-700 sm:px-8">
              {doctor.name}
            </TableCell>

            <TableCell className="px-6 py-5 text-sm text-slate-500 sm:px-8">
              {doctor.email}
            </TableCell>

            <TableCell className="px-6 py-5 text-sm font-medium text-slate-700 sm:px-8">
              {doctor.identity}
            </TableCell>

            <TableCell className="max-w-[200px] px-6 py-5 sm:px-8">
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                <span className="truncate">{doctor.specialization}</span>
              </span>
            </TableCell>

            <TableCell className="max-w-[200px] px-6 py-5 sm:px-8">
              {doctor.documents.length > 0 ? (
                <a
                  href={doctor.documents[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <DocumentIcon />
                  <span className="truncate">
                    {doctor.documents[0].file_name ?? "Dokumen"}
                  </span>
                </a>
              ) : (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <DocumentIcon />
                  No Document
                </span>
              )}
            </TableCell>

            <TableCell className="px-6 py-5 sm:px-8">
              <StatusBadge status={doctor.status} />
            </TableCell>

            {isRejectedPage ? (
              <TableCell className="max-w-[280px] px-6 py-5 text-sm font-medium text-rose-700 sm:px-8">
                <p className="line-clamp-2">
                  {doctor.rejectionReason ?? "-"}
                </p>
              </TableCell>
            ) : null}

            <TableCell className="px-6 py-5 text-sm font-medium text-slate-700 sm:px-8">
              {isRejectedPage ? doctor.reviewedAt : doctor.submittedAt}
              <div className="mt-1 text-xs font-normal text-slate-500">
                {isRejectedPage ? "Rejected document" : "Submitted document"}
              </div>
            </TableCell>

            <TableCell className="px-6 py-5 text-right text-sm font-medium sm:px-8">
              <Link
                href={`/admin/doctor-verifications/detail?id=${encodeURIComponent(doctor.id)}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-slate-400 transition-all duration-200 hover:bg-sky-50! hover:text-sky-700"
              >
                <ViewIcon />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Mobile card list (§4.2) — prioritas: identitas + badge, meta, dokumen, aksi.
  const cardsNode = (
    <div className="divide-y divide-slate-100 bg-white">
      {verificationRequests.map((doctor) => (
        <div key={doctor.id} className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900">
              {doctor.name}
            </p>
            <StatusBadge status={doctor.status} />
          </div>

          <div className="space-y-0.5 text-xs text-slate-500">
            <p className="truncate">{doctor.email}</p>
            <p className="truncate">
              <span className="font-medium text-slate-600">STR:</span>{" "}
              {doctor.identity}
            </p>
            <p className="truncate">
              <span className="font-medium text-slate-600">
                Spesialisasi:
              </span>{" "}
              {doctor.specialization}
            </p>
            <p>
              {isRejectedPage ? "Ditolak" : "Diajukan"}:{" "}
              {isRejectedPage ? doctor.reviewedAt : doctor.submittedAt}
            </p>
          </div>

          {isRejectedPage ? (
            <p className="rounded-xl bg-rose-50 p-2.5 text-xs leading-5 text-rose-700 line-clamp-2">
              {doctor.rejectionReason ?? "-"}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            {doctor.documents.length > 0 ? (
              <a
                href={doctor.documents[0].url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <DocumentIcon />
                <span className="truncate">
                  {doctor.documents[0].file_name ?? "Dokumen"}
                </span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-500">
                <DocumentIcon />
                No Document
              </span>
            )}

            <Link
              href={`/admin/doctor-verifications/detail?id=${encodeURIComponent(doctor.id)}`}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 px-4 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              Review →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <TableWidget
      table={tableNode}
      cards={verificationRequests.length > 0 ? cardsNode : undefined}
      empty={
        verificationRequests.length === 0 ? (
          <EmptyState
            title={
              isRejectedPage
                ? "Tidak ada data verifikasi dokter yang ditolak"
                : "Tidak ada antrean verifikasi dokter"
            }
            description={
              isRejectedPage
                ? "Pengajuan yang ditolak akan tampil di sini beserta alasannya."
                : "Pengajuan verifikasi dokter baru akan masuk ke antrean ini."
            }
          />
        ) : undefined
      }
      footer={paginationNode}
    />
  );
}
