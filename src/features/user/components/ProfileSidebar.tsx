"use client";

import Link from "next/link";
import { User as UserIcon, KeyRound, Shield, CreditCard, Clock } from "lucide-react";
import type { UserProfile } from "@/lib/api/profile-query";

type ProfileSidebarProps = {
  profile: UserProfile;
  role: "user" | "doctor";
  activePage: "profile" | "login-security" | "privacy";
};

export function ProfileSidebar({ profile, role, activePage }: ProfileSidebarProps) {
  const basePath = role === "doctor" ? "/doctor/profile" : "/user/profile";

  const navItems: { key: "profile" | "login-security" | "privacy"; label: string; icon: React.ReactNode; href: string }[] = [
    { key: "profile", label: "Profil Akun", icon: <UserIcon size={18} />, href: basePath },
    { key: "login-security", label: "Login & Keamanan", icon: <KeyRound size={18} />, href: `${basePath}/login-security` },
  ];
  if (role === "user") {
    navItems.push({ key: "privacy", label: "Privasi & Data", icon: <Shield size={18} />, href: `${basePath}/privacy` });
  }

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
      {role === "user" && <SubscriptionCard profile={profile} />}
      {role === "doctor" && <VerificationCard profile={profile} />}
    </div>
  );
}

function SubscriptionCard({ profile }: { profile: UserProfile }) {
  return (
    <div className="mt-4 p-5 bg-linear-to-br from-zinc-900 to-zinc-800 rounded-2xl text-white shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10"><CreditCard size={64} /></div>
      <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Status Langganan</p>
      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
        SkinCek {profile.subscription_status === 'Pro' ? <span className="text-amber-400">PRO</span> : 'FREE'}
      </h3>
      {profile.subscription_status !== 'Pro' && (
        <div className="space-y-3">
          <div className="bg-white/10 rounded-lg p-2.5 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs"><Clock size={14} className="text-emerald-400" /> Total Scan</div>
            <span className="font-bold text-sm">{profile.scan_count || 0}</span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-snug px-1">Kuota scan gratis 3x/hari untuk pengguna Free.</p>
          <div className="bg-white/10 rounded-lg p-2.5 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs"><Clock size={14} className="text-emerald-400" /> Sisa Chat</div>
            <span className="font-bold text-sm">{profile.remaining_free_messages || 0} / 3</span>
          </div>
          <Link href="/user/subscription" className="block w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg mt-2 transition-colors text-center">Upgrade Pro</Link>
        </div>
      )}
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
