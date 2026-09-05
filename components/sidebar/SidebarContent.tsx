"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { SidebarBrand, SidebarCallout, SidebarNavItem, SidebarUser } from "./Sidebar";
import { SidebarNavItemView, ChevronIcon } from "./SidebarNavItem";

type SidebarContentProps = {
  brand: SidebarBrand;
  items: SidebarNavItem[];
  callout?: SidebarCallout;
  user?: SidebarUser;
  mobileFooter?: React.ReactNode;
  activeHref?: string;
  onNavigate?: () => void;
  /** Desktop collapse mode — icon-only, tanpa label/callout. */
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function SidebarContent({
  brand,
  items,
  callout,
  user,
  mobileFooter,
  activeHref,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: SidebarContentProps) {
  const pathname = usePathname();
  const currentPath = activeHref ?? pathname;
  const isMobileDrawer = Boolean(onNavigate);

  return (
    <div className="flex h-full flex-col">
      {/* Brand header + tombol collapse — selalu SATU BARIS horizontal agar
          toggle tidak "jatuh" saat collapse (animasi width tetap smooth).
          Mobile drawer: brand kiri, tombol tutup kanan (tidak berubah). */}
      <div className={cn(
        "flex items-center justify-between border-b border-slate-100",
        isMobileDrawer && "px-5 py-4",
        !isMobileDrawer && collapsed && "px-3 pb-5 pt-6",
        !isMobileDrawer && !collapsed && "px-5 pb-5 pt-6"
      )}>
        <Link
          href={brand.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center",
            collapsed && !isMobileDrawer ? "shrink-0" : "gap-3"
          )}
          title={collapsed && !isMobileDrawer ? `${brand.title} — ${brand.subtitle ?? ""}`.trim() : undefined}
        >
          {brand.logo}
          {!collapsed || isMobileDrawer ? (
            <div>
              <p className="text-base font-bold text-slate-950">{brand.title}</p>
              {brand.subtitle ? (
                <p className="text-xs font-semibold text-emerald-600">
                  {brand.subtitle}
                </p>
              ) : null}
            </div>
          ) : null}
        </Link>

        {isMobileDrawer ? (
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

        {/* Toggle collapse — icon only, tetap di kanan sejajar brand
            (posisi tidak berpindah baris saat collapse) */}
        {!isMobileDrawer && onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
            className={cn(
              "shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-600",
              collapsed ? "flex h-8 w-8" : "flex h-9 w-9"
            )}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className={cn(
                "shrink-0 transition-transform duration-300",
                collapsed ? "h-4 w-4" : "h-5 w-5",
                collapsed && "rotate-180"
              )}
            >
              <rect x="3" y="4" width="14" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M17 9h2.5A1.5 1.5 0 0 1 21 10.5v3A1.5 1.5 0 0 1 19.5 15H17" stroke="currentColor" strokeWidth="1.6" />
              <path d="M10 9.5 8 12l2 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}
      </div>

      <nav className={cn(
        "flex-1 space-y-1 overflow-y-auto overflow-x-hidden",
        isMobileDrawer ? "px-3 py-4" : "px-3 py-3"
      )}>
        {items.map((item) => (
          <SidebarNavItemView
            key={item.href}
            item={item}
            currentPath={currentPath}
            onNavigate={onNavigate}
            collapsed={collapsed && !isMobileDrawer}
          />
        ))}
      </nav>

      {callout && (!collapsed || isMobileDrawer) ? (
        <div className="px-5 py-4">
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
        <div className={cn(
          "pb-6 pt-2",
          collapsed && !isMobileDrawer ? "px-3" : "px-5 pb-7 pt-4"
        )}>
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm",
              collapsed && !isMobileDrawer && "justify-center p-2"
            )}
            title={collapsed && !isMobileDrawer ? `${user.name} — ${user.role}` : undefined}
          >
            <div className={cn("relative shrink-0", collapsed && !isMobileDrawer && "")}>
              {user.avatar ?? (
                <div
                  className={cn(
                    "flex items-center justify-center rounded-2xl bg-emerald-50 text-sm font-bold text-emerald-700",
                    collapsed && !isMobileDrawer ? "h-9 w-9" : "h-11 w-11"
                  )}
                >
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
            {(!collapsed || isMobileDrawer) ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">
                  {user.name}
                </p>
                <p className="truncate text-xs text-slate-500">{user.role}</p>
              </div>
            ) : null}
            {(!collapsed || isMobileDrawer) ? <ChevronIcon /> : null}
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
