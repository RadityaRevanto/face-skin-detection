"use client";

import { Clock } from "lucide-react";
import type { Subscription } from "./types";

export function SubscriptionHistory({ subscriptions }: { subscriptions: Subscription[] }) {
  if (subscriptions.length === 0) return null;
  return (
    <div className="mt-12 pt-8 border-t border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Clock size={20} className="text-slate-400" /> Riwayat Transaksi
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-3 px-4 font-semibold">Tanggal</th>
              <th className="py-3 px-4 font-semibold">Paket</th>
              <th className="py-3 px-4 font-semibold">Nominal</th>
              <th className="py-3 px-4 font-semibold">Status</th>
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
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
