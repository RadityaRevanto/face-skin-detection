import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutIcon, UserAvatar } from "./navbar-users-icons";
import { navItems } from "./navbar-users-items";

type NavbarUsersMobileMenuProps = {
  displayName: string;
  avatarUrl?: string | null;
  isMobileMenuOpen: boolean;
  isLoggingOut: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export function NavbarUsersMobileMenu({
  displayName,
  avatarUrl,
  isMobileMenuOpen,
  isLoggingOut,
  onClose,
  onLogout,
}: NavbarUsersMobileMenuProps) {
  const pathname = usePathname();
  if (!isMobileMenuOpen) return null;

  return (
    <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-4 shadow-xl">
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                item.label === "Premium"
                  ? isActive ? "bg-amber-50 text-amber-600" : "text-amber-600 hover:bg-amber-50"
                  : isActive ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="border-t border-slate-100 pt-4 pb-2">
        <Link href="/user/profile" onClick={onClose} className="flex items-center gap-3 px-4 mb-4 hover:bg-slate-50 p-2 rounded-xl transition-colors">
          <UserAvatar url={avatarUrl} name={displayName} />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500">Masuk sebagai</span>
            <span className="text-sm font-bold text-slate-800">{displayName}</span>
          </div>
        </Link>
        <button
          type="button"
          disabled={isLoggingOut}
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <LogoutIcon />
          {isLoggingOut ? "Keluar..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
