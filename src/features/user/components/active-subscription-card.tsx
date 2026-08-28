"use client";

import { CheckCircle2, ReceiptText, Loader2 } from "lucide-react";
import type { Subscription } from "./types";

type Props = {
  subscription: Subscription;
  isLoadingReceipt: boolean;
  isProcessing: boolean;
  onViewReceipt: () => void;
  onCancel: () => void;
};

export function ActiveSubscriptionCard({
  subscription,
  isLoadingReceipt,
  isProcessing,
  onViewReceipt,
  onCancel,
}: Props) {
  return (
    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Aktif
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Paket SkinCek Pro</h2>
        <p className="text-slate-500 text-sm">
          Berlaku hingga: <span className="font-semibold text-slate-700">{subscription.ends_at ? new Date(subscription.ends_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Selamanya'}</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full md:w-auto">
        <button
          onClick={onViewReceipt}
          disabled={isLoadingReceipt}
          className="w-full md:w-auto px-6 py-3 bg-white border-2 border-emerald-100 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoadingReceipt ? <Loader2 size={16} className="animate-spin" /> : <ReceiptText size={16} />}
          Lihat Struk
        </button>
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full md:w-auto px-6 py-3 bg-white border-2 border-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-50"
        >
          {isProcessing ? "Memproses..." : "Batalkan Langganan"}
        </button>
      </div>
    </div>
  );
}
