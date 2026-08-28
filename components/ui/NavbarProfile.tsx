import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { ChevronDownIcon, LogoutIcon, ProfileIcon } from "./NavbarIcons";
import type { NavbarItem } from "../Navbar";

type NavbarProfileProps = {
  displayName: string;
  avatarUrl?: string | null;
  isProfileOpen: boolean;
  isLoggingOut: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
};

export function NavbarProfile({
  displayName,
  avatarUrl,
  isProfileOpen,
  isLoggingOut,
  onToggle,
  onClose,
  onLogout,
}: NavbarProfileProps) {
  const pathname = usePathname();

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isProfileOpen}
        onClick={onToggle}
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
          <div className="fixed inset-0 z-40" onClick={onClose} />
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
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ProfileIcon />
              Profile
            </Link>
            <button
              type="button"
              role="menuitem"
              disabled={isLoggingOut}
              onClick={onLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
            >
              <LogoutIcon />
              {isLoggingOut ? "Keluar..." : "Logout"}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
