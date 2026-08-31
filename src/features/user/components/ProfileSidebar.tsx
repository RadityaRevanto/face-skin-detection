"use client";

import Link from "next/link";
import { User as UserIcon, KeyRound, Shield } from "lucide-react";
import type { UserProfile } from "@/lib/api/profile-query";
import { SubscriptionCard } from "./SubscriptionCard";

type ProfileSidebarProps = {
  profile: UserProfile;
  role: "user" | "doctor" | "admin";
  activePage: "profile" | "login-security" | "privacy";
};

/**
 * Sidebar 3-section pengaturan akun — struktur sama untuk SEMUA role
 * (PROFILE_PAGE.md): Profil Akun → Login & Keamanan → Privasi & Data.
 */
export function ProfileSidebar({ profile, role, activePage }: ProfileSidebarProps) {
  const basePath = role === "doctor" ? "/doctor/profile" : role === "admin" ? "/admin/profile" : "/user/profile";

  const navItems: { key: "profile" | "login-security" | "privacy"; label: string; icon: React.ReactNode; href: string }[] = [
    { key: "profile", label: "Profil Akun", icon: <UserIcon size={18} />, href: basePath },
    { key: "login-security", label: "Login & Keamanan", icon: <KeyRound size={18} />, href: `${basePath}/login-security` },
    { key: "privacy", label: "Privasi & Data", icon: <Shield size={18} />, href: `${basePath}/privacy` },
  ];

  return (
    <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
      {navItems.map((item) => (
        <Link key={item.key} href={item.href}
          className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${
            activePage === item.key ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          }`}>
          {item.icon} {item.label}
        </Link>
      ))}
      {role === "user" && <div className="order-last lg:order-none"><SubscriptionCard profile={profile} /></div>}
      {role === "doctor" && <VerificationCard profile={profile} />}
    </div>
  );
}

function VerificationCard({ profile }: { profile: UserProfile }) {
  return (
    <div className="mt-4 p-5 bg-linear-to-br from-emerald-900 to-emerald-800 rounded-2xl text-white shadow-lg relative overflow-hidden">
      <p className="text-xs text-emerald-100 font-medium uppercase tracking-wider mb-1">Status Verifikasi</p>
      <h3 className="text-xl font-bold mb-3">
        {profile.verification_status === 'approved' && <span className="text-white">Terverifikasi</span>}
        {profile.verification_status === 'pending' && <span className="text-amber-300">Menunggu Review</span>}
        {profile.verification_status === 'rejected' && <span className="text-rose-300">Ditolak</span>}
        {profile.verification_status === 'needs_revision' && <span className="text-amber-300">Revisi</span>}
        {(!profile.verification_status || profile.verification_status === 'unverified') && <span className="text-zinc-300">Belum Verifikasi</span>}
      </h3>
    </div>
  );
}
