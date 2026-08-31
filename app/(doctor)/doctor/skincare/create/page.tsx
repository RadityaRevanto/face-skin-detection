import type { Metadata } from "next";

import { SkincareForm } from "@/src/features/doctor/skincare/components/SkincareForm";
import { SkincareFormPageHeader } from "@/src/features/doctor/skincare/components/SkincareFormPageHeader";
import { mapConcernOptions, mapSkinTypeOptions } from "@/src/features/doctor/skincare/utils/skincareFormOptions";
import type { SkincareApiConcern, SkincareApiSkinType } from "@/src/features/doctor/skincare/types";
import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tambah Skincare",
  description: "Tambah produk skincare baru - Dashboard Dokter",
};

export default async function CreateSkincarePage() {
  await requireDoctorProfile();

  let concerns: SkincareApiConcern[] = [];
  let skinTypes: SkincareApiSkinType[] = [];

  try {
    const [resConcerns, resSkinTypes] = await Promise.all([
      fetchApi<SkincareApiConcern[]>("/skin-concerns?per_page=50&page=1"),
      fetchApi<SkincareApiSkinType[]>("/skin-types?per_page=50&page=1"),
    ]);

    concerns = resConcerns.data ?? [];
    skinTypes = resSkinTypes.data ?? [];
  } catch (error) {
    console.error("Failed to fetch skin concerns and types for skincare form:", error);
  }

  return (
    <div className='w-full space-y-6'>
      <SkincareFormPageHeader
        title='Tambah Produk Skincare'
        description='Lengkapi informasi produk agar dapat digunakan pada rekomendasi skincare pengguna.'
      />

      <SkincareForm
        concerns={mapConcernOptions(concerns)}
        skinTypes={mapSkinTypeOptions(skinTypes)}
      />
    </div>
  );
}
