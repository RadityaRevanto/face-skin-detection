import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SkincareForm } from "@/src/features/doctor/skincare/components/SkincareForm";
import { SkincareFormPageHeader } from "@/src/features/doctor/skincare/components/SkincareFormPageHeader";
import { mapConcernOptions, mapSkinTypeOptions } from "@/src/features/doctor/skincare/utils/skincareFormOptions";
import type { SkincareApiProduct, SkincareApiConcern, SkincareApiSkinType } from "@/src/features/doctor/skincare/types";
import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";

export const metadata: Metadata = {
  title: "Edit Skincare | Face Skin Detection",
  description: "Edit produk skincare - Dashboard Dokter",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSkincarePage({ params }: PageProps) {
  const { id } = await params;

  await requireDoctorProfile();

  let skincareProduct: SkincareApiProduct | null = null;
  let concerns: SkincareApiConcern[] = [];
  let skinTypes: SkincareApiSkinType[] = [];

  try {
    // Ownership divalidasi backend saat PATCH (403 jika bukan pemilik).
    const [resProduct, resConcerns, resTypes] = await Promise.all([
      fetchApi<SkincareApiProduct>(`/skincare-products/${id}`),
      fetchApi<SkincareApiConcern[]>("/skin-concerns?per_page=50&page=1"),
      fetchApi<SkincareApiSkinType[]>("/skin-types?per_page=50&page=1"),
    ]);

    skincareProduct = resProduct.data ?? null;
    concerns = resConcerns.data ?? [];
    skinTypes = resTypes.data ?? [];
  } catch (error) {
    console.error("Failed to fetch data for skincare edit form:", error);
    notFound();
  }

  if (!skincareProduct) {
    notFound();
  }

  return (
    <div className='w-full space-y-6'>
      <SkincareFormPageHeader
        title='Edit Produk Skincare'
        description='Perbarui informasi produk agar rekomendasi user tetap akurat.'
      />

      <SkincareForm
        mode='edit'
        concerns={mapConcernOptions(concerns)}
        skinTypes={mapSkinTypeOptions(skinTypes)}
        defaultValues={{
          id: skincareProduct.uuid,
          concernId: skincareProduct.concern?.uuid ?? "",
          skinTypeId: skincareProduct.skin_type?.uuid ?? "",
          name: skincareProduct.name ?? "",
          category: skincareProduct.category ?? "",
          keyIngredients: skincareProduct.key_ingredients ?? "",
          usageInstruction: skincareProduct.usage_instruction ?? "",
          warning: skincareProduct.warning ?? "",
          isActive: skincareProduct.is_active ?? true,
          genderSuitability: skincareProduct.gender ?? "unisex",
        }}
      />
    </div>
  );
}
