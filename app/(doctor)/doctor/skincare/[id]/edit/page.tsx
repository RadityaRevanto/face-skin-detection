import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SkincareForm } from "@/app/(doctor)/doctor/skincare/_components/skincare-form";
import { ROUTES } from "@/lib/constants";
import { requireDoctorProfile } from "@/lib/doctor-auth";
import { createClient } from "@/lib/supabase/server";

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

type SkincareProductRow = {
  id: string;
  doctor_id: string;
  concern_id: string | null;
  skin_type_id: string | null;
  name: string | null;
  category: string | null;
  key_ingredients: string | null;
  usage_instruction: string | null;
  warning: string | null;
  is_active: boolean | null;
};

type SkinConcernRow = {
  id: string;
  name: string | null;
};

type SkinTypeRow = {
  id: string;
  name: string | null;
};

export default async function EditSkincarePage({ params }: PageProps) {
  const { id } = await params;

  const doctor = await requireDoctorProfile();
  const supabase = await createClient();

  const [
    { data: product, error: productError },
    { data: concerns, error: concernError },
    { data: skinTypes, error: skinTypeError },
  ] = await Promise.all([
    supabase
      .from("skincare_products")
      .select(
        `
        id,
        doctor_id,
        concern_id,
        skin_type_id,
        name,
        category,
        key_ingredients,
        usage_instruction,
        warning,
        is_active
        `,
      )
      .eq("id", id)
      .eq("doctor_id", doctor.id)
      .maybeSingle(),

    supabase
      .from("skin_concerns")
      .select("id, name")
      .order("name", { ascending: true }),

    supabase
      .from("skin_types")
      .select("id, name")
      .order("name", { ascending: true }),
  ]);

  if (productError) {
    console.error("Failed to fetch skincare product for edit:", {
      message: productError.message,
      details: productError.details,
      hint: productError.hint,
      code: productError.code,
    });
  }

  if (concernError) {
    console.error("Failed to fetch skin concerns for skincare edit form:", {
      message: concernError.message,
      details: concernError.details,
      hint: concernError.hint,
      code: concernError.code,
    });
  }

  if (skinTypeError) {
    console.error("Failed to fetch skin types for skincare edit form:", {
      message: skinTypeError.message,
      details: skinTypeError.details,
      hint: skinTypeError.hint,
      code: skinTypeError.code,
    });
  }

  if (!product || productError) {
    notFound();
  }

  const skincareProduct = product as SkincareProductRow;

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
        concerns={((concerns ?? []) as SkinConcernRow[]).map(
          (concern) => ({
            id: concern.id,
            name: concern.name ?? "-",
          }),
        )}
        skinTypes={((skinTypes ?? []) as SkinTypeRow[]).map(
          (skinType) => ({
            id: skinType.id,
            name: skinType.name ?? "-",
          }),
        )}
        defaultValues={{
          id: skincareProduct.id,
          concernId: skincareProduct.concern_id ?? "",
          skinTypeId: skincareProduct.skin_type_id ?? "",
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
