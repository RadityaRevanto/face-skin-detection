"use client";

import * as Collapsible from "@radix-ui/react-collapsible";

import { cn } from "@/lib/utils";
import type { SidebarNavItem } from "./sidebar";
import { SidebarLink } from "./sidebar-link";

export function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={cn(
        "h-4 w-4 transition-transform",
        className
      )}
    >
      <path
        d="M6 8l4 4 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function isActiveItem(item: SidebarNavItem, currentPath: string) {
  return (
    currentPath === item.href ||
    Boolean(item.children?.some((child) => currentPath === child.href))
  );
}

export function SidebarNavItemView({
  item,
  currentPath,
  onNavigate,
}: {
  item: SidebarNavItem;
  currentPath: string;
  onNavigate?: () => void;
}) {
  const hasChildren = Boolean(item.children?.length);
  const isActive = isActiveItem(item, currentPath);

  if (!hasChildren) {
    return (
      <SidebarLink
        item={item}
        currentPath={currentPath}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <Collapsible.Root defaultOpen={item.defaultOpen || isActive}>
      <Collapsible.Trigger
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors",
          isActive
            ? "bg-emerald-50 text-emerald-700"
            : "text-slate-500 hover:bg-slate-50 hover:text-emerald-700"
        )}
      >
        {item.icon ? (
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
        <ChevronIcon className="group-data-[state=open]:rotate-180" />
      </Collapsible.Trigger>
      <Collapsible.Content className="mt-1 space-y-1">
        {item.children?.map((child) => (
          <SidebarLink
            key={child.href}
            item={child}
            currentPath={currentPath}
            onNavigate={onNavigate}
            isChild
          />
        ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
