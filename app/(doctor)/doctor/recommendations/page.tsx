import type { Metadata } from "next";
import Link from "next/link";

import {
  skinConcerns,
  skincareRecommendations,
} from "@/app/(doctor)/doctor/_lib/doctor-content-data";
import { DoctorHeader } from "@/components/doctor/doctor-header";
import { DoctorSidebar } from "@/components/doctor/doctor-sidebar";
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
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kelola Rekomendasi | Face Skin Detection",
  description: "Kelola rekomendasi skincare - Dashboard Dokter",
};

const summaryCards = [
  {
    label: "Total Rekomendasi",
    value: "32",
    helper: "Mapping rekomendasi aktif",
  },
  {
    label: "Skin Concern",
    value: String(skinConcerns.length),
    helper: "Concern yang memiliki rule",
  },
  {
    label: "Routine Step",
    value: "7",
    helper: "Pagi dan malam",
  },
];

function ActionIcon({ type }: { type: "edit" | "delete" }) {
  if (type === "edit") {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="m16.9 4.6 2.5 2.5M4 20h4.8L19.7 9.1a1.8 1.8 0 0 0 0-2.5l-2.3-2.3a1.8 1.8 0 0 0-2.5 0L4 15.2V20Z"
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
        d="M6 7h12m-10 0 .7 12.2A2 2 0 0 0 10.7 21h2.6a2 2 0 0 0 2-1.8L16 7M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7"
      />
    </svg>
  );
}

export default function DoctorRecommendationsPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!">
      <div className="flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row">
        <DoctorSidebar />

        <div className="min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!">
          <DoctorHeader
            title="Kelola Rekomendasi"
            description="Atur rekomendasi yang akan muncul setelah user mendapat hasil analisis AI."
            searchPlaceholder="Cari rekomendasi..."
          />

          <div className="py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8">
            <div className="w-full space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                    Rule Rekomendasi Skincare
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Sistem mencocokkan hasil AI user dengan rule concern,
                    severity, tipe kulit, dan step routine dari dokter.
                  </p>
                </div>

                <Link href={ROUTES.DOCTOR.RECOMMENDATIONS_CREATE}>
                  <Button
                    type="button"
                    variant="success"
                    className="h-11 rounded-xl px-5 font-semibold"
                  >
                    Tambah Rekomendasi
                  </Button>
                </Link>
              </div>

              <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {summaryCards.map((item) => (
                  <Card
                    key={item.label}
                    className="rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!"
                  >
                    <p className="text-sm font-semibold text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
                  </Card>
                ))}
              </section>

              <Card className="overflow-hidden rounded-2xl border-slate-100! bg-white! text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!">
                <Table className="min-w-full divide-y divide-gray-100">
                  <TableHeader className="bg-gray-50/80">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-20 px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        No
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Rule Match AI
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Produk
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Routine
                      </TableHead>
                      <TableHead className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Catatan
                      </TableHead>
                      <TableHead className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-8">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 bg-white">
                    {skincareRecommendations.map((recommendation) => (
                      <TableRow
                        key={recommendation.id}
                        className="group border-gray-100 transition-colors hover:bg-emerald-50/30"
                      >
                        <TableCell className="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-500 sm:px-8">
                          {recommendation.no}
                        </TableCell>
                        <TableCell className="min-w-64 px-6 py-5 sm:px-8">
                          <div className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-emerald-700">
                            {recommendation.concern}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {recommendation.severity} · {recommendation.skinType}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-56 px-6 py-5 sm:px-8">
                          <div className="text-sm font-medium text-gray-700">
                            {recommendation.productName}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {recommendation.productBrand}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 text-sm text-gray-500 sm:px-8">
                          {recommendation.routineStep}
                        </TableCell>
                        <TableCell className="min-w-72 px-6 py-5 text-sm text-gray-500 sm:px-8">
                          {recommendation.doctorNote}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-6 py-5 text-right text-sm font-medium sm:px-8">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={ROUTES.DOCTOR.RECOMMENDATIONS_EDIT(
                                recommendation.id,
                              )}
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                title="Edit"
                                className="h-10 w-10 rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-emerald-50! hover:text-emerald-700"
                              >
                                <ActionIcon type="edit" />
                              </Button>
                            </Link>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              title="Delete"
                              className="h-10 w-10 rounded-xl p-0 text-gray-400 transition-all duration-200 hover:bg-rose-50! hover:text-rose-600"
                            >
                              <ActionIcon type="delete" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Pagination
                  currentPage={1}
                  totalPages={7}
                  totalItems={32}
                  pageSize={skincareRecommendations.length}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
