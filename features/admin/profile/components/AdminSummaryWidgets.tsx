import Link from "next/link";

import { Card } from "@/components/ui/card";

import type { AdminProfileData } from "../types";

export function AdminSummaryWidgets({ summary }: { summary: AdminProfileData["summary"] }) {
  const widgets = [
    {
      label: "Total Pengguna",
      value: summary.total_users,
      href: "/admin/users",
      tone: "bg-emerald-50 text-emerald-600",
      accent: false,
    },
    {
      label: "Total Dokter",
      value: summary.total_doctors,
      href: "/admin/doctors",
      tone: "bg-sky-50 text-sky-600",
      accent: false,
    },
    {
      label: "Verifikasi Menunggu",
      value: summary.pending_doctor_verifications,
      href: "/admin/doctor-verifications",
      tone: "bg-amber-50 text-amber-600",
      accent: summary.pending_doctor_verifications > 0,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {widgets.map((item) => (
        <Card
          key={item.label}
          className={`rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm ${
            item.accent ? "ring-2 ring-rose-200" : ""
          }`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.tone}`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
            {item.value}
            {item.accent ? (
              <span className="ml-2 inline-block rounded-full bg-rose-500 px-2 py-0.5 align-middle text-[10px] font-bold text-white">
                Perlu review
              </span>
            ) : null}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-500">{item.label}</p>

          <Link
            href={item.href}
            className="mt-3 inline-block text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
          >
            Lihat detail →
          </Link>
        </Card>
      ))}
    </section>
  );
}
