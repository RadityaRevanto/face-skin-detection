import Link from "next/link";
import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { HomeIcon, CalendarIcon, ClockIcon, ChatIcon, StarIcon } from "./navbar-users-icons";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { label: "Beranda", href: "/user/home", icon: <HomeIcon /> },
  { label: "Pemeriksaan", href: "/user/pemeriksaan", icon: <CalendarIcon /> },
  { label: "History", href: "/user/history", icon: <ClockIcon /> },
  { label: "Konsultasi", href: "/user/consultations", icon: <ChatIcon /> },
  { label: "Premium", href: "/user/subscription", icon: <StarIcon /> },
];

export function NavbarUsersItems() {
  const pathname = usePathname();

  return (
    <div className="hidden h-full flex-1 items-center justify-center gap-4 lg:gap-8 md:flex mx-4 overflow-hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex h-full items-center gap-2 text-sm font-semibold transition-colors ${
              item.label === "Premium"
                ? isActive ? "text-amber-500" : "text-amber-600 hover:text-amber-500"
                : isActive ? "text-emerald-600" : "text-slate-500 hover:text-emerald-600"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {isActive && (
              <span className={`absolute bottom-0 left-1/2 h-1 w-20 -translate-x-1/2 rounded-t-full ${item.label === "Premium" ? "bg-amber-500" : "bg-emerald-500"}`} />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export { navItems };
export type { NavItem };
