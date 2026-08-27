"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { SidebarBrand, SidebarCallout, SidebarNavItem, SidebarUser } from "./sidebar";
import { SidebarNavItemView, ChevronIcon } from "./sidebar-nav-item";

type SidebarContentProps = {
  brand: SidebarBrand;
  items: SidebarNavItem[];
  callout?: SidebarCallout;
  user?: SidebarUser;
  mobileFooter?: React.ReactNode;
  activeHref?: string;
  onNavigate?: () => void;
};

export function SidebarContent({
  brand,
  items,
  callout,
  user,
  mobileFooter,
  activeHref,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();
  const currentPath = activeHref ?? pathname;

  return (
    <div className="flex h-full flex-col">
      <div className={cn(
        "flex items-center border-b border-slate-100",
        onNavigate ? "justify-between px-5 py-4" : "px-7 pb-5 pt-7"
      )}>
        <Link
          href={brand.href}
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          {brand.logo}
          <div>
            <p className="text-base font-bold text-slate-950">{brand.title}</p>
            {brand.subtitle ? (
              <p className="text-xs font-semibold text-emerald-600">
                {brand.subtitle}
              </p>
            ) : null}
          </div>
        </Link>

        {onNavigate ? (
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={onNavigate}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-600"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
      </div>

      <nav className={cn(
        "flex-1 space-y-1",
        onNavigate ? "px-3 py-4" : "px-7 py-3 space-y-2"
      )}>
        {items.map((item) => (
          <SidebarNavItemView
            key={item.href}
            item={item}
            currentPath={currentPath}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {callout ? (
        <div className="px-7 py-4">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-950">
              {callout.title}
            </p>
            <p className="mt-2 text-xs leading-5 text-emerald-800">
              {callout.description}
            </p>
          </div>
        </div>
      ) : null}

      {user ? (
        <div className="px-7 pb-7 pt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="relative shrink-0">
              {user.avatar ?? (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-bold text-emerald-700">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              {user.status ? (
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                    user.status === "online" ? "bg-emerald-500" : "bg-slate-300"
                  )}
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500">{user.role}</p>
            </div>
            <ChevronIcon />
          </div>
        </div>
      ) : null}

      {mobileFooter ? (
        <div className="border-t border-slate-100 p-3 lg:hidden">
          {mobileFooter}
        </div>
      ) : null}
    </div>
  );
}
