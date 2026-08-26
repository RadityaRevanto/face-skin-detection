"use client";

import { useEffect, useState } from "react";
import { getProfile, UserProfile } from "@/lib/api/profile-query";
import { User as UserIcon, Shield, CreditCard, Clock, Download, Trash2, Bot, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserPrivacyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [consentStatus, setConsentStatus] = useState(false);
  const [isConsentLoading, setIsConsentLoading] = useState(true);
  
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resProfile, resConsent] = await Promise.all([
        getProfile(),
        fetch("/api/ai-chat/consent").then(r => r.json())
      ]);
      setProfile(resProfile.data);
      if (resConsent.data) {
        setConsentStatus(resConsent.data.accepted);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsConsentLoading(false);
    }
  };

  const toggleConsent = async () => {
    try {
      setIsConsentLoading(true);
      const newStatus = !consentStatus;
      const res = await fetch("/api/ai-chat/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: newStatus })
      });
      const json = await res.json();
      if (json.data) {
        setConsentStatus(json.data.accepted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConsentLoading(false);
    }
  };

  const exportData = async () => {
    try {
      setIsExporting(true);
      const res = await fetch("/api/profile/export", { method: "POST" });
      const json = await res.json();
      if (json.data?.download_url) {
        window.location.href = json.data.download_url;
      } else {
        alert(json.meta?.message || json.message || "Fitur ekspor data sedang dalam pengembangan oleh tim backend (Endpoint belum siap).");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem atau fitur ekspor data belum tersedia di backend.");
    } finally {
      setIsExporting(false);
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirmText !== "HAPUS AKUN SAYA") {
      alert("Teks konfirmasi tidak sesuai");
      return;
    }
    try {
      setIsDeleting(true);
      const res = await fetch("/api/profile", { method: "DELETE" });
      const json = await res.json();
      if (json.success === false) {
        alert(json.message);
        setIsDeleting(false);
      } else {
        // Berhasil dihapus, arahkan ke login
        router.replace("/login");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus akun");
      setIsDeleting(false);
    }
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Privasi & Data</h1>
        <p className="text-zinc-500 mt-1.5 text-sm sm:text-base">Kelola persetujuan AI, ekspor data Anda, atau hapus akun permanen.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <Link href="/user/profile" className="flex items-center gap-3 px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium rounded-xl transition-colors">
            <UserIcon size={18} /> Profil Akun
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
                    <Clock size={14} className="text-emerald-400" /> Sisa Scan
                  </div>
                  <span className="font-bold text-sm">{3 - (profile.scan_count || 0)} / 3</span>
                </div>
                <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-lg mt-2 transition-colors">
                  Upgrade Pro
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          
          {/* AI Consent */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Bot size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Persetujuan Kecerdasan Buatan (AI)</h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  Dengan menyetujui, Anda mengizinkan SkinCek membagikan isi pesan teks *chat* Anda ke penyedia kecerdasan buatan (Google Gemini) agar bot Aura Skin dapat menjawab pertanyaan Anda. Pesan ini tidak digunakan untuk melatih model mereka. Anda dapat mencabut persetujuan ini kapan saja.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleConsent}
                    disabled={isConsentLoading}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${consentStatus ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span 
                      style={{ transform: consentStatus ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }} 
                      className="inline-block h-4 w-4 rounded-full bg-white transition-transform" 
                    />
                  </button>
                  <span className="text-sm font-medium text-slate-700">
                    {consentStatus ? "Diizinkan" : "Tidak Diizinkan"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Export Data */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Download size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Ekspor Data Pribadi (UU PDP)</h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  Sesuai Undang-Undang Pelindungan Data Pribadi (UU PDP), Anda berhak mengunduh seluruh data aktivitas Anda di platform ini (profil, riwayat *scan*, pesan, dll.) dalam bentuk berkas digital (.json).
                </p>
                <button
                  onClick={exportData}
                  disabled={isExporting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
                >
                  {isExporting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Download size={16} />
                  )}
                  {isExporting ? "Menyiapkan Data..." : "Unduh Data Pribadi Saya"}
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-50 rounded-2xl p-6 border border-rose-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl text-rose-600 shadow-sm">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-rose-900 mb-1">Zona Berbahaya</h3>
                <p className="text-sm text-rose-700 mb-4 leading-relaxed">
                  Tindakan ini akan menghapus akun Anda secara permanen beserta seluruh riwayat *scan*, obrolan, dan sisa langganan *SkinCek Pro* Anda (jika ada). Data yang telah dihapus tidak dapat dipulihkan kembali.
                </p>
                
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Hapus Akun Permanen
                  </button>
                ) : (
                  <div className="bg-white p-4 rounded-xl border border-rose-200 mt-2">
                    <p className="text-sm font-medium text-slate-900 mb-2">Ketik <strong className="text-rose-600 select-none">HAPUS AKUN SAYA</strong> untuk mengonfirmasi:</p>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="HAPUS AKUN SAYA"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={deleteAccount}
                        disabled={isDeleting || deleteConfirmText !== "HAPUS AKUN SAYA"}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {isDeleting ? "Menghapus..." : "Konfirmasi Hapus"}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
