"use client";

import { Search } from "lucide-react";
import type {
  DoctorVerificationPageType,
  DoctorVerificationStats,
} from "../lib/doctorVerificationTypes";

type VerificationTabFilterBarProps = {
  activeTab: DoctorVerificationPageType;
  onTabChange: (tab: DoctorVerificationPageType) => void;
  stats: DoctorVerificationStats;
  search: string;
  onSearchChange: (value: string) => void;
};

export function VerificationTabFilterBar({
  activeTab,
  onTabChange,
  stats,
  search,
  onSearchChange,
}: VerificationTabFilterBarProps) {
  const tabs = [
    {
      key: "pending" as const,
      label: "Menunggu Review",
      count: stats.pendingCount,
      badgeStyle: "bg-warning/10 text-warning",
    },
    {
      key: "needs_revision" as const,
      label: "Perlu Revisi",
      count: stats.needsRevisionCount,
      badgeStyle: "bg-info/10 text-info",
    },
    {
      key: "rejected" as const,
      label: "Ditolak",
      count: stats.rejectedCount,
      badgeStyle: "bg-danger/10 text-danger",
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border gap-4">
        {/* Underline Tabs matching index7.html */}
        <div className="flex items-center gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-2.5 pb-3 font-headline-sm text-headline-sm transition-colors border-b-2 whitespace-nowrap ${
                  isActive
                    ? "text-role-accent-admin border-role-accent-admin font-semibold"
                    : "text-ink-muted hover:text-ink border-transparent font-medium"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-caption text-caption font-semibold leading-none ${tab.badgeStyle}`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="flex items-center gap-2.5 pb-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-ink-subtle absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama atau nomor STR..."
              className="h-10 pl-9 pr-3 rounded-xl bg-surface text-ink text-body-default font-body-default placeholder:text-ink-subtle outline-none focus:ring-2 focus:ring-role-accent-admin/30 border border-border/60 transition-all shadow-sm w-60 lg:w-72"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
