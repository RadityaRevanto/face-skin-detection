import { PageHeader } from "@/components/ui/page-header";
import type { SkinConcernsPageData } from "../lib/skinConcernsTypes";
import { SkinConcernsTable } from "./SkinConcernsTable";

type SkinConcernsContentProps = SkinConcernsPageData;

export function SkinConcernsContent({
  concerns,
  pagination,
}: SkinConcernsContentProps) {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        eyebrow="Referensi Kondisi Kulit"
        title="Data Skin Concern"
        description={`${pagination.totalItems} concern dari data master — acuan rekomendasi skincare, hanya dapat dilihat (read-only).`}
      />
      <SkinConcernsTable concerns={concerns} pagination={pagination} />
    </div>
  );
}
