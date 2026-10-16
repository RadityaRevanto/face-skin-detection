"use client";

import { ReceiptText, XCircle } from "lucide-react";
import type { ReceiptData } from "./types";
import { useDialogEscape } from "@/features/shared/hooks/useDialogEscape";

type Props = {
  receipt: ReceiptData | null;
  onClose: () => void;
};

export function ReceiptModal({ receipt, onClose }: Props) {
  useDialogEscape(!!receipt, onClose);
  if (!receipt) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-emerald-700 p-5 text-white flex items-center justify-between">
          <h3 id="receipt-title" className="font-bold flex items-center gap-2">
            <ReceiptText size={20} /> Struk Langganan
          </h3>
          <button onClick={onClose} aria-label="Tutup" className="opacity-80 hover:opacity-100">
            <XCircle size={22} />
          </button>
        </div>
        <dl className="p-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Nomor Order</dt>
            <dd className="font-semibold text-zinc-800 text-right break-all">{receipt.midtrans_order_id ?? "-"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Paket</dt>
            <dd className="font-semibold text-zinc-800 capitalize">{receipt.plan_code.replace("_", " ")}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Metode Bayar</dt>
            <dd className="font-semibold text-zinc-800">{receipt.payment_method ?? "-"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500">Dibayar Pada</dt>
            <dd className="font-semibold text-zinc-800">
              {receipt.paid_at ? new Date(receipt.paid_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-"}
            </dd>
          </div>
          <div className="flex justify-between gap-4 pt-3 border-t border-dashed border-zinc-200">
            <dt className="text-zinc-500 font-medium">Total</dt>
            <dd className="font-black text-emerald-600 text-lg">
              {(receipt.currency ?? "IDR") === "IDR" ? "Rp" : `${receipt.currency} `}
              {receipt.amount.toLocaleString("id-ID")}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
