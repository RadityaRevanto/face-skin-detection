"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { logoutAction } from "@/lib/auth/actions";
import { NotificationBell } from "@/src/features/notification/components/NotificationBell";

import {
  CloseIcon,
  LogoMark,
  MenuIcon,
} from "./NavbarUsersIcons";
import { NavbarUsersItems } from "./NavbarUsersItems";
import { NavbarUsersProfileMenu } from "./NavbarUsersProfileMenu";
import { NavbarUsersMobileMenu } from "./NavbarUsersMobileMenu";

interface NavbarUsersProps {
  initialDisplayName?: string;
  initialAvatarUrl?: string | null;
  userId?: number | string | null;
  userUuid?: string | null;
}

export default function NavbarUsers({
  initialDisplayName = "Pengguna",
  initialAvatarUrl = null,
  userId = null,
  userUuid = null,
}: NavbarUsersProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await logoutAction();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <nav aria-label="Navigasi pengguna" className="relative flex h-18 w-full items-center justify-between gap-6 px-6 md:px-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="md:hidden flex items-center justify-center text-slate-500 hover:text-emerald-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link href="/user/home" className="flex shrink-0 items-center gap-3">
            <LogoMark />
            <span className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-slate-900">SkinCheck</span>
              <span className="text-sm font-semibold text-emerald-500">Health</span>
            </span>
          </Link>
        </div>

        <NavbarUsersItems />

        <div className="flex shrink-0 items-center gap-3 md:gap-5">
          <NotificationBell userId={userId} userUuid={userUuid} />

          <NavbarUsersProfileMenu
            displayName={initialDisplayName}
            avatarUrl={initialAvatarUrl}
            isProfileOpen={isProfileOpen}
            isLoggingOut={isLoggingOut}
            onToggle={() => setIsProfileOpen((value) => !value)}
            onClose={() => setIsProfileOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      </nav>

      <NavbarUsersMobileMenu
        displayName={initialDisplayName}
        avatarUrl={initialAvatarUrl}
        isMobileMenuOpen={isMobileMenuOpen}
        isLoggingOut={isLoggingOut}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}
