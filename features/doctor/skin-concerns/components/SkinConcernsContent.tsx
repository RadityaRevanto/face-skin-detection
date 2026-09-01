import { Card } from "@/components/ui/card";

import type { SkinConcernsPageData } from "../lib/skinConcernsTypes";
import { SkinConcernsTable } from "./SkinConcernsTable";

type SkinConcernsContentProps = SkinConcernsPageData;

export function SkinConcernsContent({
  concerns,
  pagination,
}: SkinConcernsContentProps) {
  const summaryCards = [
    { label: "Total Concern", value: String(pagination.totalItems), helper: "Concern yang tersedia di sistem" },
    { label: "Sumber Data", value: "Master", helper: "Diambil dari tabel skin_concerns" },
    { label: "Akses Dokter", value: "Read Only", helper: "Dokter hanya dapat melihat detail" },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Data Skin Concern</h1>
          <p className="mt-1 text-sm text-slate-500">Data ini berasal dari master skin concern dan digunakan sebagai acuan rekomendasi skincare.</p>
        </div>
      </div>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {summaryCards.map((item) => (
          <Card key={item.label} className="rounded-2xl border-slate-100! bg-white! p-5 text-slate-950! shadow-sm">
            <p className="text-sm font-semibold text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{item.value}</p>
            <p className="mt-1 text-xs text-slate-500">{item.helper}</p>
          </Card>
        ))}
      </section>
      <SkinConcernsTable concerns={concerns} pagination={pagination} />
    </div>
  );
}
