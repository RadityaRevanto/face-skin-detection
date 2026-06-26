import type { Metadata } from "next";
import Link from "next/link";

import { SkincareForm } from "@/app/(doctor)/doctor/skincare/_components/skincare-form";
import { DoctorHeader } from "@/components/doctor/doctor-header";
import { DoctorSidebar } from "@/components/doctor/doctor-sidebar";
import { ROUTES } from "@/lib/constants";
import { requireDoctorProfile } from "@/lib/doctor-auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tambah Skincare | Face Skin Detection",
  description: "Tambah produk skincare baru - Dashboard Dokter",
};

export default async function CreateSkincarePage() {
  await requireDoctorProfile();

  const supabase = await createClient();

  const [
    { data: concerns, error: concernError },
    { data: skinTypes, error: skinTypeError },
  ] = await Promise.all([
    supabase
      .from("skin_concerns")
      .select("id, name")
      .order("name", { ascending: true }),

    supabase
      .from("skin_types")
      .select("id, name")
      .order("name", { ascending: true }),
  ]);

  if (concernError) {
    console.error("Failed to fetch skin concerns for skincare form:", {
      message: concernError.message,
      details: concernError.details,
      hint: concernError.hint,
      code: concernError.code,
    });
  }

  if (skinTypeError) {
    console.error("Failed to fetch skin types for skincare form:", {
      message: skinTypeError.message,
      details: skinTypeError.details,
      hint: skinTypeError.hint,
      code: skinTypeError.code,
    });
  }

  return (
    <main className='min-h-screen bg-[#f7fbf8]! text-slate-950 dark:bg-[#f7fbf8]! dark:text-slate-950!'>
      <div className='flex min-h-screen flex-col bg-[#f7fbf8]! dark:bg-[#f7fbf8]! lg:flex-row'>
        <DoctorSidebar />

        <div className='min-w-0 flex-1 bg-[#f7fbf8]! dark:bg-[#f7fbf8]!'>
          <DoctorHeader
            title='Tambah Skincare'
            description='Tambahkan produk skincare baru ke sistem rekomendasi.'
            searchPlaceholder='Cari produk skincare...'
          />

          <div className='py-6 pl-5 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8'>
            <div className='w-full space-y-6'>
              <div>
                <Link
                  href={ROUTES.DOCTOR.SKINCARE}
                  className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800'
                >
                  <span aria-hidden='true'>←</span>
                  Kembali ke Data Skincare
                </Link>

                <h1 className='mt-4 text-2xl font-bold tracking-tight text-slate-950'>
                  Tambah Produk Skincare
                </h1>

                <p className='mt-1 text-sm text-slate-500'>
                  Lengkapi informasi produk agar dapat digunakan pada
                  rekomendasi skincare pengguna.
                </p>
              </div>

              <SkincareForm
                concerns={
                  concerns?.map((concern) => ({
                    id: concern.id,
                    name: concern.name ?? "-",
                  })) ?? []
                }
                skinTypes={
                  skinTypes?.map((skinType) => ({
                    id: skinType.id,
                    name: skinType.name ?? "-",
                  })) ?? []
                }
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
