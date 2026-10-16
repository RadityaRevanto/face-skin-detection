"use client";

import { Clock } from "lucide-react";
import type { Subscription } from "./types";

const STATUS_LABEL: Record<string, string> = {
  active: "Aktif",
  pending: "Menunggu Pembayaran",
  cancelled: "Dibatalkan",
  expired: "Kedaluwarsa",
};

type Props = {
  subscriptions: Subscription[];
  /** Subscription pending yang sedang diproses lanjut-bayar. */
  resumingUuid?: string | null;
  onContinuePayment: (uuid: string) => void;
  onViewReceipt: (uuid: string) => void;
};

export function SubscriptionHistory({
  subscriptions,
  resumingUuid = null,
  onContinuePayment,
  onViewReceipt,
}: Props) {
  if (subscriptions.length === 0) return null;
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Clock size={20} className="text-slate-400" /> Riwayat Transaksi
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Paket</th>
              <th className="py-3 px-4">Nominal</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.uuid} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                <td className="py-3 px-4 text-slate-700">
                  {new Date(sub.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="py-3 px-4 text-slate-700 font-medium capitalize">
                  {sub.plan_code.replace('_', ' ')}
                </td>
                <td className="py-3 px-4 text-slate-700">
                  Rp{sub.amount.toLocaleString('id-ID')}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sub.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      sub.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        sub.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                    }`}>
                    {STATUS_LABEL[sub.status] ?? sub.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {/* Pending → bisa lanjut pembayaran */}
                  {sub.status === 'pending' ? (
                    <button
                      type="button"
                      onClick={() => onContinuePayment(sub.uuid)}
                      disabled={resumingUuid === sub.uuid}
                      className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
                    >
                      {resumingUuid === sub.uuid ? "Membuka..." : "Lanjutkan Pembayaran"}
                    </button>
                  ) : sub.status === 'active' ? (
                    <button
                      type="button"
                      onClick={() => onViewReceipt(sub.uuid)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      Lihat Struk
                    </button>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
