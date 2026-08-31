"use client";

import { Sparkles, Loader2 } from "lucide-react";

type Props = {
  isProcessing: boolean;
  onCheckout: () => void;
};

export function InactiveSubscriptionCard({ isProcessing, onCheckout }: Props) {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 w-full max-w-md text-center shadow-sm">
        <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3">
          <Sparkles size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Langganan Pro</h2>
        <p className="text-slate-500 text-sm mb-6">Konsultasi dokter tanpa batas. Bebas tanya sepuasnya.</p>

        <div className="text-4xl font-black text-slate-900 mb-8 flex items-end justify-center gap-1">
          Rp15.000<span className="text-base font-semibold text-slate-400 mb-1.5">/bulan</span>
        </div>

        <button
          onClick={onCheckout}
          disabled={isProcessing}
          className="w-full py-3.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
            </span>
          ) : (
            "Berlangganan Sekarang"
          )}
        </button>
      </div>
    </div>
  );
}
