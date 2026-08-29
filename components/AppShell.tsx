"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { NotificationBell } from "@/src/features/notification/components/NotificationBell";
import { logoutAction } from "@/lib/auth/actions";
import { getUserNavItems } from "./sidebar/UserNavItems";
import { getAdminNavItems } from "./sidebar/AdminNavItems";
import { getDoctorNavItems } from "./sidebar/DoctorNavItems";
import { ProfileDropdown } from "./navbar/ProfileDropdown";

export type DashboardRole = "user" | "admin" | "doctor";

export type DashboardLayoutProps = {
  role: DashboardRole;
  children: ReactNode;
  profile?: {
    full_name: string;
    avatar_url?: string | null;
    google_avatar_url?: string | null;
    uuid?: string;
    id?: number | string;
  };
  headerExtra?: Record<string, unknown>;
};

function LeafLogo() {
  return (
    <svg aria-hidden="true" className="h-9 w-9" viewBox="0 0 48 48" fill="none">
      <path d="M30.5 4.5C19 8.8 11 17.2 11 27.4c0 8.3 5.5 14.2 13.3 15.7C22.7 31 25.9 20 34.8 11.8c-4.2 8-5.3 16.6-2.8 25.4C39 33.3 43 26.6 43 18.8c0-5.5-2.1-10.4-5.4-14.3-2.2-.6-4.5-.6-7.1 0Z" fill="var(--brand-primary)" />
      <path d="M23.8 42.9C14.6 39.7 5 32.2 5 21.6c0-5.1 2-9.5 5.1-12.9C18 14.4 22.8 23.1 23.8 42.9Z" fill="var(--brand-primary-strong)" />
      <path d="M12 31.5c6.6-8.1 13.5-14.4 24-20.4" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function getBrandConfig(role: DashboardRole) {
  const logo = <LeafLogo />;
  switch (role) {
    case "user":
      return { href: "/user/home", logo, title: "SkinCheck", subtitle: "Health", mobileTitle: "SkinCheck", mobileSubtitle: "Health" };
    case "admin":
      return { href: "/admin/dashboard", logo, title: "Skin Detection", subtitle: "Admin Panel", mobileTitle: "Admin Panel", mobileSubtitle: "Skin Detection" };
    case "doctor":
      return { href: "/doctor/dashboard", logo, title: "Skin Detection", subtitle: "Doctor Panel", mobileTitle: "Doctor Panel", mobileSubtitle: "Skin Detection" };
  }
}

function MobileProfileFooter({
  displayName, avatarUrl, role,
}: {
  displayName: string; avatarUrl?: string | null; role: DashboardRole;
}) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileHref = role === "admin" ? "/admin/profile" : role === "doctor" ? "/doctor/profile" : "/user/profile";
  const initials = displayName.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");

  async function handleLogout() {
    setIsLoggingOut(true);
    await logoutAction();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1">
      <Link href={profileHref} className="flex items-center gap-3 px-1 py-2 hover:bg-slate-100 rounded-xl transition-colors">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white overflow-hidden">
          {avatarUrl ? <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" /> : initials}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-xs font-medium text-slate-500">Masuk sebagai</span>
          <span className="truncate text-sm font-bold text-slate-800">{displayName}</span>
        </div>
      </Link>
      <button type="button" disabled={isLoggingOut} onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-60">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
        {isLoggingOut ? "Keluar..." : "Logout"}
      </button>
    </div>
  );
}

export function DashboardLayout({ role, children, profile, headerExtra }: DashboardLayoutProps) {
  const pathname = usePathname();
  const displayName = profile?.full_name || (role === "admin" ? "Admin" : role === "doctor" ? "Dokter" : "Pengguna");
  const avatarUrl = profile?.avatar_url || profile?.google_avatar_url || null;
  const userUuid = profile?.uuid || null;
  const pendingCount = (headerExtra?.pendingCount as number) || 0;

  const navItems = role === "admin" ? getAdminNavItems(pendingCount) : role === "doctor" ? getDoctorNavItems() : getUserNavItems();
  const brand = getBrandConfig(role);
  const activeLabel = navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-shell">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          brand={brand}
          items={navItems}
          mobileFooter={<MobileProfileFooter displayName={displayName} avatarUrl={avatarUrl} role={role} />}
        />
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:h-16 sm:gap-6 sm:px-6">
            <div className="flex min-w-0 flex-1 items-center md:hidden">
              <h1 className="truncate text-base font-bold text-slate-800">{activeLabel}</h1>
            </div>
            <div className="hidden min-w-0 flex-1 items-center md:flex">
              <h1 className="truncate text-base font-bold text-slate-800 sm:text-lg">{activeLabel}</h1>
            </div>
            <div className="flex items-center gap-2">
              {userUuid && (
                <NotificationBell userId={profile?.id} userUuid={userUuid} />
              )}
              <ProfileDropdown displayName={displayName} avatarUrl={avatarUrl} role={role} />
            </div>
          </header>
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
