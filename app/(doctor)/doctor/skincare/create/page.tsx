import type { Metadata } from "next";
import Link from "next/link";

import { SkincareForm } from "@/app/(doctor)/doctor/skincare/_components/skincare-form";
import { ROUTES } from "@/lib/constants";
import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";


export const metadata: Metadata = {
  title: "Tambah Skincare | Face Skin Detection",
  description: "Tambah produk skincare baru - Dashboard Dokter",
};

interface ConcernApi {
  uuid: string;
  name: string;
}

interface SkinTypeApi {
  uuid: string;
  name: string;
}

export default async function CreateSkincarePage() {
  await requireDoctorProfile();

  let concerns: ConcernApi[] = [];
  let skinTypes: SkinTypeApi[] = [];

  try {
    const [resConcerns, resSkinTypes] = await Promise.all([
      fetchApi<ConcernApi[]>("/skin-concerns?per_page=50&page=1"),
      fetchApi<SkinTypeApi[]>("/skin-types?per_page=50&page=1"),
    ]);

    concerns = resConcerns.data ?? [];
    skinTypes = resSkinTypes.data ?? [];
  } catch (error) {
    console.error("Failed to fetch skin concerns and types for skincare form:", error);
  }

  return (
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
          concerns.map((concern: ConcernApi) => ({
            // Backend kini menerima uuid pada concern_id (UuidResolver).
            id: concern.uuid,
            name: concern.name ?? "-",
          }))
        }
        skinTypes={
          skinTypes.map((skinType: SkinTypeApi) => ({
            id: skinType.uuid,
            name: skinType.name ?? "-",
          }))
        }
      />
    </div>
  );
}
