import Link from "next/link";

import { Pagination } from "@/components/ui/pagination";

import type { DoctorProfile, DoctorReview } from "../types";
import type { PagePagination } from "@/lib/types/pagination";
import { StartAuraChatButton } from "./StartAuraChatButton";
import { StartConsultationButton } from "./StartConsultationButton";

type DoctorProfileContentProps = {
  doctor: DoctorProfile;
  reviews: DoctorReview[];
  reviewsPagination: PagePagination;
  isLoadingReviews?: boolean;
  isReviewsError?: boolean;
};

function Stars({ rating }: { rating: number | string | null | undefined }) {
  if (rating == null) return <span className="text-sm text-slate-400">—</span>;
  // BE AVG() bisa mengirim string "4.5000" — normalisasi agar aman.
  const value = Number(rating);
  if (!Number.isFinite(value)) return <span className="text-sm text-slate-400">—</span>;
  const rounded = Math.round(value);
  return (
    <span className="text-sm font-bold text-amber-500">
      {"★".repeat(rounded)}
      <span className="text-slate-300">{"★".repeat(5 - rounded)}</span>
    </span>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 py-3 last:border-0 sm:flex-row sm:items-start sm:gap-6">
      <span className="w-40 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <span className="min-w-0 text-sm font-medium text-slate-700">
        {value ?? "-"}
      </span>
    </div>
  );
}

/**
 * Halaman profil dokter publik ("stalking mode") — semua field teks,
 * tanpa dokumen verifikasi (by design untuk privasi).
 */
export function DoctorProfileContent({
  doctor,
  reviews,
  reviewsPagination,
  isLoadingReviews = false,
  isReviewsError = false,
}: DoctorProfileContentProps) {
  return (
    <div className="w-full space-y-6">
      <Link
        href="/user/consultations"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-600"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="m15 5-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Kembali ke daftar dokter
      </Link>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={doctor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name)}&background=10b981&color=fff`}
            alt={doctor.full_name}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-emerald-50"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {doctor.title ? `${doctor.full_name}, ${doctor.title}` : doctor.full_name}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {[doctor.specialization, doctor.sub_specialization]
                .filter(Boolean)
                .join(" — ")}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Stars rating={doctor.rating_avg} />
              <span className="text-sm text-slate-500">
                {doctor.rating_count > 0
                  ? `${Number(doctor.rating_avg).toFixed(1)} dari ${doctor.rating_count} review`
                  : "Belum ada review"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <h2 className="text-base font-bold text-slate-900">Tentang Dokter</h2>
        <div className="mt-3">
          <InfoRow
            label="Pengalaman"
            value={
              doctor.experience_years != null
                ? `${doctor.experience_years} tahun`
                : null
            }
          />
          <InfoRow label="STR" value={doctor.str_number ?? "-"} />
          <InfoRow label="Alma Mater" value={doctor.alma_mater ?? "-"} />
          <InfoRow
            label="Organisasi"
            value={
              doctor.professional_organizations?.length
                ? doctor.professional_organizations.join(", ")
                : null
            }
          />
        </div>

        <h2 className="mt-6 text-base font-bold text-slate-900">
          Lokasi Praktik
        </h2>
        <div className="mt-3">
          {doctor.practice_locations?.length ? (
            <ul className="space-y-2">
              {doctor.practice_locations.map((loc) => (
                <li key={loc} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  {loc}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">Belum ada info lokasi praktik.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Review ({reviewsPagination.totalItems})
          </h2>
          {doctor.rating_avg != null && (
            <span className="text-sm font-semibold text-slate-500">
              ⭐ {Number(doctor.rating_avg).toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {isLoadingReviews ? (
            <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
          ) : isReviewsError ? (
            <p className="text-sm text-rose-500">
              Gagal memuat review. Coba muat ulang halaman.
            </p>
          ) : reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div
                key={`${review.user.uuid}-${index}`}
                className="rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-slate-900">
                    {review.user.full_name || "Pengguna Skincek"}
                  </p>
                  <Stars rating={review.rating} />
                </div>
                {review.review && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {review.review}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-400">
                  {formatDate(review.created_at)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">Belum ada review.</p>
          )}
        </div>

        {reviewsPagination.totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={reviewsPagination.currentPage}
              totalPages={reviewsPagination.totalPages}
              totalItems={reviewsPagination.totalItems}
              pageSize={reviewsPagination.pageSize}
              itemLabel={reviewsPagination.itemLabel}
              basePath={reviewsPagination.basePath}
            />
          </div>
        )}
      </section>

      <div className="lg:max-w-xs">
        {doctor.is_ai_bot ? (
          <StartAuraChatButton />
        ) : (
          <StartConsultationButton doctor={doctor} />
        )}
      </div>
    </div>
  );
}
