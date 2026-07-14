import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { requireDoctorProfile } from "@/lib/doctor-auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detail Skin Concern | Face Skin Detection",
  description: "Detail skin concern - Dashboard Dokter",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type SkinConcernRow = {
  id: string;
  name: string | null;
  description: string | null;
  default_severity_score: number | null;
  created_at: string | null;
  updated_at: string | null;
};

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

export default async function SkinConcernDetailPage({ params }: PageProps) {
  const { id } = await params;

  await requireDoctorProfile();

  const supabase = await createClient();

  const { data: concern, error } = await supabase
    .from("skin_concerns")
    .select(
      `
      id,
      name,
      description,
      default_severity_score,
      created_at,
      updated_at
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch skin concern detail:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  if (!concern || error) {
    notFound();
  }

  const skinConcern = concern as SkinConcernRow;

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
        <Card className='rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
          <p className='text-sm font-semibold text-slate-500'>Nama Concern</p>
          <p className='mt-3 text-2xl font-bold tracking-tight text-slate-950'>{skinConcern.name ?? "-"}</p>
          <p className='mt-1 text-xs text-slate-500'>Label masalah kulit</p>
        </Card>

        <Card className='rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
          <p className='text-sm font-semibold text-slate-500'>Default Severity</p>
          <p className='mt-3 text-2xl font-bold tracking-tight text-slate-950'>{skinConcern.default_severity_score ?? "-"}</p>
          <p className='mt-1 text-xs text-slate-500'>Skor bawaan dari sistem</p>
        </Card>

        <Card className='rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'>
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
          <div className='grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-3 sm:px-8'>
            <p className='text-sm font-semibold text-gray-500'>ID Concern</p>
            <p className='break-all text-sm font-medium text-gray-800 sm:col-span-2'>{skinConcern.id}</p>
          </div>
          <div className='grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-3 sm:px-8'>
            <p className='text-sm font-semibold text-gray-500'>Nama</p>
            <p className='text-sm font-medium text-gray-800 sm:col-span-2'>{skinConcern.name ?? "-"}</p>
          </div>
          <div className='grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-3 sm:px-8'>
            <p className='text-sm font-semibold text-gray-500'>Deskripsi</p>
            <p className='text-sm leading-6 text-gray-700 sm:col-span-2'>{skinConcern.description ?? "Tidak ada deskripsi."}</p>
          </div>
          <div className='grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-3 sm:px-8'>
            <p className='text-sm font-semibold text-gray-500'>Default Severity Score</p>
            <p className='text-sm font-medium text-gray-800 sm:col-span-2'>{skinConcern.default_severity_score ?? "-"}</p>
          </div>
          <div className='grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-3 sm:px-8'>
            <p className='text-sm font-semibold text-gray-500'>Dibuat Pada</p>
            <p className='text-sm font-medium text-gray-800 sm:col-span-2'>{formatDate(skinConcern.created_at)}</p>
          </div>
          <div className='grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-3 sm:px-8'>
            <p className='text-sm font-semibold text-gray-500'>Terakhir Diupdate</p>
            <p className='text-sm font-medium text-gray-800 sm:col-span-2'>{formatDate(skinConcern.updated_at)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
