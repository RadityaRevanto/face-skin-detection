import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getConcernNameByMlLabel,
  getPaginatedRecommendations,
} from "./_lib/recommendations-query";
import { RecommendationCard } from "../history/_components/recommendation-card";

export const metadata: Metadata = {
  title: "Semua Rekomendasi | Face Skin Detection",
  description: "Daftar lengkap rekomendasi perawatan kulit",
};

type RecommendationsPageProps = {
  searchParams?: Promise<{
    ml_label?: string;
    history_id?: string;
    page?: string;
  }>;
};

export default async function RecommendationsPage({
  searchParams,
}: RecommendationsPageProps) {
  const resolvedParams = await searchParams;
  const mlLabel = resolvedParams?.ml_label?.trim() || null;
  const historyId = resolvedParams?.history_id;

  // Tanpa ml_label tidak ada konteks kondisi kulit → kembali ke history.
  if (!mlLabel) {
    redirect("/user/history");
  }

  const pageParam = resolvedParams?.page;
  const parsedPage = pageParam ? parseInt(pageParam, 10) : 1;
  const validPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const concernName = await getConcernNameByMlLabel(mlLabel);
  const { data: recommendations, totalPages, currentPage } =
    await getPaginatedRecommendations(mlLabel, validPage, 5);

  const backUrl = historyId ? `/user/history?id=${historyId}` : "/user/history";

  const buildPageUrl = (page: number) =>
    `/user/recommendations?ml_label=${encodeURIComponent(mlLabel)}&history_id=${historyId || ""}&page=${page}`;

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header dengan Tombol Kembali */}
      <div className="flex items-center gap-4">
        <Link
          href={backUrl}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          title="Kembali ke History"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Rekomendasi Lengkap
          </h1>
          <p className="text-sm text-slate-500">
            Menampilkan seluruh rekomendasi perawatan untuk kondisi <span className="font-semibold text-emerald-600">{concernName || "kulit"}</span>.
          </p>
        </div>
      </div>

      {/* Konten Rekomendasi */}
      <RecommendationCard recommendations={recommendations} />

      {/* Paginasi Sederhana */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Link
            href={buildPageUrl(currentPage - 1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage <= 1
                ? "pointer-events-none bg-slate-100 text-slate-400"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            aria-disabled={currentPage <= 1}
          >
            Sebelumnya
          </Link>

          <span className="px-4 py-2 text-sm font-medium text-slate-600">
            Halaman {currentPage} dari {totalPages}
          </span>

          <Link
            href={buildPageUrl(currentPage + 1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage >= totalPages
                ? "pointer-events-none bg-slate-100 text-slate-400"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            aria-disabled={currentPage >= totalPages}
          >
            Selanjutnya
          </Link>
        </div>
      )}
    </main>
  );
}
