"use client";

import { useEffect, useState } from "react";
import { getProfile, UserProfile } from "@/lib/api/profile-query";
import { LoginSecurityContent } from "@/src/features/user/components/LoginSecurityContent";
import { ProfileSidebar } from "@/src/features/user/components/ProfileSidebar";

export function LoginSecurityContainer({ role }: { role: "user" | "doctor" | "admin" }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data)).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !profile) {
    return <div className="flex justify-center items-center h-[calc(100vh-100px)]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" /></div>;
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Login & Keamanan</h1>
        <p className="text-zinc-500 mt-1.5 text-sm sm:text-base">Kelola password dan sesi login Anda.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        <ProfileSidebar profile={profile} role={role} activePage="login-security" />
        <div className="flex-1 w-full min-w-0"><LoginSecurityContent showDeviceTokens={role !== "admin"} /></div>
      </div>
    </main>
  );
}
