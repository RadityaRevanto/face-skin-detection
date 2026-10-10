"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  ShieldCheck,
  History,
  Bell,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";

export type AdminSidebarProps = {
  pendingCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
};

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manajemen User", href: "/admin/users", icon: Users },
  { label: "Manajemen Dokter", href: "/admin/doctors", icon: Stethoscope },
  {
    label: "Verifikasi Dokter",
    href: "/admin/doctor-verifications",
    icon: ShieldCheck,
    showBadge: true,
  },
  { label: "Activity Log", href: "/admin/activity-log", icon: History },
  { label: "Notifikasi", href: "/admin/notifications", icon: Bell },
  { label: "Profil", href: "/admin/profile", icon: UserCircle },
];

function SkinCekLogo() {
  return (
    <svg aria-hidden="true" className="h-9 w-9 shrink-0" viewBox="0 0 48 48" fill="none">
      <path
        d="M30.5 4.5C19 8.8 11 17.2 11 27.4c0 8.3 5.5 14.2 13.3 15.7C22.7 31 25.9 20 34.8 11.8c-4.2 8-5.3 16.6-2.8 25.4C39 33.3 43 26.6 43 18.8c0-5.5-2.1-10.4-5.4-14.3-2.2-.6-4.5-.6-7.1 0Z"
        fill="#10b981"
      />
      <path
        d="M23.8 42.9C14.6 39.7 5 32.2 5 21.6c0-5.1 2-9.5 5.1-12.9C18 14.4 22.8 23.1 23.8 42.9Z"
        fill="#047857"
      />
      <path
        d="M12 31.5c6.6-8.1 13.5-14.4 24-20.4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AdminSidebar({
  pendingCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (!isOpenMobile) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseMobile?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  const displayName = currentUser?.full_name || "Admin";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          role="presentation"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-ink/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Navigasi admin"
        className={`fixed left-0 top-0 h-screen w-[264px] bg-surface z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-border transition-transform duration-300 ease-in-out ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-border/50">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 min-w-0"
              onClick={onCloseMobile}
            >
              <SkinCekLogo />
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-950">Skincek</span>
                <span className="text-xs font-semibold text-emerald-600">Health</span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Tutup menu navigasi"
              className="lg:hidden w-10 h-10 -mr-2 rounded-xl flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface-alt transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Label */}
          <div className="px-4 py-2">
            <span className="px-2 font-eyebrow text-eyebrow text-ink-subtle uppercase tracking-wider">
              Navigasi Utama
            </span>
          </div>

          {/* Navigation List */}
          <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? "bg-surface-container-high text-role-accent-admin font-semibold"
                      : "text-ink-muted hover:bg-surface-alt hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-body-default text-body-default">{item.label}</span>
                  </div>
                  {item.showBadge && pendingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning font-caption text-caption font-semibold leading-none">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Identity & Footer */}
        <div className="p-3 border-t border-border/50 flex flex-col gap-2">
          <div className="bg-surface-alt p-2.5 rounded-xl flex items-center gap-2.5 border border-border/60 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-role-accent-admin text-on-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-caption text-caption text-ink font-semibold truncate">
                {displayName}
              </span>
              <span className="font-caption text-caption text-ink-subtle truncate">
                Superadmin
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center gap-2 px-3 py-2 text-ink-muted hover:text-danger hover:bg-error-container/20 rounded-xl transition-colors font-caption text-caption cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}
