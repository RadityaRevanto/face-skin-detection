"use client";

import { useEffect, useState } from "react";
import { getProfile, UserProfile } from "@/lib/api/profile-query";
import { ProfileForm } from "@/components/users/profile-form";
import { Info, User as UserIcon, Shield, KeyRound, CreditCard, Clock } from "lucide-react";
import Link from "next/link";

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat profil");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <p className="text-rose-500 mb-4">{error}</p>
          <button 
            onClick={fetchProfile}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Pengaturan Profil</h1>
        <p className="text-zinc-500 mt-1.5 text-sm sm:text-base">Kelola informasi pribadi dan keamanan akun Anda.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        
        {/* Sidebar Nav (Static for now) */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <Link href="/user/profile" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 font-medium rounded-xl border border-emerald-200/50">
            <UserIcon size={18} /> Profil Akun
          </Link>
          <Link href="/user/profile/login-security" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium rounded-xl transition-colors">
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
                <div className="bg-white/10 rounded-lg p-2.5 flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={14} className="text-emerald-400" /> Sisa Chat
                  </div>
                  <span className="font-bold text-sm">{profile.remaining_free_messages || 0} / 3</span>
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
          {!profile.profile_completed && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 flex items-start gap-3 rounded-xl">
              <Info className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-semibold text-amber-800 text-sm">Profil Belum Lengkap</h4>
                <p className="text-xs text-amber-700 mt-1">Silakan lengkapi tanggal lahir dan jenis kelamin Anda untuk dapat menggunakan fitur deteksi wajah (Scan).</p>
              </div>
            </div>
          )}

          <ProfileForm 
            profile={profile} 
            onProfileUpdated={(updated) => setProfile(updated)} 
          />
        </div>
      </div>
      
    </main>
  );
}
