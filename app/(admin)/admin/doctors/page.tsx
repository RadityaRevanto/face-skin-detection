import type { Metadata } from "next";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { DashboardHeader } from "@/components/admin/admin-header";
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

export const metadata: Metadata = {
  title: "Manajemen Dokter | Face Skin Detection",
  description: "Kelola daftar dokter terdaftar",
};

const doctors = [
  {
    no: 1,
    name: "dr. Amanda Putri",
    email: "amanda.putri@email.com",
    identity: "STR12345678",
    specialization: "Dermatologi",
    document: "STR_Amanda.pdf",
    verifiedAt: "18 May 2025",
    status: "Approved",
  },
  {
    no: 2,
    name: "dr. Budi Santoso",
    email: "budi.santoso@email.com",
    identity: "STR23456789",
    specialization: "Spesialis Kulit",
    document: "STR_Budi.pdf",
    verifiedAt: "17 May 2025",
    status: "Approved",
  },
  {
    no: 3,
    name: "dr. Citra Melati",
    email: "citra.melati@email.com",
    identity: "STR34567890",
    specialization: "Dermatologi",
    document: "STR_Citra.pdf",
    verifiedAt: "15 May 2025",
    status: "Approved",
  },
  {
    no: 4,
    name: "dr. Dika Apriyadi",
    email: "dika.apriyadi@email.com",
    identity: "ID-DOC-45678901",
    specialization: "Kedokteran Estetika",
    document: "Identitas_Dika.pdf",
    verifiedAt: "14 May 2025",
    status: "Approved",
  },
  {
    no: 5,
    name: "dr. Evi Nurhaliza",
    email: "evi.nurhaliza@email.com",
    identity: "STR56789012",
    specialization: "Spesialis Kulit",
    document: "STR_Evi.pdf",
    verifiedAt: "13 May 2025",
    status: "Approved",
  },
];

function ActionIcon({ type }: { type: "view" | "suspend" }) {
  if (type === "view") {
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

  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
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

export default function AdminDoctorsPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!">
      <div className="flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row">
        <AdminSidebar />
        <div className="min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!">
          <DashboardHeader
            title="Doctors"
            description="Manage verified doctors"
          />

          <div className="py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">
            <div className="w-full space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                  Verified Doctors
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Kelola daftar dokter yang sudah lolos verifikasi dan dapat
                  mengakses dashboard dokter.
                </p>
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
                        Dokumen Verifikasi
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Tanggal Verifikasi
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Status
                      </TableHead>
                      <TableHead className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 bg-white">
                    {doctors.map((doctor) => (
                      <TableRow
                        key={doctor.email}
                        className="group border-gray-100 transition-colors hover:bg-emerald-50/30"
                      >
                        <TableCell className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-500 sm:px-8">
                          {doctor.no}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-700 transition-colors group-hover:text-emerald-700 sm:px-8">
                          {doctor.name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-gray-500 sm:px-8">
                          {doctor.email}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-700 sm:px-8">
                          {doctor.identity}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 sm:px-8">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {doctor.specialization}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 sm:px-8">
                          <span className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
                            <DocumentIcon />
                            {doctor.document}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-700 sm:px-8">
                          {doctor.verifiedAt}
                          <div className="mt-1 text-xs font-normal text-gray-500">
                            Verification approved
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 sm:px-8">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {doctor.status}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium sm:px-8">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              title="View"
                              className="h-10 w-10 rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-sky-50! hover:text-sky-700"
                            >
                              <ActionIcon type="view" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              title="Suspend"
                              className="h-10 w-10 rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-rose-50! hover:text-rose-600"
                            >
                              <ActionIcon type="suspend" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  currentPage={1}
                  totalPages={8}
                  totalItems={40}
                  pageSize={doctors.length}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
