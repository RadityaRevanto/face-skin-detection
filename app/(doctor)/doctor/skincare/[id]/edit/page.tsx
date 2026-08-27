import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SkincareForm } from "@/app/(doctor)/doctor/skincare/_components/skincare-form";
import { ROUTES } from "@/lib/constants";
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

interface ConcernApi {
  uuid: string;
  name: string;
}

interface SkinTypeApi {
  uuid: string;
  name: string;
}

interface SkincareProductApi {
  uuid: string;
  name: string;
  category: string;
  gender?: string;
  key_ingredients?: string | null;
  usage_instruction?: string | null;
  warning?: string | null;
  is_active?: boolean;
  concern?: ConcernApi | null;
  skin_type?: SkinTypeApi | null;
}

export default async function EditSkincarePage({ params }: PageProps) {
  const { id } = await params;

  await requireDoctorProfile();

  let skincareProduct: SkincareProductApi | null = null;
  let concerns: ConcernApi[] = [];
  let skinTypes: SkinTypeApi[] = [];

  try {
    // Ownership divalidasi backend saat PATCH (403 jika bukan pemilik).
    const [resProduct, resConcerns, resTypes] = await Promise.all([
      fetchApi<SkincareProductApi>(`/skincare-products/${id}`),
      fetchApi<ConcernApi[]>("/skin-concerns?per_page=50&page=1"),
      fetchApi<SkinTypeApi[]>("/skin-types?per_page=50&page=1"),
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
      <div>
        <Link
          href={ROUTES.DOCTOR.SKINCARE}
          className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800'
        >
          <span aria-hidden='true'>←</span>
          Kembali ke Data Skincare
        </Link>

        <h1 className='mt-4 text-2xl font-bold tracking-tight text-slate-950'>
          Edit Produk Skincare
        </h1>

        <p className='mt-1 text-sm text-slate-500'>
          Perbarui informasi produk agar rekomendasi user tetap akurat.
        </p>
      </div>

      <SkincareForm
        mode='edit'
        concerns={concerns.map(
          (concern: ConcernApi) => ({
            id: concern.uuid,
            name: concern.name ?? "-",
          }),
        )}
        skinTypes={skinTypes.map(
          (skinType: SkinTypeApi) => ({
            id: skinType.uuid,
            name: skinType.name ?? "-",
          }),
        )}
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
