"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { Avatar } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/shared/notification-bell";
import { logoutAction } from "@/lib/auth/actions";

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

// ─── Icons ──────────────────────────────────────────────────────────────────

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

// ─── Logo ───────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <svg aria-hidden="true" className="h-9 w-9" viewBox="0 0 48 48" fill="none">
      <path
        d="M30.5 4.5C19 8.8 11 17.2 11 27.4c0 8.3 5.5 14.2 13.3 15.7C22.7 31 25.9 20 34.8 11.8c-4.2 8-5.3 16.6-2.8 25.4C39 33.3 43 26.6 43 18.8c0-5.5-2.1-10.4-5.4-14.3-2.2-.6-4.5-.6-7.1 0Z"
        fill="#10B981"
      />
      <path
        d="M23.8 42.9C14.6 39.7 5 32.2 5 21.6c0-5.1 2-9.5 5.1-12.9C18 14.4 22.8 23.1 23.8 42.9Z"
        fill="#047857"
      />
      <path d="M12 31.5c6.6-8.1 13.5-14.4 24-20.4" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

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
            {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link href={brand.href} className="flex shrink-0 items-center gap-2.5">
            {brand.logo || <LogoMark />}
            <div className="hidden sm:block">
              <p className="text-base font-bold tracking-tight text-slate-900">{brand.title}</p>
              {brand.subtitle ? (
                <p className="text-xs font-semibold text-emerald-600">{brand.subtitle}</p>
              ) : null}
            </div>
          </Link>
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

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-100"
            >
              <Avatar src={avatarUrl} name={displayName} size="sm" />
              <span className="hidden text-sm font-medium text-slate-700 md:block">
                {displayName}
              </span>
              <span className={`hidden text-slate-400 transition-transform md:block ${isProfileOpen ? "rotate-180" : ""}`}>
                <ChevronDownIcon />
              </span>
            </button>

            {isProfileOpen ? (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-2.5">
                    <p className="text-sm font-bold text-slate-900">{displayName}</p>
                  </div>
                  <Link
                    href={
                      pathname.startsWith("/doctor")
                        ? "/doctor/profile"
                        : pathname.startsWith("/admin")
                          ? "/admin/profile"
                          : "/user/profile"
                    }
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <ProfileIcon />
                    Profile
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
                  >
                    <LogoutIcon />
                    {isLoggingOut ? "Keluar..." : "Logout"}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isMobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileOpen(false)} />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <Link href={brand.href} className="flex items-center gap-2.5" onClick={() => setIsMobileOpen(false)}>
            {brand.logo || <LogoMark />}
            <div>
              <p className="text-base font-bold text-slate-900">{brand.title}</p>
              {brand.subtitle ? (
                <p className="text-xs font-semibold text-emerald-600">{brand.subtitle}</p>
              ) : null}
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isAmber = item.accent === "amber";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isAmber
                    ? isActive
                      ? "bg-amber-50 text-amber-700"
                      : "text-amber-600 hover:bg-amber-50"
                    : isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="h-5 w-5">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <Avatar src={avatarUrl} name={displayName} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
            </div>
          </div>
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
          >
            <LogoutIcon />
            {isLoggingOut ? "Keluar..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}

export { LogoMark };
