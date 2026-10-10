"use client";

import { Search, RotateCcw } from "lucide-react";

export type SkincareFilterBarProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  onReset: () => void;
};

export function SkincareFilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onReset,
}: SkincareFilterBarProps) {
  return (
    <div className="bg-surface rounded-xl shadow-xs border border-border/50 p-space-md flex flex-col gap-space-md">
      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-caption text-caption font-semibold transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-role-accent-doctor text-on-primary shadow-xs"
                : "bg-surface-alt text-ink-muted hover:text-ink hover:bg-surface-container-low"
            }`}
          >
            <span>Semua</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-caption text-caption font-semibold transition-all cursor-pointer capitalize ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-role-accent-doctor text-on-primary shadow-xs"
                  : "bg-surface-alt text-ink-muted hover:text-ink hover:bg-surface-container-low"
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search and Select Filters */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-space-sm">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari formula, nama produk, atau bahan aktif..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-alt text-ink font-body-default text-body-default placeholder:text-ink-subtle focus:outline-none focus:bg-surface focus:ring-2 focus:ring-role-accent-doctor/30 border border-border/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-space-sm w-full lg:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-11 px-4 pr-9 rounded-xl bg-surface-alt text-ink font-body-default text-body-default border border-border/40 focus:outline-none focus:ring-2 focus:ring-role-accent-doctor/30 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>

          <button
            type="button"
            onClick={onReset}
            className="h-11 px-4 inline-flex items-center gap-2 rounded-xl bg-surface-alt hover:bg-surface-container-low text-ink-muted hover:text-ink font-caption text-caption font-semibold border border-border/40 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
