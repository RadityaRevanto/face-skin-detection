"use client";

import Link from "next/link";
import { KeyRound, Shield, User as UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Nav pengaturan akun (3 section) — satu implementasi untuk SEMUA role.
 * Dipakai ProfileSidebar (user/doctor) & halaman-halaman /admin/profile.
 */

export type ProfileSettingsPage = "profile" | "login-security" | "privacy";

const NAV: { key: ProfileSettingsPage; label: string; icon: typeof UserIcon }[] = [
  { key: "profile", label: "Profil Akun", icon: UserIcon },
  { key: "login-security", label: "Login & Keamanan", icon: KeyRound },
  { key: "privacy", label: "Privasi & Data", icon: Shield },
];

export function ProfileSettingsNav({
  activePage,
  basePath,
  className,
}: {
  activePage: ProfileSettingsPage;
  /** Base path role, mis. "/admin/profile". */
  basePath: string;
  className?: string;
}) {
  return (
    <nav className={cn("flex flex-col gap-2", className)}>
      {NAV.map((item) => {
        const Icon = item.icon;
        const href = item.key === "profile" ? basePath : `${basePath}/${item.key}`;
        const isActive = activePage === item.key;
        return (
          <Link
            key={item.key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-[var(--radius-control)] px-4 py-3 text-sm font-medium transition-colors duration-[var(--motion-fast)]",
              isActive
                ? "border border-[var(--role-accent)]/30 bg-[var(--role-accent-soft)] text-[var(--role-accent-strong)]"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}