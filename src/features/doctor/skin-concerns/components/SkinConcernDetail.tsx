import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import type { SkinConcern } from "../types";
import { formatSkinConcernDate } from "../utils/formatSkinConcernDate";

const cardShell =
  "rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!";

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

      <section className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card className={cardShell}>
          <p className='text-sm font-semibold text-slate-500'>Nama Concern</p>
          <p className='mt-3 text-2xl font-bold tracking-tight text-slate-950'>{skinConcern.name ?? "-"}</p>
          <p className='mt-1 text-xs text-slate-500'>Label masalah kulit</p>
        </Card>

        <Card className={cardShell}>
          <p className='text-sm font-semibold text-slate-500'>Default Severity</p>
          <p className='mt-3 text-2xl font-bold tracking-tight text-slate-950'>{skinConcern.default_severity_score ?? "-"}</p>
          <p className='mt-1 text-xs text-slate-500'>Skor bawaan dari sistem</p>
        </Card>

        <Card className={cardShell}>
          <p className='text-sm font-semibold text-slate-500'>Status Akses</p>
          <p className='mt-3 text-2xl font-bold tracking-tight text-slate-950'>Read Only</p>
          <p className='mt-1 text-xs text-slate-500'>Dokter hanya dapat melihat</p>
        </Card>
      </section>

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
