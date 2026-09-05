import { GradientSummaryCards } from "@/features/shared/components/GradientSummaryCards";

import type { SkincareSummary } from "../types";

type SkincareSummaryCardsProps = {
  summary: SkincareSummary;
};

function BottleWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function TagWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M6 6h.008v.008H6V6z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function FaceWatermark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0-1.007-.8-1.8-1.8-1.8s-1.8.793-1.8 1.8.8 1.8 1.8 1.8 1.8-.793 1.8-1.8zm7.5 0c0-1.007-.8-1.8-1.8-1.8s-1.8.793-1.8 1.8.8 1.8 1.8 1.8 1.8-.793 1.8-1.8z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
}

export function SkincareSummaryCards({ summary }: SkincareSummaryCardsProps) {
  const cards = [
    {
      label: "Total Produk",
      value: String(summary.totalProducts),
      helper: "Produk skincare terdaftar",
      variant: "sky" as const,
      icon: <BottleWatermark />,
    },
    {
      label: "Kategori",
      value: String(summary.totalCategories),
      helper: "Jenis produk tersedia",
      variant: "emerald" as const,
      icon: <TagWatermark />,
    },
    {
      label: "Skin Concern",
      value: String(summary.totalConcerns),
      helper: "Kondisi kulit tertangani",
      variant: "amber" as const,
      icon: <FaceWatermark />,
    },
  ];

  return <GradientSummaryCards cards={cards} />;
}
