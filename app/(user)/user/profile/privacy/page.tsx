"use client";

import { useEffect, useState } from "react";
import { getProfile, UserProfile } from "@/lib/api/profile-query";
import { useRouter } from "next/navigation";

import { PrivacySidebar } from "./_components/privacy-sidebar";
import { AiConsentCard } from "./_components/ai-consent-card";
import { ExportDataCard } from "./_components/export-data-card";
import { DangerZoneCard } from "./_components/danger-zone-card";

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
        const backendUrl = new URL(json.data.download_url);
        const proxyUrl = `/api/profile/exports/download${backendUrl.search}`;
        window.location.href = proxyUrl;
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

        <PrivacySidebar profile={profile} />

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0 space-y-6">

          <AiConsentCard
            consentStatus={consentStatus}
            isConsentLoading={isConsentLoading}
            onToggle={toggleConsent}
          />

          <ExportDataCard isExporting={isExporting} onExport={exportData} />

          <DangerZoneCard
            showDeleteConfirm={showDeleteConfirm}
            deleteConfirmText={deleteConfirmText}
            isDeleting={isDeleting}
            onRequestDelete={() => setShowDeleteConfirm(true)}
            onConfirmDelete={deleteAccount}
            onCancelDelete={() => {
              setShowDeleteConfirm(false);
              setDeleteConfirmText("");
            }}
            onConfirmTextChange={setDeleteConfirmText}
          />

        </div>
      </div>
    </main>
  );
}
