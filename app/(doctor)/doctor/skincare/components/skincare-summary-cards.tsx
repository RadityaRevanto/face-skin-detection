import { Card } from "@/components/ui/card";

import type { SkincareSummary } from "../lib/skincare-types";

type SkincareSummaryCardsProps = {
  summary: SkincareSummary;
};

export function SkincareSummaryCards({ summary }: SkincareSummaryCardsProps) {
  const summaryCards = [
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
  ];

  return (
    <section className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      {summaryCards.map((item) => (
        <Card
          key={item.label}
          className='rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm dark:border-slate-100! dark:bg-white! dark:text-slate-950!'
        >
          <p className='text-sm font-semibold text-slate-500'>{item.label}</p>

          <p className='mt-3 text-3xl font-bold tracking-tight text-slate-950'>
            {item.value}
          </p>

          <p className='mt-1 text-xs text-slate-500'>{item.helper}</p>
        </Card>
      ))}
    </section>
  );
}
