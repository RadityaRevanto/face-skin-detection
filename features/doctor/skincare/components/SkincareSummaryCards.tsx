import { SummaryCardsRow } from "@/features/shared/components/SummaryCardsRow";

import type { SkincareSummary } from "../types";

type SkincareSummaryCardsProps = {
  summary: SkincareSummary;
};

export function SkincareSummaryCards({ summary }: SkincareSummaryCardsProps) {
  return (
    <SummaryCardsRow
      cards={[
        {
          label: "Total Produk",
          value: String(summary.totalProducts),
          helper: "Produk skincare terdaftar",
        },
        {
          label: "Kategori",
          value: String(summary.totalCategories),
          helper: "Jenis produk tersedia",
        },
        {
          label: "Skin Concern",
          value: String(summary.totalConcerns),
          helper: "Kondisi kulit tertangani",
        },
      ]}
    />
  );
}
