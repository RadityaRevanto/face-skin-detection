"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, XCircle, Loader2, Sparkles, AlertCircle, ReceiptText } from "lucide-react";

type Subscription = {
  uuid: string;
  plan_code: string;
  period?: string;
  status: string;
  amount: number;
  currency?: string;
  payment_method?: string | null;
  midtrans_order_id?: string | null;
  starts_at: string | null;
  ends_at: string | null;
  paid_at: string | null;
  created_at: string;
};

type ReceiptData = {
  plan_code: string;
  period?: string;
  amount: number;
  currency?: string;
  payment_method?: string | null;
  midtrans_order_id?: string | null;
  starts_at: string | null;
  ends_at: string | null;
  paid_at: string | null;
};

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelTargetUuid, setCancelTargetUuid] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);
  const router = useRouter();

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/subscriptions");
      const data = await res.json();
      if (data.data) {
        setSubscriptions(data.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Gagal memuat data langganan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const activeSubscription = subscriptions.find(
    (s) => s.status === "active" && (!s.ends_at || new Date(s.ends_at) >= new Date())
  );

  const handleCheckout = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat transaksi");
      }

      if (data.data?.snap_token) {
        // @ts-ignore
        window.snap.pay(data.data.snap_token, {
          onSuccess: function (result: any) {
            fetchSubscriptions();
          },
          onPending: function (result: any) {
            fetchSubscriptions();
          },
          onError: function (result: any) {
            setErrorMsg("Pembayaran gagal, silakan coba lagi.");
          },
          onClose: function () {
            fetchSubscriptions();
          },
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewReceipt = async () => {
    if (!activeSubscription) return;
    setIsLoadingReceipt(true);
    try {
      const res = await fetch(`/api/subscriptions/${activeSubscription.uuid}/receipt`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengambil struk");
      setReceipt(data.data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoadingReceipt(false);
    }
  };

  const handleCancelClick = (uuid: string) => {
    setCancelTargetUuid(uuid);
    setIsCancelModalOpen(true);
  };

  const executeCancel = async () => {
    if (!cancelTargetUuid) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setIsCancelModalOpen(false);

    try {
      const res = await fetch(`/api/subscriptions/${cancelTargetUuid}/cancel`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal membatalkan langganan");
      }

      fetchSubscriptions();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
      setCancelTargetUuid(null);
    }
  };

  return (
    <>
      <Script
        src={
          process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"
        }
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />

      <main className="min-h-[calc(100vh-72px)] bg-[#f7fbf8] p-4 sm:p-6 lg:p-10 flex flex-col items-center">
        {errorMsg && (
          <div className="w-full max-w-3xl mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-emerald-100/50 overflow-hidden">
          <div className="bg-linear-to-r from-emerald-800 to-emerald-600 p-8 sm:p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
              <Sparkles size={120} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 relative z-10">SkinCek Pro</h1>
            <p className="text-emerald-100 max-w-xl mx-auto relative z-10 text-sm sm:text-base">
              Akses konsultasi tanpa batas dengan dokter spesialis dan nikmati prioritas dalam menganalisis kesehatan kulit Anda.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Memuat data langganan...</p>
              </div>
            ) : activeSubscription ? (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Aktif
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Paket SkinCek Pro</h2>
                  <p className="text-slate-500 text-sm">
                    Berlaku hingga: <span className="font-semibold text-slate-700">{activeSubscription.ends_at ? new Date(activeSubscription.ends_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Selamanya'}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <button
                    onClick={handleViewReceipt}
                    disabled={isLoadingReceipt}
                    className="w-full md:w-auto px-6 py-3 bg-white border-2 border-emerald-100 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoadingReceipt ? <Loader2 size={16} className="animate-spin" /> : <ReceiptText size={16} />}
                    Lihat Struk
                  </button>
                  <button
                    onClick={() => handleCancelClick(activeSubscription.uuid)}
                    disabled={isProcessing}
                    className="w-full md:w-auto px-6 py-3 bg-white border-2 border-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? "Memproses..." : "Batalkan Langganan"}
                  </button>
                </div>
              </div>
            ) : (
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
                    onClick={handleCheckout}
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
            )}

            {subscriptions.length > 0 && (
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
            )}
          </div>
        </div>
      </main>

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-linear-to-r from-emerald-700 to-emerald-500 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <ReceiptText size={20} /> Struk Langganan
              </h3>
              <button onClick={() => setReceipt(null)} className="opacity-80 hover:opacity-100">
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
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">Batalkan Langganan?</h2>
              <p className="text-zinc-500 mb-6 text-sm sm:text-base leading-relaxed">
                Anda akan kehilangan akses prioritas dan konsultasi tanpa batas. <br /><br />
                <span className="font-semibold text-red-600">Peringatan:</span> Sisa waktu paket yang sudah dibayar tidak dapat di-refund (dikembalikan).
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setIsCancelModalOpen(false);
                    setCancelTargetUuid(null);
                  }}
                  className="flex-1 px-4 py-3 border border-zinc-200 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={executeCancel}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Ya, Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
