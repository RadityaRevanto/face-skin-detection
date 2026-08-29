"use client";

import { Bot } from "lucide-react";

type Props = {
  consentStatus: boolean;
  isConsentLoading: boolean;
  onToggle: () => void;
};

export function AiConsentCard({ consentStatus, isConsentLoading, onToggle }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
          <Bot size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Persetujuan Kecerdasan Buatan (AI)</h3>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            Dengan menyetujui, Anda mengizinkan SkinCek membagikan isi pesan teks *chat* Anda ke penyedia kecerdasan buatan (Google Gemini) agar bot Aura Skin dapat menjawab pertanyaan Anda. Pesan ini tidak digunakan untuk melatih model mereka. Anda dapat mencabut persetujuan ini kapan saja.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={onToggle}
              disabled={isConsentLoading}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${consentStatus ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <span
                style={{ transform: consentStatus ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
                className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
              />
            </button>
            <span className="text-sm font-medium text-slate-700">
              {consentStatus ? "Diizinkan" : "Tidak Diizinkan"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
