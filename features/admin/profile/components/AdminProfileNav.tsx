"use client";

import Link from "next/link";
import { KeyRound, Shield, User as UserIcon } from "lucide-react";

/**
 * Sidebar 3-section pengaturan akun admin (§5.10):
 * - Mobile: horizontal segmented tabs (scroll-x jika sempit).
 * - Desktop (lg+): nav vertikal kiri w-64 — struktur existing dipertahankan.
 */

export function AdminProfileNav({
  activePage,
}: {
  activePage: "profile" | "login-security" | "privacy";
}) {
  const basePath = "/admin/profile";
  const navItems = [
    { key: "profile", label: "Profil Akun", icon: <UserIcon size={18} />, href: basePath },
    { key: "login-security", label: "Login & Keamanan", icon: <KeyRound size={18} />, href: `${basePath}/login-security` },
    { key: "privacy", label: "Privasi & Data", icon: <Shield size={18} />, href: `${basePath}/privacy` },
  ] as const;

  return (
    <nav
      aria-label="Pengaturan akun admin"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:w-64 lg:shrink-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
    >
      {navItems.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors lg:gap-3 lg:py-3 ${
            activePage === item.key
              ? "border border-emerald-200/50 bg-emerald-50 text-emerald-700"
              : "border border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          {item.icon} {item.label}
        </Link>
      ))}
    </nav>
  );
}
