"use client";

import { Bot } from "lucide-react";
import { useDialogEscape } from "@/features/shared/hooks/useDialogEscape";

type AiConsentModalProps = {
  /** Teks consent (GET /ai-chat/consent) — bisa kosong → fallback default. */
  consentText?: string | null;
  isSubmitting: boolean;
  onCancel: () => void;
  /** "Setuju & Mulai Chat" — container yang melakukan POST consent lalu lanjut chat. */
  onAccept: () => void;
};

/**
 * Modal persetujuan penggunaan AI — teks & alur identik dengan kartu
 * "Persetujuan Kecerdasan Buatan (AI)" di /user/profile/privacy.
 * Dipakai saat user mencoba chat Aura Skin tanpa consent (403 BE).
 */
export function AiConsentModal({
  consentText,
  isSubmitting,
  onCancel,
  onAccept,
}: AiConsentModalProps) {
  useDialogEscape(true, onCancel);
  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center bg-zinc-900/50 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="ai-consent-title">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start gap-3 border-b border-slate-100 bg-emerald-50/60 p-5">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
            <Bot size={22} />
          </div>
          <div className="min-w-0">
            <h3 id="ai-consent-title" className="text-base font-bold text-slate-900">
              Persetujuan Kecerdasan Buatan (AI)
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Diperlukan sebelum mengobrol dengan Aura Skin
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            {consentText ||
              "Dengan menyetujui, Anda mengizinkan Skincek membagikan isi pesan teks chat Anda ke penyedia kecerdasan buatan (Google Gemini) agar bot Aura Skin dapat menjawab pertanyaan Anda. Pesan ini tidak digunakan untuk melatih model mereka. Anda dapat mencabut persetujuan ini kapan saja melalui menu Privasi & Data."}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 p-4 sm:flex-row">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Nanti Saja
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onAccept}
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "Setuju & Mulai Chat"}
          </button>
        </div>
      </div>
    </div>
  );
}
