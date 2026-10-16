"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ROUTES } from "@/lib/constants";

import type { SkincarePageData } from "../types";
import { SkincareSummaryCards } from "./SkincareSummaryCards";
import { SkincareFilterBar } from "./SkincareFilterBar";
import { SkincareTable } from "./SkincareTable";

type SkincareContentProps = SkincarePageData;

export function SkincareContent({
  products,
  summary,
  pagination,
}: SkincareContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category && p.category !== "-") set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (
        selectedCategory !== "all" &&
        p.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      if (statusFilter === "active" && p.isActive === false) return false;
      if (statusFilter === "inactive" && p.isActive !== false) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesIng = p.keyIngredients.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        return matchesName || matchesIng || matchesCategory;
      }
      return true;
    });
  }, [products, selectedCategory, statusFilter, searchQuery]);

  return (
    <div className="w-full space-y-space-lg">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md bg-surface p-space-lg rounded-xl shadow-xs border border-border/50">
        <div className="flex flex-col max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-eyebrow text-eyebrow uppercase text-role-accent-doctor font-semibold tracking-wider">
              Katalog Formulasi Medis
            </span>
          </div>
          <h1 className="font-display text-display text-ink font-bold tracking-tight">
            Produk Skincare
          </h1>
          <p className="font-body-default text-body-default text-ink-muted mt-1">
            Kelola formula dan produk perawatan kulit klinik Anda yang diintegrasikan ke sistem inferensi rekomendasi AI.
          </p>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <Link
            href={ROUTES.DOCTOR.SKINCARE_CREATE}
            className="inline-flex items-center justify-center gap-2 h-11 px-space-lg rounded-xl bg-role-accent-doctor text-on-primary font-headline-sm text-headline-sm hover:opacity-95 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Produk</span>
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <SkincareSummaryCards summary={summary} />

      {/* FilterBar & Toolbar */}
      <SkincareFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={() => {
          setSelectedCategory("all");
          setSearchQuery("");
          setStatusFilter("all");
        }}
      />

      {/* DataTable */}
      <SkincareTable products={filteredProducts} pagination={pagination} />
    </div>
  );
}
