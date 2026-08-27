"use client";

import { useEffect, useState } from "react";
import { getProfile, UserProfile, exportUserData, deleteAccount } from "@/lib/api/profile-query";
import { ProfileForm } from "@/components/users/profile-form";
import { Info, User as UserIcon, Shield, CreditCard, Clock } from "lucide-react";
import Link from "next/link";

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      await exportUserData();
    } catch (err: any) {
      alert(err.message || "Gagal mengunduh data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("PERINGATAN: Apakah Anda yakin ingin menghapus akun secara permanen? Semua data medis, riwayat scan, dan konsultasi akan hilang dan tidak dapat dikembalikan.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteAccount();
      window.location.href = "/";
    } catch (err: any) {
      alert(err.message || "Gagal menghapus akun");
      setIsDeleting(false);
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
          <Link href="/user/security" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium rounded-xl transition-colors">
            <Shield size={18} /> Keamanan & Sesi
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
                    <Clock size={14} className="text-emerald-400" /> Sisa Scan
                  </div>
                  <span className="font-bold text-sm">{3 - (profile.scan_count || 0)} / 3</span>
                </div>
                <div className="bg-white/10 rounded-lg p-2.5 flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={14} className="text-emerald-400" /> Sisa Chat
                  </div>
                  <span className="font-bold text-sm">{profile.remaining_free_messages || 0} / 3</span>
                </div>
                <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg mt-2 transition-colors">
                  Upgrade Pro
                </button>
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
          
          {/* Danger Zone (UU PDP Compliance) */}
          <div className="mt-8 pt-8 border-t border-zinc-200">
            <h3 className="text-lg font-bold text-rose-600 mb-2">Zona Berbahaya</h3>
            <p className="text-sm text-zinc-500 mb-6">Pengaturan ini bersifat permanen dan berkaitan dengan hak privasi data Anda sesuai hukum yang berlaku.</p>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl gap-4">
                <div>
                  <h4 className="font-semibold text-zinc-800 text-sm">Unduh Data Pribadi (Export)</h4>
                  <p className="text-xs text-zinc-500 mt-1">Unduh seluruh riwayat konsultasi, scan wajah, dan informasi pribadi Anda dalam format file JSON.</p>
                </div>
                <button 
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="shrink-0 px-4 py-2 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-700 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {isExporting ? "Memproses..." : "Unduh Data"}
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-rose-50 border border-rose-200 rounded-xl gap-4">
                <div>
                  <h4 className="font-semibold text-rose-800 text-sm">Hapus Akun Permanen</h4>
                  <p className="text-xs text-rose-700 mt-1">Tindakan ini akan menghapus seluruh data Anda secara permanen. Data yang dihapus tidak dapat dipulihkan kembali.</p>
                </div>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="shrink-0 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-sm shadow-rose-500/20"
                >
                  {isDeleting ? "Menghapus..." : "Hapus Akun Saya"}
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
    </main>
  );
}
