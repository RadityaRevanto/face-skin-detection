"use client";

import { useEffect, useState } from "react";
import { getProfile, UserProfile } from "@/lib/api/profile-query";
import { useRouter } from "next/navigation";

import { PrivacySidebar } from "./privacy-sidebar";
import { AiConsentCard } from "./ai-consent-card";
import { ExportDataCard } from "./export-data-card";
import { DangerZoneCard } from "./danger-zone-card";

export function PrivacyContainer() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [consentStatus, setConsentStatus] = useState(false);
  const [isConsentLoading, setIsConsentLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [resProfile, resConsent] = await Promise.all([
        getProfile(),
        fetch("/api/ai-chat/consent").then(r => r.json())
      ]);
      setProfile(resProfile.data);
      if (resConsent.data) setConsentStatus(resConsent.data.accepted);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); setIsConsentLoading(false); }
  };

  const toggleConsent = async () => {
    try {
      setIsConsentLoading(true);
      const res = await fetch("/api/ai-chat/consent", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: !consentStatus })
      });
      const json = await res.json();
      if (json.data) setConsentStatus(json.data.accepted);
    } catch (err) { console.error(err); }
    finally { setIsConsentLoading(false); }
  };

  const exportData = async () => {
    try {
      setIsExporting(true);
      const res = await fetch("/api/profile/export", { method: "POST" });
      const json = await res.json();
      if (json.data?.download_url) {
        const backendUrl = new URL(json.data.download_url);
        window.location.href = `/api/profile/exports/download${backendUrl.search}`;
      } else {
        alert(json.meta?.message || json.message || "Fitur ekspor data sedang dalam pengembangan.");
      }
    } catch { alert("Terjadi kesalahan sistem atau fitur ekspor data belum tersedia."); }
    finally { setIsExporting(false); }
  };

  const deleteAccount = async () => {
    if (deleteConfirmText !== "HAPUS AKUN SAYA") { alert("Teks konfirmasi tidak sesuai"); return; }
    try {
      setIsDeleting(true);
      const res = await fetch("/api/profile", { method: "DELETE" });
      const json = await res.json();
      if (json.success === false) { alert(json.message); setIsDeleting(false); }
      else router.replace("/login");
    } catch { alert("Terjadi kesalahan saat menghapus akun"); setIsDeleting(false); }
  };

  if (isLoading || !profile) {
    return <div className="flex justify-center items-center h-[calc(100vh-100px)]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" /></div>;
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Privasi & Data</h1>
        <p className="text-zinc-500 mt-1.5 text-sm sm:text-base">Kelola persetujuan AI, ekspor data Anda, atau hapus akun permanen.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        <PrivacySidebar profile={profile} />
        <div className="flex-1 w-full min-w-0 space-y-6">
          <AiConsentCard consentStatus={consentStatus} isConsentLoading={isConsentLoading} onToggle={toggleConsent} />
          <ExportDataCard isExporting={isExporting} onExport={exportData} />
          <DangerZoneCard showDeleteConfirm={showDeleteConfirm} deleteConfirmText={deleteConfirmText} isDeleting={isDeleting}
            onRequestDelete={() => setShowDeleteConfirm(true)} onConfirmDelete={deleteAccount}
            onCancelDelete={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
            onConfirmTextChange={setDeleteConfirmText} />
        </div>
      </div>
    </main>
  );
}
