"use client";

import { useEffect, useState } from "react";
import { getProfile, UserProfile } from "@/lib/api/profile-query";
import { LoginSecurityContent } from "@/components/users/login-security-content";
import { User as UserIcon, Shield, KeyRound, CreditCard, Clock } from "lucide-react";
import Link from "next/link";

export default function UserLoginSecurityPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Login & Keamanan</h1>
        <p className="text-zinc-500 mt-1.5 text-sm sm:text-base">Kelola password dan sesi login Anda.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <Link href="/user/profile" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium rounded-xl transition-colors">
            <UserIcon size={18} /> Profil Akun
          </Link>
          <Link href="/user/profile/login-security" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 font-medium rounded-xl border border-emerald-200/50">
            <KeyRound size={18} /> Login & Keamanan
          </Link>
          <Link href="/user/profile/privacy" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium rounded-xl transition-colors">
            <Shield size={18} /> Privasi & Data
          </Link>

          <div className="mt-4 p-5 bg-linear-to-br from-zinc-900 to-zinc-800 rounded-2xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CreditCard size={64} />
            </div>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Status Langganan</p>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              SkinCek {profile.subscription_status === "Pro" ? <span className="text-amber-400">PRO</span> : "FREE"}
            </h3>
            {profile.subscription_status !== "Pro" && (
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-2.5 flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={14} className="text-emerald-400" /> Total Scan
                  </div>
                  <span className="font-bold text-sm">{profile.scan_count || 0}</span>
                </div>
                <Link href="/user/subscription" className="block w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg mt-2 transition-colors text-center">
                  Upgrade Pro
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          <LoginSecurityContent />
        </div>
      </div>
    </main>
  );
}
