import type { ReactNode } from "react";

import { DoctorProfileMenu } from "@/src/features/doctor/components/DoctorProfileMenu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { NotificationBell } from "@/src/features/notification/components/NotificationBell";

type DoctorHeaderProps = {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  actions?: ReactNode;
  avatar?: ReactNode;
  className?: string;
  initialDisplayName?: string;
  userId?: number | string | null;
  userUuid?: string | null;
};

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
    >
      <path d="m21 21-4.3-4.3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function DoctorHeader({
  title,
  description,
  searchPlaceholder = "Search...",
  actions,
  avatar,
  className,
  initialDisplayName,
  userId,
  userUuid,
}: DoctorHeaderProps) {
  return (
    <header
      aria-label={description ? `${title}. ${description}` : title}
      className={cn(
        "flex h-14 w-full items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:h-16 sm:gap-6 sm:px-6",
        className
      )}
    >
      {/* Page title (Mobile & Desktop) */}
      <div className="flex min-w-0 flex-1 items-center">
        <h1 className="truncate text-base font-bold text-slate-800 sm:text-lg">{title}</h1>
      </div>

      {/* Desktop: actions + profile */}
      <div className="hidden items-center gap-2 md:flex sm:gap-4">
        {actions}
        <NotificationBell userId={userId} userUuid={userUuid} />
        {avatar ?? <DoctorProfileMenu initialDisplayName={initialDisplayName} />}
      </div>
    </header>
  );
}
