"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { SidebarNavItem } from "./sidebar";

export function SidebarLink({
  item,
  currentPath,
  onNavigate,
  isChild = false,
}: {
  item: SidebarNavItem;
  currentPath: string;
  onNavigate?: () => void;
  isChild?: boolean;
}) {
  const isActive = currentPath === item.href;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-xl text-sm font-medium transition-colors",
        isChild ? "px-3 py-2 pl-12" : "px-3 py-3",
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-emerald-700"
      )}
    >
      {!isChild && item.icon ? (
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center",
            isActive ? "text-emerald-600" : "text-slate-500"
          )}
        >
          {item.icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">{item.label}</span>
      {item.badge ? (
        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold leading-4 text-white">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
