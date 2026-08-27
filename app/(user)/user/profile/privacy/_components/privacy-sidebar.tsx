"use client";

import Link from "next/link";
import { User as UserIcon, KeyRound, Shield, CreditCard, Clock } from "lucide-react";
import type { UserProfile } from "@/lib/api/profile-query";

export function PrivacySidebar({ profile }: { profile: UserProfile }) {
  return (
    <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
      <Link href="/user/profile" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium rounded-xl transition-colors">
        <UserIcon size={18} /> Profil Akun
      </Link>
      <Link href="/user/profile/login-security" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium rounded-xl transition-colors">
        <KeyRound size={18} /> Login & Keamanan
      </Link>
      <Link href="/user/profile/privacy" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 font-medium rounded-xl border border-emerald-200/50">
        <Shield size={18} /> Privasi & Data
      </Link>

      <div className="mt-4 p-5 bg-linear-to-br from-zinc-900 to-zinc-800 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CreditCard size={64} />
        </div>
        <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Status Langganan</p>
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          SkinCek {profile.subscription_status === 'Pro' ? <span className="text-amber-400">PRO</span> : 'FREE'}
        </h3>

        {profile.subscription_status !== 'Pro' && (
          <div className="space-y-3">
            <div className="bg-white/10 rounded-lg p-2.5 flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs">
                <Clock size={14} className="text-emerald-400" /> Total Scan
              </div>
              <span className="font-bold text-sm">{profile.scan_count || 0}</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-snug px-1">
              Kuota scan gratis 3x/hari untuk pengguna Free.
            </p>
            <Link href="/user/subscription" className="block w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg mt-2 transition-colors text-center">
              Upgrade Pro
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
