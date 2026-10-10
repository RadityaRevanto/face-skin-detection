"use client";

import { useMemo, useState } from "react";

import type { SkinConcernsPageData } from "../lib/skinConcernsTypes";
import { SkinConcernsHeader } from "./SkinConcernsHeader";
import { SkinConcernsMetrics } from "./SkinConcernsMetrics";
import { SkinConcernsFilterBar } from "./SkinConcernsFilterBar";
import { SkinConcernsTable } from "./SkinConcernsTable";

type SkinConcernsContentProps = SkinConcernsPageData;

export function SkinConcernsContent({
  concerns,
  pagination,
}: SkinConcernsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const activeCount = useMemo(() => {
    return concerns.filter((c) => c.is_active !== false).length;
  }, [concerns]);

  const filteredConcerns = useMemo(() => {
    return concerns.filter((concern) => {
      // Filter status
      if (statusFilter === "active" && concern.is_active === false) return false;
      if (statusFilter === "inactive" && concern.is_active !== false) return false;

      // Filter query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = concern.name?.toLowerCase().includes(query);
        const labelMatch = concern.ml_label?.toLowerCase().includes(query);
        const descMatch = concern.description?.toLowerCase().includes(query);
        return nameMatch || labelMatch || descMatch;
      }

      return true;
    });
  }, [concerns, searchQuery, statusFilter]);

  function handleReset() {
    setSearchQuery("");
    setStatusFilter("all");
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Banner / Header Context */}
      <SkinConcernsHeader totalCount={pagination.totalItems || concerns.length} />

      {/* Metric Overview Bento */}
      <SkinConcernsMetrics
        totalCount={pagination.totalItems || concerns.length}
        activeCount={activeCount}
      />

      {/* Filter & Search Toolbar */}
      <SkinConcernsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleReset}
      />

      {/* Data Table Container */}
      <SkinConcernsTable
        concerns={filteredConcerns}
        pagination={pagination}
      />
    </div>
  );
}
