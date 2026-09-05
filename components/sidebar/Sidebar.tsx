"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getBreadcrumbs } from "@/components/breadcrumb-utils";
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

/** localStorage key — preferensi collapse sidebar desktop (default: expand). */
const SIDEBAR_COLLAPSE_KEY = "skincek_sidebar_collapsed";

type SidebarProps = {
  brand: SidebarBrand;
  items: SidebarNavItem[];
  callout?: SidebarCallout;
  user?: SidebarUser;
  mobileFooter?: React.ReactNode;
  /** Aksi topbar mobile (bell, avatar) — diposkan di kanan topbar (§3.2). */
  topbarActions?: React.ReactNode;
  className?: string;
  activeHref?: string;
};

export function Sidebar({
  brand,
  items,
  callout,
  user,
  mobileFooter,
  topbarActions,
  className,
  activeHref,
}: SidebarProps) {
  // Mobile drawer open state.
  const [open, setOpen] = React.useState(false);
  // Desktop collapsed state — default EXPANDED ("on"), persist di localStorage.
  const [collapsed, setCollapsed] = React.useState(false);
  const [isCollapsedHydrated, setIsCollapsedHydrated] = React.useState(false);
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  // Hydrate preferensi collapse dari localStorage — defer via timeout agar
  // setState tidak sinkron dalam effect (hindari cascading render).
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1");
      setIsCollapsedHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => {
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, prev ? "0" : "1");
      return !prev;
    });
  }, []);

  // Hindari flash sebelum hydration selesai — sembunyikan transisi awal.
  const desktopClass = !isCollapsedHydrated
    ? "hidden lg:block w-72"
    : cn(
        "hidden lg:block transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[92px]" : "w-72",
      );

  return (
    <>
      {/* Desktop sidebar — collapse ke mode icon-only (default: expand) */}
      <aside
        className={cn(
          "h-screen shrink-0 border-r border-slate-100 bg-white shadow-[12px_0_30px_rgba(15,23,42,0.04)] lg:sticky lg:top-0",
          desktopClass,
          className
        )}
      >
        <SidebarContent
          brand={brand}
          items={items}
          callout={callout}
          user={user}
          activeHref={activeHref}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
        />
      </aside>

      {/* Mobile top bar — [hamburger] [brand] …spacer… [bell] [avatar] (§3.2) */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
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

          <Link
            href={brand.href}
            className="flex shrink-0 items-center"
            onClick={() => setOpen(false)}
          >
            {brand.logo}
          </Link>

          <Breadcrumb items={breadcrumbs} className="min-w-0 flex-1" />
        </div>

        {topbarActions ? (
          <div className="flex shrink-0 items-center gap-1.5">
            {topbarActions}
          </div>
        ) : null}
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
