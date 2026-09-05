"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { catalogService } from "@/features/skin-types/services/catalogService";
import { SkinConcernsContent } from "./SkinConcernsContent";

const PAGE_SIZE = 10;

function SkinConcernsPageInner() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const { data, isLoading } = useQuery({
    queryKey: ["catalog", "skin-concerns", page],
    queryFn: () => catalogService.skinConcerns({ page, per_page: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  if (isLoading && !data) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <SkinConcernsContent
      concerns={(data?.data ?? []) as never[]}
      pagination={{
        currentPage: page,
        totalPages: data?.meta
          ? ((data.meta as { last_page?: number }).last_page ?? 1)
          : 1,
        totalItems: data?.meta
          ? ((data.meta as { total?: number }).total ?? 0)
          : 0,
        pageSize: PAGE_SIZE,
        basePath: "/doctor/skin-concerns",
        itemLabel: "skin concern",
      }}
    />
  );
}

export function SkinConcernsClientPage() {
  return (
    <Suspense>
      <SkinConcernsPageInner />
    </Suspense>
  );
}
