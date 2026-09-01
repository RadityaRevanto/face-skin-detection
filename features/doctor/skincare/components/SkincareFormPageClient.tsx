"use client";

import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { catalogService } from "@/features/skin-types/services/catalogService";
import { useDoctorProduct } from "../hooks/useDoctorProducts";
import { mapConcernOptions, mapSkinTypeOptions } from "../utils/skincareFormOptions";
import { SkincareForm } from "./SkincareForm";
import { SkincareFormPageHeader } from "./SkincareFormPageHeader";

function SkincareFormPageInner({ mode }: { mode: "create" | "edit" }) {
  const searchParams = useSearchParams();
  const editId = mode === "edit" ? searchParams.get("id") : null;

  const { data: concernsResponse } = useQuery({
    queryKey: ["catalog", "skin-concerns", "form"],
    queryFn: () => catalogService.skinConcerns({ per_page: 50, page: 1 }),
  });

  const { data: skinTypesResponse } = useQuery({
    queryKey: ["catalog", "skin-types", "form"],
    queryFn: () => catalogService.skinTypes({ per_page: 50, page: 1 }),
  });

  const { data: product, isLoading: isLoadingProduct } = useDoctorProduct(editId);

  const concerns = (concernsResponse?.data ?? []) as unknown as Parameters<
    typeof mapConcernOptions
  >[0];
  const skinTypes = (skinTypesResponse?.data ?? []) as unknown as Parameters<
    typeof mapSkinTypeOptions
  >[0];

  if (mode === "edit" && (isLoadingProduct || !product)) {
    return (
      <div className="w-full space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <SkincareFormPageHeader
        title={
          mode === "edit" ? "Edit Produk Skincare" : "Tambah Produk Skincare"
        }
        description="Lengkapi informasi produk agar dapat digunakan pada rekomendasi skincare pengguna."
      />

      <SkincareForm
        mode={mode}
        concerns={mapConcernOptions(concerns)}
        skinTypes={mapSkinTypeOptions(skinTypes)}
        defaultValues={
          mode === "edit" && product
            ? {
                id: (product as { uuid: string }).uuid,
                concernId:
                  ((product as { concern?: { uuid?: string } }).concern?.uuid as string) ?? "",
                skinTypeId:
                  ((product as { skin_type?: { uuid?: string } }).skin_type?.uuid as string) ?? "",
                name: (product as { name?: string }).name ?? "",
                category: (product as { category?: string }).category ?? "",
                keyIngredients: (product as { key_ingredients?: string }).key_ingredients ?? "",
                usageInstruction:
                  (product as { usage_instruction?: string }).usage_instruction ?? "",
                warning: (product as { warning?: string }).warning ?? "",
                isActive: (product as { is_active?: boolean }).is_active ?? true,
                genderSuitability: (product as { gender?: string }).gender ?? "unisex",
              }
            : undefined
        }
      />
    </div>
  );
}

export function SkincareCreatePage() {
  return (
    <Suspense>
      <SkincareFormPageInner mode="create" />
    </Suspense>
  );
}

export function SkincareEditPage() {
  return (
    <Suspense>
      <SkincareFormPageInner mode="edit" />
    </Suspense>
  );
}
