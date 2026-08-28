"use client";

import { useState, useEffect } from "react";
import type { SkincareProduct, SkincareCategory } from "../types";
import { SKINCARE_CATEGORY_LABELS } from "../types";
import { SkincareProductCard } from "./SkincareProductCard";

type SkincareCatalogProps = {
  initialProducts: SkincareProduct[];
  initialTotal: number;
};

const CATEGORIES: (SkincareCategory | "all")[] = [
  "all",
  "cleanser",
  "toner",
  "serum",
  "moisturizer",
  "sunscreen",
  "exfoliant",
  "mask",
  "treatment",
  "other",
];

export function SkincareCatalog({
  initialProducts,
  initialTotal,
}: SkincareCatalogProps) {
  const [products, setProducts] = useState<SkincareProduct[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [selectedCategory, setSelectedCategory] = useState<
    SkincareCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  async function fetchProducts(page = 1) {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: "12",
      });
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/skincare-products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.data ?? []);
      setTotal(data.meta?.total ?? 0);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Katalog Skincare
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Temukan produk skincare yang sesuai untuk kulit Anda
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Cari produk skincare..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value as SkincareCategory | "all")
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all"
                ? "Semua Kategori"
                : SKINCARE_CATEGORY_LABELS[cat as SkincareCategory]}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500">
        {total} produk ditemukan
      </p>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <SkincareProductCard key={product.uuid} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <p className="text-sm font-semibold text-slate-500">
            Tidak ada produk skincare ditemukan
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </div>
      )}
    </div>
  );
}
