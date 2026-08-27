"use client";

import { Check, Info } from "lucide-react";

type ErrorCta = "subscription" | "consent";

interface ErrorPopupProps {
  errorState: { message: string; cta?: ErrorCta } | null;
  setErrorState: (val: { message: string; cta?: ErrorCta } | null) => void;
  successMsg: string | null;
  setSuccessMsg: (val: string | null) => void;
}

export function ErrorPopup({ errorState, setErrorState, successMsg, setSuccessMsg }: ErrorPopupProps) {
  return (
    <>
      {errorState && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden transform transition-all">
            <div className="bg-rose-50 p-4 border-b border-rose-100 flex items-center gap-3">
              <div className="bg-rose-100 text-rose-600 p-2 rounded-full">
                <Info size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-rose-800 text-base">Pemberitahuan</h3>
            </div>
            <div className="p-5">
              <p className="text-zinc-600 text-sm leading-relaxed">{errorState.message}</p>
            </div>
            <div className={`p-4 bg-zinc-50 border-t border-zinc-100 flex ${errorState.cta ? "flex-col gap-2" : "justify-end"}`}>
              {errorState.cta === "subscription" && (
                <a
                  href="/user/subscription"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors text-center"
                >
                  Upgrade ke Pro
                </a>
              )}
              {errorState.cta === "consent" && (
                <a
                  href="/user/profile/privacy"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors text-center"
                >
                  Atur Persetujuan AI
                </a>
              )}
              <button
                onClick={() => setErrorState(null)}
                className={`${errorState.cta ? "w-full py-2.5 border border-zinc-200 text-zinc-700 hover:bg-zinc-100" : "px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white"} text-sm font-medium rounded-xl transition-colors`}
              >
                {errorState.cta ? "Nanti Saja" : "Tutup"}
              </button>
            </div>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center gap-3">
              <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                <Check size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-emerald-800 text-base">Berhasil</h3>
            </div>
            <div className="p-5 text-center">
              <p className="text-zinc-600 text-sm leading-relaxed font-medium">{successMsg}</p>
            </div>
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-center">
              <button 
                onClick={() => setSuccessMsg(null)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
