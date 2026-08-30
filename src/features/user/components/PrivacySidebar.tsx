"use client";

import Link from "next/link";
import { User as UserIcon, KeyRound, Shield } from "lucide-react";

type PrivacySidebarProps = {
  basePath: string;
  activePage: "profile" | "login-security" | "privacy";
};

/**
 * Sidebar 3-section pengaturan akun — shared semua role
 * (Profil Akun → Login & Keamanan → Privasi & Data).
 */
export function PrivacySidebar({ basePath, activePage }: PrivacySidebarProps) {
  const navItems = [
    { key: "profile", label: "Profil Akun", icon: <UserIcon size={18} />, href: basePath },
    { key: "login-security", label: "Login & Keamanan", icon: <KeyRound size={18} />, href: `${basePath}/login-security` },
    { key: "privacy", label: "Privasi & Data", icon: <Shield size={18} />, href: `${basePath}/privacy` },
  ] as const;

  return (
    <div className="flex w-full flex-col gap-2 lg:w-64 lg:shrink-0">
      {navItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${
            activePage === item.key
              ? "border border-emerald-200/50 bg-emerald-50 text-emerald-700"
              : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          {item.icon} {item.label}
        </Link>
      ))}
    </div>
  );
}
