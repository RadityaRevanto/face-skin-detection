"use client";

import { useScanDetail } from "@/features/scan/hooks/useScans";
import { HistoryDetail } from "./HistoryDetail";

type HistoryDetailContentProps = {
  scanId: string | null | undefined;
};

export function HistoryDetailContent({ scanId }: HistoryDetailContentProps) {
  const { data: scan, isLoading, isError } = useScanDetail(scanId);

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !scan) {
    return (
      <div className="w-full rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center text-sm text-rose-600">
        Riwayat pemeriksaan tidak ditemukan atau Anda tidak memiliki akses.
      </div>
    );
  }

  const history = {
    ...scan,
    id: scan.uuid,
    confidence: Number(scan.confidence),
    severity_score: scan.severity_score ?? null,
    model_used: scan.model_used ?? null,
  };

  return (
    <div className="w-full space-y-6">
      <HistoryDetail history={history} />
    </div>
  );
}
