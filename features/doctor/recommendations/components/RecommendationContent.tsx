"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ROUTES } from "@/lib/constants";

import type { RecommendationsPageData } from "../lib/recommendationsTypes";
import { RecommendationSummaryCards } from "./RecommendationSummaryCards";
import { RecommendationFilterBar } from "./RecommendationFilterBar";
import { RecommendationTable } from "./RecommendationTable";

type RecommendationContentProps = RecommendationsPageData;

export function RecommendationContent({
  recommendations,
  summary,
  pagination,
}: RecommendationContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [concernFilter, setConcernFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const concerns = useMemo(() => {
    const set = new Set<string>();
    recommendations.forEach((r) => {
      if (r.concern && r.concern !== "-") set.add(r.concern);
    });
    return Array.from(set);
  }, [recommendations]);

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((r) => {
      if (
        concernFilter !== "all" &&
        r.concern.toLowerCase() !== concernFilter.toLowerCase()
      ) {
        return false;
      }
      if (priorityFilter !== "all") {
        if (!r.severity.toLowerCase().includes(priorityFilter.toLowerCase())) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesConcern = r.concern.toLowerCase().includes(q);
        const matchesProduct = r.productName.toLowerCase().includes(q);
        const matchesStep = r.routineStep.toLowerCase().includes(q);
        const matchesNote = r.doctorNote.toLowerCase().includes(q);
        return matchesConcern || matchesProduct || matchesStep || matchesNote;
      }
      return true;
    });
  }, [recommendations, concernFilter, priorityFilter, searchQuery]);

  return (
    <div className="w-full space-y-space-lg">
      {/* 1. Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md bg-surface p-space-lg rounded-xl shadow-xs border border-border/50">
        <div className="flex flex-col max-w-2xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-eyebrow text-eyebrow text-role-accent-doctor uppercase tracking-widest font-semibold">
              Protokol Inferensi Rekomendasi
            </span>
          </div>
          <h1 className="font-display text-display text-ink font-bold tracking-tight mb-1">
            Daftar Aturan Rekomendasi
          </h1>
          <p className="font-body-default text-body-default text-ink-muted">
            Kelola aturan inferensi yang memetakan hasil deteksi AI kulit pasien ke saran produk skincare dan edukasi klinis berdasarkan guideline dermatologi terkini.
          </p>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <Link
            href={ROUTES.DOCTOR.RECOMMENDATIONS_CREATE}
            className="inline-flex items-center gap-2 h-11 px-space-lg rounded-xl bg-role-accent-doctor text-on-primary font-headline-sm text-headline-sm hover:opacity-95 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Aturan Baru</span>
          </Link>
        </div>
      </section>

      {/* 2. Stat Cards Grid */}
      <RecommendationSummaryCards summary={summary} />

      {/* 3. Toolbar & Filter Section */}
      <RecommendationFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        concernFilter={concernFilter}
        onConcernChange={setConcernFilter}
        concerns={concerns}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        onReset={() => {
          setSearchQuery("");
          setConcernFilter("all");
          setPriorityFilter("all");
        }}
      />

      {/* 4. Clinical Recommendations Data Table */}
      <RecommendationTable
        recommendations={filteredRecommendations}
        pagination={pagination}
      />
    </div>
  );
}
