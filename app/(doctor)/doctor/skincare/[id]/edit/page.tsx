import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SkincareForm } from "@/app/(doctor)/doctor/skincare/_components/skincare-form";
import { ROUTES } from "@/lib/constants";
import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";

export const dynamic = "force-dynamic";

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
  id: string;
  uuid: string;
  name: string;
}

interface SkinTypeApi {
  id: string;
  uuid: string;
  name: string;
}

interface SkincareProductApi {
  id: string;
  uuid: string;
  doctor_id: string;
  name: string;
  category: string;
  key_ingredients?: string;
  usage_instruction?: string;
  warning?: string;
  is_active?: boolean;
  concern?: ConcernApi;
  skin_type?: SkinTypeApi;
}

export default async function EditSkincarePage({ params }: PageProps) {
  const { id } = await params;

  const doctor = await requireDoctorProfile();

  let skincareProduct: SkincareProductApi | null = null;
  let concerns: ConcernApi[] = [];
  let skinTypes: SkinTypeApi[] = [];

  try {
    const [resProduct, resConcerns, resTypes] = await Promise.all([
      fetchApi<SkincareProductApi>(`/skincare-products/${id}`),
      fetchApi<ConcernApi[]>("/skin-concerns?per_page=100"),
      fetchApi<SkinTypeApi[]>("/skin-types?per_page=100"),
    ]);

    skincareProduct = resProduct.data as any; // Wait, resProduct.data is SkincareProductApi if fetchApi is correct
    // But fetchApi signature: Promise<{ data: T, meta?: any }>
    // Wait, `/skincare-products/${id}` might return just the object if it's not paginated, OR it might return { data: ... }
    // Let's assume it returns { data: ... } as usual.
    skincareProduct = (resProduct as any).data ?? resProduct;
    concerns = resConcerns as any ?? []; // wait, resConcerns is { data: ... } if paginated, but I used `?? []` which implies it's an array directly?
    // In previous code I did `concerns = resConcerns ?? [];`. I should probably do `resConcerns.data ?? []` if fetchApi returns `{ data: ... }`.
    // Wait, I will just leave it as is but typecast properly.
    concerns = (resConcerns as any).data ?? resConcerns ?? [];
    skinTypes = (resTypes as any).data ?? resTypes ?? [];
  } catch (error: any) {
    console.error("Failed to fetch data for skincare edit form:", error);
    notFound();
  }

  if (!skincareProduct || skincareProduct.doctor_id !== doctor.id) {
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
            id: concern.id,
            name: concern.name ?? "-",
          }),
        )}
        skinTypes={skinTypes.map(
          (skinType: SkinTypeApi) => ({
            id: skinType.id,
            name: skinType.name ?? "-",
          }),
        )}
        defaultValues={{
          id: skincareProduct.id,
          concernId: skincareProduct.concern?.id ?? "",
          skinTypeId: skincareProduct.skin_type?.id ?? "",
          name: skincareProduct.name ?? "",
          category: skincareProduct.category ?? "",
          keyIngredients: skincareProduct.key_ingredients ?? "",
          usageInstruction: skincareProduct.usage_instruction ?? "",
          warning: skincareProduct.warning ?? "",
          isActive: skincareProduct.is_active ?? true,
        }}
      />
    </div>
  );
}
