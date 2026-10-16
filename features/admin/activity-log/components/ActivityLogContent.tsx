"use client";

import type { ActivityLogContentProps } from "../lib/activityLogTypes";
import { ActivityLogHeader } from "./ActivityLogHeader";
import { ActivityLogFilterBar } from "./ActivityLogFilterBar";
import { ActivityLogTable } from "./ActivityLogTable";
import { ActivityLogComplianceBanner } from "./ActivityLogComplianceBanner";

export function ActivityLogContent({
  logs,
  stats,
  filters,
  pagination,
  onSearchChange,
  onLogNameChange,
  onCauserChange,
  onResetFilters,
  onPageChange,
  isLoading,
}: ActivityLogContentProps) {
  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Header & Live Telemetry KPI Cards */}
      <ActivityLogHeader stats={stats} totalLogs={pagination.total} />

      {/* 2. Filter Bar */}
      <ActivityLogFilterBar
        filters={filters}
        onSearchChange={onSearchChange}
        onLogNameChange={onLogNameChange}
        onCauserChange={onCauserChange}
        onResetFilters={onResetFilters}
      />

      {/* 3. Main Audit Trail Table */}
      <ActivityLogTable
        logs={logs}
        pagination={pagination}
        onPageChange={onPageChange}
        onResetFilters={onResetFilters}
        isLoading={isLoading}
      />

      {/* 4. SATUSEHAT Compliance Banner */}
      <ActivityLogComplianceBanner />
    </div>
  );
}
