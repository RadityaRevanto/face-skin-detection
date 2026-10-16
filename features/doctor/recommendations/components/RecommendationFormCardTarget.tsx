"use client";

import Link from "next/link";
import { Target, Bot, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export type RecommendationConcernOption = {
  id: string;
  name: string;
};

export type RecommendationProductOption = {
  id: string;
  name: string;
  category: string;
};

type RecommendationFormCardTargetProps = {
  concernId: string;
  setConcernId: (v: string) => void;
  concerns: RecommendationConcernOption[];
  productId: string;
  setProductId: (v: string) => void;
  products: RecommendationProductOption[];
};

export function RecommendationFormCardTarget({
  concernId,
  setConcernId,
  concerns,
  productId,
  setProductId,
  products,
}: RecommendationFormCardTargetProps) {
  return (
    <section className="bg-surface rounded-2xl p-6 shadow-xs border border-border/50 flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-surface-container-low text-role-accent-doctor flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <h2 className="font-headline-md text-headline-md text-ink font-semibold">
            Target Masalah Kulit &amp; Produk
          </h2>
        </div>
        <span className="font-caption text-caption text-ink-subtle font-medium">
          Bagian 1 dari 3
        </span>
      </div>

      {/* Target Skin Concern */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="skinConcern"
          className="font-headline-sm text-caption text-ink font-semibold flex items-center gap-1"
        >
          Target Skin Concern <span className="text-danger font-bold">*</span>
        </label>
        <div className="relative">
          <select
            id="skinConcern"
            required
            value={concernId}
            onChange={(e) => setConcernId(e.target.value)}
            className="w-full h-11 px-3.5 pr-10 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:outline-none focus:bg-surface focus:ring-2 focus:ring-role-accent-doctor/30 transition-all cursor-pointer"
          >
            <option value="">Pilih target skin concern</option>
            {concerns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <p className="font-caption text-caption text-ink-subtle flex items-center gap-1 mt-0.5">
          <Bot className="w-3.5 h-3.5 text-role-accent-doctor shrink-0" />
          <span>Model AI SkinCek akan memicu aturan ini ketika mendeteksi concern ini pada scan wajah.</span>
        </p>
      </div>

      {/* Produk Rekomendasi */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="recommendedProduct"
            className="font-headline-sm text-caption text-ink font-semibold flex items-center gap-1"
          >
            Produk Rekomendasi{" "}
            <span className="font-caption text-caption text-ink-subtle font-normal">
              (Opsional)
            </span>
          </label>
          <Link
            href={ROUTES.DOCTOR.SKINCARE_CREATE}
            className="font-caption text-caption text-role-accent-doctor font-semibold hover:underline cursor-pointer"
          >
            + Daftarkan Produk Baru
          </Link>
        </div>
        <div className="relative">
          <select
            id="recommendedProduct"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full h-11 px-3.5 pr-10 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:outline-none focus:bg-surface focus:ring-2 focus:ring-role-accent-doctor/30 transition-all cursor-pointer"
          >
            <option value="">-- Tanpa Rekomendasi Produk Spesifik (Edukasi Saja) --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category})
              </option>
            ))}
          </select>
        </div>
        <p className="font-caption text-caption text-ink-subtle flex items-center gap-1 mt-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-ink-subtle shrink-0" />
          <span>Hanya menampilkan produk skincare berstatus aktif milik klinik Anda.</span>
        </p>
      </div>
    </section>
  );
}
