"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { customToast } from "@/lib/custom-toast";

import type { DoctorProfile } from "../types";

/**
 * Button "Konsultasi Sekarang" (dokter manusia) — dialog konfirmasi
 * dulu, lalu POST /conversations → navigasi ke chat.
 */
export function StartConsultationButton({ doctor }: { doctor: DoctorProfile }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const startConversation = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id: doctor.uuid }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || "Gagal memulai konsultasi");
      }

      const data = await res.json();
      // firstOrCreate: conversation lama dipakai ulang bila sudah ada.
      router.push(`/user/chats?c=${data.data.uuid}`);
    } catch (error: unknown) {
      customToast.error("Gagal", {
        description: (error instanceof Error ? error.message : undefined) || "Gagal memulai konsultasi",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
      >
        Konsultasi Sekarang
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">
              Konsultasi Dokter
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Lakukan konsultasi dengan{" "}
              <span className="font-bold text-slate-900">
                {doctor.title ? `${doctor.full_name}, ${doctor.title}` : doctor.full_name}
              </span>
              ?
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Kamu akan masuk ke ruang chat pribadi dengan dokter ini.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isCreating}
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isCreating}
                onClick={startConversation}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {isCreating ? "Memproses..." : "Ya, Konsultasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
