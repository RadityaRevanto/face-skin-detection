import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { CloseIcon, LogoutIcon } from "./navbar-icons";
import type { NavbarItem } from "./app-navbar";
import { NavbarLogo } from "./navbar-logo";

type NavbarMobileDrawerProps = {
  brand: {
    href: string;
    logo: ReactNode;
    title: string;
    subtitle?: string;
  };
  items: NavbarItem[];
  displayName: string;
  avatarUrl?: string | null;
  isMobileOpen: boolean;
  isLoggingOut: boolean;
  onClose: () => void;
  onLogout: () => void;
};

import type { ReactNode } from "react";

export function NavbarMobileDrawer({
  brand,
  items,
  displayName,
  avatarUrl,
  isMobileOpen,
  isLoggingOut,
  onClose,
  onLogout,
}: NavbarMobileDrawerProps) {
  const pathname = usePathname();

  return (
    <>
      {isMobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={onClose} />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <NavbarLogo brand={brand} onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
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
                onClick={onClose}
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
            onClick={onLogout}
            className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
          >
            <LogoutIcon />
            {isLoggingOut ? "Keluar..." : "Logout"}
          </button>
        </div>
      </div>
    </>
  );
}
