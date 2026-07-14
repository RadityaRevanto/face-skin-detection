import type { ReactNode } from "react";

import { AdminProfileMenu } from "@/components/admin/admin-profile-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  actions?: ReactNode;
  avatar?: ReactNode;
  className?: string;
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

export function DashboardHeader({
  title,
  description,
  searchPlaceholder = "Search...",
  actions,
  avatar,
  className,
}: DashboardHeaderProps) {
  return (
    <header
      aria-label={description ? `${title}. ${description}` : title}
      className={cn(
        "flex h-14 w-full items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:h-16 sm:gap-6 sm:px-6",
        className
      )}
    >
      {/* Mobile: page title */}
      <div className="flex min-w-0 flex-1 items-center md:hidden">
        <h1 className="truncate text-base font-bold text-slate-800">{title}</h1>
      </div>

      {/* Desktop: search bar */}
      <div className="hidden min-w-0 flex-1 items-center md:flex">
        <div className="relative w-full max-w-105">
          <SearchIcon />
          <Input
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-xl border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm dark:border-slate-200 dark:bg-white"
          />
        </div>
      </div>

      {/* Desktop: actions + profile */}
      <div className="hidden items-center gap-2 md:flex sm:gap-4">
        {actions}
        {avatar ?? <AdminProfileMenu />}
      </div>
    </header>
  );
}
