"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight, User, Menu } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { NotificationBell } from "@/features/notification/components/NotificationBell";

export type AdminTopbarProps = {
  onOpenMobileMenu?: () => void;
};

function getBreadcrumbLabel(pathname: string): { section: string; current: string } {
  if (pathname.startsWith("/admin/dashboard")) {
    return { section: "Admin", current: "Dashboard" };
  }
  if (pathname.startsWith("/admin/users/detail")) {
    return { section: "Manajemen User", current: "Detail User" };
  }
  if (pathname.startsWith("/admin/users")) {
    return { section: "Admin", current: "Manajemen User" };
  }
  if (pathname.startsWith("/admin/doctors/detail")) {
    return { section: "Manajemen Dokter", current: "Detail Dokter" };
  }
  if (pathname.startsWith("/admin/doctors")) {
    return { section: "Admin", current: "Manajemen Dokter" };
  }
  if (pathname.startsWith("/admin/doctor-verifications/detail")) {
    return { section: "Verifikasi Dokter", current: "Detail Verifikasi" };
  }
  if (pathname.startsWith("/admin/doctor-verifications")) {
    return { section: "Admin", current: "Verifikasi Dokter" };
  }
  if (pathname.startsWith("/admin/activity-log")) {
    return { section: "Admin", current: "Activity Log" };
  }
  if (pathname.startsWith("/admin/notifications")) {
    return { section: "Admin", current: "Notifikasi" };
  }
  if (pathname.startsWith("/admin/profile")) {
    return { section: "Admin", current: "Profil" };
  }
  return { section: "Admin", current: "Console" };
}

export function AdminTopbar({ onOpenMobileMenu }: AdminTopbarProps) {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const breadcrumbs = getBreadcrumbLabel(pathname);

  const displayName = currentUser?.full_name || "Admin";

  return (
    <header className="fixed top-0 left-0 lg:left-[264px] right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-border">
      {/* Mobile Drawer Trigger & Breadcrumb Navigation */}
      <div className="flex items-center gap-2 sm:gap-3 text-ink-muted font-caption text-caption min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Buka menu navigasi"
          className="lg:hidden w-11 h-11 -ml-1 rounded-xl flex items-center justify-center text-ink hover:bg-surface-alt active:bg-surface-container transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 hover:text-ink transition-colors"
          >
            <Home className="w-4 h-4 text-ink-subtle" />
            <span>Portal</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-ink-subtle" />
          <span className="hover:text-ink transition-colors">{breadcrumbs.section}</span>
          <ChevronRight className="w-3.5 h-3.5 text-ink-subtle" />
        </div>
        <span className="text-ink font-semibold truncate max-w-[140px] sm:max-w-none">
          {breadcrumbs.current}
        </span>
      </div>

      {/* Right Action Widgets */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="flex items-center">
          <NotificationBell userUuid={currentUser?.uuid} />
        </div>

        {/* Profile Pill */}
        <Link
          href="/admin/profile"
          className="flex items-center gap-2.5 pl-2 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-role-accent-admin text-white flex items-center justify-center font-bold text-xs">
            {currentUser?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUser.avatar_url}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="font-caption text-caption font-semibold text-ink leading-tight">
              {displayName}
            </span>
            <span className="font-eyebrow text-eyebrow text-ink-subtle">Superadmin</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
