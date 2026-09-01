import Link from "next/link";

import { Sparkles } from "lucide-react";

import type { DoctorCard } from "../types";

function Stars({ rating }: { rating: number | null }) {
  if (rating == null) return null;
  return (
    <span className="flex items-center gap-1">
      <span className="text-amber-400">★</span>
      <span className="text-xs font-bold text-slate-700">
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

function DoctorCardItem({ doctor }: { doctor: DoctorCard }) {
  return (
    <Link
      href={`/user/consultations/${doctor.uuid}`}
      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow-md sm:p-5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={doctor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name)}&background=10b981&color=fff`}
        alt={doctor.full_name}
        className="h-14 w-14 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-emerald-700">
          {doctor.title ? `${doctor.full_name}, ${doctor.title}` : doctor.full_name}
        </h3>
        <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
          {doctor.specialization ?? "Spesialisasi belum diisi"}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {doctor.rating_count > 0 ? (
            <>
              <Stars rating={doctor.rating_avg} />
              <span className="text-xs text-slate-400">
                ({doctor.rating_count} review)
              </span>
            </>
          ) : (
            <span className="text-xs text-slate-400">Belum ada review</span>
          )}
        </div>
      </div>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500">
        <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

function AiBotCard({ doctor }: { doctor: DoctorCard }) {
  return (
    <Link
      href={`/user/consultations/${doctor.uuid}`}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-transparent bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 p-[1.5px] transition-all hover:shadow-lg"
    >
      <div className="flex w-full items-center gap-4 rounded-[calc(1rem-1.5px)] bg-white p-4 sm:p-5">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-linear-to-br from-emerald-100 to-teal-50 ring-1 ring-emerald-200">
          <Sparkles className="h-6 w-6 text-emerald-600" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {doctor.full_name}
            </h3>
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              AI
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
            {doctor.specialization ?? "Asisten AI Skincek"}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {doctor.rating_count > 0 ? (
              <>
                <Stars rating={doctor.rating_avg} />
                <span className="text-xs text-slate-400">
                  ({doctor.rating_count} review)
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-400">Asisten AI Skincek</span>
            )}
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500">
          <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

type DoctorListProps = {
  doctors: DoctorCard[];
};

/**
 * List dokter + AI bot. Aura Skin selalu item pertama halaman 1
 * (dijamin backend orderByRaw) — desain card khusus di sisi frontend.
 */
export function DoctorList({ doctors }: DoctorListProps) {
  if (doctors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-sm font-semibold text-slate-500">
          Belum ada dokter yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {doctors.map((doctor) =>
        doctor.is_ai_bot ? (
          <AiBotCard key={doctor.uuid} doctor={doctor} />
        ) : (
          <DoctorCardItem key={doctor.uuid} doctor={doctor} />
        ),
      )}
    </div>
  );
}
