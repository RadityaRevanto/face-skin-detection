"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { api } from "@/lib/api";
import { catalogService } from "@/features/skin-types/services/catalogService";
import type { RecommendationsPageData } from "../lib/recommendationsTypes";

import { RecommendationContent } from "./RecommendationContent";

const PAGE_SIZE = 10;

interface RecommendationApi {
  uuid: string;
  title: string;
  recommendation_text: string;
  priority_level: string;
  concern?: { name: string };
  product?: { name: string; category: string };
}

function formatPriority(value: string | null | undefined) {
  if (value === "high") return "High Priority";
  if (value === "medium") return "Medium Priority";
  if (value === "low") return "Low Priority";
  return "-";
}

function RecommendationsPageInner() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const { data, isLoading } = useQuery({
    queryKey: ["doctor", "recommendations", page],
    queryFn: async () => {
      const response = await api.get<{
        data: RecommendationApi[];
        meta: { last_page: number; total: number };
      }>("/doctor/recommendations", { params: { page, per_page: PAGE_SIZE } });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  const { data: concernsResponse } = useQuery({
    queryKey: ["catalog", "skin-concerns", "count"],
    queryFn: () => catalogService.skinConcerns({ per_page: 50, page: 1 }),
  });

  const pageData: RecommendationsPageData = useMemo(() => {
    const rows = data?.data ?? [];
    const from = (page - 1) * PAGE_SIZE;

    const recommendations = rows.map((recommendation, index) => ({
      id: recommendation.uuid,
      no: from + index + 1,
      concern: recommendation.concern?.name ?? "-",
      severity: formatPriority(recommendation.priority_level),
      skinType: "Semua tipe kulit",
      productName: recommendation.product?.name ?? "-",
      productBrand: recommendation.product?.category ?? "-",
      routineStep: recommendation.title ?? "-",
      doctorNote: recommendation.recommendation_text ?? "-",
    }));

    const uniqueRoutineSteps = new Set(
      rows.map((item) => item.title).filter(Boolean),
    );

    const totalConcerns = concernsResponse?.meta
      ? ((concernsResponse.meta as { total?: number }).total ?? 0)
      : 0;

    return {
      recommendations,
      summary: {
        totalRecommendations: data?.meta?.total ?? 0,
        totalConcerns,
        totalRoutineSteps: uniqueRoutineSteps.size,
      },
      pagination: {
        currentPage: page,
        totalPages: data?.meta?.last_page ?? 1,
        totalItems: data?.meta?.total ?? 0,
        pageSize: PAGE_SIZE,
        basePath: "/doctor/recommendations",
        itemLabel: "rekomendasi",
      },
    };
  }, [data, concernsResponse, page]);

  if (isLoading && !data) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return <RecommendationContent {...pageData} />;
}

export function RecommendationsClientPage() {
  return (
    <Suspense>
      <RecommendationsPageInner />
    </Suspense>
  );
}
