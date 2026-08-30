"use client";

import Link from "next/link";
import { User as UserIcon, KeyRound, Shield } from "lucide-react";
import type { UserProfile } from "@/lib/api/profile-query";
import { SubscriptionCard } from "./SubscriptionCard";

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

      <div className="order-last lg:order-none">
        <SubscriptionCard profile={profile} />
      </div>
    </div>
  );
}
