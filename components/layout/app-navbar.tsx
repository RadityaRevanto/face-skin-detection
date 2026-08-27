"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { NotificationBell } from "@/components/shared/notification-bell";
import { logoutAction } from "@/lib/auth/actions";

import { MenuIcon } from "./navbar-icons";
import { NavbarLogo } from "./navbar-logo";
import { NavbarProfile } from "./navbar-profile";
import { NavbarMobileDrawer } from "./navbar-mobile-drawer";

// ─── Types ──────────────────────────────────────────────────────────────────

export type NavbarItem = {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
  accent?: "amber";
};

export type NavbarProps = {
  brand: {
    href: string;
    logo: ReactNode;
    title: string;
    subtitle?: string;
  };
  items: NavbarItem[];
  displayName: string;
  avatarUrl?: string | null;
  userId?: number | string | null;
  userUuid?: string | null;
  /** Extra content rendered after nav items (before notification bell) */
  extra?: ReactNode;
};

// ─── Component ──────────────────────────────────────────────────────────────

export function AppNavbar({
  brand,
  items,
  displayName,
  avatarUrl,
  userId,
  userUuid,
  extra,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logoutAction();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <MenuIcon />
          </button>

          <NavbarLogo brand={brand} />
        </div>

        {/* Center: Desktop nav items */}
        <div className="hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isAmber = item.accent === "amber";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isAmber
                    ? isActive
                      ? "bg-amber-50 text-amber-700"
                      : "text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                    : isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="h-4 w-4">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
                {isActive ? (
                  <span
                    className={`absolute -bottom-[17px] left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full ${
                      isAmber ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  />
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Right: Extra + Notifications + Profile */}
        <div className="flex items-center gap-2">
          {extra}

          <NotificationBell userId={userId} userUuid={userUuid} />

          <NavbarProfile
            displayName={displayName}
            avatarUrl={avatarUrl}
            isProfileOpen={isProfileOpen}
            isLoggingOut={isLoggingOut}
            onToggle={() => setIsProfileOpen((v) => !v)}
            onClose={() => setIsProfileOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      </nav>

      <NavbarMobileDrawer
        brand={brand}
        items={items}
        displayName={displayName}
        avatarUrl={avatarUrl}
        isMobileOpen={isMobileOpen}
        isLoggingOut={isLoggingOut}
        onClose={() => setIsMobileOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}
