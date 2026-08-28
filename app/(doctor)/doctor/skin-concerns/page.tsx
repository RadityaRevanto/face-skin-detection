import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { requireDoctorProfile } from "@/lib/doctor-auth";
import { fetchApi } from "@/lib/api/server-client";
import { SkinConcernsTable } from "@/src/features/doctor/skin-concerns/components/SkinConcernsTable";

export const metadata: Metadata = {
  title: "Kelola Skin Concern | Face Skin Detection",
  description: "Lihat data skin concern untuk rekomendasi skincare",
};

const PAGE_SIZE = 10;

type PageProps = { searchParams?: Promise<{ page?: string }> };

type SkinConcernApi = { uuid: string; name: string; description?: string; default_severity_score?: number | string; is_active?: boolean };

export default async function DoctorSkinConcernsPage({ searchParams }: PageProps) {
  await requireDoctorProfile();
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params?.page ?? "1") || 1);

  let concerns: SkinConcernApi[] = [];
  let totalItems = 0;
  let totalPages = 1;
  try {
    const res = await fetchApi<SkinConcernApi[]>(`/skin-concerns?page=${currentPage}&per_page=${PAGE_SIZE}`);
    concerns = res.data ?? [];
    totalItems = res.meta?.total ?? 0;
    totalPages = res.meta?.last_page ?? 1;
  } catch (error) { console.error("Failed to fetch skin concerns:", error); }

  const summaryCards = [
    { label: "Total Concern", value: String(totalItems), helper: "Concern yang tersedia di sistem" },
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
      <SkinConcernsTable concerns={concerns} currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={PAGE_SIZE} />
    </div>
  );
}
