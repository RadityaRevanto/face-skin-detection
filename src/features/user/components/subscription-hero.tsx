"use client";

import { Sparkles } from "lucide-react";

export function SubscriptionHero() {
  return (
    <div className="bg-linear-to-r from-emerald-800 to-emerald-600 p-8 sm:p-10 text-white text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
        <Sparkles size={120} />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 relative z-10">SkinCek Pro</h1>
      <p className="text-emerald-100 max-w-xl mx-auto relative z-10 text-sm sm:text-base">
        Akses konsultasi tanpa batas dengan dokter spesialis dan nikmati prioritas dalam menganalisis kesehatan kulit Anda.
      </p>
    </div>
  );
}
