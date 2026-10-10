"use client";

import { Search, RotateCcw } from "lucide-react";

export type RecommendationFilterBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  concernFilter: string;
  onConcernChange: (concern: string) => void;
  concerns: string[];
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
  onReset: () => void;
};

export function RecommendationFilterBar({
  searchQuery,
  onSearchChange,
  concernFilter,
  onConcernChange,
  concerns,
  priorityFilter,
  onPriorityChange,
  onReset,
}: RecommendationFilterBarProps) {
  return (
    <section className="bg-surface rounded-2xl p-space-md shadow-xs border border-border/50 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[280px]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-subtle">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari target concern, judul aturan, atau produk..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-alt font-body-default text-body-default text-ink placeholder:text-ink-subtle focus:outline-none focus:bg-surface focus:ring-2 focus:ring-role-accent-doctor/30 border border-border/40 transition-all"
        />
      </div>

      {/* Filters & Action Buttons */}
      <div className="flex flex-wrap items-center gap-space-sm">
        {/* Skin Concern Dropdown */}
        <div className="relative min-w-[170px]">
          <select
            value={concernFilter}
            onChange={(e) => onConcernChange(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-surface-alt font-body-default text-body-default text-ink border border-border/40 focus:outline-none focus:ring-2 focus:ring-role-accent-doctor/30 transition-all cursor-pointer"
          >
            <option value="all">Semua Concern</option>
            {concerns.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="relative min-w-[150px]">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-surface-alt font-body-default text-body-default text-ink border border-border/40 focus:outline-none focus:ring-2 focus:ring-role-accent-doctor/30 transition-all cursor-pointer"
          >
            <option value="all">Semua Prioritas</option>
            <option value="high">Tinggi (High)</option>
            <option value="medium">Sedang (Medium)</option>
            <option value="low">Rendah (Low)</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-alt hover:bg-surface-container-low text-ink-muted hover:text-ink font-caption text-caption font-semibold border border-border/40 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </section>
  );
}
