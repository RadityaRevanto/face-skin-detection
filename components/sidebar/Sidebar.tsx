"use client";

import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import { SidebarContent } from "./SidebarContent";

export type SidebarNavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: SidebarNavItem[];
  defaultOpen?: boolean;
};

export type SidebarBrand = {
  href: string;
  logo: React.ReactNode;
  title: string;
  subtitle?: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
};

export type SidebarCallout = {
  title: string;
  description: string;
};

export type SidebarUser = {
  name: string;
  role: string;
  avatar?: React.ReactNode;
  status?: "online" | "offline";
};

type SidebarProps = {
  brand: SidebarBrand;
  items: SidebarNavItem[];
  callout?: SidebarCallout;
  user?: SidebarUser;
  mobileFooter?: React.ReactNode;
  className?: string;
  activeHref?: string;
};

export function Sidebar({
  brand,
  items,
  callout,
  user,
  mobileFooter,
  className,
  activeHref,
}: SidebarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden h-screen w-72 shrink-0 border-r border-slate-100 bg-white shadow-[12px_0_30px_rgba(15,23,42,0.04)] lg:sticky lg:top-0 lg:block",
          className
        )}
      >
        <SidebarContent
          brand={brand}
          items={items}
          callout={callout}
          user={user}
          activeHref={activeHref}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 lg:hidden">
        <Link
          href={brand.href}
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          {brand.logo}
          <div>
            <p className="text-sm font-bold text-slate-950">
              {brand.mobileTitle ?? brand.title}
            </p>
            {brand.mobileSubtitle ?? brand.subtitle ? (
              <p className="text-xs text-zinc-500">
                {brand.mobileSubtitle ?? brand.subtitle}
              </p>
            ) : null}
          </div>
        </Link>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          {open ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile backdrop */}
      {open ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* Mobile drawer — slides in from the right */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <SidebarContent
          brand={brand}
          items={items}
          callout={callout}
          user={user}
          mobileFooter={mobileFooter}
          activeHref={activeHref}
          onNavigate={() => setOpen(false)}
        />
      </div>
    </>
  );
}
