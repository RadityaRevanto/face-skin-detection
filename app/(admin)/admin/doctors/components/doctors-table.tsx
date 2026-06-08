import Link from "next/link";

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

import type { DoctorRow } from "../lib/doctors-types";
import { ActionIcon } from "./doctor-action-icon";
import { DocumentIcon } from "./doctor-document-icon";
import { DoctorSuspendButton } from "./doctor-suspend-button";

type DoctorsTableProps = {
  doctors: DoctorRow[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
};

export function DoctorsTable({ doctors, pagination }: DoctorsTableProps) {
  return (
    <Card className='overflow-hidden rounded-2xl border-slate-100! bg-white! text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
      <Table className='min-w-full divide-y divide-gray-100'>
        <TableHeader className='bg-gray-50/80'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='w-20 px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              No
            </TableHead>
            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Nama Lengkap
            </TableHead>
            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Email
            </TableHead>
            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Nomor STR / Identitas Dokter
            </TableHead>
            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Spesialisasi
            </TableHead>
            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Dokumen Verifikasi
            </TableHead>
            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Tanggal Verifikasi
            </TableHead>
            <TableHead className='px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Status
            </TableHead>
            <TableHead className='px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8'>
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className='divide-y divide-gray-100 bg-white'>
          {doctors.map((doctor) => (
            <TableRow
              key={doctor.verificationId}
              className='group border-gray-100 transition-colors hover:bg-emerald-50/30'
            >
              <TableCell className='whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-500 sm:px-8'>
                {doctor.no}
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-700 transition-colors group-hover:text-emerald-700 sm:px-8'>
                {doctor.name}
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 text-sm text-gray-500 sm:px-8'>
                {doctor.email}
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-700 sm:px-8'>
                {doctor.identity}
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 sm:px-8'>
                <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm'>
                  <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                  {doctor.specialization}
                </span>
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 sm:px-8'>
                {doctor.documentUrl ? (
                  <a
                    href={doctor.documentUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex w-fit items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                  >
                    <DocumentIcon />
                    {doctor.document}
                  </a>
                ) : (
                  <span className='inline-flex w-fit items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'>
                    <DocumentIcon />
                    {doctor.document}
                  </span>
                )}
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-700 sm:px-8'>
                {doctor.verifiedAt}
                <div className='mt-1 text-xs font-normal text-gray-500'>
                  Verification approved
                </div>
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 sm:px-8'>
                <span
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm",
                    doctor.isActive
                      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border-rose-100 bg-rose-50 text-rose-700",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      doctor.isActive ? "bg-emerald-500" : "bg-rose-500",
                    ].join(" ")}
                  />
                  {doctor.status}
                </span>
              </TableCell>

              <TableCell className='whitespace-nowrap px-6 py-5 text-right text-sm font-medium sm:px-8'>
                <div className='flex items-center justify-end gap-2'>
                  <Link
                    href={`/admin/doctor-verifications/${doctor.verificationId}`}
                    title='View'
                    className='inline-flex h-10 w-10 items-center justify-center rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-sky-50! hover:text-sky-700'
                  >
                    <ActionIcon type='view' />
                  </Link>

                  <DoctorSuspendButton
                    doctorId={doctor.id}
                    isActive={doctor.isActive}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {doctors.length === 0 ? (
        <div className='border-t border-gray-100 bg-white px-6 py-8 text-sm font-semibold text-gray-500 sm:px-8'>
          Belum ada dokter terverifikasi.
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
