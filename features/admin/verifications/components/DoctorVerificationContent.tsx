"use client";

import type { DoctorVerificationPageData } from "../lib/doctorVerificationTypes";
import { VerificationHeaderStrip } from "./VerificationHeaderStrip";
import { VerificationTabFilterBar } from "./VerificationTabFilterBar";
import { DoctorVerificationTable } from "./DoctorVerificationTable";
import { VerificationProtocolBanner } from "./VerificationProtocolBanner";

export function DoctorVerificationContent({
  activeTab,
  verificationRequests,
  stats,
  pagination,
  onPageChange,
  search,
  onSearchChange,
  onTabChange,
  isLoading,
}: DoctorVerificationPageData) {
  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Header with Live Telemetry Mini Metrics */}
      <VerificationHeaderStrip stats={stats} />

      {/* 2. Underline Tab & Filter Bar */}
      <VerificationTabFilterBar
        activeTab={activeTab}
        onTabChange={onTabChange}
        stats={stats}
        search={search}
        onSearchChange={onSearchChange}
      />

      {/* 3. Primary Data Table */}
      <DoctorVerificationTable
        activeTab={activeTab}
        verificationRequests={verificationRequests}
        pagination={pagination}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />

      {/* 4. Comparative Protocol Banner */}
      <VerificationProtocolBanner />
    </div>
  );
}
