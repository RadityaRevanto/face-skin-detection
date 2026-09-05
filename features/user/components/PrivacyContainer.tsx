"use client";

import { useCallback, useEffect, useState } from "react";
import { getProfile, UserProfile } from "@/lib/api/profile-query";
import { useRouter } from "next/navigation";

import { aiChatService } from "@/features/ai-chat/services/aiChatService";
import { profileService } from "@/features/profile/services/profileService";
import { tokenStorage } from "@/lib/api";
import { getUserFriendlyErrorMessage } from "@/lib/api-errors";

import { PrivacySidebar } from "./PrivacySidebar";
import { AiConsentCard } from "./AiConsentCard";
import { ExportDataCard } from "./ExportDataCard";
import { AdminDangerZoneCard } from "./AdminDangerZoneCard";
import { DangerZoneCard } from "./DangerZoneCard";

type PrivacyContainerProps = {
  role: "user" | "doctor" | "admin";
  basePath: string;
};

export function PrivacyContainer({ role, basePath }: PrivacyContainerProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [consentStatus, setConsentStatus] = useState(false);
  const [isConsentLoading, setIsConsentLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Consent AI hanya relevan untuk user & doctor (admin tidak pakai AI chat).
  const needsConsent = role !== "admin";

  const fetchData = useCallback(async () => {
    try {
      const requests: Promise<unknown>[] = [getProfile()];
      if (needsConsent) {
        requests.push(aiChatService.getConsent());
      }
      const [resProfile, resConsent] = await Promise.all(requests);
      setProfile((resProfile as { data: UserProfile }).data);
      if (needsConsent) {
        const consent = resConsent as { accepted: boolean } | undefined;
        if (consent) setConsentStatus(consent.accepted);
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); setIsConsentLoading(false); }
  }, [needsConsent]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleConsent = async () => {
    try {
      setIsConsentLoading(true);
      const response = await aiChatService.updateConsent(!consentStatus);
      const accepted = (response?.data as { accepted: boolean } | undefined)?.accepted;
      if (typeof accepted === "boolean") setConsentStatus(accepted);
    } catch (err) { console.error(err); }
    finally { setIsConsentLoading(false); }
  };

  const exportData = async () => {
    try {
      setIsExporting(true);
      const response = await profileService.requestExport();
      const downloadUrl = (response?.data as { download_url?: string } | undefined)?.download_url;
      if (downloadUrl) {
        // Route download protected auth:sanctum (walau URL signed) — unduh via axios blob.
        await profileService.downloadExport(downloadUrl);
      } else {
        alert(
          ((response as { meta?: { message?: string } })?.meta?.message as string) ||
            "Fitur ekspor data sedang dalam pengembangan.",
        );
      }
    } catch (error) { alert(getUserFriendlyErrorMessage(error)); }
    finally { setIsExporting(false); }
  };

  const deleteAccount = async () => {
    if (deleteConfirmText !== "HAPUS AKUN SAYA") { alert("Teks konfirmasi tidak sesuai"); return; }
    try {
      setIsDeleting(true);
      await profileService.destroy();
      tokenStorage.clear();
      router.replace("/login");
    } catch (error) {
      alert(getUserFriendlyErrorMessage(error));
      setIsDeleting(false);
    }
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
        <PrivacySidebar basePath={basePath} activePage="privacy" />
        <div className="flex-1 w-full min-w-0 space-y-6">
          {needsConsent && (
            <AiConsentCard consentStatus={consentStatus} isConsentLoading={isConsentLoading} onToggle={toggleConsent} />
          )}
          <ExportDataCard isExporting={isExporting} onExport={exportData} />

          {role === "admin" ? (
            <AdminDangerZoneCard
              showDeleteConfirm={showDeleteConfirm}
              deleteConfirmText={deleteConfirmText}
              isDeleting={isDeleting}
              onRequestDelete={() => setShowDeleteConfirm(true)}
              onConfirmDelete={deleteAccount}
              onCancelDelete={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
              onConfirmTextChange={setDeleteConfirmText}
            />
          ) : (
            <DangerZoneCard
              role={role}
              showDeleteConfirm={showDeleteConfirm}
              deleteConfirmText={deleteConfirmText}
              isDeleting={isDeleting}
              onRequestDelete={() => setShowDeleteConfirm(true)}
              onConfirmDelete={deleteAccount}
              onCancelDelete={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
              onConfirmTextChange={setDeleteConfirmText}
            />
          )}
        </div>
      </div>
    </main>
  );
}
