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
  const endsAt = subscription.ends_at
    ? new Date(subscription.ends_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Selamanya";

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
      <div className="bg-emerald-600 p-6 text-white sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Langganan Aktif
        </span>
        <h2 className="mt-3 text-2xl font-bold">SkinCek Pro</h2>
        <p className="mt-1 text-sm text-emerald-50">
          Berlaku hingga{" "}
          <span className="font-bold text-white">{endsAt}</span>
        </p>
      </div>

      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          <p className="font-semibold text-slate-700">
            Rp{subscription.amount.toLocaleString("id-ID")}
            <span className="font-normal text-slate-400"> / bulan</span>
          </p>
          <p className="mt-0.5">
            Dibayar{" "}
            {subscription.paid_at
              ? new Date(subscription.paid_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
            {subscription.payment_method ? ` • ${subscription.payment_method}` : ""}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={onViewReceipt}
            disabled={isLoadingReceipt}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-100 bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-50 disabled:opacity-50"
          >
            {isLoadingReceipt ? <Loader2 size={16} className="animate-spin" /> : <ReceiptText size={16} />}
            Lihat Struk
          </button>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="inline-flex items-center justify-center rounded-xl border-2 border-red-100 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-50 hover:border-red-200 disabled:opacity-50"
          >
            Batalkan Langganan
          </button>
        </div>
      </div>
    </section>
  );
}
