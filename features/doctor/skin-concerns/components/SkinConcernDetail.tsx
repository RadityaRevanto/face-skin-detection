import Link from "next/link";

import { Card } from "@/components/ui/card";
import { GradientSummaryCards } from "@/features/shared/components/GradientSummaryCards";
import { ROUTES } from "@/lib/constants";
import type { SkinConcern } from "../types";
import { formatSkinConcernDate } from "../utils/formatSkinConcernDate";

function TagWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M6 6h.008v.008H6V6z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function GaugeWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M3.75 18h16.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function LockWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

export function SkinConcernDetail({ skinConcern }: { skinConcern: SkinConcern }) {
  return (
    <div className='w-full space-y-6'>
      <div>
        <Link
          href={ROUTES.DOCTOR.SKIN_CONCERNS}
          className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800'
        >
          <span aria-hidden='true'>←</span>
          Kembali ke Data Skin Concern
        </Link>

        <h1 className='mt-4 text-2xl font-bold tracking-tight text-slate-950'>
          {skinConcern.name ?? "Detail Skin Concern"}
        </h1>

        <p className='mt-1 text-sm text-slate-500'>
          Informasi ini bersifat read-only dan menjadi referensi dokter
          saat membuat rekomendasi skincare.
        </p>
      </div>

      <GradientSummaryCards
        cards={[
          {
            label: "Nama Concern",
            value: String(skinConcern.name ?? "-"),
            helper: "Label masalah kulit",
            variant: "sky",
            icon: <TagWatermark />,
          },
          {
            label: "Default Severity",
            value: String(skinConcern.default_severity_score ?? "-"),
            helper: "Skor bawaan dari sistem",
            variant: "amber",
            icon: <GaugeWatermark />,
          },
          {
            label: "Status Akses",
            value: "Read Only",
            helper: "Dokter hanya dapat melihat",
            variant: "navy",
            icon: <LockWatermark />,
          },
        ]}
      />

      <Card className='overflow-hidden rounded-2xl border-slate-100! bg-white! text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
        <div className='border-b border-gray-100 px-6 py-5 sm:px-8'>
          <h2 className='text-base font-bold text-slate-950'>Informasi Skin Concern</h2>
          <p className='mt-1 text-sm text-slate-500'>Detail lengkap data master skin concern.</p>
        </div>

        <div className='divide-y divide-gray-100'>
          <SkinConcernInfoRow label='ID Concern' value={skinConcern.uuid} breakAll />
          <SkinConcernInfoRow label='Nama' value={skinConcern.name ?? "-"} />
          <SkinConcernInfoRow label='Deskripsi' value={skinConcern.description ?? "Tidak ada deskripsi."} />
          <SkinConcernInfoRow label='Default Severity Score' value={skinConcern.default_severity_score ?? "-"} />
          <SkinConcernInfoRow label='Dibuat Pada' value={formatSkinConcernDate(skinConcern.created_at)} />
          <SkinConcernInfoRow label='Terakhir Diupdate' value={formatSkinConcernDate(skinConcern.updated_at)} />
        </div>
      </Card>
    </div>
  );
}

function SkinConcernInfoRow({ label, value, breakAll }: { label: string; value: string | number; breakAll?: boolean }) {
  return (
    <div className='grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-3 sm:px-8'>
      <p className='text-sm font-semibold text-gray-500'>{label}</p>
      <p className={`text-sm font-medium text-gray-800 sm:col-span-2 ${breakAll ? "break-all" : "leading-6 text-gray-700"}`}>
        {value}
      </p>
    </div>
  );
}
