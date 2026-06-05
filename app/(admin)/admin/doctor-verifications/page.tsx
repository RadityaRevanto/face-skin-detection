import type { Metadata } from "next";
import Link from "next/link";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DashboardHeader } from "@/components/admin/admin-header";
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
import { verificationRequests } from "./data";

export const metadata: Metadata = {
  title: "Verifikasi Dokter | Face Skin Detection",
  description: "Review dan verifikasi dokumen dokter",
};

function ViewIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14 3v6h5M9 14h6M9 17h4"
      />
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Revision Required") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Revision Required
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
      Pending
    </span>
  );
}

export default function AdminDoctorVerificationsPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!">
      <div className="flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!">
          <DashboardHeader
            title="Verification"
            description="Review doctor verification requests"
          />

          <div className="py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">
            <div className="w-full space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                  Doctor Verification
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Review dokumen STR atau identitas dokter sebelum akun dokter
                  diberi akses ke dashboard.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!">
                  <p className="text-sm font-medium text-gray-500">
                    Menunggu Review
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-950">3</p>
                </Card>
                <Card className="rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!">
                  <p className="text-sm font-medium text-gray-500">
                    Perlu Revisi
                  </p>
                  <p className="mt-3 text-3xl font-bold text-amber-600">2</p>
                </Card>
                <Card className="rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!">
                  <p className="text-sm font-medium text-gray-500">
                    Total Antrean
                  </p>
                  <p className="mt-3 text-3xl font-bold text-emerald-600">5</p>
                </Card>
              </div>

              <Card className="overflow-hidden rounded-2xl border-slate-100! bg-white! text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!">
                <Table className="min-w-full divide-y divide-gray-100">
                  <TableHeader className="bg-gray-50/80">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-20 px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        No
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Nama Lengkap
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Email
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Nomor STR / Identitas Dokter
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Spesialisasi
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Dokumen
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Status
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Diajukan
                      </TableHead>
                      <TableHead className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 bg-white">
                    {verificationRequests.map((doctor) => (
                      <TableRow
                        key={doctor.email}
                        className="group border-gray-100 transition-colors hover:bg-emerald-50/30"
                      >
                        <TableCell className="px-6 py-5 text-sm font-medium text-gray-500 sm:px-8">
                          {doctor.no}
                        </TableCell>
                        <TableCell className="px-6 py-5 text-sm font-medium text-gray-700 transition-colors group-hover:text-emerald-700 sm:px-8">
                          {doctor.name}
                        </TableCell>
                        <TableCell className="px-6 py-5 text-sm text-gray-500 sm:px-8">
                          {doctor.email}
                        </TableCell>
                        <TableCell className="px-6 py-5 text-sm font-medium text-gray-700 sm:px-8">
                          {doctor.identity}
                        </TableCell>
                        <TableCell className="px-6 py-5 sm:px-8">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {doctor.specialization}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-5 sm:px-8">
                          <span className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                            <DocumentIcon />
                            {doctor.document}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-5 sm:px-8">
                          <StatusBadge status={doctor.status} />
                        </TableCell>
                        <TableCell className="px-6 py-5 text-sm font-medium text-gray-700 sm:px-8">
                          {doctor.submittedAt}
                          <div className="mt-1 text-xs font-normal text-gray-500">
                            Submitted document
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-right text-sm font-medium sm:px-8">
                          <Link
                            href={`/admin/doctor-verifications/${doctor.id}`}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-gray-400 transition-all duration-200 hover:bg-sky-50! hover:text-sky-700"
                          >
                            <ViewIcon />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  currentPage={1}
                  totalPages={3}
                  totalItems={15}
                  pageSize={verificationRequests.length}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
