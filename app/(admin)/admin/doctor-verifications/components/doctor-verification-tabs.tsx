import Link from "next/link";

import type { DoctorVerificationPageType } from "../lib/doctor-verification-types";

type DoctorVerificationTabsProps = {
  pageType: DoctorVerificationPageType;
  pendingCount: number;
  rejectedCount: number;
};

export function DoctorVerificationTabs({
  pageType,
  pendingCount,
  rejectedCount,
}: DoctorVerificationTabsProps) {
  return (
    <div className='flex flex-wrap gap-3'>
      <Link
        href='/admin/doctor-verifications/pending'
        className={[
          "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-bold transition-colors",
          pageType === "pending"
            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
            : "bg-white text-slate-600 ring-1 ring-slate-100 hover:bg-emerald-50 hover:text-emerald-700",
        ].join(" ")}
      >
        Pending Review
        <span
          className={[
            "ml-2 rounded-full px-2 py-0.5 text-xs",
            pageType === "pending"
              ? "bg-white/20 text-white"
              : "bg-emerald-50 text-emerald-700",
          ].join(" ")}
        >
          {pendingCount}
        </span>
      </Link>

      <Link
        href='/admin/doctor-verifications/rejected'
        className={[
          "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-bold transition-colors",
          pageType === "rejected"
            ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
            : "bg-white text-slate-600 ring-1 ring-slate-100 hover:bg-rose-50 hover:text-rose-700",
        ].join(" ")}
      >
        Rejected
        <span
          className={[
            "ml-2 rounded-full px-2 py-0.5 text-xs",
            pageType === "rejected"
              ? "bg-white/20 text-white"
              : "bg-rose-50 text-rose-700",
          ].join(" ")}
        >
          {rejectedCount}
        </span>
      </Link>
    </div>
  );
}
