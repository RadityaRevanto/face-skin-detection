import type { ReactNode } from "react";

import { AdminProfileMenu } from "@/components/admin/admin-profile-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  searchShortcut?: string;
  actions?: ReactNode;
  avatar?: ReactNode;
  className?: string;
};

function Icon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-4 w-4", className)}
    >
      {children}
    </svg>
  );
}

function SearchIcon() {
  return (
    <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
      <path
        d="m21 21-4.3-4.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </Icon>
  );
}

function BellIcon() {
  return (
    <Icon className="h-5 w-5 text-slate-700">
      <path
        d="M18 9a6 6 0 0 0-12 0c0 7-2 7-2 7h16s-2 0-2-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M10 19a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </Icon>
  );
}

function IconButton({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={label}
      className={cn(
        "relative h-10 w-10 rounded-full p-0 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-100",
        className
      )}
    >
      {children}
    </Button>
  );
}

export function DashboardHeader({
  title,
  description,
  searchPlaceholder = "Search...",
  searchShortcut = "⌘ K",
  actions,
  avatar,
  className,
}: DashboardHeaderProps) {
  return (
    <header
      aria-label={description ? `${title}. ${description}` : title}
      className={cn(
        "flex h-16 w-full items-center justify-between gap-6 border-b border-slate-200 bg-white px-6",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center">
        <div className="relative w-full max-w-[420px]">
          <SearchIcon />
          <Input
            placeholder={searchPlaceholder}
            className="h-10 rounded-xl border-slate-200 bg-white pl-10 pr-16 text-sm shadow-sm dark:border-slate-200 dark:bg-white"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {actions ?? (
          <IconButton label="Notifications">
            <BellIcon />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </IconButton>
        )}

        {avatar ?? <AdminProfileMenu />}
      </div>
    </header>
  );
}
