import Link from "next/link";

import { cn } from "@/lib/utils";
import type { DoctorVerificationPageType } from "@/features/admin/verifications/lib/doctorVerificationTypes";

type DoctorVerificationTabsProps = {
  pageType: DoctorVerificationPageType;
  pendingCount: number;
  rejectedCount: number;
};

/**
 * Tabs verifikasi (§5.6): segmented control full-width di mobile
 * (2 tombol flex-1, h-11), flex-wrap di desktop.
 */

export function DoctorVerificationTabs({
  pageType,
  pendingCount,
  rejectedCount,
}: DoctorVerificationTabsProps) {
  const tabs = [
    {
      key: "pending" as const,
      href: "/admin/doctor-verifications/pending",
      label: "Pending Review",
      count: pendingCount,
      activeStyle: "bg-emerald-600 text-white shadow-lg shadow-emerald-200",
      inactiveHover:
        "bg-white text-slate-600 ring-1 ring-slate-100 hover:bg-emerald-50 hover:text-emerald-700",
      chipActive: "bg-white/20 text-white",
      chipInactive: "bg-emerald-50 text-emerald-700",
    },
    {
      key: "rejected" as const,
      href: "/admin/doctor-verifications/rejected",
      label: "Rejected",
      count: rejectedCount,
      activeStyle: "bg-rose-600 text-white shadow-lg shadow-rose-200",
      inactiveHover:
        "bg-white text-slate-600 ring-1 ring-slate-100 hover:bg-rose-50 hover:text-rose-700",
      chipActive: "bg-white/20 text-white",
      chipInactive: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter status verifikasi"
      className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3"
    >
      {tabs.map((tab) => {
        const isActive = pageType === tab.key;

        return (
          <Link
            key={tab.key}
            href={tab.href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors sm:flex-none",
              isActive ? tab.activeStyle : tab.inactiveHover,
            )}
          >
            <span className="truncate">{tab.label}</span>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                isActive ? tab.chipActive : tab.chipInactive,
              )}
            >
              {tab.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
