import { GradientSummaryCards } from "@/features/shared/components/GradientSummaryCards";

import type { SkinConcernsPageData } from "../lib/skinConcernsTypes";
import { SkinConcernsTable } from "./SkinConcernsTable";

function ListWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm0 5.25h.007v.008H3.75V12zm0 5.25h.007v.008H3.75v-.008z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function DatabaseWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function EyeWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

type SkinConcernsContentProps = SkinConcernsPageData;

export function SkinConcernsContent({
  concerns,
  pagination,
}: SkinConcernsContentProps) {
  const cards = [
    {
      label: "Total Concern",
      value: String(pagination.totalItems),
      helper: "Concern yang tersedia di sistem",
      variant: "navy" as const,
      icon: <ListWatermark />,
    },
    {
      label: "Sumber Data",
      value: "Master",
      helper: "Diambil dari tabel skin_concerns",
      variant: "emerald" as const,
      icon: <DatabaseWatermark />,
    },
    {
      label: "Akses Dokter",
      value: "Read Only",
      helper: "Dokter hanya dapat melihat detail",
      variant: "sky" as const,
      icon: <EyeWatermark />,
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Data Skin Concern</h1>
          <p className="mt-1 text-sm text-slate-500">Data ini berasal dari master skin concern dan digunakan sebagai acuan rekomendasi skincare.</p>
        </div>
      </div>
      <GradientSummaryCards cards={cards} />
      <SkinConcernsTable concerns={concerns} pagination={pagination} />
    </div>
  );
}
