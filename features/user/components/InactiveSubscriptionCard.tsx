"use client";

import { CheckCircle2, Loader2, ScanFace, MessagesSquare, History, ShieldCheck, Sparkles } from "lucide-react";

type Props = {
  isProcessing: boolean;
  onCheckout: () => void;
};

const BENEFITS = [
  {
    icon: ScanFace,
    title: "Scan kulit tanpa batas",
    description: "Analisis kondisi kulit kapan saja. Akun gratis dibatasi 3x scan per hari.",
  },
  {
    icon: MessagesSquare,
    title: "Chat dokter tanpa batas",
    description: "Konsultasi dengan dokter spesialis sepuasnya. Akun gratis hanya mendapat 3 pesan.",
  },
  {
    icon: History,
    title: "Riwayat pemeriksaan lengkap",
    description: "Semua hasil scan dan rekomendasi tersimpan otomatis untuk pemantauan berkala.",
  },
  {
    icon: ShieldCheck,
    title: "Pembayaran aman via Midtrans",
    description: "Transaksi terenkripsi, mendukung berbagai metode pembayaran.",
  },
];

export function InactiveSubscriptionCard({ isProcessing, onCheckout }: Props) {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-200 shadow-sm bg-white">
        {/* Header harga */}
        <div className="bg-amber-50 border-b border-amber-100 p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
            <Sparkles size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Langganan Pro</h2>
          <p className="text-slate-500 text-sm mb-5">
            Semua fitur Skincek tanpa batas, satu harga.
          </p>

          <div className="text-4xl font-black text-slate-900 flex items-end justify-center gap-1">
            Rp15.000
            <span className="text-base font-semibold text-slate-400 mb-1.5">/bulan</span>
          </div>
        </div>

        {/* Daftar benefit */}
        <div className="p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">
            Yang Anda dapatkan
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <li key={benefit.title} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <benefit.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-sm font-bold text-slate-900">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    {benefit.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-500">
                    {benefit.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={onCheckout}
            disabled={isProcessing}
            className="mt-8 w-full py-3.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
              </span>
            ) : (
              "Berlangganan Sekarang"
            )}
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            Pembayaran sekali untuk 30 hari. Bisa dibatalkan kapan saja.
          </p>
        </div>
      </div>
    </div>
  );
}
