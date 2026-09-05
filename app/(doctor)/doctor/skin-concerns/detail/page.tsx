"use client";

import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { catalogService } from "@/features/skin-types/services/catalogService";
import { SkinConcernDetail } from "@/features/doctor/skin-concerns/components/SkinConcernDetail";

function SkinConcernDetailPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: concern, isLoading } = useQuery({
    queryKey: ["catalog", "skin-concern", id],
    queryFn: () => catalogService.skinConcern(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (!id || !concern) {
    return (
      <div className="w-full rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center text-sm text-rose-600">
        Skin concern tidak ditemukan.
      </div>
    );
  }

  return <SkinConcernDetail skinConcern={concern as never} />;
}

// Static route — identitas concern via query param ?id=<uuid>
export default function SkinConcernDetailPage() {
  return (
    <Suspense>
      <SkinConcernDetailPageInner />
    </Suspense>
  );
}
