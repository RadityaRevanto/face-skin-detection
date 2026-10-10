"use client";

import { Sparkles } from "lucide-react";
import { categoryOptions } from "./SkincareFormTypes";

type SkincareFormBasicInfoProps = {
  name: string;
  setName: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  genderSuitability: string;
  setGenderSuitability: (v: string) => void;
};

export function SkincareFormBasicInfo({
  name,
  setName,
  category,
  setCategory,
  genderSuitability,
  setGenderSuitability,
}: SkincareFormBasicInfoProps) {
  return (
    <section className="bg-surface rounded-xl p-6 md:p-8 shadow-xs border border-border/50 space-y-5">
      <div className="flex items-center gap-3 pb-2 border-b border-border/30">
        <div className="w-8 h-8 rounded-lg bg-surface-container-low text-role-accent-doctor flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-headline-md text-headline-md text-ink font-semibold">
            1. Informasi Dasar Produk
          </h2>
          <p className="font-caption text-caption text-ink-subtle">
            Nama paten atau generik serta taksonomi sediaan topikal
          </p>
        </div>
      </div>

      <div>
        <label
          className="block font-headline-sm text-caption text-ink font-semibold mb-1.5"
          htmlFor="product-name"
        >
          Nama Produk Formula <span className="text-danger">*</span>
        </label>
        <input
          id="product-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Clarifying BHA Gentle Cleanser 2%"
          className="w-full px-4 py-3 rounded-xl bg-surface-alt text-ink font-body-default text-body-default placeholder:text-ink-subtle focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-doctor/30 border border-border/40 transition-all"
        />
        <p className="font-caption text-caption text-ink-subtle mt-1.5">
          Gunakan format nama yang memuat zat aktif dan konsentrasi utama.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            className="block font-headline-sm text-caption text-ink font-semibold mb-1.5"
            htmlFor="category"
          >
            Kategori Sediaan Produk <span className="text-danger">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-doctor/30 cursor-pointer"
          >
            <option value="">Pilih kategori produk</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block font-headline-sm text-caption text-ink font-semibold mb-1.5"
            htmlFor="gender"
          >
            Kesesuaian Gender <span className="text-danger">*</span>
          </label>
          <select
            id="gender"
            value={genderSuitability}
            onChange={(e) => setGenderSuitability(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-role-accent-doctor/30 cursor-pointer"
          >
            <option value="unisex">Unisex (Pria &amp; Wanita)</option>
            <option value="wanita">Khusus Wanita</option>
            <option value="pria">Khusus Pria</option>
          </select>
        </div>
      </div>
    </section>
  );
}
