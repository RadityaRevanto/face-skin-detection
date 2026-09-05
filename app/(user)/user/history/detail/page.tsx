"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { HistoryDetailContent } from "@/features/history/components/HistoryDetailContent";

export default function HistoryDetailPage() {
  return (
    <Suspense>
      <HistoryDetailPageInner />
    </Suspense>
  );
}

function HistoryDetailPageInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return <HistoryDetailContent scanId={id} />;
}
