"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { useDoctorProducts } from "../hooks/useDoctorProducts";
import { catalogService } from "@/features/skin-types/services/catalogService";
import type { SkincarePageData } from "../types";

import { SkincareContent } from "./SkincareContent";

const PAGE_SIZE = 10;

function formatDate(date: string | null | undefined) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(date));
}

export function SkincareClientContent() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const { data, isLoading } = useDoctorProducts(page, PAGE_SIZE);

  const { data: concernsResponse } = useQuery({
    queryKey: ["catalog", "skin-concerns", "count"],
    queryFn: () => catalogService.skinConcerns({ per_page: 50, page: 1 }),
  });

  const pageData: SkincarePageData = useMemo(() => {
    const rows = data?.data ?? [];
    const from = (page - 1) * PAGE_SIZE;

    const products = rows.map((product, index) => ({
      id: product.uuid,
      no: from + index + 1,
      name: product.name ?? "-",
      category: product.category ?? "-",
      keyIngredients: product.key_ingredients ?? "-",
      concern: product.concern?.name ?? "-",
      skinType: product.skin_type?.name ?? "-",
      updatedAt: formatDate(product.created_at),
    }));

    const uniqueCategories = new Set(
      rows.map((product) => product.category).filter(Boolean),
    );

    return {
      products,
      summary: {
        totalProducts: data?.meta?.total ?? 0,
        totalCategories: uniqueCategories.size,
        totalConcerns: (concernsResponse?.data as unknown as { length: number }[])?.length ?? 0,
      },
      pagination: {
        currentPage: page,
        totalPages: data?.meta?.last_page ?? 1,
        totalItems: data?.meta?.total ?? 0,
        pageSize: PAGE_SIZE,
        basePath: "/doctor/skincare",
        itemLabel: "produk",
      },
    };
  }, [data, concernsResponse, page]);

  if (isLoading && !data) {
    return (
      <div className="w-full space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return <SkincareContent {...pageData} />;
}

export function SkincarePageWithSuspense() {
  return (
    <Suspense>
      <SkincareClientContent />
    </Suspense>
  );
}
