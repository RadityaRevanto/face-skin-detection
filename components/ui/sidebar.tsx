"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";

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

function ChevronIcon({ className }: { className?: string }) {
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

function SidebarLink({
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

function SidebarNavItemView({
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

function SidebarContent({
  brand,
  items,
  callout,
  user,
  mobileFooter,
  activeHref,
  onNavigate,
}: SidebarProps & { onNavigate?: () => void }) {
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
