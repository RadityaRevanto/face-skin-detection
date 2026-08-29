"use client";

import { useEffect, useState } from "react";
import { getProfile, UserProfile } from "@/lib/api/profile-query";
import { ProfileForm } from "@/src/features/user/components/ProfileForm";
import { ProfileSidebar } from "@/src/features/user/components/ProfileSidebar";
import { Info } from "lucide-react";

export function DoctorProfileContainer() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try { const res = await getProfile(); setProfile(res.data); }
    catch (err: any) { setError(err.message || "Gagal memuat profil"); }
    finally { setIsLoading(false); }
  };

  if (isLoading) return <div className="flex justify-center items-center h-[calc(100vh-100px)]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" /></div>;
  if (error || !profile) return <div className="flex justify-center items-center h-[calc(100vh-100px)]"><div className="text-center"><p className="text-rose-500 mb-4">{error}</p><button onClick={fetchProfile} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Coba Lagi</button></div></div>;

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Pengaturan Profil Dokter</h1>
        <p className="text-zinc-500 mt-1.5 text-sm sm:text-base">Kelola informasi pribadi dan verifikasi profesi Anda.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        <ProfileSidebar profile={profile} role="doctor" activePage="profile" />
        <div className="flex-1 w-full min-w-0">
          {(!profile.verification_status || profile.verification_status === 'unverified') && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 flex items-start gap-3 rounded-xl">
              <Info className="text-amber-500 shrink-0 mt-0.5" size={20} />
              <div><h4 className="font-semibold text-amber-800 text-sm">Akun Belum Terverifikasi</h4><p className="text-xs text-amber-700 mt-1">Anda belum dapat membalas chat pasien. Harap lengkapi dokumen verifikasi Anda di halaman Dashboard Verifikasi.</p></div>
            </div>
          )}
          <ProfileForm profile={profile} onProfileUpdated={(updated) => setProfile(updated)} />
        </div>
      </div>
    </main>
  );
}
