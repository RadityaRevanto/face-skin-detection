"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { SidebarNavItem } from "./Sidebar";

export function SidebarLink({
  item,
  currentPath,
  onNavigate,
  isChild = false,
  collapsed = false,
}: {
  item: SidebarNavItem;
  currentPath: string;
  onNavigate?: () => void;
  isChild?: boolean;
  /** Mode collapse desktop — icon-only (label via title tooltip). */
  collapsed?: boolean;
}) {
  const isActive = currentPath === item.href;
  // Saat collapsed, item GRUP diarahkan ke anak yang aktif (atau anak pertama)
  // supaya klik tetap bermakna — bukan membuka expand.
  const effectiveHref = collapsed && item.children?.length
    ? (item.children.find((c) => c.href === currentPath)?.href ?? item.children[0]?.href ?? item.href)
    : item.href;
  const showIcon = !isChild && item.icon;

  return (
    <Link
      href={effectiveHref}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group flex items-center text-sm font-medium transition-colors",
        collapsed && !isChild ? "relative justify-center mx-1 rounded-xl px-0 py-3" : "gap-3 rounded-xl px-3 py-2",
        !collapsed && !isChild && "py-3",
        isChild ? "rounded-xl px-3 py-2 pl-12" : "",
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-emerald-700"
      )}
    >
      {showIcon ? (
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center",
            isActive ? "text-emerald-600" : "text-slate-500"
          )}
        >
          {item.icon}
        </span>
      ) : null}
      {/* Label disembunyikan saat collapse desktop — icon saja. */}
      {!collapsed || isChild ? (
        <span className="min-w-0 flex-1">{item.label}</span>
      ) : null}
      {/* Mode collapse: indikator aktif berupa strip emerald di tepi kiri. */}
      {collapsed && !isChild && isActive ? (
        <span
          aria-hidden="true"
          className="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-500"
        />
      ) : null}
      {item.badge && (!collapsed || isChild) ? (
        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold leading-4 text-white">
          {item.badge}
        </span>
      ) : null}
      {/* Badge collapse: dot kecil di pojok icon saat ada notifikasi. */}
      {collapsed && !isChild && item.badge ? (
        <span
          aria-hidden="true"
          className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"
        />
      ) : null}
    </Link>
  );
}
