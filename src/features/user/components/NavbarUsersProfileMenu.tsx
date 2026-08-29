import Link from "next/link";

import {
  ChevronDownIcon,
  LogoutIcon,
  UserAvatar,
} from "./NavbarUsersIcons";

type NavbarUsersProfileMenuProps = {
  displayName: string;
  avatarUrl?: string | null;
  isProfileOpen: boolean;
  isLoggingOut: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
};

export function NavbarUsersProfileMenu({
  displayName,
  avatarUrl,
  isProfileOpen,
  isLoggingOut,
  onToggle,
  onClose,
  onLogout,
}: NavbarUsersProfileMenuProps) {
  return (
    <div className="relative hidden md:block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isProfileOpen}
        onClick={onToggle}
        className="flex items-center gap-3 rounded-full py-1 pl-3 pr-1 transition-colors hover:bg-slate-50"
      >
        <span className="text-sm font-medium text-slate-500">
          Halo, <strong className="font-bold text-slate-700">{displayName}</strong>
        </span>
        <UserAvatar url={avatarUrl} name={displayName} />
        <span className={`grid h-5 w-5 place-items-center text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {isProfileOpen && (
        <div role="menu" className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/70">
          <Link href="/user/profile" onClick={onClose} className="block border-b border-slate-100 px-3 py-3 hover:bg-slate-50 transition-colors">
            <p className="text-xs font-medium text-slate-500">Masuk sebagai</p>
            <p className="mt-1 truncate text-sm font-bold text-slate-800">{displayName}</p>
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={isLoggingOut}
            onClick={onLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-60"
          >
            <LogoutIcon />
            {isLoggingOut ? "Keluar..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}
