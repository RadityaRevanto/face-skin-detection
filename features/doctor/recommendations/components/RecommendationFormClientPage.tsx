"use client";

import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { api } from "@/lib/api";
import { catalogService } from "@/features/skin-types/services/catalogService";
import { RecommendationForm } from "@/features/doctor/recommendations/components/RecommendationForm";
import { ROUTES } from "@/lib/constants";

type RecommendationFormValues = {
  id: string;
  concernId: string;
  productId: string;
  title: string;
  recommendationText: string;
  priorityLevel: "low" | "medium" | "high";
  isActive: boolean;
};

function RecommendationFormPageInner({ mode }: { mode: "create" | "edit" }) {
  const searchParams = useSearchParams();
  const editId = mode === "edit" ? searchParams.get("id") : null;

  const { data: concernsResponse } = useQuery({
    queryKey: ["catalog", "skin-concerns", "form"],
    queryFn: () => catalogService.skinConcerns({ per_page: 50, page: 1 }),
  });

  const { data: productsResponse } = useQuery({
    queryKey: ["doctor", "products", "form-options"],
    queryFn: async () => {
      const response = await api.get<{
        data: { uuid: string; name: string; category: string; is_active?: boolean }[];
      }>("/doctor/products", { params: { per_page: 50, page: 1 } });
      return response.data;
    },
  });

  const { data: recommendation, isLoading: isLoadingRecommendation } = useQuery({
    queryKey: ["doctor", "recommendation", editId],
    queryFn: async () => {
      const response = await api.get<{
        data: {
          uuid: string;
          title: string;
          recommendation_text: string;
          priority_level: string;
          is_active?: boolean;
          concern?: { uuid?: string; name?: string } | null;
          product?: { uuid?: string; name?: string } | null;
        };
      }>(`/skin-recommendations/${editId}`);
      return response.data.data;
    },
    enabled: !!editId,
  });

  const concerns = (concernsResponse?.data ?? []).map((concern) => ({
    // Backend menerima uuid pada concern_id (UuidResolver).
    id: concern.uuid,
    name: concern.name ?? "-",
  }));

  const products = (productsResponse?.data ?? [])
    .filter((product) => product.is_active !== false)
    .map((product) => ({
      id: product.uuid,
      name: product.name ?? "-",
      category: product.category ?? "-",
    }));

  const defaultValues: RecommendationFormValues | undefined =
    mode === "edit" && recommendation
      ? {
          id: recommendation.uuid,
          concernId: recommendation.concern?.uuid ?? "",
          productId: recommendation.product?.uuid ?? "",
          title: recommendation.title ?? "",
          recommendationText: recommendation.recommendation_text ?? "",
          priorityLevel:
            (recommendation.priority_level as "low" | "medium" | "high") ??
            "medium",
          isActive: recommendation.is_active ?? true,
        }
      : undefined;

  if (mode === "edit" && (isLoadingRecommendation || !recommendation)) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <Link
          href={ROUTES.DOCTOR.RECOMMENDATIONS}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
        >
          <span aria-hidden="true">←</span>
          Kembali ke Data Rekomendasi
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
          {mode === "edit" ? "Edit Rule Rekomendasi" : "Tambah Rule Rekomendasi"}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Rule ini akan dipakai untuk mencocokkan hasil AI user dengan
          produk skincare yang sesuai.
        </p>
      </div>

      <RecommendationForm
        mode={mode}
        concerns={concerns}
        products={products}
        defaultValues={defaultValues}
      />
    </div>
  );
}

export function RecommendationCreateClientPage() {
  return (
    <Suspense>
      <RecommendationFormPageInner mode="create" />
    </Suspense>
  );
}

export function RecommendationEditClientPage() {
  return (
    <Suspense>
      <RecommendationFormPageInner mode="edit" />
    </Suspense>
  );
}
