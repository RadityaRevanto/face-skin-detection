"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getBreadcrumbs } from "@/components/breadcrumb-utils";
import { NotificationBell } from "@/features/notification/components/NotificationBell";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getUserNavItems } from "./sidebar/UserNavItems";
import { getAdminNavItems } from "./sidebar/AdminNavItems";
import { getDoctorNavItems } from "./sidebar/DoctorNavItems";
import { ProfileDropdown } from "./ProfileDropdown";

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
      return { href: "/user/home", logo, title: "Skincek", subtitle: "Health", mobileTitle: "Skincek", mobileSubtitle: "Health" };
    case "admin":
      return { href: "/admin/dashboard", logo, title: "Skincek", subtitle: "Admin Panel", mobileTitle: "Admin Panel", mobileSubtitle: "Skincek" };
    case "doctor":
      return { href: "/doctor/dashboard", logo, title: "Skincek", subtitle: "Doctor Panel", mobileTitle: "Doctor Panel", mobileSubtitle: "Skincek" };
  }
}

function MobileProfileFooter({
  displayName, avatarUrl, role,
}: {
  displayName: string; avatarUrl?: string | null; role: DashboardRole;
}) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileHref = role === "admin" ? "/admin/profile" : role === "doctor" ? "/doctor/profile" : "/user/profile";
  const initials = displayName.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");

  async function handleLogout() {
    setIsLoggingOut(true);
    await logout();
  }

  return (
    <div className="flex flex-col gap-1">
      <Link href={profileHref} className="flex items-center gap-3 px-1 py-2 hover:bg-slate-100 rounded-xl transition-colors">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white overflow-hidden">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatar URL eksternal (R2/Google), next/image perlu konfigurasi domain dinamis
            <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
          ) : initials}
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

/** localStorage key — preferensi collapse sidebar desktop (default: expand). */
const SIDEBAR_COLLAPSE_KEY = "skincek_sidebar_collapsed";

export function DashboardLayout({ role, children, profile, headerExtra }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  // Collapse sidebar — default EXPANDED, persist di localStorage.
  const [collapsed, setCollapsed] = useState(false);
  const [isCollapsedHydrated, setIsCollapsedHydrated] = useState(false);

  // Hydrate preferensi dari localStorage — defer agar setState tidak sinkron di effect.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1");
      setIsCollapsedHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, prev ? "0" : "1");
      return !prev;
    });
  }, []);

  const displayName =
    profile?.full_name ||
    currentUser?.full_name ||
    (role === "admin" ? "Admin" : role === "doctor" ? "Dokter" : "Pengguna");
  const avatarUrl = profile?.avatar_url || currentUser?.avatar_url || currentUser?.google_avatar_url || null;
  const userUuid = profile?.uuid || currentUser?.uuid || null;
  const pendingCount = (headerExtra?.pendingCount as number) || 0;

  // Chat butuh viewport penuh tanpa padding shell; daftar dokter & profil
  // dokter adalah halaman dashboard biasa.
  const isConsultationPage = pathname.startsWith("/user/chats") || pathname.startsWith("/doctor/consultations");

  const navItems = role === "admin" ? getAdminNavItems(pendingCount) : role === "doctor" ? getDoctorNavItems() : getUserNavItems();
  const brand = getBrandConfig(role);
  const breadcrumbs = getBreadcrumbs(pathname);

  const shellActions = (
    <div className="flex items-center gap-1.5">
      {userUuid && (
        <NotificationBell userId={profile?.id} userUuid={userUuid} />
      )}
      <ProfileDropdown displayName={displayName} avatarUrl={avatarUrl} role={role} />
    </div>
  );

  return (
    <div className="min-h-screen bg-shell">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          brand={brand}
          items={navItems}
          mobileFooter={<MobileProfileFooter displayName={displayName} avatarUrl={avatarUrl} role={role} />}
          topbarActions={shellActions}
          collapsed={isCollapsedHydrated ? collapsed : false}
        />
        <div className="min-w-0 flex-1">
          <header className="hidden lg:flex sticky top-0 z-40 h-14 w-full items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:h-16 sm:gap-6 sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {/* Toggle collapse sidebar — di luar sidebar, kiri breadcrumb */}
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
                title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-600"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-5 w-5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                >
                  <rect x="3" y="4" width="14" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M17 9h2.5A1.5 1.5 0 0 1 21 10.5v3A1.5 1.5 0 0 1 19.5 15H17" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M9.5 9.5 7 12l2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <Breadcrumb items={breadcrumbs} className="min-w-0 flex-1" />
            </div>
            {shellActions}
          </header>
          <div className={`${isConsultationPage ? "flex flex-col h-[calc(100dvh-48px)] lg:h-[calc(100dvh-56px)]" : "px-4 py-6 sm:px-6 sm:py-8 lg:px-8"}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
